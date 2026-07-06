// meta-config.js
// Central configuration for all page metadata

const baseUrl = 'https://larkspurindustries.com';

const siteMeta = {
  baseUrl,
  siteName: 'Larkspur Industries',
  author: 'Isaac Subudhi',
  location: 'Richmond, VA',
  themeColor: '#0a0a0a',
  defaultImage: `${baseUrl}/docs/marigold-5/img/Marigold-5_V1.0-Corner.png`,
  supportEmail: 'support@larkspurindustries.com',
  salesEmail: 'sales@larkspurindustries.com',
  engineeringEmail: 'engineering@larkspurindustries.com',
};

function breadcrumb(items) {
  return items.map((item) => ({
    name: item.name,
    url: item.path ? `${baseUrl}/${item.path}` : `${baseUrl}/`
  }));
}

function generateBreadcrumbStructuredData(items) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": items.map((item, index) => ({
      "@type": "ListItem",
      "position": index + 1,
      "name": item.name,
      "item": item.url
    }))
  };
}

// Shared meta tags that appear on every page
const commonMeta = `
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="theme-color" content="${siteMeta.themeColor}">
    <link rel="icon" type="image/webp" href="content/logos/favicon.webp">
    
    <!-- Resource Hints -->
    <link rel="preconnect" href="https://ajax.googleapis.com" crossorigin>
    <link rel="dns-prefetch" href="https://ajax.googleapis.com">`;

// Page-specific metadata
const pages = {
  'index': {
    title: 'Larkspur Industries | FRC Robotics Hardware | Fair Prices. Open Values.',
    description: 'Larkspur Industries designs reliable, affordable hardware for FIRST robotics at reasonable prices. Creator of the Marigold-5 USB-C power module.',
    keywords: 'FIRST robotics, robot power module, USB-C power, Marigold-5, robotics hardware, PhotonVision, FRC, competition robotics, affordable robotics',
    ogType: 'website',
    ogTitle: 'Larkspur Industries | FRC Robotics Hardware | Fair Prices. Open Values.',
    ogDescription: 'Hardware for FIRST robotics at reasonable prices. Creator of the Marigold-5 USB-C power module - 12V in, 1x USB-C 3A+ output, $24.99.',
    ogImage: siteMeta.defaultImage,
    canonicalUrl: `${baseUrl}/`,
    structuredData: [{
  "@context": "https://schema.org",
  "@type": "Organization",
  "name": "Larkspur Industries",
  "alternateName": "Larkspur Industries",
  "url": baseUrl,
  "logo": `${baseUrl}/content/logos/larkspur-logo-large-grey.webp`,
  "description": "Larkspur Industries is a small hardware design company based in Richmond, Virginia, founded by Isaac Subudhi. We design reliable, affordable electronics for FIRST Robotics Competition teams, including the Marigold-5 USB-C power module.",
  "slogan": "Reasonable Hardware. Fair Prices. Open Values.",
  "foundingDate": "2025",
  "foundingLocation": "Richmond, Virginia, USA",
  "areaServed": "US",
  "knowsAbout": ["FIRST Robotics Competition", "FRC electronics", "DC-DC power conversion", "CAN bus devices", "robotics hardware"],
  "address": {
    "@type": "PostalAddress",
    "addressLocality": "Richmond",
    "addressRegion": "VA",
    "addressCountry": "US"
  },
  "founder": {
    "@type": "Person",
    "name": "Isaac Subudhi"
  },
  "contactPoint": [
    {
      "@type": "ContactPoint",
      "email": siteMeta.supportEmail,
      "contactType": "customer support",
      "areaServed": "US",
      "availableLanguage": "en"
    },
    {
      "@type": "ContactPoint",
      "email": siteMeta.salesEmail,
      "contactType": "sales",
      "areaServed": "US",
      "availableLanguage": "en"
    },
    {
      "@type": "ContactPoint",
      "email": siteMeta.engineeringEmail,
      "contactType": "technical support",
      "areaServed": "US",
      "availableLanguage": "en"
    }
  ],
  "hasOfferCatalog": {
    "@type": "OfferCatalog",
    "name": "Larkspur Industries Products",
    "itemListElement": [
      {
        "@type": "Offer",
        "itemOffered": {
          "@type": "Product",
          "name": "Marigold-5 USB-C Power Module",
          "description": "DC-DC power module for FRC co-processors. 6-18V input, regulated 5.1V output, 10A total.",
          "url": `${baseUrl}/marigold-5.html`
        }
      }
    ]
  },
  "sameAs": [
    "https://github.com/Larkspur-Industries"
  ]
},
{
  "@context": "https://schema.org",
  "@type": "WebSite",
  "name": "Larkspur Industries",
  "url": baseUrl,
  "publisher": {
    "@type": "Organization",
    "name": "Larkspur Industries"
  }
}]
  },

  'shop': {
    title: 'Shop | Larkspur Industries',
    description: 'Browse and buy Larkspur Industries hardware for FIRST Robotics Competition. Reliable, affordable electronics including the Marigold-5 USB-C power module.',
    keywords: 'Larkspur Industries shop, buy Marigold-5, FRC hardware, FIRST Robotics electronics, USB-C power module',
    ogType: 'website',
    ogTitle: 'Shop - Larkspur Industries',
    ogDescription: 'Reliable, affordable electronics for FIRST Robotics teams. Buy the Marigold-5 USB-C power module.',
    ogImage: `${baseUrl}/docs/marigold-5/img/Marigold-5_V1.0-Corner.webp`,
    canonicalUrl: `${baseUrl}/shop.html`,
    breadcrumbs: breadcrumb([
      { name: 'Home', path: '' },
      { name: 'Shop', path: 'shop.html' }
    ]),
  },

  'marigold-5': {
    title: 'Marigold-5 USB-C Power Module | Larkspur Industries',
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
      availability: 'in stock'
    },
    breadcrumbs: breadcrumb([
      { name: 'Home', path: '' },
      { name: 'Shop', path: 'shop.html' },
      { name: 'Marigold-5', path: 'marigold-5.html' }
    ]),
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
      "category": "Robotics power module",
      "brand": {
        "@type": "Brand",
        "name": "Larkspur Industries"
      },
      "additionalProperty": [
        {
          "@type": "PropertyValue",
          "name": "Input Voltage",
          "value": "6V - 18V"
        },
        {
          "@type": "PropertyValue",
          "name": "Output Voltage",
          "value": "Regulated 5.1V"
        },
        {
          "@type": "PropertyValue",
          "name": "Max Current",
          "value": "10A Total"
        },
        {
          "@type": "PropertyValue",
          "name": "Mounting",
          "value": "4-40 & 6-32"
        }
      ],
      "offers": {
        "@type": "Offer",
        "url": `${baseUrl}/marigold-5.html`,
        "priceCurrency": "USD",
        "price": "24.99",
        "availability": "https://schema.org/InStock",
        "seller": {
          "@type": "Organization",
          "name": "Larkspur Industries"
        }
      }
    }
  },

  'locking-cable': {
    title: 'Marigold-5 Locking Cable | Larkspur Industries',
    description: 'A screw-locking USB-C cable for Marigold-5, built for reliable robot wiring in high-vibration FRC environments.',
    keywords: 'Marigold-5 locking cable, locking USB-C cable, FRC USB-C cable, robot wiring, Larkspur Industries',
    ogType: 'product',
    ogTitle: 'Marigold-5 Locking Cable',
    ogDescription: 'A screw-locking USB-C cable for Marigold-5, built for reliable robot wiring in high-vibration FRC environments.',
    ogImage: `${baseUrl}/docs/cables/img/locking-cable.png`,
    canonicalUrl: `${baseUrl}/locking-cable.html`,
    breadcrumbs: breadcrumb([
      { name: 'Home', path: '' },
      { name: 'Shop', path: 'shop.html' },
      { name: 'Marigold-5 Locking Cable', path: 'locking-cable.html' }
    ]),
  },

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
  const structuredData = [];
  if (Array.isArray(page.structuredData)) {
    structuredData.push(...page.structuredData);
  } else if (page.structuredData) {
    structuredData.push(page.structuredData);
  }

  if (page.breadcrumbs) {
    structuredData.push(generateBreadcrumbStructuredData(page.breadcrumbs));
  }

  if (structuredData.length > 0) {
    const structuredDataPayload = structuredData.length === 1 ? structuredData[0] : structuredData;
    metaTags += `
    
    <!-- Structured Data / Schema.org -->
    <script type="application/ld+json">
    ${JSON.stringify(structuredDataPayload, null, 2)}
    <\/script>`;
  }
  
  return metaTags;
}

module.exports = {
  generateMetaTags,
  pages,
  siteMeta
};
