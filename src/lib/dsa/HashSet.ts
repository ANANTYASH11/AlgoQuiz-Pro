import { HashMap } from "./HashMap";

/**
 * HASHSET DATA STRUCTURE
 * 
 * Connection to Application:
 * - Used during random quiz generation to guarantee that questions are not duplicated.
 * - Manages bookmarked question lists to ensure uniqueness.
 * 
 * Time Complexity:
 * - Add: O(1) average
 * - Has: O(1) average
 * - Delete: O(1) average
 */
export class HashSet<T extends string | number> {
  private map: HashMap<T, boolean>;

  constructor() {
    this.map = new HashMap<T, boolean>();
  }

  add(val: T): void {
    this.map.put(val, true);
  }

  has(val: T): boolean {
    return this.map.has(val);
  }

  delete(val: T): boolean {
    return this.map.delete(val);
  }

  clear(): void {
    this.map.clear();
  }

  size(): number {
    return this.map.size();
  }

  toArray(): T[] {
    return this.map.keys();
  }
}
