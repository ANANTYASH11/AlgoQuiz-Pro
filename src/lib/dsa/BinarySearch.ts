/**
 * BINARY SEARCH ALGORITHM
 * 
 * Connection to Application:
 * - Used to locate questions by their unique integer ID inside sorted arrays.
 * - Allows fast, logarithmic lookups when navigating list indexes.
 * 
 * Time Complexity: O(log N)
 */
export function binarySearchQuestion<T extends { id: number }>(
  arr: T[],
  targetId: number
): T | undefined {
  let left = 0;
  let right = arr.length - 1;

  while (left <= right) {
    const mid = Math.floor((left + right) / 2);
    if (arr[mid].id === targetId) {
      return arr[mid];
    } else if (arr[mid].id < targetId) {
      left = mid + 1;
    } else {
      right = mid - 1;
    }
  }
  return undefined;
}
