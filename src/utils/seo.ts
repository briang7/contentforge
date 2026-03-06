interface ArticleJsonLd {
  title: string;
  description: string;
  url: string;
  datePublished: string;
  dateModified?: string;
  authorName: string;
  image?: string;
}

export function generateArticleJsonLd(article: ArticleJsonLd): string {
  return JSON.stringify({
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: article.title,
    description: article.description,
    url: article.url,
    datePublished: article.datePublished,
    dateModified: article.dateModified || article.datePublished,
    author: {
      '@type': 'Person',
      name: article.authorName,
    },
    image: article.image,
    publisher: {
      '@type': 'Organization',
      name: 'ContentForge',
    },
  });
}

export function generateWebsiteJsonLd(siteUrl: string): string {
  return JSON.stringify({
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'ContentForge',
    description: 'Developer blog and documentation for Claude Code CLI',
    url: siteUrl,
  });
}
