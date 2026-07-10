"use client";

import { useState, useEffect } from "react";
import { useAppState } from "@/components/AppState";
import { UserProfile } from "@/lib/db/mockDb";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Brain, 
  Flame, 
  Timer, 
  Award, 
  RotateCcw, 
  ArrowLeft, 
  ChevronLeft,
  ChevronRight
} from "lucide-react";

interface GameProps {
  playSound: (soundName: "correct" | "incorrect" | "click" | "win" | "level_up") => void;
  triggerConfetti: () => void;
  user: UserProfile | null;
  updateUser: (user: UserProfile) => void;
}

type GameType = "menu" | "math" | "stack" | "tree";

export default function BrainGymPage() {
  const { playSound, triggerConfetti, user, updateUser } = useAppState();
  const [activeGame, setActiveGame] = useState<GameType>("menu");

  const selectGame = (game: GameType) => {
    playSound("click");
    setActiveGame(game);
  };

  return (
    <div className="space-y-8 max-w-4xl mx-auto py-4">
      {/* HEADER ROW */}
      <div className="flex justify-between items-center bg-slate-950/40 p-4 border border-white/10 rounded-2xl">
        <div className="flex items-center space-x-3">
          <div className="h-10 w-10 bg-yellow-500/10 border border-yellow-500/20 text-yellow-400 rounded-xl flex items-center justify-center">
            <Brain className="h-5 w-5 animate-pulse" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-white">Kids Arena & Brain Gym</h2>
            <p className="text-[10px] text-slate-400">Play speed math, build block stacks, and hunt tree keys to sharpen your mental skills!</p>
          </div>
        </div>
        {activeGame !== "menu" && (
          <button
            onClick={() => selectGame("menu")}
            className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl border border-white/10 bg-slate-900/60 text-slate-300 hover:text-white transition text-xs font-semibold"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            <span>Arena Lobby</span>
          </button>
        )}
      </div>

      {/* RENDER VIEWS */}
      <AnimatePresence mode="wait">
        {activeGame === "menu" && <MainMenu key="menu" onSelect={selectGame} />}
        {activeGame === "math" && <SpeedMathGame key="math" playSound={playSound} triggerConfetti={triggerConfetti} user={user} updateUser={updateUser} />}
        {activeGame === "stack" && <StackMatcherGame key="stack" playSound={playSound} triggerConfetti={triggerConfetti} user={user} updateUser={updateUser} />}
        {activeGame === "tree" && <BstHunterGame key="tree" playSound={playSound} triggerConfetti={triggerConfetti} user={user} updateUser={updateUser} />}
      </AnimatePresence>
    </div>
  );
}

// ----------------------------------------------------
// MAIN MENU LOBBY
// ----------------------------------------------------
function MainMenu({ onSelect }: { onSelect: (game: GameType) => void }) {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className="grid grid-cols-1 md:grid-cols-3 gap-6"
    >
      {/* Card 1: Speed Math */}
      <div 
        onClick={() => onSelect("math")}
        className="glass rounded-3xl p-6 border border-white/5 hover:border-yellow-500/30 transition cursor-pointer flex flex-col justify-between space-y-6 relative overflow-hidden group bg-gradient-to-br from-slate-950/60 to-yellow-950/10"
      >
        <div className="absolute top-0 left-0 w-full h-[3px] bg-yellow-500" />
        <div className="space-y-2">
          <div className="text-3xl">🧮</div>
          <h3 className="text-md font-bold text-white group-hover:text-yellow-400 transition">Mental Math Speedrun</h3>
          <p className="text-xs text-slate-400 leading-relaxed">Solve arithmetic addition & multiplication formulas before the clock runs out!</p>
        </div>
        <div className="flex justify-between items-center text-xs text-yellow-400 font-bold">
          <span>Speed & Focus</span>
          <span>Play Now →</span>
        </div>
      </div>

      {/* Card 2: Stack Matcher */}
      <div 
        onClick={() => onSelect("stack")}
        className="glass rounded-3xl p-6 border border-white/5 hover:border-purple-500/30 transition cursor-pointer flex flex-col justify-between space-y-6 relative overflow-hidden group bg-gradient-to-br from-slate-950/60 to-purple-950/10"
      >
        <div className="absolute top-0 left-0 w-full h-[3px] bg-purple-500" />
        <div className="space-y-2">
          <div className="text-3xl">🧱</div>
          <h3 className="text-md font-bold text-white group-hover:text-purple-400 transition">LIFO Stack Block Puzzle</h3>
          <p className="text-xs text-slate-400 leading-relaxed">Push and pop colored boxes. Match the vertical target order to solve stack concepts!</p>
        </div>
        <div className="flex justify-between items-center text-xs text-purple-400 font-bold">
          <span>Logic & DSA</span>
          <span>Play Now →</span>
        </div>
      </div>

      {/* Card 3: BST Hunter */}
      <div 
        onClick={() => onSelect("tree")}
        className="glass rounded-3xl p-6 border border-white/5 hover:border-blue-500/30 transition cursor-pointer flex flex-col justify-between space-y-6 relative overflow-hidden group bg-gradient-to-br from-slate-950/60 to-blue-950/10"
      >
        <div className="absolute top-0 left-0 w-full h-[3px] bg-blue-500" />
        <div className="space-y-2">
          <div className="text-3xl">🌲</div>
          <h3 className="text-md font-bold text-white group-hover:text-blue-400 transition">BST Search Hunter</h3>
          <p className="text-xs text-slate-400 leading-relaxed">Navigate left and right branches of the Binary Search Tree to capture target numbers!</p>
        </div>
        <div className="flex justify-between items-center text-xs text-blue-400 font-bold">
          <span>Binary Division</span>
          <span>Play Now →</span>
        </div>
      </div>
    </motion.div>
  );
}

interface SpeedMathProblem {
  a: number;
  b: number;
  op: string;
  correctAnswer: number;
  options: number[];
}

function generateProblemData(): SpeedMathProblem {
  const isMult = Math.random() > 0.5;
  let a = 0;
  let b = 0;
  let answer = 0;
  let currentOp = "+";

  if (isMult) {
    a = Math.floor(Math.random() * 9) + 2; // 2 to 10
    b = Math.floor(Math.random() * 9) + 2; // 2 to 10
    answer = a * b;
    currentOp = "×";
  } else {
    a = Math.floor(Math.random() * 80) + 10; // 10 to 90
    b = Math.floor(Math.random() * 80) + 10; // 10 to 90
    answer = a + b;
    currentOp = "+";
  }

  // Generate incorrect answers
  const optsSet = new Set<number>();
  optsSet.add(answer);
  while (optsSet.size < 4) {
    const offset = (Math.floor(Math.random() * 15) + 1) * (Math.random() > 0.5 ? 1 : -1);
    const val = answer + offset;
    if (val > 0) optsSet.add(val);
  }
  const options = Array.from(optsSet).sort(() => Math.random() - 0.5);

  return { a, b, op: currentOp, correctAnswer: answer, options };
}

// ----------------------------------------------------
// GAME 1: SPEED MATH (MENTAL MATH)
// ----------------------------------------------------
function SpeedMathGame({ playSound, triggerConfetti, user, updateUser }: GameProps) {
  const [numA, setNumA] = useState(0);
  const [numB, setNumB] = useState(0);
  const [op, setOp] = useState("+");
  const [correctAnswer, setCorrectAnswer] = useState(0);
  const [options, setOptions] = useState<number[]>([]);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [timeLeft, setTimeLeft] = useState(30);
  const [gameState, setGameState] = useState<"idle" | "playing" | "ended">("idle");

  const startNewGame = () => {
    playSound("click");
    setScore(0);
    setStreak(0);
    setTimeLeft(30);
    setGameState("playing");
    generateProblem();
  };

  function generateProblem() {
    const data = generateProblemData();
    setNumA(data.a);
    setNumB(data.b);
    setOp(data.op);
    setCorrectAnswer(data.correctAnswer);
    setOptions(data.options);
  }

  useEffect(() => {
    if (gameState !== "playing") return;
    if (timeLeft <= 0) {
      setTimeout(() => {
        setGameState("ended");
        playSound("win");
        triggerConfetti();
        // Reward user with gold coins (1 coin per 2 questions solved)
        if (user) {
          const earnedCoins = Math.floor(score / 2);
          const earnedXp = score * 10;
          const updated = {
            ...user,
            coins: user.coins + earnedCoins,
            xp: user.xp + earnedXp
          };
          updateUser(updated);
        }
      }, 0);
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft(prev => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft, gameState, score, user, playSound, triggerConfetti, updateUser]);

  const handleAnswerSelect = (selected: number) => {
    if (selected === correctAnswer) {
      playSound("correct");
      setScore(prev => prev + 1);
      setStreak(prev => prev + 1);
      generateProblem();
    } else {
      playSound("incorrect");
      setStreak(0);
      generateProblem();
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="glass rounded-3xl p-6 border border-white/10 text-center space-y-6 max-w-md mx-auto"
    >
      <h3 className="text-md font-bold text-white flex items-center justify-center space-x-2">
        <span>🧮</span>
        <span>Speed Math Challenger</span>
      </h3>

      {gameState === "idle" && (
        <div className="space-y-4 py-8">
          <p className="text-xs text-slate-400">Solve equations quickly before the timer hits zero. Earn Coins and Level XP!</p>
          <button
            onClick={startNewGame}
            className="px-6 py-2.5 bg-yellow-500 hover:bg-yellow-400 text-slate-950 font-bold rounded-xl text-xs transition"
          >
            Start Speed Challenge
          </button>
        </div>
      )}

      {gameState === "playing" && (
        <div className="space-y-6">
          {/* Progress bar */}
          <div className="flex justify-between items-center text-xs font-bold">
            <span className="text-red-400 flex items-center space-x-1">
              <Timer className="h-4 w-4" />
              <span>{timeLeft}s remaining</span>
            </span>
            <span className="text-yellow-400 flex items-center space-x-1">
              <Flame className="h-4 w-4 fill-current animate-pulse" />
              <span>Streak: {streak}</span>
            </span>
          </div>

          <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden border border-white/5">
            <div 
              className="h-full bg-gradient-to-r from-red-500 to-yellow-500 transition-all duration-1000"
              style={{ width: `${(timeLeft / 30) * 100}%` }}
            />
          </div>

          {/* Equation Display */}
          <div className="py-6 bg-slate-950/60 border border-white/5 rounded-2xl flex items-center justify-center space-x-3">
            <span className="text-4xl font-extrabold text-white">{numA}</span>
            <span className="text-2xl font-bold text-yellow-500">{op}</span>
            <span className="text-4xl font-extrabold text-white">{numB}</span>
            <span className="text-2xl font-bold text-yellow-500">=</span>
            <span className="text-3xl font-black text-slate-500">?</span>
          </div>

          {/* Tapping buttons grid */}
          <div className="grid grid-cols-2 gap-4">
            {options.map((opt, index) => (
              <button
                key={index}
                onClick={() => handleAnswerSelect(opt)}
                className="py-4 bg-slate-900 border border-white/10 hover:border-yellow-500/40 rounded-2xl text-lg font-black text-white hover:text-yellow-400 transition transform active:scale-95"
              >
                {opt}
              </button>
            ))}
          </div>
        </div>
      )}

      {gameState === "ended" && (
        <div className="space-y-4 py-8">
          <Award className="h-12 w-12 text-yellow-400 mx-auto animate-bounce" />
          <h4 className="font-bold text-white text-md">Challenge Complete!</h4>
          <p className="text-xs text-slate-400">Questions Answered: <span className="font-bold text-white">{score}</span></p>
          <div className="p-3 bg-yellow-500/10 border border-yellow-500/20 rounded-xl text-xs font-semibold text-yellow-400">
            Earned +{Math.floor(score / 2)} Gold Coins & +{score * 10} XP!
          </div>
          <button
            onClick={startNewGame}
            className="px-6 py-2.5 bg-slate-900 border border-white/10 text-slate-300 hover:text-white rounded-xl text-xs font-semibold flex items-center justify-center mx-auto space-x-1.5"
          >
            <RotateCcw className="h-4 w-4" />
            <span>Spin Again</span>
          </button>
        </div>
      )}
    </motion.div>
  );
}

// ----------------------------------------------------
// GAME 2: LIFO STACK MATCHER (DSA STACK DESIGN)
// ----------------------------------------------------
const BLOCK_COLORS = {
  Red: "bg-red-500 border-red-400",
  Blue: "bg-blue-500 border-blue-400",
  Yellow: "bg-yellow-500 border-yellow-400",
  Green: "bg-emerald-500 border-emerald-400"
};
type BlockType = keyof typeof BLOCK_COLORS;

function createTargetStack(): BlockType[] {
  const colors: BlockType[] = ["Red", "Blue", "Yellow", "Green"];
  const targetSize = Math.floor(Math.random() * 2) + 3; // Size 3 or 4
  const newTarget: BlockType[] = [];
  for (let i = 0; i < targetSize; i++) {
    const idx = Math.floor(Math.random() * colors.length);
    newTarget.push(colors[idx]);
  }
  return newTarget;
}

function StackMatcherGame({ playSound, triggerConfetti, user, updateUser }: GameProps) {
  const [stack, setStack] = useState<BlockType[]>([]);
  const [targetStack, setTargetStack] = useState<BlockType[]>([]);
  const [score, setScore] = useState(0);

  useEffect(() => {
    generateTargetStack();
  }, []);

  function generateTargetStack() {
    setTargetStack(createTargetStack());
    setStack([]);
  }

  const handlePush = (color: BlockType) => {
    if (stack.length >= 5) {
      playSound("incorrect");
      return; // Cap stack height at 5
    }
    playSound("click");
    const updated = [...stack, color];
    setStack(updated);
    checkMatch(updated, targetStack);
  };

  const handlePop = () => {
    if (stack.length === 0) {
      playSound("incorrect");
      return;
    }
    playSound("click");
    const updated = stack.slice(0, -1);
    setStack(updated);
    checkMatch(updated, targetStack);
  };

  const checkMatch = (current: BlockType[], target: BlockType[]) => {
    if (current.length !== target.length) return;
    const match = current.every((val, index) => val === target[index]);
    if (match) {
      setTimeout(() => {
        playSound("win");
        triggerConfetti();
        setScore(prev => prev + 1);
        
        // Add gold reward
        if (user) {
          const updated = {
            ...user,
            coins: user.coins + 5,
            xp: user.xp + 30
          };
          updateUser(updated);
        }

        generateTargetStack();
      }, 300);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="glass rounded-3xl p-6 border border-white/10 text-center space-y-6 max-w-lg mx-auto"
    >
      <h3 className="text-md font-bold text-white flex items-center justify-center space-x-2">
        <span>🧱</span>
        <span>LIFO Stack Block Puzzle</span>
      </h3>
      <p className="text-xs text-slate-400">Push & Pop blocks. Match the TARGET pattern from bottom to top!</p>

      {/* Target Vs Current Grid */}
      <div className="grid grid-cols-2 gap-6 items-stretch">
        
        {/* TARGET PATTERN VIEW */}
        <div className="bg-slate-950/60 p-4 border border-white/5 rounded-2xl flex flex-col justify-end items-center min-h-[220px]">
          <div className="text-[10px] text-slate-500 font-bold uppercase pb-4">Target Order</div>
          <div className="flex flex-col-reverse gap-1.5 w-full max-w-[100px]">
            {targetStack.map((color, idx) => (
              <div 
                key={idx} 
                className={`h-8 rounded-lg border-b-4 flex items-center justify-center text-[10px] font-black text-white ${BLOCK_COLORS[color]}`}
              >
                {color}
              </div>
            ))}
          </div>
        </div>

        {/* ACTIVE STACK PLAYGROUND */}
        <div className="bg-slate-950/80 p-4 border border-white/5 rounded-2xl flex flex-col justify-end items-center min-h-[220px]">
          <div className="text-[10px] text-purple-400 font-bold uppercase pb-4">Your Stack</div>
          <div className="flex flex-col-reverse gap-1.5 w-full max-w-[100px]">
            <AnimatePresence>
              {stack.map((color, idx) => (
                <motion.div 
                  key={idx}
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className={`h-8 rounded-lg border-b-4 flex items-center justify-center text-[10px] font-black text-white ${BLOCK_COLORS[color]}`}
                >
                  {color}
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
          {stack.length === 0 && (
            <div className="text-[9px] text-slate-600 italic py-10">Stack is empty. Push blocks to start!</div>
          )}
        </div>

      </div>

      {/* Controls */}
      <div className="space-y-4 border-t border-white/5 pt-4">
        <div className="grid grid-cols-4 gap-2">
          {Object.keys(BLOCK_COLORS).map((color) => (
            <button
              key={color}
              onClick={() => handlePush(color as BlockType)}
              className={`py-2 rounded-xl text-[10px] font-bold text-white transition active:scale-95 border-b-2 ${BLOCK_COLORS[color as BlockType]}`}
            >
              Push {color}
            </button>
          ))}
        </div>

        <div className="flex gap-4">
          <button
            onClick={handlePop}
            className="flex-1 py-3 bg-slate-900 border border-red-500/20 text-red-400 hover:bg-red-500/10 hover:text-white rounded-xl text-xs font-bold transition active:scale-95"
          >
            Pop Stack (LIFO removal)
          </button>
          <button
            onClick={generateTargetStack}
            className="px-4 py-3 bg-slate-900 border border-white/10 text-slate-400 hover:text-white rounded-xl text-xs transition"
          >
            Skip
          </button>
        </div>
      </div>

      <div className="text-xs text-purple-400 font-bold">Solved: {score} | Rewards: +5 Coins per stack</div>
    </motion.div>
  );
}

// ----------------------------------------------------
// GAME 3: BST HUNTER (DSA TREE SEARCH ADVENTURE)
// ----------------------------------------------------
interface BstNode {
  value: number;
  left?: BstNode;
  right?: BstNode;
}

const SAMPLE_TREE: BstNode = {
  value: 50,
  left: {
    value: 25,
    left: { value: 12 },
    right: { value: 37 }
  },
  right: {
    value: 75,
    left: { value: 60 },
    right: { value: 85 }
  }
};

function selectRandomTarget(): number {
  const list = [12, 37, 25, 60, 85, 75];
  return list[Math.floor(Math.random() * list.length)];
}

function BstHunterGame({ playSound, triggerConfetti, user, updateUser }: GameProps) {
  const [currentNode, setCurrentNode] = useState<BstNode>(SAMPLE_TREE);
  const [targetVal, setTargetVal] = useState(0);
  const [score, setScore] = useState(0);
  const [path, setPath] = useState<number[]>([]);

  useEffect(() => {
    generateTarget();
  }, []);

  function generateTarget() {
    setTargetVal(selectRandomTarget());
    setCurrentNode(SAMPLE_TREE);
    setPath([50]);
  }

  const handleBranchSelect = (direction: "left" | "right") => {
    const next = direction === "left" ? currentNode.left : currentNode.right;
    if (!next) {
      playSound("incorrect");
      return;
    }

    playSound("click");
    const newPath = [...path, next.value];
    setPath(newPath);
    setCurrentNode(next);

    if (next.value === targetVal) {
      setTimeout(() => {
        playSound("win");
        triggerConfetti();
        setScore(prev => prev + 1);

        if (user) {
          const updated = {
            ...user,
            coins: user.coins + 8,
            xp: user.xp + 40
          };
          updateUser(updated);
        }
        generateTarget();
      }, 300);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="glass rounded-3xl p-6 border border-white/10 text-center space-y-6 max-w-lg mx-auto"
    >
      <h3 className="text-md font-bold text-white flex items-center justify-center space-x-2">
        <span>🌲</span>
        <span>BST Search Hunter</span>
      </h3>
      
      {/* Target banner */}
      <div className="p-3 bg-blue-500/10 border border-blue-500/20 rounded-xl">
        <span className="text-xs text-slate-400 block uppercase font-bold tracking-wider">Target Node Value</span>
        <span className="text-2xl font-black text-blue-400">{targetVal}</span>
      </div>

      {/* Visual Tree Rendering */}
      <div className="py-8 bg-slate-950/60 border border-white/5 rounded-2xl space-y-6 relative overflow-hidden">
        {/* Node values trace path */}
        <div className="text-[10px] text-slate-500 uppercase font-bold">Traversed Path: {path.join(" ➔ ")}</div>

        {/* Current Node Sphere */}
        <div className="flex flex-col items-center space-y-4">
          <div className="text-xs text-slate-400">Current Node</div>
          <motion.div 
            key={currentNode.value}
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="h-16 w-16 rounded-full bg-gradient-to-tr from-blue-600 to-purple-600 border border-blue-400/40 shadow-lg flex items-center justify-center font-black text-white text-lg"
          >
            {currentNode.value}
          </motion.div>
        </div>

        {/* Branches */}
        <div className="flex justify-center gap-12 pt-4">
          <div>
            <button
              disabled={!currentNode.left}
              onClick={() => handleBranchSelect("left")}
              className={`flex items-center space-x-1 px-4 py-2.5 rounded-xl border border-white/10 bg-slate-900 hover:text-white transition text-xs font-bold ${
                !currentNode.left ? "opacity-30 cursor-not-allowed" : "text-blue-400 hover:border-blue-500/40"
              }`}
            >
              <ChevronLeft className="h-4 w-4" />
              <span>Go Left (&lt; {currentNode.value})</span>
            </button>
            {currentNode.left && (
              <span className="text-[9px] text-slate-500 block pt-1">Node value: {currentNode.left.value}</span>
            )}
          </div>

          <div>
            <button
              disabled={!currentNode.right}
              onClick={() => handleBranchSelect("right")}
              className={`flex items-center space-x-1 px-4 py-2.5 rounded-xl border border-white/10 bg-slate-900 hover:text-white transition text-xs font-bold ${
                !currentNode.right ? "opacity-30 cursor-not-allowed" : "text-purple-400 hover:border-purple-500/40"
              }`}
            >
              <span>Go Right (&gt; {currentNode.value})</span>
              <ChevronRight className="h-4 w-4" />
            </button>
            {currentNode.right && (
              <span className="text-[9px] text-slate-500 block pt-1">Node value: {currentNode.right.value}</span>
            )}
          </div>
        </div>
      </div>

      <div className="flex gap-4">
        <button
          onClick={generateTarget}
          className="flex-1 py-3 bg-slate-900 border border-white/10 text-slate-400 hover:text-white rounded-xl text-xs font-bold transition"
        >
          Reset / New Target
        </button>
      </div>

      <div className="text-xs text-blue-400 font-bold">Solved: {score} | Rewards: +8 Coins per target</div>
    </motion.div>
  );
}
