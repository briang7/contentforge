import { config, fields, collection } from '@keystatic/core';

export default config({
  storage: {
    kind: 'local',
  },
  ui: {
    brand: { name: 'ContentForge' },
  },
  collections: {
    blog: collection({
      label: 'Blog Posts',
      slugField: 'title',
      path: 'src/content/blog/*',
      format: { contentField: 'content' },
      entryLayout: 'content',
      schema: {
        title: fields.slug({ name: { label: 'Title' } }),
        description: fields.text({ label: 'Description', multiline: true }),
        pubDate: fields.date({ label: 'Publish Date' }),
        updatedDate: fields.date({ label: 'Updated Date' }),
        category: fields.select({
          label: 'Category',
          options: [
            { label: 'Getting Started', value: 'getting-started' },
            { label: 'Tips & Tricks', value: 'tips-and-tricks' },
            { label: 'Best Practices', value: 'best-practices' },
            { label: 'Integrations', value: 'integrations' },
            { label: 'Advanced', value: 'advanced' },
            { label: 'Tutorials', value: 'tutorials' },
          ],
          defaultValue: 'tutorials',
        }),
        tags: fields.array(fields.text({ label: 'Tag' }), {
          label: 'Tags',
          itemLabel: (props) => props.value,
        }),
        author: fields.text({ label: 'Author', defaultValue: 'brian-garcia' }),
        series: fields.object(
          {
            name: fields.text({ label: 'Series Name' }),
            order: fields.integer({ label: 'Order in Series' }),
          },
          { label: 'Series' }
        ),
        draft: fields.checkbox({ label: 'Draft', defaultValue: false }),
        featured: fields.checkbox({ label: 'Featured', defaultValue: false }),
        content: fields.mdx({ label: 'Content' }),
      },
    }),
    docs: collection({
      label: 'Documentation',
      slugField: 'title',
      path: 'src/content/docs/**',
      format: { contentField: 'content' },
      entryLayout: 'content',
      schema: {
        title: fields.slug({ name: { label: 'Title' } }),
        description: fields.text({ label: 'Description', multiline: true }),
        section: fields.text({ label: 'Section' }),
        order: fields.integer({ label: 'Order', defaultValue: 0 }),
        version: fields.select({
          label: 'Version',
          options: [
            { label: 'v2', value: 'v2' },
            { label: 'v1', value: 'v1' },
          ],
          defaultValue: 'v2',
        }),
        draft: fields.checkbox({ label: 'Draft', defaultValue: false }),
        content: fields.mdx({ label: 'Content' }),
      },
    }),
  },
});
