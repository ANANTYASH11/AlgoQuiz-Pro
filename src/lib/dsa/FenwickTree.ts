/**
 * FENWICK TREE (BINARY INDEXED TREE)
 * 
 * Connection to Application:
 * - Maintains a dynamic history of student daily XP changes, enabling quick range sum queries
 *   for calculating cumulative XP over specific day spans.
 * 
 * Time Complexity:
 * - Update: O(log N)
 * - Prefix Sum Query: O(log N)
 */
export class FenwickTree {
  private tree: number[];
  private size: number;

  constructor(size: number) {
    this.size = size;
    this.tree = new Array(size + 1).fill(0);
  }

  // Adds value to element at index i (1-based index)
  update(i: number, delta: number): void {
    while (i <= this.size) {
      this.tree[i] += delta;
      i += i & -i; // Go to next node
    }
  }

  // Returns sum of elements from index 1 to i (1-based index)
  query(i: number): number {
    let sum = 0;
    while (i > 0) {
      sum += this.tree[i];
      i -= i & -i; // Go to parent node
    }
    return sum;
  }

  // Returns sum of elements between L and R inclusive (1-based indices)
  queryRange(L: number, R: number): number {
    if (L > R) return 0;
    return this.query(R) - this.query(L - 1);
  }
}
