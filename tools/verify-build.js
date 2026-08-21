const fs = require('fs');
const path = require('path');

const ROOT = path.resolve('dist');
const REQUIRED = [
  'index.html',
  '404.html',
  'shop.html',
  'marigold-5.html',
  'locking-cable.html',
  'docs/index.html',
  'docs/marigold-5/index.html',
  'docs/marigold-5/installation/index.html',
  'docs/marigold-5/operation/index.html',
  'docs/marigold-5/specifications/index.html',
  'docs/marigold-5/downloads/index.html',
  'docs/marigold-5/support/index.html',
  'docs/marigold-5/troubleshooting/index.html',
  'docs/locking-cable/index.html',
  'docs/warranty/index.html',
  'docs/pagefind/pagefind.js',
  'sitemap.xml',
  'CNAME',
  'robots.txt',
  'js/site.js',
];

// Mirrors LEGACY_REDIRECTS in tools/build.js. These pages are meta-refresh
// stubs, so the landmark and heading rules below do not apply to them.
const LEGACY_REDIRECT_PAGES = new Set([
  'docs-marigold-5.html',
  'docs-locking-cable.html',
  'docs-warranty.html',
]);

const failures = [];

for (const file of REQUIRED) {
  if (!fs.existsSync(path.join(ROOT, file))) failures.push(`Missing required output: ${file}`);
}

function allFiles(directory) {
  return fs.readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const filePath = path.join(directory, entry.name);
    return entry.isDirectory() ? allFiles(filePath) : [filePath];
  });
}

function localTarget(url, sourceFile = '') {
  const pathname = url.split(/[?#]/, 1)[0];
  if (!pathname || pathname.startsWith('mailto:') || pathname.startsWith('tel:')) return null;
  if (pathname.startsWith('%23')) return null;
  if (/^(?:https?:)?\/\//.test(pathname) || pathname.startsWith('data:')) return null;

  const relative = pathname.startsWith('/')
    ? pathname.slice(1)
    : path.normalize(path.join(path.dirname(sourceFile), pathname));
  const target = path.join(ROOT, relative);
  if (fs.existsSync(target) && fs.statSync(target).isFile()) return target;
  const indexTarget = path.join(target, 'index.html');
  return fs.existsSync(indexTarget) ? indexTarget : target;
}

function targetExists(url, sourceFile = '') {
  const target = localTarget(url, sourceFile);
  return target === null || fs.existsSync(target);
}

function verifyFragment(url, sourceFile, sourceHtml) {
  const hashIndex = url.indexOf('#');
  if (hashIndex === -1 || !url.slice(hashIndex + 1)) return;
  if (/^(?:https?:)?\/\//.test(url)) return;

  const fragment = decodeURIComponent(url.slice(hashIndex + 1));
  const target = localTarget(url, sourceFile);
  const html = target && fs.existsSync(target) && target.endsWith('.html')
    ? fs.readFileSync(target, 'utf8')
    : sourceHtml;
  const escaped = fragment.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  if (!new RegExp(`\\bid=["']${escaped}["']`).test(html)) {
    failures.push(`Missing fragment target in ${sourceFile}: ${url}`);
  }
}

for (const file of allFiles(ROOT).filter((file) => file.endsWith('.html'))) {
  const html = fs.readFileSync(file, 'utf8');
  const relative = path.relative(ROOT, file);

  if (/{{\s*[A-Z0-9_-]+\s*}}/.test(html)) failures.push(`Unresolved template marker in ${relative}`);

  for (const match of html.matchAll(/(?:href|src)=["']([^"']+)["']/g)) {
    if (!targetExists(match[1], relative)) failures.push(`Broken local reference in ${relative}: ${match[1]}`);
    verifyFragment(match[1], relative, html);
  }

  for (const match of html.matchAll(/<script\b[^>]*type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/g)) {
    try {
      JSON.parse(match[1]);
    } catch (error) {
      failures.push(`Invalid JSON-LD in ${relative}: ${error.message}`);
    }
  }

  const ids = [...html.matchAll(/\bid=["']([^"']+)["']/g)].map((match) => match[1]);
  for (const id of new Set(ids)) {
    if (ids.filter((candidate) => candidate === id).length > 1) failures.push(`Duplicate id in ${relative}: ${id}`);
  }

  if (!LEGACY_REDIRECT_PAGES.has(relative) && relative !== path.join('docs', '404.html')) {
    const h1Count = (html.match(/<h1\b/g) || []).length;
    const mainCount = (html.match(/<main\b/g) || []).length;
    if (h1Count !== 1) failures.push(`Expected one H1 in ${relative}; found ${h1Count}`);
    if (mainCount !== 1) failures.push(`Expected one main landmark in ${relative}; found ${mainCount}`);
  }

  if (!relative.startsWith(`docs${path.sep}`)) {
    for (const match of html.matchAll(/<img\b([^>]*\bsrc=["'][^"']+["'][^>]*)>/g)) {
      if (!/\bwidth=["']/.test(match[1]) || !/\bheight=["']/.test(match[1])) {
        failures.push(`Image missing intrinsic dimensions in ${relative}: ${match[0].slice(0, 120)}`);
      }
    }
  }

  if (relative.startsWith(`docs${path.sep}`) && relative !== path.join('docs', '404.html')) {
    if (!/<link rel="canonical" href="https:\/\/larkspurindustries\.com\/docs\//.test(html)) {
      failures.push(`Missing docs canonical URL in ${relative}`);
    }
  }
}

for (const file of allFiles(ROOT).filter((file) => file.endsWith('.css'))) {
  const css = fs.readFileSync(file, 'utf8');
  const relative = path.relative(ROOT, file);
  for (const match of css.matchAll(/url\((['"]?)([^)'"\s]+)\1\)/g)) {
    if (!targetExists(match[2], relative)) failures.push(`Broken CSS asset reference in ${relative}: ${match[2]}`);
  }
}

for (const file of ['index.html', 'shop.html', 'marigold-5.html', 'locking-cable.html']) {
  const html = fs.readFileSync(path.join(ROOT, file), 'utf8');
  if (html.includes('larkspur.industries.official@gmail.com')) failures.push(`Stale Gmail contact in ${file}`);
  if (/<meta name="keywords"/.test(html)) failures.push(`Obsolete keywords metadata in ${file}`);
}

const sitemap = fs.readFileSync(path.join(ROOT, 'sitemap.xml'), 'utf8');
if (sitemap.includes('/404.html')) failures.push('Root 404 page must not appear in sitemap.xml');
if (/<(?:lastmod|priority)>/.test(sitemap)) failures.push('Sitemap contains synthetic lastmod or ignored priority values');

if (failures.length) {
  console.error(failures.map((failure) => `✗ ${failure}`).join('\n'));
  process.exit(1);
}

console.log(`✓ Verified ${allFiles(ROOT).length} generated files and local references.`);
