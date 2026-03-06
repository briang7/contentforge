# ContentForge - Developer Blog & Documentation Platform

## Overview

Portfolio Project #5. Static-first developer blog and documentation site about Claude Code CLI, showcasing Astro 5 island architecture with React + Svelte islands, Keystatic CMS, and Pagefind search.

## Tech Stack

- **Framework:** Astro 5 (Content Layer API, island architecture)
- **Islands:** React (SearchDialog, CodePlayground, Giscus), Svelte (ThemeToggle, BenchmarkChart)
- **Content:** MDX content collections with Zod validation
- **CMS:** Keystatic (Git-based, admin at /keystatic)
- **Search:** Pagefind (static search, zero JS cost)
- **Styling:** Tailwind CSS 4 (@tailwindcss/vite)
- **Syntax Highlighting:** Shiki (built-in)
- **Comments:** Giscus (GitHub Discussions)

## Ports

| Service | Port |
|---------|------|
| Astro dev | 4321 |
| Keystatic admin | 4321/keystatic |

## Development Commands

```bash
npm run dev         # Start dev server on :4321 (includes Keystatic admin)
npm run build       # Build for production (generates Pagefind index)
npm run preview     # Preview production build
```

## Architecture Notes

- Content config: `src/content.config.ts` (Astro 5 location, NOT `src/content/config.ts`)
- Keystatic config: `keystatic.config.ts` (root, defines CMS collections)
- Routes use `[...id].astro` (Astro 5: `.id` not `.slug`)
- Rendering: `import { render } from 'astro:content'` then `await render(post)` (NOT `post.render()`)
- Page transitions: `<ClientRouter />` (NOT `<ViewTransitions />`)
- Tailwind 4: `@tailwindcss/vite` plugin (NOT `@astrojs/tailwind`)
- Static output with zero JS by default; islands hydrate via `client:*` directives
- Blog posts: `src/content/blog/*.mdx`
- Docs: `src/content/docs/v2/**/*.mdx`
- Authors: `src/content/authors/authors.yaml`
- Keystatic admin UI at `/keystatic` (server-rendered via @astrojs/node adapter)
