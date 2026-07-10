"use client";

import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { useAppState } from "@/components/AppState";
import { MockDatabase } from "@/lib/db/mockDb";
import { 
  Play, 
  Search, 
  Settings, 
  SlidersHorizontal, 
  Sparkles, 
  HelpCircle, 
  AlertTriangle, 
  Timer,
  BookOpen
} from "lucide-react";
import { useRouter } from "next/navigation";

// List of subjects to show
const subjects = [
  { name: "Data Structures", icon: "📊", desc: "Stacks, Queues, Linked Lists, Trees, and Heaps." },
  { name: "Algorithms", icon: "⚙️", desc: "Sorting, Graph Traversals, Recursion, and DP." },
  { name: "Operating System", icon: "🖥️", desc: "Process Scheduling, Deadlocks, Threads, and Memory." },
  { name: "DBMS", icon: "🗄️", desc: "SQL Commands, Normalization, Joins, and Transactions." },
  { name: "Computer Networks", icon: "🌐", desc: "OSI Layer protocols, Routing, TCP/IP, and TLS." },
  { name: "JavaScript", icon: "💻", desc: "Closures, Proto Inherit, Promises, Event Loop, Arrow 'this'." },
  { name: "AI", icon: "🧠", desc: "Transformers, Neural Networks, Attention, LLMs." },
  { name: "Cloud Computing", icon: "☁️", desc: "FaaS, Serverless, Cloud scaling, and AWS/Vercel paradigms." },
  { name: "Software Engineering", icon: "🛠️", desc: "Agile, SDLC models, testing frameworks, and Git version control." },
  { name: "Theory of Computation", icon: "🧮", desc: "Automata, DFA/NFA, CFG grammars, and Turing machines." },
  { name: "Cyber Security", icon: "🛡️", desc: "RSA/AES cryptography, hashing, OWASP vulnerabilities, and secure protocols." },
  { name: "Computer Architecture", icon: "🏛️", desc: "Cache mappings, pipelining hazards, Boolean gates, and addressing modes." },
];

export default function QuizSelectionPage() {
  const router = useRouter();
  const { playSound, user, questions } = useAppState();
  const [searchQuery, setSearchQuery] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [selectedSubject, setSelectedSubject] = useState("Data Structures");
  const [selectedDifficulty, setSelectedDifficulty] = useState<"Easy" | "Medium" | "Hard" | "Expert">("Medium");
  
  // Custom Rules configurations
  const [timedMode, setTimedMode] = useState(true);
  const [negativeMarking, setNegativeMarking] = useState(true);
  const [shuffleQuestions, setShuffleQuestions] = useState(true);
  const [questionCount, setQuestionCount] = useState<number>(10);

  // Calculate question count per subject dynamically
  const subjectQuestionCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    subjects.forEach(s => {
      counts[s.name] = questions.filter(
        q => q.subject.toLowerCase() === s.name.toLowerCase()
      ).length;
    });
    return counts;
  }, [questions]);

  // Auto-complete suggestion lookup derived synchronously
  const searchSuggestions = useMemo(() => {
    if (searchQuery.trim().length > 0) {
      return MockDatabase.searchTopics(searchQuery).slice(0, 5);
    }
    return [];
  }, [searchQuery]);

  const handleLaunchQuiz = () => {
    playSound("click");
    
    // Save quiz configs temporarily in session/local storage
    const quizConfigs = {
      subject: selectedSubject,
      difficulty: selectedDifficulty,
      timedMode,
      negativeMarking,
      shuffleQuestions,
      questionCount
    };
    localStorage.setItem("algoquiz_active_config", JSON.stringify(quizConfigs));

    // Redirect to the active quiz engine page
    router.push("/quiz/play");
  };

  const handleSuggestionClick = (term: string) => {
    playSound("click");
    setSearchQuery(term);
    
    // Find matching subject
    const matchedSubject = subjects.find(
      s => s.name.toLowerCase().includes(term.toLowerCase())
    );
    if (matchedSubject) {
      setSelectedSubject(matchedSubject.name);
    }
    setShowSuggestions(false);
  };

  return (
    <div className="space-y-8">
      {/* HEADER */}
      <section className="text-center max-w-2xl mx-auto space-y-3 py-6">
        <h2 className="text-3xl font-extrabold text-white tracking-tight">Quiz Match Arena</h2>
        <p className="text-sm text-slate-400">Select your parameters, query specialized tags with Trie instant lookup, and initiate adaptive testing.</p>
      </section>

      {/* SEARCH BAR (Trie Autocomplete) */}
      <section className="max-w-xl mx-auto relative z-20">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
          <input
            type="text"
            placeholder="Search tags (e.g. stack, recursion, sql)..."
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setShowSuggestions(true);
            }}
            onFocus={() => setShowSuggestions(true)}
            className="w-full bg-slate-900/60 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-sm text-white focus:outline-none focus:border-purple-500/80 transition"
          />
        </div>

        {/* Suggestion list */}
        {showSuggestions && searchSuggestions.length > 0 && (
          <div className="absolute top-full left-0 right-0 mt-2 rounded-xl bg-slate-950 border border-white/10 shadow-2xl p-2 divide-y divide-white/5">
            {searchSuggestions.map((suggestion, idx) => (
              <button
                key={idx}
                onClick={() => handleSuggestionClick(suggestion)}
                className="w-full text-left py-2.5 px-4 text-xs text-slate-300 hover:text-white hover:bg-white/5 rounded-lg transition"
              >
                🔍 {suggestion}
              </button>
            ))}
          </div>
        )}
      </section>

      {/* PARAMETERS SELECTION LAYOUT */}
      <section className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* SUBJECT SELECTOR */}
        <div className="lg:col-span-2 space-y-4">
          <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center space-x-2">
            <BookOpen className="h-4.5 w-4.5 text-purple-400" />
            <span>Select Learning Subject</span>
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {subjects.map((sub, idx) => (
              <motion.button
                key={idx}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: idx * 0.04 }}
                onClick={() => { playSound("click"); setSelectedSubject(sub.name); }}
                className={`glass glass-hover rounded-2xl p-5 text-left border border-white/5 transition flex items-start space-x-4 relative overflow-hidden cursor-pointer ${
                  selectedSubject === sub.name ? "border-purple-500/60 bg-purple-500/5" : ""
                }`}
              >
                {selectedSubject === sub.name && (
                  <div className="absolute top-0 right-0 h-4 w-4 rounded-bl bg-purple-500 flex items-center justify-center">
                    <span className="text-[8px] text-white">✓</span>
                  </div>
                )}
                <span className="text-2xl p-3 bg-white/5 rounded-xl">{sub.icon}</span>
                <div className="space-y-1 flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <h4 className="font-bold text-white text-sm truncate">{sub.name}</h4>
                    <span className="flex-shrink-0 text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/30">
                      {subjectQuestionCounts[sub.name] || 0} Qs
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 leading-relaxed">{sub.desc}</p>
                </div>
              </motion.button>
            ))}
          </div>
        </div>

        {/* CONTROLS & RULES CONFIGURATION */}
        <div className="space-y-6">
          
          {/* DIFFICULTY CONTAINER */}
          <div className="glass rounded-2xl p-6 border border-white/5 space-y-4">
            <h3 className="text-xs font-bold text-white uppercase tracking-wider flex items-center space-x-2">
              <SlidersHorizontal className="h-4 w-4 text-purple-400" />
              <span>Difficulty Mode</span>
            </h3>

            <div className="grid grid-cols-2 gap-2">
              {(["Easy", "Medium", "Hard", "Expert"] as const).map((diff, idx) => (
                <button
                  key={idx}
                  onClick={() => { playSound("click"); setSelectedDifficulty(diff); }}
                  className={`py-2 px-3 rounded-xl border text-xs font-bold transition text-center ${
                    selectedDifficulty === diff 
                      ? "bg-purple-600/20 border-purple-500/80 text-white" 
                      : "bg-slate-900 border-white/5 text-slate-400 hover:text-white"
                  }`}
                >
                  {diff}
                </button>
              ))}
            </div>
            <div className="text-[10px] text-slate-500 leading-relaxed">
              * Expert difficulty uses Knapsack adaptation algorithms to maximize XP challenges.
            </div>
          </div>

          {/* RULES / OPTIONS */}
          <div className="glass rounded-2xl p-6 border border-white/5 space-y-4">
            <h3 className="text-xs font-bold text-white uppercase tracking-wider flex items-center space-x-2">
              <Settings className="h-4 w-4 text-purple-400" />
              <span>Arena Session Rules</span>
            </h3>

            <div className="space-y-3">
              {/* Timed mode */}
              <label className="flex items-center justify-between p-2 rounded-lg bg-slate-900/40 border border-white/5 cursor-pointer hover:bg-slate-900/60 transition">
                <div className="flex items-center space-x-2">
                  <Timer className="h-4 w-4 text-slate-400" />
                  <span className="text-xs text-slate-300">Timed Mode (60s / Q)</span>
                </div>
                <input
                  type="checkbox"
                  checked={timedMode}
                  onChange={(e) => { playSound("click"); setTimedMode(e.target.checked); }}
                  className="rounded border-white/10 text-purple-600 focus:ring-purple-500 bg-slate-950 h-4 w-4"
                />
              </label>

              {/* Negative marking */}
              <label className="flex items-center justify-between p-2 rounded-lg bg-slate-900/40 border border-white/5 cursor-pointer hover:bg-slate-900/60 transition">
                <div className="flex items-center space-x-2">
                  <AlertTriangle className="h-4 w-4 text-slate-400" />
                  <span className="text-xs text-slate-300">Negative Marking (-1)</span>
                </div>
                <input
                  type="checkbox"
                  checked={negativeMarking}
                  onChange={(e) => { playSound("click"); setNegativeMarking(e.target.checked); }}
                  className="rounded border-white/10 text-purple-600 focus:ring-purple-500 bg-slate-950 h-4 w-4"
                />
              </label>

              {/* Shuffle questions */}
              <label className="flex items-center justify-between p-2 rounded-lg bg-slate-900/40 border border-white/5 cursor-pointer hover:bg-slate-900/60 transition">
                <div className="flex items-center space-x-2">
                  <HelpCircle className="h-4 w-4 text-slate-400" />
                  <span className="text-xs text-slate-300">Shuffle Questions</span>
                </div>
                <input
                  type="checkbox"
                  checked={shuffleQuestions}
                  onChange={(e) => { playSound("click"); setShuffleQuestions(e.target.checked); }}
                  className="rounded border-white/10 text-purple-600 focus:ring-purple-500 bg-slate-950 h-4 w-4"
                />
              </label>

              {/* Questions Count Select */}
              <div className="flex items-center justify-between p-2 rounded-lg bg-slate-900/40 border border-white/5">
                <div className="flex items-center space-x-2">
                  <BookOpen className="h-4 w-4 text-slate-400" />
                  <span className="text-xs text-slate-300">Questions Count</span>
                </div>
                <select
                  value={questionCount}
                  onChange={(e) => { playSound("click"); setQuestionCount(Number(e.target.value)); }}
                  className="bg-slate-950 border border-white/10 text-slate-300 text-xs rounded px-2 py-1 focus:outline-none cursor-pointer"
                >
                  <option value={5}>5 Questions</option>
                  <option value={10}>10 Questions</option>
                  <option value={15}>15 Questions</option>
                  <option value={20}>20 Questions</option>
                  <option value={30}>30 Questions</option>
                  <option value={50}>50 Questions</option>
                  <option value={100}>100 Questions</option>
                </select>
              </div>
            </div>
          </div>

          {/* LAUNCH BUTTON */}
          <button
            onClick={handleLaunchQuiz}
            className="w-full flex items-center justify-center space-x-2 py-4 rounded-2xl bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white font-bold shadow-lg shadow-purple-500/20 transition-all duration-200 transform hover:-translate-y-0.5"
          >
            <span>Launch Arena Session</span>
            <Play className="h-4.5 w-4.5 fill-current" />
          </button>

        </div>
      </section>

      {/* AI WEAK TOPICS ADAPTATION BANNER */}
      {user && user.weakSubjects.length > 0 && (
        <section className="glass rounded-3xl p-6 border border-blue-500/20 bg-blue-500/5 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center space-x-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-500/10 text-blue-400 flex-shrink-0">
              <Sparkles className="h-6 w-6 animate-pulse" />
            </div>
            <div>
              <h4 className="font-bold text-white text-sm">AI Recommends: Revise {user.weakSubjects[0]}</h4>
              <p className="text-xs text-slate-400">Your average score is low in {user.weakSubjects.join(", ")}. Study this first to balance your skill radar chart!</p>
            </div>
          </div>
          <button
            onClick={() => {
              playSound("click");
              setSelectedSubject(user.weakSubjects[0]);
              setSelectedDifficulty("Easy");
            }}
            className="w-full md:w-auto px-5 py-2.5 rounded-xl border border-blue-500/30 text-blue-300 hover:text-white hover:bg-blue-500/10 font-semibold text-xs transition"
          >
            Load Weak Topic (Easy Mode)
          </button>
        </section>
      )}
    </div>
  );
}
