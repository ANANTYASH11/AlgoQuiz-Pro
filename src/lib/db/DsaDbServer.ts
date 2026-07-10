/* eslint-disable @typescript-eslint/no-explicit-any */
import fs from "fs";
import path from "path";
import { HashMap } from "../dsa/HashMap";
import { Trie } from "../dsa/Trie";
import { Question, seedQuestions } from "./seedQuestions";

// Paths
const DATA_DIR = path.join(process.cwd(), "src", "lib", "db", "data");
const USERS_FILE = path.join(DATA_DIR, "users.json");
const QUESTIONS_FILE = path.join(DATA_DIR, "questions.json");
const ATTEMPTS_FILE = path.join(DATA_DIR, "attempts.json");

export class DsaDbServer {
  private static instance: DsaDbServer;

  // In-memory O(1) custom Hash Map indexes
  private userByEmailIndex = new HashMap<string, any>();
  private userByUsernameIndex = new HashMap<string, any>();
  private questionByIdIndex = new HashMap<number, Question>();
  
  // Custom Tag Autocomplete Trie index
  private questionTagTrie = new Trie<Question>();

  private users: any[] = [];
  private questions: Question[] = [];
  private attempts: any[] = [];

  private constructor() {
    this.ensureFilesExist();
    this.loadAll();
  }

  public static getInstance(): DsaDbServer {
    if (!DsaDbServer.instance) {
      DsaDbServer.instance = new DsaDbServer();
    }
    return DsaDbServer.instance;
  }

  private ensureFilesExist() {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }

    if (!fs.existsSync(USERS_FILE)) {
      // Seed default admin and user
      const defaultUsers = [
        {
          username: "SystemAdmin",
          email: "admin@algoquiz.pro",
          password: "adminpassword", // In production this would be hashed
          role: "admin",
          level: 15,
          xp: 7500,
          coins: 1200,
          streak: 22,
          lastActive: new Date().toISOString(),
          rank: 1,
          accuracy: 94,
          weakSubjects: [],
          strongSubjects: ["Data Structures", "Algorithms", "OS", "DBMS", "Networks"],
          badges: ["Administrator", "Omniscient"],
          bookmarks: [],
          favoriteQuestions: [],
          dailyRewardsClaimed: true
        },
        {
          username: "AlgoMaster",
          email: "student@algoquiz.pro",
          password: "studentpassword",
          role: "student",
          level: 2,
          xp: 650,
          coins: 90,
          streak: 4,
          lastActive: new Date().toISOString(),
          rank: 10,
          accuracy: 78,
          weakSubjects: ["Algorithms", "DBMS"],
          strongSubjects: ["Data Structures", "JavaScript"],
          badges: ["Fast Learner", "Streak Beginner"],
          bookmarks: [1, 5],
          favoriteQuestions: [2],
          dailyRewardsClaimed: false
        }
      ];
      fs.writeFileSync(USERS_FILE, JSON.stringify(defaultUsers, null, 2), "utf8");
    }

    if (!fs.existsSync(QUESTIONS_FILE)) {
      fs.writeFileSync(QUESTIONS_FILE, JSON.stringify(seedQuestions, null, 2), "utf8");
    } else {
      try {
        const raw = fs.readFileSync(QUESTIONS_FILE, "utf8");
        const parsed = JSON.parse(raw);
        if (parsed.length < seedQuestions.length) {
          fs.writeFileSync(QUESTIONS_FILE, JSON.stringify(seedQuestions, null, 2), "utf8");
        }
      } catch {
        fs.writeFileSync(QUESTIONS_FILE, JSON.stringify(seedQuestions, null, 2), "utf8");
      }
    }

    if (!fs.existsSync(ATTEMPTS_FILE)) {
      fs.writeFileSync(ATTEMPTS_FILE, JSON.stringify([], null, 2), "utf8");
    }
  }

  private loadAll() {
    try {
      // Load users
      const usersRaw = fs.readFileSync(USERS_FILE, "utf8");
      this.users = JSON.parse(usersRaw);
      
      // Index users using HashMap for O(1) lookup
      this.userByEmailIndex = new HashMap<string, any>();
      this.userByUsernameIndex = new HashMap<string, any>();
      for (const u of this.users) {
        this.userByEmailIndex.put(u.email.toLowerCase(), u);
        this.userByUsernameIndex.put(u.username.toLowerCase(), u);
      }

      // Load questions
      const qsRaw = fs.readFileSync(QUESTIONS_FILE, "utf8");
      this.questions = JSON.parse(qsRaw);

      // Index questions using HashMap & Trie
      this.questionByIdIndex = new HashMap<number, Question>();
      this.questionTagTrie = new Trie<Question>();
      for (const q of this.questions) {
        this.questionByIdIndex.put(q.id, q);
        for (const tag of q.tags) {
          this.questionTagTrie.insert(tag, q);
        }
      }

      // Load attempts
      const attemptsRaw = fs.readFileSync(ATTEMPTS_FILE, "utf8");
      this.attempts = JSON.parse(attemptsRaw);
    } catch (e) {
      console.error("Failed to load DSA Database files", e);
    }
  }

  private saveUsers() {
    fs.writeFileSync(USERS_FILE, JSON.stringify(this.users, null, 2), "utf8");
  }

  private saveAttempts() {
    fs.writeFileSync(ATTEMPTS_FILE, JSON.stringify(this.attempts, null, 2), "utf8");
  }

  // --- API Methods ---

  public getUserByEmail(email: string) {
    return this.userByEmailIndex.get(email.toLowerCase());
  }

  public getUserByUsername(username: string) {
    return this.userByUsernameIndex.get(username.toLowerCase());
  }

  public createUser(userData: any) {
    const emailLower = userData.email.toLowerCase();
    const usernameLower = userData.username.toLowerCase();

    if (this.userByEmailIndex.has(emailLower) || this.userByUsernameIndex.has(usernameLower)) {
      return null;
    }

    const newUser = {
      level: 1,
      xp: 0,
      coins: 30,
      streak: 1,
      lastActive: new Date().toISOString(),
      rank: 99,
      accuracy: 0,
      weakSubjects: [],
      strongSubjects: [],
      badges: ["First Steps"],
      bookmarks: [],
      favoriteQuestions: [],
      dailyRewardsClaimed: false,
      role: "student",
      ...userData
    };

    this.users.push(newUser);
    this.userByEmailIndex.put(emailLower, newUser);
    this.userByUsernameIndex.put(usernameLower, newUser);
    this.saveUsers();
    return newUser;
  }

  public updateUser(username: string, updates: any) {
    const user = this.getUserByUsername(username);
    if (!user) return null;

    Object.assign(user, updates);
    this.saveUsers();
    
    // Refresh memory indexes
    this.userByEmailIndex.put(user.email.toLowerCase(), user);
    this.userByUsernameIndex.put(user.username.toLowerCase(), user);
    return user;
  }

  public getQuestions() {
    return this.questions;
  }

  public getQuestionById(id: number) {
    return this.questionByIdIndex.get(id);
  }

  public searchQuestionsByTag(tagPrefix: string): Question[] {
    return this.questionTagTrie.search(tagPrefix);
  }

  public addAttempt(attempt: any) {
    this.attempts.push(attempt);
    this.saveAttempts();

    // Update user stats in database
    const user = this.getUserByUsername(attempt.userId);
    if (user) {
      user.xp += attempt.xpGained;
      user.coins += attempt.coinsGained;
      
      // Calculate overall accuracy
      const userAttempts = this.attempts.filter(a => a.userId === user.username);
      const totalScore = userAttempts.reduce((sum, a) => sum + a.score, 0);
      const totalQ = userAttempts.reduce((sum, a) => sum + a.totalQuestions, 0);
      user.accuracy = totalQ > 0 ? Math.round((totalScore / totalQ) * 100) : 0;
      
      // Update streak
      user.streak = (user.streak || 0) + 1;
      user.lastActive = new Date().toISOString();

      this.updateUser(user.username, user);
    }
    return attempt;
  }

  public getAttempts(username: string) {
    return this.attempts.filter(a => a.userId === username);
  }
}
