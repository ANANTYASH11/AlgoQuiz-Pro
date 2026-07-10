/**
 * BINARY SEARCH TREE (BST)
 * 
 * Connection to Application:
 * - Stores leaderboard ranking dynamically for sorted insertion and query.
 * - Allows searching for user scores or looking up ranges of scores.
 * 
 * Time Complexity:
 * - Insert: O(log N) average, O(N) worst-case
 * - Search: O(log N) average
 * - In-Order Traversal: O(N) (gives sorted scores)
 */
class BSTNode<T> {
  value: number;
  data: T;
  left: BSTNode<T> | null = null;
  right: BSTNode<T> | null = null;

  constructor(value: number, data: T) {
    this.value = value;
    this.data = data;
  }
}

export class BinarySearchTree<T> {
  private root: BSTNode<T> | null = null;

  insert(value: number, data: T): void {
    const newNode = new BSTNode(value, data);
    if (this.root === null) {
      this.root = newNode;
      return;
    }
    this.insertNode(this.root, newNode);
  }

  private insertNode(node: BSTNode<T>, newNode: BSTNode<T>): void {
    if (newNode.value < node.value) {
      if (node.left === null) {
        node.left = newNode;
      } else {
        this.insertNode(node.left, newNode);
      }
    } else {
      if (node.right === null) {
        node.right = newNode;
      } else {
        this.insertNode(node.right, newNode);
      }
    }
  }

  search(value: number): T | null {
    return this.searchNode(this.root, value);
  }

  private searchNode(node: BSTNode<T> | null, value: number): T | null {
    if (node === null) return null;
    if (value < node.value) {
      return this.searchNode(node.left, value);
    } else if (value > node.value) {
      return this.searchNode(node.right, value);
    } else {
      return node.data;
    }
  }

  // Returns all elements in sorted order (in-order traversal)
  getInOrder(): { value: number; data: T }[] {
    const result: { value: number; data: T }[] = [];
    this.inOrderTraversal(this.root, result);
    return result;
  }

  private inOrderTraversal(node: BSTNode<T> | null, result: { value: number; data: T }[]) {
    if (node !== null) {
      this.inOrderTraversal(node.left, result);
      result.push({ value: node.value, data: node.data });
      this.inOrderTraversal(node.right, result);
    }
  }

  // Returns items in descending order (highest score first)
  getDescending(): { value: number; data: T }[] {
    const result: { value: number; data: T }[] = [];
    this.reverseInOrderTraversal(this.root, result);
    return result;
  }

  private reverseInOrderTraversal(node: BSTNode<T> | null, result: { value: number; data: T }[]) {
    if (node !== null) {
      this.reverseInOrderTraversal(node.right, result);
      result.push({ value: node.value, data: node.data });
      this.reverseInOrderTraversal(node.left, result);
    }
  }
}
