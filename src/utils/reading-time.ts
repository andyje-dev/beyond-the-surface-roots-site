const WORDS_PER_MINUTE = 230;

export function estimateReadingTime(content: string): number {
  const text = content.replace(/<[^>]*>/g, "").replace(/\s+/g, " ").trim();
  const words = text.split(" ").length;
  return Math.max(1, Math.ceil(words / WORDS_PER_MINUTE));
}
