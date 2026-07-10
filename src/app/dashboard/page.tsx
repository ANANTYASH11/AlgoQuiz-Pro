"use client";

import { useEffect, useState } from "react";
import { useAppState } from "@/components/AppState";
import { useRouter } from "next/navigation";
import { 
  Zap, 
  Trophy, 
  Flame, 
  Target, 
  TrendingUp, 
  Calendar, 
  BookOpen, 
  ShieldCheck, 
  Play,
  Sparkles
} from "lucide-react";
import { 
  ResponsiveContainer, 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  Tooltip, 
  CartesianGrid, 
  RadarChart, 
  PolarGrid, 
  PolarAngleAxis, 
  PolarRadiusAxis, 
  Radar 
} from "recharts";

export default function DashboardPage() {
  const router = useRouter();
  const { user, attempts, playSound, updateUser } = useAppState();
  const [spinWheelOpen, setSpinWheelOpen] = useState(false);
  const [spinResult, setSpinResult] = useState<string | null>(null);
  const [spinning, setSpinning] = useState(false);

  const handleLaunchChallenge = () => {
    playSound("click");
    const quizConfigs = {
      subject: "Algorithms",
      difficulty: "Medium",
      timedMode: true,
      negativeMarking: true,
      shuffleQuestions: true,
      questionCount: 5
    };
    if (typeof window !== "undefined") {
      localStorage.setItem("algoquiz_active_config", JSON.stringify(quizConfigs));
    }
    router.push("/quiz/play");
  };

  useEffect(() => {
    // Redirect to auth if not logged in
    const token = localStorage.getItem("algoquiz_token");
    if (!token) {
      router.push("/auth");
    }
  }, [user, router]);

  if (!user) {
    return (
      <div className="flex h-96 items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-t-purple-500 border-white/20" />
      </div>
    );
  }

  // RECHARTS LINE GRAPH DATA
  const lineChartData = attempts.map((a, idx) => ({
    name: `Quiz ${idx + 1}`,
    Accuracy: a.accuracy,
    XP: a.xpGained,
  }));

  // Default line chart data if attempts are empty
  const defaultLineData = [
    { name: "Week 1", Accuracy: 65, XP: 100 },
    { name: "Week 2", Accuracy: 72, XP: 150 },
    { name: "Week 3", Accuracy: 70, XP: 120 },
    { name: "Week 4", Accuracy: 78, XP: 250 },
  ];

  const displayLineData = lineChartData.length > 0 ? lineChartData : defaultLineData;

  // RECHARTS RADAR DATA
  const radarData = [
    { subject: "Data Structures", A: 85, B: 110, fullMark: 100 },
    { subject: "Algorithms", A: user.weakSubjects.includes("Algorithms") ? 45 : 75, B: 110, fullMark: 100 },
    { subject: "Operating System", A: 70, B: 110, fullMark: 100 },
    { subject: "DBMS", A: user.weakSubjects.includes("DBMS") ? 50 : 80, B: 110, fullMark: 100 },
    { subject: "Computer Networks", A: 65, B: 110, fullMark: 100 },
    { subject: "JavaScript", A: 88, B: 110, fullMark: 100 },
    { subject: "AI", A: 75, B: 110, fullMark: 100 },
    { subject: "Cloud Computing", A: 72, B: 110, fullMark: 100 },
    { subject: "Software Engineering", A: 80, B: 110, fullMark: 100 },
    { subject: "Theory of Computation", A: 70, B: 110, fullMark: 100 },
    { subject: "Cyber Security", A: 82, B: 110, fullMark: 100 },
    { subject: "Computer Architecture", A: 68, B: 110, fullMark: 100 }
  ].map(s => {
    const subAttempts = attempts.filter(a => a.subject.toLowerCase() === s.subject.toLowerCase());
    if (subAttempts.length > 0) {
      const avgAcc = subAttempts.reduce((sum, a) => sum + a.accuracy, 0) / subAttempts.length;
      return { ...s, A: Math.round(avgAcc) };
    }
    return s;
  });

  // Daily spin rewards list
  const rewards = ["10 Coins", "25 XP", "Free Hint", "Double XP Ticket", "5 Coins", "Try Again"];

  const handleSpinWheel = () => {
    if (spinning) return;
    playSound("click");
    setSpinning(true);
    setSpinResult(null);

    // Simulate 2s spin delay
    setTimeout(() => {
      const randomIdx = Math.floor(Math.random() * rewards.length);
      const won = rewards[randomIdx];
      setSpinResult(won);
      setSpinning(false);
      
      // Update user stats depending on win
      const updatedUser = { ...user };
      if (won.includes("Coins")) {
        const val = parseInt(won);
        updatedUser.coins += val;
        playSound("win");
      } else if (won.includes("XP")) {
        const val = parseInt(won);
        updatedUser.xp += val;
        playSound("level_up");
      } else if (won.includes("Hint")) {
        updatedUser.badges.push("Hint Ticket");
        playSound("win");
      }
      updatedUser.dailyRewardsClaimed = true;
      updateUser(updatedUser);
    }, 2000);
  };

  return (
    <div className="space-y-8">
      {/* WELCOME BANNER */}
      <section className="glass rounded-3xl p-6 md:p-8 border border-white/10 relative overflow-hidden flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-blue-600/10 via-purple-600/10 to-transparent pointer-events-none" />
        <div className="space-y-2 relative z-10">
          <div className="flex items-center space-x-2">
            <span className="text-2xl">👋</span>
            <h2 className="text-xl md:text-2xl font-bold text-white">Welcome back, {user.username}!</h2>
            {user.role === "admin" && (
              <span className="px-2 py-0.5 rounded bg-red-500/20 text-red-400 border border-red-500/30 text-[10px] uppercase font-bold">Admin</span>
            )}
          </div>
          <p className="text-sm text-slate-400">Your daily streak is burning bright. Complete today&apos;s challenge to maintain your streak!</p>
        </div>
        <div className="flex gap-4 relative z-10 w-full md:w-auto">
          {!user.dailyRewardsClaimed ? (
            <button
              onClick={() => { playSound("click"); setSpinWheelOpen(true); }}
              className="flex-1 md:flex-none flex items-center justify-center space-x-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 font-bold text-sm shadow transition"
            >
              <Sparkles className="h-4 w-4" />
              <span>Claim Daily Reward</span>
            </button>
          ) : (
            <div className="flex-1 md:flex-none flex items-center justify-center space-x-2 px-4 py-2.5 rounded-xl bg-slate-900 border border-white/5 text-slate-500 text-xs font-semibold">
              <ShieldCheck className="h-4 w-4 text-emerald-500" />
              <span>Daily Reward Claimed</span>
            </div>
          )}
        </div>
      </section>

      {/* CORE STATS GRID */}
      <section className="grid grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Streak */}
        <div className="glass rounded-2xl p-5 border border-white/5 flex items-center space-x-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-orange-500/10 text-orange-400">
            <Flame className="h-6 w-6 fill-current animate-bounce" />
          </div>
          <div>
            <div className="text-slate-400 text-xs font-medium">Daily Streak</div>
            <div className="text-xl md:text-2xl font-black text-white">{user.streak} Days</div>
          </div>
        </div>

        {/* Current Rank */}
        <div className="glass rounded-2xl p-5 border border-white/5 flex items-center space-x-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-500/10 text-blue-400">
            <Trophy className="h-6 w-6" />
          </div>
          <div>
            <div className="text-slate-400 text-xs font-medium">Global Rank</div>
            <div className="text-xl md:text-2xl font-black text-white">#{user.rank}</div>
          </div>
        </div>

        {/* XP Points */}
        <div className="glass rounded-2xl p-5 border border-white/5 flex items-center space-x-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-yellow-500/10 text-yellow-400">
            <Zap className="h-6 w-6 fill-current" />
          </div>
          <div>
            <div className="text-slate-400 text-xs font-medium">Total XP</div>
            <div className="text-xl md:text-2xl font-black text-white">{user.xp} XP</div>
          </div>
        </div>

        {/* Accuracy */}
        <div className="glass rounded-2xl p-5 border border-white/5 flex items-center space-x-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-400">
            <Target className="h-6 w-6" />
          </div>
          <div>
            <div className="text-slate-400 text-xs font-medium">Avg Accuracy</div>
            <div className="text-xl md:text-2xl font-black text-white">{user.accuracy}%</div>
          </div>
        </div>
      </section>

      {/* CHARTS & ANALYTICS */}
      <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Line Chart */}
        <div className="glass rounded-2xl p-6 border border-white/5 lg:col-span-2 space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-md font-bold text-white flex items-center space-x-2">
              <TrendingUp className="h-4 w-4 text-purple-400" />
              <span>Performance Accuracy Log</span>
            </h3>
            <span className="text-xs text-slate-400">Moving Window (Avg)</span>
          </div>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={displayLineData}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                <XAxis dataKey="name" stroke="#64748b" fontSize={11} />
                <YAxis stroke="#64748b" fontSize={11} domain={[0, 100]} />
                <Tooltip 
                  contentStyle={{ backgroundColor: "#0f172a", borderColor: "rgba(255,255,255,0.1)", borderRadius: "12px", color: "#fff" }}
                  itemStyle={{ color: "#a78bfa" }}
                />
                <Line type="monotone" dataKey="Accuracy" stroke="#8b5cf6" strokeWidth={3} dot={{ fill: "#3b82f6", r: 4 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Skill Radar */}
        <div className="glass rounded-2xl p-6 border border-white/5 space-y-4 flex flex-col justify-between">
          <h3 className="text-md font-bold text-white flex items-center space-x-2">
            <BookOpen className="h-4 w-4 text-purple-400" />
            <span>Subject Radar Graph</span>
          </h3>
          <div className="h-56 w-full flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart cx="50%" cy="50%" data={radarData}>
                <PolarGrid stroke="rgba(255,255,255,0.05)" />
                <PolarAngleAxis dataKey="subject" stroke="#94a3b8" fontSize={10} />
                <PolarRadiusAxis angle={30} domain={[0, 100]} stroke="#475569" fontSize={8} />
                <Radar name="Skills" dataKey="A" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.25} />
              </RadarChart>
            </ResponsiveContainer>
          </div>
          <div className="text-[10px] text-slate-500 text-center italic">Calculated dynamically based on recent answers accuracy.</div>
        </div>
      </section>

      {/* CHALLENGES & RESUME SHORTCUTS */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Today's Challenge */}
        <div className="glass rounded-2xl p-6 border border-white/5 bg-gradient-to-br from-slate-900/40 via-purple-950/20 to-slate-900/40 flex flex-col justify-between space-y-6">
          <div className="space-y-2">
            <span className="px-2 py-0.5 rounded bg-purple-500/20 text-purple-300 border border-purple-500/30 text-[10px] font-bold uppercase tracking-wider">
              Today&apos;s Challenge
            </span>
            <h3 className="text-lg font-bold text-white">Algorithms & Stack Traversal</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Complete a 5-question logic assessment focused on LIFO stacks and recursion evaluation to earn double coins and keep your streak!
            </p>
          </div>
          <div className="flex justify-between items-center">
            <div className="text-xs text-yellow-400 font-semibold flex items-center space-x-1">
              <Zap className="h-3.5 w-3.5 fill-current" />
              <span>+100 XP & 20 Coins Bonus</span>
            </div>
            <button
              onClick={handleLaunchChallenge}
              className="flex items-center space-x-1 px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold transition shadow-lg shadow-purple-600/10"
            >
              <span>Launch Arena</span>
              <Play className="h-3.5 w-3.5 fill-current" />
            </button>
          </div>
        </div>

        {/* Subjects analysis & AI recommendation */}
        <div className="glass rounded-2xl p-6 border border-white/5 flex flex-col justify-between space-y-4">
          <div className="space-y-3">
            <h3 className="text-sm font-bold text-white">Weak & Strong Subjects</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <span className="text-[10px] text-red-400 font-bold uppercase tracking-wider">Weak Areas (Review)</span>
                <div className="flex flex-wrap gap-1.5">
                  {user.weakSubjects.map((s, idx) => (
                    <span key={idx} className="px-2 py-1 rounded-lg bg-red-500/10 border border-red-500/20 text-xs text-red-300">
                      {s}
                    </span>
                  ))}
                  {user.weakSubjects.length === 0 && <span className="text-xs text-slate-500">None! Keep it up!</span>}
                </div>
              </div>
              <div className="space-y-1.5">
                <span className="text-[10px] text-emerald-400 font-bold uppercase tracking-wider">Strong Areas</span>
                <div className="flex flex-wrap gap-1.5">
                  {user.strongSubjects.map((s, idx) => (
                    <span key={idx} className="px-2 py-1 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-xs text-emerald-300">
                      {s}
                    </span>
                  ))}
                  {user.strongSubjects.length === 0 && <span className="text-xs text-slate-500">No data yet. Solve more quizzes!</span>}
                </div>
              </div>
            </div>
          </div>

          <div className="border-t border-white/5 pt-4">
            <div className="p-3 rounded-xl bg-blue-500/5 border border-blue-500/10 flex items-start space-x-2">
              <Sparkles className="h-4.5 w-4.5 text-blue-400 mt-0.5 flex-shrink-0" />
              <div className="space-y-0.5">
                <div className="text-xs font-bold text-blue-300">AI Topic Recommendation:</div>
                <div className="text-[10px] text-slate-400">
                  {user.weakSubjects.includes("Algorithms") 
                    ? "Study recursive stack tracking. We recommend practicing the Recursion python output." 
                    : "Try taking an Advanced database query design to test your DBMS SQL knowledge."}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* RECENT ACTIVITY LOGS */}
      <section className="glass rounded-2xl p-6 border border-white/5 space-y-4">
        <h3 className="text-sm font-bold text-white flex items-center space-x-2">
          <Calendar className="h-4.5 w-4.5 text-slate-400" />
          <span>Recent Activity Logs</span>
        </h3>
        <div className="divide-y divide-white/5">
          {attempts.map((item, idx) => (
            <div key={idx} className="py-3 flex items-center justify-between text-xs">
              <div className="flex items-center space-x-3">
                <div className={`h-8 w-8 rounded-lg flex items-center justify-center ${
                  item.accuracy >= 80 ? "bg-emerald-500/10 text-emerald-400" : "bg-yellow-500/10 text-yellow-400"
                }`}>
                  <ShieldCheck className="h-4.5 w-4.5" />
                </div>
                <div>
                  <div className="font-bold text-white">{item.subject} Quiz</div>
                  <div className="text-[10px] text-slate-500">{new Date(item.date).toLocaleDateString()} • {item.difficulty}</div>
                </div>
              </div>
              <div className="text-right">
                <div className="font-bold text-white">{item.score}/{item.totalQuestions} ({item.accuracy}%)</div>
                <div className="text-[10px] text-purple-400">+{item.xpGained} XP • +{item.coinsGained} Coins</div>
              </div>
            </div>
          ))}
          {attempts.length === 0 && (
            <div className="py-8 text-center text-slate-500 text-xs">No recent attempts logged. Run your first Quiz to build dashboard graphs!</div>
          )}
        </div>
      </section>

      {/* DAILY SPIN WHEEL MODAL */}
      {spinWheelOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="glass rounded-3xl border border-white/10 w-full max-w-sm p-6 relative overflow-hidden shadow-2xl text-center space-y-6">
            <h3 className="text-lg font-bold text-white flex items-center justify-center space-x-2">
              <Sparkles className="h-5 w-5 text-yellow-400 animate-pulse" />
              <span>Daily Rewards Spin Wheel</span>
            </h3>
            
            <div className="relative mx-auto h-48 w-48 flex items-center justify-center rounded-full border-4 border-slate-700 bg-slate-900 overflow-hidden shadow-xl">
              {/* Spinner Needle */}
              <div className="absolute top-1 z-10 w-3 h-6 bg-red-500 rounded-b-full shadow" />
              
              {/* Spinning items visualizer */}
              <div className={`h-full w-full rounded-full transition-transform duration-[2000ms] ease-out flex items-center justify-center ${
                spinning ? "rotate-[720deg]" : ""
              }`}>
                <div className="grid grid-cols-2 grid-rows-2 h-full w-full opacity-60">
                  <div className="bg-purple-600 flex items-center justify-center text-[10px] font-bold text-white border-r border-b border-white/10">10 Coins</div>
                  <div className="bg-blue-600 flex items-center justify-center text-[10px] font-bold text-white border-b border-white/10">25 XP</div>
                  <div className="bg-emerald-600 flex items-center justify-center text-[10px] font-bold text-white border-r border-white/10">Hint</div>
                  <div className="bg-pink-600 flex items-center justify-center text-[10px] font-bold text-white">Tickets</div>
                </div>
                <div className="absolute h-20 w-20 rounded-full bg-slate-950 border-2 border-slate-700 flex items-center justify-center font-black text-white text-xs">
                  {spinning ? "SPINNING" : "SPIN ME"}
                </div>
              </div>
            </div>

            {spinResult && (
              <div className="p-3 bg-purple-500/10 border border-purple-500/20 rounded-xl text-sm font-bold text-purple-300 animate-bounce">
                🎉 Congratulations! You won {spinResult}!
              </div>
            )}

            <div className="flex gap-4">
              <button
                disabled={spinning || user.dailyRewardsClaimed}
                onClick={handleSpinWheel}
                className="flex-1 py-3 rounded-xl bg-gradient-to-r from-yellow-500 to-amber-500 hover:from-yellow-400 hover:to-amber-400 text-slate-950 font-bold text-sm shadow disabled:opacity-50 transition"
              >
                {spinning ? "Processing..." : "Spin Wheel"}
              </button>
              <button
                onClick={() => { playSound("click"); setSpinWheelOpen(false); }}
                className="px-4 py-3 rounded-xl border border-white/10 text-slate-400 hover:text-white transition text-xs"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
