/**
 * PREFIX SUM TECHNIQUE
 * 
 * Connection to Application:
 * - Efficiently answers static range query logs. For example, getting the total XP
 *   obtained between day L and day R in O(1) time after O(N) pre-processing.
 * 
 * Time Complexity:
 * - Pre-processing: O(N)
 * - Query: O(1)
 */
export class PrefixSum {
  private prefix: number[];

  constructor(data: number[]) {
    this.prefix = new Array(data.length + 1).fill(0);
    for (let i = 0; i < data.length; i++) {
      this.prefix[i + 1] = this.prefix[i] + data[i];
    }
  }

  // Returns range sum in range [L, R] inclusive (0-indexed indices)
  queryRange(L: number, R: number): number {
    if (L < 0 || R >= this.prefix.length - 1 || L > R) {
      return 0;
    }
    return this.prefix[R + 1] - this.prefix[L];
  }
}
