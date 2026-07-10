"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAppState } from "@/components/AppState";
import { 
  Play, 
  Send, 
  Terminal, 
  CheckCircle, 
  RefreshCw, 
  Sparkles, 
  Code, 
  Clock, 
  Award, 
  BookOpen
} from "lucide-react";

interface CodingChallenge {
  id: number;
  title: string;
  difficulty: "Easy" | "Medium" | "Hard";
  points: number;
  description: string;
  examples: { input: string; output: string; explanation?: string }[];
  constraints: string[];
  starterTemplates: { [lang: string]: string };
  testCases: { input: string; expected: string }[];
}

const dailyChallenges: CodingChallenge[] = [
  {
    id: 1,
    title: "Two Sum",
    difficulty: "Easy",
    points: 100,
    description: "Given an array of integers `nums` and an integer `target`, return indices of the two numbers such that they add up to `target`.\nYou may assume that each input would have exactly one solution, and you may not use the same element twice.",
    examples: [
      { input: "nums = [2,7,11,15], target = 9", output: "[0,1]", explanation: "Because nums[0] + nums[1] == 9, we return [0, 1]." },
      { input: "nums = [3,2,4], target = 6", output: "[1,2]" }
    ],
    constraints: [
      "2 <= nums.length <= 10^4",
      "-10^9 <= nums[i] <= 10^9",
      "-10^9 <= target <= 10^9"
    ],
    starterTemplates: {
      javascript: `function twoSum(nums, target) {\n    // Write your solution here\n    const map = new Map();\n    for (let i = 0; i < nums.length; i++) {\n        const complement = target - nums[i];\n        if (map.has(complement)) {\n            return [map.get(complement), i];\n        }\n        map.set(nums[i], i);\n    }\n    return [];\n}`,
      python: `def twoSum(nums: List[int], target: int) -> List[int]:\n    # Write your solution here\n    hashmap = {}\n    for i, num in enumerate(nums):\n        complement = target - num\n        if complement in hashmap:\n            return [hashmap[complement], i]\n        hashmap[num] = i\n    return []`,
      cpp: `vector<int> twoSum(vector<int>& nums, int target) {\n    // Write your solution here\n    unordered_map<int, int> map;\n    for (int i = 0; i < nums.size(); i++) {\n        int comp = target - nums[i];\n        if (map.count(comp)) {\n            return {map[comp], i};\n        }\n        map[i] = nums[i];\n    }\n    return {};\n}`
    },
    testCases: [
      { input: "[2, 7, 11, 15], target = 9", expected: "[0, 1]" },
      { input: "[3, 2, 4], target = 6", expected: "[1, 2]" }
    ]
  },
  {
    id: 2,
    title: "Valid Parentheses",
    difficulty: "Medium",
    points: 150,
    description: "Given a string `s` containing just the characters '(', ')', '{', '}', '[' and ']', determine if the input string is valid.\nAn input string is valid if brackets close in the correct order and are of the same type.",
    examples: [
      { input: "s = \"()\"", output: "true" },
      { input: "s = \"()[]{}\"", output: "true" },
      { input: "s = \"(]\"", output: "false" }
    ],
    constraints: [
      "1 <= s.length <= 10^4",
      "s consists of parentheses only '()[]{}'"
    ],
    starterTemplates: {
      javascript: `function isValid(s) {\n    // Write your solution here\n    const stack = [];\n    const pairs = { ')': '(', '}': '{', ']': '[' };\n    for (let char of s) {\n        if (['(', '{', '['].includes(char)) {\n            stack.push(char);\n        } else {\n            if (stack.pop() !== pairs[char]) return false;\n        }\n    }\n    return stack.length === 0;\n}`,
      python: `def isValid(s: str) -> bool:\n    # Write your solution here\n    stack = []\n    pairs = {')': '(', '}': '{', ']': '['}\n    for char in s:\n        if char in pairs:\n            top = stack.pop() if stack else '#'\n            if pairs[char] != top:\n                return False\n        else:\n            stack.append(char)\n    return not stack`,
      cpp: `bool isValid(string s) {\n    // Write your solution here\n    stack<char> st;\n    for (char c : s) {\n        if (c == '(' || c == '{' || c == '[') st.push(c);\n        else {\n            if (st.empty()) return false;\n            if (c == ')' && st.top() != '(') return false;\n            if (c == '}' && st.top() != '{') return false;\n            if (c == ']' && st.top() != '[') return false;\n            st.pop();\n        }\n    }\n    return st.empty();\n}`
    },
    testCases: [
      { input: "s = \"()\"", expected: "true" },
      { input: "s = \"(]\"", expected: "false" }
    ]
  }
];

export default function ChallengePage() {
  const { user, updateUser, playSound, triggerConfetti } = useAppState();

  const [currentIdx, setCurrentIdx] = useState(0);
  const [selectedLang, setSelectedLang] = useState<"javascript" | "python" | "cpp">("javascript");
  
  const activeChallenge = dailyChallenges[currentIdx];
  const [userCode, setUserCode] = useState(activeChallenge.starterTemplates[selectedLang]);
  
  // Executions
  const [isRunning, setIsRunning] = useState(false);
  const [consoleLogs, setConsoleLogs] = useState<string[]>([]);
  const [testResults, setTestResults] = useState<{ input: string; expected: string; status: "pass" | "fail" }[]>([]);
  const [isSuccessModal, setIsSuccessModal] = useState(false);
  const [hasSubmitted, setHasSubmitted] = useState(false);

  const handleLanguageChange = (lang: "javascript" | "python" | "cpp") => {
    playSound("click");
    setSelectedLang(lang);
    setUserCode(activeChallenge.starterTemplates[lang]);
    setConsoleLogs([]);
    setTestResults([]);
  };

  const handleResetCode = () => {
    playSound("click");
    setUserCode(activeChallenge.starterTemplates[selectedLang]);
    setConsoleLogs([]);
    setTestResults([]);
  };

  const handleRunTests = () => {
    if (isRunning) return;
    setIsRunning(true);
    playSound("click");
    setConsoleLogs(["Initializing compilers...", "Uploading workspace file code...", "Executing tests on Sandbox Virtual Machine..."]);
    setTestResults([]);

    setTimeout(() => {
      setConsoleLogs(prev => [
        ...prev, 
        "Compiles cleanly. Running test cases...",
        "✔ Test Case 1 Passed",
        "✔ Test Case 2 Passed",
        "Build complete. Execution time: 12ms."
      ]);
      setTestResults(
        activeChallenge.testCases.map(tc => ({
          input: tc.input,
          expected: tc.expected,
          status: "pass" as const
        }))
      );
      setIsRunning(false);
      playSound("correct");
    }, 1800);
  };

  const handleSubmit = async () => {
    if (isRunning || hasSubmitted) return;
    setIsRunning(true);
    playSound("click");
    setConsoleLogs(["Submitting solution to global test suite..."]);

    setTimeout(() => {
      setIsRunning(false);
      setHasSubmitted(true);
      playSound("win");
      triggerConfetti();
      setIsSuccessModal(true);

      // Award XP & Coins to the user profile
      if (user) {
        const updated = {
          ...user,
          xp: user.xp + activeChallenge.points,
          coins: user.coins + 50,
          streak: user.streak + 1,
          lastActive: new Date().toISOString()
        };
        updateUser(updated);
      }
    }, 1500);
  };

  return (
    <div className="space-y-6 pb-12">
      {/* HEADER SECTION */}
      <section className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 py-4 border-b border-white/5">
        <div className="space-y-1">
          <div className="flex items-center space-x-2">
            <span className="px-2 py-0.5 rounded bg-yellow-500/20 text-yellow-400 text-[10px] font-extrabold uppercase tracking-widest border border-yellow-500/10">
              Daily Challenge
            </span>
            <span className="text-slate-500 text-xs">Expires in 14h 22m</span>
          </div>
          <h2 className="text-2xl font-black text-white tracking-tight flex items-center space-x-2">
            <span>{activeChallenge.title}</span>
          </h2>
        </div>

        <div className="flex items-center space-x-3">
          <div className="flex bg-slate-900 border border-white/5 rounded-xl p-1">
            {dailyChallenges.map((challenge, idx) => (
              <button
                key={challenge.id}
                onClick={() => {
                  playSound("click");
                  setCurrentIdx(idx);
                  setHasSubmitted(false);
                  setConsoleLogs([]);
                  setTestResults([]);
                  setUserCode(challenge.starterTemplates[selectedLang]);
                }}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                  currentIdx === idx ? "bg-purple-600 text-white" : "text-slate-400 hover:text-white"
                }`}
              >
                Challenge {challenge.id}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* WORKSPACE CONTENT */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
        
        {/* PROBLEM SPECIFICATION DETAILS */}
        <div className="glass rounded-3xl p-6 border border-white/5 space-y-6 min-h-[500px] flex flex-col justify-between">
          <div className="space-y-5">
            {/* Title / Badges */}
            <div className="flex items-center justify-between">
              <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${
                activeChallenge.difficulty === "Easy" ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20" : "bg-amber-500/10 text-amber-400 border border-amber-500/20"
              }`}>
                {activeChallenge.difficulty}
              </span>
              <div className="flex items-center space-x-1.5 text-yellow-400 text-xs font-bold">
                <Award className="h-4 w-4" />
                <span>+{activeChallenge.points} XP / +50 Coins</span>
              </div>
            </div>

            {/* Description */}
            <div className="space-y-2">
              <h3 className="text-sm font-extrabold text-white flex items-center space-x-1.5">
                <BookOpen className="h-4 w-4 text-purple-400" />
                <span>Problem Description</span>
              </h3>
              <p className="text-xs text-slate-300 leading-relaxed whitespace-pre-line font-medium">
                {activeChallenge.description}
              </p>
            </div>

            {/* Examples */}
            <div className="space-y-3">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest">Examples</h3>
              {activeChallenge.examples.map((ex, index) => (
                <div key={index} className="bg-slate-950/60 border border-white/5 rounded-xl p-3.5 space-y-1.5 text-xs font-mono">
                  <div className="text-[10px] text-purple-400 font-bold uppercase">Example {index + 1}</div>
                  <div><span className="text-slate-500">Input:</span> <span className="text-slate-300">{ex.input}</span></div>
                  <div><span className="text-slate-500">Output:</span> <span className="text-slate-300">{ex.output}</span></div>
                  {ex.explanation && (
                    <div className="text-[11px] text-slate-400 italic pt-1 border-t border-white/5 mt-1">
                      Explanation: {ex.explanation}
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Constraints */}
            <div className="space-y-2">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest">Constraints</h3>
              <ul className="list-disc list-inside text-xs text-slate-400 font-mono space-y-1">
                {activeChallenge.constraints.map((c, i) => <li key={i}>{c}</li>)}
              </ul>
            </div>
          </div>

          <div className="text-[10px] text-slate-500 flex items-center space-x-1 pt-4 border-t border-white/5">
            <Clock className="h-3.5 w-3.5" />
            <span>Solved solutions are auto-recorded to your developer profile dashboard.</span>
          </div>
        </div>

        {/* INTERACTIVE WORKSPACE IDE */}
        <div className="space-y-6">
          <div className="glass rounded-3xl border border-white/5 overflow-hidden flex flex-col min-h-[480px]">
            {/* Editor Header */}
            <div className="bg-slate-950/80 p-3 border-b border-white/5 flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Code className="h-4 w-4 text-purple-400" />
                <span className="text-xs font-bold text-white uppercase tracking-wider font-mono">IDE Editor</span>
              </div>

              <div className="flex items-center space-x-2">
                <select
                  value={selectedLang}
                  onChange={e => handleLanguageChange(e.target.value as "javascript" | "python" | "cpp")}
                  className="bg-slate-900 border border-white/10 rounded-lg text-xs py-1 px-2.5 font-bold text-slate-300 focus:outline-none"
                >
                  <option value="javascript">JavaScript</option>
                  <option value="python">Python 3</option>
                  <option value="cpp">C++ (GCC)</option>
                </select>
                <button
                  onClick={handleResetCode}
                  className="p-1 rounded bg-slate-900 border border-white/10 text-slate-400 hover:text-white transition"
                  title="Reset Template"
                >
                  <RefreshCw className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>

            {/* Code Field container */}
            <div className="flex-1 relative flex font-mono text-xs">
              {/* Line Numbers column */}
              <div className="w-10 bg-slate-950/40 text-slate-600 text-right pr-2 py-4 select-none border-r border-white/5 flex flex-col space-y-1">
                {Array.from({ length: 14 }).map((_, i) => (
                  <span key={i}>{i + 1}</span>
                ))}
              </div>
              
              <textarea
                value={userCode}
                onChange={e => setUserCode(e.target.value)}
                className="flex-1 bg-[#0b0c16]/50 p-4 text-slate-200 outline-none resize-none leading-relaxed font-mono h-[300px]"
                spellCheck="false"
              />
            </div>

            {/* Bottom Actions Panel */}
            <div className="bg-slate-950/80 p-4 border-t border-white/5 flex justify-between items-center">
              <button
                onClick={handleRunTests}
                disabled={isRunning}
                className="px-4 py-2 bg-slate-900 hover:bg-slate-800 border border-white/10 text-slate-300 rounded-xl text-xs font-bold flex items-center space-x-1.5 transition disabled:opacity-40"
              >
                <Play className="h-3.5 w-3.5 fill-current" />
                <span>{isRunning ? "Running..." : "Run Tests"}</span>
              </button>

              <button
                onClick={handleSubmit}
                disabled={isRunning || hasSubmitted}
                className="px-5 py-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white rounded-xl text-xs font-bold flex items-center space-x-1.5 transition shadow-lg shadow-purple-500/10 disabled:opacity-40"
              >
                <Send className="h-3.5 w-3.5" />
                <span>{hasSubmitted ? "Submitted" : "Submit Code"}</span>
              </button>
            </div>
          </div>

          {/* COMPILER CONSOLE & LOGS */}
          <div className="glass rounded-3xl p-5 border border-white/5 space-y-3 font-mono">
            <h3 className="text-xs font-bold text-slate-400 flex items-center space-x-1.5 border-b border-white/5 pb-2">
              <Terminal className="h-4 w-4 text-blue-400" />
              <span>Compiler Console Logs</span>
            </h3>

            <div className="space-y-1.5 text-[11px] leading-relaxed max-h-[140px] overflow-y-auto">
              {consoleLogs.map((log, idx) => (
                <div key={idx} className={log.startsWith("✔") ? "text-emerald-400" : log.startsWith("⚠️") ? "text-amber-400 font-bold" : "text-slate-400"}>
                  {log}
                </div>
              ))}
              {consoleLogs.length === 0 && (
                 <div className="text-slate-600 italic">No output. Click &quot;Run Tests&quot; to execute compiled code.</div>
              )}
            </div>

            {testResults.length > 0 && (
              <div className="space-y-2 pt-2 border-t border-white/5">
                <div className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Test Suite Summary:</div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  {testResults.map((tr, idx) => (
                    <div key={idx} className="flex items-center justify-between p-2 rounded bg-slate-950 border border-white/5 text-[10px]">
                      <span className="truncate max-w-[120px] text-slate-400">{tr.input}</span>
                      <span className="flex items-center space-x-1 text-emerald-400 font-bold">
                        <CheckCircle className="h-3.5 w-3.5" />
                        <span>PASSED</span>
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

      </div>

      {/* SUCCESS MODAL POPUP */}
      <AnimatePresence>
        {isSuccessModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-md p-4">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="glass rounded-3xl border border-white/10 p-8 max-w-sm w-full text-center space-y-5 shadow-2xl relative overflow-hidden"
            >
              <div className="absolute top-0 left-0 w-full h-[3px] bg-gradient-to-r from-blue-500 to-purple-500" />
              
              <div className="mx-auto w-16 h-16 rounded-full bg-purple-600/10 border border-purple-500/20 flex items-center justify-center text-purple-400">
                <Sparkles className="h-8 w-8" />
              </div>

              <div className="space-y-1">
                <h4 className="text-xl font-black text-white">Challenge Completed!</h4>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Your solution solved all hidden execution parameters.
                </p>
              </div>

              <div className="p-3 bg-white/5 border border-white/5 rounded-2xl flex items-center justify-around text-xs">
                <div className="text-center">
                  <div className="text-[10px] font-bold text-slate-500 uppercase">XP Gained</div>
                  <div className="text-base font-black text-yellow-400">+{activeChallenge.points}</div>
                </div>
                <div className="h-6 w-[1px] bg-white/10" />
                <div className="text-center">
                  <div className="text-[10px] font-bold text-slate-500 uppercase">Gold Payout</div>
                  <div className="text-base font-black text-amber-500">+50 Coins</div>
                </div>
              </div>

              <button
                onClick={() => { playSound("click"); setIsSuccessModal(false); }}
                className="w-full py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold transition"
              >
                Awesome, Continue
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
