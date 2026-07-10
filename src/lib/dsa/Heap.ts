/**
 * HEAP DATA STRUCTURE (Min/Max Heap)
 * 
 * Connection to Application:
 * - Powers the Top K Student Fetcher in dashboards and leaderboards.
 * - Max Heap gets top scores quickly, while Min Heap can keep track of the bottom of the top K list.
 * 
 * Time Complexity:
 * - Insert: O(log N)
 * - Extract Max/Min: O(log N)
 * - Peek: O(1)
 */
export class Heap<T> {
  private data: T[] = [];
  private compare: (a: T, b: T) => number;

  constructor(compare: (a: T, b: T) => number) {
    this.compare = compare; // returns > 0 if a > b (for max heap, b - a or vice versa)
  }

  insert(val: T): void {
    this.data.push(val);
    this.upHeap(this.data.length - 1);
  }

  extract(): T | undefined {
    if (this.data.length === 0) return undefined;
    const top = this.data[0];
    const bottom = this.data.pop();
    if (this.data.length > 0 && bottom !== undefined) {
      this.data[0] = bottom;
      this.downHeap(0);
    }
    return top;
  }

  peek(): T | undefined {
    return this.data[0];
  }

  size(): number {
    return this.data.length;
  }

  isEmpty(): boolean {
    return this.data.length === 0;
  }

  private upHeap(index: number): void {
    while (index > 0) {
      const parent = Math.floor((index - 1) / 2);
      if (this.compare(this.data[index], this.data[parent]) <= 0) break;
      this.swap(index, parent);
      index = parent;
    }
  }

  private downHeap(index: number): void {
    const len = this.data.length;
    while (index * 2 + 1 < len) {
      const left = index * 2 + 1;
      const right = left + 1;
      let target = left;

      if (right < len && this.compare(this.data[right], this.data[left]) > 0) {
        target = right;
      }

      if (this.compare(this.data[target], this.data[index]) <= 0) break;
      this.swap(index, target);
      index = target;
    }
  }

  private swap(i: number, j: number): void {
    const temp = this.data[i];
    this.data[i] = this.data[j];
    this.data[j] = temp;
  }

  toArray(): T[] {
    return [...this.data];
  }
}
