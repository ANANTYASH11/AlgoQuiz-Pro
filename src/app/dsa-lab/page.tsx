"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAppState } from "@/components/AppState";
import { 
  Play, 
  RotateCcw, 
  Terminal, 
  BookOpen,
  Sparkles,
  ArrowUp
} from "lucide-react";

// Code Snippets of separate DSA files
const dsaCodes: { [key: string]: { description: string; complexity: string; code: string } } = {
  "Stack.ts": {
    complexity: "Push: O(1), Pop: O(1), Peek: O(1)",
    description: "A Last-In-First-Out (LIFO) structure. Used to track question navigation logs and let students trace back states.",
    code: `export class Stack<T> {
  private items: T[] = [];

  push(item: T): void {
    this.items.push(item);
  }

  pop(): T | undefined {
    return this.items.pop();
  }

  peek(): T | undefined {
    if (this.isEmpty()) return undefined;
    return this.items[this.items.length - 1];
  }

  isEmpty(): boolean {
    return this.items.length === 0;
  }

  size(): number {
    return this.items.length;
  }
}`
  },
  "Queue.ts": {
    complexity: "Enqueue: O(1), Dequeue: O(n) (array shift) or O(1) (linked list)",
    description: "A First-In-First-Out (FIFO) structure. Used in backend multiplayer queue matching schemas.",
    code: `export class Queue<T> {
  private items: T[] = [];

  enqueue(item: T): void {
    this.items.push(item);
  }

  dequeue(): T | undefined {
    return this.items.shift();
  }

  peek(): T | undefined {
    if (this.isEmpty()) return undefined;
    return this.items[0];
  }

  isEmpty(): boolean {
    return this.items.length === 0;
  }
}`
  },
  "CircularQueue.ts": {
    complexity: "Enqueue: O(1), Dequeue: O(1) in static buffers",
    description: "A ring buffer queue resolving memory overheads from standard array shifts. Prevents memory reallocation.",
    code: `export class CircularQueue<T> {
  private items: (T | null)[];
  private head: number = -1;
  private tail: number = -1;
  private size: number;

  constructor(size: number = 5) {
    this.size = size;
    this.items = new Array(size).fill(null);
  }

  enqueue(item: T): boolean {
    if (this.isFull()) return false;
    if (this.isEmpty()) this.head = 0;
    this.tail = (this.tail + 1) % this.size;
    this.items[this.tail] = item;
    return true;
  }

  dequeue(): T | null {
    if (this.isEmpty()) return null;
    const res = this.items[this.head];
    this.items[this.head] = null;
    if (this.head === this.tail) {
      this.head = -1;
      this.tail = -1;
    } else {
      this.head = (this.head + 1) % this.size;
    }
    return res;
  }
}`
  },
  "BST.ts": {
    complexity: "Insert: O(log N) avg, Search: O(log N) avg",
    description: "A binary tree node map where left children are smaller and right children are larger. Powers dynamic score sorting.",
    code: `class BSTNode<T> {
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
    if (!this.root) {
      this.root = newNode;
      return;
    }
    this.insertNode(this.root, newNode);
  }

  search(value: number): T | null {
    return this.searchNode(this.root, value);
  }
}`
  },
  "HashMap.ts": {
    complexity: "Put: O(1) avg, Get: O(1) avg",
    description: "Collision chained hash lookup mapping keys to bucket indices. Backs the O(1) server database search indexing.",
    code: `export class HashMap<K, V> {
  private buckets: KeyValuePair<K, V>[][];
  private _size: number = 0;

  constructor(private capacity: number = 127) {
    this.buckets = Array.from({ length: capacity }, () => []);
  }

  private hash(key: any): number {
    const str = String(key);
    let hashVal = 0;
    for (let i = 0; i < str.length; i++) {
      hashVal = (hashVal * 31 + str.charCodeAt(i)) % this.capacity;
    }
    return hashVal;
  }

  put(key: K, value: V): void {
    const bucketIdx = this.hash(key);
    const bucket = this.buckets[bucketIdx];
    for (const pair of bucket) {
      if (pair.key === key) {
        pair.value = value;
        return;
      }
    }
    bucket.push(new KeyValuePair(key, value));
    this._size++;
  }
}`
  },
  "Heap.ts": {
    complexity: "Push: O(log N), Pop Root: O(log N)",
    description: "A binary heap tree ideal for maintaining prioritized levels. Restores min/max properties quickly.",
    code: `export class MinHeap {
  private heap: number[] = [];

  insert(val: number): void {
    this.heap.push(val);
    this.heapifyUp(this.heap.length - 1);
  }

  extractMin(): number | null {
    if (this.heap.length === 0) return null;
    const min = this.heap[0];
    const last = this.heap.pop()!;
    if (this.heap.length > 0) {
      this.heap[0] = last;
      this.heapifyDown(0);
    }
    return min;
  }
}`
  },
  "Graph.ts": {
    complexity: "Add Vertex: O(1), BFS Recommendation: O(V + E)",
    description: "Roadmap graph representing subject prerequisites. Uses Breadth-First Search (BFS) starting from weak subjects to generate review recommendations.",
    code: `export class Graph {
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

  bfsRecommend(start: string, maxRecommendations: number = 3): string[] {
    const visited: Set<string> = new Set();
    const queue: string[] = [];
    const recommendations: string[] = [];

    visited.add(start);
    queue.push(start);

    while (queue.length > 0 && recommendations.length < maxRecommendations) {
      const current = queue.shift()!;
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
}`
  },
  "Trie.ts": {
    complexity: "Insert: O(L), Search: O(L) where L is string length",
    description: "A prefix tree for fast autocomplete of tags and subject queries. Traverses character nodes down the key paths.",
    code: `export class TrieNode {
  public children: { [char: string]: TrieNode } = {};
  public isEndOfWord: boolean = false;
  public wordText: string = "";
}

export class Trie {
  private root: TrieNode = new TrieNode();

  public insert(word: string): void {
    const cleanWord = word.trim().toLowerCase();
    let current = this.root;
    for (let char of cleanWord) {
      if (!current.children[char]) {
        current.children[char] = new TrieNode();
      }
      current = current.children[char];
    }
    current.isEndOfWord = true;
    current.wordText = word;
  }

  public getSuggestions(prefix: string): string[] {
    const cleanPrefix = prefix.trim().toLowerCase();
    let current = this.root;
    for (let char of cleanPrefix) {
      if (!current.children[char]) return [];
      current = current.children[char];
    }
    const suggestions: string[] = [];
    this.collectSuggestions(current, suggestions);
    return suggestions;
  }

  private collectSuggestions(node: TrieNode, results: string[]): void {
    if (node.isEndOfWord && node.wordText) {
      results.push(node.wordText);
    }
    for (const char in node.children) {
      this.collectSuggestions(node.children[char], results);
    }
  }
}`
  }
};

// BST tree structure for visualizer state
interface VisualBSTNode {
  val: number;
  left: VisualBSTNode | null;
  right: VisualBSTNode | null;
}

export default function DsaLabPage() {
  const { playSound } = useAppState();
  
  // Selection
  const [selectedFile, setSelectedFile] = useState<string>("Stack.ts");
  const [activeTab, setActiveTab] = useState<"visualizer" | "code">("visualizer");

  // Stack Interactive State
  const [stackItems, setStackItems] = useState<string[]>(["Stack Element A", "Stack Element B"]);
  const [stackInput, setStackInput] = useState("");
  const [peekedIndex, setPeekedIndex] = useState<number | null>(null);

  // Queue Interactive State
  const [queueItems, setQueueItems] = useState<string[]>(["Client 1", "Client 2", "Client 3"]);
  const [queueInput, setQueueInput] = useState("");

  // BST Interactive State
  const [bstRoot, setBstRoot] = useState<VisualBSTNode | null>({
    val: 50,
    left: { val: 30, left: { val: 20, left: null, right: null }, right: { val: 40, left: null, right: null } },
    right: { val: 70, left: { val: 60, left: null, right: null }, right: { val: 80, left: null, right: null } }
  });
  const [bstInput, setBstInput] = useState("");

  // Sorting Interactive State
  const [sortingArray, setSortingArray] = useState<number[]>([45, 12, 89, 34, 67, 23, 78, 51]);
  const [comparedIndices, setComparedIndices] = useState<number[]>([]);
  const [swappingIndices, setSwappingIndices] = useState<number[]>([]);
  const [isSorting, setIsSorting] = useState(false);

  // Trie Interactive State
  const [trieInput, setTrieInput] = useState("");
  const [trieInsertedWords, setTrieInsertedWords] = useState<string[]>([
    "Stack", "Queue", "Tree", "Graph", "Heap", "Hashmap", "Recursion", "BinarySearch"
  ]);
  const trieSuggestions = useMemo(() => {
    if (!trieInput) return [];
    const cleanPrefix = trieInput.toLowerCase();
    return trieInsertedWords.filter(w => w.toLowerCase().startsWith(cleanPrefix));
  }, [trieInput, trieInsertedWords]);

  const trieHighlightedPath = useMemo(() => {
    if (!trieInput) return [];
    const cleanPrefix = trieInput.toLowerCase();
    const path = ["Root"];
    for (let i = 0; i < cleanPrefix.length; i++) {
      path.push(cleanPrefix[i].toUpperCase());
    }
    return path;
  }, [trieInput]);

  // Graph Interactive State
  const [selectedGraphNode, setSelectedGraphNode] = useState<string | null>("Data Structures");
  const [bfsTraceLog, setBfsTraceLog] = useState<string[]>([]);
  const [bfsQueue, setBfsQueue] = useState<string[]>([]);
  const [graphRecommendations, setGraphRecommendations] = useState<string[]>([]);
  const [graphVisitedNodes, setGraphVisitedNodes] = useState<string[]>([]);
  const [isBfsRunning, setIsBfsRunning] = useState(false);

  const graphNodes = [
    "Data Structures", "Algorithms", "Java", "Python", "DBMS", "SQL", "Computer Networks", "Cloud Computing"
  ];
  const graphEdges: { [key: string]: string[] } = {
    "Data Structures": ["Algorithms"],
    "Algorithms": ["Java", "Python"],
    "Java": [],
    "Python": [],
    "DBMS": ["SQL"],
    "SQL": [],
    "Computer Networks": ["Cloud Computing"],
    "Cloud Computing": []
  };

  // Node position coordinates for SVG graph
  const nodePositions: { [key: string]: { x: number; y: number } } = {
    "Data Structures": { x: 80, y: 35 },
    "Algorithms": { x: 80, y: 110 },
    "Java": { x: 30, y: 175 },
    "Python": { x: 130, y: 175 },
    "DBMS": { x: 260, y: 35 },
    "SQL": { x: 260, y: 110 },
    "Computer Networks": { x: 380, y: 35 },
    "Cloud Computing": { x: 380, y: 110 }
  };

  // Sound alert helpers
  const triggerClick = () => playSound("click");
  const triggerSuccess = () => playSound("correct");

  // --- Stack Operators ---
  const handleStackPush = () => {
    triggerClick();
    if (!stackInput.trim()) return;
    setStackItems(prev => [...prev, stackInput.trim()]);
    setStackInput("");
    setPeekedIndex(null);
  };

  const handleStackPop = () => {
    if (stackItems.length === 0) {
      playSound("incorrect");
      return;
    }
    triggerClick();
    setStackItems(prev => prev.slice(0, -1));
    setPeekedIndex(null);
  };

  const handleStackPeek = () => {
    if (stackItems.length === 0) {
      playSound("incorrect");
      return;
    }
    triggerSuccess();
    setPeekedIndex(stackItems.length - 1);
    setTimeout(() => setPeekedIndex(null), 1500);
  };

  // --- Queue Operators ---
  const handleQueueEnqueue = () => {
    triggerClick();
    if (!queueInput.trim()) return;
    setQueueItems(prev => [...prev, queueInput.trim()]);
    setQueueInput("");
  };

  const handleQueueDequeue = () => {
    if (queueItems.length === 0) {
      playSound("incorrect");
      return;
    }
    triggerClick();
    setQueueItems(prev => prev.slice(1));
  };

  // --- BST Operators ---
  const insertIntoBstState = (node: VisualBSTNode | null, value: number): VisualBSTNode => {
    if (node === null) {
      return { val: value, left: null, right: null };
    }
    if (value < node.val) {
      node.left = insertIntoBstState(node.left, value);
    } else if (value > node.val) {
      node.right = insertIntoBstState(node.right, value);
    }
    return { ...node };
  };

  const handleBstInsert = () => {
    triggerClick();
    const val = parseInt(bstInput);
    if (isNaN(val)) return;
    setBstRoot(prev => insertIntoBstState(prev, val));
    setBstInput("");
    triggerSuccess();
  };

  // --- Sorting Simulation ---
  const handleShuffleArray = () => {
    triggerClick();
    const shuffled = [...sortingArray].sort(() => Math.random() - 0.5);
    setSortingArray(shuffled);
    setComparedIndices([]);
    setSwappingIndices([]);
  };

  const runBubbleSort = async () => {
    if (isSorting) return;
    setIsSorting(true);
    triggerClick();
    const arr = [...sortingArray];
    const len = arr.length;
    
    for (let i = 0; i < len; i++) {
      for (let j = 0; j < len - i - 1; j++) {
        setComparedIndices([j, j + 1]);
        await new Promise(resolve => setTimeout(resolve, 300));
        
        if (arr[j] > arr[j + 1]) {
          setSwappingIndices([j, j + 1]);
          playSound("click");
          const temp = arr[j];
          arr[j] = arr[j + 1];
          arr[j + 1] = temp;
          setSortingArray([...arr]);
          await new Promise(resolve => setTimeout(resolve, 300));
          setSwappingIndices([]);
        }
      }
    }
    
    setComparedIndices([]);
    setSwappingIndices([]);
    setIsSorting(false);
    triggerSuccess();
  };

  // --- Trie Operators ---
  const handleTrieInsert = () => {
    triggerClick();
    const word = trieInput.trim();
    if (!word) return;
    if (trieInsertedWords.some(w => w.toLowerCase() === word.toLowerCase())) {
      playSound("incorrect");
      return;
    }
    setTrieInsertedWords(prev => [...prev, word]);
    setTrieInput("");
    triggerSuccess();
  };



  // --- Graph BFS Operators ---
  const runGraphBfs = async (startNode: string) => {
    if (isBfsRunning) return;
    setIsBfsRunning(true);
    setSelectedGraphNode(startNode);
    setBfsTraceLog([`[BFS Start] Root node: "${startNode}"`]);
    setBfsQueue([startNode]);
    setGraphVisitedNodes([]);
    setGraphRecommendations([]);
    playSound("click");

    const visited = new Set<string>();
    const queue: string[] = [startNode];
    const recs: string[] = [];
    visited.add(startNode);

    setGraphVisitedNodes([startNode]);

    await new Promise(resolve => setTimeout(resolve, 800));

    while (queue.length > 0) {
      const current = queue.shift()!;
      setBfsQueue([...queue]);
      setBfsTraceLog(prev => [...prev, `Dequeued: "${current}"`]);

      if (current !== startNode) {
        recs.push(current);
        setGraphRecommendations([...recs]);
        playSound("correct");
        setBfsTraceLog(prev => [...prev, `💡 Recommended review topic: "${current}"`]);
        await new Promise(resolve => setTimeout(resolve, 600));
      }

      const neighbors = graphEdges[current] || [];
      for (const neighbor of neighbors) {
        if (!visited.has(neighbor)) {
          visited.add(neighbor);
          queue.push(neighbor);
          setBfsQueue([...queue]);
          setGraphVisitedNodes(prev => [...prev, neighbor]);
          setBfsTraceLog(prev => [...prev, `Enqueued neighbor: "${neighbor}"`]);
          playSound("click");
          await new Promise(resolve => setTimeout(resolve, 600));
        }
      }
    }

    setBfsTraceLog(prev => [...prev, `[BFS Finished] Traversal complete.`]);
    setIsBfsRunning(false);
    triggerSuccess();
  };

  // Rendering BST Recursively
  const renderBstTree = (node: VisualBSTNode | null, x: number = 50, y: number = 20, step: number = 20): React.ReactNode => {
    if (node === null) return null;
    return (
      <g key={node.val}>
        {/* Draw branch lines */}
        {node.left && (
          <line 
            x1={`${x}%`} 
            y1={`${y}%`} 
            x2={`${x - step}%`} 
            y2={`${y + 20}%`} 
            className="stroke-purple-500/40 stroke-2" 
          />
        )}
        {node.right && (
          <line 
            x1={`${x}%`} 
            y1={`${y}%`} 
            x2={`${x + step}%`} 
            y2={`${y + 20}%`} 
            className="stroke-purple-500/40 stroke-2" 
          />
        )}

        {/* Node circle */}
        <circle 
          cx={`${x}%`} 
          cy={`${y}%`} 
          r="16" 
          className="fill-slate-900 stroke-purple-500 stroke-2" 
        />
        <text 
          x={`${x}%`} 
          y={`${y}%`} 
          textAnchor="middle" 
          dy=".3em" 
          className="text-[10px] font-black fill-white"
        >
          {node.val}
        </text>

        {/* Recursion */}
        {renderBstTree(node.left, x - step, y + 20, step / 1.8)}
        {renderBstTree(node.right, x + step, y + 20, step / 1.8)}
      </g>
    );
  };

  return (
    <div className="space-y-8 pb-12">
      {/* HEADER */}
      <section className="text-center max-w-2xl mx-auto space-y-3 py-6">
        <h2 className="text-3xl font-extrabold text-white tracking-tight flex items-center justify-center space-x-2">
          <Terminal className="h-8 w-8 text-purple-500" />
          <span>DSA Interactive Code Lab</span>
        </h2>
        <p className="text-sm text-slate-400">
          Trace structural operations, run algorithmic animations, and explore codebases.
        </p>
      </section>

      {/* SPLIT VIEW LAYOUT */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 items-start">
        
        {/* FILES SIDEBAR */}
        <div className="glass rounded-2xl p-4 border border-white/5 space-y-3">
          <div className="flex items-center space-x-2 text-xs font-bold text-white uppercase tracking-wider px-2 py-1 text-slate-400 border-b border-white/5 pb-2">
            <BookOpen className="h-4 w-4" />
            <span>DSA Implementations</span>
          </div>

          <div className="space-y-1">
            {Object.keys(dsaCodes).map(filename => (
              <button
                key={filename}
                onClick={() => { playSound("click"); setSelectedFile(filename); }}
                className={`w-full text-left py-2 px-3 rounded-xl text-xs font-medium transition flex items-center justify-between border ${
                  selectedFile === filename 
                    ? "bg-purple-600/20 border-purple-500 text-white font-bold" 
                    : "bg-transparent border-transparent text-slate-400 hover:text-white hover:bg-white/5"
                }`}
              >
                <span>{filename}</span>
                <span className="text-[9px] px-1.5 py-0.5 rounded bg-slate-900 text-slate-500 font-bold uppercase">
                  {filename.split(".")[0]}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* ACTIVE WORKSPACE AREA */}
        <div className="lg:col-span-3 space-y-6">
          
          {/* CONTROL TAB */}
          <div className="flex items-center justify-between bg-slate-950/60 p-2.5 border border-white/5 rounded-2xl">
            <div className="flex items-center space-x-4">
              <div>
                <h3 className="text-sm font-bold text-white px-2">{selectedFile} Explorer</h3>
                <p className="text-[10px] text-purple-400 px-2 font-medium">{dsaCodes[selectedFile].complexity}</p>
              </div>
            </div>

            <div className="flex bg-slate-900 rounded-xl p-1 border border-white/5">
              <button
                onClick={() => { playSound("click"); setActiveTab("visualizer"); }}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                  activeTab === "visualizer" ? "bg-purple-600 text-white" : "text-slate-400 hover:text-white"
                }`}
              >
                Visual Sandbox
              </button>
              <button
                onClick={() => { playSound("click"); setActiveTab("code"); }}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                  activeTab === "code" ? "bg-purple-600 text-white" : "text-slate-400 hover:text-white"
                }`}
              >
                Source Code
              </button>
            </div>
          </div>

          {/* MAIN TAB CONTENT */}
          {activeTab === "visualizer" ? (
            <div className="glass rounded-3xl p-6 border border-white/5 min-h-[380px] flex flex-col justify-between space-y-6 relative overflow-hidden">
              
              {/* Description */}
              <div className="text-xs text-slate-400 leading-relaxed bg-slate-950/30 border border-white/5 p-3 rounded-xl flex items-center space-x-2">
                <Sparkles className="h-4 w-4 text-purple-400 flex-shrink-0" />
                <span>{dsaCodes[selectedFile].description}</span>
              </div>

              {/* VISUALIZERS SWITCH CASE */}
              <div className="flex-1 flex items-center justify-center py-4">
                
                {/* 1. STACK VISUALIZER */}
                {selectedFile === "Stack.ts" && (
                  <div className="flex flex-col items-center space-y-4 w-full max-w-xs">
                    <div className="w-full border-2 border-dashed border-purple-500/20 rounded-2xl p-4 bg-slate-950/40 min-h-[220px] flex flex-col-reverse justify-start gap-2 relative">
                      <div className="absolute bottom-2 left-1/2 -translate-x-1/2 text-[9px] font-bold text-slate-600 uppercase tracking-widest">
                        Stack Base
                      </div>
                      
                      <AnimatePresence>
                        {stackItems.map((item, idx) => {
                          const isPeeked = idx === peekedIndex;
                          return (
                            <motion.div
                              key={idx}
                              initial={{ opacity: 0, scale: 0.8, y: -20 }}
                              animate={{ 
                                opacity: 1, 
                                scale: 1, 
                                y: 0,
                                borderColor: isPeeked ? "rgb(168, 85, 247)" : "rgba(255,255,255,0.05)",
                                backgroundColor: isPeeked ? "rgba(168, 85, 247, 0.2)" : "rgba(255,255,255,0.02)"
                              }}
                              exit={{ opacity: 0, scale: 0.8, y: 20 }}
                              transition={{ type: "spring", stiffness: 300, damping: 20 }}
                              className="w-full py-2.5 px-4 rounded-xl border font-bold text-xs text-center text-slate-300 flex justify-between items-center"
                            >
                              <span className="text-[10px] text-purple-400">[{idx}]</span>
                              <span>{item}</span>
                              <span className="text-[8px] text-slate-500 uppercase">{idx === stackItems.length - 1 ? "Top" : ""}</span>
                            </motion.div>
                          );
                        })}
                      </AnimatePresence>

                      {stackItems.length === 0 && (
                        <div className="flex-1 flex items-center justify-center text-xs text-slate-500 italic">
                          Stack is empty. Push elements onto the stack!
                        </div>
                      )}
                    </div>

                    {/* Inputs */}
                    <div className="flex gap-2 w-full">
                      <input
                        type="text"
                        placeholder="Push element..."
                        value={stackInput}
                        onChange={e => setStackInput(e.target.value)}
                        onKeyDown={e => e.key === "Enter" && handleStackPush()}
                        className="flex-1 bg-slate-900 border border-white/10 rounded-xl py-2 px-3 text-xs text-white focus:outline-none focus:border-purple-500"
                      />
                      <button 
                        onClick={handleStackPush}
                        className="px-3 py-2 bg-purple-600 hover:bg-purple-500 text-white rounded-xl text-xs font-bold"
                      >
                        Push
                      </button>
                      <button 
                        onClick={handleStackPop}
                        className="px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-bold"
                      >
                        Pop
                      </button>
                      <button 
                        onClick={handleStackPeek}
                        className="p-2 bg-slate-800 hover:bg-slate-700 text-purple-400 rounded-xl"
                        title="Peek"
                      >
                        <ArrowUp className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                )}

                {/* 2. QUEUE VISUALIZER */}
                {selectedFile === "Queue.ts" && (
                  <div className="flex flex-col items-center space-y-6 w-full">
                    <div className="w-full max-w-md border border-white/5 rounded-2xl p-4 bg-slate-950/40 min-h-[120px] flex items-center gap-2 overflow-x-auto relative">
                      <div className="absolute left-2 top-2 text-[8px] font-bold text-slate-600 uppercase tracking-widest">
                        ◀ Head (Dequeue)
                      </div>
                      <div className="absolute right-2 top-2 text-[8px] font-bold text-slate-600 uppercase tracking-widest">
                        Tail (Enqueue) ◀
                      </div>

                      <AnimatePresence>
                        {queueItems.map((item, idx) => (
                          <motion.div
                            key={idx}
                            initial={{ opacity: 0, scale: 0.8, x: 30 }}
                            animate={{ opacity: 1, scale: 1, x: 0 }}
                            exit={{ opacity: 0, scale: 0.8, x: -30 }}
                            className="py-3 px-4 rounded-xl border border-white/5 bg-slate-900/60 font-bold text-xs text-center text-slate-300 flex-shrink-0 min-w-[90px] flex flex-col justify-center space-y-1"
                          >
                            <span className="text-[9px] text-blue-400 font-black">[{idx}]</span>
                            <span>{item}</span>
                          </motion.div>
                        ))}
                      </AnimatePresence>

                      {queueItems.length === 0 && (
                        <div className="flex-1 text-center text-xs text-slate-500 italic py-4">
                          Queue is empty. Enqueue nodes!
                        </div>
                      )}
                    </div>

                    {/* Inputs */}
                    <div className="flex gap-2 max-w-xs w-full">
                      <input
                        type="text"
                        placeholder="Enqueue item..."
                        value={queueInput}
                        onChange={e => setQueueInput(e.target.value)}
                        onKeyDown={e => e.key === "Enter" && handleQueueEnqueue()}
                        className="flex-1 bg-slate-900 border border-white/10 rounded-xl py-2 px-3 text-xs text-white focus:outline-none focus:border-purple-500"
                      />
                      <button 
                        onClick={handleQueueEnqueue}
                        className="px-3 py-2 bg-purple-600 hover:bg-purple-500 text-white rounded-xl text-xs font-bold"
                      >
                        Enqueue
                      </button>
                      <button 
                        onClick={handleQueueDequeue}
                        className="px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-bold"
                      >
                        Dequeue
                      </button>
                    </div>
                  </div>
                )}

                {/* 3. CIRCULAR QUEUE */}
                {selectedFile === "CircularQueue.ts" && (
                  <div className="flex flex-col items-center space-y-6 w-full">
                    {/* Ring circular items */}
                    <div className="relative w-44 h-44 flex items-center justify-center">
                      <div className="absolute inset-0 rounded-full border-4 border-dashed border-white/5 animate-[spin_40s_linear_infinite]" />
                      
                      {/* Fixed positions for 5 circular slots */}
                      {[0, 1, 2, 3, 4].map(idx => {
                        const angle = (idx * 360) / 5;
                        const radius = 64; // px
                        const x = Math.round(radius * Math.cos((angle - 90) * (Math.PI / 180)));
                        const y = Math.round(radius * Math.sin((angle - 90) * (Math.PI / 180)));
                        
                        const itemVal = queueItems[idx] || null;

                        return (
                          <div
                            key={idx}
                            style={{ transform: `translate(${x}px, ${y}px)` }}
                            className={`absolute w-12 h-12 rounded-full border flex flex-col items-center justify-center text-[10px] font-bold transition-all duration-300 ${
                              itemVal 
                                ? "bg-purple-600/20 border-purple-500 text-white" 
                                : "bg-slate-950 border-white/5 text-slate-600"
                            }`}
                          >
                            <span className="text-[8px] opacity-40">{idx}</span>
                            <span className="truncate max-w-[40px]">{itemVal || "-"}</span>
                          </div>
                        );
                      })}

                      <div className="text-center space-y-0.5">
                        <div className="text-[9px] font-bold text-slate-500 uppercase">Ring size</div>
                        <div className="text-lg font-black text-purple-400">5 Slots</div>
                      </div>
                    </div>

                    <div className="flex gap-2 max-w-xs w-full">
                      <input
                        type="text"
                        placeholder="Ring push..."
                        value={queueInput}
                        onChange={e => setQueueInput(e.target.value)}
                        onKeyDown={e => e.key === "Enter" && handleQueueEnqueue()}
                        className="flex-1 bg-slate-900 border border-white/10 rounded-xl py-2 px-3 text-xs text-white focus:outline-none"
                      />
                      <button 
                        onClick={handleQueueEnqueue}
                        disabled={queueItems.length >= 5}
                        className="px-3 py-2 bg-purple-600 hover:bg-purple-500 text-white rounded-xl text-xs font-bold disabled:opacity-40"
                      >
                        Push
                      </button>
                      <button 
                        onClick={handleQueueDequeue}
                        className="px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-bold"
                      >
                        Pop
                      </button>
                    </div>
                  </div>
                )}

                {/* 4. BST VISUALIZER */}
                {selectedFile === "BST.ts" && (
                  <div className="flex flex-col items-center space-y-4 w-full">
                    <div className="w-full max-w-md bg-slate-950/40 border border-white/5 rounded-2xl p-4 min-h-[220px] flex items-center justify-center">
                      <svg className="w-full h-[200px]">
                        {renderBstTree(bstRoot)}
                      </svg>
                    </div>

                    {/* Inputs */}
                    <div className="flex gap-2 max-w-xs w-full">
                      <input
                        type="number"
                        placeholder="Insert numeric value (e.g. 55)..."
                        value={bstInput}
                        onChange={e => setBstInput(e.target.value)}
                        onKeyDown={e => e.key === "Enter" && handleBstInsert()}
                        className="flex-1 bg-slate-900 border border-white/10 rounded-xl py-2 px-3 text-xs text-white focus:outline-none focus:border-purple-500"
                      />
                      <button 
                        onClick={handleBstInsert}
                        className="px-4 py-2 bg-purple-600 hover:bg-purple-500 text-white rounded-xl text-xs font-bold"
                      >
                        Insert Node
                      </button>
                      <button 
                        onClick={() => { triggerClick(); setBstRoot(null); }}
                        className="p-2 bg-slate-800 hover:bg-slate-700 text-slate-400 rounded-xl"
                        title="Clear Tree"
                      >
                        <RotateCcw className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                )}

                {/* 5. HASH MAP & HEAPS (SORTING ALGORITHMS ANIMATOR) */}
                {(selectedFile === "HashMap.ts" || selectedFile === "Heap.ts") && (
                  <div className="flex flex-col items-center space-y-6 w-full max-w-md">
                    {/* Visualizer bars */}
                    <div className="w-full bg-slate-950/40 border border-white/5 rounded-2xl p-6 h-[180px] flex items-end justify-between gap-2 relative">
                      {sortingArray.map((val, idx) => {
                        const isComparing = comparedIndices.includes(idx);
                        const isSwapping = swappingIndices.includes(idx);
                        
                        let barColor = "bg-purple-600/40 border-purple-500/60";
                        if (isSwapping) {
                          barColor = "bg-red-500/60 border-red-400 animate-pulse";
                        } else if (isComparing) {
                          barColor = "bg-yellow-500/60 border-yellow-400";
                        }

                        return (
                          <div key={idx} className="flex-1 flex flex-col items-center">
                            <span className="text-[9px] text-slate-500 font-bold mb-1">{val}</span>
                            <div 
                              style={{ height: `${val * 1.3}px` }}
                              className={`w-full rounded-t-lg border transition-all duration-300 ${barColor}`}
                            />
                          </div>
                        );
                      })}
                    </div>

                    <div className="flex gap-2">
                      <button
                        onClick={runBubbleSort}
                        disabled={isSorting}
                        className="px-4 py-2 bg-purple-600 hover:bg-purple-500 text-white rounded-xl text-xs font-bold flex items-center space-x-1.5 disabled:opacity-40"
                      >
                        <Play className="h-3.5 w-3.5 fill-current" />
                        <span>Run Visual Bubble Sort</span>
                      </button>
                      <button
                        onClick={handleShuffleArray}
                        disabled={isSorting}
                        className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-bold flex items-center space-x-1.5"
                      >
                        <RotateCcw className="h-3.5 w-3.5" />
                        <span>Shuffle</span>
                      </button>
                    </div>
                  </div>
                )}

                {/* 6. GRAPH BFS RECOMMENDATION VISUALIZER */}
                {selectedFile === "Graph.ts" && (
                  <div className="flex flex-col md:flex-row items-stretch gap-6 w-full max-w-4xl">
                    {/* Visualizer Area */}
                    <div className="flex-1 bg-slate-950/40 border border-white/5 rounded-2xl p-4 flex flex-col items-center justify-center">
                      <div className="text-xs text-slate-400 mb-3 flex items-center justify-between w-full">
                        <span>Graph Learning Path Roadmap</span>
                        <span className="text-[10px] text-purple-400">Click a node to start BFS</span>
                      </div>
                      <svg className="w-full h-[240px] bg-slate-900/50 rounded-xl border border-white/5" viewBox="0 0 460 220">
                        <defs>
                          <marker id="arrow" viewBox="0 0 10 10" refX="22" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                            <path d="M 0 0 L 10 5 L 0 10 z" fill="#8b5cf6" opacity="0.6" />
                          </marker>
                        </defs>
                        
                        {/* Draw connection lines (Edges) */}
                        {Object.entries(graphEdges).map(([source, targets]) => {
                          const start = nodePositions[source];
                          if (!start) return null;
                          return targets.map(target => {
                            const end = nodePositions[target];
                            if (!end) return null;
                            const isPathVisited = graphVisitedNodes.includes(source) && graphVisitedNodes.includes(target);
                            return (
                              <line
                                key={`${source}-${target}`}
                                x1={start.x}
                                y1={start.y}
                                x2={end.x}
                                y2={end.y}
                                markerEnd="url(#arrow)"
                                className={`transition-all duration-300 stroke-2 ${
                                  isPathVisited ? "stroke-purple-500 shadow-lg" : "stroke-slate-700/60"
                                }`}
                              />
                            );
                          });
                        })}

                        {/* Draw node circles */}
                        {graphNodes.map(node => {
                          const pos = nodePositions[node];
                          if (!pos) return null;
                          
                          const isVisited = graphVisitedNodes.includes(node);
                          const isActive = bfsQueue[0] === node;
                          const isQueued = bfsQueue.slice(1).includes(node);
                          const isSelected = selectedGraphNode === node;
                          
                          let circleStyle = "fill-slate-950 stroke-slate-800";
                          let textStyle = "fill-slate-400";
                          if (isActive) {
                            circleStyle = "fill-yellow-500/20 stroke-yellow-400 animate-pulse stroke-2";
                            textStyle = "fill-yellow-200 font-bold";
                          } else if (isQueued) {
                            circleStyle = "fill-blue-500/20 stroke-blue-400 stroke-2";
                            textStyle = "fill-blue-200";
                          } else if (isVisited) {
                            circleStyle = "fill-purple-600/20 stroke-purple-500 stroke-2";
                            textStyle = "fill-purple-200";
                          } else if (isSelected) {
                            circleStyle = "fill-slate-800 stroke-white stroke-2";
                            textStyle = "fill-white";
                          }

                          return (
                            <g 
                              key={node} 
                              className="cursor-pointer" 
                              onClick={() => {
                                if (!isBfsRunning) {
                                  setSelectedGraphNode(node);
                                  triggerClick();
                                  runGraphBfs(node);
                                }
                              }}
                            >
                              <circle
                                cx={pos.x}
                                cy={pos.y}
                                r="14"
                                className={`transition-all duration-300 ${circleStyle}`}
                              />
                              <text
                                x={pos.x}
                                y={pos.y + 24}
                                textAnchor="middle"
                                className={`text-[8px] select-none ${textStyle}`}
                              >
                                {node}
                              </text>
                            </g>
                          );
                        })}
                      </svg>

                      {/* Run button */}
                      <div className="mt-4 flex items-center justify-between w-full gap-4">
                        <span className="text-[10px] text-slate-500">
                          Selected Root: <strong className="text-white">{selectedGraphNode || "None"}</strong>
                        </span>
                        <button
                          onClick={() => selectedGraphNode && runGraphBfs(selectedGraphNode)}
                          disabled={isBfsRunning || !selectedGraphNode}
                          className="px-4 py-2 bg-purple-600 hover:bg-purple-500 text-white rounded-xl text-xs font-bold flex items-center space-x-1.5 disabled:opacity-40"
                        >
                          <Play className="h-3.5 w-3.5 fill-current" />
                          <span>Run BFS Recommendation</span>
                        </button>
                      </div>
                    </div>

                    {/* BFS Console & Results */}
                    <div className="w-full md:w-[260px] bg-slate-950/60 border border-white/5 rounded-2xl p-4 flex flex-col justify-between space-y-4">
                      {/* BFS Queue */}
                      <div>
                        <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-2">BFS Queue</div>
                        <div className="flex items-center gap-1.5 overflow-x-auto min-h-[36px] bg-slate-900/50 p-1.5 rounded-xl border border-white/5">
                          {bfsQueue.length === 0 ? (
                            <span className="text-[10px] text-slate-600 italic">Empty Queue</span>
                          ) : (
                            bfsQueue.map((qNode, idx) => (
                              <div key={idx} className="px-2 py-1 bg-blue-500/20 border border-blue-400 text-blue-200 text-[9px] rounded-lg font-mono whitespace-nowrap">
                                {qNode}
                              </div>
                            ))
                          )}
                        </div>
                      </div>

                      {/* BFS Trace Console */}
                      <div>
                        <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-2 flex items-center gap-1">
                          <Terminal className="h-3 w-3" />
                          <span>Trace Execution Logs</span>
                        </div>
                        <div className="h-[90px] overflow-y-auto bg-black/60 p-2.5 rounded-xl border border-white/5 font-mono text-[9px] text-slate-300 space-y-1">
                          {bfsTraceLog.length === 0 ? (
                            <div className="text-slate-600 italic">Logs will output here...</div>
                          ) : (
                            bfsTraceLog.map((log, index) => (
                              <div key={index} className="leading-tight">{log}</div>
                            ))
                          )}
                        </div>
                      </div>

                      {/* BFS Outputs (Recommendations) */}
                      <div>
                        <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">Recommendations</div>
                        <div className="space-y-1">
                          {graphRecommendations.length === 0 ? (
                            <div className="text-[10px] text-slate-600 italic py-1">No recommendations generated yet.</div>
                          ) : (
                            graphRecommendations.map((rec, index) => (
                              <div key={index} className="flex items-center space-x-2 text-[11px] text-purple-200 bg-purple-500/10 border border-purple-500/25 px-2.5 py-1.5 rounded-xl font-bold">
                                <Sparkles className="h-3 w-3 text-purple-400 fill-current" />
                                <span>{rec}</span>
                              </div>
                            ))
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* 7. TRIE PREFIX AUTOCOMPLETE VISUALIZER */}
                {selectedFile === "Trie.ts" && (
                  <div className="flex flex-col md:flex-row items-stretch gap-6 w-full max-w-4xl">
                    <div className="flex-1 bg-slate-950/40 border border-white/5 rounded-2xl p-4 flex flex-col justify-between space-y-4">
                      <div>
                        <div className="text-xs text-slate-400 mb-2">Live Prefix Search / Autocomplete</div>
                        <div className="flex gap-2">
                          <input
                            type="text"
                            placeholder="Type a prefix (e.g. 'St', 'Qu', 'Tr')..."
                            value={trieInput}
                            onChange={e => setTrieInput(e.target.value)}
                            className="flex-1 bg-slate-900 border border-white/10 rounded-xl py-2 px-3 text-xs text-white focus:outline-none focus:border-purple-500"
                          />
                          <button
                            onClick={handleTrieInsert}
                            className="px-4 py-2 bg-purple-600 hover:bg-purple-500 text-white rounded-xl text-xs font-bold"
                          >
                            Insert Tag
                          </button>
                        </div>
                      </div>

                      {/* Traversed Trie Key Path Nodes */}
                      <div>
                        <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-2">Trie Node Traversal Path</div>
                        <div className="bg-slate-900/50 border border-white/5 p-4 rounded-xl flex items-center gap-2 overflow-x-auto min-h-[64px]">
                          {trieHighlightedPath.length === 0 ? (
                            <span className="text-[10px] text-slate-600 italic">Begin typing prefix to see node highlights...</span>
                          ) : (
                            trieHighlightedPath.map((nodeChar, idx) => (
                              <div key={idx} className="flex items-center">
                                {idx > 0 && <span className="text-purple-500 text-xs mx-1">➔</span>}
                                <div className={`w-8 h-8 rounded-full border flex items-center justify-center font-bold text-xs shadow-lg transition-all duration-300 ${
                                  idx === 0 
                                    ? "bg-slate-950 border-purple-500 text-purple-400" 
                                    : "bg-purple-600/20 border-purple-400 text-white animate-pulse"
                                }`}>
                                  {nodeChar}
                                </div>
                              </div>
                            ))
                          )}
                        </div>
                      </div>

                      {/* Suggestions list */}
                      <div>
                        <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-2">Matched Tag Suggestions</div>
                        <div className="flex flex-wrap gap-1.5 min-h-[36px]">
                          {trieSuggestions.length === 0 ? (
                            <span className="text-[10px] text-slate-600 italic">No matching suggestions</span>
                          ) : (
                            trieSuggestions.map((suggestion, idx) => (
                              <button
                                key={idx}
                                onClick={() => {
                                  triggerClick();
                                  setTrieInput(suggestion);
                                }}
                                className="px-2.5 py-1 bg-purple-600/10 hover:bg-purple-600/20 border border-purple-500/20 text-purple-300 text-xs rounded-xl font-medium transition"
                              >
                                {suggestion}
                              </button>
                            ))
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Trie Dictionary Status */}
                    <div className="w-full md:w-[260px] bg-slate-950/60 border border-white/5 rounded-2xl p-4 flex flex-col space-y-3">
                      <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Trie Tag Dictionary</div>
                      <div className="flex-1 overflow-y-auto max-h-[180px] bg-black/60 p-2.5 rounded-xl border border-white/5 space-y-1">
                        {trieInsertedWords.map((word, idx) => (
                          <div key={idx} className="text-slate-300 text-xs py-1 px-1.5 rounded bg-slate-900/40 border border-white/5 flex items-center justify-between">
                            <span className="font-mono">{word}</span>
                            <span className="text-[8px] text-purple-400 px-1 py-0.5 rounded bg-purple-500/10 font-bold uppercase">Stored</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

              </div>
              
            </div>
          ) : (
            // CODE VIEWER TAB
            <div className="glass rounded-3xl border border-white/5 relative overflow-hidden">
              <div className="bg-slate-950/80 p-3 border-b border-white/5 flex items-center justify-between text-xs text-slate-400 font-mono">
                <span>src/lib/dsa/{selectedFile}</span>
                <span className="text-[9px] text-purple-400 uppercase font-bold">TypeScript</span>
              </div>
              <pre className="p-5 font-mono text-xs text-slate-300 overflow-x-auto leading-relaxed bg-[#0b0c16]/50 max-h-[420px]">
                <code>{dsaCodes[selectedFile].code}</code>
              </pre>
            </div>
          )}

        </div>
        
      </div>
      
    </div>
  );
}
