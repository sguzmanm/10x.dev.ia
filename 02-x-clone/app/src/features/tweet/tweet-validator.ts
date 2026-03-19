const MAX_TWEET_LENGTH = 280;

export function validateTweetText(text: string): { valid: boolean; reason?: string } {
  const trimmed = text.trim();

  if (trimmed.length === 0) {
    return { valid: false, reason: "Tweet text cannot be empty" };
  }

  if (trimmed.length > MAX_TWEET_LENGTH) {
    return { valid: false, reason: "Tweet text exceeds 280 characters" };
  }

  return { valid: true };
}
