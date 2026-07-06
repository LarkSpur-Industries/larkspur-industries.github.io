const fs = require('fs');
const path = require('path');
const { marked } = require('marked');

// Import meta configuration
const { generateMetaTags, pages, siteMeta } = require('./meta-config.js');

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

const DOCS_TEMPLATE = 'src/templates/docs-generic.template.html';
const BUILD_DATE = new Date().toISOString().slice(0, 10);
const generatedFiles = [];

const SITEMAP_ORDER = [
    'index.html',
    'shop.html',
    'marigold-5.html',
    'locking-cable.html',
    'docs.html',
    'docs-marigold-5.html',
    'docs-locking-cable.html',
    'docs-warranty.html'
];

const SITEMAP_CONFIG = {
    'index.html': { changefreq: 'monthly', priority: '1.0' },
    'shop.html': { changefreq: 'monthly', priority: '0.9' },
    'marigold-5.html': { changefreq: 'monthly', priority: '0.9' },
    'locking-cable.html': { changefreq: 'monthly', priority: '0.6' },
    'docs.html': { changefreq: 'monthly', priority: '0.7' },
    'docs-marigold-5.html': { changefreq: 'monthly', priority: '0.7' },
    'docs-locking-cable.html': { changefreq: 'monthly', priority: '0.6' },
    'docs-warranty.html': { changefreq: 'yearly', priority: '0.4' }
};

const SITEMAP_DEFAULT = { changefreq: 'monthly', priority: '0.5' };

// Utility: Read file with error handling
function readFile(filePath) {
    try {
        return fs.readFileSync(filePath, 'utf-8');
    } catch (err) {
        throw new Error(`Unable to read ${filePath}: ${err.message}`);
    }
}

// Utility: Write file with error handling
function writeFile(filePath, content) {
    try {
        fs.writeFileSync(filePath, content, 'utf-8');
        generatedFiles.push(filePath);
        console.log(`✓ Generated: ${filePath}`);
    } catch (err) {
        throw new Error(`Unable to write ${filePath}: ${err.message}`);
    }
}

function writeHtmlFile(filePath, html) {
    assertNoUnresolvedPlaceholders(html, filePath);
    writeFile(filePath, html);
}

function escapeHtml(value) {
    return String(value).replace(/[&<>"']/g, (char) => ({
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#39;'
    }[char]));
}

function renderTemplate(template, replacements) {
    let html = template;
    for (const [placeholder, value] of Object.entries(replacements)) {
        html = html.split(`{{${placeholder}}}`).join(value);
    }
    return html;
}

function assertNoUnresolvedPlaceholders(html, outputFile) {
    const matches = html.match(/{{\s*[A-Z0-9_-]+\s*}}/g);
    if (matches) {
        const unique = [...new Set(matches)];
        throw new Error(`${outputFile} has unresolved template placeholders: ${unique.join(', ')}`);
    }
}

function requireMetaConfig(pageKey) {
    if (!pages[pageKey]) {
        throw new Error(`Missing meta config for page key: ${pageKey}`);
    }
}

function validateBuildConfig() {
    ['index', 'shop', 'docs'].forEach(requireMetaConfig);

    for (const [key, config] of Object.entries(PRODUCTS)) {
        if (!config.name || !config.subtitle || !config.folder || !config.docsOutputFile) {
            throw new Error(`Incomplete product config for ${key}`);
        }
        requireMetaConfig(`docs-${key}`);

        if (config.productTemplate || config.productOutputFile) {
            if (!config.productTemplate || !config.productOutputFile) {
                throw new Error(`Product page config for ${key} must include both template and output file`);
            }
            requireMetaConfig(key);
        }
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
        const targetAttr = target ? ` target="${escapeHtml(target)}"` : '';
        const relAttr = target === '_blank' ? ' rel="noopener noreferrer"' : '';
        return `<a href="${escapeHtml(fullUrl)}" class="md-button"${targetAttr}${relAttr}>${escapeHtml(text)}</a>`;
    });
}

function slugifyHeading(title) {
    return title.toLowerCase().replace(/[^\w]+/g, '-').replace(/^-+|-+$/g, '');
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
        const anchor = match[2] || slugifyHeading(title);
        
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
    return headings.map((item) => {
        const style = item.special ? ' style="margin-top: 1rem; color: var(--gold);"' : '';
        return `                <a href="#${escapeHtml(item.anchor)}"${style}>${escapeHtml(item.label)}</a>`;
    }).join('\n');
}

// Inject meta tags into HTML
function injectMetaTags(html, pageKey) {
    requireMetaConfig(pageKey);
    const metaTags = generateMetaTags(pageKey);
    return html.replace(/{{META_TAGS}}/g, metaTags);
}

// Generate documentation HTML for a product
function generateDocsHtml(productKey, config) {
    const markdownPath = path.join(config.folder, 'docs.md');
    let markdown = readFile(markdownPath);

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
    const template = readFile(DOCS_TEMPLATE);

    // Replace template placeholders
    let html = renderTemplate(template, {
        PRODUCT_NAME: escapeHtml(config.name),
        PRODUCT_SUBTITLE: escapeHtml(config.subtitle),
        SIDEBAR_CONTENT: sidebarHtml,
        MAIN_CONTENT: contentHtml,
        PRODUCT_KEY: escapeHtml(productKey)
    });

    html = injectMetaTags(html, `docs-${productKey}`);

    return html;
}

// Generate product page from template (separate from docs)
function generateProductPage(productKey, config) {
    if (!config.productTemplate || !config.productOutputFile) {
        return; // No product page for this item
    }

    console.log(`  Processing product page: ${productKey}`);

    const template = readFile(config.productTemplate);

    // Replace template variables
    let html = renderTemplate(template, {
        PRODUCT_KEY: escapeHtml(productKey)
    });
    
    // Inject meta tags using productKey (e.g., 'marigold-5')
    html = injectMetaTags(html, productKey);
    
    writeHtmlFile(config.productOutputFile, html);
}

// Generate index.html from template
function generateIndex() {
    const template = readFile('src/templates/index.template.html');

    // Inject meta tags for home page (use 'index' as page key)
    let html = injectMetaTags(template, 'index');

    writeHtmlFile('index.html', html);
}
// Generate docs listing page
function generateDocsListing() {
    let listingHtml = `<!DOCTYPE html>
<html lang="en">
<head>
    {{META_TAGS}}
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
            <img src="content/logos/larkspur-logo-large-grey.webp" alt="Larkspur Industries" class="nav-logo">
        </a>
        <div class="nav-links">
            <a href="docs.html" class="nav-label">
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
                Docs
            </a>
            <a href="https://github.com/Larkspur-Industries" target="_blank" rel="noopener" class="nav-label">
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
        listingHtml += `        <a href="${escapeHtml(config.docsOutputFile)}" class="doc-card">
            <div>
                <div class="doc-card-name">${escapeHtml(config.name)}</div>
                <div class="doc-card-sub">${escapeHtml(config.subtitle)}</div>
            </div>
            <span class="doc-card-arrow">→</span>
        </a>
`;
    }

    listingHtml += `    </div>

    <footer class="footer">
        <a href="https://github.com/Larkspur-Industries" target="_blank" rel="noopener">GitHub</a>
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

    listingHtml = injectMetaTags(listingHtml, 'docs');
    writeHtmlFile('docs.html', listingHtml);
}

function generateShop() {
    const template = readFile('src/templates/shop.template.html');
    let html = injectMetaTags(template, 'shop');
    writeHtmlFile('shop.html', html);
}

function pageUrlForFile(filePath) {
    const baseUrl = siteMeta.baseUrl || 'https://larkspurindustries.com';
    return filePath === 'index.html' ? `${baseUrl}/` : `${baseUrl}/${filePath}`;
}

function generateSitemap(files) {
    const htmlFiles = [...new Set(files.filter((filePath) => filePath.endsWith('.html')))];
    const orderedFiles = [
        ...SITEMAP_ORDER.filter((filePath) => htmlFiles.includes(filePath)),
        ...htmlFiles.filter((filePath) => !SITEMAP_ORDER.includes(filePath)).sort()
    ];

    const urlEntries = orderedFiles.map((filePath) => {
        const config = SITEMAP_CONFIG[filePath] || SITEMAP_DEFAULT;
        return `  <url>
    <loc>${pageUrlForFile(filePath)}</loc>
    <lastmod>${BUILD_DATE}</lastmod>
    <changefreq>${config.changefreq}</changefreq>
    <priority>${config.priority}</priority>
  </url>`;
    }).join('\n');

    const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urlEntries}
</urlset>
`;

    writeFile('sitemap.xml', sitemap);
}


function build() {
    generatedFiles.length = 0;
    console.log('\n🔨 Building Larkspur Industries Website...\n');
    validateBuildConfig();

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

    console.log('\n🗺️  Building sitemap...');
    generateSitemap(generatedFiles);

    console.log('\n✅ Build complete!\n');
    console.log('Generated files:');
    for (const filePath of generatedFiles) {
        console.log(`  • ${filePath}`);
    }
    console.log('');
}

// Run build
try {
    build();
} catch (err) {
    console.error(`\n✗ Build failed: ${err.message}\n`);
    process.exitCode = 1;
}
