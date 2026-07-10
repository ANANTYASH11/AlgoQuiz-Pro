/**
 * QUICK SORT ALGORITHM (IN-PLACE SORT)
 * 
 * Connection to Application:
 * - Sorts scores dynamically on the Admin Reporting Dashboard when exporting reports.
 * - Processes sorting in-place for fast execution on large data logs.
 * 
 * Time Complexity:
 * - Average: O(N log N)
 * - Worst: O(N^2)
 */
export function quickSortScores<T>(
  arr: T[],
  compare: (a: T, b: T) => number
): T[] {
  const copy = [...arr];
  quickSortHelper(copy, 0, copy.length - 1, compare);
  return copy;
}

function quickSortHelper<T>(
  arr: T[],
  low: number,
  high: number,
  compare: (a: T, b: T) => number
): void {
  if (low < high) {
    const pi = partition(arr, low, high, compare);
    quickSortHelper(arr, low, pi - 1, compare);
    quickSortHelper(arr, pi + 1, high, compare);
  }
}

function partition<T>(
  arr: T[],
  low: number,
  high: number,
  compare: (a: T, b: T) => number
): number {
  const pivot = arr[high];
  let i = low - 1;

  for (let j = low; j < high; j++) {
    // If element is smaller than or equal to pivot
    if (compare(arr[j], pivot) <= 0) {
      i++;
      swap(arr, i, j);
    }
  }
  swap(arr, i + 1, high);
  return i + 1;
}

function swap<T>(arr: T[], i: number, j: number): void {
  const temp = arr[i];
  arr[i] = arr[j];
  arr[j] = temp;
}
