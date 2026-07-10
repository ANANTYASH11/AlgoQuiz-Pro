"use client";

import { useState, useMemo } from "react";
import { useAppState } from "@/components/AppState";
import { MockDatabase } from "@/lib/db/mockDb";
import { Heap } from "@/lib/dsa/Heap";
import { SegmentTree } from "@/lib/dsa/SegmentTree";
import { 
  Trophy, 
  MapPin, 
  Building, 
  Sparkles,
  SlidersHorizontal,
  Zap
} from "lucide-react";

interface LeaderboardUser {
  username: string;
  xp: number;
  level: number;
  accuracy: number;
  college: string;
  dept: string;
}

export default function LeaderboardPage() {
  const { playSound, user } = useAppState();
  
  const [activeTab, setActiveTab] = useState<"global" | "weekly" | "monthly">("global");
  const [selectedDept, setSelectedDept] = useState<string>("All");
  const [selectedCollege, setSelectedCollege] = useState<string>("All");
  const [sortingAlgorithm, setSortingAlgorithm] = useState<"mergesort" | "quicksort">("mergesort");
  const [sortBy, setSortBy] = useState<"xp" | "accuracy">("xp");

  // Segment Tree Query States
  const [queryStartRank, setQueryStartRank] = useState<string>("1");
  const [queryEndRank, setQueryEndRank] = useState<string>("5");
  
  const { leaderboardList, topThree, remainingList } = useMemo(() => {
    // Fetch leaderboard sorted using selected algorithm
    const rawList = MockDatabase.getLeaderboard(sortBy, sortingAlgorithm) as LeaderboardUser[];
    
    // Apply filters
    let filtered = [...rawList];
    if (selectedDept !== "All") {
      filtered = filtered.filter(u => u.dept === selectedDept);
    }
    if (selectedCollege !== "All") {
      filtered = filtered.filter(u => u.college === selectedCollege);
    }

    // INTEGRATION: Max Heap is used to extract the Top K (Top 3) students
    const maxHeap = new Heap<LeaderboardUser>((a, b) => 
      sortBy === "xp" ? a.xp - b.xp : a.accuracy - b.accuracy
    );
    filtered.forEach(u => maxHeap.insert(u));

    const top: LeaderboardUser[] = [];
    const k = Math.min(3, maxHeap.size());
    for (let i = 0; i < k; i++) {
      const extracted = maxHeap.extract();
      if (extracted) top.push(extracted);
    }

    // Sort top 3 as: [Second Place, First Place, Third Place] for podium display
    const podium: LeaderboardUser[] = [];
    if (top[1]) podium.push(top[1]); // 2nd
    if (top[0]) podium.push(top[0]); // 1st
    if (top[2]) podium.push(top[2]); // 3rd

    // Collect the rest of the ranks
    const rest: LeaderboardUser[] = [];
    while (!maxHeap.isEmpty()) {
      const u = maxHeap.extract();
      if (u) rest.push(u);
    }

    return {
      leaderboardList: filtered,
      topThree: podium,
      remainingList: rest
    };
  }, [selectedDept, selectedCollege, sortingAlgorithm, sortBy]);

  // Segment Tree for dynamic range max queries
  const segmentTreeResult = useMemo(() => {
    const start = parseInt(queryStartRank, 10);
    const end = parseInt(queryEndRank, 10);
    if (isNaN(start) || isNaN(end) || start < 1 || end > leaderboardList.length || start > end) {
      return null;
    }
    const scores = leaderboardList.map(u => (sortBy === "xp" ? u.xp : u.accuracy));
    const tree = new SegmentTree(scores);
    const result = tree.query(start - 1, end - 1);
    return result === -Infinity ? 0 : result;
  }, [leaderboardList, queryStartRank, queryEndRank, sortBy]);

  return (
    <div className="space-y-12">
      {/* HEADER */}
      <section className="text-center max-w-2xl mx-auto space-y-3 py-6">
        <div className="inline-flex items-center space-x-2 rounded-full border border-yellow-500/30 bg-yellow-500/10 px-4 py-1.5 text-xs font-semibold text-yellow-400">
          <Trophy className="h-3.5 w-3.5 fill-current" />
          <span>DSA Glory Board</span>
        </div>
        <h2 className="text-3xl font-extrabold text-white tracking-tight">Leaderboard Ranks</h2>
        <p className="text-sm text-slate-400">
          Real-time score indexes. sorted dynamically using stable Merge Sort and top K Max-Heap filters.
        </p>
      </section>

      {/* TABS & FILTERS */}
      <section className="glass rounded-2xl p-4 border border-white/5 flex flex-col md:flex-row gap-4 items-center justify-between z-10 relative">
        <div className="flex bg-slate-950/80 p-1.5 rounded-xl border border-white/5 w-full md:w-auto">
          {(["global", "weekly", "monthly"] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => { playSound("click"); setActiveTab(tab); }}
              className={`flex-1 md:flex-none px-5 py-2 rounded-lg text-xs font-bold capitalize transition ${
                activeTab === tab 
                  ? "bg-purple-600 text-white shadow" 
                  : "text-slate-400 hover:text-white"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Filters dropdown */}
        <div className="flex flex-wrap gap-3 w-full md:w-auto justify-end">
          {/* Sort By Metric */}
          <div className="flex-1 md:flex-none flex items-center space-x-2 bg-slate-900 border border-white/5 rounded-xl px-3 py-2 text-xs">
            <Zap className="h-3.5 w-3.5 text-yellow-500" />
            <select
              value={sortBy}
              onChange={(e) => { playSound("click"); setSortBy(e.target.value as "xp" | "accuracy"); }}
              className="bg-transparent text-slate-300 focus:outline-none cursor-pointer"
            >
              <option value="xp">Sort by XP</option>
              <option value="accuracy">Sort by Accuracy</option>
            </select>
          </div>

          {/* Sorting Algorithm */}
          <div className="flex-1 md:flex-none flex items-center space-x-2 bg-slate-900 border border-white/5 rounded-xl px-3 py-2 text-xs">
            <SlidersHorizontal className="h-3.5 w-3.5 text-purple-400" />
            <select
              value={sortingAlgorithm}
              onChange={(e) => { playSound("click"); setSortingAlgorithm(e.target.value as "mergesort" | "quicksort"); }}
              className="bg-transparent text-slate-300 focus:outline-none cursor-pointer"
            >
              <option value="mergesort">Merge Sort (Stable)</option>
              <option value="quicksort">Quick Sort (In-Place)</option>
            </select>
          </div>

          {/* Department */}
          <div className="flex-1 md:flex-none flex items-center space-x-2 bg-slate-900 border border-white/5 rounded-xl px-3 py-2 text-xs">
            <Building className="h-3.5 w-3.5 text-slate-500" />
            <select
              value={selectedDept}
              onChange={(e) => { playSound("click"); setSelectedDept(e.target.value); }}
              className="bg-transparent text-slate-300 focus:outline-none cursor-pointer"
            >
              <option value="All">All Depts</option>
              <option value="CSE">CSE</option>
              <option value="ECE">ECE</option>
              <option value="SE">SE</option>
            </select>
          </div>

          {/* College */}
          <div className="flex-1 md:flex-none flex items-center space-x-2 bg-slate-900 border border-white/5 rounded-xl px-3 py-2 text-xs">
            <MapPin className="h-3.5 w-3.5 text-slate-500" />
            <select
              value={selectedCollege}
              onChange={(e) => { playSound("click"); setSelectedCollege(e.target.value); }}
              className="bg-transparent text-slate-300 focus:outline-none cursor-pointer"
            >
              <option value="All">All Colleges</option>
              <option value="IIT Delhi">IIT Delhi</option>
              <option value="IIT Bombay">IIT Bombay</option>
              <option value="BITS Pilani">BITS Pilani</option>
              <option value="DTU">DTU</option>
            </select>
          </div>
        </div>
      </section>

      {/* ANIMATED PODIUM */}
      {topThree.length > 0 && (
        <section className="flex flex-col md:flex-row justify-center items-end gap-6 max-w-3xl mx-auto pt-10 pb-6 relative">
          
          {/* 2ND PLACE PODIUM */}
          {topThree[0] && (
            <div className="flex-1 flex flex-col items-center w-full md:w-auto transform hover:scale-105 transition-transform duration-200 order-2 md:order-1">
              <div className="text-center mb-3">
                <span className="text-3xl">🥈</span>
                <h4 className="font-bold text-white text-sm mt-1">{topThree[0].username}</h4>
                <p className="text-[10px] text-slate-500">{topThree[0].xp} XP • Lvl {topThree[0].level}</p>
              </div>
              <div className="w-full md:w-44 h-32 rounded-t-2xl bg-gradient-to-t from-slate-900/60 to-slate-800/40 border border-slate-700/50 flex flex-col items-center justify-center p-4">
                <span className="text-3xl font-black text-slate-400">2</span>
                <span className="text-[10px] text-slate-500 mt-2 font-bold uppercase tracking-wider">{topThree[0].dept} Dept</span>
              </div>
            </div>
          )}

          {/* 1ST PLACE PODIUM */}
          {topThree[1] && (
            <div className="flex-1 flex flex-col items-center w-full md:w-auto transform hover:scale-105 transition-transform duration-200 order-1 md:order-2 z-10 -translate-y-4">
              <div className="absolute -top-6 animate-pulse text-yellow-400">
                <Sparkles className="h-8 w-8 fill-current" />
              </div>
              <div className="text-center mb-3">
                <span className="text-4xl">👑</span>
                <h4 className="font-bold text-white text-md mt-1">{topThree[1].username}</h4>
                <p className="text-xs text-yellow-400 font-semibold">{topThree[1].xp} XP • Lvl {topThree[1].level}</p>
              </div>
              <div className="w-full md:w-48 h-40 rounded-t-2xl bg-gradient-to-t from-slate-950 to-purple-950/60 border-2 border-purple-500/30 flex flex-col items-center justify-center p-4 shadow-2xl shadow-purple-500/10">
                <span className="text-5xl font-black text-yellow-500">1</span>
                <span className="text-[10px] text-purple-400 mt-2 font-bold uppercase tracking-wider">{topThree[1].dept} Dept</span>
              </div>
            </div>
          )}

          {/* 3RD PLACE PODIUM */}
          {topThree[2] && (
            <div className="flex-1 flex flex-col items-center w-full md:w-auto transform hover:scale-105 transition-transform duration-200 order-3">
              <div className="text-center mb-3">
                <span className="text-3xl">🥉</span>
                <h4 className="font-bold text-white text-sm mt-1">{topThree[2].username}</h4>
                <p className="text-[10px] text-slate-500">{topThree[2].xp} XP • Lvl {topThree[2].level}</p>
              </div>
              <div className="w-full md:w-44 h-28 rounded-t-2xl bg-gradient-to-t from-slate-900/60 to-slate-800/40 border border-slate-700/50 flex flex-col items-center justify-center p-4">
                <span className="text-3xl font-black text-amber-700">3</span>
                <span className="text-[10px] text-slate-500 mt-2 font-bold uppercase tracking-wider">{topThree[2].dept} Dept</span>
              </div>
            </div>
          )}

        </section>
      )}

      {/* GENERAL LEADERBOARD SHEET */}
      <section className="glass rounded-2xl border border-white/5 overflow-hidden max-w-4xl mx-auto">
        <div className="p-4 bg-slate-950/40 border-b border-white/5 grid grid-cols-12 text-xs font-bold text-slate-500 uppercase tracking-widest pl-6">
          <div className="col-span-1 text-left">Rank</div>
          <div className="col-span-4 text-left">Competitor</div>
          <div className="col-span-3 text-left">College</div>
          <div className="col-span-2 text-center">Accuracy</div>
          <div className="col-span-2 text-right pr-6">XP Points</div>
        </div>

        <div className="divide-y divide-white/5">
          {/* Top 3 row details */}
          {leaderboardList.slice(0, 3).map((item, idx) => (
            <div 
              key={idx} 
              className={`grid grid-cols-12 items-center py-4 text-sm pl-6 hover:bg-white/5 transition ${
                user?.username === item.username ? "bg-purple-600/5" : ""
              }`}
            >
              <div className="col-span-1 text-left font-bold text-white">
                {idx === 0 && "🥇"}
                {idx === 1 && "🥈"}
                {idx === 2 && "🥉"}
              </div>
              <div className="col-span-4 flex items-center space-x-2">
                <div className="h-8 w-8 rounded-lg bg-purple-500/10 border border-purple-500/20 text-purple-400 text-xs font-bold flex items-center justify-center uppercase">
                  {item.username.slice(0, 2)}
                </div>
                <div>
                  <span className="font-bold text-white text-xs">{item.username}</span>
                  {user?.username === item.username && (
                    <span className="ml-2 text-[9px] bg-purple-500/20 text-purple-300 px-1 py-0.5 rounded font-bold uppercase">You</span>
                  )}
                  <div className="text-[10px] text-slate-500 uppercase">{item.dept}</div>
                </div>
              </div>
              <div className="col-span-3 text-xs text-slate-400 font-semibold">{item.college}</div>
              <div className="col-span-2 text-center font-bold text-xs text-emerald-400">{item.accuracy}%</div>
              <div className="col-span-2 text-right pr-6 font-bold text-xs text-yellow-400">{item.xp} XP</div>
            </div>
          ))}

          {/* Remaining List */}
          {remainingList.map((item, idx) => {
            const actualRank = idx + 4;
            return (
              <div 
                key={idx} 
                className={`grid grid-cols-12 items-center py-4 text-sm pl-6 hover:bg-white/5 transition ${
                  user?.username === item.username ? "bg-purple-600/5" : ""
                }`}
              >
                <div className="col-span-1 text-left font-mono font-bold text-slate-500">#{actualRank}</div>
                <div className="col-span-4 flex items-center space-x-2">
                  <div className="h-8 w-8 rounded-lg bg-slate-900 border border-white/5 text-slate-400 text-xs font-bold flex items-center justify-center uppercase">
                    {item.username.slice(0, 2)}
                  </div>
                  <div>
                    <span className="font-bold text-white text-xs">{item.username}</span>
                    {user?.username === item.username && (
                      <span className="ml-2 text-[9px] bg-purple-500/20 text-purple-300 px-1 py-0.5 rounded font-bold uppercase">You</span>
                    )}
                    <div className="text-[10px] text-slate-500 uppercase">{item.dept}</div>
                  </div>
                </div>
                <div className="col-span-3 text-xs text-slate-400 font-semibold">{item.college}</div>
                <div className="col-span-2 text-center font-bold text-xs text-slate-300">{item.accuracy}%</div>
                <div className="col-span-2 text-right pr-6 font-bold text-xs text-yellow-400">{item.xp} XP</div>
              </div>
            );
          })}
        </div>
      </section>

      {/* SEGMENT TREE RANK RANGE QUERY WIDGET */}
      <section className="glass rounded-2xl border border-white/5 p-6 max-w-4xl mx-auto space-y-4">
        <div className="flex items-center space-x-2 text-purple-400">
          <Sparkles className="h-5 w-5" />
          <h3 className="font-bold text-md text-white">Segment Tree Range Max Query</h3>
        </div>
        <p className="text-xs text-slate-400">
          Query the maximum value ({sortBy.toUpperCase()}) over a range of leaderboard ranks [L, R] in O(log N) time using a Segment Tree.
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
          <div className="flex items-center space-x-2 bg-slate-900 border border-white/5 rounded-xl px-3 py-2 text-xs">
            <span className="text-slate-500 font-bold">Start Rank (L):</span>
            <input
              type="number"
              min="1"
              max={leaderboardList.length}
              value={queryStartRank}
              onChange={(e) => setQueryStartRank(e.target.value)}
              className="bg-transparent text-slate-300 w-full focus:outline-none"
            />
          </div>

          <div className="flex items-center space-x-2 bg-slate-900 border border-white/5 rounded-xl px-3 py-2 text-xs">
            <span className="text-slate-500 font-bold">End Rank (R):</span>
            <input
              type="number"
              min="1"
              max={leaderboardList.length}
              value={queryEndRank}
              onChange={(e) => setQueryEndRank(e.target.value)}
              className="bg-transparent text-slate-300 w-full focus:outline-none"
            />
          </div>

          <div className="bg-purple-600/10 border border-purple-500/20 text-purple-400 rounded-xl px-4 py-2 text-center text-xs font-bold">
            {segmentTreeResult !== null ? (
              <span>
                Max {sortBy.toUpperCase()}: <span className="text-white font-extrabold text-sm">{segmentTreeResult}{sortBy === "xp" ? " XP" : "%"}</span>
              </span>
            ) : (
              <span className="text-slate-500">Invalid rank range (1 to {leaderboardList.length})</span>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
