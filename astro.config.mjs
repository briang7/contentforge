// @ts-check
import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import svelte from '@astrojs/svelte';
import mdx from '@astrojs/mdx';
import markdoc from '@astrojs/markdoc';
import sitemap from '@astrojs/sitemap';
import keystatic from '@keystatic/astro';
import tailwindcss from '@tailwindcss/vite';
import pagefind from 'astro-pagefind';
import node from '@astrojs/node';
import { transformerMetaHighlight } from '@shikijs/transformers';

// https://astro.build/config
export default defineConfig({
  site: 'https://contentforge.dev',
  output: 'static',
  adapter: node({ mode: 'standalone' }),
  integrations: [
    react({ include: ['**/react/*'] }),
    svelte(),
    mdx(),
    markdoc(),
    sitemap(),
    pagefind(),
    keystatic(),
  ],
  vite: {
    plugins: [tailwindcss()],
  },
  markdown: {
    shikiConfig: {
      theme: 'github-dark',
      transformers: [
        transformerMetaHighlight(),
      ],
    },
  },
});
