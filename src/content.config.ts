import { defineCollection, reference } from 'astro:content';
import { glob, file } from 'astro/loaders';
import { z } from 'astro/zod';

const blog = defineCollection({
  loader: glob({ pattern: '**/*.mdx', base: './src/content/blog' }),
  schema: z.object({
    title: z.string().max(100),
    description: z.string().max(300),
    pubDate: z.coerce.date(),
    updatedDate: z.coerce.date().optional(),
    category: z.enum([
      'getting-started',
      'tips-and-tricks',
      'best-practices',
      'integrations',
      'advanced',
      'tutorials',
    ]),
    tags: z.array(z.string()).default([]),
    author: z.string().default('brian-garcia'),
    series: z
      .object({
        name: z.string(),
        order: z.number(),
      })
      .optional(),
    draft: z.boolean().default(false),
    featured: z.boolean().default(false),
  }),
});

const docs = defineCollection({
  loader: glob({ pattern: '**/*.mdx', base: './src/content/docs' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    section: z.string(),
    order: z.number(),
    version: z.enum(['v1', 'v2']).default('v2'),
    draft: z.boolean().default(false),
  }),
});

const authors = defineCollection({
  loader: file('./src/content/authors/authors.yaml'),
  schema: z.object({
    name: z.string(),
    bio: z.string(),
    twitter: z.string().optional(),
    github: z.string().optional(),
    website: z.string().url().optional(),
  }),
});

export const collections = { blog, docs, authors };
