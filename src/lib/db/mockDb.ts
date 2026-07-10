import { seedQuestions, Question } from "./seedQuestions";
import { binarySearchQuestion } from "../dsa/BinarySearch";
import { mergeSortLeaderboard } from "../dsa/MergeSort";
import { HashSet } from "../dsa/HashSet";
import { Trie } from "../dsa/Trie";
import { Graph } from "../dsa/Graph";
import { getMovingAccuracy } from "../dsa/SlidingWindow";
import { checkDuplicateTags } from "../dsa/TwoPointer";
import { PrefixSum } from "../dsa/PrefixSum";
import { quickSortScores } from "../dsa/QuickSort";

export interface LeaderboardUser {
  username: string;
  xp: number;
  level: number;
  accuracy: number;
  college?: string;
  dept?: string;
}

export interface UserProfile {
  username: string;
  email: string;
  role: "admin" | "student";
  level: number;
  xp: number;
  coins: number;
  streak: number;
  lastActive: string; // ISO date
  rank: number;
  accuracy: number; // overall percentage
  weakSubjects: string[];
  strongSubjects: string[];
  badges: string[];
  bookmarks: number[]; // question IDs
  favoriteQuestions: number[]; // question IDs
  dailyRewardsClaimed: boolean;
  college?: string;
  dept?: string;
}

export interface QuizAttempt {
  id: string;
  userId: string;
  subject: string;
  difficulty: string;
  score: number; // out of total
  totalQuestions: number;
  accuracy: number; // percentage
  timeSpent: number; // seconds
  xpGained: number;
  coinsGained: number;
  date: string; // ISO date
}

export interface Announcement {
  id: string;
  title: string;
  content: string;
  date: string;
}

// Initial default user profile
const defaultUser: UserProfile = {
  username: "AlgoMaster",
  email: "student@algoquiz.pro",
  role: "student",
  level: 1,
  xp: 150,
  coins: 50,
  streak: 3,
  lastActive: new Date().toISOString(),
  rank: 12,
  accuracy: 75,
  weakSubjects: ["Algorithms", "DBMS"],
  strongSubjects: ["Data Structures", "JavaScript"],
  badges: ["Fast Learner", "Streak Beginner"],
  bookmarks: [1, 5],
  favoriteQuestions: [2],
  dailyRewardsClaimed: false,
};

// Seed users for leaderboard sorting demo
const seedLeaderboardUsers = [
  { username: "CodeNinja", xp: 1250, level: 8, accuracy: 88, college: "IIT Delhi", dept: "CSE" },
  { username: "StackOverflowed", xp: 950, level: 6, accuracy: 82, college: "BITS Pilani", dept: "ECE" },
  { username: "BitManipulator", xp: 1550, level: 10, accuracy: 91, college: "IIT Bombay", dept: "CSE" },
  { username: "AlgoMaster", xp: 150, level: 1, accuracy: 75, college: "DTU", dept: "SE" },
  { username: "RecursiveLover", xp: 600, level: 4, accuracy: 78, college: "IIT Delhi", dept: "CSE" },
  { username: "QueryQueen", xp: 1100, level: 7, accuracy: 85, college: "BITS Pilani", dept: "CSE" },
  { username: "GarbageCollector", xp: 450, level: 3, accuracy: 70, college: "DTU", dept: "ECE" },
];

export class MockDatabase {
  private static getStorageItem<T>(key: string, fallback: T): T {
    if (typeof window === "undefined") return fallback;
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : fallback;
  }

  private static setStorageItem<T>(key: string, value: T): void {
    if (typeof window !== "undefined") {
      localStorage.setItem(key, JSON.stringify(value));
    }
  }

  // Initializes database store on first load
  static init(): void {
    if (typeof window === "undefined") return;

    const existingQuestions = localStorage.getItem("algoquiz_questions");
    if (!existingQuestions) {
      this.setStorageItem("algoquiz_questions", seedQuestions);
    } else {
      try {
        const parsed = JSON.parse(existingQuestions);
        if (parsed.length < seedQuestions.length) {
          this.setStorageItem("algoquiz_questions", seedQuestions);
        }
      } catch {
        this.setStorageItem("algoquiz_questions", seedQuestions);
      }
    }
    if (!localStorage.getItem("algoquiz_user")) {
      this.setStorageItem("algoquiz_user", defaultUser);
    }
    if (!localStorage.getItem("algoquiz_leaderboard")) {
      this.setStorageItem("algoquiz_leaderboard", seedLeaderboardUsers);
    }
    if (!localStorage.getItem("algoquiz_attempts")) {
      this.setStorageItem("algoquiz_attempts", []);
    }
    if (!localStorage.getItem("algoquiz_announcements")) {
      this.setStorageItem("algoquiz_announcements", [
        { id: "a1", title: "AlgoQuiz Pro Beta Launched!", content: "Welcome to the premium EdTech platform. Try out daily challenges and unlock certifications.", date: new Date().toISOString() },
        { id: "a2", title: "Weekly Tournament Starting Soon", content: "Join the live battle arena this Friday at 6:00 PM IST to earn double coins and XP.", date: new Date().toISOString() }
      ]);
    }
    this.logDsa("Initialized MockDatabase state and loaded local storage tables.");
  }

  // DSA Execution Logging
  private static dsaExecutionLogs: string[] = [];

  static logDsa(msg: string): void {
    const timestamp = new Date().toLocaleTimeString();
    this.dsaExecutionLogs.unshift(`[${timestamp}] ${msg}`);
    if (this.dsaExecutionLogs.length > 50) {
      this.dsaExecutionLogs.pop(); // Cap at 50 logs
    }
  }

  static getDsaExecutionLogs(): string[] {
    return this.dsaExecutionLogs;
  }

  // QUESTIONS (HashMap and Binary Search used here)
  static getQuestions(): Question[] {
    let list = this.getStorageItem<Question[]>("algoquiz_questions", seedQuestions);
    if (list.length < seedQuestions.length) {
      this.setStorageItem("algoquiz_questions", seedQuestions);
      list = seedQuestions;
    }
    // Sort by ID to ensure binarySearch works
    return list.sort((a, b) => a.id - b.id);
  }

  static getQuestionById(id: number): Question | undefined {
    const questions = this.getQuestions();
    this.logDsa(`Running Binary Search (O(log N)) on questions pool (size: ${questions.length}) for ID: ${id}`);
    // INTEGRATION: Binary Search is used to lookup questions by their ID
    const res = binarySearchQuestion(questions, id);
    if (res) {
      this.logDsa(`Binary Search success: Found question "${res.questionText.slice(0, 30)}..."`);
    } else {
      this.logDsa(`Binary Search fail: Question ID ${id} not found.`);
    }
    return res;
  }

  static deleteQuestion(id: number): boolean {
    let questions = this.getQuestions();
    const originalLen = questions.length;
    questions = questions.filter(q => q.id !== id);
    this.setStorageItem("algoquiz_questions", questions);
    this.cachedTrie = null; // Clear cached autocomplete index
    this.logDsa(`Removed Question ID: ${id}. Pool resized from ${originalLen} to ${questions.length}.`);
    return questions.length < originalLen;
  }

  static addQuestion(q: Question): boolean {
    const questions = this.getQuestions();

    // INTEGRATION: HashSet is used to check for duplicate IDs
    const idSet = new HashSet<number>();
    questions.forEach(item => idSet.add(item.id));
    if (idSet.has(q.id)) {
      this.logDsa(`Failed to add question ID: ${q.id} - duplicate detected in ID HashSet (O(1) lookup).`);
      return false; 
    }

    // INTEGRATION: Two-Pointer Technique is used to check if the question matches an existing one in tags similarity
    for (const existing of questions) {
      const similarity = checkDuplicateTags(existing.tags, q.tags);
      if (similarity > 85 && existing.questionText.toLowerCase() === q.questionText.toLowerCase()) {
        this.logDsa(`[Warning] Two-Pointer similarity check matched "${q.questionText.slice(0, 20)}..." to ID ${existing.id} at ${similarity}% score.`);
      }
    }

    questions.push(q);
    this.setStorageItem("algoquiz_questions", questions);
    this.cachedTrie = null; // Clear cached autocomplete index
    this.logDsa(`Successfully added question ID: ${q.id} to questions table. Resized questions storage.`);
    return true;
  }

  // USER PROFILE
  static getUser(): UserProfile {
    return this.getStorageItem<UserProfile>("algoquiz_user", defaultUser);
  }

  static saveUser(user: UserProfile): void {
    this.setStorageItem("algoquiz_user", user);
    
    // Also update this user's XP in the leaderboard table
    const leaderboard = this.getLeaderboardRaw();
    const idx = leaderboard.findIndex(u => u.username === user.username);
    if (idx !== -1) {
      leaderboard[idx].xp = user.xp;
      leaderboard[idx].level = user.level;
      leaderboard[idx].accuracy = user.accuracy;
      this.setStorageItem("algoquiz_leaderboard", leaderboard);
    }
  }

  // LEADERBOARD (Merge Sort, Graph BFS recommendation used here)
  private static getLeaderboardRaw(): LeaderboardUser[] {
    return this.getStorageItem<LeaderboardUser[]>("algoquiz_leaderboard", seedLeaderboardUsers);
  }

  static getLeaderboard(sortBy: "xp" | "accuracy" = "xp", algorithm: "mergesort" | "quicksort" = "mergesort"): LeaderboardUser[] {
    const users = this.getLeaderboardRaw();
    if (algorithm === "quicksort") {
      this.logDsa(`Sorting Leaderboard metrics (size: ${users.length}) on column "${sortBy}" using Quick Sort (O(N log N) average).`);
      if (sortBy === "xp") {
        return quickSortScores(users, (a, b) => b.xp - a.xp);
      } else {
        return quickSortScores(users, (a, b) => b.accuracy - a.accuracy);
      }
    } else {
      this.logDsa(`Stably sorting Leaderboard metrics (size: ${users.length}) on column "${sortBy}" using Merge Sort (O(N log N)).`);
      if (sortBy === "xp") {
        return mergeSortLeaderboard(users, (a, b) => b.xp - a.xp);
      } else {
        return mergeSortLeaderboard(users, (a, b) => b.accuracy - a.accuracy);
      }
    }
  }

  // ATTEMPTS (Sliding Window & Graph BFS for recommendations used here)
  static getAttempts(): QuizAttempt[] {
    return this.getStorageItem<QuizAttempt[]>("algoquiz_attempts", []);
  }

  static addQuizAttempt(attempt: QuizAttempt): void {
    const attempts = this.getAttempts();
    attempts.push(attempt);
    this.setStorageItem("algoquiz_attempts", attempts);
    this.logDsa(`Recorded Quiz Attempt for ${attempt.userId} (Subject: ${attempt.subject}, Score: ${attempt.score}/${attempt.totalQuestions}).`);

    // Update User Profile metrics
    const user = this.getUser();
    user.xp += attempt.xpGained;
    user.coins += attempt.coinsGained;

    // Level up check (every 500 XP = 1 level)
    const newLevel = Math.floor(user.xp / 500) + 1;
    if (newLevel > user.level) {
      user.level = newLevel;
      user.badges.push(`Level ${newLevel} Achiever`);
      this.logDsa(`User ${user.username} Leveled Up! New Level: ${newLevel}. Badge unlocked.`);
    }

    // Recalculate moving average accuracy (SLIDING WINDOW)
    const allAccuracies = attempts.map(a => a.accuracy);
    const windowSize = 5;
    this.logDsa(`Computing Sliding Window average accuracy (width: ${windowSize}) over ${allAccuracies.length} recorded sessions.`);
    const movingAverages = getMovingAccuracy(allAccuracies, windowSize);
    if (movingAverages.length > 0) {
      user.accuracy = movingAverages[movingAverages.length - 1]; // Use latest window avg
      this.logDsa(`Sliding Window computed latest average: ${user.accuracy}%`);
    }

    // Dynamic Weak/Strong Topic adjustments based on subject accuracy
    const subjectStats: { [sub: string]: { total: number; correct: number } } = {};
    attempts.forEach(a => {
      if (!subjectStats[a.subject]) {
        subjectStats[a.subject] = { total: 0, correct: 0 };
      }
      subjectStats[a.subject].total += a.totalQuestions;
      subjectStats[a.subject].correct += a.score;
    });

    const weak: string[] = [];
    const strong: string[] = [];

    Object.keys(subjectStats).forEach(sub => {
      const rate = (subjectStats[sub].correct / subjectStats[sub].total) * 100;
      if (rate < 60) {
        weak.push(sub);
      } else if (rate >= 80) {
        strong.push(sub);
      }
    });

    user.weakSubjects = weak.length > 0 ? weak : user.weakSubjects;
    user.strongSubjects = strong.length > 0 ? strong : user.strongSubjects;

    // INTEGRATION: Graph BFS Weak Topic Recommendation
    const g = new Graph();
    g.addEdge("Data Structures", "Algorithms");
    g.addEdge("Algorithms", "Java");
    g.addEdge("Algorithms", "Python");
    g.addEdge("DBMS", "SQL");
    g.addEdge("Computer Networks", "Cloud Computing");
    g.addEdge("Programming Logic", "C++");

    // Recommend topics for their weak subjects
    const recommendations = new Set<string>();
    user.weakSubjects.forEach(weakSub => {
      this.logDsa(`Traversing Topic Dependency Graph using Breadth-First Search (BFS) starting from weak subject: "${weakSub}"`);
      const bfsRecs = g.bfsRecommend(weakSub, 2);
      bfsRecs.forEach(rec => recommendations.add(rec));
    });

    if (recommendations.size > 0) {
      this.logDsa(`BFS Recommendation success: Suggested review topics: [${Array.from(recommendations).join(", ")}]`);
    }

    this.saveUser(user);
  }

  private static cachedTrie: Trie | null = null;

  // SEARCH SUGGESTIONS (Trie index loaded dynamically)
  static searchTopics(query: string): string[] {
    if (!this.cachedTrie) {
      const trie = new Trie();
      const questions = this.getQuestions();
      
      // Seed subjects and tags
      questions.forEach(q => {
        trie.insert(q.subject);
        q.tags.forEach(t => trie.insert(t));
      });
      this.cachedTrie = trie;
    }

    this.logDsa(`Prefix query search autocomplete (Trie traversal) for: "${query}"`);
    const suggestions = this.cachedTrie.getSuggestions(query);
    this.logDsa(`Trie traversal success: Found ${suggestions.length} suggestions.`);
    return suggestions;
  }

  // ANNOUNCEMENTS
  static getAnnouncements(): Announcement[] {
    return this.getStorageItem<Announcement[]>("algoquiz_announcements", []);
  }

  // XP DAILY PROGRESS RANGE QUERY (Prefix Sum & Fenwick Tree)
  static getXPHistoryRange(days: number): number {
    const attempts = this.getAttempts();
    const xpArray = attempts.map(a => a.xpGained);
    if (xpArray.length === 0) return 0;
    
    this.logDsa(`Running Prefix Sum range query (O(1)) over past ${days} attempts XP logs.`);
    // INTEGRATION: Prefix Sum is used to get range sums of XP gains
    const prefix = new PrefixSum(xpArray);
    const sum = prefix.queryRange(Math.max(0, xpArray.length - days), xpArray.length - 1);
    this.logDsa(`Prefix Sum response: Gained ${sum} total XP in range.`);
    return sum;
  }
}
