import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';

export default defineConfig({
  site: 'https://larkspurindustries.com',
  base: '/docs',
  outDir: './dist/docs',
  trailingSlash: 'always',
  integrations: [
    starlight({
      title: 'Larkspur Industries Documentation',
      description: 'Installation, wiring, troubleshooting, and reference documentation for Larkspur Industries hardware.',
      logo: {
        src: './content/logos/larkspur-logo-large-grey.webp',
        alt: 'Larkspur Industries',
        replacesTitle: true,
      },
      favicon: '/favicon-docs.png',
      customCss: ['./src/styles/docs.css'],
      components: {
        Head: './src/components/DocsHead.astro',
      },
      social: [
        {
          icon: 'github',
          label: 'Larkspur Industries on GitHub',
          href: 'https://github.com/Larkspur-Industries',
        },
      ],
      editLink: {
        baseUrl: 'https://github.com/Larkspur-Industries/larkspur-industries.github.io/edit/main/',
      },
      lastUpdated: true,
      sidebar: [
        {
          label: 'Larkspur Industries',
          items: [
            { label: 'Home', link: 'https://larkspurindustries.com/' },
            { label: 'Shop', link: 'https://larkspurindustries.com/shop.html' },
          ],
        },
        {
          label: 'Marigold-5',
          items: [
            { slug: 'marigold-5', label: 'Overview & Safety' },
            { slug: 'marigold-5/installation', label: 'Installation & Wiring' },
            { slug: 'marigold-5/operation', label: 'Operation' },
            { slug: 'marigold-5/troubleshooting', label: 'Troubleshooting' },
            { slug: 'marigold-5/specifications', label: 'Specifications' },
            { slug: 'marigold-5/downloads', label: 'Downloads' },
            { slug: 'marigold-5/support', label: 'Warranty & Support' },
          ],
        },
        {
          label: 'Accessories',
          items: [{ slug: 'locking-cable', label: 'Marigold-5 Locking Cable' }],
        },
        { slug: 'warranty', label: 'Hardware Warranty' },
      ],
      head: [
        { tag: 'meta', attrs: { name: 'theme-color', content: '#0a0a0a' } },
        { tag: 'meta', attrs: { name: 'author', content: 'Larkspur Industries' } },
        { tag: 'link', attrs: { rel: 'sitemap', href: '/sitemap.xml' } },
      ],
    }),
  ],
});
