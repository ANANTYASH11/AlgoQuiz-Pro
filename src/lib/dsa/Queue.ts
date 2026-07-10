/**
 * QUEUE DATA STRUCTURE
 * 
 * Connection to Application:
 * - Manages the sequence of user question submissions.
 * - Used in multiplayer lobbies to queue incoming player submissions or waitroom requests.
 * 
 * Time Complexity:
 * - Enqueue: O(1)
 * - Dequeue: O(1)
 * - Peek: O(1)
 */
export class Queue<T> {
  private items: { [key: number]: T } = {};
  private headIndex: number = 0;
  private tailIndex: number = 0;

  // Adds an item to the end of the queue
  enqueue(item: T): void {
    this.items[this.tailIndex] = item;
    this.tailIndex++;
  }

  // Removes and returns the item at the front of the queue
  dequeue(): T | undefined {
    if (this.isEmpty()) {
      return undefined;
    }
    const item = this.items[this.headIndex];
    delete this.items[this.headIndex];
    this.headIndex++;
    return item;
  }

  // Looks at the item at the front without removing it
  peek(): T | undefined {
    if (this.isEmpty()) {
      return undefined;
    }
    return this.items[this.headIndex];
  }

  // Checks if the queue is empty
  isEmpty(): boolean {
    return this.tailIndex - this.headIndex === 0;
  }

  // Returns the size of the queue
  size(): number {
    return this.tailIndex - this.headIndex;
  }

  // Clears the queue
  clear(): void {
    this.items = {};
    this.headIndex = 0;
    this.tailIndex = 0;
  }

  // Returns the contents of the queue as an array
  toArray(): T[] {
    const arr: T[] = [];
    for (let i = this.headIndex; i < this.tailIndex; i++) {
      arr.push(this.items[i]);
    }
    return arr;
  }
}
