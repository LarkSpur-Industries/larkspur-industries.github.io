// meta-config.js
// Central configuration for all page metadata

const baseUrl = 'https://larkspurindustries.com';

// currentLabel must match the recommendation in
// src/content/docs/marigold-5/specifications.md. The 7A figure is a validated
// ceiling measured under stated conditions, not the continuous rating, so it is
// carried separately rather than folded into the headline number.
const products = {
  marigold5: {
    price: '24.99',
    currency: 'USD',
    checkoutUrl: 'https://checkout.square.site/merchant/MLCT3G6R606D6/checkout/K4UYC22H5F7DH7DI7KRWP7BC',
    availability: 'in stock',
    currentLabel: '5–6A Continuous',
    currentDetailLabel: '5–6A continuous, 7A validated',
  },
};

// Social preview images are 1200x630 PNG. Keep both: 1.91:1 is what
// summary_large_image and Facebook crop to, and PNG is the one format every
// scraper handles (LinkedIn still does not reliably fetch WebP).
const OG_IMAGE_WIDTH = '1200';
const OG_IMAGE_HEIGHT = '630';

const siteMeta = {
  baseUrl,
  siteName: 'Larkspur Industries',
  author: 'Isaac Subudhi',
  location: 'Richmond, VA',
  themeColor: '#0a0a0a',
  defaultImage: `${baseUrl}/content/img/og-default.png`,
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
    <meta name="color-scheme" content="dark">
    <link rel="icon" type="image/webp" href="/content/logos/favicon.webp">
    <script src="/js/site.js" defer><\/script>

    <!-- Fonts: preconnect to the hosts that block first paint, then request the
         stylesheet directly so it loads in parallel with the site CSS. -->
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Ubuntu:wght@300;400;500;700&display=swap">`;

// Page-specific metadata
const pages = {
  'index': {
    title: 'Larkspur Industries | FRC Robotics Hardware',
    description: 'Larkspur Industries designs reliable, affordable hardware for FIRST robotics at reasonable prices. Creator of the Marigold-5 USB-C power module.',
    ogType: 'website',
    ogTitle: 'Larkspur Industries | FRC Robotics Hardware',
    ogDescription: 'Reliable hardware for FIRST Robotics teams. Creator of the Marigold-5 USB-C power module.',
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
          "description": "DC-DC power module for FRC co-processors. 6-18V input, regulated 5.1V output, 5-6A continuous.",
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
    ogType: 'website',
    ogTitle: 'Shop - Larkspur Industries',
    ogDescription: 'Reliable, affordable electronics for FIRST Robotics teams. Buy the Marigold-5 USB-C power module.',
    ogImage: siteMeta.defaultImage,
    canonicalUrl: `${baseUrl}/shop.html`,
    breadcrumbs: breadcrumb([
      { name: 'Home', path: '' },
      { name: 'Shop', path: 'shop.html' }
    ]),
  },

  'marigold-5': {
    title: 'Marigold-5 USB-C Power Module | Larkspur Industries',
    description: 'Marigold-5 USB-C power module for FRC robots. 6–18V input, regulated 5.1V output, and 5–6A continuous combined output.',
    ogType: 'product',
    ogTitle: 'Marigold-5 USB-C Power Module for FRC Robots',
    ogDescription: `Compact DC-DC power module with 1x high-current USB-C port. Powers co-processors and peripherals from your robot's 12V supply. ${products.marigold5.currentLabel}, $${products.marigold5.price}`,
    ogImage: siteMeta.defaultImage,
    canonicalUrl: `${baseUrl}/marigold-5.html`,
    productData: {
      price: products.marigold5.price,
      currency: 'USD',
      availability: products.marigold5.availability
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
      "description": "Compact DC-DC power module engineered for FIRST Robotics Competition. Provides a high-current USB-C port and an auxiliary output for co-processors and peripherals.",
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
          "name": "Output Current",
          "value": products.marigold5.currentDetailLabel
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
        "price": products.marigold5.price,
        "availability": "https://schema.org/InStock",
        "itemCondition": "https://schema.org/NewCondition",
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
    ogType: 'product',
    ogTitle: 'Marigold-5 Locking Cable',
    ogDescription: 'A screw-locking USB-C cable for Marigold-5, built for reliable robot wiring in high-vibration FRC environments.',
    ogImage: `${baseUrl}/content/img/og-locking-cable.png`,
    canonicalUrl: `${baseUrl}/locking-cable.html`,
    breadcrumbs: breadcrumb([
      { name: 'Home', path: '' },
      { name: 'Shop', path: 'shop.html' },
      { name: 'Marigold-5 Locking Cable', path: 'locking-cable.html' }
    ]),
  },

  '404': {
    title: 'Page Not Found | Larkspur Industries',
    description: 'The requested page could not be found.',
    robots: 'noindex, follow',
    ogType: 'website',
    ogTitle: 'Page Not Found | Larkspur Industries',
    ogDescription: 'The requested page could not be found.',
    ogImage: siteMeta.defaultImage,
    canonicalUrl: `${baseUrl}/404.html`,
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
    <meta name="author" content="${siteMeta.author}">
    <meta name="robots" content="${page.robots ?? 'index, follow'}">`;
  
  // Open Graph / Facebook
  metaTags += `
    
    <!-- Open Graph / Facebook -->
    <meta property="og:type" content="${page.ogType}">
    <meta property="og:url" content="${page.canonicalUrl}">
    <meta property="og:title" content="${page.ogTitle}">
    <meta property="og:description" content="${page.ogDescription}">
    <meta property="og:image" content="${page.ogImage}">
    <meta property="og:image:type" content="image/png">
    <meta property="og:image:width" content="${OG_IMAGE_WIDTH}">
    <meta property="og:image:height" content="${OG_IMAGE_HEIGHT}">
    <meta property="og:image:alt" content="${page.ogTitle}">
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
    <meta name="twitter:card" content="summary_large_image">
    <meta name="twitter:title" content="${page.ogTitle}">
    <meta name="twitter:description" content="${page.ogDescription}">
    <meta name="twitter:image" content="${page.ogImage}">
    <meta name="twitter:image:alt" content="${page.ogTitle}">`;
  
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
  products,
  siteMeta,
};
