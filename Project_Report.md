# PROJECT REPORT: ALGOQUIZ PRO
### An AI-Powered Premium Quiz and Data Structures Visualization Platform

---

## COVER PAGE

* **Title of the Project:** AlgoQuiz Pro: An AI-Powered Premium Quiz and Data Structures Visualization Platform
* **Submitted by:** Anant Yash
* **Roll Number:** [Insert Roll Number]
* **Registration Number:** [Insert Registration Number]
* **Course/Program:** [Insert Course/Program Name, e.g., B.Tech in Computer Science & Engineering]
* **Department:** [Insert Department Name, e.g., Department of Computer Science & Engineering]
* **Institution Name:** [Insert Institution Name, e.g., National Institute of Technology]
* **Academic Session:** 2025 – 2026
* **Guide/Mentor Name:** [Insert Guide/Mentor Name]

---

## TABLE OF CONTENTS
1. Cover Page
2. Table of Contents
3. Introduction
4. Problem Statement
5. Objectives
6. Project Modules
7. Roles of Team Members
8. Technologies Used
9. Module Description
10. Implementation (Source Code & Algorithm Analysis)
11. Screenshots of the Project
12. Future Scope of the Project
13. Conclusion
14. References

---

## 1. INTRODUCTION

Modern computer science education is moving away from rote memorization towards visual and interactive learning. Data Structures and Algorithms (DSA) form the foundation of software engineering, yet students often struggle to grasp abstract operations (like tree rotations, heap extractions, and graph traversals) when limited to static textbook descriptions.

**AlgoQuiz Pro** is an advanced EdTech SaaS platform designed to address these gaps. By combining a gamified, adaptive quiz engine with real-time interactive DSA visualizers, the platform provides an engaging sandbox environment. Learners can answer advanced question formats (such as ordering algorithm steps and predicting code outputs) and visually trace data structure states during execution. The platform is built using modern web technologies—featuring a premium glassmorphic user interface, ambient sound design, and live multiplayer competitive quiz lobbies.

---

## 2. PROBLEM STATEMENT

Traditional computer science evaluation and learning platforms suffer from several limitations:
1. **Static and Simplistic Question Formats:** Most platforms rely solely on multiple-choice questions (MCQs) that encourage guessing rather than logical step-by-step problem-solving.
2. **Lack of Visual Feedback:** When a student answers a question on binary search trees or heap operations incorrectly, they do not receive visual feedback showing how the structure behaves, leading to conceptual misunderstandings.
3. **No Difficulty Adaptation:** Standard quizzes use static lists of questions, which either frustrate struggling students with high-difficulty problems or bore advanced students with trivial tasks.
4. **Lack of Gamification:** Without interactive elements (such as streaks, XP, achievements, or rewards wheels), student engagement drops rapidly over time.
5. **No Collaboration:** Learning platforms are often isolated, lacking real-time peer comparison, multiplayer lobbies, and competitive coding arenas.

---

## 3. OBJECTIVES

The development of AlgoQuiz Pro is guided by the following core objectives:
* **Interactive Evaluation:** Go beyond basic MCQs by designing complex question formats such as step re-ordering, output prediction, and matching logic.
* **Real-time Algorithm Visualizer:** Build modular, client-side, animated visualizations of core data structures (Heaps, BSTs, Tries, Queues) that react directly to operations.
* **Gamified Progression Engine:** Implement streaks, level-ups, dynamic coin collection, and a daily spin wheel to drive user retention.
* **Adaptive Learning Paths:** Structure questions dynamically so the platform adjusts question difficulty in response to real-time performance.
* **Competitive Multiplayer Sandbox:** Build simulated multiplayer quiz lobbies using room codes, enabling real-time competitive scoring.
* **Analytical Dashboards:** Generate detail-oriented charts and metrics using student attempt records to identify performance patterns and weak areas.

---

## 4. PROJECT MODULES

The system is partitioned into the following highly connected modules:

1. **Authentication & Access Control Module:** Handles user registration, credentials validation, and role-based routing (Admin vs. Student).
2. **Interactive DSA Lab Module:** The algorithmic sandbox containing visualizers for Binary Search Trees, Heaps, Tries, Queues, Backtracking, and Sorting.
3. **Active Quiz Sandbox Module:** Renders the gamified test interface, handles timer countdowns, plays audio cues, and computes final scores.
4. **Brain Gym & Rewards Module:** Contains the daily rewards wheel, streak tracker, and user achievements tracker.
5. **Real-time Multiplayer Module:** Manages multiplayer rooms, waiting lobby state, and competitive score boards.
6. **Analytics & Dashboard Module:** Features data visualizations showing quiz history, category scores, and diagnostic reports using interactive charts.

---

## 5. ROLES OF TEAM MEMBERS

As a single-member project, all responsibilities were handled by **Anant Yash**. The project responsibilities were categorized across core layers:

| Module / Component | Responsibility | Assigned To |
| :--- | :--- | :--- |
| **Frontend UI/UX** | Implemented premium glassmorphic dashboard, responsive layout, CSS styling, and Framer Motion transitions. | Anant Yash |
| **DSA Engine** | Programmed the TypeScript classes for Tries, Heaps, BSTs, Queues, Graphs, and sorting visualizers. | Anant Yash |
| **Full-Stack Routing** | Constructed Next.js App Router folders and serverless REST API endpoints (`/api/auth`, `/api/attempts`, `/api/questions`). | Anant Yash |
| **Mock Database** | Set up in-memory JSON data read/write handlers simulating database persistence. | Anant Yash |

---

## 6. TECHNOLOGIES USED

The platform relies on a modern, high-performance web development stack:
* **Core Framework:** Next.js 16.2.10 (leveraging the App Router, layout caching, and serverless routing).
* **Library:** React 19.2.4 (utilizing hooks like `useState`, `useEffect`, `useContext`, and custom state providers).
* **Programming Language:** TypeScript 5.x (ensuring strict type definitions for all core data structures).
* **Styling & Presentation:** Tailwind CSS v4 & custom CSS rules for premium dark-mode glassmorphism (`backdrop-filter`).
* **Animations:** Framer Motion 12.4.2 (controlling layout shifts, modal entries, and reward wheel rotations).
* **Charts & Analytics:** Recharts 3.9.2 (rendering responsive area, line, and radar graphs).
* **Icons:** Lucide React.
* **Build Engine:** Turbopack (powering fast local HMR builds).

---

## 7. MODULE DESCRIPTION (TECHNICAL DETAILS)

### 7.1 Authentication & Access Control
* **Description:** Leverages Next.js API routes under `/src/app/api/auth/` to authenticate users. It reads and writes user credentials to a simulated database file (`/src/lib/db/data/users.json`).
* **UI Features:** A unified auth page (`/src/app/auth/page.tsx`) with animated tabs that slide between Login and Signup. Includes role selection (Student vs. Admin).

### 7.2 Interactive DSA Lab
* **Description:** Contains class-based TypeScript models that implement actual algorithms. Users can interactively insert elements, perform searches, delete nodes, and witness step-by-step layout recalculations.
* **Technical Implementation:** Located in `src/lib/dsa/`. Components read the classes and map state mutations to Framer Motion transitions to animate visual shifts.

### 7.3 Active Quiz Sandbox
* **Description:** Renders timed test sessions. If the user completes the quiz with a high score, Canvas Confetti triggers. Sound effects (click, success, error) are routed through a web audio dispatcher in `AppState.tsx`.
* **Adaptive Logic:** Evaluates answer accuracy. Uses a dynamic selection window to serve harder questions if a user is on a correct-answer streak, and shifts to foundations if incorrect.

### 7.4 Brain Gym & Gamification
* **Description:** The rewards wheel uses CSS variables and Framer Motion transitions to rotate and deceleration-stop on a winning prize segment. Coins are incremented in the user’s global state context.

### 7.5 Multiplayer Lobbies
* **Description:** Simulates multiplayer room codes. Multiple local states sync to simulate rival score submissions, demonstrating how active users compete concurrently.

### 7.6 Analytics Dashboard
* **Description:** Renders performance analytics inside `/src/app/dashboard/page.tsx`. Recharts parse historical attempt records, generating category-wise radar graphs and line charts tracking score improvements.

---

## 8. IMPLEMENTATION & ALGORITHMIC ANALYSIS

### 8.1 Core Data Structures Used

#### A. Heap (Priority Queue)
The Heap is implemented as a binary tree stored in a flat array. It supports $O(\log N)$ inserts and extractions, used for ordering rankings and priority-based question queues.

* **Insertion Time Complexity:** $O(\log N)$
* **Extraction Time Complexity:** $O(\log N)$
* **Space Complexity:** $O(N)$

#### B. Trie (Prefix Tree)
The Trie structure is utilized to index coding concepts and search categories quickly by prefix.

* **Search/Insert Time Complexity:** $O(L)$ where $L$ is the length of the prefix/word.
* **Space Complexity:** $O(A \times L \times N)$ where $A$ is alphabet size.

---

### 8.2 Key Source Code Implementations

#### 1. Binary Heap Implementation (`src/lib/dsa/Heap.ts`)
```typescript
/**
 * Binary Heap Implementation (Max-Heap / Min-Heap based on comparator)
 */
export class Heap<T> {
  private heap: T[] = [];
  private compare: (a: T, b: T) => number;

  constructor(comparator: (a: T, b: T) => number) {
    this.compare = comparator;
  }

  public get size(): number {
    return this.heap.length;
  }

  public isEmpty(): boolean {
    return this.heap.length === 0;
  }

  public peek(): T | null {
    return this.heap.length > 0 ? this.heap[0] : null;
  }

  public insert(value: T): void {
    this.heap.push(value);
    this.bubbleUp(this.heap.length - 1);
  }

  public extract(): T | null {
    if (this.heap.length === 0) return null;
    const root = this.heap[0];
    const end = this.heap.pop();
    if (this.heap.length > 0 && end !== undefined) {
      this.heap[0] = end;
      this.sinkDown(0);
    }
    return root;
  }

  private bubbleUp(index: number): void {
    const element = this.heap[index];
    while (index > 0) {
      const parentIndex = Math.floor((index - 1) / 2);
      const parent = this.heap[parentIndex];
      if (this.compare(element, parent) >= 0) break;
      this.heap[index] = parent;
      index = parentIndex;
    }
    this.heap[index] = element;
  }

  private sinkDown(index: number): void {
    const length = this.heap.length;
    const element = this.heap[index];

    while (true) {
      let leftChildIndex = 2 * index + 1;
      let rightChildIndex = 2 * index + 2;
      let swapIndex = -1;

      if (leftChildIndex < length) {
        if (this.compare(this.heap[leftChildIndex], element) < 0) {
          swapIndex = leftChildIndex;
        }
      }

      if (rightChildIndex < length) {
        const leftOrElement = swapIndex === -1 ? element : this.heap[leftChildIndex];
        if (this.compare(this.heap[rightChildIndex], leftOrElement) < 0) {
          swapIndex = rightChildIndex;
        }
      }

      if (swapIndex === -1) break;
      this.heap[index] = this.heap[swapIndex];
      index = swapIndex;
    }
    this.heap[index] = element;
  }

  public toArray(): T[] {
    return [...this.heap];
  }
}
```

---

#### 2. Trie Implementation (`src/lib/dsa/Trie.ts`)
```typescript
/**
 * Trie Node and Trie Implementation
 */
class TrieNode {
  public children: Map<string, TrieNode> = new Map();
  public isEndOfWord: boolean = false;
  public metadata: any = null;
}

export class Trie {
  private root: TrieNode = new TrieNode();

  public insert(word: string, metadata: any = null): void {
    let current = this.root;
    for (const char of word) {
      if (!current.children.has(char)) {
        current.children.set(char, new TrieNode());
      }
      current = current.children.get(char)!;
    }
    current.isEndOfWord = true;
    current.metadata = metadata;
  }

  public search(word: string): boolean {
    const node = this.traverse(word);
    return node !== null && node.isEndOfWord;
  }

  public startsWith(prefix: string): string[] {
    let current = this.traverse(prefix);
    if (!current) return [];
    
    const results: string[] = [];
    this.collectWords(current, prefix, results);
    return results;
  }

  private traverse(str: string): TrieNode | null {
    let current = this.root;
    for (const char of str) {
      if (!current.children.has(char)) return null;
      current = current.children.get(char)!;
    }
    return current;
  }

  private collectWords(node: TrieNode, prefix: string, results: string[]): void {
    if (node.isEndOfWord) {
      results.push(prefix);
    }
    for (const [char, childNode] of node.children.entries()) {
      this.collectWords(childNode, prefix + char, results);
    }
  }
}
```

---

## 9. SCREENSHOTS OF THE PROJECT

The screenshots captured during active deployment represent the system architecture in production:

### 9.1 User Dashboard Page
The landing page and metrics dashboard display modern aesthetics with deep purple and blue glassmorphism cards.

![Homepage Features Dashboard](C:\Users\Administrator\.gemini\antigravity\brain\8d7d876c-d8bc-4abc-9037-b607495322e8\homepage_features_1783674189397.png)
*Figure 9.1: Interactive Landing dashboard showcasing stat cards, custom visuals, and course features.*

### 9.2 Application Landing Interface
The top hero section with dynamic DP knapsack description and active call-to-actions.

![Homepage Landing Top](C:\Users\Administrator\.gemini\antigravity\brain\8d7d876c-d8bc-4abc-9037-b607495322e8\homepage_top_1783674173566.png)
*Figure 9.2: Hero display of AlgoQuiz Pro in the browser environment.*

---

## 10. FUTURE SCOPE OF THE PROJECT

While the current release is production-ready, several areas are flagged for expansion:
* **Progressive Web App (PWA):** Incorporating service workers to cache and serve questions and trace structures completely offline.
* **LMS Integration:** Exporting test attempts directly to standard Learning Management Systems (Canvas, Moodle) using LTI keys.
* **Voice-Over Lobbies:** Utilizing WebRTC to enable audio connections inside multiplayer battle waiting rooms.
* **AI Coding Sandbox:** Integrating WebAssembly-compiled compilers (like clang or Pyodide) to support sandboxed code execution testing.

---

## 11. CONCLUSION

AlgoQuiz Pro successfully bridges the gap between passive multiple-choice evaluations and active conceptual comprehension. Developing this project facilitated:
1. **Interactive Visualization Mapping:** Gaining experience in binding abstract data structure operations to declarative DOM structures with Framer Motion transitions.
2. **Next.js & React 19 Mastery:** Utilizing Serverless API Routing, client-side global contexts, and Next.js layout structures.
3. **Responsive Aesthetics:** Implementing custom dark-theme glassmorphism rules that remain highly readable across mobile and desktop viewports.

---

## 12. REFERENCES

1. Cormen, T. H., Leiserson, C. E., Rivest, R. L., & Stein, C. *Introduction to Algorithms (CLRS)*. MIT Press.
2. Next.js App Router Documentation: [https://nextjs.org/docs](https://nextjs.org/docs)
3. React 19 Documentation: [https://react.dev](https://react.dev)
4. Framer Motion API Reference: [https://www.framer.com/motion/](https://www.framer.com/motion/)
5. Recharts API Reference: [https://recharts.org](https://recharts.org)
