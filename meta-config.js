// meta-config.js
// Central configuration for all page metadata

const baseUrl = 'https://larkspurindustries.com';

const siteMeta = {
  siteName: 'LarkSpur Industries',
  author: 'Isaac Subudhi',
  location: 'Richmond, VA',
  themeColor: '#0a0a0a',
  defaultImage: `${baseUrl}/docs/marigold-5/img/Marigold-5_V1.0A-Corner.png`,
};

// Shared meta tags that appear on every page
const commonMeta = `
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="theme-color" content="${siteMeta.themeColor}">
    <link rel="icon" type="image/svg+xml" href="data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text y='.9em' font-size='90'>❀</text></svg>">
    
    <!-- Resource Hints -->
    <link rel="preconnect" href="https://ajax.googleapis.com" crossorigin>
    <link rel="dns-prefetch" href="https://ajax.googleapis.com">`;

// Page-specific metadata
const pages = {
  'index': {
    title: 'LarkSpur Industries | Reasonable Hardware. Fair Prices. Open Values.',
    description: 'LarkSpur Industries designs reliable, affordable hardware for FIRST robotics at reasonable prices. Creator of the Marigold-5 USB-C power module.',
    keywords: 'FIRST robotics, robot power module, USB-C power, Marigold-5, robotics hardware, PhotonVision, FRC, competition robotics, affordable robotics',
    ogType: 'website',
    ogTitle: 'LarkSpur Industries | Reasonable Hardware. Fair Prices. Open Values.',
    ogDescription: 'Hardware for FIRST robotics at reasonable prices. Creator of the Marigold-5 USB-C power module - 12V in, 1x USB-C 3A+ output, $24.99.',
    ogImage: siteMeta.defaultImage,
    canonicalUrl: `${baseUrl}/`,
    structuredData: {
      "@context": "https://schema.org",
      "@type": "Organization",
      "name": "LarkSpur Industries",
      "url": baseUrl,
      "logo": siteMeta.defaultImage,
      "description": "Reasonable Hardware. Fair Prices. Open Values. For FIRST robotics",
      "slogan": "Reasonable Hardware. Fair Prices. Open Values.",
      "address": {
        "@type": "PostalAddress",
        "addressRegion": "VA",
        "addressCountry": "US"
      },
      "founder": {
        "@type": "Person",
        "name": "Isaac Subudhi"
      },
      "sameAs": [
        "https://github.com/LarkSpur-Industries"
      ]
    }
  },
  
  'marigold-5': {
    title: 'Marigold-5 USB-C Power Module | LarkSpur Industries',
    description: 'Marigold-5: 1-port USB-C power module for FRC robots. 12V input, 1x USB-C 3A+ output, $24.99',
    keywords: 'Marigold-5, FRC power module, USB-C robot power, FIRST Robotics power, 12V to 5V converter, robot USB-C, competition robotics, coprocessor power',
    ogType: 'product',
    ogTitle: 'Marigold-5 USB-C Power Module for FRC Robots',
    ogDescription: 'Compact DC-DC power module with 1x high-current USB-C port. Powers co-processors, and peripherals from your robot\'s 12V supply. 10A total, $24.99',
    ogImage: `${baseUrl}/docs/marigold-5/img/Marigold-5_V1.0-Corner.webp`,
    canonicalUrl: `${baseUrl}/marigold-5.html`,
    productData: {
      price: '24.99',
      currency: 'USD',
      availability: 'out of stock'
    },
    structuredData: {
      "@context": "https://schema.org/",
      "@type": "Product",
      "name": "Marigold-5 USB-C Power Module",
      "image": [
        `${baseUrl}/docs/marigold-5/img/Marigold-5_V1.0-Corner.webp`,
        `${baseUrl}/docs/marigold-5/img/Marigold-5_V1.0-Top.webp`,
        `${baseUrl}/docs/marigold-5/img/Marigold-5_V1.0-Corner-USB.webp`
      ],
      "description": "Compact DC-DC power module engineered for FIRST Robotics Competition. Provides one high-current USB-C port to power co-processors, and peripherals from robot's 12V supply.",
      "sku": "MARIGOLD-5-V1.0",
      "mpn": "MARIGOLD-5",
      "brand": {
        "@type": "Brand",
        "name": "LarkSpur Industries"
      },
      "offers": {
        "@type": "Offer",
        "url": `${baseUrl}/marigold-5.html`,
        "priceCurrency": "USD",
        "price": "24.99",
        "availability": "https://schema.org/OutOfStock",
        "seller": {
          "@type": "Organization",
          "name": "LarkSpur Industries"
        }
      }
    }
  }
};

// Function to generate full meta tags for a page
function generateMetaTags(pageKey) {
  const page = pages[pageKey];
  if (!page) {
    throw new Error(`Page config not found: ${pageKey}`);
  }
  
  let metaTags = commonMeta;
  
  // Primary Meta Tags
  metaTags += `
    
    <!-- Primary Meta Tags -->
    <title>${page.title}</title>
    <meta name="title" content="${page.title}">
    <meta name="description" content="${page.description}">
    <meta name="keywords" content="${page.keywords}">
    <meta name="author" content="${siteMeta.author}">
    <meta name="robots" content="index, follow">`;
  
  // Open Graph / Facebook
  metaTags += `
    
    <!-- Open Graph / Facebook -->
    <meta property="og:type" content="${page.ogType}">
    <meta property="og:url" content="${page.canonicalUrl}">
    <meta property="og:title" content="${page.ogTitle}">
    <meta property="og:description" content="${page.ogDescription}">
    <meta property="og:image" content="${page.ogImage}">
    <meta property="og:image:width" content="1200">
    <meta property="og:image:height" content="630">
    <meta property="og:site_name" content="${siteMeta.siteName}">`;
  
  // Product-specific OG tags
  if (page.productData) {
    metaTags += `
    <meta property="product:price:amount" content="${page.productData.price}">
    <meta property="product:price:currency" content="${page.productData.currency}">
    <meta property="product:availability" content="${page.productData.availability}">`;
  }
  
  // Twitter
  metaTags += `
    
    <!-- Twitter -->
    <meta property="twitter:card" content="summary_large_image">
    <meta property="twitter:url" content="${page.canonicalUrl}">
    <meta property="twitter:title" content="${page.ogTitle}">
    <meta property="twitter:description" content="${page.ogDescription}">
    <meta property="twitter:image" content="${page.ogImage}">`;
  
  // Canonical URL
  metaTags += `
    
    <!-- Canonical URL -->
    <link rel="canonical" href="${page.canonicalUrl}">`;
  
  // Structured Data
  if (page.structuredData) {
    metaTags += `
    
    <!-- Structured Data / Schema.org -->
    <script type="application/ld+json">
    ${JSON.stringify(page.structuredData, null, 2)}
    <\/script>`;
  }
  
  return metaTags;
}

module.exports = {
  generateMetaTags,
  pages,
  siteMeta
};
