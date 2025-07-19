export function isUserInRollout(userId: string, percentage: number): boolean {
  if (percentage >= 100) return true;
  if (percentage <= 0) return false;

  // Simple deterministic hash using char codes
  let hash = 0;
  for (let i = 0; i < userId.length; i++) {
    hash += userId.charCodeAt(i);
  }

  const rolloutBucket = hash % 100;
  return rolloutBucket < percentage;
}
