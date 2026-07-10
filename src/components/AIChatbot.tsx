"use client";

import { useState, useRef, useEffect } from "react";
import { useAppState } from "./AppState";
import { 
  X, 
  Send, 
  Bot, 
  Cpu,
  Brain,
  Volume2,
  VolumeX,
  Mic,
  MicOff,
  Eye
} from "lucide-react";
import { Trie } from "@/lib/dsa/Trie";
import { HashMap } from "@/lib/dsa/HashMap";

interface Message {
  sender: "bot" | "user";
  text: string;
  time: string;
}

interface ISpeechRecognitionEvent {
  results: {
    [index: number]: {
      [index: number]: {
        transcript: string;
      };
    };
  };
}

interface ISpeechRecognitionError {
  error: string;
  message?: string;
}

interface ISpeechRecognition {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  onstart: () => void;
  onresult: (event: ISpeechRecognitionEvent) => void;
  onerror: (err: ISpeechRecognitionError) => void;
  onend: () => void;
  start: () => void;
  stop: () => void;
}

interface SpeechRecognitionWindow extends Window {
  SpeechRecognition?: new () => ISpeechRecognition;
  webkitSpeechRecognition?: new () => ISpeechRecognition;
}

// Educational explanations map covering all 12 subjects and topics
const KNOWLEDGE_BASE: Record<string, string> = {
  "stack": "A Stack is a linear data structure operating on a Last-In, First-Out (LIFO) basis. Core operations are push() and pop(), executing in O(1) time complexity. Stacks are used in function calls, recursion parsing, and undo histories.",
  "lifo": "A Stack is a linear data structure operating on a Last-In, First-Out (LIFO) basis. Core operations are push() and pop(), executing in O(1) time complexity. Stacks are used in function calls, recursion parsing, and undo histories.",
  "queue": "A Queue is a linear data structure operating on a First-In, First-Out (FIFO) basis. Elements are added at the tail (enqueue) and removed from the head (dequeue) in O(1) time. Circular Queues are used for circular slot allocation (like waitrooms).",
  "fifo": "A Queue is a linear data structure operating on a First-In, First-Out (FIFO) basis. Elements are added at the tail (enqueue) and removed from the head (dequeue) in O(1) time. Circular Queues are used for circular slot allocation (like waitrooms).",
  "heap": "Heaps are tree-based structures that maintain heap properties (Max-Heap where parent >= child, Min-Heap where parent <= child). Insertions and extractions take O(log N) time. A Priority Queue wraps this heap, sorting items dynamically by weight.",
  "priority queue": "Heaps are tree-based structures that maintain heap properties (Max-Heap where parent >= child, Min-Heap where parent <= child). Insertions and extractions take O(log N) time. A Priority Queue wraps this heap, sorting items dynamically by weight.",
  "trie": "A Trie (Prefix Tree) is an ordered tree structure used to store keys (usually strings). Searching and inserting phrases of length L takes O(L) time. It is highly optimized for auto-complete search bars.",
  "prefix tree": "A Trie (Prefix Tree) is an ordered tree structure used to store keys (usually strings). Searching and inserting phrases of length L takes O(L) time. It is highly optimized for auto-complete search bars.",
  "knapsack": "Dynamic Programming solves optimization problems by breaking them into overlapping sub-problems, storing their solutions to avoid duplicate computations. In our Knapsack adaptive engine, state transitions verify if taking an item wt[i] maximizes XP value.",
  "dynamic programming": "Dynamic Programming solves optimization problems by breaking them into overlapping sub-problems, storing their solutions to avoid duplicate computations. In our Knapsack adaptive engine, state transitions verify if taking an item wt[i] maximizes XP value.",
  "dp": "Dynamic Programming solves optimization problems by breaking them into overlapping sub-problems, storing their solutions to avoid duplicate computations. In our Knapsack adaptive engine, state transitions verify if taking an item wt[i] maximizes XP value.",
  "complexity": "Big-O notation describes the upper bound of runtime execution relative to input size N. Standard rates are O(1) constant, O(log N) logarithmic (binary search), O(N) linear (linked lists), and O(N log N) linearithmic (Merge/Quick Sort).",
  "big o": "Big-O notation describes the upper bound of runtime execution relative to input size N. Standard rates are O(1) constant, O(log N) logarithmic (binary search), O(N) linear (linked lists), and O(N log N) linearithmic (Merge/Quick Sort).",
  "time complexity": "Big-O notation describes the upper bound of runtime execution relative to input size N. Standard rates are O(1) constant, O(log N) logarithmic (binary search), O(N) linear (linked lists), and O(N log N) linearithmic (Merge/Quick Sort).",
  "deadlock": "A Deadlock occurs in OS when multiple threads hold resources while requesting others, forming a circular wait. The four necessary Coffman conditions are Mutual Exclusion, Hold & Wait, No Preemption, and Circular Wait.",
  "software engineering": "Software Engineering applies structured engineering principles to develop high-quality software. Focuses on SDLC models (Waterfall, Agile Scrum), design patterns (Singleton, Factory, Observer), testing phases (Unit, Integration), and version control systems.",
  "sdlc": "Software Development Life Cycle (SDLC) models govern how projects are planned, built, tested, and deployed. Waterfall is linear-sequential, while Agile/Scrum operates in iterative, time-boxed increments (sprints) to welcome changing requirements.",
  "design patterns": "Design Patterns are reusable solutions to common software design problems. Creational (Singleton, Factory Method), Structural (Decorator, Facade, Adapter), and Behavioral (Observer, Strategy, Command) patterns structure robust codebase architectures.",
  "testing": "Software testing verifies application behavior. Unit testing isolates individual components, Integration testing verifies their combined interactions, and System testing evaluates end-to-end functionality under simulated environment setups.",
  "git": "Git is a distributed version control system. It tracks code modifications, supports branching workflows, and enables features like 'merge' (combining history) and 'rebase' (rewriting linear history onto new base commits).",
  "theory of computation": "Theory of Computation investigates the mathematical limits of computer execution. Concepts range from finite state machines (DFA, NFA), context-free grammars (CFG) for parsing syntaxes, up to universal Turing Machines.",
  "dfa": "A Deterministic Finite Automaton (DFA) is a mathematical state machine that transitions through state-transition tables. For any state and input symbol, there is exactly one next state.",
  "grammar": "Grammars define formal syntax rules. The Chomsky Hierarchy classifies them into Type 3 (Regular / DFA recognizable), Type 2 (Context-Free / Pushdown Automata parsed), Type 1 (Context-Sensitive), and Type 0 (Unrestricted / Turing Machine computable).",
  "turing machine": "A Turing Machine is a mathematical model of computation describing a machine manipulating symbols on a tape loop according to table rules. It defines the limits of what computers can solve (Decidability).",
  "cyber security": "Cyber Security is the practice of protecting systems, networks, and data from digital attacks. Core topics include symmetric/asymmetric encryption, SHA/MD5 hashing, TLS/SSL protocols, and OWASP Top 10 vulnerability mitigations.",
  "cryptography": "Cryptography protects data confidentiality. Symmetric encryption (AES, DES) uses one shared key, while Asymmetric encryption (RSA, ECC, Diffie-Hellman) uses a mathematical public-private key pair.",
  "vulnerability": "Security vulnerabilities are system weaknesses exploited by attackers. Common types are SQL Injection (database manipulation), XSS (client script injection), CSRF (hijacked credentials actions), and DDoS (network flooding).",
  "tls": "TLS (Transport Layer Security) is a security protocol securing internet communications. It performs a cryptographic handshake verifying certificates, exchanging key parameters, to establish a symmetric encrypted HTTPS pipe.",
  "computer architecture": "Computer Architecture defines the operational structure of CPU execution. Focuses on cache memory mapping schemes (Direct, Associative), CPU instruction pipelining, and CPU Addressing Modes (Direct, Immediate, Indirect).",
  "cache": "Cache memory sits between CPU and RAM, buffering instructions in fast static cells. Direct-mapped caches map each main memory block to exactly one cache line, while associative caches allow flexible placement.",
  "pipelining": "Pipelining is a CPU implementation technique where multiple instructions are overlapped in execution. Key hazards blocking smooth flow are structural hazards, data hazards (dependencies), and control hazards (branching).",
  "logic gates": "Logic gates are primary hardware components computing boolean outputs. Standard gates include AND, OR, XOR, NAND, NOR, and XNOR, combining to construct ALUs and memory registers."
};

// Statically initialize data structures
const trie = new Trie<string>();
const hashMap = new HashMap<string, string>();

Object.entries(KNOWLEDGE_BASE).forEach(([key, val]) => {
  trie.insert(key, key);
  hashMap.put(key, val);
});

export default function AIChatbot() {
  const { playSound } = useAppState();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { sender: "bot", text: "Hello! I am your AlgoQuiz AI tutor. Ask me any doubts about CS topics like Stacks, Tries, SDLC, Cryptography, or CPU Pipelining!", time: new Date().toLocaleTimeString().slice(0, 5) }
  ]);
  const [inputVal, setInputVal] = useState("");
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [activeSpeakingIndex, setActiveSpeakingIndex] = useState<number | null>(null);
  const [isListening, setIsListening] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<ISpeechRecognition | null>(null);

  useEffect(() => {
    // Scroll to bottom on new messages
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isOpen]);

  useEffect(() => {
    return () => {
      // Cancel any active speech on component unmount
      if (typeof window !== "undefined" && window.speechSynthesis) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  const handleToggleSpeech = (text: string, index: number) => {
    if (typeof window === "undefined" || !window.speechSynthesis) return;

    if (activeSpeakingIndex === index) {
      window.speechSynthesis.cancel();
      setActiveSpeakingIndex(null);
      playSound("click");
      return;
    }

    playSound("click");
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.onend = () => setActiveSpeakingIndex(null);
    utterance.onerror = () => setActiveSpeakingIndex(null);
    setActiveSpeakingIndex(index);
    window.speechSynthesis.speak(utterance);
  };

  const handleToggleListen = () => {
    playSound("click");
    if (isListening) {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
      setIsListening(false);
      return;
    }

    const SpeechRecognition = (
      typeof window !== "undefined"
        ? ((window as unknown) as SpeechRecognitionWindow).SpeechRecognition ||
          ((window as unknown) as SpeechRecognitionWindow).webkitSpeechRecognition
        : undefined
    );
    if (!SpeechRecognition) {
      alert("Voice recognition is not supported in this browser. Please use Chrome, Edge, or Safari.");
      return;
    }

    const rec = new SpeechRecognition();
    rec.continuous = false;
    rec.interimResults = false;
    rec.lang = "en-US";

    rec.onstart = () => {
      setIsListening(true);
    };
    rec.onresult = (event: ISpeechRecognitionEvent) => {
      const transcript = event.results[0][0].transcript;
      setInputVal(prev => prev + (prev ? " " : "") + transcript);
    };
    rec.onerror = (err: ISpeechRecognitionError) => {
      console.error(err);
      setIsListening(false);
    };
    rec.onend = () => {
      setIsListening(false);
    };

    recognitionRef.current = rec;
    rec.start();
  };

  const handleAnalyzePage = () => {
    playSound("click");
    const path = typeof window !== "undefined" ? window.location.pathname : "/";
    
    // Add page analysis request to the chat stream
    setMessages(prev => [
      ...prev,
      { sender: "user", text: `🔍 Analyze page context: ${path}`, time: new Date().toLocaleTimeString().slice(0, 5) }
    ]);

    setTimeout(() => {
      let explanation = "";
      if (path === "/quiz/play") {
        const questionDiv = document.querySelector("h2, .text-lg.font-bold");
        const activeQuestion = questionDiv?.textContent?.trim() || "";
        explanation = `I scanned this Quiz Screen. ${activeQuestion ? `You are working on the question: "${activeQuestion}".` : "You are currently taking a quiz."} Remember to trace standard algorithm outcomes, evaluate runtime constraints, and ensure your indexes are within limits. Let me know if you need any topic definitions!`;
      } else if (path === "/dsa-lab") {
        explanation = "I analyzed this Interactive DSA Sandbox page. You can visualize core data structures (like Stacks, Queues, Graphs, Tries, and Sorting) with step-by-step logic tracing. Use the buttons below the visualization viewport to change state values!";
      } else if (path === "/profile") {
        explanation = "I scanned the Profile page. It features your student stats, XP totals, current rank, and holds your printable mastery certificate. Click 'View Certificate' inside the profile block to export yours!";
      } else if (path === "/dashboard") {
        explanation = "I analyzed your Dashboard. Here you can see your recent test metrics, weak areas, and click recommended quick-start links to jump into personalized training paths.";
      } else {
        explanation = `I scanned the active page context: "${path}". This section gives you full access to AlgoQuiz Pro features. Feel free to ask me questions on topics like dynamic programming, SDLC scrum sprints, cache mapping, or logic gates!`;
      }

      playSound("correct");
      setMessages(prev => [
        ...prev,
        { sender: "bot", text: explanation, time: new Date().toLocaleTimeString().slice(0, 5) }
      ]);
    }, 800);
  };

  const handleInputChange = (val: string) => {
    setInputVal(val);
    const trimmed = val.trim().toLowerCase();
    if (!trimmed) {
      setSuggestions([]);
      return;
    }
    // Fetch suggestions from prefix Trie
    const matches = trie.getSuggestions(trimmed);
    const filtered = matches
      .filter(m => m !== trimmed)
      .slice(0, 5);
    setSuggestions(filtered);
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputVal.trim()) return;
    playSound("click");

    const userMsg = inputVal.trim();
    setMessages(prev => [
      ...prev,
      { sender: "user", text: userMsg, time: new Date().toLocaleTimeString().slice(0, 5) }
    ]);
    setInputVal("");
    setSuggestions([]);

    // Simulate AI response delay
    setTimeout(() => {
      const responseText = generateAIResponse(userMsg);
      playSound("correct");
      setMessages(prev => [
        ...prev,
        { sender: "bot", text: responseText, time: new Date().toLocaleTimeString().slice(0, 5) }
      ]);
    }, 1200);
  };

  const generateAIResponse = (query: string): string => {
    const q = query.toLowerCase().trim();

    // 1. Direct O(1) HashMap lookup for exact keyword query
    if (hashMap.has(q)) {
      return hashMap.get(q) || "";
    }

    // 2. Trie-aided token search: tokenize user input query and check each word/phrase
    const words = q.split(/[\s,?.!]+/);
    for (const w of words) {
      if (w.length > 1 && hashMap.has(w)) {
        return hashMap.get(w) || "";
      }
    }

    // 3. Substring matching fallback (for multi-word tags like "priority queue")
    const keys = Object.keys(KNOWLEDGE_BASE);
    for (const key of keys) {
      if (q.includes(key)) {
        return hashMap.get(key) || "";
      }
    }

    return "Interesting question! That matches our CS curriculum. To verify, check the subject dashboard. Would you like me to detail its average time complexity, state diagram, or practical use cases?";
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {/* FLOATING TRIGGER BUTTON */}
      {!isOpen && (
        <button
          onClick={() => { playSound("click"); setIsOpen(true); }}
          className="h-14 w-14 rounded-full bg-gradient-to-tr from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white shadow-2xl flex items-center justify-center border border-purple-400/40 transform hover:scale-110 active:scale-95 transition-all duration-200"
          title="Ask AI Companion"
        >
          <Bot className="h-6 w-6 animate-pulse" />
        </button>
      )}

      {/* EXPANDED CHAT WIDGET */}
      {isOpen && (
        <div className="glass w-80 md:w-96 h-[450px] rounded-3xl border border-white/10 flex flex-col justify-between overflow-hidden shadow-2xl animate-scale-up">
          {/* Header */}
          <div className="p-4 bg-slate-950/80 border-b border-white/5 flex items-center justify-between">
            <div className="flex items-center space-x-2.5">
              <div className="h-8 w-8 rounded-xl bg-purple-600/20 border border-purple-500/30 flex items-center justify-center text-purple-400">
                <Brain className="h-4.5 w-4.5" />
              </div>
              <div>
                <h4 className="font-bold text-white text-xs">AI Copilot Companion</h4>
                <div className="flex items-center space-x-1">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-ping" />
                  <span className="text-[9px] text-slate-500">Active explanations online</span>
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-1">
              <button
                onClick={handleAnalyzePage}
                className="p-1 rounded-lg hover:bg-white/5 text-purple-400 hover:text-purple-300"
                title="Analyze Page Context ('See Website')"
              >
                <Eye className="h-4 w-4" />
              </button>
              <button
                onClick={() => { playSound("click"); setIsOpen(false); }}
                className="p-1 rounded-lg hover:bg-white/5 text-slate-400 hover:text-white"
                title="Close Chat"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* Messages Stream */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3.5 scrollbar-thin scrollbar-thumb-slate-800">
            {messages.map((msg, idx) => {
              const isBot = msg.sender === "bot";
              return (
                <div 
                  key={idx} 
                  className={`flex ${isBot ? "justify-start" : "justify-end"} items-start gap-2.5 text-xs`}
                >
                  {isBot && (
                    <div className="h-6 w-6 rounded bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400 flex-shrink-0">
                      <Cpu className="h-3.5 w-3.5" />
                    </div>
                  )}
                  <div className={`p-3 rounded-2xl max-w-[75%] leading-relaxed relative ${
                    isBot 
                      ? "bg-slate-900 border border-white/5 text-slate-300 rounded-tl-none pr-8" 
                      : "bg-purple-600 text-white rounded-tr-none"
                  }`}>
                    <p>{msg.text}</p>
                    {isBot && (
                      <button
                        type="button"
                        onClick={() => handleToggleSpeech(msg.text, idx)}
                        className={`absolute top-2 right-2 p-1 rounded hover:bg-slate-800 transition ${
                          activeSpeakingIndex === idx ? "text-purple-400 animate-pulse" : "text-slate-500 hover:text-slate-300"
                        }`}
                        title={activeSpeakingIndex === idx ? "Stop Reading" : "Read Aloud"}
                      >
                        {activeSpeakingIndex === idx ? <VolumeX className="h-3 w-3" /> : <Volume2 className="h-3 w-3" />}
                      </button>
                    )}
                    <span className={`text-[8px] block text-right mt-1 ${isBot ? "text-slate-500" : "text-purple-300"}`}>
                      {msg.time}
                    </span>
                  </div>
                </div>
              );
            })}
            <div ref={messagesEndRef} />
          </div>

          {/* Autocomplete Suggestions */}
          {suggestions.length > 0 && (
            <div className="mx-3 mb-2 p-1.5 glass rounded-xl border border-white/10 flex flex-wrap gap-1.5 animate-fade-in relative z-20">
              <span className="text-[10px] text-slate-500 font-bold block w-full pl-1 mb-0.5">Suggestions:</span>
              {suggestions.map((sug, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => {
                    setInputVal(sug);
                    setSuggestions([]);
                    playSound("click");
                  }}
                  className="px-2 py-0.5 rounded-lg bg-purple-500/10 border border-purple-500/20 text-purple-300 text-[10px] hover:bg-purple-500/20 transition"
                >
                  {sug}
                </button>
              ))}
            </div>
          )}

          {/* Form Input */}
          <form onSubmit={handleSendMessage} className="p-3 bg-slate-950/40 border-t border-white/5 flex gap-2">
            <input
              type="text"
              placeholder="Ask about stack, heap, trie, knapsack..."
              value={inputVal}
              onChange={(e) => handleInputChange(e.target.value)}
              className="flex-1 bg-slate-900 border border-white/5 rounded-xl px-3.5 text-xs text-white focus:outline-none focus:border-purple-500 transition"
            />
            <button
              type="button"
              onClick={handleToggleListen}
              className={`p-2.5 rounded-xl transition ${
                isListening 
                  ? "bg-red-500/20 text-red-400 animate-pulse border border-red-500/40" 
                  : "bg-slate-900 border border-white/5 text-slate-400 hover:text-white"
              }`}
              title={isListening ? "Listening..." : "Voice Dictation"}
            >
              {isListening ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
            </button>
            <button
              type="submit"
              className="p-2.5 bg-purple-600 text-white rounded-xl hover:bg-purple-500 flex items-center justify-center"
              title="Send Message"
            >
              <Send className="h-4 w-4" />
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
