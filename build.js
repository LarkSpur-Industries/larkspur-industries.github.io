const fs = require('fs');
const path = require('path');
const { marked } = require('marked');

// Import meta configuration
const { generateMetaTags, pages } = require('./meta-config.js');

// Product configuration
const PRODUCTS = {
    'marigold-5': {
        name: 'MARIGOLD-5',
        subtitle: 'DC-DC USB-C Power Module',
        folder: 'docs/marigold-5',
        docsOutputFile: 'docs-marigold-5.html',
        productTemplate: 'src/templates/marigold-5.template.html',
        productOutputFile: 'marigold-5.html'
    },
    'warranty': {
        name: 'HARDWARE WARRANTY',
        subtitle: '',
        folder: 'docs/warranty',
        docsOutputFile: 'docs-warranty.html',
        productTemplate: null,
        productOutputFile: null
    }
};

// Utility: Read file with error handling
function readFile(filePath) {
    try {
        return fs.readFileSync(filePath, 'utf-8');
    } catch (err) {
        console.error(`Error reading ${filePath}:`, err.message);
        return null;
    }
}

// Utility: Write file with error handling
function writeFile(filePath, content) {
    try {
        fs.writeFileSync(filePath, content, 'utf-8');
        console.log(`✓ Generated: ${filePath}`);
    } catch (err) {
        console.error(`Error writing ${filePath}:`, err.message);
    }
}

// Process custom button syntax: BUTTON("text", "url", "target")
function processButtons(markdown, productFolder) {
    const buttonRegex = /BUTTON\("([^"]+)",\s*"([^"]+)"(?:,\s*"([^"]+)")?\)/g;
    return markdown.replace(buttonRegex, (match, text, url, target) => {
        // Make relative URLs absolute from the product folder
        let fullUrl = url;
        if (!url.startsWith('http') && !url.startsWith('/')) {
            fullUrl = `${productFolder}/${url}`;
        }
        const targetAttr = target ? ` target="${target}"` : '';
        return `<a href="${fullUrl}" class="md-button"${targetAttr}>${text}</a>`;
    });
}

// Remove {#id} syntax and convert to proper HTML id attributes
function processHeadingIds(html) {
    const headingRegex = /(<h[1-6][^>]*>)(.*?)\s*\{#([a-z0-9-]+)\}\s*(<\/h[1-6]>)/gi;
    return html.replace(headingRegex, (match, openTag, text, id, closeTag) => {
        const tagWithId = openTag.replace('>', ` id="${id}">`);
        return `${tagWithId}${text}${closeTag}`;
    });
}

// Fix relative image paths
function fixImagePaths(html, productFolder) {
    return html.replace(/src="(?!http|\/)/g, `src="${productFolder}/`);
}

// Extract H2 headings for sidebar navigation
function extractHeadings(markdown) {
    const headings = [];
    const h2Regex = /^##\s+([^{#\n]+)(?:\s*\{#([a-z0-9-]+)\})?/gm;
    let match;
    
    while ((match = h2Regex.exec(markdown)) !== null) {
        const title = match[1].trim();
        const anchor = match[2] || title.toLowerCase().replace(/[^\w]+/g, '-');
        
        headings.push({
            label: title,
            anchor: anchor,
            special: /download|resource/i.test(title)
        });
    }
    
    return headings;
}

// Generate sidebar HTML
function generateSidebarHtml(headings) {
    return headings.map((item, index) => {
        const style = item.special ? ' style="margin-top: 1rem; color: var(--gold);"' : '';
        return `                <a href="#${item.anchor}"${style}>${item.label}</a>`;
    }).join('\n');
}

// Inject meta tags into HTML
function injectMetaTags(html, pageKey) {
    // Check if meta config exists for this page
    if (!pages[pageKey]) {
        console.warn(`  ⚠ No meta config found for: ${pageKey}`);
        // Remove placeholder if no meta tags available
        return html.replace(/{{META_TAGS}}/g, '');
    }
    
    const metaTags = generateMetaTags(pageKey);
    return html.replace(/{{META_TAGS}}/g, metaTags);
}

// Generate documentation HTML for a product
function generateDocsHtml(productKey, config) {
    const markdownPath = path.join(config.folder, 'docs.md');
    let markdown = readFile(markdownPath);
    
    if (!markdown) {
        console.error(`✗ Failed to load markdown for ${productKey}`);
        return null;
    }
    
    console.log(`  Processing docs: ${productKey}`);
    
    // Extract headings for sidebar
    const headings = extractHeadings(markdown);
    const sidebarHtml = generateSidebarHtml(headings);
    
    // Process custom button syntax
    markdown = processButtons(markdown, config.folder);
    
    // Parse markdown to HTML
    let contentHtml = marked.parse(markdown);
    
    // Process heading IDs
    contentHtml = processHeadingIds(contentHtml);
    
    // Fix relative image paths
    contentHtml = fixImagePaths(contentHtml, config.folder);
    
    // Always use generic docs template for documentation
    const template = readFile('src/templates/docs-generic.template.html');
    
    if (!template) {
        console.error(`✗ No docs template found`);
        return null;
    }
    
    // Replace template placeholders
    let html = template
        .replace(/{{PRODUCT_NAME}}/g, config.name)
        .replace(/{{PRODUCT_SUBTITLE}}/g, config.subtitle)
        .replace(/{{SIDEBAR_CONTENT}}/g, sidebarHtml)
        .replace(/{{MAIN_CONTENT}}/g, contentHtml)
        .replace(/{{PRODUCT_KEY}}/g, productKey);
    
    // Try to inject meta tags (will warn if not found, which is OK for docs)
    html = injectMetaTags(html, `docs-${productKey}`);
    
    return html;
}

// Generate product page from template (separate from docs)
function generateProductPage(productKey, config) {
    if (!config.productTemplate || !config.productOutputFile) {
        return; // No product page for this item
    }
    
    if (!fs.existsSync(config.productTemplate)) {
        console.error(`✗ Product template not found: ${config.productTemplate}`);
        return;
    }
    
    console.log(`  Processing product page: ${productKey}`);
    
    const template = readFile(config.productTemplate);
    if (!template) {
        console.error(`✗ Failed to load product template for ${productKey}`);
        return;
    }
    
    // Replace template variables
    let html = template.replace(/{{PRODUCT_KEY}}/g, productKey);
    
    // Inject meta tags using productKey (e.g., 'marigold-5')
    html = injectMetaTags(html, productKey);
    
    writeFile(config.productOutputFile, html);
}

// Generate index.html from template
function generateIndex() {
    const template = readFile('src/templates/index.template.html');
    if (!template) {
        console.error('✗ Failed to load index template');
        return;
    }
    
    // Inject meta tags for home page (use 'index' as page key)
    let html = injectMetaTags(template, 'index');
    
    writeFile('index.html', html);
}

// Generate docs listing page
function generateDocsListing() {
    let listingHtml = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="theme-color" content="#0a0a0a">
    <link rel="icon" type="image/svg+xml" href="data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text y='.9em' font-size='90'>❀</text></svg>">
    <title>Documentation | LarkSpur Industries</title>
    <link rel="stylesheet" href="css/fonts.css">
    <link rel="stylesheet" href="css/style.css">
</head>
<body style="align-items: center; justify-content: center; min-height: 100vh;">
    <div class="container" style="max-width: 600px;">
        <div style="margin-bottom: 1rem; font-size: 0.8rem;">
            <a href="index.html" class="link"><- HOME</a>
        </div>
        
        <div class="header">
            <div>
                <span class="flower">❀</span> <span>DOCUMENTATION</span>
            </div>
        </div>
        
        <div style="margin-top: 2rem;">
`;

    // Add product cards
    for (const [key, config] of Object.entries(PRODUCTS)) {
        listingHtml += `
            <div style="background: var(--card-bg); border: 1px solid var(--border); padding: 1.5rem; margin-bottom: 1.5rem;">
                <h3 style="color: var(--highlight); margin-top: 0; margin-bottom: 0.5rem; font-size: 1.3rem;">${config.name}</h3>
                <p style="color: #ccc; margin-bottom: 1rem; font-size: 0.9rem;">${config.subtitle}</p>
                <a href="${config.docsOutputFile}" class="btn">View Documentation</a>
            </div>
`;
    }

    listingHtml += `
        </div>
        
        <div class="footer">
            <span>© 2025 LARKSPUR INDUSTRIES</span>
        </div>
    </div>
</body>
</html>`;

    writeFile('docs.html', listingHtml);
}

// Main build function
function build() {
    console.log('\n🔨 Building LarkSpur Industries Website...\n');
    
    // Generate index page
    console.log('📄 Building home page...');
    generateIndex();
    
    // Generate product pages and documentation
    console.log('\n📦 Building product pages and documentation...');
    for (const [key, config] of Object.entries(PRODUCTS)) {
        console.log(`\n  ${config.name}:`);
        
        // Generate product page (if it has one)
        generateProductPage(key, config);
        
        // Generate documentation page
        const docsHtml = generateDocsHtml(key, config);
        if (docsHtml) {
            writeFile(config.docsOutputFile, docsHtml);
        }
    }
    
    // Generate docs listing page
    console.log('\n📚 Building docs listing page...');
    generateDocsListing();
    
    console.log('\n✅ Build complete!\n');
    console.log('Generated files:');
    console.log('  • index.html (homepage)');
    console.log('  • docs.html (documentation listing)');
    for (const [key, config] of Object.entries(PRODUCTS)) {
        if (config.productOutputFile) {
            console.log(`  • ${config.productOutputFile} (product page)`);
        }
        console.log(`  • ${config.docsOutputFile} (documentation)`);
    }
    console.log('');
}

// Run build
build();
