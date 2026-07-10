import { Heap } from "./Heap";

/**
 * PRIORITY QUEUE DATA STRUCTURE
 * 
 * Connection to Application:
 * - Dynamically maintains live user placement during active quizzes or multiplayer lobbies.
 * - Nodes contain user information and scores, and are kept sorted with maximum elements at the head.
 * 
 * Time Complexity:
 * - Enqueue: O(log N)
 * - Dequeue: O(log N)
 */
export interface PQElement<T> {
  element: T;
  priority: number;
}

export class PriorityQueue<T> {
  private heap: Heap<PQElement<T>>;

  constructor() {
    // Max Heap: highest priority element should be at the top
    this.heap = new Heap<PQElement<T>>((a, b) => a.priority - b.priority);
  }

  enqueue(element: T, priority: number): void {
    this.heap.insert({ element, priority });
  }

  dequeue(): T | undefined {
    const popped = this.heap.extract();
    return popped ? popped.element : undefined;
  }

  peek(): T | undefined {
    const top = this.heap.peek();
    return top ? top.element : undefined;
  }

  size(): number {
    return this.heap.size();
  }

  isEmpty(): boolean {
    return this.heap.isEmpty();
  }

  toArray(): T[] {
    // Return elements sorted by priority (descending)
    const sorted = [...this.heap.toArray()].sort((a, b) => b.priority - a.priority);
    return sorted.map(item => item.element);
  }
}
