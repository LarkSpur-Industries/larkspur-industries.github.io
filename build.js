// build.js
const fs = require('fs');
const path = require('path');
const { generateMetaTags } = require('./meta-config.js');

const TEMPLATE_DIR = 'src/templates';
const OUTPUT_DIR = '.';

function buildPage(templateFile, outputFile, pageKey) {
  const templatePath = path.join(TEMPLATE_DIR, templateFile);
  const outputPath = path.join(OUTPUT_DIR, outputFile);
  
  console.log(`Building ${outputFile}...`);
  
  // Read template
  let template = fs.readFileSync(templatePath, 'utf8');
  
  // Generate and inject meta tags
  const metaTags = generateMetaTags(pageKey);
  template = template.replace('{{META_TAGS}}', metaTags);
  
  // Write output
  fs.writeFileSync(outputPath, template, 'utf8');
  console.log(`✓ Built ${outputFile}`);
}

function main() {
  console.log('Starting build process...\n');
  
  // Build each page
  buildPage('index.template.html', 'index.html', 'index');
  buildPage('marigold-5.template.html', 'marigold-5.html', 'marigold-5');
  
  console.log('\n✓ Build complete!');
}

main();
