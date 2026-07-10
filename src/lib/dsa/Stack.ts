/**
 * STACK DATA STRUCTURE
 * 
 * Connection to Application:
 * - Used during active quiz attempts to track the history of navigated question IDs.
 * - Allows students to go "Back" to previous questions easily, pushing and popping states.
 * 
 * Time Complexity:
 * - Push: O(1)
 * - Pop: O(1)
 * - Peek: O(1)
 */
export class Stack<T> {
  private items: T[] = [];

  // Pushes an item onto the stack
  push(item: T): void {
    this.items.push(item);
  }

  // Pops the top item off the stack
  pop(): T | undefined {
    return this.items.pop();
  }

  // Peeks at the top item without removing it
  peek(): T | undefined {
    if (this.isEmpty()) {
      return undefined;
    }
    return this.items[this.items.length - 1];
  }

  // Checks if empty
  isEmpty(): boolean {
    return this.items.length === 0;
  }

  // Returns size
  size(): number {
    return this.items.length;
  }

  // Clears the stack
  clear(): void {
    this.items = [];
  }

  // Returns stack elements as array
  toArray(): T[] {
    return [...this.items];
  }
}
