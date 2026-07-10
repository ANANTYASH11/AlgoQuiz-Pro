/**
 * SEGMENT TREE
 * 
 * Connection to Application:
 * - Allows admins to query statistics (such as the highest score) over a range of student ranks [L, R] in O(log N) time.
 * 
 * Time Complexity:
 * - Build: O(N)
 * - Range Query: O(log N)
 * - Update: O(log N)
 */
export class SegmentTree {
  private tree: number[];
  private n: number;

  constructor(arr: number[]) {
    this.n = arr.length;
    this.tree = new Array(4 * this.n).fill(0);
    if (this.n > 0) {
      this.build(arr, 0, 0, this.n - 1);
    }
  }

  private build(arr: number[], node: number, start: number, end: number): void {
    if (start === end) {
      this.tree[node] = arr[start];
      return;
    }
    const mid = Math.floor((start + end) / 2);
    const leftNode = 2 * node + 1;
    const rightNode = 2 * node + 2;

    this.build(arr, leftNode, start, mid);
    this.build(arr, rightNode, mid + 1, end);

    // Storing the maximum score in range
    this.tree[node] = Math.max(this.tree[leftNode], this.tree[rightNode]);
  }

  query(L: number, R: number): number {
    if (this.n === 0) return 0;
    return this.queryHelper(0, 0, this.n - 1, L, R);
  }

  private queryHelper(node: number, start: number, end: number, L: number, R: number): number {
    // Segment completely outside range
    if (end < L || start > R) {
      return -Infinity;
    }
    // Segment completely inside range
    if (start >= L && end <= R) {
      return this.tree[node];
    }
    const mid = Math.floor((start + end) / 2);
    const leftNode = 2 * node + 1;
    const rightNode = 2 * node + 2;

    const p1 = this.queryHelper(leftNode, start, mid, L, R);
    const p2 = this.queryHelper(rightNode, mid + 1, end, L, R);

    return Math.max(p1, p2);
  }

  update(idx: number, newVal: number): void {
    if (this.n === 0) return;
    this.updateHelper(0, 0, this.n - 1, idx, newVal);
  }

  private updateHelper(node: number, start: number, end: number, idx: number, newVal: number): void {
    if (start === end) {
      this.tree[node] = newVal;
      return;
    }
    const mid = Math.floor((start + end) / 2);
    const leftNode = 2 * node + 1;
    const rightNode = 2 * node + 2;

    if (idx <= mid) {
      this.updateHelper(leftNode, start, mid, idx, newVal);
    } else {
      this.updateHelper(rightNode, mid + 1, end, idx, newVal);
    }
    this.tree[node] = Math.max(this.tree[leftNode], this.tree[rightNode]);
  }
}
