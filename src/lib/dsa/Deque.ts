/**
 * DEQUE (DOUBLE-ENDED QUEUE) DATA STRUCTURE
 * 
 * Connection to Application:
 * - Powers undo/redo question selections during the post-quiz review process.
 * - Allows double-ended insertion and deletion for active history windows.
 * 
 * Time Complexity:
 * - Add Front/Back: O(1)
 * - Remove Front/Back: O(1)
 */
export class Deque<T> {
  private items: { [key: number]: T } = {};
  private frontIndex: number = 0;
  private backIndex: number = 0;

  addFront(item: T): void {
    this.frontIndex--;
    this.items[this.frontIndex] = item;
  }

  addBack(item: T): void {
    this.items[this.backIndex] = item;
    this.backIndex++;
  }

  removeFront(): T | undefined {
    if (this.isEmpty()) return undefined;
    const item = this.items[this.frontIndex];
    delete this.items[this.frontIndex];
    this.frontIndex++;
    return item;
  }

  removeBack(): T | undefined {
    if (this.isEmpty()) return undefined;
    this.backIndex--;
    const item = this.items[this.backIndex];
    delete this.items[this.backIndex];
    return item;
  }

  peekFront(): T | undefined {
    if (this.isEmpty()) return undefined;
    return this.items[this.frontIndex];
  }

  peekBack(): T | undefined {
    if (this.isEmpty()) return undefined;
    return this.items[this.backIndex - 1];
  }

  isEmpty(): boolean {
    return this.backIndex - this.frontIndex === 0;
  }

  size(): number {
    return this.backIndex - this.frontIndex;
  }

  toArray(): T[] {
    const arr: T[] = [];
    for (let i = this.frontIndex; i < this.backIndex; i++) {
      arr.push(this.items[i]);
    }
    return arr;
  }
}
