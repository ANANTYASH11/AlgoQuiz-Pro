/**
 * CIRCULAR QUEUE DATA STRUCTURE
 * 
 * Connection to Application:
 * - Manages multiplayer lobby slots where slots are fixed in size and players can cycle in/out.
 * - Handles circular waiting lines for live battle rooms.
 * 
 * Time Complexity:
 * - Enqueue: O(1)
 * - Dequeue: O(1)
 */
export class CircularQueue<T> {
  private queue: (T | null)[];
  private capacity: number;
  private head: number = -1;
  private tail: number = -1;

  constructor(size: number) {
    this.capacity = size;
    this.queue = new Array(size).fill(null);
  }

  isFull(): boolean {
    return (this.tail + 1) % this.capacity === this.head;
  }

  isEmpty(): boolean {
    return this.head === -1;
  }

  enqueue(item: T): boolean {
    if (this.isFull()) return false;
    if (this.isEmpty()) {
      this.head = 0;
    }
    this.tail = (this.tail + 1) % this.capacity;
    this.queue[this.tail] = item;
    return true;
  }

  dequeue(): T | null {
    if (this.isEmpty()) return null;
    const value = this.queue[this.head];
    this.queue[this.head] = null;
    if (this.head === this.tail) {
      this.head = -1;
      this.tail = -1;
    } else {
      this.head = (this.head + 1) % this.capacity;
    }
    return value;
  }

  peek(): T | null {
    if (this.isEmpty()) return null;
    return this.queue[this.head];
  }

  size(): number {
    if (this.isEmpty()) return 0;
    if (this.tail >= this.head) {
      return this.tail - this.head + 1;
    }
    return this.capacity - this.head + this.tail + 1;
  }

  toArray(): T[] {
    if (this.isEmpty()) return [];
    const arr: T[] = [];
    let i = this.head;
    while (true) {
      if (this.queue[i] !== null) {
        arr.push(this.queue[i] as T);
      }
      if (i === this.tail) break;
      i = (i + 1) % this.capacity;
    }
    return arr;
  }

  getHeadIndex(): number {
    return this.head;
  }

  getTailIndex(): number {
    return this.tail;
  }

  getRawArray(): (T | null)[] {
    return this.queue;
  }

  clear(): void {
    this.queue = new Array(this.capacity).fill(null);
    this.head = -1;
    this.tail = -1;
  }
}
