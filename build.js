const fs = require('fs');
const path = require('path');
const { generateMetaTags, pages, siteMeta } = require('./meta-config.js');

const OUTPUT_DIR = path.resolve('dist');
const BUILD_DATE = new Date().toISOString().slice(0, 10);

const PRODUCT_PAGES = {
  'marigold-5': {
    template: 'src/templates/marigold-5.template.html',
    output: 'marigold-5.html',
  },
  'locking-cable': {
    template: 'src/templates/locking_cable-template.html',
    output: 'locking-cable.html',
  },
};

const LEGACY_REDIRECTS = {
  'docs.html': '/docs/',
  'docs-marigold-5.html': '/docs/marigold-5/',
  'docs-locking-cable.html': '/docs/locking-cable/',
  'docs-warranty.html': '/docs/warranty/',
};

const LEGACY_ANCHOR_REDIRECTS = {
  'docs-marigold-5.html': {
    '#overview': '/docs/marigold-5/',
    '#features': '/docs/marigold-5/#key-features',
    '#safety': '/docs/marigold-5/',
    '#installation': '/docs/marigold-5/installation/',
    '#voltage-explanation': '/docs/marigold-5/operation/#why-the-output-is-51v',
    '#led-indicator': '/docs/marigold-5/operation/#status-led',
    '#troubleshooting': '/docs/marigold-5/troubleshooting/',
    '#downloads': '/docs/marigold-5/downloads/',
    '#specifications': '/docs/marigold-5/specifications/',
    '#support': '/docs/marigold-5/support/',
  },
  'docs-warranty.html': {
    '#manufacturing': '/docs/warranty/#manufacturing-warranty',
    '#exclusions': '/docs/warranty/#frc-reality-exclusions',
    '#crash-replacement': '/docs/warranty/#crash-replacement-program',
    '#right-to-repair': '/docs/warranty/#right-to-repair',
    '#support': '/docs/warranty/#support-contacts',
  },
};

const STATIC_DIRECTORIES = ['css', 'content', 'docs'];
const STATIC_FILES = ['CNAME', 'robots.txt'];
const generatedFiles = [];

function readFile(filePath) {
  return fs.readFileSync(filePath, 'utf8');
}

function escapeHtml(value) {
  return String(value).replace(/[&<>"']/g, (character) => ({
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;',
  }[character]));
}

function renderTemplate(template, replacements) {
  return Object.entries(replacements).reduce(
    (html, [key, value]) => html.split(`{{${key}}}`).join(value),
    template
  );
}

function writeOutput(relativePath, content) {
  const outputPath = path.join(OUTPUT_DIR, relativePath);
  fs.mkdirSync(path.dirname(outputPath), { recursive: true });
  fs.writeFileSync(outputPath, content, 'utf8');
  generatedFiles.push(relativePath);
  console.log(`✓ Generated: ${relativePath}`);
}

function writeHtml(relativePath, html) {
  const unresolved = html.match(/{{\s*[A-Z0-9_-]+\s*}}/g);
  if (unresolved) {
    throw new Error(`${relativePath} has unresolved placeholders: ${[...new Set(unresolved)].join(', ')}`);
  }
  writeOutput(relativePath, html);
}

function buildTemplatePage(templatePath, outputPath, metaKey, replacements = {}) {
  if (!pages[metaKey]) throw new Error(`Missing meta config for page: ${metaKey}`);
  const template = readFile(templatePath);
  const html = renderTemplate(template, {
    META_TAGS: generateMetaTags(metaKey),
    ...replacements,
  });
  writeHtml(outputPath, html);
}

function copyStaticAssets() {
  for (const directory of STATIC_DIRECTORIES) {
    fs.cpSync(directory, path.join(OUTPUT_DIR, directory), { recursive: true, force: true });
  }
  for (const file of STATIC_FILES) {
    fs.copyFileSync(file, path.join(OUTPUT_DIR, file));
  }
}

function legacyRedirect(target, anchorRedirects = {}) {
  const safeTarget = escapeHtml(target);
  const absoluteTarget = new URL(target, siteMeta.baseUrl).href;
  return `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Documentation moved | Larkspur Industries</title>
  <meta name="robots" content="noindex, follow">
  <link rel="canonical" href="${escapeHtml(absoluteTarget)}">
  <meta http-equiv="refresh" content="0; url=${safeTarget}">
  <script>
    const anchors = ${JSON.stringify(anchorRedirects)};
    window.location.replace(anchors[window.location.hash] || ${JSON.stringify(target)});
  </script>
</head>
<body>
  <p>This documentation has moved to <a href="${safeTarget}">${safeTarget}</a>.</p>
</body>
</html>`;
}

function collectHtmlFiles(directory, prefix = '') {
  const files = [];
  for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
    const relativePath = path.posix.join(prefix, entry.name);
    const fullPath = path.join(directory, entry.name);
    if (entry.isDirectory()) files.push(...collectHtmlFiles(fullPath, relativePath));
    else if (entry.name.endsWith('.html')) files.push(relativePath);
  }
  return files;
}

function routeForHtml(filePath) {
  if (filePath === 'index.html') return '/';
  if (filePath.endsWith('/index.html')) return `/${filePath.slice(0, -'index.html'.length)}`;
  return `/${filePath}`;
}

function generateSitemap() {
  const excluded = new Set([...Object.keys(LEGACY_REDIRECTS), 'docs/404.html']);
  const pagesToIndex = collectHtmlFiles(OUTPUT_DIR)
    .filter((filePath) => !excluded.has(filePath))
    .sort((a, b) => routeForHtml(a).localeCompare(routeForHtml(b)));

  const entries = pagesToIndex.map((filePath) => {
    const route = routeForHtml(filePath);
    const priority = route === '/' ? '1.0' : route.startsWith('/docs/') ? '0.7' : '0.8';
    return `  <url>
    <loc>${siteMeta.baseUrl}${route}</loc>
    <lastmod>${BUILD_DATE}</lastmod>
    <priority>${priority}</priority>
  </url>`;
  }).join('\n');

  writeOutput('sitemap.xml', `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${entries}
</urlset>
`);
}

function build() {
  if (!fs.existsSync(path.join(OUTPUT_DIR, 'docs', 'index.html'))) {
    throw new Error('Starlight output is missing. Run the Astro build before build.js.');
  }

  generatedFiles.length = 0;
  console.log('\n🔨 Assembling Larkspur Industries website...\n');

  buildTemplatePage('src/templates/index.template.html', 'index.html', 'index');
  buildTemplatePage('src/templates/shop.template.html', 'shop.html', 'shop');

  for (const [productKey, config] of Object.entries(PRODUCT_PAGES)) {
    buildTemplatePage(config.template, config.output, productKey, { PRODUCT_KEY: productKey });
  }

  for (const [filePath, target] of Object.entries(LEGACY_REDIRECTS)) {
    writeHtml(filePath, legacyRedirect(target, LEGACY_ANCHOR_REDIRECTS[filePath]));
  }

  copyStaticAssets();
  generateSitemap();

  console.log(`\n✅ Build complete: ${generatedFiles.length} generated pages/files plus static assets.\n`);
}

try {
  build();
} catch (error) {
  console.error(`\n✗ Build failed: ${error.message}\n`);
  process.exitCode = 1;
}
