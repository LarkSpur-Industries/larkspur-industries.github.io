# Larkspur Industries Website

> **Reasonable Products and Prices at Open Values**

Official website for Larkspur Industries, a small hardware design company building hardware for FIRST robotics teams.

## Live Site

🌐 [larkspurindustries.com](https://larkspurindustries.com)

## Products

- **Marigold-5** — A compact DC-DC power module for FRC robots with a regulated 5.1V USB-C output and an auxiliary port. In stock at $24.99. Orders ship at the end of each week.
- **Locking USB-C Cable** — $7.99 add-on with a Marigold-5 purchase.

## Tech Stack

- Static HTML/CSS/JS for the company pages
- Astro Starlight for documentation and search
- [Google Model Viewer](https://modelviewer.dev/) for 3D product previews
- Hosted on GitHub Pages

## Structure

```
├── site/
│   ├── pages/          # HTML templates and shared navigation/footer
│   ├── styles/         # Marketing site styles
│   ├── scripts/        # Browser JavaScript
│   ├── assets/         # Published images, PDFs, models, and forms
│   └── page-meta.js    # Product prices, checkout URL, and metadata
├── src/
│   ├── content/docs/   # Documentation Markdown and MDX
│   ├── components/     # Documentation component overrides
│   └── styles/         # Documentation styles
├── masters/            # Source artwork, not published
├── tools/              # Build, verification, and preview scripts
├── public/             # Documentation static files
├── astro.config.mjs    # Documentation settings and sidebar
├── dist/               # Generated website, not tracked
├── robots.txt
└── CNAME
```

## Development

Requires Node.js 24 and npm.

```bash
npm ci
npm run dev            # Documentation at http://localhost:4321/docs/
npm test               # Build and check output, links, and structured data
./tools/preview.sh     # Full site at http://127.0.0.1:4173
```

Edit company pages in `site/pages/` and documentation in `src/content/docs/`.
`npm run build` generates the complete site in `dist/`. Pushes to `main` build,
verify, and deploy it to GitHub Pages.

## Contact

- **Email:** support@larkspurindustries.com
- **GitHub:** [github.com/Larkspur-Industries](https://github.com/Larkspur-Industries)

## License

© 2026 Larkspur Industries. All rights reserved.
