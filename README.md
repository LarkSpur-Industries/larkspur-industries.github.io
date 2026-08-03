# Larkspur Industries website

Two things are built into one `dist/` artifact:

- **The marketing site** — `larkspurindustries.com`, generated from the HTML
  templates in `site/pages/` by `tools/build.js`.
- **The product documentation** — everything under `/docs/`, generated from
  Markdown and MDX by Astro Starlight from `src/content/docs/`.

## Requirements

- Node.js 24
- npm

## Layout

```
site/          the marketing site — everything here is published
  pages/       HTML templates + shared nav/footer partials
  styles/      CSS
  scripts/     client-side JS
  assets/
    brand/     logos, favicons, social preview images, background art
    products/  product photography, PDFs, and 3D models
  page-meta.js titles, descriptions, OG tags, and schema.org data

src/           Astro / Starlight only
  content/docs/  documentation pages (Markdown + MDX)
  components/    Starlight component overrides
  styles/        documentation theme

masters/       source art that is never published (PNG masters, retired logos)
tools/         build, verification, clean, and preview scripts
public/        Astro static passthrough
```

The rule is one line: **`site/` ships, everything else does not.** Nothing
outside `site/` is ever copied into `dist/`, so a file's location tells you
whether it is public.

### Source paths vs. published URLs

`site/` is organised by what a file *is*. The published URLs are older than that
layout and must not change — the STEP model, the PDF drawing, and the product
images are linked externally and image-indexed. `PUBLISHED_DIRECTORIES` in
`tools/build.js` maps between the two:

| Source | Published as |
| --- | --- |
| `site/styles/` | `/css/` |
| `site/scripts/` | `/js/` |
| `site/assets/brand/logos/` | `/content/logos/` |
| `site/assets/brand/img/` | `/content/img/` |
| `site/assets/products/marigold-5/` | `/docs/marigold-5/` |
| `site/assets/products/locking-cable/img/` | `/docs/cables/img/` |

Change the map, not the asset paths, if a URL ever has to move — and add a
redirect when it does.

## Development

```bash
npm ci
npm run dev
```

The dev server serves the documentation at `http://localhost:4321/docs/` with
live reload. It does **not** serve the marketing pages; those come from
`tools/build.js`. Use the preview script below to see the whole site.

## Production build

```bash
npm run build   # build only
npm test        # build, then validate output, links, fragments, and JSON-LD
npm run clean   # remove dist/
```

`npm test` is what CI runs, so a broken local link or malformed JSON-LD fails
the deploy instead of shipping.

To build and serve the complete production site locally:

```bash
./tools/preview.sh          # http://127.0.0.1:4173
./tools/preview.sh 8080     # or pick a port
```

## Adding content

**A documentation page:** add a Markdown or MDX file under `src/content/docs/`,
then register it in the `sidebar` array in `astro.config.mjs` if it should
appear in global navigation.

**A marketing page:** add a template to `site/pages/`, add its metadata to
`pages` in `site/page-meta.js`, and register it in `tools/build.js`. Templates
use `{{PLACEHOLDER}}` substitution; an unresolved placeholder fails the build.

**A product image:** put the published copy in
`site/assets/products/<product>/img/` and the full-resolution master in
`masters/products/<product>/`.

## Deployment

`.github/workflows/deploy.yml` builds and publishes to GitHub Pages on every
push to `main`. The checkout uses `fetch-depth: 0` because Starlight reads each
documentation page's last-modified date from git history; a shallow clone would
stamp every page with the same date.
