# ContentForge

A blazing-fast developer blog and documentation platform built with **Astro 5** island architecture. Static by default, interactive where needed — React and Svelte islands hydrate selectively while the rest ships as zero-JS HTML. All content covers **Claude Code CLI** tips, tutorials, and best practices.

**Live:** [contentforge-47a3d.web.app](https://contentforge-47a3d.web.app)

![Astro](https://img.shields.io/badge/Astro_5-FF5D01?logo=astro&logoColor=white)
![React](https://img.shields.io/badge/React_19-61DAFB?logo=react&logoColor=black)
![Svelte](https://img.shields.io/badge/Svelte_5-FF3E00?logo=svelte&logoColor=white)
![Tailwind](https://img.shields.io/badge/Tailwind_CSS_4-06B6D4?logo=tailwindcss&logoColor=white)
![Firebase](https://img.shields.io/badge/Firebase_Hosting-DD2C00?logo=firebase&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?logo=typescript&logoColor=white)

---

## Tech Stack

| Layer | Technology | Details |
|-------|-----------|---------|
| Framework | **Astro 5** | Island architecture, Content Layer API, `output: 'static'` |
| Islands | **React 19** + **Svelte 5** | Multi-framework partial hydration |
| Content | **MDX** + **Content Collections** | Zod-validated frontmatter, glob/file loaders |
| CMS | **Keystatic** | Git-based, file-driven admin UI at `/keystatic` |
| Search | **Pagefind** | Static search index, zero runtime cost |
| Styling | **Tailwind CSS 4** | `@tailwindcss/vite` plugin, dark-first theme |
| Syntax | **Shiki** (github-dark) | `@shikijs/transformers` for line highlighting |
| Comments | **Giscus** | GitHub Discussions-backed comment system |
| Hosting | **Firebase Hosting** | CDN-distributed static files, 1-year cache headers |
| CI/CD | **GitHub Actions** | Build + deploy on push to `main` |

---

## Features

### Blog (14 posts)

- MDX content with Zod-validated frontmatter (`content.config.ts`)
- Category taxonomy — getting-started, tips-and-tricks, best-practices, integrations, advanced, tutorials
- Tag archive pages with filtering
- Author profiles (YAML-based)
- Reading time estimation
- Auto-generated table of contents (sticky sidebar on XL screens)
- Series/collection grouping with ordered navigation
- Previous/next post navigation
- RSS feed (`/rss.xml`)
- Syntax highlighting with copy-to-clipboard

### Documentation (21 pages, 2 versions)

- Multi-version docs (v1, v2) with version-aware sidebar
- 5 sections: Getting Started, Core Concepts, Features, Integrations, Reference
- Nested sidebar navigation with section grouping
- Previous/next page navigation
- "Edit on GitHub" links
- Admonition blocks — tip, warning, danger, info
- Code tabs for multi-language examples
- Responsive mobile sidebar with toggle

### Interactive Islands (6)

| Island | Framework | Hydration | Description |
|--------|-----------|-----------|-------------|
| **SearchDialog** | React | `client:only` | Full-text search powered by Pagefind. `Ctrl+K` to open. |
| **CodePlayground** | React | `client:visible` | Live JavaScript editor (CodeMirror 6) with sandboxed iframe execution. |
| **ReadAloud** | React | `client:only` | Text-to-speech reader using Web Speech API. Play/pause/stop, skip by section, speed control (0.75x–2x), voice selector, paragraph highlighting, sticky player bar. `Alt+R` shortcut. |
| **Giscus** | React | `client:only` | GitHub Discussions comment threads on blog posts. |
| **ThemeToggle** | Svelte | `client:load` | Dark / light / system theme switcher with localStorage persistence. |
| **BenchmarkChart** | Svelte | `client:visible` | Chart.js performance benchmark visualization. |

### CMS (Keystatic)

- Git-based admin UI at `/keystatic` (dev mode only)
- Blog collection: title, description, dates, category, tags, author, series, draft, featured
- Docs collection: title, description, section, order, version, draft
- Authors singleton (YAML)
- No database required — edits modify files directly in the git repo

### Performance & SEO

- Static HTML with zero JavaScript by default
- Islands hydrate selectively via `client:*` directives
- Pagefind search loads on demand
- Sitemap generation (`@astrojs/sitemap`)
- Dynamic `robots.txt`
- OpenGraph and Twitter Card meta tags
- View transitions (Astro `ClientRouter`)
- 1-year immutable cache headers for JS, CSS, images, and fonts

### UI & Design

- Dark-first responsive design with slate/brand color palette
- Animated gradient hero with floating orbs and terminal decoration
- Card-glow hover effects with gradient borders
- Dot-pattern backgrounds and noise texture overlays
- Custom scrollbar styling
- Skip-to-content accessibility link
- Mobile hamburger menu with nav overlay

---

## Quick Start

### Prerequisites

- Node.js 20+

### Development

```bash
# Install dependencies
npm install

# Start dev server (includes Keystatic admin)
npm run dev
# → http://localhost:4321
# → http://localhost:4321/keystatic (CMS admin)
```

### Production Build

```bash
npm run build    # Generates static site + Pagefind index in dist/client/
npm run preview  # Preview production build
```

### Deploy

```bash
firebase deploy --only hosting
```

Or just push to `main` — GitHub Actions handles the rest.

---

## Project Structure

```
contentforge/
├── src/
│   ├── components/
│   │   ├── astro/                  # Static components (zero JS)
│   │   │   ├── Admonition.astro    # Tip/warning/danger/info blocks
│   │   │   ├── BlogCard.astro      # Post card with category pill
│   │   │   ├── CodeTabs.astro      # Multi-language code tabs
│   │   │   ├── DocSidebar.astro    # Versioned doc navigation
│   │   │   ├── Footer.astro        # Site footer with links
│   │   │   ├── Header.astro        # Sticky nav with search + GitHub
│   │   │   ├── Pagination.astro    # Page navigation
│   │   │   ├── SEO.astro           # OpenGraph / Twitter meta tags
│   │   │   └── TOC.astro           # Table of contents
│   │   ├── react/                  # React islands
│   │   │   ├── CodePlayground.tsx  # Live code editor + runner
│   │   │   ├── Giscus.tsx          # GitHub Discussions comments
│   │   │   ├── ReadAloud.tsx       # TTS reader with controls
│   │   │   └── SearchDialog.tsx    # Pagefind search modal
│   │   └── svelte/                 # Svelte islands
│   │       ├── BenchmarkChart.svelte
│   │       └── ThemeToggle.svelte
│   ├── content/
│   │   ├── blog/                   # 14 MDX blog posts
│   │   ├── docs/
│   │   │   ├── v1/                 # 3 legacy doc pages
│   │   │   └── v2/                 # 18 current doc pages
│   │   └── authors/authors.yaml    # Author profiles
│   ├── layouts/
│   │   ├── BaseLayout.astro        # HTML shell, fonts, ClientRouter
│   │   ├── BlogLayout.astro        # Post layout with TOC + series nav
│   │   └── DocLayout.astro         # Doc layout with sidebar + TOC
│   ├── pages/
│   │   ├── index.astro             # Homepage with hero + featured
│   │   ├── 404.astro               # Custom 404
│   │   ├── blog/
│   │   │   ├── index.astro         # Blog listing
│   │   │   ├── [...id].astro       # Individual post
│   │   │   ├── category/[category].astro
│   │   │   └── tag/[tag].astro
│   │   ├── docs/
│   │   │   └── [...id].astro       # Doc pages
│   │   ├── rss.xml.ts              # RSS feed
│   │   └── robots.txt.ts           # Dynamic robots.txt
│   ├── styles/global.css           # Tailwind + animations + prose + TTS styles
│   └── utils/
│       ├── reading-time.ts
│       └── seo.ts
├── astro.config.mjs                # Astro config (static + node adapter)
├── keystatic.config.ts             # CMS collection definitions
├── firebase.json                   # Hosting config (public: dist/client)
├── .firebaserc                     # Firebase project: contentforge-47a3d
├── .github/workflows/ci.yml        # CI/CD pipeline
├── svelte.config.js
├── tsconfig.json
└── package.json
```

---

## CI/CD

**Pipeline:** Push to `main` → GitHub Actions

1. **Build** — `npm ci` → `npm run build` → verify Pagefind index exists
2. **Deploy** — Upload `dist/client/` to Firebase Hosting via `FirebaseExtended/action-hosting-deploy`

| Secret | Purpose |
|--------|---------|
| `FIREBASE_SERVICE_ACCOUNT` | GCP service account JSON for Firebase deploy |

---

## Keyboard Shortcuts

| Shortcut | Action |
|----------|--------|
| `Ctrl+K` | Open search |
| `Esc` | Close search |
| `Alt+R` | Toggle TTS play/pause |
| `Alt+←` | TTS skip to previous section |
| `Alt+→` | TTS skip to next section |

---

## License

MIT
