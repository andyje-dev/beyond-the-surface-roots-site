# btsr — beyond the surface roots

Discover at the intersection of technology, nature, design, and policy.

A personal site built with [Astro 6](https://astro.build), React islands, and Tailwind CSS v4. Content lives in MDX, rendered statically, deployed on Vercel.

## Getting Started

```bash
npm install
npm run dev       # Start dev server at localhost:4321
npm run build     # Production build to dist/
npm run preview   # Preview production build locally
```

## Tech Stack

- **Astro 6** — static site framework with MDX support
- **React** — interactive islands (theme toggle, network graph, filterable grids)
- **Tailwind CSS v4** — utility styling via Vite plugin
- **D3.js** — force-directed network graph on /exploration
- **Plausible** — privacy-friendly analytics (no cookies)

## Project Structure

```
src/
├── components/       # Astro + React components
├── config/           # Domain registry, site metadata
├── content/
│   ├── curation/     # MDX research briefs and essays
│   └── exploration/  # MDX interactive explorations (planned)
├── layouts/          # BaseLayout with theme, fonts, meta
├── pages/            # Routes: /, /curation, /exploration, /about, /404, /rss.xml
├── styles/           # Global CSS, design tokens
└── utils/            # Domain helpers, reading time
```

## Deployment

Deployed on **Vercel** at [beyond-the-surface-roots.com](https://beyond-the-surface-roots.com). Pushes to `main` trigger automatic deploys.
