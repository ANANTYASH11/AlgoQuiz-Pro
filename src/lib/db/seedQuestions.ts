export interface Question {
  id: number;
  subject: string;
  type: "mcq" | "multiple" | "true_false" | "fill_blank" | "code_output" | "arrange" | "match" | "logic" | "image";
  difficulty: "Easy" | "Medium" | "Hard" | "Expert";
  difficultyValue: number; // 1-10 scale for backtracking/DP recommendations
  questionText: string;
  codeSnippet?: string;
  imageRepresentation?: string; // SVG code or description representation
  options?: string[]; // Used for MCQ, Multiple, and Match left items
  matchRight?: string[]; // Used for Match right items (matching with options index-to-index)
  correctAnswer: string | number | number[] | Record<number, number>;
  hint: string;
  explanation: string;
  tags: string[];
}

export const staticQuestions: Question[] = [
  {
    id: 1,
    subject: "Data Structures",
    type: "mcq",
    difficulty: "Easy",
    difficultyValue: 2,
    questionText: "Which data structure operates on a Last-In, First-Out (LIFO) basis?",
    options: ["Queue", "Stack", "Heap", "Binary Tree"],
    correctAnswer: 1,
    hint: "Think about how plates are stacked on a table: you add to the top and take from the top.",
    explanation: "A Stack utilizes a LIFO structure. Items are pushed onto the stack and popped off the stack from the same end, making the most recently added item the first to be retrieved.",
    tags: ["stack", "basics", "dsa"]
  },
  {
    id: 2,
    subject: "Algorithms",
    type: "code_output",
    difficulty: "Medium",
    difficultyValue: 5,
    questionText: "What is the output of this Python recursive function when called with count(3)?",
    codeSnippet: `def count(n):
    if n <= 0:
        return
    print(n, end="")
    count(n - 1)
    print(n, end="")`,
    correctAnswer: "321123",
    hint: "Trace the call stack. The print statements execute both before and after the recursive call.",
    explanation: "The function prints the number, calls itself with n-1, and then prints the number again after returning. This creates a nested mirror pattern: prints 3, calls count(2) which prints 2, calls count(1) which prints 1, then unwinds: prints 1, prints 2, prints 3.",
    tags: ["recursion", "python", "callstack"]
  },
  {
    id: 3,
    subject: "Operating System",
    type: "true_false",
    difficulty: "Easy",
    difficultyValue: 3,
    questionText: "A deadlock can occur if and only if all four Coffman conditions (Mutual Exclusion, Hold and Wait, No Preemption, Circular Wait) are met simultaneously.",
    options: ["True", "False"],
    correctAnswer: 0,
    hint: "Coffman conditions are the necessary and sufficient conditions for deadlock occurrence.",
    explanation: "Deadlock prevention strategies work by ensuring that at least one of these four conditions is violated, verifying that all four must hold for a deadlock to exist.",
    tags: ["deadlock", "coffman", "theory"]
  },
  {
    id: 4,
    subject: "DBMS",
    type: "fill_blank",
    difficulty: "Medium",
    difficultyValue: 4,
    questionText: "The SQL command used to remove all records from a table without logging individual row deletions, while retaining the table structure, is ________.",
    correctAnswer: "TRUNCATE",
    hint: "It is faster than DELETE and does not take a WHERE clause.",
    explanation: "TRUNCATE TABLE is a DDL operation that empties a table completely. It is faster than DELETE because it deallocates the data pages instead of logging individual row deletions.",
    tags: ["sql", "dbms", "ddl"]
  },
  {
    id: 5,
    subject: "Computer Networks",
    type: "multiple",
    difficulty: "Medium",
    difficultyValue: 6,
    questionText: "Which of the following protocols operate primarily at the Transport Layer of the OSI Model? (Select all that apply)",
    options: ["TCP", "UDP", "IP", "HTTP", "TLS"],
    correctAnswer: [0, 1],
    hint: "Think about port-to-port multiplexing, flow control, and datagram transport protocols.",
    explanation: "TCP (Transmission Control Protocol) and UDP (User Datagram Protocol) are the core Transport Layer protocols. IP operates at the Network Layer, HTTP at the Application Layer, and TLS sits between Application and Transport layers.",
    tags: ["transport-layer", "protocols", "osi"]
  },
  {
    id: 6,
    subject: "Algorithms",
    type: "arrange",
    difficulty: "Hard",
    difficultyValue: 8,
    questionText: "Arrange the steps of the Quick Sort algorithm in the correct logical execution order starting from the first call.",
    options: [
      "Select a pivot element from the array.",
      "Partition the array such that elements smaller than pivot are on the left, and larger are on the right.",
      "Recursively apply Quick Sort to the left partition.",
      "Recursively apply Quick Sort to the right partition.",
      "Combine the sorted sub-arrays (implicit in-place compilation)."
    ],
    correctAnswer: [0, 1, 2, 3, 4],
    hint: "Quick Sort is divide-and-conquer. It first chooses a pivot, partitions, and then recurses on both sides.",
    explanation: "Quick Sort works by selecting a pivot, placing elements relative to the pivot (partitioning), and then sorting the left and right halves recursively in place.",
    tags: ["quicksort", "sorting", "recursion"]
  },
  {
    id: 7,
    subject: "JavaScript",
    type: "code_output",
    difficulty: "Medium",
    difficultyValue: 5,
    questionText: "What is the output of the following JavaScript snippet?",
    codeSnippet: `const obj = {
  value: 42,
  getValue: function() {
    return () => this.value;
  }
};
const unbound = obj.getValue();
console.log(unbound());`,
    correctAnswer: "42",
    hint: "Arrow functions do not have their own 'this'. They inherit 'this' from their enclosing lexical context.",
    explanation: "The arrow function inside getValue captures the lexical 'this' of its parent method, which is 'obj'. Even when unbound is executed globally, 'this' still references 'obj', outputting 42.",
    tags: ["javascript", "this", "closures"]
  },
  {
    id: 8,
    subject: "Data Structures",
    type: "image",
    difficulty: "Medium",
    difficultyValue: 6,
    questionText: "Study the visual representation of this Tree structure. What is the Pre-Order Traversal sequence of this binary tree?",
    imageRepresentation: `
       [A]
      /   \\
    [B]   [C]
    / \\
  [D] [E]
    `,
    options: ["D, B, E, A, C", "A, B, D, E, C", "D, E, B, C, A", "A, B, C, D, E"],
    correctAnswer: 1,
    hint: "Pre-order traversal visits Node, then Left subtree, then Right subtree (N-L-R).",
    explanation: "Pre-order traversal sequence: Visit root (A), go left (B), visit B, go left (D), visit D (leaf, return to B), go right (E), visit E (leaf, return to A), go right (C), visit C.",
    tags: ["tree", "traversal", "binary-tree"]
  },
  {
    id: 9,
    subject: "Data Structures",
    type: "match",
    difficulty: "Hard",
    difficultyValue: 7,
    questionText: "Match the following Data Structures to their optimal search average time complexities.",
    options: [
      "Balanced Binary Search Tree",
      "Hash Table",
      "Singly Linked List",
      "Trie"
    ],
    matchRight: [
      "O(1)",
      "O(log N)",
      "O(N)",
      "O(L) where L is string length"
    ],
    correctAnswer: { 0: 1, 1: 0, 2: 2, 3: 3 },
    hint: "Hash Tables give instant access, trees split search paths in halves, and lists require linear scans.",
    explanation: "Average complexities: Hash Table search is O(1) due to direct hash indexing. Balanced BST divides search space in halves, taking O(log N). Linked Lists require scanning all elements in O(N). Trie matches string characters, taking O(L).",
    tags: ["complexity", "big-o", "dsa"]
  },
  {
    id: 10,
    subject: "Algorithms",
    type: "logic",
    difficulty: "Expert",
    difficultyValue: 9,
    questionText: "In a dynamic programming solution for the 0/1 Knapsack problem, let DP[i][w] represent the max value using first 'i' items with capacity limit 'w'. If the weight of the i-th item is 5, its value is 10, and we have capacity w = 7. Which sub-state transition represents inclusion of this item?",
    options: [
      "DP[i-1][7]",
      "10 + DP[i-1][2]",
      "10 + DP[i-1][7]",
      "DP[i-1][5] - 10"
    ],
    correctAnswer: 1,
    hint: "If you take an item of weight 5, you gain its value (10) and the remaining capacity becomes 7 - 5 = 2.",
    explanation: "The state transition for choosing item i is: val[i] + DP[i-1][w - wt[i]]. Substituting the values: 10 + DP[i-1][7 - 5] which equals 10 + DP[i-1][2].",
    tags: ["dp", "knapsack", "algorithms"]
  },
  {
    id: 11,
    subject: "AI",
    type: "mcq",
    difficulty: "Medium",
    difficultyValue: 5,
    questionText: "Which neural network architecture is primarily responsible for modern LLMs (Large Language Models) like GPT, Claude, and Gemini?",
    options: ["Recurrent Neural Network (RNN)", "Convolutional Neural Network (CNN)", "Transformer Architecture", "Generative Adversarial Network (GAN)"],
    correctAnswer: 2,
    hint: "Introduced in the 2017 paper 'Attention Is All You Need'. Uses self-attention mechanisms.",
    explanation: "The Transformer architecture, featuring self-attention layers, allows parallelized text training and captures long-range context, powering all modern LLMs.",
    tags: ["ai", "transformers", "llm"]
  },
  {
    id: 12,
    subject: "Cloud Computing",
    type: "mcq",
    difficulty: "Easy",
    difficultyValue: 3,
    questionText: "Which service delivery model allows developers to deploy code without managing servers, virtual machines, or runtime environments?",
    options: ["IaaS (Infrastructure as a Service)", "SaaS (Software as a Service)", "FaaS / Serverless (Function as a Service)", "PaaS (Platform as a Service)"],
    correctAnswer: 2,
    hint: "Think AWS Lambda, Google Cloud Functions, or Vercel Serverless Functions.",
    explanation: "FaaS/Serverless allows executing event-driven code blocks where cloud providers dynamically scale resources on demand, leaving no idle server costs for developers.",
    tags: ["cloud", "serverless", "faas"]
  },
  {
    id: 13,
    subject: "Algorithms",
    type: "fill_blank",
    difficulty: "Medium",
    difficultyValue: 4,
    questionText: "A train running at 54 km/hr crosses a post in 20 seconds. What is the length of the train in meters? (Input numbers only)",
    correctAnswer: "300",
    hint: "Convert speed to m/s: multiply by 5/18. Then multiply by time.",
    explanation: "Speed in m/s = 54 * (5/18) = 15 m/s. Distance (train length) = Speed * Time = 15 m/s * 20 s = 300 meters.",
    tags: ["aptitude", "speed-distance", "math"]
  },
  {
    id: 14,
    subject: "Data Structures",
    type: "mcq",
    difficulty: "Medium",
    difficultyValue: 6,
    questionText: "What is the worst-case lookup time complexity in a Hash Table when collisions are resolved using linear chaining? (Assume N elements are in the hash table)",
    options: ["O(1)", "O(log N)", "O(N)", "O(N log N)"],
    correctAnswer: 2,
    hint: "Think about the extreme scenario where every key hashes to the exact same bucket.",
    explanation: "In the absolute worst-case scenario, all N elements end up in a single linked list bucket, degrading lookup to linear search, which takes O(N) time.",
    tags: ["hash", "complexity", "dsa"]
  },
  {
    id: 15,
    subject: "Data Structures",
    type: "mcq",
    difficulty: "Hard",
    difficultyValue: 8,
    questionText: "In a Max Heap containing N elements, what is the time complexity of deleting the maximum element (root) and restoring the heap property?",
    options: ["O(1)", "O(log N)", "O(N)", "O(N log N)"],
    correctAnswer: 1,
    hint: "Replacing the root with the last leaf node takes O(1), but bubbling down to rebuild heap takes depth time.",
    explanation: "Removing the root is quick, but heapifying down to restore the binary max-heap property takes time proportional to the height of the tree, which is O(log N).",
    tags: ["heap", "dsa", "complexity"]
  },
  {
    id: 16,
    subject: "Algorithms",
    type: "true_false",
    difficulty: "Medium",
    difficultyValue: 5,
    questionText: "Dijkstra's shortest path algorithm operates correctly and generates accurate routes even when edge weights are negative.",
    options: ["True", "False"],
    correctAnswer: 1,
    hint: "Recall if negative edges can trap the greedy strategy in infinite loops or incorrect relaxations.",
    explanation: "Dijkstra relies on a greedy step. If a negative edge is relaxed after a node is closed, the shortest path is not recalculated. Bellman-Ford should be used for negative edge weights.",
    tags: ["dijkstra", "graphs", "algorithms"]
  },
  {
    id: 17,
    subject: "Operating System",
    type: "mcq",
    difficulty: "Hard",
    difficultyValue: 7,
    questionText: "Which page replacement algorithm suffers from Belady's Anomaly (where increasing page frames leads to more page faults)?",
    options: ["LRU (Least Recently Used)", "FIFO (First In First Out)", "Optimal Page Replacement", "LFU (Least Frequently Used)"],
    correctAnswer: 1,
    hint: "Think of queue-based replacements that do not conform to stack-based characteristics.",
    explanation: "FIFO (First In First Out) is not a stack-based algorithm, meaning the set of pages in a smaller frame limit is not always a subset of a larger limit, leading to Belady's Anomaly.",
    tags: ["paging", "memory", "os"]
  },
  {
    id: 18,
    subject: "DBMS",
    type: "mcq",
    difficulty: "Medium",
    difficultyValue: 5,
    questionText: "Which normal form guarantees that all non-trivial functional dependencies X -> Y are such that X is a superkey?",
    options: ["1NF", "2NF", "3NF", "Boyce-Codd Normal Form (BCNF)"],
    correctAnswer: 3,
    hint: "This normal form is slightly stricter than 3NF, eliminating overlapping candidate key dependencies.",
    explanation: "BCNF states that for every non-trivial functional dependency A -> B, A must be a superkey. This is stronger than 3NF.",
    tags: ["normalization", "dbms", "sql"]
  },
  {
    id: 19,
    subject: "Computer Networks",
    type: "mcq",
    difficulty: "Medium",
    difficultyValue: 6,
    questionText: "What is the primary function of the Address Resolution Protocol (ARP) in local network communications?",
    options: [
      "To map an IP address to a physical MAC address.",
      "To map domain names to IP addresses.",
      "To allocate dynamic IP addresses to new clients.",
      "To establish secure cryptographic TLS sessions."
    ],
    correctAnswer: 0,
    hint: "It helps routers and switches locate physical interfaces in the Link Layer using IP targets.",
    explanation: "ARP resolves Network Layer (IPv4) addresses into Link Layer (MAC) hardware addresses to facilitate local Ethernet routing.",
    tags: ["arp", "protocols", "networks"]
  },
  {
    id: 20,
    subject: "JavaScript",
    type: "mcq",
    difficulty: "Hard",
    difficultyValue: 8,
    questionText: "What order of operations does the event loop follow when executing Microtasks (Promises) vs Macrotasks (setTimeout)?",
    options: [
      "All Microtasks in the queue are executed immediately after the current script call stack clears, before the next Macrotask is pulled.",
      "Macrotasks are prioritized over Microtasks at all times.",
      "One Microtask is executed for each Macrotask that runs.",
      "The browser shuffles them randomly to balance load."
    ],
    correctAnswer: 0,
    hint: "Promises (.then) execute in microtask queues, which are fully drained before any timers fire.",
    explanation: "The call stack clears, then the Microtask queue is entirely emptied. Only then does the event loop fetch a task from the Macrotask queue.",
    tags: ["javascript", "event-loop", "microtasks"]
  },
  {
    id: 21,
    subject: "AI",
    type: "true_false",
    difficulty: "Easy",
    difficultyValue: 2,
    questionText: "Supervised learning requires labeled training data to learn mapping functions from input features to output targets.",
    options: ["True", "False"],
    correctAnswer: 0,
    hint: "Think about the presence of a 'teacher' or 'label' vs clustering tasks.",
    explanation: "Supervised learning operates on pairs of inputs and corresponding correct ground truth labels (e.g. classification, regression).",
    tags: ["ai", "learning", "supervised"]
  },
  {
    id: 22,
    subject: "Cloud Computing",
    type: "mcq",
    difficulty: "Medium",
    difficultyValue: 5,
    questionText: "What cloud feature refers to a system's ability to automatically scale resource footprints up or down instantly in response to real-time workloads?",
    options: ["Redundancy", "Elasticity", "Virtualization", "Containerization"],
    correctAnswer: 1,
    hint: "Think of an elastic band stretching and shrinking on demand.",
    explanation: "Elasticity is the core characteristic allowing instant scaling of storage, network, and computing capacity depending on incoming request volume.",
    tags: ["elasticity", "cloud", "scaling"]
  },
  {
    id: 23,
    subject: "Data Structures",
    type: "mcq",
    difficulty: "Hard",
    difficultyValue: 7,
    questionText: "Which binary tree traversal visits the left branch, then the right branch, and finally the root node (L-R-N)?",
    options: ["Pre-Order", "In-Order", "Post-Order", "Level-Order"],
    correctAnswer: 2,
    hint: "Root is visited LAST. Think about clean post-processing of children.",
    explanation: "Post-order visits Left, then Right, then Node. It is ideal for deleting nodes or calculating file sizes in hierarchical folders.",
    tags: ["tree", "traversal", "dsa"]
  },
  {
    id: 24,
    subject: "Algorithms",
    type: "fill_blank",
    difficulty: "Easy",
    difficultyValue: 2,
    questionText: "What is the average-case time complexity of searching an element in a sorted array using Binary Search? (Format: O(log N) or O(N))",
    correctAnswer: "O(log N)",
    hint: "Every comparison discards half of the remaining array elements.",
    explanation: "Binary Search continuously splits search spaces in halves, taking logarithmic time: O(log N).",
    tags: ["binarysearch", "complexity", "algorithms"]
  },
  {
    id: 25,
    subject: "Operating System",
    type: "mcq",
    difficulty: "Medium",
    difficultyValue: 5,
    questionText: "Which scheduler determines which process is loaded from disk swap memory into main memory (RAM) for active state executions?",
    options: ["Short-term scheduler", "Medium-term scheduler", "Long-term scheduler", "CPU Dispatcher"],
    correctAnswer: 1,
    hint: "This scheduler handles process suspension, swapping, and degrees of multiprogramming.",
    explanation: "The medium-term scheduler swaps processes from memory to disk and vice versa, controlling memory capacity loads.",
    tags: ["scheduling", "swapping", "os"]
  },
  {
    id: 26,
    subject: "DBMS",
    type: "mcq",
    difficulty: "Hard",
    difficultyValue: 8,
    questionText: "In database concurrency protocols, which level of transaction isolation completely prevents Dirty Reads, Non-repeatable Reads, and Phantom Reads?",
    options: ["Read Uncommitted", "Read Committed", "Repeatable Read", "Serializable"],
    correctAnswer: 3,
    hint: "It locks access completely, executing concurrent items as if they were strictly serial.",
    explanation: "Serializable is the highest isolation level. It forces strict ordering, preventing phantom insertions and all read anomalies.",
    tags: ["acid", "transactions", "dbms"]
  },
  {
    id: 27,
    subject: "Computer Networks",
    type: "mcq",
    difficulty: "Easy",
    difficultyValue: 2,
    questionText: "Which HTTP status code category represents standard Successful responses (e.g. OK, Created)?",
    options: ["1xx", "2xx", "3xx", "4xx", "5xx"],
    correctAnswer: 1,
    hint: "Think about status codes like 200 OK or 201 Created.",
    explanation: "The 2xx class represents success. 3xx is redirect, 4xx is client error, and 5xx is server error.",
    tags: ["http", "protocols", "networks"]
  },
  {
    id: 28,
    subject: "Algorithms",
    type: "mcq",
    difficulty: "Hard",
    difficultyValue: 7,
    questionText: "What is the time complexity of the Floyd-Warshall algorithm to find all-pairs shortest paths in a graph with V vertices?",
    options: ["O(V)", "O(V log V)", "O(V^2)", "O(V^3)"],
    correctAnswer: 3,
    hint: "Think about the nested loops for intermediate node vertices.",
    explanation: "Floyd-Warshall uses three nested loops over the V vertices, yielding a complexity of O(V^3).",
    tags: ["floyd-warshall", "graphs", "complexity"]
  },
  {
    id: 29,
    subject: "DBMS",
    type: "true_false",
    difficulty: "Easy",
    difficultyValue: 2,
    questionText: "A foreign key in a table must always reference a primary key in another table.",
    options: ["True", "False"],
    correctAnswer: 0,
    hint: "Foreign keys maintain referential integrity with unique entity records.",
    explanation: "Foreign keys reference primary keys (or unique keys) in target tables to construct relationships securely.",
    tags: ["sql", "integrity", "dbms"]
  },
  {
    id: 30,
    subject: "Data Structures",
    type: "mcq",
    difficulty: "Expert",
    difficultyValue: 9,
    questionText: "Which self-balancing binary search tree maintains balance by ensuring no path from root to leaf is more than twice as long as any other path?",
    options: ["AVL Tree", "Red-Black Tree", "Splay Tree", "B-Tree"],
    correctAnswer: 1,
    hint: "Nodes are colored Red or Black, and properties ensure structural balance during rotations.",
    explanation: "Red-Black trees maintain color-balanced paths. They are less strictly balanced than AVL trees, allowing faster insertions/deletions with O(log N) lookups.",
    tags: ["tree", "red-black", "dsa"]
  },
  {
    id: 31,
    subject: "Data Structures",
    type: "mcq",
    difficulty: "Medium",
    difficultyValue: 6,
    questionText: "What is the worst-case time complexity of inserting an element into a Hash Table with Chaining using a linked list?",
    options: ["O(1)", "O(log N)", "O(N)", "O(N log N)"],
    correctAnswer: 2,
    hint: "Think about what happens when all elements hash to the exact same index (a collision storm).",
    explanation: "In the worst case, all items hash to the same bucket. Inserting at the end of the list takes O(N) if we must scan to prevent duplicate keys.",
    tags: ["hash-table", "collisions", "dsa"]
  },
  {
    id: 32,
    subject: "Data Structures",
    type: "mcq",
    difficulty: "Hard",
    difficultyValue: 8,
    questionText: "Which of the following queue types allows inserting and deleting elements from both ends?",
    options: ["Circular Queue", "Priority Queue", "Deque (Double-Ended Queue)", "Linear Queue"],
    correctAnswer: 2,
    hint: "Think of a queue that acts both like a Stack and a Queue simultaneously.",
    explanation: "A Deque (Double-Ended Queue) allows insertions and deletions at both the front and rear ends in O(1) time.",
    tags: ["queue", "deque", "dsa"]
  },
  {
    id: 33,
    subject: "Algorithms",
    type: "mcq",
    difficulty: "Medium",
    difficultyValue: 6,
    questionText: "Using the greedy approach, what is the optimal sub-structure property of the Fractional Knapsack problem?",
    options: ["Highest weight first", "Highest value density (value/weight) first", "Lowest weight first", "Highest value first"],
    correctAnswer: 1,
    hint: "Think about maximizing profit per unit of weight.",
    explanation: "For Fractional Knapsack, sorting items by value-to-weight ratio (value density) and adding them greedily yields the optimal solution.",
    tags: ["greedy", "knapsack", "algorithms"]
  },
  {
    id: 34,
    subject: "Algorithms",
    type: "mcq",
    difficulty: "Hard",
    difficultyValue: 8,
    questionText: "What is the time complexity to search for a word of length L in a Trie data structure containing N words?",
    options: ["O(log N)", "O(L)", "O(N)", "O(N * L)"],
    correctAnswer: 1,
    hint: "A Trie search depends solely on characters in the input search key, not total words.",
    explanation: "Trie lookup is O(L) where L is the length of the string, because we follow one child reference pointer per character.",
    tags: ["trie", "search", "dsa"]
  },
  {
    id: 35,
    subject: "Operating System",
    type: "mcq",
    difficulty: "Medium",
    difficultyValue: 5,
    questionText: "Which page replacement algorithm suffers from Belady's Anomaly, where increasing page frame count results in more page faults?",
    options: ["LRU (Least Recently Used)", "Optimal Page Replacement", "FIFO (First-In, First-Out)", "MRU (Most Recently Used)"],
    correctAnswer: 2,
    hint: "It behaves like a simple queue queueing pages as they arrive.",
    explanation: "FIFO replacement can experience Belady's Anomaly because it does not respect page reference locality property.",
    tags: ["paging", "belady", "os"]
  },
  {
    id: 36,
    subject: "Operating System",
    type: "mcq",
    difficulty: "Medium",
    difficultyValue: 6,
    questionText: "What is the primary role of the Translation Lookaside Buffer (TLB) in CPU memory management?",
    options: ["Cache page frames in RAM", "Act as a fast cache for page table translations", "Handle disk paging swapping operations", "Coordinate interrupt handler queues"],
    correctAnswer: 1,
    hint: "It avoids the double RAM access penalty for virtual memory lookups.",
    explanation: "The TLB is a hardware cache that stores recent virtual-to-physical address mapping translations.",
    tags: ["tlb", "virtual-memory", "os"]
  },
  {
    id: 37,
    subject: "DBMS",
    type: "mcq",
    difficulty: "Medium",
    difficultyValue: 6,
    questionText: "Which SQL join returns all records from the left table, and matched records from the right table, filling nulls if no match exists?",
    options: ["INNER JOIN", "RIGHT OUTER JOIN", "LEFT OUTER JOIN", "FULL OUTER JOIN"],
    correctAnswer: 2,
    hint: "It prioritizes matching columns from the left relation.",
    explanation: "A LEFT OUTER JOIN returns all rows from the left table, along with matching rows from the right table, using NULLs where matches are absent.",
    tags: ["sql", "joins", "dbms"]
  },
  {
    id: 38,
    subject: "DBMS",
    type: "mcq",
    difficulty: "Hard",
    difficultyValue: 8,
    questionText: "In database index files, what is the main advantage of a B+ Tree index over a standard B Tree index?",
    options: ["B+ Trees store data pointers only at leaf nodes, allowing more keys per index block", "B+ Trees are always binary", "B+ Trees require less search depth", "B+ Trees do not require rotations"],
    correctAnswer: 0,
    hint: "Think about sequential range scans and block storage space optimization.",
    explanation: "In B+ Trees, internal nodes only store keys (no data pointers), maximizing the branching factor. Leaves are linked to enable fast range scans.",
    tags: ["indexing", "b+tree", "dbms"]
  },
  {
    id: 39,
    subject: "Data Structures",
    type: "mcq",
    difficulty: "Medium",
    difficultyValue: 5,
    questionText: "What is the balance factor constraint for any node in an AVL self-balancing search tree?",
    options: ["0 or 1", "-1, 0, or 1", "Less than 2", "Exactly 0"],
    correctAnswer: 1,
    hint: "AVL trees balance strictly by checking node subtree heights differences.",
    explanation: "AVL trees require the balance factor (height of left subtree minus height of right subtree) to be either -1, 0, or 1.",
    tags: ["avl", "tree-balance", "dsa"]
  },
  {
    id: 40,
    subject: "Algorithms",
    type: "mcq",
    difficulty: "Hard",
    difficultyValue: 7,
    questionText: "What is the average time complexity of building a Binary Heap of size N from an unsorted array using the bottom-up Heapify method?",
    options: ["O(N)", "O(N log N)", "O(log N)", "O(N^2)"],
    correctAnswer: 0,
    hint: "Sum of heights of nodes is a convergent series.",
    explanation: "The bottom-up build-heap operation takes O(N) time because work decreases exponentially as we go up the tree levels.",
    tags: ["heap", "heapify", "dsa"]
  },
  {
    id: 41,
    subject: "Operating System",
    type: "mcq",
    difficulty: "Medium",
    difficultyValue: 5,
    questionText: "What is the difference between a process and a thread?",
    options: ["A process shares memory with other processes; threads do not", "A process is a program in execution with its own address space; a thread is a lightweight execution unit inside a process", "Threads are managed solely by hardware; processes by OS", "There is no difference"],
    correctAnswer: 1,
    hint: "A process owns its resources; multiple threads share the parent process's memory space.",
    explanation: "A process has its own address space, file handles, and security context. A thread is an execution path sharing the process's code, data, and resources.",
    tags: ["processes", "threads", "os"]
  },
  {
    id: 42,
    subject: "DBMS",
    type: "mcq",
    difficulty: "Medium",
    difficultyValue: 6,
    questionText: "Which of the following guarantees that database transactions are executed completely or not at all?",
    options: ["Consistency", "Isolation", "Durability", "Atomicity"],
    correctAnswer: 3,
    hint: "ACID: 'All-or-Nothing' execution principle.",
    explanation: "Atomicity ensures that all statements within a database transaction succeed, or the database is rolled back to its pre-transaction state.",
    tags: ["acid", "transactions", "dbms"]
  },
  {
    id: 43,
    subject: "Data Structures",
    type: "mcq",
    difficulty: "Easy",
    difficultyValue: 2,
    questionText: "Which data structure is best suited for implementing a Breadth-First Search (BFS) graph traversal?",
    options: ["Stack", "Queue", "Min-Heap", "Priority Queue"],
    correctAnswer: 1,
    hint: "BFS explores neighbors level-by-level, requiring a FIFO order of processing.",
    explanation: "A Queue (First-In-First-Out) keeps track of nodes discovered but not yet visited, maintaining correct level-by-level BFS traversal.",
    tags: ["bfs", "queue", "dsa"]
  },
  {
    id: 44,
    subject: "Algorithms",
    type: "mcq",
    difficulty: "Medium",
    difficultyValue: 5,
    questionText: "Which searching algorithm requires the underlying collection to be sorted before execution?",
    options: ["Linear Search", "Binary Search", "Depth-First Search", "Breadth-First Search"],
    correctAnswer: 1,
    hint: "It divides the search space in half repeatedly.",
    explanation: "Binary Search relies on sorted order to look at the middle element and decide whether to search left or right.",
    tags: ["binary-search", "searching", "dsa"]
  },
  {
    id: 45,
    subject: "Operating System",
    type: "mcq",
    difficulty: "Hard",
    difficultyValue: 8,
    questionText: "What mechanism is used by the operating system to prevent CPU starvation in a Priority Scheduling algorithm?",
    options: ["Preemption", "Aging", "Round Robin slicing", "Context switching"],
    correctAnswer: 1,
    hint: "Gradually increasing priority of processes waiting in the queue over time.",
    explanation: "Aging gradually increases the priority of processes that wait in the system for long periods, preventing starvation of low-priority processes.",
    tags: ["scheduling", "aging", "os"]
  },
  {
    id: 46,
    subject: "DBMS",
    type: "mcq",
    difficulty: "Hard",
    difficultyValue: 7,
    questionText: "What type of lock prevents concurrent transactions from both reading and writing to the same database row simultaneously?",
    options: ["Shared Lock (S)", "Exclusive Lock (X)", "Intent Shared Lock (IS)", "Intent Exclusive Lock (IX)"],
    correctAnswer: 1,
    hint: "Only one transaction can hold this lock on a resource at any given time.",
    explanation: "An Exclusive Lock (X) ensures that no other transactions can read or modify the resource until the lock is released.",
    tags: ["locking", "concurrency", "dbms"]
  },
  {
    id: 47,
    subject: "Data Structures",
    type: "mcq",
    difficulty: "Medium",
    difficultyValue: 6,
    questionText: "In a binary min-heap, where is the smallest element located?",
    options: ["In the last leaf node", "At the root node", "In the middle of the heap array", "It can be anywhere"],
    correctAnswer: 1,
    hint: "Min-heap property requires parent nodes to be less than or equal to their children.",
    explanation: "The min-heap ordering property guarantees that the root node always stores the minimum element of the entire heap.",
    tags: ["min-heap", "priority-queue", "dsa"]
  },
  {
    id: 48,
    subject: "Algorithms",
    type: "mcq",
    difficulty: "Medium",
    difficultyValue: 6,
    questionText: "What is the main design strategy behind the Merge Sort algorithm?",
    options: ["Dynamic Programming", "Greedy Choice Method", "Divide and Conquer", "Backtracking"],
    correctAnswer: 2,
    hint: "It splits the array in half, recursively sorts them, and merges the sorted halves.",
    explanation: "Merge Sort uses a Divide and Conquer approach, dividing the list, sorting partitions recursively, and merging them back.",
    tags: ["mergesort", "divide-and-conquer", "algorithms"]
  },
  {
    id: 49,
    subject: "Operating System",
    type: "mcq",
    difficulty: "Medium",
    difficultyValue: 5,
    questionText: "Which directory system structure does not allow shared files or directories between multiple users?",
    options: ["Single-level directory", "Two-level directory", "Tree-structured directory", "Acyclic Graph directory"],
    correctAnswer: 2,
    hint: "A tree structure has rigid parent-child pointers without cross-links.",
    explanation: "A tree-structured directory prevents sharing directory/file nodes between multiple branches directly unless links are introduced (which yields an acyclic graph).",
    tags: ["filesystems", "directories", "os"]
  },
  {
    id: 50,
    subject: "DBMS",
    type: "mcq",
    difficulty: "Medium",
    difficultyValue: 5,
    questionText: "Which transaction property ensures that concurrent execution of transactions leaves the database in the same state as if they had run serially?",
    options: ["Atomicity", "Consistency", "Isolation", "Durability"],
    correctAnswer: 2,
    hint: "Concurrency isolation levels maintain transaction independent states.",
    explanation: "Isolation ensures that concurrent transactions execute independently without interference, simulating serial execution.",
    tags: ["acid", "transactions", "dbms"]
  }
];

export function generateExtendedQuestionPool(): Question[] {
  const pool: Question[] = [...staticQuestions];
  let currentId = pool.length + 1;

  // 1. Math & Mental Math - Algorithms (200 Questions)
  for (let i = 1; i <= 200; i++) {
    const a = 5 + (i * 3) % 20;
    const b = 10 + (i * 7) % 50;
    const x = 2 + (i * 11) % 15;
    const c = a * x + b;
    pool.push({
      id: currentId++,
      subject: "Algorithms",
      type: "mcq",
      difficulty: i % 3 === 0 ? "Easy" : i % 3 === 1 ? "Medium" : "Hard",
      difficultyValue: i % 3 === 0 ? 3 : i % 3 === 1 ? 5 : 7,
      questionText: `Solve the linear equation for X: ${a} * X + ${b} = ${c}. What is the value of X?`,
      options: [String(x - 2), String(x), String(x + 3), String(x + 1)],
      correctAnswer: 1,
      hint: `Subtract ${b} from both sides, then divide by ${a}.`,
      explanation: `Subtracting ${b} from ${c} gives ${c - b}. Dividing ${c - b} by ${a} yields ${x}.`,
      tags: ["math", "mental-math", "algebra"]
    });
  }

  // 2. Stack Tracing Simulator - Data Structures (150 Questions)
  for (let i = 1; i <= 150; i++) {
    const pushes = [`Node-${i}`, `Node-${i+1}`, `Node-${i+2}`];
    pool.push({
      id: currentId++,
      subject: "Data Structures",
      type: "mcq",
      difficulty: "Medium",
      difficultyValue: 5,
      questionText: `Trace the stack operations: push(${pushes[0]}), push(${pushes[1]}), pop(), push(${pushes[2]}). What is the top element of the stack now?`,
      options: [pushes[0], pushes[1], pushes[2], "Empty Stack"],
      correctAnswer: 2,
      hint: "Remember Last-In-First-Out (LIFO). The pop() removes the most recently pushed element.",
      explanation: `Initially push ${pushes[0]} and ${pushes[1]}. Pop removes ${pushes[1]}. Then pushing ${pushes[2]} makes it the top element.`,
      tags: ["stack", "tracing", "dsa"]
    });
  }

  // 3. BST Parent Finder - Data Structures (150 Questions)
  for (let i = 1; i <= 150; i++) {
    const root = 50 + (i % 5) * 10;
    const left = root - 20;
    const right = root + 20;
    const leftLeft = left - 10;
    pool.push({
      id: currentId++,
      subject: "Data Structures",
      type: "mcq",
      difficulty: "Hard",
      difficultyValue: 7,
      questionText: `If the keys [${root}, ${left}, ${right}, ${leftLeft}] are inserted in order into an empty Binary Search Tree (BST), what key will be the parent node of key ${leftLeft}?`,
      options: [String(root), String(left), String(right), "None (it is root)"],
      correctAnswer: 1,
      hint: "BST inserts values smaller than the node on the left, and larger on the right.",
      explanation: `${left} is smaller than ${root} and becomes its left child. ${leftLeft} is smaller than both, becoming the left child of ${left}. Hence ${left} is the parent.`,
      tags: ["bst", "tree", "dsa"]
    });
  }

  // 4. OS CPU Burst Waiting Time - Operating System (200 Questions)
  for (let i = 1; i <= 200; i++) {
    const b1 = 2 + (i % 4) * 2;
    const b2 = 3 + (i % 3) * 3;
    const b3 = 5 + (i % 5) * 1;
    const avgWait = Number(((0 + b1 + b1 + b2) / 3).toFixed(2));
    const wrong1 = Number((avgWait + 1.5).toFixed(2));
    const wrong2 = Number((avgWait - 1.0).toFixed(2));
    const wrong3 = Number((avgWait * 1.2).toFixed(2));
    
    pool.push({
      id: currentId++,
      subject: "Operating System",
      type: "mcq",
      difficulty: "Hard",
      difficultyValue: 8,
      questionText: `Three processes P1, P2, and P3 arrive at time 0 with CPU burst times of ${b1}ms, ${b2}ms, and ${b3}ms respectively. Under First-Come First-Served (FCFS) scheduling, what is the average waiting time in milliseconds?`,
      options: [String(wrong1), String(avgWait), String(wrong2), String(wrong3)],
      correctAnswer: 1,
      hint: "Waiting time for first is 0, second waits for first to complete, third waits for both.",
      explanation: `Waiting times: P1 = 0ms. P2 waits for P1 to finish = ${b1}ms. P3 waits for P1 + P2 = ${b1 + b2}ms. Average = (0 + ${b1} + ${b1 + b2}) / 3 = ${avgWait}ms.`,
      tags: ["scheduling", "fcfs", "os"]
    });
  }

  // 5. DBMS Normalization - DBMS (200 Questions)
  for (let i = 1; i <= 200; i++) {
    pool.push({
      id: currentId++,
      subject: "DBMS",
      type: "mcq",
      difficulty: "Medium",
      difficultyValue: 6,
      questionText: `A database table (Relation #${i}) is in 1NF, and all non-prime attributes are fully functionally dependent on the entire primary key. What is the highest normal form satisfied?`,
      options: ["1NF", "2NF", "3NF", "BCNF"],
      correctAnswer: 1,
      hint: "Partial dependencies removal is the main requirement for moving from 1NF to 2NF.",
      explanation: "A table is in 2NF if it is in 1NF and there are no partial key dependencies. If it still contains transitive dependencies, it cannot be in 3NF.",
      tags: ["normalization", "dbms", "sql"]
    });
  }

  // 6. Computer Networks Port Numbers - Computer Networks (150 Questions)
  const protocols = [
    { name: "HTTP", port: 80 },
    { name: "HTTPS", port: 443 },
    { name: "FTP", port: 21 },
    { name: "SSH", port: 22 },
    { name: "DNS", port: 53 },
    { name: "SMTP", port: 25 }
  ];
  for (let i = 1; i <= 200; i++) {
    const proto = protocols[i % protocols.length];
    const wrongPorts = [proto.port + 10, proto.port - 5, proto.port + 100];
    
    pool.push({
      id: currentId++,
      subject: "Computer Networks",
      type: "mcq",
      difficulty: "Easy",
      difficultyValue: 3,
      questionText: `What is the default TCP/UDP port number designated for the ${proto.name} protocol?`,
      options: [String(wrongPorts[0]), String(proto.port), String(wrongPorts[1]), String(wrongPorts[2])],
      correctAnswer: 1,
      hint: `Think about standard web service port listings for protocol ${proto.name}.`,
      explanation: `The default port number assigned to ${proto.name} is ${proto.port}.`,
      tags: ["ports", "protocols", "networks"]
    });
  }

  // 7. JavaScript Scopes & typeof Tracing - JavaScript (200 Questions)
  for (let i = 1; i <= 200; i++) {
    const codeOp = i % 2 === 0 ? "typeof null" : "typeof []";
    const expected = i % 2 === 0 ? "object" : "object";
    const wrongOptions = i % 2 === 0 ? ["null", "undefined", "string"] : ["array", "undefined", "list"];
    
    pool.push({
      id: currentId++,
      subject: "JavaScript",
      type: "mcq",
      difficulty: "Easy",
      difficultyValue: 3,
      questionText: `What is the evaluated output of the expression: console.log(${codeOp}) in JavaScript?`,
      options: [wrongOptions[0], expected, wrongOptions[1], wrongOptions[2]],
      correctAnswer: 1,
      hint: "Historically, JavaScript evaluates complex structures and null values as a generic base pointer type.",
      explanation: `JavaScript represents both arrays and the empty 'null' reference value as an 'object' type under standard typeof evaluations.`,
      tags: ["javascript", "typeof", "basics"]
    });
  }

  // 8. AI Deep Learning Math (200 Questions)
  for (let i = 1; i <= 200; i++) {
    const isConv = i % 2 === 0;
    if (isConv) {
      const w = 32 + (i % 4) * 32;
      const f = 3 + (i % 2) * 2;
      const p = 1 + (i % 2);
      const s = 1 + (i % 2);
      const outputDim = Math.floor((w - f + 2 * p) / s) + 1;
      pool.push({
        id: currentId++,
        subject: "AI",
        type: "mcq",
        difficulty: i % 3 === 0 ? "Easy" : i % 3 === 1 ? "Medium" : "Hard",
        difficultyValue: i % 3 === 0 ? 3 : i % 3 === 1 ? 5 : 7,
        questionText: `For a CNN layer with input width W = ${w}, filter size F = ${f}, padding P = ${p}, and stride S = ${s}, what is the output spatial dimension (width)?`,
        options: [String(outputDim - 2), String(outputDim), String(outputDim + 2), String(outputDim + 1)],
        correctAnswer: 1,
        hint: "Use the formula: Output Size = floor((W - F + 2P) / S) + 1.",
        explanation: `Using the formula: floor((${w} - ${f} + 2*${p}) / ${s}) + 1 = floor((${w - f + 2 * p}) / ${s}) + 1 = ${outputDim}.`,
        tags: ["ai", "cnn", "math"]
      });
    } else {
      const inputSize = 64 + (i % 5) * 64;
      const outputSize = 10 + (i % 3) * 10;
      const params = (inputSize + 1) * outputSize;
      pool.push({
        id: currentId++,
        subject: "AI",
        type: "mcq",
        difficulty: i % 3 === 0 ? "Easy" : i % 3 === 1 ? "Medium" : "Hard",
        difficultyValue: i % 3 === 0 ? 3 : i % 3 === 1 ? 5 : 7,
        questionText: `Calculate the number of trainable parameters (including biases) for a fully connected (Dense) neural network layer with an input size of ${inputSize} and an output size of ${outputSize}.`,
        options: [String(inputSize * outputSize), String(params), String(params + outputSize), String(params - inputSize)],
        correctAnswer: 1,
        hint: "Trainable parameters in a dense layer = (Input Nodes + 1 for Bias) * Output Nodes.",
        explanation: `The formula is (Input + 1) * Output. Substituting the values: (${inputSize} + 1) * ${outputSize} = ${inputSize + 1} * ${outputSize} = ${params}.`,
        tags: ["ai", "neural-network", "parameters"]
      });
    }
  }

  // 9. Cloud Computing SLA and Storage Math (200 Questions)
  for (let i = 1; i <= 200; i++) {
    const isSla = i % 2 === 0;
    if (isSla) {
      const slaValues = [99.0, 99.9, 99.99, 99.999];
      const sla = slaValues[i % slaValues.length];
      const downtimePercent = 100 - sla;
      const totalMinutes = 30 * 24 * 60;
      const maxDowntimeMinutes = Number(((totalMinutes * downtimePercent) / 100).toFixed(2));
      
      pool.push({
        id: currentId++,
        subject: "Cloud Computing",
        type: "mcq",
        difficulty: i % 3 === 0 ? "Easy" : i % 3 === 1 ? "Medium" : "Hard",
        difficultyValue: i % 3 === 0 ? 3 : i % 3 === 1 ? 5 : 7,
        questionText: `If a cloud provider guarantees a monthly uptime SLA of ${sla}%, what is the maximum allowable downtime in minutes for a 30-day month?`,
        options: [
          String(Number((maxDowntimeMinutes * 1.5).toFixed(2))), 
          String(maxDowntimeMinutes), 
          String(Number((maxDowntimeMinutes * 0.8).toFixed(2))), 
          String(Number((maxDowntimeMinutes + 10).toFixed(2)))
        ],
        correctAnswer: 1,
        hint: "First calculate total minutes in 30 days (43,200), then find the percentage corresponding to the permitted downtime.",
        explanation: `Total minutes in 30 days = 30 * 24 * 60 = 43,200 minutes. Downtime percentage = 100% - ${sla}% = ${downtimePercent.toFixed(3)}%. Max downtime = 43,200 * (${downtimePercent} / 100) = ${maxDowntimeMinutes} minutes.`,
        tags: ["cloud", "sla", "reliability"]
      });
    } else {
      const gb = 100 + (i % 10) * 150;
      const rate = 0.05 + (i % 5) * 0.02;
      const cost = Number((gb * rate).toFixed(2));
      pool.push({
        id: currentId++,
        subject: "Cloud Computing",
        type: "mcq",
        difficulty: i % 3 === 0 ? "Easy" : i % 3 === 1 ? "Medium" : "Hard",
        difficultyValue: i % 3 === 0 ? 3 : i % 3 === 1 ? 5 : 7,
        questionText: `A serverless application transfers ${gb} GB of data out to the internet from an object storage bucket. If the data transfer rate is $${rate.toFixed(2)} per GB, what is the total data transfer cost?`,
        options: [
          `$${(cost * 1.2).toFixed(2)}`,
          `$${cost.toFixed(2)}`,
          `$${(cost - 5).toFixed(2)}`,
          `$${(cost * 0.9).toFixed(2)}`
        ],
        correctAnswer: 1,
        hint: "Multiply the total GB transferred by the cost per GB rate.",
        explanation: `Total cost = ${gb} GB * $${rate.toFixed(2)}/GB = $${cost.toFixed(2)}.`,
        tags: ["cloud", "pricing", "storage"]
      });
    }
  }

  // 10. Software Engineering (200 Questions)
  for (let i = 1; i <= 200; i++) {
    const isTesting = i % 2 === 0;
    if (isTesting) {
      const branches = 10 + (i % 5) * 10;
      const covered = branches - (i % 4) * 2;
      const coverage = Math.round((covered / branches) * 100);
      pool.push({
        id: currentId++,
        subject: "Software Engineering",
        type: "mcq",
        difficulty: i % 3 === 0 ? "Easy" : i % 3 === 1 ? "Medium" : "Hard",
        difficultyValue: i % 3 === 0 ? 3 : i % 3 === 1 ? 5 : 7,
        questionText: `A software module has ${branches} execution branches. If a unit test suite executes ${covered} of these branches during testing run #${i}, what is the calculated branch coverage percentage?`,
        options: [`${coverage - 15}%`, `${coverage}%`, `${coverage + 10}%`, `${coverage - 5}%`],
        correctAnswer: 1,
        hint: "Branch coverage is calculated as (Covered Branches / Total Branches) * 100.",
        explanation: `Branch coverage = (${covered} / ${branches}) * 100 = ${coverage}%.`,
        tags: ["software-engineering", "testing", "coverage"]
      });
    } else {
      const patternNames = ["Singleton", "Factory Method", "Observer", "Strategy", "Adapter", "Facade", "Decorator", "Command"];
      const patternIdx = i % patternNames.length;
      const pattern = patternNames[patternIdx];
      const definitions: Record<string, string> = {
        "Singleton": "restricts the instantiation of a class to one single instance and provides global access.",
        "Factory Method": "defines an interface for creating an object, but lets subclasses decide which class to instantiate.",
        "Observer": "defines a one-to-many dependency between objects so that when one object changes state, all its dependents are notified.",
        "Strategy": "defines a family of algorithms, encapsulates each one, and makes them interchangeable.",
        "Adapter": "allows incompatible interfaces to work together by converting the interface of a class into another interface.",
        "Facade": "provides a unified, simplified interface to a set of interfaces in a subsystem.",
        "Decorator": "attaches additional responsibilities to an object dynamically without modifying its structure.",
        "Command": "encapsulates a request as an object, thereby letting you parameterize clients with different requests."
      };
      
      const wrongs = patternNames.filter(p => p !== pattern).slice(0, 3);
      pool.push({
        id: currentId++,
        subject: "Software Engineering",
        type: "mcq",
        difficulty: i % 3 === 0 ? "Easy" : i % 3 === 1 ? "Medium" : "Hard",
        difficultyValue: i % 3 === 0 ? 3 : i % 3 === 1 ? 5 : 7,
        questionText: `Which design pattern ${definitions[pattern]} (Standard Pattern Scenario #${i})?`,
        options: [wrongs[0], pattern, wrongs[1], wrongs[2]],
        correctAnswer: 1,
        hint: "Identify the pattern that matches this standard behavioral or structural description.",
        explanation: `The ${pattern} design pattern is the one that ${definitions[pattern]}`,
        tags: ["software-engineering", "design-patterns", "architecture"]
      });
    }
  }

  // 11. Theory of Computation (200 Questions)
  for (let i = 1; i <= 200; i++) {
    const type = i % 2 === 0;
    if (type) {
      const states = 2 + (i % 4);
      const alphabetSize = 2 + (i % 2);
      const transitionsCount = states * alphabetSize;
      pool.push({
        id: currentId++,
        subject: "Theory of Computation",
        type: "mcq",
        difficulty: i % 3 === 0 ? "Easy" : i % 3 === 1 ? "Medium" : "Hard",
        difficultyValue: i % 3 === 0 ? 3 : i % 3 === 1 ? 5 : 7,
        questionText: `For a Deterministic Finite Automaton (DFA #${i}) with ${states} states and an input alphabet size of ${alphabetSize}, how many total state-transition entries exist in its complete transition table?`,
        options: [String(transitionsCount - 2), String(transitionsCount), String(transitionsCount + states), String(transitionsCount * 2)],
        correctAnswer: 1,
        hint: "A DFA transition table contains exactly one transition for every state-alphabet pair.",
        explanation: `Number of entries = (number of states) * (alphabet size) = ${states} * ${alphabetSize} = ${transitionsCount}.`,
        tags: ["theory-of-computation", "automata", "dfa"]
      });
    } else {
      const grammarTypes = [
        { type: "Type 3 (Regular)", rule: "A -> aB or A -> a" },
        { type: "Type 2 (Context-Free)", rule: "A -> alpha" },
        { type: "Type 1 (Context-Sensitive)", rule: "alpha A beta -> alpha gamma beta (where gamma is non-empty)" },
        { type: "Type 0 (Unrestricted)", rule: "alpha -> beta (no restrictions)" }
      ];
      const gType = grammarTypes[i % grammarTypes.length];
      const wrongs = grammarTypes.filter(g => g.type !== gType.type).map(g => g.type);
      pool.push({
        id: currentId++,
        subject: "Theory of Computation",
        type: "mcq",
        difficulty: i % 3 === 0 ? "Easy" : i % 3 === 1 ? "Medium" : "Hard",
        difficultyValue: i % 3 === 0 ? 3 : i % 3 === 1 ? 5 : 7,
        questionText: `According to the Chomsky Hierarchy, a grammar containing production rules primarily of the form "${gType.rule}" (Case #${i}) is classified as which grammar type?`,
        options: [wrongs[0], gType.type, wrongs[1], wrongs[2]],
        correctAnswer: 1,
        hint: "Chomsky levels range from Type 3 (most restrictive / regular) to Type 0 (unrestricted).",
        explanation: `Rules of the form ${gType.rule} satisfy the constraints of ${gType.type} grammars.`,
        tags: ["theory-of-computation", "chomsky", "grammars"]
      });
    }
  }

  // 12. Cyber Security (200 Questions)
  for (let i = 1; i <= 200; i++) {
    const isCrypto = i % 2 === 0;
    if (isCrypto) {
      const keys = ["AES", "DES", "RSA", "Blowfish", "Diffie-Hellman", "ECC"];
      const keyName = keys[i % keys.length];
      const isSymmetric = ["AES", "DES", "Blowfish"].includes(keyName);
      const category = isSymmetric ? "Symmetric key cryptography" : "Asymmetric key cryptography";
      const opposite = isSymmetric ? "Asymmetric key cryptography" : "Symmetric key cryptography";
      
      pool.push({
        id: currentId++,
        subject: "Cyber Security",
        type: "mcq",
        difficulty: i % 3 === 0 ? "Easy" : i % 3 === 1 ? "Medium" : "Hard",
        difficultyValue: i % 3 === 0 ? 3 : i % 3 === 1 ? 5 : 7,
        questionText: `Which cryptographic category does the algorithm ${keyName} fall under (Encryption Suite #${i})?`,
        options: [opposite, category, "Hashing algorithm", "Encoding scheme"],
        correctAnswer: 1,
        hint: isSymmetric ? "It uses the same key for both encryption and decryption." : "It uses a public-private key pair.",
        explanation: `${keyName} is categorized under ${category}.`,
        tags: ["cyber-security", "cryptography", "encryption"]
      });
    } else {
      const vulns = [
        { name: "SQL Injection", desc: "injecting malicious SQL queries into input fields to manipulate database transactions." },
        { name: "Cross-Site Scripting (XSS)", desc: "injecting malicious scripts into trusted websites that execute in the client's browser context." },
        { name: "CSRF", desc: "tricking a victim's browser into executing unwanted actions on a trusted site where they are authenticated." },
        { name: "DDoS", desc: "overwhelming a web server's resource pool with a flood of malicious traffic to cause service outage." }
      ];
      const vuln = vulns[i % vulns.length];
      const wrongs = vulns.filter(v => v.name !== vuln.name).map(v => v.name);
      pool.push({
        id: currentId++,
        subject: "Cyber Security",
        type: "mcq",
        difficulty: i % 3 === 0 ? "Easy" : i % 3 === 1 ? "Medium" : "Hard",
        difficultyValue: i % 3 === 0 ? 3 : i % 3 === 1 ? 5 : 7,
        questionText: `Which type of cybersecurity attack is characterized by ${vuln.desc} (Vulnerability Profile #${i})?`,
        options: [wrongs[0], vuln.name, wrongs[1], wrongs[2]],
        correctAnswer: 1,
        hint: `Focus on the destination of the payload, whether it is database commands, browser scripts, or network request packets.`,
        explanation: `${vuln.name} describes the vector of ${vuln.desc}`,
        tags: ["cyber-security", "attacks", "owasp"]
      });
    }
  }

  // 13. Computer Architecture (200 Questions)
  for (let i = 1; i <= 200; i++) {
    const isCache = i % 2 === 0;
    if (isCache) {
      const x = 4 + (i % 4);
      const y = 5 + (i % 2);
      const cacheSizeKb = Math.pow(2, x);
      const blockSizeB = Math.pow(2, y);
      const indexBits = x + 10 - y;
      pool.push({
        id: currentId++,
        subject: "Computer Architecture",
        type: "mcq",
        difficulty: i % 3 === 0 ? "Easy" : i % 3 === 1 ? "Medium" : "Hard",
        difficultyValue: i % 3 === 0 ? 3 : i % 3 === 1 ? 5 : 7,
        questionText: `For a direct-mapped cache memory system with a total capacity of ${cacheSizeKb} KB and a block/line size of ${blockSizeB} Bytes, how many address bits are required to index the cache lines (Configuration #${i})?`,
        options: [String(indexBits - 2), String(indexBits), String(indexBits + 2), String(indexBits - 1)],
        correctAnswer: 1,
        hint: "Number of cache lines = Cache Size / Block Size. Index bits = log2(Number of cache lines).",
        explanation: `Total cache size = ${cacheSizeKb} * 1024 = ${cacheSizeKb * 1024} bytes. Lines = ${cacheSizeKb * 1024} / ${blockSizeB} = ${Math.pow(2, indexBits)} lines. Index bits = log2(${Math.pow(2, indexBits)}) = ${indexBits} bits.`,
        tags: ["computer-architecture", "cache", "memory"]
      });
    } else {
      const gates = [
        { name: "AND", fn: (a: number, b: number) => a & b },
        { name: "OR", fn: (a: number, b: number) => a | b },
        { name: "XOR", fn: (a: number, b: number) => a ^ b },
        { name: "NAND", fn: (a: number, b: number) => (a & b) === 1 ? 0 : 1 }
      ];
      const gate = gates[i % gates.length];
      const a = (i % 2);
      const b = ((i + 1) % 2);
      const output = gate.fn(a, b);
      const wrong = output === 1 ? 0 : 1;
      pool.push({
        id: currentId++,
        subject: "Computer Architecture",
        type: "mcq",
        difficulty: i % 3 === 0 ? "Easy" : i % 3 === 1 ? "Medium" : "Hard",
        difficultyValue: i % 3 === 0 ? 3 : i % 3 === 1 ? 5 : 7,
        questionText: `What is the binary output of a 2-input ${gate.name} logic gate when input A = ${a} and input B = ${b} (Gate Analysis #${i})?`,
        options: [String(wrong), String(output), "High Impedance (Z)", "Floating State"],
        correctAnswer: 1,
        hint: `Review the truth table of the ${gate.name} operation.`,
        explanation: `For ${gate.name} gate with inputs ${a} and ${b}, the output is ${output}.`,
        tags: ["computer-architecture", "logic-gates", "boolean"]
      });
    }
  }

  return pool;
}

export const seedQuestions: Question[] = generateExtendedQuestionPool();
