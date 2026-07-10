/**
 * TREE DATA STRUCTURE
 * 
 * Connection to Application:
 * - Represents the quiz taxonomy and category hierarchy (e.g. Computer Science -> Data Structures -> Linear -> Stack).
 * 
 * Time Complexity:
 * - Traversal: O(N)
 */
export class TreeNode {
  name: string;
  slug: string;
  children: TreeNode[] = [];

  constructor(name: string, slug: string) {
    this.name = name;
    this.slug = slug;
  }

  addChild(child: TreeNode): void {
    this.children.push(child);
  }

  find(slug: string): TreeNode | null {
    if (this.slug === slug) return this;
    for (const child of this.children) {
      const found = child.find(slug);
      if (found) return found;
    }
    return null;
  }
}
