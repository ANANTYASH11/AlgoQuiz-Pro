"use client";

import { useEffect, useState } from "react";
import { useAppState } from "@/components/AppState";
import { MockDatabase } from "@/lib/db/mockDb";
import { Question } from "@/lib/db/seedQuestions";
import { 
  ShieldAlert, 
  Upload, 
  Trash2, 
  Plus, 
  Database, 
  TrendingUp, 
  FileCode, 
  Terminal as TermIcon,
  CheckCircle2
} from "lucide-react";
import { useRouter } from "next/navigation";

export default function AdminPage() {
  const router = useRouter();
  const { user, playSound, addQuestion } = useAppState();

  const [questionsList, setQuestionsList] = useState<Question[]>(() => {
    if (typeof window !== "undefined") {
      return MockDatabase.getQuestions();
    }
    return [];
  });
  const [subjectFilter, setSubjectFilter] = useState("All");
  const [jsonInput, setJsonInput] = useState("");
  const [csvInput, setCsvInput] = useState("");
  const [dsaLogs] = useState<string[]>(() => {
    if (typeof window !== "undefined") {
      return MockDatabase.getDsaExecutionLogs();
    }
    return [];
  });

  // Add Single Question Form State
  const [newQText, setNewQText] = useState("");
  const [newQSubject, setNewQSubject] = useState("Data Structures");
  const [newQType, setNewQType] = useState<"mcq" | "fill_blank" | "true_false">("mcq");
  const [newQOptions, setNewQOptions] = useState("Option A, Option B, Option C, Option D");
  const [newQCorrect, setNewQCorrect] = useState("0");
  const [newQExplanation, setNewQExplanation] = useState("");

  useEffect(() => {
    // user is null while still loading from localStorage — skip until it resolves
    if (user === null) return;
    const token = localStorage.getItem("algoquiz_token");
    if (!token || user.role !== "admin") {
      router.push("/dashboard");
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  // Show spinner while user state is still loading (prevents premature redirect)
  if (user === null) {
    return (
      <div className="flex h-96 items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-t-purple-500 border-white/20" />
      </div>
    );
  }

  // Not an admin — render nothing (effect will redirect)
  if (user.role !== "admin") return null;

  const handleAddSingleQuestion = (e: React.FormEvent) => {
    e.preventDefault();
    playSound("click");

    const optionsArr = newQType === "fill_blank" ? undefined : newQOptions.split(",").map(s => s.trim());
    const correctVal = newQType === "fill_blank" ? newQCorrect : Number(newQCorrect);

    const questionObj: Question = {
      id: questionsList.length + 1,
      questionText: newQText,
      type: newQType,
      subject: newQSubject,
      difficulty: "Medium",
      difficultyValue: 3,
      options: optionsArr,
      correctAnswer: correctVal,
      hint: "Review core definitions.",
      explanation: newQExplanation || "Correctly derived by evaluating statements.",
      tags: [newQSubject, "custom", newQType]
    };

    const success = addQuestion(questionObj);
    if (success) {
      playSound("level_up");
      setQuestionsList(MockDatabase.getQuestions());
      
      // Clear form
      setNewQText("");
      setNewQExplanation("");
      alert("Question inserted successfully!");
    } else {
      playSound("incorrect");
      alert("Failed to insert question. Duplicate IDs found.");
    }
  };

  const handleDeleteQuestion = (qId: number) => {
    playSound("click");
    const success = MockDatabase.deleteQuestion(qId);
    if (success) {
      playSound("incorrect");
      setQuestionsList(MockDatabase.getQuestions());
    }
  };

  const handleBulkJsonUpload = (e: React.FormEvent) => {
    e.preventDefault();
    playSound("click");
    try {
      const parsed = JSON.parse(jsonInput);
      if (!Array.isArray(parsed)) throw new Error("Input must be a JSON Array.");

      let addedCount = 0;
      parsed.forEach((q: Question) => {
        if (addQuestion(q)) addedCount++;
      });

      playSound("level_up");
      setQuestionsList(MockDatabase.getQuestions());
      setJsonInput("");
      alert(`Successfully added ${addedCount} questions in bulk!`);
    } catch (err) {
      playSound("incorrect");
      const error = err as Error;
      alert(`Invalid JSON format: ${error.message}`);
    }
  };

  // Simple CSV parser
  const handleBulkCsvUpload = (e: React.FormEvent) => {
    e.preventDefault();
    playSound("click");
    try {
      const lines = csvInput.split("\n").filter(l => l.trim().length > 0);
      if (lines.length < 2) throw new Error("CSV requires a header line and at least one data line.");

      const headers = lines[0].split(",").map(h => h.trim().toLowerCase());
      
      let addedCount = 0;
      for (let i = 1; i < lines.length; i++) {
        const columns = lines[i].split(",").map(c => c.trim());
        const qObj: Partial<Question> = {
          id: questionsList.length + i,
          difficulty: "Medium",
          difficultyValue: 3,
          hint: "Evaluate options.",
          explanation: "Standard logical output."
        };

        headers.forEach((header, index) => {
          const val = columns[index];
          if (header === "questiontext") qObj.questionText = val;
          else if (header === "type") qObj.type = val as "mcq" | "fill_blank" | "true_false";
          else if (header === "subject") qObj.subject = val;
          else if (header === "options") qObj.options = val.split("|").map(o => o.trim());
          else if (header === "correctanswer") {
            qObj.correctAnswer = isNaN(Number(val)) ? val : Number(val);
          }
        });

        if (qObj.questionText && qObj.type && qObj.subject && qObj.correctAnswer !== undefined) {
          if (addQuestion(qObj as Question)) addedCount++;
        }
      }

      playSound("level_up");
      setQuestionsList(MockDatabase.getQuestions());
      setCsvInput("");
      alert(`Successfully parsed and added ${addedCount} questions via CSV!`);
    } catch (err) {
      playSound("incorrect");
      const error = err as Error;
      alert(`Failed to parse CSV: ${error.message}`);
    }
  };

  const filteredQuestions = subjectFilter === "All" 
    ? questionsList 
    : questionsList.filter(q => q.subject.toLowerCase() === subjectFilter.toLowerCase());

  // Aggregate stats
  const totalAttemptsCount = MockDatabase.getAttempts().length;
  const avgAccuracyScore = Math.round(
    MockDatabase.getAttempts().reduce((acc, curr) => acc + curr.accuracy, 0) / (totalAttemptsCount || 1)
  );

  return (
    <div className="space-y-8">
      {/* HEADER */}
      <section className="flex justify-between items-center bg-slate-950/40 p-5 border border-white/10 rounded-2xl">
        <div className="flex items-center space-x-3">
          <div className="h-10 w-10 bg-red-500/10 border border-red-500/20 text-red-400 rounded-xl flex items-center justify-center">
            <ShieldAlert className="h-5 w-5" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-white">System Admin Control Center</h2>
            <p className="text-[10px] text-slate-400">Manage question banks, parse bulk file uploads, and trace real-time DSA execution graphs.</p>
          </div>
        </div>
      </section>

      {/* STATS OVERVIEW */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="glass rounded-2xl p-5 border border-white/5 flex items-center space-x-4">
          <Database className="h-8 w-8 text-blue-400" />
          <div>
            <div className="text-[10px] text-slate-500 uppercase font-bold">Total Question Pool</div>
            <div className="text-xl font-black text-white">{questionsList.length} Items</div>
          </div>
        </div>

        <div className="glass rounded-2xl p-5 border border-white/5 flex items-center space-x-4">
          <TrendingUp className="h-8 w-8 text-emerald-400" />
          <div>
            <div className="text-[10px] text-slate-500 uppercase font-bold">System Total Attempts</div>
            <div className="text-xl font-black text-white">{totalAttemptsCount} Sessions</div>
          </div>
        </div>

        <div className="glass rounded-2xl p-5 border border-white/5 flex items-center space-x-4">
          <CheckCircle2 className="h-8 w-8 text-purple-400" />
          <div>
            <div className="text-[10px] text-slate-500 uppercase font-bold">Global Accuracy Avg</div>
            <div className="text-xl font-black text-white">{avgAccuracyScore}% Acc</div>
          </div>
        </div>
      </section>

      {/* CORE WORKSPACE */}
      <section className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* ADD QUESTIONS & BULK UPLOADER */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Add single question */}
          <div className="glass rounded-2xl p-6 border border-white/5 space-y-4">
            <h3 className="text-xs font-bold text-white uppercase tracking-wider flex items-center space-x-2">
              <Plus className="h-4 w-4 text-purple-400" />
              <span>Add Single Question Sandbox</span>
            </h3>

            <form onSubmit={handleAddSingleQuestion} className="space-y-4 text-xs">
              <div className="space-y-1">
                <label className="text-slate-400 font-semibold">Question Text</label>
                <input
                  type="text"
                  required
                  value={newQText}
                  onChange={(e) => setNewQText(e.target.value)}
                  placeholder="Which data structure operates on LIFO principles?"
                  className="w-full bg-slate-900 border border-white/10 rounded-xl px-3 py-2 text-white"
                />
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-1">
                  <label className="text-slate-400 font-semibold">Subject</label>
                  <select
                    value={newQSubject}
                    onChange={(e) => setNewQSubject(e.target.value)}
                    className="w-full bg-slate-950 border border-white/10 rounded-xl px-3 py-2 text-slate-300"
                  >
                    <option value="Data Structures">Data Structures</option>
                    <option value="Algorithms">Algorithms</option>
                    <option value="Operating System">Operating System</option>
                    <option value="DBMS">DBMS</option>
                    <option value="Computer Networks">Computer Networks</option>
                    <option value="JavaScript">JavaScript</option>
                    <option value="AI">AI</option>
                    <option value="Cloud Computing">Cloud Computing</option>
                    <option value="Software Engineering">Software Engineering</option>
                    <option value="Theory of Computation">Theory of Computation</option>
                    <option value="Cyber Security">Cyber Security</option>
                    <option value="Computer Architecture">Computer Architecture</option>
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="text-slate-400 font-semibold">Type</label>
                  <select
                    value={newQType}
                    onChange={(e) => setNewQType(e.target.value as "mcq" | "fill_blank" | "true_false")}
                    className="w-full bg-slate-950 border border-white/10 rounded-xl px-3 py-2 text-slate-300"
                  >
                    <option value="mcq">MCQ</option>
                    <option value="fill_blank">Fill in Blank</option>
                    <option value="true_false">True/False</option>
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="text-slate-400 font-semibold">Correct Index / Answer</label>
                  <input
                    type="text"
                    required
                    value={newQCorrect}
                    onChange={(e) => setNewQCorrect(e.target.value)}
                    placeholder="0 or exact word"
                    className="w-full bg-slate-900 border border-white/10 rounded-xl px-3 py-2 text-white"
                  />
                </div>
              </div>

              {newQType !== "fill_blank" && (
                <div className="space-y-1">
                  <label className="text-slate-400 font-semibold">Options (Comma separated)</label>
                  <input
                    type="text"
                    value={newQOptions}
                    onChange={(e) => setNewQOptions(e.target.value)}
                    className="w-full bg-slate-900 border border-white/10 rounded-xl px-3 py-2 text-white"
                  />
                </div>
              )}

              <div className="space-y-1">
                <label className="text-slate-400 font-semibold">AI Assistant Explanation</label>
                <textarea
                  value={newQExplanation}
                  onChange={(e) => setNewQExplanation(e.target.value)}
                  rows={2}
                  className="w-full bg-slate-900 border border-white/10 rounded-xl px-3 py-2 text-white"
                />
              </div>

              <button
                type="submit"
                className="w-full py-2.5 bg-purple-600 hover:bg-purple-500 text-white font-bold rounded-xl"
              >
                Insert Question to Database
              </button>
            </form>
          </div>

          {/* BULK CSV / JSON IMPORT */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* JSON */}
            <div className="glass rounded-2xl p-5 border border-white/5 space-y-3">
              <h4 className="text-xs font-bold text-white uppercase tracking-wider flex items-center space-x-2">
                <FileCode className="h-4 w-4 text-purple-400" />
                <span>JSON Bulk Parser</span>
              </h4>
              <form onSubmit={handleBulkJsonUpload} className="space-y-3">
                <textarea
                  placeholder='[{"questionText": "Q?", "type": "mcq", "subject": "DSA", "options": ["A", "B"], "correctAnswer": 0}]'
                  value={jsonInput}
                  onChange={(e) => setJsonInput(e.target.value)}
                  rows={5}
                  className="w-full bg-slate-950 border border-white/10 rounded-xl p-3 text-[10px] font-mono text-slate-300 resize-none"
                />
                <button
                  type="submit"
                  className="w-full py-2 bg-slate-900 hover:bg-slate-800 text-purple-400 border border-purple-500/20 font-bold rounded-lg text-xs"
                >
                  Parse JSON Array
                </button>
              </form>
            </div>

            {/* CSV */}
            <div className="glass rounded-2xl p-5 border border-white/5 space-y-3">
              <h4 className="text-xs font-bold text-white uppercase tracking-wider flex items-center space-x-2">
                <Upload className="h-4 w-4 text-purple-400" />
                <span>CSV Sheet Parser</span>
              </h4>
              <form onSubmit={handleBulkCsvUpload} className="space-y-3">
                <textarea
                  placeholder="questionText,type,subject,options,correctAnswer&#10;What is 2+2?,mcq,DSA,4|2|5,0"
                  value={csvInput}
                  onChange={(e) => setCsvInput(e.target.value)}
                  rows={5}
                  className="w-full bg-slate-950 border border-white/10 rounded-xl p-3 text-[10px] font-mono text-slate-300 resize-none"
                />
                <button
                  type="submit"
                  className="w-full py-2 bg-slate-900 hover:bg-slate-800 text-purple-400 border border-purple-500/20 font-bold rounded-lg text-xs"
                >
                  Parse CSV Columns
                </button>
              </form>
            </div>
          </div>
        </div>

        {/* DSA LOGS TERMINAL CONTAINER */}
        <div className="space-y-6">
          
          {/* Terminal logs */}
          <div className="glass rounded-2xl p-5 border border-white/5 space-y-4">
            <h3 className="text-xs font-bold text-white uppercase tracking-wider flex items-center space-x-2">
              <TermIcon className="h-4 w-4 text-purple-400" />
              <span>DSA Vis Execution Trace Logs</span>
            </h3>

            <div className="bg-slate-950 border border-white/10 rounded-xl p-3 h-64 overflow-y-auto font-mono text-[9px] text-green-400 space-y-1.5 scrollbar-thin">
              {dsaLogs.map((log, idx) => (
                <div key={idx} className="leading-normal border-b border-white/5 pb-1">
                  <span className="text-slate-500 pl-1">{`>`}</span> {log}
                </div>
              ))}
              {dsaLogs.length === 0 && (
                <div className="text-slate-600 italic">No algorithm execution traces logged yet. Play games or sort databases to output logs.</div>
              )}
            </div>
            <div className="text-[9px] text-slate-500 italic">
              * Renders steps of Graph BFS Topic recommenders, Heap extractions, Trie queries, and sorting algorithms.
            </div>
          </div>

          {/* Manage Questions List */}
          <div className="glass rounded-2xl p-5 border border-white/5 space-y-4 max-h-[300px] overflow-y-auto scrollbar-thin">
            <div className="flex justify-between items-center">
              <h4 className="text-xs font-bold text-white uppercase">Active Question Bank</h4>
              <select
                value={subjectFilter}
                onChange={(e) => setSubjectFilter(e.target.value)}
                className="bg-slate-950 border border-white/10 rounded-lg text-[10px] text-slate-300 py-1 px-2 focus:outline-none"
              >
                <option value="All">All Subjects</option>
                <option value="Data Structures">Data Structures</option>
                <option value="Algorithms">Algorithms</option>
                <option value="Operating System">Operating System</option>
                <option value="DBMS">DBMS</option>
                <option value="Computer Networks">Computer Networks</option>
                <option value="JavaScript">JavaScript</option>
                <option value="AI">AI</option>
                <option value="Cloud Computing">Cloud Computing</option>
                <option value="Software Engineering">Software Engineering</option>
                <option value="Theory of Computation">Theory of Computation</option>
                <option value="Cyber Security">Cyber Security</option>
                <option value="Computer Architecture">Computer Architecture</option>
              </select>
            </div>

            <div className="divide-y divide-white/5">
              {filteredQuestions.map((q, idx) => (
                <div key={idx} className="py-2 flex items-center justify-between text-[10px]">
                  <div className="space-y-0.5 max-w-[80%]">
                    <div className="font-bold text-white truncate">{q.questionText}</div>
                    <div className="text-slate-500 uppercase">{q.subject} • {q.type}</div>
                  </div>
                  <button
                    onClick={() => handleDeleteQuestion(q.id)}
                    className="p-1.5 bg-red-500/10 text-red-400 border border-red-500/20 rounded hover:bg-red-500/20 transition"
                  >
                    <Trash2 className="h-3 w-3" />
                  </button>
                </div>
              ))}
            </div>
          </div>

        </div>
      </section>
    </div>
  );
}
