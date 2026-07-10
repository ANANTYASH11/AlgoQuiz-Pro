/**
 * TWO POINTER TECHNIQUE
 * 
 * Connection to Application:
 * - Detects duplicate or highly similar questions in the database by comparing
 *   sorted lists of keywords or tags. It advances pointers based on lexical value
 *   to determine the intersection score in O(A + B) time.
 * 
 * Time Complexity: O(A + B) where A and B are tag sizes.
 */
export function checkDuplicateTags(
  tagsA: string[],
  tagsB: string[]
): number {
  // Sort lexically
  const sortedA = [...tagsA].sort();
  const sortedB = [...tagsB].sort();

  let p1 = 0;
  let p2 = 0;
  let matchingCount = 0;

  while (p1 < sortedA.length && p2 < sortedB.length) {
    if (sortedA[p1] === sortedB[p2]) {
      matchingCount++;
      p1++;
      p2++;
    } else if (sortedA[p1] < sortedB[p2]) {
      p1++;
    } else {
      p2++;
    }
  }

  // Returns matching percentage relative to the smaller set
  const minLength = Math.min(sortedA.length, sortedB.length);
  if (minLength === 0) return 0;
  return (matchingCount / minLength) * 100;
}
