# ⚡ AlgoQuiz Pro

AlgoQuiz Pro is an elite, production-grade EdTech SaaS platform designed to gamify Computer Science, Data Structures, and Algorithms (DSA). It combines interactive learning, real-time multiplayer battles, visual algorithm sandboxes, and AI-powered feedback with a premium, responsive UI/UX.

🌐 **Live Demo:** [https://algo-quiz-pro.vercel.app](https://algo-quiz-pro.vercel.app)
💻 **GitHub Repository:** [https://github.com/ANANTYASH11/AlgoQuiz-Pro](https://github.com/ANANTYASH11/AlgoQuiz-Pro)

---

## 🌟 Key Features

### 1. 🤖 AI Explanation Engine & Assistant
* **Contextual Explanations:** Receive custom, step-by-step reasoning for why an option is correct or incorrect.
* **Inline AI Chatbot:** Interactive chatbot helper (`AIChatbot.tsx`) that answers questions regarding complex concepts in real-time.

### 2. 🧠 Interactive DSA Lab
Experience live execution and visualization of foundational Data Structures and Algorithms directly in the browser:
* **Structures:** Heaps, Binary Search Trees (BST), AVL Trees, Segment Trees, Fenwick Trees, Circular Queues, Deques, HashMaps, HashSets, and Tries.
* **Algorithms:** BFS, DFS, Merge Sort, Quick Sort, Backtracking, Prefix Sums, Sliding Window, and Two-Pointer.

### 3. ⚔️ Real-Time Multiplayer Battles
* **Custom Lobbies:** Create or join active quiz rooms using unique room codes.
* **Live Scoreboards:** Compete in real-time, matching skills on the leaderboards with instantaneous ranking updates.

### 4. 🎮 Brain Gym & Gamification
* **Streaks & Daily Quests:** Maintain consecutive-day streaks to boost user engagement.
* **Rewards Wheel:** Spin to win coins and platform tokens.
* **Adaptive Difficulty (Dynamic Programming):** Auto-adjusts questions based on past accuracies.

### 5. 📊 Admin & User Dashboards
* **Admin Controls:** Bulk JSON/CSV questions uploader, database management, and execution tree tracking.
* **User Analytics:** Performance graphs and key statistics rendered beautifully using Recharts (average score, weak areas, total code submissions).

---

## 🛠️ Technology Stack

* **Framework:** Next.js (App Router, Turbopack enabled)
* **Library:** React 19
* **Language:** TypeScript (Strict type checking)
* **Styling:** Tailwind CSS v4 & Vanilla CSS
* **Animations:** Framer Motion (smooth page transitions, micro-interactions)
* **Graphics & Charts:** Recharts (responsive graphs) & Canvas Confetti (achievement celebrations)
* **Icons:** Lucide React

---

## 📂 Project Structure

```bash
c:\Quiz Application
├── src/
│   ├── app/                    # Next.js App Router Pages
│   │   ├── admin/              # Admin dashboard page
│   │   ├── api/                # Next.js Serverless API Routes
│   │   │   ├── attempts/       # User quiz attempts DB API
│   │   │   ├── auth/           # Login & registration handlers
│   │   │   ├── questions/      # Question CRUD handlers
│   │   │   └── user/           # User profile info
│   │   ├── auth/               # Unified Auth interface (Login & Sign Up)
│   │   ├── brain-gym/          # Daily spin wheel & challenges page
│   │   ├── challenge/          # Direct logic battles page
│   │   ├── dashboard/          # Student statistics & dashboards
│   │   ├── dsa-lab/            # Visualizer sandboxes for structures
│   │   ├── leaderboard/        # Live quiz rankings
│   │   ├── multiplayer/        # Multiplayer lobbies & room joining
│   │   ├── profile/            # Student achievements & certificate printing
│   │   ├── quiz/               # Subject select & active quiz sandbox
│   │   ├── globals.css         # Styling, variables, and glassmorphism rules
│   │   └── layout.tsx          # Root Layout (Navbar & AppState Providers)
│   │
│   ├── components/             # Reusable UI Components
│   │   ├── AIChatbot.tsx       # Floating AI chatbot interface
│   │   ├── AppState.tsx        # Global state, theme management, and audio controller
│   │   └── Navbar.tsx          # Navigation sidebar and top menu
│   │
│   └── lib/                    # Logic Layer
│       ├── db/                 # DB configuration & initial mock data
│       │   ├── data/           # JSON files acting as in-memory databases
│       │   ├── DsaDbServer.ts  # Mock server routing queries
│       │   └── seedQuestions.ts# Initial standard question bank
│       └── dsa/                # Pure TS class-based implementations for DSA
│
├── public/                     # Static assets (SVGs, favicon)
├── next.config.ts              # Next.js config
├── eslint.config.mjs           # Code quality rules
└── package.json                # Project dependencies and script runner
```

---

## 🚀 Getting Started

Follow these steps to run the application locally on your machine.

### 📋 Prerequisites

* Node.js (version 18.x or higher recommended)
* npm, yarn, pnpm, or bun

### 🔧 Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/ANANTYASH11/AlgoQuiz-Pro.git
   cd AlgoQuiz-Pro
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start the development server:**
   ```bash
   npm run dev
   ```
   *The app should now be running locally on [http://localhost:3000](http://localhost:3000).*

### 🏗️ Production Build

To compile a highly optimized production bundle of the application:
```bash
npm run build
```
To run the production build locally:
```bash
npm run start
```

---

## 💾 Database & Mock Engine

The application includes a fully self-contained, light-weight database simulation:
* It reads and writes mock records dynamically using JSON databases located inside `src/lib/db/data/`.
* High-performance queries, mock authorizations, and transactional attempts are processed seamlessly on the client and serverless API endpoints using helper utilities.

---

## 🚀 Deployment

The site is configured for continuous integration/continuous deployment (CI/CD) with **Vercel**:
* Every commit pushed to `main` on GitHub triggers a new production build on Vercel automatically.
* Configure custom environment variables and domains inside the Vercel dashboard.

---

## 📝 License

This project is configured for educational purposes. Feel free to clone, adapt, and build upon it!
