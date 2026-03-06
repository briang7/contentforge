# ContentForge

A blazing-fast developer blog and documentation platform built with **Astro 5** island architecture. Features a Git-based CMS, full-text search, and perfect Lighthouse scores.

All content covers **Claude Code CLI** — features, best practices, tutorials, and deep dives.

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Astro 5 (island architecture, Content Layer API) |
| Interactive Islands | React + Svelte components |
| Content | MDX + Content Collections (Zod schemas) |
| CMS | Keystatic (Git-based, admin at /keystatic) |
| Search | Pagefind (static, zero JS cost) |
| Styling | Tailwind CSS 4 |
| Syntax Highlighting | Shiki (built-in) |
| Comments | Giscus (GitHub Discussions) |
| Deployment | Firebase Hosting (static) |

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
npm run build    # Generates static site + Pagefind index
npm run preview  # Preview at http://localhost:4321
```

## Project Structure

```
contentforge/
├── src/
│   ├── components/
│   │   ├── astro/           # Static components (zero JS)
│   │   ├── react/           # React islands (hydrated)
│   │   └── svelte/          # Svelte islands (hydrated)
│   ├── content/
│   │   ├── blog/            # MDX blog posts
│   │   ├── docs/            # MDX documentation (v1, v2)
│   │   └── authors/         # Author profiles
│   ├── layouts/             # Page layouts
│   ├── pages/               # File-based routing
│   ├── styles/              # Global CSS
│   └── content.config.ts    # Content collection schemas
├── public/                  # Static assets
├── keystatic.config.ts      # Keystatic CMS collections
├── astro.config.mjs
└── package.json
```

## Features

### Blog
- 8 seed posts about Claude Code CLI
- Category and tag taxonomy
- Reading time estimation
- Auto-generated table of contents
- Series/collection grouping
- RSS feed
- Syntax highlighting with Shiki

### Documentation
- Multi-version docs (v1, v2)
- Sidebar navigation with nested sections
- Admonition blocks (tip, warning, danger, info)
- Code tabs for multi-language examples
- "Edit on GitHub" links

### Interactive Islands
- **SearchDialog** (React, `client:idle`) — Cmd+K search with Pagefind
- **CodePlayground** (React, `client:visible`) — Live code editor with CodeMirror
- **ThemeToggle** (Svelte, `client:load`) — Dark/light/system theme
- **BenchmarkChart** (Svelte, `client:visible`) — Chart.js visualizations
- **Giscus** (React, `client:only`) — GitHub Discussions comments

### CMS
- Keystatic admin UI at `/keystatic`
- Edit blog posts and docs from the browser
- Content saved as files in your Git repo
- No database or Docker required

### Performance
- Static HTML with zero JavaScript by default
- Islands hydrate selectively via `client:*` directives
- Pagefind search loads on-demand
- Optimized images, font preloading
- Target: Lighthouse 100/100/100/100

## Ports

| Service | Port |
|---------|------|
| Astro Dev Server | 4321 |
| Keystatic Admin | 4321/keystatic |

## License

MIT
