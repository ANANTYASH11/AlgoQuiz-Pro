/**
 * MERGE SORT ALGORITHM (STABLE SORT)
 * 
 * Connection to Application:
 * - Sorts large leaderboard sheets (by department, college, or globally) based on scores and registration order.
 * - Being a stable sort, it keeps the relative ordering of users who have identical scores.
 * 
 * Time Complexity:
 * - O(N log N) in all cases
 */
export function mergeSortLeaderboard<T>(
  arr: T[],
  compare: (a: T, b: T) => number
): T[] {
  if (arr.length <= 1) {
    return arr;
  }

  const mid = Math.floor(arr.length / 2);
  const left = mergeSortLeaderboard(arr.slice(0, mid), compare);
  const right = mergeSortLeaderboard(arr.slice(mid), compare);

  return merge(left, right, compare);
}

function merge<T>(
  left: T[],
  right: T[],
  compare: (a: T, b: T) => number
): T[] {
  const result: T[] = [];
  let l = 0;
  let r = 0;

  while (l < left.length && r < right.length) {
    if (compare(left[l], right[r]) <= 0) {
      result.push(left[l]);
      l++;
    } else {
      result.push(right[r]);
      r++;
    }
  }

  // Push remaining elements
  while (l < left.length) {
    result.push(left[l]);
    l++;
  }
  while (r < right.length) {
    result.push(right[r]);
    r++;
  }

  return result;
}
