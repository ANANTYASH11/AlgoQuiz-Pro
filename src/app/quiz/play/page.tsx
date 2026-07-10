"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import { useAppState } from "@/components/AppState";
import { MockDatabase } from "@/lib/db/mockDb";
import { Question } from "@/lib/db/seedQuestions";
import { Stack } from "@/lib/dsa/Stack";
import { generateCustomQuizSet, BacktrackQuestion } from "@/lib/dsa/Backtracking";
import { getOptimalHints, HintItem } from "@/lib/dsa/Greedy";
import { 
  Coins, 
  Maximize2, 
  Minimize2, 
  ChevronLeft, 
  ChevronRight, 
  BookMarked, 
  CheckCircle2, 
  AlertCircle, 
  Sparkles, 
  Flame,
  Home,
  FileText
} from "lucide-react";

interface QuizConfig {
  subject: string;
  difficulty: "Easy" | "Medium" | "Hard" | "Expert";
  timedMode: boolean;
  negativeMarking: boolean;
  shuffleQuestions: boolean;
  questionCount?: number;
}

function generateQuizAttemptId(): string {
  return Math.random().toString(36).substring(2, 11);
}

export default function ActiveQuizPage() {
  const router = useRouter();
  const { user, addAttempt, playSound, triggerConfetti, updateUser } = useAppState();
  
  // Game config
  const [config] = useState<QuizConfig | null>(() => {
    if (typeof window !== "undefined") {
      const savedConfig = localStorage.getItem("algoquiz_active_config");
      return savedConfig ? JSON.parse(savedConfig) : null;
    }
    return null;
  });
  const [questions] = useState<Question[]>(() => {
    if (typeof window !== "undefined") {
      const savedConfig = localStorage.getItem("algoquiz_active_config");
      if (!savedConfig) return [];
      const cfg: QuizConfig = JSON.parse(savedConfig);

      // Fetch all questions
      const allQuestions = MockDatabase.getQuestions();
      
      // Filter by subject
      const subjectQuestions = allQuestions.filter(
        q => q.subject.toLowerCase() === cfg.subject.toLowerCase()
      );

      // Backtracking to generate custom quiz set matching difficulty
      const targetCount = cfg.questionCount || 10;
      const multiplier = targetCount / 5;
      const targetDifficultySum = Math.round(
        (cfg.difficulty === "Easy" ? 8 
          : cfg.difficulty === "Medium" ? 14 
          : cfg.difficulty === "Hard" ? 22 
          : 30) * multiplier
      );

      const backtrackPool: BacktrackQuestion[] = subjectQuestions.map(q => ({
        id: q.id,
        difficulty: q.difficultyValue,
        subject: q.subject
      }));

      const backtrackResults = generateCustomQuizSet(backtrackPool, targetDifficultySum, targetCount);
      
      let selectedQs: Question[] = [];
      if (backtrackResults && backtrackResults.length > 0) {
        selectedQs = backtrackResults.map(item => 
          subjectQuestions.find(q => q.id === item.id)!
        ).filter(Boolean);
      } else {
        selectedQs = [...subjectQuestions]
          .sort(() => 0.5 - Math.random())
          .slice(0, targetCount);
      }

      if (cfg.shuffleQuestions) {
        selectedQs = [...selectedQs].sort(() => Math.random() - 0.5);
      }
      return selectedQs;
    }
    return [];
  });
  const [currentIdx, setCurrentIdx] = useState(0);
  
  // Quiz taking state
  const [answers, setAnswers] = useState<{ [qId: number]: unknown }>({});
  const [submittedQuestions, setSubmittedQuestions] = useState<{ [qId: number]: boolean }>({});
  const [bookmarks, setBookmarks] = useState<number[]>(() => {
    if (typeof window !== "undefined") {
      const userRaw = localStorage.getItem("algoquiz_user");
      if (userRaw) {
        const u = JSON.parse(userRaw);
        return u.bookmarks || [];
      }
    }
    return [];
  });
  const [revealedHints, setRevealedHints] = useState<{ [qId: number]: boolean }>({});
  const [scratchpad, setScratchpad] = useState("");
  const [fullscreen, setFullscreen] = useState(false);
  const [timeLeft, setTimeLeft] = useState<number>(() => {
    if (typeof window !== "undefined") {
      const savedConfig = localStorage.getItem("algoquiz_active_config");
      if (savedConfig) {
        return 5 * 60; // 5 questions * 60s
      }
    }
    return 300;
  });
  const [quizFinished, setQuizFinished] = useState(false);
  const [showAllAnsweredToast, setShowAllAnsweredToast] = useState(false);

  // Power-Ups and Streaks state
  const [fiftyFiftyUsed, setFiftyFiftyUsed] = useState<{ [qId: number]: boolean }>({});
  const [removedOptions, setRemovedOptions] = useState<{ [qId: number]: number[] }>({});
  const [doubleXpEnabled, setDoubleXpEnabled] = useState(false);
  const [freezeTimerSeconds, setFreezeTimerSeconds] = useState(0);
  const [streakCount, setStreakCount] = useState(0);
  const [showStreakPopup, setShowStreakPopup] = useState(false);
  
  // Navigation stack (DSA Stack)
  const navStack = useRef<Stack<number>>(new Stack<number>());

  // DOM Ref for Fullscreen
  const containerRef = useRef<HTMLDivElement>(null);

  const verifyCorrectness = useCallback((q: Question, ans: unknown): boolean => {
    if (ans === undefined || ans === null) return false;

    if (q.type === "mcq" || q.type === "true_false" || q.type === "image") {
      return Number(ans as string | number) === q.correctAnswer;
    }
    if (q.type === "fill_blank" || q.type === "code_output") {
      return String(ans).trim().toLowerCase() === String(q.correctAnswer).trim().toLowerCase();
    }
    if (q.type === "multiple") {
      if (!Array.isArray(ans)) return false;
      const correctList = q.correctAnswer as number[];
      if (ans.length !== correctList.length) return false;
      return ans.every(val => correctList.includes(val as number));
    }
    if (q.type === "arrange") {
      if (!Array.isArray(ans)) return false;
      const correctList = q.correctAnswer as number[];
      return ans.every((val, idx) => val === correctList[idx]);
    }
    if (q.type === "match") {
      if (typeof ans !== "object") return false;
      const ansMap = ans as { [key: number]: number };
      const correctMap = q.correctAnswer as { [key: number]: number };
      return Object.keys(correctMap).every(key => ansMap[Number(key)] === correctMap[Number(key)]);
    }
    if (q.type === "logic") {
      return Number(ans as string | number) === q.correctAnswer;
    }
    return false;
  }, []);

  // Submit complete quiz
  const handleFinishQuiz = useCallback(() => {
    playSound("win");
    setQuizFinished(true);

    let correctCount = 0;

    questions.forEach(q => {
      const ans = answers[q.id];
      if (ans !== undefined) {
        if (verifyCorrectness(q, ans)) {
          correctCount++;
        }
      }
    });

    const accuracy = Math.round((correctCount / questions.length) * 100);
    let xpGained = correctCount * 50 + (accuracy >= 80 ? 50 : 0); // speed/accuracy bonus
    if (doubleXpEnabled) {
      xpGained = xpGained * 2;
    }
    const coinsGained = correctCount * 5 + (accuracy >= 100 ? 25 : 0);

    const attempt = {
      id: generateQuizAttemptId(),
      userId: user?.username || "",
      subject: config?.subject || "",
      difficulty: config?.difficulty || "",
      score: correctCount,
      totalQuestions: questions.length,
      accuracy,
      timeSpent: questions.length * 60 - timeLeft,
      xpGained,
      coinsGained,
      date: new Date().toISOString()
    };

    addAttempt(attempt);
    triggerConfetti();
  }, [playSound, questions, answers, verifyCorrectness, doubleXpEnabled, user, config, timeLeft, addAttempt, triggerConfetti]);

  // Ref to hold the latest finish quiz function for the timer
  const handleFinishQuizRef = useRef(handleFinishQuiz);
  useEffect(() => {
    handleFinishQuizRef.current = handleFinishQuiz;
  }, [handleFinishQuiz]);

  // Load configuration and filter/generate questions
  useEffect(() => {
    if (!config) {
      router.push("/quiz");
    }
  }, [config, router]);

  // Timer Countdown
  useEffect(() => {
    if (quizFinished || questions.length === 0) return;
    
    const interval = setInterval(() => {
      if (freezeTimerSeconds > 0) {
        setFreezeTimerSeconds(prev => prev - 1);
        return;
      }
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(interval);
          handleFinishQuizRef.current();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [quizFinished, questions.length, freezeTimerSeconds]);

  if (!config || questions.length === 0 || !user) {
    return (
      <div className="flex h-96 items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-t-purple-500 border-white/20" />
      </div>
    );
  }

  const currentQuestion = questions[currentIdx];

  // Fullscreen toggle handler
  const toggleFullscreen = () => {
    playSound("click");
    if (!fullscreen) {
      if (containerRef.current?.requestFullscreen) {
        containerRef.current.requestFullscreen();
      }
      setFullscreen(true);
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      }
      setFullscreen(false);
    }
  };

  // Navigations (using Stack for back tracking)
  const handleNext = () => {
    playSound("click");
    if (currentIdx < questions.length - 1) {
      navStack.current.push(currentIdx); // Push current onto navigation stack
      setCurrentIdx(currentIdx + 1);
    }
  };

  const handleBack = () => {
    playSound("click");
    // Pop previous index from navigation stack
    const prevIdx = navStack.current.pop();
    if (prevIdx !== undefined) {
      setCurrentIdx(prevIdx);
    } else if (currentIdx > 0) {
      setCurrentIdx(currentIdx - 1);
    }
  };

  // Bookmark toggler
  const handleToggleBookmark = () => {
    playSound("click");
    const updated = { ...user };
    if (updated.bookmarks.includes(currentQuestion.id)) {
      updated.bookmarks = updated.bookmarks.filter(id => id !== currentQuestion.id);
    } else {
      updated.bookmarks.push(currentQuestion.id);
    }
    setBookmarks(updated.bookmarks);
    updateUser(updated);
  };

  // Greedy hint helper
  const handleRequestHint = () => {
    if (revealedHints[currentQuestion.id]) return;
    
    // INTEGRATION: Greedy Hint Optimizer.
    // Hints have different relevance and costs. We calculate which hints to allocate.
    const hintsPool: HintItem[] = [
      { id: "h1", name: "Structural Clue", cost: 5, relevance: 6 },
      { id: "h2", name: "Direct Solution Keyword", cost: 15, relevance: 9 },
      { id: "h3", name: "Elimination Helper", cost: 8, relevance: 7 }
    ];

    // Select the optimal hints based on user's coins budget
    const chosenHints = getOptimalHints(hintsPool, user.coins);
    if (chosenHints.length === 0) {
      alert("Insufficient coins to purchase a hint!");
      playSound("incorrect");
      return;
    }

    playSound("correct");
    // Spend coins for the top optimal hint
    const optimalHint = chosenHints[0];
    const updated = { ...user };
    updated.coins -= optimalHint.cost;
    updateUser(updated);

    setRevealedHints(prev => ({
      ...prev,
      [currentQuestion.id]: true
    }));
  };

  const handleUseFreezeTimer = () => {
    if (user.coins < 15) {
      alert("Not enough coins! You need 15 coins to freeze time.");
      playSound("incorrect");
      return;
    }
    playSound("click");
    const updated = { ...user, coins: user.coins - 15 };
    updateUser(updated);
    setFreezeTimerSeconds(15);
    triggerConfetti();
  };

  const handleUseFiftyFifty = () => {
    if (currentQuestion.type !== "mcq") {
      alert("Fifty-Fifty can only be used on Multiple Choice Questions!");
      playSound("incorrect");
      return;
    }
    if (fiftyFiftyUsed[currentQuestion.id]) {
      alert("Fifty-Fifty already used on this question!");
      playSound("incorrect");
      return;
    }
    if (user.coins < 20) {
      alert("Not enough coins! You need 20 coins for Fifty-Fifty.");
      playSound("incorrect");
      return;
    }
    playSound("click");

    const updated = { ...user, coins: user.coins - 20 };
    updateUser(updated);

    const correctIdx = Number(currentQuestion.correctAnswer);
    const totalOptions = currentQuestion.options?.length || 4;
    const wrongIndices: number[] = [];
    for (let i = 0; i < totalOptions; i++) {
      if (i !== correctIdx) wrongIndices.push(i);
    }

    const toRemove = wrongIndices.sort(() => Math.random() - 0.5).slice(0, 2);
    setRemovedOptions(prev => ({
      ...prev,
      [currentQuestion.id]: toRemove
    }));
    setFiftyFiftyUsed(prev => ({
      ...prev,
      [currentQuestion.id]: true
    }));
  };

  const handleUseDoubleXp = () => {
    if (doubleXpEnabled) {
      alert("Double XP is already active for this quiz!");
      playSound("incorrect");
      return;
    }
    if (user.coins < 25) {
      alert("Not enough coins! You need 25 coins to enable Double XP.");
      playSound("incorrect");
      return;
    }
    playSound("click");

    const updated = { ...user, coins: user.coins - 25 };
    updateUser(updated);
    setDoubleXpEnabled(true);
    triggerConfetti();
  };

  // Handle answers matching
  const handleSelectAnswer = (ans: unknown) => {
    setAnswers(prev => ({
      ...prev,
      [currentQuestion.id]: ans
    }));
  };

  const handleLockAnswer = () => {
    if (answers[currentQuestion.id] === undefined) return;
    playSound("click");
    const newSubmitted = {
      ...submittedQuestions,
      [currentQuestion.id]: true
    };
    setSubmittedQuestions(newSubmitted);

    const isCorrect = verifyCorrectness(currentQuestion, answers[currentQuestion.id]);
    if (isCorrect) {
      playSound("correct");
      setStreakCount(prev => {
        const next = prev + 1;
        if (next >= 3) {
          setShowStreakPopup(true);
          setTimeout(() => setShowStreakPopup(false), 2500);
        }
        return next;
      });
    } else {
      playSound("incorrect");
      setStreakCount(0);
    }

    // Show toast if this was the last unanswered question
    const totalSubmitted = Object.keys(newSubmitted).length;
    if (totalSubmitted === questions.length && !showAllAnsweredToast) {
      setShowAllAnsweredToast(true);
      setTimeout(() => setShowAllAnsweredToast(false), 5000);
    }
  };



  // Formatted timer
  const formatTime = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const s = secs % 60;
    return `${mins}:${s < 10 ? "0" : ""}${s}`;
  };

  return (
    <div ref={containerRef} className={`w-full relative ${fullscreen ? "bg-[#06070d] p-8 min-h-screen" : ""}`}>
      
      {/* ALL ANSWERED TOAST */}
      <AnimatePresence>
        {showAllAnsweredToast && (
          <motion.div
            initial={{ opacity: 0, y: 60, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 60, scale: 0.9 }}
            className="fixed bottom-28 left-1/2 -translate-x-1/2 z-50 flex items-center space-x-3 bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-bold text-sm py-3 px-6 rounded-2xl shadow-2xl border border-emerald-400/30"
          >
            <CheckCircle2 className="h-5 w-5" />
            <span>🎉 All questions answered! Scroll down or click Complete Quiz to save your score.</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* STREAK COMBO POPUP */}
      <AnimatePresence>
        {showStreakPopup && (
          <motion.div 
            initial={{ opacity: 0, y: -50, scale: 0.8 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.8 }}
            className="fixed top-10 left-1/2 transform -translate-x-1/2 z-50 bg-gradient-to-r from-red-500 via-orange-500 to-yellow-500 text-slate-950 font-black text-xs py-2.5 px-6 rounded-full shadow-2xl border border-yellow-300 flex items-center space-x-2"
          >
            <Flame className="h-4 w-4 fill-current text-slate-950" />
            <span>🔥 STREAK COMBO x{streakCount}! EXTRA XP BOOSTER! 🔥</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* HEADER CONTROLS */}
      <div className="flex justify-between items-center bg-slate-950/40 p-4 border border-white/10 rounded-2xl mb-6">
        <div className="flex items-center space-x-3">
          <button
            onClick={() => { playSound("click"); router.push("/quiz"); }}
            className="p-2 rounded-xl bg-white/5 border border-white/5 text-slate-400 hover:text-white"
          >
            <Home className="h-4 w-4" />
          </button>
          <div>
            <h3 className="font-bold text-white text-sm">{config.subject} Quiz</h3>
            <p className="text-[10px] text-purple-400 font-bold uppercase">{config.difficulty} Mode</p>
          </div>
        </div>

        {/* Timer */}
        {config.timedMode && (
          <div className={`flex items-center space-x-2 px-3 py-1.5 rounded-xl border font-bold text-xs ${
            timeLeft < 60 ? "border-red-500/40 bg-red-500/10 text-red-400 animate-pulse" : "border-purple-500/40 bg-purple-500/10 text-purple-400"
          }`}>
            <span className="h-2 w-2 rounded-full bg-red-500" />
            <span>{formatTime(timeLeft)}</span>
          </div>
        )}

        <div className="flex items-center space-x-2">
          {/* Bookmark */}
          <button
            onClick={handleToggleBookmark}
            className={`p-2.5 rounded-xl border text-xs transition ${
              bookmarks.includes(currentQuestion.id) 
                ? "border-yellow-500/50 bg-yellow-500/10 text-yellow-400" 
                : "border-white/5 bg-white/5 text-slate-400 hover:text-white"
            }`}
          >
            <BookMarked className="h-4.5 w-4.5" />
          </button>

          {/* Fullscreen */}
          <button
            onClick={toggleFullscreen}
            className="p-2.5 rounded-xl border border-white/5 bg-white/5 text-slate-400 hover:text-white transition"
          >
            {fullscreen ? <Minimize2 className="h-4.5 w-4.5" /> : <Maximize2 className="h-4.5 w-4.5" />}
          </button>
        </div>
      </div>

      {/* POWER-UPS INVENTORY BAR */}
      {!quizFinished && (
        <div className="glass rounded-2xl p-4 border border-white/10 mb-6 bg-gradient-to-r from-slate-950/60 via-purple-950/10 to-slate-950/60 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center space-x-2">
            <Sparkles className="h-4 w-4 text-purple-400" />
            <span className="text-xs font-bold text-white uppercase tracking-wider">Active Inventory Power-ups</span>
          </div>

          <div className="flex items-center gap-3">
            {/* Freeze Timer */}
            <button
              onClick={handleUseFreezeTimer}
              disabled={freezeTimerSeconds > 0 || user.coins < 15}
              className={`px-3 py-1.5 rounded-xl border text-[10px] font-bold flex items-center space-x-1.5 transition active:scale-95 ${
                freezeTimerSeconds > 0
                  ? "border-blue-500 bg-blue-500/20 text-blue-300 animate-pulse"
                  : "border-blue-500/20 bg-blue-500/5 text-blue-400 hover:bg-blue-500/10 disabled:opacity-40"
              }`}
            >
              <span>❄️ Freeze (15 Coins)</span>
              {freezeTimerSeconds > 0 && <span>({freezeTimerSeconds}s)</span>}
            </button>

            {/* Fifty Fifty */}
            <button
              onClick={handleUseFiftyFifty}
              disabled={currentQuestion.type !== "mcq" || fiftyFiftyUsed[currentQuestion.id] || user.coins < 20}
              className={`px-3 py-1.5 rounded-xl border text-[10px] font-bold flex items-center space-x-1.5 transition active:scale-95 ${
                fiftyFiftyUsed[currentQuestion.id]
                  ? "border-slate-500 bg-slate-900 text-slate-500"
                  : "border-purple-500/20 bg-purple-500/5 text-purple-400 hover:bg-purple-500/10 disabled:opacity-40"
              }`}
            >
              <span>🌓 50-50 (20 Coins)</span>
            </button>

            {/* Double XP */}
            <button
              onClick={handleUseDoubleXp}
              disabled={doubleXpEnabled || user.coins < 25}
              className={`px-3 py-1.5 rounded-xl border text-[10px] font-bold flex items-center space-x-1.5 transition active:scale-95 ${
                doubleXpEnabled
                  ? "border-yellow-500 bg-yellow-500/20 text-yellow-300"
                  : "border-yellow-500/20 bg-yellow-500/5 text-yellow-400 hover:bg-yellow-500/10 disabled:opacity-40"
              }`}
            >
              <span>🔥 Double XP (25 Coins)</span>
              {doubleXpEnabled && <span>(Active)</span>}
            </button>
          </div>
        </div>
      )}

      {/* QUIZ WORKSPACE */}
      {!quizFinished ? (
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          
          {/* QUESTIONS PALETTE & SCRATCHPAD */}
          <div className="space-y-6 lg:order-last">
            {/* Palette */}
            <div className="glass rounded-2xl p-5 border border-white/5 space-y-4">
              <h4 className="text-xs font-bold text-white uppercase tracking-wider">Question Palette</h4>
              <div className="grid grid-cols-5 gap-2">
                {questions.map((q, idx) => {
                  const isCurrent = idx === currentIdx;
                  const isAnswered = answers[q.id] !== undefined;
                  const isSubmitted = submittedQuestions[q.id];
                  
                  return (
                    <button
                      key={idx}
                      onClick={() => { playSound("click"); setCurrentIdx(idx); }}
                      className={`h-9 rounded-lg font-bold text-xs border transition flex items-center justify-center ${
                        isCurrent 
                          ? "bg-purple-600 border-purple-500 text-white shadow-lg"
                          : isSubmitted
                            ? "bg-emerald-500/20 border-emerald-500/40 text-emerald-400"
                            : isAnswered
                              ? "bg-blue-500/20 border-blue-500/40 text-blue-400"
                              : "bg-slate-900 border-white/5 text-slate-500 hover:text-white"
                      }`}
                    >
                      {idx + 1}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Live Accuracy Tracker */}
            <div className="glass rounded-2xl p-5 border border-white/5 space-y-3">
              <h4 className="text-xs font-bold text-white uppercase tracking-wider">Live Stats</h4>
              {(() => {
                const answered = Object.keys(submittedQuestions).length;
                const correct = questions.filter(q => submittedQuestions[q.id] && verifyCorrectness(q, answers[q.id])).length;
                const incorrect = answered - correct;
                const skipped = questions.length - answered;
                const projectedXp = correct * 50 + (correct === questions.length ? 50 : 0);
                return (
                  <div className="space-y-2.5">
                    <div className="flex justify-between text-xs">
                      <span className="text-emerald-400 font-bold">✓ Correct</span>
                      <span className="text-emerald-400 font-black">{correct}</span>
                    </div>
                    <div className="flex justify-between text-xs">
                      <span className="text-red-400 font-bold">✗ Incorrect</span>
                      <span className="text-red-400 font-black">{incorrect}</span>
                    </div>
                    <div className="flex justify-between text-xs">
                      <span className="text-slate-400 font-bold">⊘ Remaining</span>
                      <span className="text-slate-400 font-black">{skipped}</span>
                    </div>
                    <div className="h-[1px] bg-white/5" />
                    <div className="flex justify-between text-xs">
                      <span className="text-yellow-400 font-bold">⚡ Projected XP</span>
                      <span className="text-yellow-400 font-black">+{doubleXpEnabled ? projectedXp * 2 : projectedXp}</span>
                    </div>
                    <div className="w-full bg-slate-900 rounded-full h-1.5 overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-emerald-500 to-purple-500 transition-all duration-500"
                        style={{ width: `${answered === 0 ? 0 : Math.round((answered / questions.length) * 100)}%` }}
                      />
                    </div>
                    <div className="text-[10px] text-center text-slate-500">{answered} of {questions.length} answered</div>
                  </div>
                );
              })()}
            </div>

            {/* Scratchpad */}
            <div className="glass rounded-2xl p-5 border border-white/5 space-y-3">
              <h4 className="text-xs font-bold text-white uppercase tracking-wider flex items-center space-x-2">
                <FileText className="h-4 w-4 text-slate-400" />
                <span>Compiler Scratchpad</span>
              </h4>
              <textarea
                placeholder="Write pseudocode, trace loops, or take notes here..."
                value={scratchpad}
                onChange={(e) => setScratchpad(e.target.value)}
                rows={5}
                className="w-full bg-slate-950/80 border border-white/10 rounded-xl p-3 text-xs font-mono text-slate-300 focus:outline-none focus:border-purple-500/80 resize-none"
              />
            </div>
          </div>

          {/* MAIN PLAYER PANEL */}
          <div className="lg:col-span-3 space-y-6">
            
            {/* QUESTION DISPLAY */}
            <div className="glass rounded-3xl p-6 md:p-8 border border-white/5 relative overflow-hidden space-y-6">
              {/* Frost Timer freeze overlay */}
              {freezeTimerSeconds > 0 && (
                <div className="absolute inset-0 bg-blue-500/5 border-4 border-blue-400/30 rounded-3xl pointer-events-none z-10 animate-pulse" />
              )}
              
              {/* Question Text */}
              <div className="space-y-3">
                <div className="flex items-center justify-between text-xs">
                  <span className="px-2 py-0.5 rounded bg-blue-500/20 border border-blue-500/30 text-blue-300 font-bold uppercase">
                    {currentQuestion.subject}
                  </span>
                  <span className="text-slate-500">Question {currentIdx + 1} of {questions.length}</span>
                </div>
                <h3 className="text-lg font-bold text-white leading-relaxed">{currentQuestion.questionText}</h3>
              </div>

              {/* Code Snippet if exists */}
              {currentQuestion.codeSnippet && (
                <div className="rounded-xl border border-white/5 bg-slate-950 p-4 font-mono text-xs text-slate-300 overflow-x-auto relative">
                  <div className="absolute top-2 right-2 text-[9px] uppercase font-bold text-slate-500">Source</div>
                  <pre><code>{currentQuestion.codeSnippet}</code></pre>
                </div>
              )}

              {/* Image representation if exists */}
              {currentQuestion.imageRepresentation && (
                <div className="rounded-xl border border-white/5 bg-slate-950/60 p-4 font-mono text-xs text-purple-400 flex items-center justify-center">
                  <pre className="text-center">{currentQuestion.imageRepresentation}</pre>
                </div>
              )}

              {/* OPTION COMPONENT INJECTORS */}
              <div className="pt-2">
                {/* MCQ */}
                {currentQuestion.type === "mcq" && currentQuestion.options && (
                  <div className="space-y-3">
                    {currentQuestion.options.map((opt, idx) => {
                      const isRemoved = (removedOptions[currentQuestion.id] || []).includes(idx);
                      if (isRemoved) {
                        return (
                          <div
                            key={idx}
                            className="w-full p-4 rounded-xl border border-white/5 bg-slate-950/20 text-slate-600 text-xs italic flex items-center justify-between opacity-50"
                          >
                            <span>[Option Eliminated by Fifty-Fifty]</span>
                          </div>
                        );
                      }

                      const isSelected = answers[currentQuestion.id] === idx;
                      const isSubmitted = submittedQuestions[currentQuestion.id];
                      const isCorrectAnswer = idx === Number(currentQuestion.correctAnswer);

                      let buttonStyle = "bg-slate-900/60 border-white/5 text-slate-300 hover:bg-slate-900 hover:text-white";
                      if (isSelected) {
                        buttonStyle = "bg-purple-600/20 border-purple-500 text-white";
                      }
                      if (isSubmitted) {
                        if (isCorrectAnswer) {
                          buttonStyle = "bg-emerald-500/20 border-emerald-500 text-emerald-400 font-bold scale-[1.01] animate-scale-up-bounce";
                        } else if (isSelected) {
                          buttonStyle = "bg-red-500/20 border-red-500 text-red-400 animate-shake";
                        }
                      }

                      return (
                        <button
                          key={idx}
                          disabled={isSubmitted}
                          onClick={() => handleSelectAnswer(idx)}
                          className={`w-full text-left p-4 rounded-xl border text-sm transition-all duration-300 flex items-center justify-between ${buttonStyle}`}
                        >
                          <span>{opt}</span>
                          <div className={`h-4.5 w-4.5 rounded-full border flex items-center justify-center ${
                            isSelected ? "border-purple-500 bg-purple-500" : "border-slate-700"
                          }`}>
                            {isSelected && <span className="h-2 w-2 rounded-full bg-white" />}
                          </div>
                        </button>
                      );
                    })}
                  </div>
                )}

                {/* Multiple Correct */}
                {currentQuestion.type === "multiple" && currentQuestion.options && (
                  <div className="space-y-3">
                    {currentQuestion.options.map((opt, idx) => {
                      const currentSelection = (answers[currentQuestion.id] as number[]) || [];
                      const isSelected = currentSelection.includes(idx);
                      
                      const handleCheckToggle = () => {
                        const nextSelection = isSelected 
                          ? currentSelection.filter((item: number) => item !== idx)
                          : [...currentSelection, idx];
                        handleSelectAnswer(nextSelection);
                      };

                      return (
                        <button
                          key={idx}
                          disabled={submittedQuestions[currentQuestion.id]}
                          onClick={handleCheckToggle}
                          className={`w-full text-left p-4 rounded-xl border text-sm transition flex items-center justify-between ${
                            isSelected 
                              ? "bg-purple-600/20 border-purple-500 text-white" 
                              : "bg-slate-900/60 border-white/5 text-slate-300 hover:bg-slate-900 hover:text-white"
                          }`}
                        >
                          <span>{opt}</span>
                          <div className={`h-4.5 w-4.5 rounded border flex items-center justify-center ${
                            isSelected ? "border-purple-500 bg-purple-500" : "border-slate-700"
                          }`}>
                            {isSelected && <span className="text-[10px] text-white">✓</span>}
                          </div>
                        </button>
                      );
                    })}
                  </div>
                )}

                {/* True/False */}
                {currentQuestion.type === "true_false" && currentQuestion.options && (
                  <div className="grid grid-cols-2 gap-4">
                    {currentQuestion.options.map((opt, idx) => (
                      <button
                        key={idx}
                        disabled={submittedQuestions[currentQuestion.id]}
                        onClick={() => handleSelectAnswer(idx)}
                        className={`p-6 rounded-2xl border text-center font-bold text-sm transition ${
                          answers[currentQuestion.id] === idx 
                            ? "bg-purple-600/20 border-purple-500 text-white shadow" 
                            : "bg-slate-900/60 border-white/5 text-slate-300 hover:bg-slate-900 hover:text-white"
                        }`}
                      >
                        {opt}
                      </button>
                    ))}
                  </div>
                )}

                {/* Fill in Blank & Code Output */}
                {(currentQuestion.type === "fill_blank" || currentQuestion.type === "code_output") && (
                  <div className="space-y-3">
                    <input
                      type="text"
                      disabled={submittedQuestions[currentQuestion.id]}
                      placeholder="Type your answer here..."
                      value={(answers[currentQuestion.id] as string) || ""}
                      onChange={(e) => handleSelectAnswer(e.target.value)}
                      className="w-full bg-slate-900/60 border border-white/10 rounded-xl py-4 px-4 text-sm text-white focus:outline-none focus:border-purple-500 transition"
                    />
                  </div>
                )}

                {/* Arrange steps */}
                {currentQuestion.type === "arrange" && currentQuestion.options && (
                  <div className="space-y-4">
                    <div className="text-xs text-slate-400">Click steps below to arrange them in order:</div>
                    
                    {/* User compilation path */}
                    <div className="min-h-12 p-3 rounded-xl bg-slate-950 border border-white/10 flex flex-col gap-2">
                      {((answers[currentQuestion.id] as number[]) || []).map((optIdx: number, stepNum: number) => (
                        <div key={stepNum} className="flex items-center space-x-2 p-2 rounded-lg bg-purple-600/20 border border-purple-500/30 text-xs text-white">
                          <span className="font-bold text-[10px] bg-purple-500 text-slate-950 h-5 w-5 rounded-full flex items-center justify-center flex-shrink-0">
                            {stepNum + 1}
                          </span>
                          <span>{currentQuestion.options![optIdx]}</span>
                        </div>
                      ))}
                      {(!answers[currentQuestion.id] || (answers[currentQuestion.id] as number[]).length === 0) && (
                        <div className="text-xs text-slate-600 italic p-1">No steps selected yet. Click blocks below.</div>
                      )}
                    </div>
 
                    {/* Available options picker */}
                    <div className="grid grid-cols-1 gap-2">
                      {currentQuestion.options.map((opt, idx) => {
                        const currentSelection = (answers[currentQuestion.id] as number[]) || [];
                        const isPicked = currentSelection.includes(idx);
                        
                        const handleSelectStep = () => {
                          if (submittedQuestions[currentQuestion.id]) return;
                          if (isPicked) {
                            handleSelectAnswer(currentSelection.filter((item: number) => item !== idx));
                          } else {
                            handleSelectAnswer([...currentSelection, idx]);
                          }
                        };

                        return (
                          <button
                            key={idx}
                            type="button"
                            disabled={submittedQuestions[currentQuestion.id]}
                            onClick={handleSelectStep}
                            className={`text-left p-3 rounded-xl border text-xs transition flex items-center space-x-3 ${
                              isPicked 
                                ? "opacity-35 border-transparent bg-slate-900" 
                                : "bg-slate-900 border-white/5 text-slate-300 hover:text-white"
                            }`}
                          >
                            <span className="font-mono text-slate-500">[{idx + 1}]</span>
                            <span>{opt}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Match the Following */}
                {currentQuestion.type === "match" && currentQuestion.options && currentQuestion.matchRight && (
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      {/* Left items */}
                      <div className="space-y-3">
                        <div className="text-[10px] uppercase font-bold text-slate-500 pl-1">Key Column</div>
                        {currentQuestion.options.map((opt, idx) => (
                          <div key={idx} className="p-3 bg-slate-900 rounded-xl border border-white/5 text-xs text-slate-300 h-12 flex items-center">
                            <span>{opt}</span>
                          </div>
                        ))}
                      </div>

                      {/* Matching dropdown selectors */}
                      <div className="space-y-3">
                        <div className="text-[10px] uppercase font-bold text-slate-500 pl-1">Matches To</div>
                        {currentQuestion.options.map((_, leftIdx) => {
                          const currentMapping = (answers[currentQuestion.id] as Record<number, number>) || {};
                          const matchedIdx = currentMapping[leftIdx];

                          const handleMatchChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
                            if (submittedQuestions[currentQuestion.id]) return;
                            const nextMapping = { ...currentMapping };
                            if (e.target.value === "") {
                              delete nextMapping[leftIdx];
                            } else {
                              nextMapping[leftIdx] = Number(e.target.value);
                            }
                            handleSelectAnswer(nextMapping);
                          };

                          return (
                            <select
                              key={leftIdx}
                              disabled={submittedQuestions[currentQuestion.id]}
                              value={matchedIdx !== undefined ? matchedIdx : ""}
                              onChange={handleMatchChange}
                              className="w-full bg-slate-950 border border-white/10 rounded-xl px-3 text-xs text-slate-300 h-12 focus:outline-none focus:border-purple-500 transition"
                            >
                              <option value="">-- Choose Match --</option>
                              {currentQuestion.matchRight!.map((rightOpt, rightIdx) => (
                                <option key={rightIdx} value={rightIdx}>
                                  {rightOpt}
                                </option>
                              ))}
                            </select>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                )}

                {/* Programming Logic */}
                {currentQuestion.type === "logic" && currentQuestion.options && (
                  <div className="space-y-3">
                    {currentQuestion.options.map((opt, idx) => (
                      <button
                        key={idx}
                        disabled={submittedQuestions[currentQuestion.id]}
                        onClick={() => handleSelectAnswer(idx)}
                        className={`w-full text-left p-4 rounded-xl border text-sm transition flex items-center justify-between ${
                          answers[currentQuestion.id] === idx 
                            ? "bg-purple-600/20 border-purple-500 text-white" 
                            : "bg-slate-900/60 border-white/5 text-slate-300 hover:bg-slate-900 hover:text-white"
                        }`}
                      >
                        <span className="font-mono text-xs">{opt}</span>
                        <div className={`h-4.5 w-4.5 rounded-full border flex items-center justify-center ${
                          answers[currentQuestion.id] === idx ? "border-purple-500 bg-purple-500" : "border-slate-700"
                        }`}>
                          {answers[currentQuestion.id] === idx && <span className="h-2 w-2 rounded-full bg-white" />}
                        </div>
                      </button>
                    ))}
                  </div>
                )}

              </div>

              {/* AI CHATBOT EXPLANATION BUBBLE FOR LOCK */}
              {submittedQuestions[currentQuestion.id] && (
                <div className="p-4 rounded-xl bg-purple-500/5 border border-purple-500/10 space-y-2 animate-fade-in">
                  <div className="flex items-center space-x-2 text-purple-400 font-bold text-xs">
                    <Sparkles className="h-4 w-4 animate-spin-slow" />
                    <span>AI Explanation Assistant</span>
                    <span className={`ml-auto text-[9px] px-1.5 py-0.5 rounded ${
                      verifyCorrectness(currentQuestion, answers[currentQuestion.id]) 
                        ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30" 
                        : "bg-red-500/20 text-red-400 border border-red-500/30"
                    }`}>
                      {verifyCorrectness(currentQuestion, answers[currentQuestion.id]) ? "Correct" : "Incorrect"}
                    </span>
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed">{currentQuestion.explanation}</p>
                </div>
              )}

              {/* FOOTER ACTIONS */}
              <div className="flex items-center justify-between border-t border-white/5 pt-6">
                
                {/* Back / Next */}
                <div className="flex space-x-2">
                  <button
                    onClick={handleBack}
                    className="flex items-center space-x-1 px-4 py-2.5 rounded-xl border border-white/5 bg-slate-900 text-slate-300 hover:text-white transition text-xs font-semibold"
                  >
                    <ChevronLeft className="h-4 w-4" />
                    <span>Back</span>
                  </button>
                  <button
                    onClick={handleNext}
                    disabled={currentIdx === questions.length - 1}
                    className="flex items-center space-x-1 px-4 py-2.5 rounded-xl border border-white/5 bg-slate-900 text-slate-300 hover:text-white transition text-xs font-semibold disabled:opacity-30"
                  >
                    <span>Next</span>
                    <ChevronRight className="h-4 w-4" />
                  </button>
                </div>

                {/* Lock / Greedy Hint */}
                <div className="flex space-x-2">
                  {!revealedHints[currentQuestion.id] && !submittedQuestions[currentQuestion.id] && (
                    <button
                      onClick={handleRequestHint}
                      className="flex items-center space-x-1.5 px-3 py-2 rounded-xl border border-amber-500/30 bg-amber-500/10 text-amber-400 hover:text-amber-300 transition text-xs font-semibold"
                    >
                      <Coins className="h-3.5 w-3.5" />
                      <span>Use Hint (Cost: 5)</span>
                    </button>
                  )}
                  {revealedHints[currentQuestion.id] && (
                    <div className="p-2.5 rounded-xl bg-amber-500/5 border border-amber-500/10 text-xs text-amber-300 max-w-xs font-medium">
                      💡 Hint: {currentQuestion.hint}
                    </div>
                  )}

                  {!submittedQuestions[currentQuestion.id] ? (
                    <button
                      onClick={handleLockAnswer}
                      disabled={answers[currentQuestion.id] === undefined}
                      className="px-5 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold transition shadow-lg disabled:opacity-50"
                    >
                      Submit Answer
                    </button>
                  ) : (
                    <button
                      disabled
                      className="px-5 py-2.5 rounded-xl bg-white/5 border border-white/5 text-slate-500 text-xs font-bold"
                    >
                      Locked
                    </button>
                  )}
                </div>

              </div>

            </div>

          </div>

        </div>

      ) : (
        /* QUIZ SUMMARY PANEL */
        <div className="glass rounded-3xl p-8 border border-white/10 max-w-2xl mx-auto text-center space-y-8 animate-scale-up">
          <div className="space-y-3">
            <span className="text-5xl">🏆</span>
            <h2 className="text-2xl md:text-3xl font-extrabold text-white">Quiz Completed!</h2>
            <p className="text-xs text-slate-400">Your results have been evaluated, XP has been credited, and performance graphs have refreshed.</p>
          </div>

          {/* Results dashboard metrics */}
          <div className="grid grid-cols-3 gap-4 py-4 border-y border-white/5">
            <div className="space-y-1">
              <div className="text-[10px] text-slate-500 uppercase font-semibold">Total Score</div>
              <div className="text-2xl font-black text-white">
                {questions.filter(q => verifyCorrectness(q, answers[q.id])).length} / {questions.length}
              </div>
            </div>
            <div className="space-y-1">
              <div className="text-[10px] text-slate-500 uppercase font-semibold">Accuracy</div>
              <div className="text-2xl font-black text-purple-400">
                {Math.round(
                  (questions.filter(q => verifyCorrectness(q, answers[q.id])).length / questions.length) * 100
                )}%
              </div>
            </div>
            <div className="space-y-1">
              <div className="text-[10px] text-slate-500 uppercase font-semibold">XP Gained</div>
              <div className="text-2xl font-black text-yellow-400">
                +{questions.filter(q => verifyCorrectness(q, answers[q.id])).length * 50}
              </div>
            </div>
          </div>

          {/* Correct/Incorrect List summary */}
          <div className="space-y-3 text-left">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">Question Verification Sheet</h4>
            <div className="divide-y divide-white/5">
              {questions.map((q, idx) => {
                const isCorrect = verifyCorrectness(q, answers[q.id]);
                return (
                  <div key={idx} className="py-2.5 flex items-center justify-between text-xs">
                    <div className="space-y-0.5">
                      <div className="font-bold text-slate-300">Q{idx + 1}: {q.questionText.slice(0, 50)}...</div>
                      <div className="text-[10px] text-slate-500">{q.subject} • {q.difficulty}</div>
                    </div>
                    {isCorrect ? (
                      <span className="flex items-center space-x-1 text-emerald-400 font-bold bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded">
                        <CheckCircle2 className="h-3 w-3" />
                        <span>Correct</span>
                      </span>
                    ) : (
                      <span className="flex items-center space-x-1 text-red-400 font-bold bg-red-500/10 border border-red-500/20 px-2 py-0.5 rounded">
                        <AlertCircle className="h-3 w-3" />
                        <span>Incorrect</span>
                      </span>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          <div className="flex gap-4">
            <button
              onClick={() => { playSound("click"); router.push("/dashboard"); }}
              className="flex-1 py-3 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white font-bold text-sm shadow transition"
            >
              Back to Dashboard
            </button>
            <button
              onClick={() => { playSound("click"); router.push("/quiz"); }}
              className="px-6 py-3 rounded-xl border border-white/10 text-slate-300 hover:text-white transition text-xs font-semibold"
            >
              Play Another Subject
            </button>
          </div>
        </div>
      )}

      {/* STICKY COMPLETE QUIZ BAR — always visible at bottom */}
      {!quizFinished && (
        <div className="fixed bottom-0 left-0 right-0 z-40 bg-slate-950/80 backdrop-blur-xl border-t border-white/10 px-4 py-3 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 flex-1 min-w-0">
            <div className="flex-1 bg-slate-800 rounded-full h-2 overflow-hidden max-w-xs">
              <div
                className="h-full bg-gradient-to-r from-blue-500 via-purple-500 to-emerald-500 transition-all duration-700 ease-out"
                style={{
                  width: `${questions.length === 0 ? 0 : Math.round((Object.keys(submittedQuestions).length / questions.length) * 100)}%`
                }}
              />
            </div>
            <span className="text-xs text-slate-400 whitespace-nowrap">
              <span className="font-bold text-white">{Object.keys(submittedQuestions).length}</span>
              {" / "}{questions.length} answered
            </span>
          </div>
          <button
            onClick={handleFinishQuiz}
            className={`px-6 py-2.5 rounded-xl font-bold text-sm shadow-lg transition-all duration-300 ${
              Object.keys(submittedQuestions).length === questions.length
                ? "bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-white shadow-emerald-500/30"
                : "bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white"
            }`}
          >
            {Object.keys(submittedQuestions).length === questions.length ? "🏆 Complete & Save Score" : "Complete Quiz"}
          </button>
        </div>
      )}

    </div>
  );
}
