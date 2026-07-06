const fs = require('fs');
const path = require('path');

const ROOT = path.resolve('dist');
const REQUIRED = [
  'index.html',
  'shop.html',
  'marigold-5.html',
  'locking-cable.html',
  'docs/index.html',
  'docs/marigold-5/index.html',
  'docs/marigold-5/installation/index.html',
  'docs/marigold-5/troubleshooting/index.html',
  'docs/warranty/index.html',
  'docs/pagefind/pagefind.js',
  'sitemap.xml',
  'CNAME',
  'robots.txt',
];

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

function targetExists(url) {
  const pathname = url.split(/[?#]/, 1)[0];
  if (!pathname || pathname.startsWith('mailto:') || pathname.startsWith('tel:')) return true;
  if (/^(?:https?:)?\/\//.test(pathname) || pathname.startsWith('data:')) return true;

  const relative = pathname.startsWith('/') ? pathname.slice(1) : pathname;
  const target = path.join(ROOT, relative);
  return fs.existsSync(target) || fs.existsSync(path.join(target, 'index.html'));
}

for (const file of allFiles(ROOT).filter((file) => file.endsWith('.html'))) {
  const html = fs.readFileSync(file, 'utf8');
  const relative = path.relative(ROOT, file);

  if (/{{\s*[A-Z0-9_-]+\s*}}/.test(html)) failures.push(`Unresolved template marker in ${relative}`);

  for (const match of html.matchAll(/(?:href|src)=["']([^"']+)["']/g)) {
    if (!targetExists(match[1])) failures.push(`Broken local reference in ${relative}: ${match[1]}`);
  }

  if (relative.startsWith(`docs${path.sep}`) && relative !== path.join('docs', '404.html')) {
    const h1Count = (html.match(/<h1\b/g) || []).length;
    if (h1Count !== 1) failures.push(`Expected one H1 in ${relative}; found ${h1Count}`);
    if (!/<link rel="canonical" href="https:\/\/larkspurindustries\.com\/docs\//.test(html)) {
      failures.push(`Missing docs canonical URL in ${relative}`);
    }
  }
}

if (failures.length) {
  console.error(failures.map((failure) => `✗ ${failure}`).join('\n'));
  process.exit(1);
}

console.log(`✓ Verified ${allFiles(ROOT).length} generated files and local references.`);
