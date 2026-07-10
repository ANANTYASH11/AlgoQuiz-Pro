"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { MockDatabase, UserProfile, QuizAttempt, Announcement } from "@/lib/db/mockDb";
import { Question } from "@/lib/db/seedQuestions";
import confetti from "canvas-confetti";

interface AppContextType {
  user: UserProfile | null;
  questions: Question[];
  attempts: QuizAttempt[];
  announcements: Announcement[];
  soundOn: boolean;
  setSoundOn: (val: boolean) => void;
  darkMode: boolean;
  setDarkMode: (val: boolean) => void;
  updateUser: (user: UserProfile) => void;
  addAttempt: (attempt: QuizAttempt) => void;
  addQuestion: (q: Question) => boolean;
  triggerConfetti: () => void;
  playSound: (type: "correct" | "incorrect" | "click" | "win" | "level_up") => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppStateProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [attempts, setAttempts] = useState<QuizAttempt[]>([]);
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [soundOn, setSoundOn] = useState<boolean>(true);
  const [darkMode, setDarkMode] = useState<boolean>(true);

  // Initialize client-side state after mounting to avoid hydration mismatches
  useEffect(() => {
    MockDatabase.init();
    const savedSound = localStorage.getItem("algoquiz_sound");
    const savedDark = localStorage.getItem("algoquiz_dark");

    setTimeout(() => {
      setUser(MockDatabase.getUser());
      setAttempts(MockDatabase.getAttempts());
      setAnnouncements(MockDatabase.getAnnouncements());
      setSoundOn(savedSound === null ? true : savedSound === "true");
      setDarkMode(savedDark === null ? true : savedDark === "true");
    }, 0);
  }, []);

  // Apply dark mode side effect
  useEffect(() => {
    if (typeof window !== "undefined") {
      if (!darkMode) {
        document.body.classList.add("light-mode-active");
      } else {
        document.body.classList.remove("light-mode-active");
      }
    }
  }, [darkMode]);

  // Fetch seed data and user-specific details on mount/change
  useEffect(() => {
    MockDatabase.init();
    
    fetch("/api/questions")
      .then(res => res.json())
      .then(data => {
        if (data.success && data.questions) {
          setQuestions(data.questions);
        } else {
          setQuestions(MockDatabase.getQuestions());
        }
      })
      .catch(() => setQuestions(MockDatabase.getQuestions()));

    if (user) {
      fetch(`/api/attempts?username=${user.username}`)
        .then(res => res.json())
        .then(data => {
          if (data.success && data.attempts) {
            setAttempts(data.attempts);
          } else {
            setAttempts(MockDatabase.getAttempts());
          }
        })
        .catch(() => setAttempts(MockDatabase.getAttempts()));
    }
  }, [user]);

  const updateUser = async (updated: UserProfile) => {
    MockDatabase.saveUser(updated);
    setUser({ ...updated });
    try {
      await fetch("/api/user", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: updated.username, updates: updated })
      });
    } catch (e) {
      console.warn("Failed to sync updated user with backend", e);
    }
  };

  const addAttempt = async (attempt: QuizAttempt) => {
    MockDatabase.addQuizAttempt(attempt);
    setUser(MockDatabase.getUser());
    setAttempts(MockDatabase.getAttempts());
    try {
      const res = await fetch("/api/attempts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(attempt)
      });
      const data = await res.json();
      if (data.success && data.user) {
        MockDatabase.saveUser(data.user);
        setUser(data.user);
      }
    } catch (e) {
      console.warn("Failed to sync attempt with backend", e);
    }
  };

  const addQuestion = (q: Question): boolean => {
    const success = MockDatabase.addQuestion(q);
    if (success) {
      setQuestions(MockDatabase.getQuestions());
    }
    return success;
  };

  const triggerConfetti = () => {
    confetti({
      particleCount: 150,
      spread: 80,
      origin: { y: 0.6 },
      colors: ["#3b82f6", "#8b5cf6", "#f472b6", "#10b981"],
    });
  };

  const playSound = (type: "correct" | "incorrect" | "click" | "win" | "level_up") => {
    if (!soundOn) return;
    try {
      const AudioCtxConstructor = window.AudioContext || (window as typeof window & { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
      if (!AudioCtxConstructor) return;
      const audioCtx = new AudioCtxConstructor();
      
      const playBeep = (freq: number, duration: number, vol: number = 0.1, typeOsc: OscillatorType = "sine") => {
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        osc.connect(gain);
        gain.connect(audioCtx.destination);
        osc.type = typeOsc;
        osc.frequency.setValueAtTime(freq, audioCtx.currentTime);
        gain.gain.setValueAtTime(vol, audioCtx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + duration);
        osc.start();
        osc.stop(audioCtx.currentTime + duration);
      };

      if (type === "click") {
        playBeep(600, 0.08, 0.05);
      } else if (type === "correct") {
        playBeep(523.25, 0.1, 0.1); // C5
        setTimeout(() => playBeep(659.25, 0.15, 0.1), 80); // E5
      } else if (type === "incorrect") {
        playBeep(220, 0.2, 0.15, "triangle"); // A3
        setTimeout(() => playBeep(180, 0.25, 0.15, "triangle"), 100);
      } else if (type === "win") {
        playBeep(523.25, 0.1, 0.1);
        setTimeout(() => playBeep(659.25, 0.1, 0.1), 100);
        setTimeout(() => playBeep(783.99, 0.1, 0.1), 200);
        setTimeout(() => playBeep(1046.5, 0.3, 0.1), 300); // C6
      } else if (type === "level_up") {
        // Melodic ascending level up sound
        const notes = [440, 554, 659, 880];
        notes.forEach((freq, idx) => {
          setTimeout(() => playBeep(freq, 0.15, 0.08), idx * 120);
        });
      }
    } catch (e) {
      console.warn("Sound playback issue", e);
    }
  };

  const handleSetSoundOn = (val: boolean) => {
    setSoundOn(val);
    localStorage.setItem("algoquiz_sound", val ? "true" : "false");
  };

  const handleSetDarkMode = (val: boolean) => {
    setDarkMode(val);
    localStorage.setItem("algoquiz_dark", val ? "true" : "false");
    if (val) {
      document.body.classList.remove("light-mode-active");
    } else {
      document.body.classList.add("light-mode-active");
    }
  };

  return (
    <AppContext.Provider
      value={{
        user,
        questions,
        attempts,
        announcements,
        soundOn,
        setSoundOn: handleSetSoundOn,
        darkMode,
        setDarkMode: handleSetDarkMode,
        updateUser,
        addAttempt,
        addQuestion,
        triggerConfetti,
        playSound,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useAppState() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error("useAppState must be used within an AppStateProvider");
  }
  return context;
}
