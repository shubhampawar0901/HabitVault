/**
 * Utility function for merging class names
 * @param classes - Class names to merge
 * @returns Merged class names string
 */
export function cn(...classes: (string | undefined | null | false)[]): string {
  return classes.filter(Boolean).join(' ');
}
