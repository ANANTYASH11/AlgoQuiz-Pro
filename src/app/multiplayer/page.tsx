"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useAppState } from "@/components/AppState";
import { CircularQueue } from "@/lib/dsa/CircularQueue";
import { 
  Users, 
  Send, 
  Play, 
  Trophy, 
  Compass, 
  Hourglass,
  Volume2
} from "lucide-react";
import { useRouter } from "next/navigation";

interface Player {
  username: string;
  avatar: string;
  score: number;
  solved: number;
}

interface ChatMessage {
  username: string;
  text: string;
  time: string;
}

export default function MultiplayerPage() {
  const router = useRouter();
  const { playSound, user, triggerConfetti, updateUser } = useAppState();

  const [gameState, setGameState] = useState<"menu" | "waiting" | "battle" | "finished">("menu");
  const [roomCode, setRoomCode] = useState("");
  const [chatInput, setChatInput] = useState("");
  
  // Players inside room (Managed via circular queue simulator)
  const [playersList, setPlayersList] = useState<Player[]>([]);
  const [rawBuffer, setRawBuffer] = useState<(Player | null)[]>(new Array(6).fill(null));
  const [headIndex, setHeadIndex] = useState(-1);
  const [tailIndex, setTailIndex] = useState(-1);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  
  // Game Battle state
  const [battleQuestion] = useState({
    text: "Evaluate the output of the following circular buffer operation: Enqueue(A), Enqueue(B), Dequeue(), Enqueue(C). What is in the buffer if capacity is 3?",
    options: ["B, C", "A, B", "A, C", "C"],
    correctIdx: 0
  });
  const [selectedAns, setSelectedAns] = useState<number | null>(null);
  const [answered, setAnswered] = useState(false);
  const [countdown, setCountdown] = useState(30);

  // Circular Queue Lobbies Ref
  const circularQueueRef = useRef<CircularQueue<Player>>(new CircularQueue<Player>(6));

  // Sync circular queue state to react state
  const syncQueueState = () => {
    const queue = circularQueueRef.current;
    setRawBuffer([...queue.getRawArray()]);
    setHeadIndex(queue.getHeadIndex());
    setTailIndex(queue.getTailIndex());
    setPlayersList(queue.toArray());
  };

  const handleStartBattle = useCallback(() => {
    playSound("level_up");
    setCountdown(30);
    setGameState("battle");
  }, [playSound]);

  const handleFinishBattle = useCallback(() => {
    playSound("win");
    triggerConfetti();
    setGameState("finished");
    
    // Credit user coins and XP for finishing battle
    if (!user) return;
    const me = playersList.find(p => p.username === user.username);
    if (me && me.score > 0) {
      const updated = { ...user };
      updated.xp += 150;
      updated.coins += 15;
      updateUser(updated);
    }
  }, [playSound, triggerConfetti, user, playersList, updateUser]);

  useEffect(() => {
    // Redirect if not logged in
    const token = localStorage.getItem("algoquiz_token");
    if (!token) {
      router.push("/auth");
    }
  }, [user, router]);

  // Simulated Live Game Actions (Ticks opponent progress and adds chats)
  useEffect(() => {
    if (gameState !== "waiting" && gameState !== "battle") return;

    const interval = setInterval(() => {
      if (gameState === "waiting") {
        // Add random players to queue
        const mockOpponents = [
          { username: "CodeNinja", avatar: "👨‍💻", score: 0, solved: 0 },
          { username: "StackOverflowed", avatar: "👩‍💻", score: 0, solved: 0 },
          { username: "BitManipulator", avatar: "🤖", score: 0, solved: 0 },
        ];

        const queue = circularQueueRef.current;
        if (queue.size() < 4) {
          const nextPlayer = mockOpponents[queue.size() - 1];
          if (nextPlayer && queue.enqueue(nextPlayer)) {
            playSound("correct");
            syncQueueState();
            
            // Add automated welcome chat
            setChatMessages(prev => [
              ...prev,
              { username: nextPlayer.username, text: `Hey there! Ready to crash this room code? 🚀`, time: new Date().toLocaleTimeString().slice(0, 5) }
            ]);
          }
        } else if (queue.toArray().length > 0 && queue.toArray()[0].username === "HostMaster") {
          // If the player is a guest, the simulated HostMaster starts the battle automatically!
          clearInterval(interval);
          handleStartBattle();
          return;
        }
      }

      if (gameState === "battle") {
        // Tick timer
        setCountdown(prev => {
          if (prev <= 1) {
            clearInterval(interval);
            handleFinishBattle();
            return 0;
          }
          return prev - 1;
        });

        // Simulate opponent scoring randomly
        setPlayersList(prev => {
          return prev.map(p => {
            if (p.username !== user?.username && Math.random() > 0.7) {
              const nextSolved = Math.min(1, p.solved + 1);
              return {
                ...p,
                solved: nextSolved,
                score: nextSolved * 100 + Math.floor(Math.random() * 50)
              };
            }
            return p;
          }).sort((a, b) => b.score - a.score);
        });
      }
    }, 3000);

    return () => clearInterval(interval);
  }, [gameState, user, playersList, handleFinishBattle, handleStartBattle, playSound]);

  if (!user) return null;

  const handleCreateRoom = () => {
    playSound("click");
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    setRoomCode(code);
    
    // Clear and seed circular queue with current user
    const queue = circularQueueRef.current;
    queue.clear();
    queue.enqueue({ username: user.username, avatar: "👨‍💻", score: 0, solved: 0 });

    syncQueueState();
    setChatMessages([
      { username: "System", text: `Room created successfully. Share Code: ${code} to invite competitors.`, time: new Date().toLocaleTimeString().slice(0, 5) }
    ]);
    setGameState("waiting");
  };

  const handleJoinRoom = (e: React.FormEvent) => {
    e.preventDefault();
    if (roomCode.length < 5) return;
    playSound("click");

    const queue = circularQueueRef.current;
    queue.clear();
    // Enqueue host first, then current user
    queue.enqueue({ username: "HostMaster", avatar: "👑", score: 0, solved: 0 });
    queue.enqueue({ username: user.username, avatar: "👨‍💻", score: 0, solved: 0 });

    syncQueueState();
    setChatMessages([
      { username: "System", text: `Successfully joined room ${roomCode}. Waiting for host to start...`, time: new Date().toLocaleTimeString().slice(0, 5) }
    ]);
    setGameState("waiting");
  };

  // INTERACTIVE CIRCULAR QUEUE SIMULATIONS
  const handleEnqueueBot = () => {
    const queue = circularQueueRef.current;
    if (queue.isFull()) {
      playSound("incorrect");
      alert("Circular buffer queue is full! Try dequeuing head first.");
      return;
    }
    const botNames = ["BigOBoss", "StackSlasher", "HeapHelper", "PointerPro", "RecursiveBot", "HashHero"];
    const botAvatars = ["🤖", "🧙‍♂️", "👩‍🚀", "🦁", "🦊", "🐼"];
    const randomName = botNames[Math.floor(Math.random() * botNames.length)] + `#${Math.floor(100 + Math.random() * 900)}`;
    const randomAvatar = botAvatars[Math.floor(Math.random() * botAvatars.length)];
    const botPlayer = { username: randomName, avatar: randomAvatar, score: 0, solved: 0 };
    
    if (queue.enqueue(botPlayer)) {
      playSound("correct");
      setChatMessages(prev => [
        ...prev,
        { username: "System", text: `➕ Enqueued bot opponent: ${randomName} at TAIL.`, time: new Date().toLocaleTimeString().slice(0, 5) },
        { username: randomName, text: "Let's crack some circular buffer questions! 🚀", time: new Date().toLocaleTimeString().slice(0, 5) }
      ]);
      syncQueueState();
    }
  };

  const handleDequeuePlayer = () => {
    const queue = circularQueueRef.current;
    if (queue.isEmpty()) {
      playSound("incorrect");
      return;
    }
    const removed = queue.dequeue();
    if (removed) {
      playSound("click");
      setChatMessages(prev => [
        ...prev,
        { username: "System", text: `🚨 Dequeued player: ${removed.username} from HEAD index.`, time: new Date().toLocaleTimeString().slice(0, 5) }
      ]);
      syncQueueState();
    }
  };

  const handleInstantFill = () => {
    const queue = circularQueueRef.current;
    const botNames = ["DynamicDave", "SortingSam", "BigOBoss", "GraphGrace", "StackSlasher"];
    const botAvatars = ["👨‍💻", "👩‍💻", "🤖", "🦊", "🦁"];
    playSound("level_up");
    
    let filledCount = 0;
    for (let i = 0; i < 6; i++) {
      if (queue.isFull()) break;
      const name = botNames[filledCount % botNames.length] + `#${Math.floor(100 + Math.random() * 900)}`;
      const avatar = botAvatars[filledCount % botAvatars.length];
      queue.enqueue({ username: name, avatar, score: 0, solved: 0 });
      filledCount++;
    }
    
    setChatMessages(prev => [
      ...prev,
      { username: "System", text: `⚡ Instantly filled circular buffer slots. Ready to launch battle!`, time: new Date().toLocaleTimeString().slice(0, 5) }
    ]);
    syncQueueState();
  };

  const handleSendPresetChat = (text: string) => {
    playSound("click");
    setChatMessages(prev => [
      ...prev,
      { username: user.username, text, time: new Date().toLocaleTimeString().slice(0, 5) }
    ]);
    
    // Trigger simulated bot reply
    setTimeout(() => {
      const queue = circularQueueRef.current;
      const list = queue.toArray().filter(p => p.username !== user.username);
      if (list.length > 0) {
        const randomBot = list[Math.floor(Math.random() * list.length)];
        const botReplies = [
          "Oh yeah! Let's get it! ⚔️",
          "Circular Queue is indeed O(1) for enqueue and dequeue! 🔄",
          "No way, I'm taking the trophy! 🏆",
          "BFS uses queues, DFS uses stacks! 🧠",
          "Is the tail pointer wrapping around yet? 😂",
          "Bring it on!"
        ];
        const replyText = botReplies[Math.floor(Math.random() * botReplies.length)];
        setChatMessages(prev => [
          ...prev,
          { username: randomBot.username, text: replyText, time: new Date().toLocaleTimeString().slice(0, 5) }
        ]);
        playSound("correct");
      }
    }, 600);
  };

  const handleSendChat = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim()) return;
    playSound("click");

    setChatMessages(prev => [
      ...prev,
      { username: user.username, text: chatInput, time: new Date().toLocaleTimeString().slice(0, 5) }
    ]);
    setChatInput("");
  };

  const handleChooseAns = (idx: number) => {
    if (answered) return;
    playSound("click");
    setSelectedAns(idx);
    setAnswered(true);

    const correct = idx === battleQuestion.correctIdx;
    if (correct) {
      playSound("correct");
    } else {
      playSound("incorrect");
    }

    // Update current user score in players list
    setPlayersList(prev => {
      return prev.map(p => {
        if (p.username === user.username) {
          const score = correct ? 100 + countdown * 2 : 0; // Speed bonus included
          return { ...p, solved: 1, score };
        }
        return p;
      }).sort((a, b) => b.score - a.score);
    });
  };

  return (
    <div className="space-y-8">
      {/* MENU STATE */}
      {gameState === "menu" && (
        <section className="max-w-md mx-auto space-y-6 pt-10">
          <div className="text-center space-y-3">
            <span className="text-5xl">⚔️</span>
            <h2 className="text-2xl font-extrabold text-white">Multiplayer Coding Battle</h2>
            <p className="text-xs text-slate-400">Join room lobbies, chat with opponents, and answer compiler questions speed-first to win tournaments.</p>
          </div>

          <div className="glass rounded-3xl p-6 border border-white/10 space-y-6">
            <button
              onClick={handleCreateRoom}
              className="w-full flex items-center justify-center space-x-2 py-4 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white font-bold transition shadow-lg"
            >
              <Compass className="h-5 w-5" />
              <span>Host a Live Room</span>
            </button>

            <div className="flex items-center">
              <div className="h-[1px] flex-1 bg-white/5" />
              <span className="text-[10px] font-bold text-slate-500 px-3">OR JOIN ROOM</span>
              <div className="h-[1px] flex-1 bg-white/5" />
            </div>

            <form onSubmit={handleJoinRoom} className="space-y-4">
              <input
                type="text"
                placeholder="Enter 6-Digit Room Code..."
                required
                maxLength={6}
                value={roomCode}
                onChange={(e) => setRoomCode(e.target.value)}
                className="w-full bg-slate-900 border border-white/10 rounded-xl py-3 px-4 text-center font-bold text-sm text-white tracking-widest focus:outline-none focus:border-purple-500 transition"
              />
              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-white/5 border border-white/10 text-slate-300 hover:text-white hover:bg-white/10 font-semibold text-sm transition"
              >
                Join Lobby
              </button>
            </form>
          </div>
        </section>
      )}

      {/* WAITING STATE */}
      {gameState === "waiting" && (
        <section className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* LOBBY INFORMATION */}
          <div className="glass rounded-3xl p-6 border border-white/10 space-y-6 lg:col-span-2">
            <div className="flex justify-between items-center pb-4 border-b border-white/5">
              <div>
                <h3 className="font-extrabold text-white text-md">Room Code: {roomCode}</h3>
                <p className="text-[10px] text-purple-400 font-semibold uppercase">Lobby Capacity: 6 slots</p>
              </div>
              <div className="flex items-center space-x-1.5 text-xs text-yellow-400 font-bold bg-yellow-500/10 border border-yellow-500/20 px-2 py-1 rounded-lg">
                <Hourglass className="h-3.5 w-3.5 animate-spin" />
                <span>Waiting for players...</span>
              </div>
            </div>

            {/* Queue Index Info & Manual Controls */}
            <div className="flex flex-wrap gap-2.5 items-center justify-between p-3.5 rounded-2xl bg-slate-950/40 border border-white/5">
              <div className="space-y-0.5">
                <div className="text-[10px] text-slate-500 font-bold uppercase">Circular Buffer Pointers</div>
                <div className="text-xs font-mono font-bold text-slate-200">
                  Head Pointer: <span className="text-emerald-400">{headIndex === -1 ? "NULL" : headIndex}</span> | Tail Pointer: <span className="text-amber-400">{tailIndex === -1 ? "NULL" : tailIndex}</span>
                </div>
              </div>
              <div className="flex flex-wrap gap-1.5">
                <button
                  onClick={handleEnqueueBot}
                  className="px-3 py-1 bg-purple-600/20 hover:bg-purple-600/30 text-purple-300 border border-purple-500/20 text-[10px] font-bold rounded-lg transition"
                  title="Enqueue simulated bot player"
                >
                  ➕ Enqueue Bot
                </button>
                <button
                  onClick={handleDequeuePlayer}
                  className="px-3 py-1 bg-red-600/20 hover:bg-red-600/30 text-red-300 border border-red-500/20 text-[10px] font-bold rounded-lg transition"
                  title="Dequeue head player"
                >
                  ➖ Dequeue Head
                </button>
                <button
                  onClick={handleInstantFill}
                  className="px-3 py-1 bg-blue-600/20 hover:bg-blue-600/30 text-blue-300 border border-blue-500/20 text-[10px] font-bold rounded-lg transition"
                  title="Fill lobby instantly"
                >
                  ⚡ Fill Lobby
                </button>
              </div>
            </div>

            {/* Circular Queue Lobbies Slot Visualizer */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              {rawBuffer.map((player, idx) => {
                const isHead = idx === headIndex;
                const isTail = idx === tailIndex;
                return (
                  <div 
                    key={idx} 
                    onClick={() => {
                      if (!player) {
                        handleEnqueueBot();
                      }
                    }}
                    className={`h-28 rounded-2xl border flex flex-col items-center justify-center p-3 relative overflow-hidden transition-all duration-200 cursor-pointer ${
                      player 
                        ? "bg-purple-600/5 border-purple-500/20 hover:bg-purple-600/10 hover:border-purple-500/30" 
                        : "bg-slate-950/40 border-dashed border-white/5 text-slate-600 hover:border-white/25 hover:bg-white/[0.01]"
                    }`}
                  >
                    {/* Index pointer indicators */}
                    <div className="absolute top-1.5 left-1.5 flex gap-1">
                      {isHead && <span className="text-[7px] bg-emerald-500 text-slate-950 px-1 py-0.5 rounded font-black tracking-wider shadow">HEAD</span>}
                      {isTail && <span className="text-[7px] bg-amber-500 text-slate-950 px-1 py-0.5 rounded font-black tracking-wider shadow">TAIL</span>}
                    </div>
                    
                    <span className="absolute top-1.5 right-2 text-[9px] font-mono text-slate-700">Idx {idx}</span>

                    {player ? (
                      <>
                        <span className="text-2xl mt-2 animate-bounce-subtle">{player.avatar}</span>
                        <span className="font-bold text-white text-xs mt-2 truncate w-full text-center">{player.username}</span>
                        {idx === headIndex && <span className="absolute bottom-1.5 right-2 text-[8px] text-emerald-400 font-bold uppercase tracking-widest">Active Head</span>}
                      </>
                    ) : (
                      <>
                        <Users className="h-5 w-5 opacity-40" />
                        <span className="text-[9px] mt-2 uppercase font-semibold tracking-wider text-slate-500">Slot {idx} Empty</span>
                        <span className="text-[8px] text-slate-600 hover:text-purple-400 transition">Click to summon bot</span>
                      </>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Actions */}
            {playersList[0]?.username === user.username ? (
              <button
                onClick={handleStartBattle}
                className="w-full flex items-center justify-center space-x-2 py-4 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white font-bold shadow-lg transition"
              >
                <Play className="h-4.5 w-4.5 fill-current" />
                <span>Launch Coding Battle</span>
              </button>
            ) : (
              <div className="w-full flex flex-col gap-2">
                <div className="w-full py-3.5 rounded-xl bg-slate-900 border border-white/5 text-center text-xs text-slate-400 font-semibold flex items-center justify-center space-x-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
                  <span>Waiting for HostMaster to launch battle... (Simulated host will start shortly)</span>
                </div>
                <button
                  onClick={handleStartBattle}
                  className="w-full py-2 bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white rounded-lg text-[10px] font-bold transition border border-white/5"
                >
                  ⚡ Bypass & Launch (Dev Admin Override)
                </button>
              </div>
            )}
          </div>

          {/* CHAT LOGS */}
          <div className="glass rounded-3xl p-5 border border-white/10 h-[420px] flex flex-col justify-between">
            <h4 className="text-xs font-bold text-slate-400 uppercase border-b border-white/5 pb-2">Lobby Chat</h4>
            
            <div className="flex-1 overflow-y-auto space-y-2.5 py-3 scrollbar-thin scrollbar-thumb-slate-800">
              {chatMessages.map((msg, idx) => (
                <div key={idx} className="text-xs">
                  <span className={`font-bold ${
                    msg.username === "System" ? "text-purple-400" : msg.username === user.username ? "text-blue-400" : "text-slate-300"
                  }`}>
                    {msg.username}
                  </span>
                  <span className="text-[9px] text-slate-600 pl-1.5">{msg.time}</span>
                  <p className="text-slate-400 mt-0.5 font-light">{msg.text}</p>
                </div>
              ))}
            </div>

            {/* Quick Presets */}
            <div className="py-2 border-t border-b border-white/5 mb-2.5 flex flex-wrap gap-1.5">
              {["Ready! 🚀", "Let's Go! ⚔️", "Big-O is O(1)! 🧠", "Nice circular buffer! 🔄"].map((preset, pIdx) => (
                <button
                  key={pIdx}
                  type="button"
                  onClick={() => handleSendPresetChat(preset)}
                  className="px-2 py-1 rounded bg-slate-900 hover:bg-slate-800 text-[10px] text-slate-400 hover:text-slate-200 border border-white/5 transition"
                >
                  {preset}
                </button>
              ))}
            </div>

            <form onSubmit={handleSendChat} className="flex gap-2">
              <input
                type="text"
                placeholder="Send chat message..."
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                className="flex-1 bg-slate-900 border border-white/5 rounded-xl px-3 text-xs text-white focus:outline-none"
              />
              <button
                type="submit"
                className="p-2.5 bg-purple-600 text-white rounded-xl hover:bg-purple-500"
              >
                <Send className="h-4 w-4" />
              </button>
            </form>
          </div>
        </section>
      )}

      {/* BATTLE STATE */}
      {gameState === "battle" && (
        <section className="grid grid-cols-1 md:grid-cols-3 gap-8">
          
          {/* QUESTION BOX */}
          <div className="glass rounded-3xl p-6 border border-white/10 md:col-span-2 space-y-6">
            <div className="flex justify-between items-center text-xs">
              <span className="px-2 py-0.5 rounded bg-red-500/20 text-red-300 border border-red-500/30 font-bold uppercase tracking-wider">
                Multiplayer Battle Active
              </span>
              <div className="flex items-center space-x-1.5 font-bold text-red-400">
                <Volume2 className="h-4 w-4 animate-ping" />
                <span>Timer: {countdown}s</span>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-bold text-white leading-relaxed">{battleQuestion.text}</h3>
              
              <div className="space-y-3">
                {battleQuestion.options.map((opt, idx) => (
                  <button
                    key={idx}
                    disabled={answered}
                    onClick={() => handleChooseAns(idx)}
                    className={`w-full text-left p-4 rounded-xl border text-sm transition flex items-center justify-between ${
                      selectedAns === idx
                        ? idx === battleQuestion.correctIdx 
                          ? "bg-emerald-500/20 border-emerald-500 text-white"
                          : "bg-red-500/20 border-red-500 text-white"
                        : "bg-slate-900 border-white/5 text-slate-300 hover:text-white"
                    }`}
                  >
                    <span>{opt}</span>
                    <div className="h-4.5 w-4.5 rounded-full border border-slate-700 flex items-center justify-center">
                      {selectedAns === idx && (
                        <div className={`h-2.5 w-2.5 rounded-full ${
                          idx === battleQuestion.correctIdx ? "bg-emerald-500" : "bg-red-500"
                        }`} />
                      )}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {answered && (
              <button
                onClick={handleFinishBattle}
                className="w-full py-3.5 bg-purple-600 hover:bg-purple-500 text-white font-bold rounded-xl text-xs transition shadow-lg"
              >
                Submit Score & View Standings
              </button>
            )}
          </div>

          {/* REAL-TIME OPPONENT SCOREBOARD */}
          <div className="glass rounded-3xl p-5 border border-white/10 space-y-4">
            <h3 className="text-xs font-bold text-white uppercase tracking-wider flex items-center space-x-2 border-b border-white/5 pb-2">
              <Trophy className="h-4.5 w-4.5 text-yellow-500" />
              <span>Live Scoreboard</span>
            </h3>

            <div className="space-y-3.5">
              {playersList.map((player, idx) => (
                <div key={idx} className="flex items-center justify-between text-xs p-2 rounded-xl bg-slate-900/40 border border-white/5">
                  <div className="flex items-center space-x-2">
                    <span className="text-lg">{player.avatar}</span>
                    <div>
                      <span className="font-bold text-white">{player.username}</span>
                      <div className="text-[9px] text-slate-500">{player.solved === 0 ? "Analyzing question..." : "Question Locked!"}</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-mono font-bold text-white">{player.score} pts</div>
                    <div className="text-[9px] text-purple-400">Rank #{idx + 1}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </section>
      )}

      {/* FINISHED STATE */}
      {gameState === "finished" && (
        <section className="glass rounded-3xl p-8 border border-white/10 max-w-md mx-auto text-center space-y-6">
          <div className="space-y-2">
            <span className="text-5xl">🏁</span>
            <h2 className="text-2xl font-black text-white">Battle Finished!</h2>
            <p className="text-xs text-slate-400">The compiler output has been verified and rankings have compiled.</p>
          </div>

          <div className="space-y-3">
            {playersList.map((player, idx) => (
              <div 
                key={idx} 
                className={`flex items-center justify-between p-3.5 rounded-xl border text-xs ${
                  idx === 0 
                    ? "bg-yellow-500/10 border-yellow-500/30 text-yellow-400 font-bold" 
                    : "bg-slate-900 border-white/5 text-slate-300"
                }`}
              >
                <div className="flex items-center space-x-2">
                  <span className="text-lg">{idx === 0 ? "🏆" : idx === 1 ? "🥈" : "🥉"}</span>
                  <span>{player.username}</span>
                </div>
                <span>{player.score} pts</span>
              </div>
            ))}
          </div>

          <button
            onClick={() => { playSound("click"); setGameState("menu"); }}
            className="w-full py-3.5 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white font-bold rounded-xl text-xs shadow-lg transition"
          >
            Enter Another Room
          </button>
        </section>
      )}
    </div>
  );
}
