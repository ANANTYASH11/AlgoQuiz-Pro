export class TrieNode<T = unknown> {
  public children: { [char: string]: TrieNode<T> } = {};
  public isEndOfWord: boolean = false;
  public values: T[] = []; // Store references to items containing this word/tag
  public wordText: string = ""; // Store the full original word string
}

export class Trie<T = unknown> {
  private root: TrieNode<T> = new TrieNode<T>();

  public insert(word: string, value?: T): void {
    const cleanWord = word.trim().toLowerCase();
    if (!cleanWord) return;
    
    let current = this.root;
    for (let i = 0; i < cleanWord.length; i++) {
      const char = cleanWord[i];
      if (!current.children[char]) {
        current.children[char] = new TrieNode<T>();
      }
      current = current.children[char];
    }
    current.isEndOfWord = true;
    current.wordText = word; // Store the original capitalization
    
    if (value !== undefined) {
      if (!current.values.includes(value)) {
        current.values.push(value);
      }
    } else {
      const wordVal = word as unknown as T;
      if (!current.values.includes(wordVal)) {
        current.values.push(wordVal);
      }
    }
  }

  public search(prefix: string): T[] {
    const cleanPrefix = prefix.trim().toLowerCase();
    if (!cleanPrefix) return [];

    let current = this.root;
    for (let i = 0; i < cleanPrefix.length; i++) {
      const char = cleanPrefix[i];
      if (!current.children[char]) {
        return [];
      }
      current = current.children[char];
    }

    const results: T[] = [];
    this.collectAll(current, results);
    return results;
  }

  public getSuggestions(prefix: string): string[] {
    const cleanPrefix = prefix.trim().toLowerCase();
    if (!cleanPrefix) return [];

    let current = this.root;
    for (let i = 0; i < cleanPrefix.length; i++) {
      const char = cleanPrefix[i];
      if (!current.children[char]) {
        return [];
      }
      current = current.children[char];
    }

    const suggestions: string[] = [];
    this.collectSuggestions(current, suggestions);
    return suggestions;
  }

  private collectAll(node: TrieNode<T>, results: T[]): void {
    if (node.isEndOfWord) {
      for (const val of node.values) {
        if (!results.includes(val)) {
          results.push(val);
        }
      }
    }
    for (const char in node.children) {
      this.collectAll(node.children[char], results);
    }
  }

  private collectSuggestions(node: TrieNode<T>, results: string[]): void {
    if (node.isEndOfWord && node.wordText) {
      if (!results.includes(node.wordText)) {
        results.push(node.wordText);
      }
    }
    for (const char in node.children) {
      this.collectSuggestions(node.children[char], results);
    }
  }
}
