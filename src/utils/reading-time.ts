export function getReadingTime(content: string | undefined): string {
  if (!content) return '1 min read';
  const wordsPerMinute = 200;
  const words = content.split(/\s+/).filter(Boolean).length;
  const minutes = Math.max(1, Math.ceil(words / wordsPerMinute));
  return `${minutes} min read`;
}
