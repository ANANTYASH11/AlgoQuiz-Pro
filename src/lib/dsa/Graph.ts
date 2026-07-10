/**
 * GRAPH DATA STRUCTURE
 * 
 * Connection to Application:
 * - Represents the learning path roadmap where subjects are nodes and prerequisites are edges.
 * - DFS (Depth-First Search): Traverses path dependencies to find prerequisite paths.
 * - BFS (Breadth-First Search): Explores adjacent recommended/weak subjects level-by-level.
 * 
 * Time Complexity:
 * - Add Node/Edge: O(1)
 * - BFS/DFS Traversal: O(V + E)
 */
export class Graph {
  private adjacencyList: Map<string, string[]> = new Map();

  addVertex(vertex: string): void {
    if (!this.adjacencyList.has(vertex)) {
      this.adjacencyList.set(vertex, []);
    }
  }

  addEdge(source: string, destination: string): void {
    this.addVertex(source);
    this.addVertex(destination);
    this.adjacencyList.get(source)!.push(destination);
  }

  getAdjacencyList(): Map<string, string[]> {
    return this.adjacencyList;
  }

  // DFS: Checks path or gets a linear dependency order (Topological Sort helper)
  dfs(start: string, visited: Set<string> = new Set(), order: string[] = []): string[] {
    visited.add(start);
    const neighbors = this.adjacencyList.get(start) || [];
    for (const neighbor of neighbors) {
      if (!visited.has(neighbor)) {
        this.dfs(neighbor, visited, order);
      }
    }
    order.push(start);
    return order;
  }

  // BFS: Recommends related topics starting from a weak topic node
  bfsRecommend(start: string, maxRecommendations: number = 3): string[] {
    const visited: Set<string> = new Set();
    const queue: string[] = [];
    const recommendations: string[] = [];

    visited.add(start);
    queue.push(start);

    while (queue.length > 0 && recommendations.length < maxRecommendations) {
      const current = queue.shift()!;
      
      // Don't recommend the start node itself
      if (current !== start) {
        recommendations.push(current);
      }

      const neighbors = this.adjacencyList.get(current) || [];
      for (const neighbor of neighbors) {
        if (!visited.has(neighbor)) {
          visited.add(neighbor);
          queue.push(neighbor);
        }
      }
    }
    return recommendations;
  }
}
