# CLAUDE.md — BTSR: Beyond the Surface Roots

## Project Overview

A personal website — "beyond the surface roots" — discover at the intersection of technology, nature, design, and policy. The title is inspired by the live oak trees of New Orleans with their exposed surface roots; the site goes deeper. It's a living network where curated research, original essays, and interactive explorations collide across domains. The site makes connections visible that others aren't making.

The owner is a Senior Software Engineer doing R&D in generative AI and quantum computing, originally from New Orleans, with deep interests in regenerative agriculture, food systems, architecture, design, music, and education. The site should reflect someone who sees connections nobody else does — not by claiming expertise in every field, but by being the synthesizer who reads across domains and finds where they meet.

---

## Tech Stack

### Framework: Astro 6 + React Islands
- **Astro 6** as the core framework — content-focused, markdown/MDX-native, ships zero JS by default
- **React** islands for interactive components that need client-side hydration (theme toggle, exploration network graph, domain filtering)
- **Tailwind CSS v4** via Vite plugin (`@tailwindcss/vite`) — utility styling with CSS custom properties for design tokens
- **MDX** for all content — enables embedding React components inside articles
- **Astro Content Layer API** (`src/content.config.ts`) for typed, queryable content with Zod validation
- **TypeScript** throughout (strict mode)

### Key Libraries
- **Framer Motion** — for purposeful page transitions and scroll-triggered animations (React islands only)
- **D3.js** — force-directed network graph on /exploration
- **Shiki** — for code syntax highlighting in articles (Astro-native)

### Deployment
- **Vercel** (static) — auto-deploys from `main` branch
- **Domain**: `beyond-the-surface-roots.com`

### SEO & Analytics
- **@astrojs/sitemap** — auto-generates `sitemap-index.xml` at build time
- **Plausible Analytics** (`@plausible/tracker`) — privacy-friendly, cookie-free analytics
- **RSS feed** at `/rss.xml` via `@astrojs/rss`
- **`robots.txt`** — allows all crawlers, points to sitemap
- **Google Search Console** — verified and sitemap submitted
- **PWA manifest** (`public/site.webmanifest`) with branded icons

### Important CSS Note
Tailwind v4 utility classes combined with CSS custom properties (e.g., `class="mx-auto" style="max-width: var(--max-width-site)"`) do not work reliably — the centering/max-width fails silently. **Always use inline styles for layout containers**: `style="max-width: 1400px; margin: 0 auto; padding: ..."`. Use Tailwind utilities only for properties that don't depend on CSS custom properties.

---

## Branding

### Site Name: BTSR
- Stands for "beyond the surface roots"
- Displayed as `btsr` in lowercase — `bt` in `--text-primary` color, `sr` in `--accent-primary` (green)
- This mirrors the hero heading where "beyond the" is in primary text color and "surface roots" is in accent green

### Logo
- "Subterranean Cartography" — a detailed root network illustration with branching tendrils
- Two theme variants: `public/subterranean-cartography-dark.png` (light roots on dark bg) and `public/subterranean-cartography-light.png` (dark roots on light bg)
- Displayed in Nav.astro as `<img>` elements, toggled via CSS based on `data-theme`
- Also used as favicon with `prefers-color-scheme` media queries

---

## Design System

### Philosophy: "Beyond the Surface"

The central design metaphor is **roots and connections** — things that exist beneath the surface, connecting what appears separate above ground. Visually this means organic forms rendered with precision. The aesthetic is **organic + technical fusion**: nature textures meet clean geometry. Subtle generative SVG patterns, thin lines, emergence from minimalism.

Dark mode is **underground** — root networks, soil, bioluminescence.
Light mode is **the surface** — warm earth, sun-bleached clay, green shoots emerging.

Both modes feel like the same ecosystem in different light, never like different sites.

### Animation Philosophy: Adaptive
- **Default state**: Quiet. Let content breathe. Minimal motion.
- **Curation pages**: Subtle hover effects on cards. No distracting animation.
- **Exploration section**: Rich and immersive. Generative backgrounds, animated diagrams, particle systems, WebGL — whatever the exploration demands.
- **Reduced motion**: Always respect `prefers-reduced-motion`. Every animation wrapped in media query.

---

## Color System

### Foundation Layer — The Soil (backgrounds)

#### Dark Mode (underground)
| Token | Hex | Usage |
|-------|-----|-------|
| `--bg-void` | `#0C0F0A` | Page background |
| `--bg-deep` | `#141A12` | Nav, footer, code blocks |
| `--bg-surface` | `#1A2118` | Card backgrounds |
| `--bg-card` | `#232B20` | Elevated cards, hover states |
| `--bg-elevated` | `#2E3829` | Active states, tooltips |

#### Light Mode (sun-warmed earth)
| Token | Hex | Usage |
|-------|-----|-------|
| `--bg-void` | `#F6F3EC` | Page background |
| `--bg-deep` | `#EEEAE0` | Nav, footer, code blocks |
| `--bg-surface` | `#E4E0D4` | Card backgrounds |
| `--bg-card` | `#D8D4C6` | Elevated cards, hover states |
| `--bg-elevated` | `#C8C4B4` | Active states, tooltips |

**Key principle**: No pure whites or pure blacks anywhere. Every background carries warmth.

### Text Layer
| Token | Dark | Light | Usage |
|-------|------|-------|-------|
| `--text-primary` | `#E8E4D9` | `#1A1F17` | Headings, emphasis |
| `--text-secondary` | `#B8B4A6` | `#4A4A3E` | Body text |
| `--text-muted` | `#7A7868` | `#7A7868` | Metadata, captions |
| `--text-ghost` | `#4A4A3E` | `#B8B4A6` | Borders, subtle text |

### Accent & Domain Colors

Primary accent: Dark `#6EE7A0` / Light `#1D7A42` — used for links, nav, CTA, logo "sr" text.

Domain colors defined in `src/config/domains.ts`:
| Domain | Dark | Light |
|--------|------|-------|
| `quantum` | `#F0B060` | `#9A6820` |
| `agriculture` | `#7CCBA0` | `#2D7A4A` |
| `climate` | `#6AADD8` | `#2A6A90` |
| `design` | `#C490E0` | `#6A3A90` |
| `architecture` | `#E0A070` | `#8A5A30` |
| `iot` | `#60D0D0` | `#1A7A7A` |
| `culture` | `#D4A0D0` | `#8A4A80` |
| `human-rights` | `#E07070` | `#9A2E2E` |
| `policy` | `#E0C060` | `#8A7A20` |
| `education` | `#A0C060` | `#5A7A20` |

---

## Typography

### Font Family: IBM Plex (unified family)
- **Headings**: IBM Plex Mono 500 — establishes technical identity
- **Body text**: IBM Plex Serif 400 — warm and readable for long-form
- **UI elements**: IBM Plex Sans 500 — clean and functional
- **Tags/metadata**: IBM Plex Mono 400 at small sizes
- Never use font weights above 500

---

## Site Architecture

### Pages & Routes

```
/                       Landing page (hero, wave pattern, featured + recent cards)
/curation               All content — research briefs and essays in a 3-column grid
/curation/[slug]        Individual article page (MDX content, sources for briefs)
/exploration            Network graph visualization with domain filtering
/exploration/[slug]     Individual exploration (planned)
/about                  Site mission and author bio
/rss.xml                RSS feed
/404                    Custom 404 page
```

### Navigation

**Primary nav** (sticky):
- Logo: branching network SVG + "btsr" (bt in text-primary, sr in accent)
- Home | Curation | Exploration | About
- Theme toggle (sun/moon) on the right
- Mobile: hamburger menu

**Footer** (minimal):
- "btsr" text treatment + year
- LinkedIn | GitHub | Contact

---

## Content Model

### Curation (`src/content/curation/*.mdx`)
Unified collection for both curated research briefs and original essays. Research briefs include `sources`; essays omit them.

**Frontmatter:**
```yaml
title: string
date: date
domains: string[]      # 1+ required
description: string
sources:               # Optional — included for research briefs
  - title: string
    authors: string
    url: string
    journal: string    # Optional
    year: number
stage: seed | growing | harvest   # Default: seed
connections: string[]
featured: boolean
```

### Explorations (`src/content/exploration/*.mdx`) — planned
Interactive pieces — simulations, data visualizations, tools.

### Domain Registry (`src/config/domains.ts`)
Adding a new topic = adding one object to the `domains` array. Cards, tags, and colors inherit automatically.

---

## Component Architecture

```
src/
├── components/
│   ├── layout/
│   │   ├── Nav.astro              # Sticky nav with logo SVG, links, hamburger menu, theme toggle
│   │   ├── Footer.astro           # Footer with LinkedIn, GitHub, Contact links
│   │   └── ThemeToggle.tsx        # React island — dark/light toggle
│   ├── content/
│   │   ├── ContentCard.astro      # Compact card (accent bar, title, description, tags, metadata)
│   │   ├── ContentGrid.astro      # Responsive grid (1/2/3 columns)
│   │   ├── FilterableCardGrid.tsx # React island — card grid with domain filter buttons
│   │   ├── DomainTag.astro        # Single domain pill
│   │   ├── DomainTags.astro       # Row of domain pills
│   │   ├── IntersectionBar.astro  # Gradient accent bar for multi-domain cards
│   │   └── StageIndicator.astro   # Content stage indicator
│   └── exploration/
│       └── NetworkGraph.tsx       # React island — D3 force-directed graph with domain filtering
├── config/
│   ├── domains.ts                 # Domain registry (colors, labels, descriptions)
│   └── site.ts                    # Site metadata, nav structure
├── content/
│   ├── curation/                  # MDX research briefs and essays
│   └── exploration/               # MDX exploration content (planned)
├── content.config.ts              # Astro Content Layer schemas (Zod)
├── layouts/
│   └── BaseLayout.astro           # HTML shell, fonts, global CSS, theme init script
├── pages/
│   ├── index.astro                # Landing page
│   ├── about.astro                # Site mission and author bio
│   ├── 404.astro                  # Custom 404 page
│   ├── rss.xml.ts                 # RSS feed generation
│   ├── curation/
│   │   ├── index.astro            # Filterable content grid
│   │   └── [slug].astro           # Individual article with prose styles
│   └── exploration/
│       └── index.astro            # Network graph visualization
├── styles/
│   ├── global.css                 # Tailwind import, @theme config, fonts, base styles
│   └── tokens.css                 # CSS custom properties (colors, spacing, type scale)
└── utils/
    ├── domains.ts                 # Domain color resolution helpers
    └── reading-time.ts            # Reading time estimation
```

---

## Card Component

Compact card with:
- Intersection bar (solid or gradient based on domain count)
- Title (mono, ~0.95rem), description (serif, ~0.875rem, clamped to 2 lines)
- Domain tag pills
- Footer: type · reading time · date
- Hover: translateY(-2px), border highlight

Displayed in a 3-column grid on desktop, 2 on tablet, 1 on mobile.

---

## Landing Page

1. **Hero**: "beyond the *surface roots*" — bt in text-primary, sr in accent green. Subtext: "Discover at the intersection of technology, nature, design, and policy." Generous spacing.
2. **CTA button**: "Explore →" links to /exploration.
3. **Wave pattern**: Three intertwining SVG bezier curves (green accent, quantum amber, climate blue) at 30% opacity, 180px tall.
4. **Featured**: Cards in 3-column grid from content with `featured: true`.
5. **Recent**: Remaining content in 3-column grid, reverse-chronological.

---

## Article Page (`/curation/[slug]`)

- Back link to /curation
- Title (mono, responsive clamp), domain tags, type/reading time/date
- Sources panel (research briefs only) — bordered card with linked citations
- MDX body with prose styles: serif text, 1.8 line-height, 680px max-width
- Styled headings, code blocks, lists, blockquotes

---

## Responsive Behavior

- **Desktop (1024px+)**: 3-column card grids, exploration network graph
- **Tablet (640-1023px)**: 2-column grids
- **Mobile (< 640px)**: Single-column, hamburger nav

### Max Widths
- Site container: 1400px
- Article body text: 680px
- Side padding: 2.5rem

---

## Theme Toggle

- Respects `prefers-color-scheme` on first visit
- Persists choice in localStorage
- Inline script in `<head>` sets `data-theme` before paint (no flash)
- All CSS custom properties switch via `[data-theme="dark"]` and `[data-theme="light"]` selectors
- Smooth 200ms transition on background-color and color

---

## Voice & Tone Guidelines

- **Research briefs**: Accessible but rigorous. "A very well-read friend explaining what they just found."
- **Essays**: Personal, analytical. "Thinking out loud with conviction."
- **Site copy**: Confident, slightly poetic, concise. Avoid buzzwords. Never say "synergy" or "leverage."
