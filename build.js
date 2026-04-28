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
    'locking-cable': {
        name: 'MARIGOLD-5 LOCKING CABLE',
        subtitle: 'A secure connection for USB-C devices',
        folder: 'docs/cables',
        docsOutputFile: 'docs-locking-cable.html',
        productTemplate: 'src/templates/locking_cable-template.html',
        productOutputFile: 'locking-cable.html'
    },
    'warranty': {
        name: 'HARDWARE WARRANTY',
        subtitle: 'Warranty Information for Hardware Products',
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
    <link rel="icon" type="image/webp" href="content/logos/favicon-docs.webp">
    <title>Documentation | LarkSpur Industries</title>
    <link rel="stylesheet" href="css/fonts.css?v=2">
    <link rel="stylesheet" href="css/style.css?v=2">
    <style>
        .page-header {
            padding: 2rem 0 1.5rem;
            border-bottom: 1px solid var(--border);
            margin-bottom: 1.5rem;
        }
        .page-header h1 {
            font-size: 1.65rem;
            font-weight: 700;
            color: #fff;
        }
        .doc-card {
            background: var(--card-bg);
            border: 1px solid var(--border);
            border-radius: var(--radius);
            padding: 1.25rem 1.5rem;
            margin-bottom: 0.85rem;
            text-decoration: none;
            display: flex;
            align-items: center;
            justify-content: space-between;
            gap: 1rem;
            transition: border-color 0.18s;
        }
        .doc-card:hover { border-color: var(--accent); }
        .doc-card-name {
            font-size: 1rem;
            font-weight: 700;
            color: #fff;
            margin-bottom: 0.2rem;
        }
        .doc-card-sub {
            font-size: 0.82rem;
            color: #555;
        }
        .doc-card-arrow {
            color: #333;
            font-size: 1rem;
            flex-shrink: 0;
            transition: color 0.18s;
        }
        .doc-card:hover .doc-card-arrow { color: var(--accent); }
    </style>
</head>
<body>
<div id="grain"></div>

<!-- NAV -->
<div class="site-nav-wrap">
    <nav class="site-nav">
        <a href="index.html">
            <img src="content/logos/larkspur-logo-large-grey.webp" alt="LarkSpur Industries" class="nav-logo">
        </a>
        <div class="nav-links">
            <a href="docs.html" class="nav-label">
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
                Docs
            </a>
            <a href="https://github.com/LarkSpur-Industries" target="_blank" rel="noopener" class="nav-label">
                <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z"/></svg>
                GitHub
            </a>
            <a href="mailto:larkspur.industries.official@gmail.com" class="nav-label">
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
                Contact
            </a>
        </div>
        <a href="shop.html" class="nav-cta">Shop</a>
    </nav>
</div>

<div class="container">

    <div class="page-header fade-in">
        <h1>Documentation</h1>
    </div>

    <div class="fade-in delay-1">
`;

    // Add product cards
    for (const [key, config] of Object.entries(PRODUCTS)) {
        listingHtml += `        <a href="${config.docsOutputFile}" class="doc-card">
            <div>
                <div class="doc-card-name">${config.name}</div>
                <div class="doc-card-sub">${config.subtitle}</div>
            </div>
            <span class="doc-card-arrow">→</span>
        </a>
`;
    }

    listingHtml += `    </div>

    <footer class="footer">
        <a href="https://github.com/LarkSpur-Industries" target="_blank" rel="noopener">GitHub</a>
        <a href="docs-warranty.html">Warranty</a>
        <a href="mailto:larkspur.industries.official@gmail.com">Contact</a>
        <span class="footer-copy">© 2026 Larkspur Industries</span>
    </footer>

</div>

<script>
    var navWrap = document.querySelector('.site-nav-wrap');
    var lastY = 0;
    window.addEventListener('scroll', function () {
        var y = window.scrollY;
        navWrap.style.transform = (y > lastY && y > 80) ? 'translateY(-120%)' : 'translateY(0)';
        navWrap.style.transition = 'transform 0.25s ease';
        lastY = y;
    }, { passive: true });
</script>
</body>
</html>`;

    writeFile('docs.html', listingHtml);
}

function generateShop() {
    const template = readFile('src/templates/shop.template.html');
    if (!template) {
        console.error('✗ Failed to load shop template');
        return;
    }
    let html = injectMetaTags(template, 'shop');
    writeFile('shop.html', html);
}


// ── UPDATE the build() function — add the two highlighted lines ───────────────

function build() {
    console.log('\n🔨 Building LarkSpur Industries Website...\n');

    console.log('📄 Building home page...');
    generateIndex();

    console.log('🛒 Building shop page...');   
    generateShop();                             

    console.log('\n📦 Building product pages and documentation...');
    for (const [key, config] of Object.entries(PRODUCTS)) {
        console.log(`\n  ${config.name}:`);
        generateProductPage(key, config);
        const docsHtml = generateDocsHtml(key, config);
        if (docsHtml) {
            writeFile(config.docsOutputFile, docsHtml);
        }
    }

    console.log('\n📚 Building docs listing page...');
    generateDocsListing();

    console.log('\n✅ Build complete!\n');
    console.log('Generated files:');
    console.log('  • index.html (homepage)');
    console.log('  • shop.html (shop page)');   
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
