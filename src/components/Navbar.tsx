"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAppState } from "./AppState";
import { 
  Trophy, 
  User, 
  Volume2, 
  VolumeX, 
  Sun, 
  Moon, 
  Coins, 
  Zap, 
  Play, 
  ShieldAlert, 
  Users, 
  Terminal,
  Menu,
  X,
  Brain,
  Code
} from "lucide-react";
import { useState } from "react";

export default function Navbar() {
  const { user, soundOn, setSoundOn, darkMode, setDarkMode, playSound } = useAppState();
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // If path is a active quiz game (starts with /quiz/something), hide the navbar for full focus
  const isQuizActive = pathname.startsWith("/quiz/") && pathname !== "/quiz";

  if (isQuizActive) return null;

  const navLinks = [
    { name: "Dashboard", href: "/dashboard", icon: Terminal },
    { name: "Quiz Arena", href: "/quiz", icon: Play },
    { name: "Challenge", href: "/challenge", icon: Zap },
    { name: "Brain Gym", href: "/brain-gym", icon: Brain },
    { name: "DSA Code Lab", href: "/dsa-lab", icon: Code },
    { name: "Multiplayer", href: "/multiplayer", icon: Users },
    { name: "Leaderboard", href: "/leaderboard", icon: Trophy },
    { name: "Profile", href: "/profile", icon: User },
  ];

  if (user?.role === "admin") {
    navLinks.push({ name: "Admin Panel", href: "/admin", icon: ShieldAlert });
  }

  const handleLinkClick = () => {
    playSound("click");
    setMobileMenuOpen(false);
  };

  return (
    <nav className="sticky top-4 left-0 right-0 z-50 mx-auto w-[92%] max-w-7xl rounded-2xl border border-white/10 bg-slate-950/40 p-3.5 backdrop-blur-xl shadow-2xl transition-all duration-300">
      <div className="flex items-center justify-between">
        {/* LOGO */}
        <Link href="/" onClick={handleLinkClick} className="flex items-center space-x-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-tr from-blue-500 to-purple-600 shadow-lg shadow-purple-500/30">
            <span className="text-lg font-black text-white">A</span>
          </div>
          <span className="text-lg font-bold tracking-tight text-white hidden lg:inline-block">
            AlgoQuiz<span className="bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent"> Pro</span>
          </span>
        </Link>

        {/* DESKTOP NAV LINKS */}
        <div className="hidden md:flex items-center space-x-1 lg:space-x-2">
          {navLinks.map((link) => {
            const Icon = link.icon;
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => playSound("click")}
                className={`flex items-center space-x-1 px-2.5 py-1.5 rounded-xl text-xs font-semibold transition-all duration-200 ${
                  isActive
                    ? "bg-gradient-to-r from-blue-600/30 to-purple-600/30 border border-purple-500/30 text-white shadow-lg"
                    : "text-slate-300 hover:text-white hover:bg-white/5 border border-transparent"
                }`}
              >
                <Icon className={`h-3.5 w-3.5 ${isActive ? "text-purple-400" : "text-slate-400"}`} />
                <span>{link.name}</span>
              </Link>
            );
          })}
        </div>

        {/* STATS & CONTROL PANEL */}
        <div className="hidden md:flex items-center space-x-3">
          {user && (
            <div className="flex items-center space-x-3 px-3 py-1.5 rounded-xl bg-white/5 border border-white/5 text-xs font-semibold">
              {/* Level / XP */}
              <div className="flex items-center space-x-1 text-yellow-400">
                <Zap className="h-3.5 w-3.5 fill-current" />
                <span>Lvl {user.level}</span>
                <span className="text-slate-500">({user.xp} XP)</span>
              </div>
              <div className="h-3 w-[1px] bg-white/10" />
              {/* Coins */}
              <div className="flex items-center space-x-1 text-amber-500">
                <Coins className="h-3.5 w-3.5" />
                <span>{user.coins}</span>
              </div>
            </div>
          )}

          {/* Sound Toggle */}
          <button
            onClick={() => setSoundOn(!soundOn)}
            className="p-2 rounded-xl border border-white/5 bg-white/5 text-slate-400 hover:text-white hover:bg-white/10 transition"
            title="Toggle Sound Effects"
          >
            {soundOn ? <Volume2 className="h-4 w-4" /> : <VolumeX className="h-4 w-4" />}
          </button>

          {/* Dark / Light Toggle */}
          <button
            onClick={() => setDarkMode(!darkMode)}
            className="p-2 rounded-xl border border-white/5 bg-white/5 text-slate-400 hover:text-white hover:bg-white/10 transition"
            title="Toggle Theme"
          >
            {darkMode ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </button>
        </div>

        {/* MOBILE MENU TOGGLE */}
        <div className="flex md:hidden items-center space-x-2">
          {user && (
            <div className="flex items-center space-x-1 text-amber-500 bg-white/5 border border-white/5 px-2 py-1 rounded-lg text-xs font-bold">
              <Coins className="h-3 w-3" />
              <span>{user.coins}</span>
            </div>
          )}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-xl bg-white/5 text-slate-300 hover:text-white hover:bg-white/10 transition"
          >
            {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {/* MOBILE DROPDOWN MENU */}
      {mobileMenuOpen && (
        <div className="mt-4 flex flex-col space-y-2 rounded-xl border border-white/10 bg-slate-950 p-4 md:hidden">
          {navLinks.map((link) => {
            const Icon = link.icon;
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={handleLinkClick}
                className={`flex items-center space-x-3 p-3 rounded-lg text-sm font-medium transition ${
                  isActive
                    ? "bg-purple-600/20 border border-purple-500/30 text-white"
                    : "text-slate-300 hover:bg-white/5 hover:text-white"
                }`}
              >
                <Icon className="h-4 w-4 text-purple-400" />
                <span>{link.name}</span>
              </Link>
            );
          })}

          <div className="h-[1px] bg-white/10 my-2" />

          {/* User Mobile Stats */}
          {user && (
            <div className="flex justify-between items-center bg-white/5 p-3 rounded-lg text-xs font-bold">
              <div className="flex items-center space-x-1 text-yellow-400">
                <Zap className="h-4.5 w-4.5 fill-current" />
                <span>Lvl {user.level} ({user.xp} XP)</span>
              </div>
              <div className="flex items-center space-x-1 text-amber-500">
                <Coins className="h-4.5 w-4.5" />
                <span>{user.coins} Coins</span>
              </div>
            </div>
          )}

          {/* Settings Toggles */}
          <div className="flex items-center justify-between pt-2">
            <span className="text-xs text-slate-400">Controls</span>
            <div className="flex space-x-2">
              <button
                onClick={() => setSoundOn(!soundOn)}
                className="flex items-center space-x-1 px-3 py-1.5 rounded-lg border border-white/5 bg-white/5 text-xs text-slate-300"
              >
                {soundOn ? <Volume2 className="h-3 w-3" /> : <VolumeX className="h-3 w-3" />}
                <span>Sound</span>
              </button>
              <button
                onClick={() => setDarkMode(!darkMode)}
                className="flex items-center space-x-1 px-3 py-1.5 rounded-lg border border-white/5 bg-white/5 text-xs text-slate-300"
              >
                {darkMode ? <Sun className="h-3 w-3" /> : <Moon className="h-3 w-3" />}
                <span>Theme</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
