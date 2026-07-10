"use client";

import Link from "next/link";
import { useAppState } from "@/components/AppState";
import { 
  Zap, 
  Trophy, 
  BrainCircuit, 
  Terminal, 
  ArrowRight, 
  Check, 
  ChevronDown, 
  Sparkles, 
  Code,
  Flame,
  Star
} from "lucide-react";
import { useState } from "react";

export default function LandingPage() {
  const { playSound } = useAppState();
  const [activeFaq, setActiveFaq] = useState<number | null>(null);

  const stats = [
    { label: "Active Quizzers", value: "250K+", icon: Flame },
    { label: "Questions Solved", value: "10M+", icon: BrainCircuit },
    { label: "Code Submissions", value: "5.4M+", icon: Terminal },
    { label: "Average Score Increase", value: "32%", icon: Trophy },
  ];

  const features = [
    {
      title: "AI Explanation Engine",
      description: "Get detailed, adaptive descriptions for every answer option. Understand not just what is right, but why the other options fail.",
      icon: Sparkles,
      color: "from-blue-500 to-cyan-500"
    },
    {
      title: "Advanced Question Formats",
      description: "Go beyond standard MCQs. Arrange algorithm steps, predict compiler outputs, write code snippets, and match structures in a modular environment.",
      icon: Code,
      color: "from-purple-500 to-pink-500"
    },
    {
      title: "Integrated DSA Structures",
      description: "Every action is powered by custom Data Structures and Algorithms. Open the visualizer in admin logs to trace real-time execution trees.",
      icon: BrainCircuit,
      color: "from-emerald-500 to-teal-500"
    },
    {
      title: "Real-time Multiplayer Battles",
      description: "Host tournament lobbies, share room codes, participate in voice counts, and climb the live scoreboard in competitive battles.",
      icon: Trophy,
      color: "from-amber-500 to-red-500"
    }
  ];

  const plans = [
    {
      name: "Starter",
      price: "$0",
      description: "Perfect for students preparing for standard class quizzes.",
      features: [
        "Access to standard question bank",
        "Basic performance statistics",
        "Global leaderboard access",
        "Light & Dark themes"
      ],
      cta: "Start Free",
      popular: false
    },
    {
      name: "AlgoPro Elite",
      price: "$19",
      period: "/month",
      description: "Engineered for placements, coding interviews, and viva scoring.",
      features: [
        "Unrestricted AI explanation generator",
        "All 10 question formats & 13 subjects",
        "Adaptive difficulty matching (DP)",
        "Real-time multiplayer lobbies & chat",
        "Printable PDF certificates with QR IDs",
        "Priority Queue visualizer graphs"
      ],
      cta: "Go Pro",
      popular: true
    },
    {
      name: "Enterprise EdTech",
      price: "$149",
      period: "/month",
      description: "Designed for universities, bootcamps, and coding departments.",
      features: [
        "Custom domain integration",
        "Bulk JSON / CSV question uploader",
        "Segment tree analytics exports",
        "Department-wide scoreboard filtering",
        "LMS integration & direct exports",
        "24/7 dedicated platform support"
      ],
      cta: "Contact Sales",
      popular: false
    }
  ];

  const faqs = [
    {
      question: "How does the AI Adaptation system work?",
      answer: "We use a Dynamic Programming knapsack-style selection algorithm combined with user accuracy sliding windows. If you score low in recursive trees, the system lowers difficulty and increases focus on stacks, gradually scaling back up as accuracy rebounds."
    },
    {
      question: "What makes AlgoQuiz Pro different from typical quiz sites?",
      answer: "We represent a fully verified, high-performance sandbox. Rather than standard quizzes, we test logical steps ordering, drag-and-drop matching, and live code outputs. More importantly, we demonstrate active DSA implementations (such as Heap, BST, Trie, DFS) directly in the UI layer!"
    },
    {
      question: "Can I use this to prepare for college placement exams?",
      answer: "Absolutely! The platform is seeded with standard interview questions from major tech entities, covering Data Structures, OS threads, DBMS transactions, networks routing, and coding languages."
    },
    {
      question: "Is there offline support?",
      answer: "Yes, AlgoQuiz Pro features progressive web app (PWA) cache capability, allowing you to resume active quiz attempts and study bookmarked questions even when offline."
    }
  ];

  const handleFaqClick = (idx: number) => {
    playSound("click");
    setActiveFaq(activeFaq === idx ? null : idx);
  };

  return (
    <div className="space-y-24">
      {/* HERO SECTION */}
      <section className="relative text-center py-16 md:py-24 max-w-4xl mx-auto space-y-8">
        <div className="inline-flex items-center space-x-2 rounded-full border border-purple-500/30 bg-purple-500/10 px-4 py-1.5 text-xs font-semibold text-purple-300">
          <Zap className="h-3.5 w-3.5 fill-current animate-pulse text-purple-400" />
          <span>Introducing AlgoQuiz Pro v2.0</span>
        </div>
        
        <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight">
          Master Coding Concepts. <br />
          <span className="text-gradient">Powered by Data Structures.</span>
        </h1>
        
        <p className="text-lg md:text-xl text-slate-400 max-w-2xl mx-auto font-light">
          An elite EdTech SaaS platform designed to gamify computer science. Study with AI-adapted paths, battle friends in real-time, and analyze your growth using advanced graph visualization.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
          <Link
            href="/auth"
            onClick={() => playSound("click")}
            className="w-full sm:w-auto flex items-center justify-center space-x-2 px-8 py-4 rounded-2xl bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white font-bold shadow-lg shadow-purple-500/20 transition-all duration-200 transform hover:-translate-y-0.5"
          >
            <span>Enter the Arena</span>
            <ArrowRight className="h-5 w-5" />
          </Link>
          <a
            href="#features"
            onClick={() => playSound("click")}
            className="w-full sm:w-auto flex items-center justify-center space-x-2 px-8 py-4 rounded-2xl border border-white/10 bg-slate-900/40 text-slate-300 hover:text-white hover:bg-slate-900/60 font-semibold backdrop-blur transition"
          >
            <span>Explore Features</span>
          </a>
        </div>

        {/* Floating Code Visual Mockup */}
        <div className="pt-12">
          <div className="glass rounded-3xl border border-white/10 p-4 shadow-3xl max-w-3xl mx-auto relative overflow-hidden">
            <div className="flex items-center space-x-2 border-b border-white/5 pb-3 mb-4">
              <div className="h-3 w-3 rounded-full bg-red-500/80" />
              <div className="h-3 w-3 rounded-full bg-yellow-500/80" />
              <div className="h-3 w-3 rounded-full bg-green-500/80" />
              <span className="text-xs text-slate-500 font-mono pl-4">dsa_visualizer_engine.cpp</span>
            </div>
            <pre className="text-left text-xs md:text-sm font-mono text-slate-300 overflow-x-auto p-2">
              <code>{`// Tracing Max-Heap student scores extraction...
Heap<Student> scoreHeap([](Student a, Student b) { return a.score - b.score; });
for (auto& student : currentLobby) {
    scoreHeap.insert(student); // O(log N)
}
// Extracting top K students
while (K-- > 0 && !scoreHeap.isEmpty()) {
    std::cout << "[RANK] " << scoreHeap.extract().name << std::endl;
}`}</code>
            </pre>
          </div>
        </div>
      </section>

      {/* STATS SECTION */}
      <section className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-6xl mx-auto">
        {stats.map((stat, idx) => {
          const Icon = stat.icon;
          return (
            <div key={idx} className="glass rounded-2xl p-6 text-center border border-white/5 relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 to-purple-600 opacity-50" />
              <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-xl bg-purple-500/10 text-purple-400 mb-3">
                <Icon className="h-5 w-5" />
              </div>
              <div className="text-2xl md:text-3xl font-extrabold text-white">{stat.value}</div>
              <div className="text-xs text-slate-400 mt-1">{stat.label}</div>
            </div>
          );
        })}
      </section>

      {/* FEATURES SECTION */}
      <section id="features" className="max-w-6xl mx-auto space-y-12 scroll-mt-24">
        <div className="text-center space-y-4">
          <h2 className="text-3xl md:text-4xl font-extrabold">Next-Gen SaaS Capabilities</h2>
          <p className="text-slate-400 max-w-xl mx-auto">We combine standard competitive programming interfaces with highly gamified learning environments.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {features.map((feature, idx) => {
            const Icon = feature.icon;
            return (
              <div key={idx} className="glass glass-hover rounded-3xl p-8 border border-white/10 relative overflow-hidden flex flex-col md:flex-row gap-6">
                <div className={`flex-shrink-0 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-tr ${feature.color} text-white shadow-lg`}>
                  <Icon className="h-6 w-6" />
                </div>
                <div className="space-y-2">
                  <h3 className="text-xl font-bold text-white">{feature.title}</h3>
                  <p className="text-slate-400 text-sm leading-relaxed">{feature.description}</p>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="max-w-6xl mx-auto space-y-12">
        <div className="text-center space-y-4">
          <h2 className="text-3xl md:text-4xl font-extrabold">Validated by Educators and Competitors</h2>
          <p className="text-slate-400 max-w-xl mx-auto">See how engineering aspirants are shifting from rote learning to algorithm comprehension.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            {
              name: "Siddharth Sharma",
              role: "Ex-FAANG, CSE Mentor",
              quote: "The inclusion of step-ordering and code output makes it perfect for recruitment preparations. Standard MCQs are simply insufficient.",
              rating: 5
            },
            {
              name: "Aanya Patel",
              role: "CS Student, BITS Pilani",
              quote: "BFS-based weak subject recommendation is a lifesaver. The system actually pointed me to Operating System threads right when I failed deadlock questions.",
              rating: 5
            },
            {
              name: "David Miller",
              role: "EdTech Curriculum Architect",
              quote: "AlgoQuiz Pro fits beautifully into computer science curricula. Students love the live battle waiting rooms and dynamic coin rewards.",
              rating: 5
            }
          ].map((t, idx) => (
            <div key={idx} className="glass rounded-2xl p-6 border border-white/5 flex flex-col justify-between">
              <div className="space-y-4">
                <div className="flex space-x-1 text-amber-500">
                  {Array.from({ length: t.rating }).map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-current" />
                  ))}
                </div>
                <p className="text-slate-300 italic text-sm leading-relaxed">&quot;{t.quote}&quot;</p>
              </div>
              <div className="mt-6 border-t border-white/5 pt-4">
                <div className="font-semibold text-white text-sm">{t.name}</div>
                <div className="text-xs text-purple-400">{t.role}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* PRICING SECTION (DEMO) */}
      <section id="pricing" className="max-w-6xl mx-auto space-y-12 scroll-mt-24">
        <div className="text-center space-y-4">
          <h2 className="text-3xl md:text-4xl font-extrabold">Transparent SaaS Tiers</h2>
          <p className="text-slate-400 max-w-xl mx-auto">Free tier for general study, Premium scaling for placement preparation.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {plans.map((plan, idx) => (
            <div 
              key={idx} 
              className={`glass rounded-3xl p-8 border border-white/5 relative flex flex-col justify-between ${
                plan.popular ? "border-purple-500/50 shadow-purple-500/10 shadow-2xl scale-105 z-10" : ""
              }`}
            >
              {plan.popular && (
                <span className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 text-xs font-bold text-white uppercase tracking-wider">
                  Most Popular
                </span>
              )}
              
              <div className="space-y-6">
                <div>
                  <h3 className="text-xl font-bold text-white">{plan.name}</h3>
                  <p className="text-slate-400 text-xs mt-1">{plan.description}</p>
                </div>

                <div className="flex items-baseline text-white">
                  <span className="text-4xl font-extrabold tracking-tight">{plan.price}</span>
                  {plan.period && <span className="text-slate-400 text-sm ml-1">{plan.period}</span>}
                </div>

                <div className="h-[1px] bg-white/5" />

                <ul className="space-y-3.5">
                  {plan.features.map((f, i) => (
                    <li key={i} className="flex items-start text-sm text-slate-300">
                      <Check className="h-4 w-4 text-purple-400 mr-2.5 mt-0.5 flex-shrink-0" />
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="mt-8">
                <Link
                  href="/auth"
                  onClick={() => playSound("click")}
                  className={`w-full flex items-center justify-center py-3.5 rounded-xl font-bold transition-all ${
                    plan.popular
                      ? "bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white shadow-lg"
                      : "bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white border border-white/10"
                  }`}
                >
                  {plan.cta}
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* FAQ SECTION */}
      <section id="faq" className="max-w-4xl mx-auto space-y-12 scroll-mt-24">
        <div className="text-center space-y-4">
          <h2 className="text-3xl md:text-4xl font-extrabold">Frequently Asked Questions</h2>
          <p className="text-slate-400">Everything you need to know about the platform capabilities and algorithm internals.</p>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, idx) => {
            const isOpen = activeFaq === idx;
            return (
              <div key={idx} className="glass rounded-2xl border border-white/5 overflow-hidden transition-all duration-200">
                <button
                  onClick={() => handleFaqClick(idx)}
                  className="w-full flex items-center justify-between p-6 text-left font-bold text-white hover:bg-white/5 transition"
                >
                  <span>{faq.question}</span>
                  <ChevronDown className={`h-5 w-5 text-slate-400 transition-transform duration-200 ${isOpen ? "rotate-180 text-purple-400" : ""}`} />
                </button>
                {isOpen && (
                  <div className="p-6 pt-0 text-sm text-slate-400 leading-relaxed border-t border-white/5 bg-slate-950/20">
                    {faq.answer}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* CTA SECTION */}
      <section className="glass rounded-3xl border border-white/10 p-8 md:p-16 text-center space-y-6 max-w-5xl mx-auto relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-blue-600/10 to-purple-600/15 pointer-events-none" />
        <h2 className="text-3xl md:text-5xl font-extrabold text-white">Ready to Elevate Your Logic?</h2>
        <p className="text-slate-400 max-w-xl mx-auto text-sm md:text-base leading-relaxed">
          Create your developer profile, check your streaks, spin the rewards wheel, and start solving complex coding structures today.
        </p>
        <div className="pt-4 relative z-10">
          <Link
            href="/auth"
            onClick={() => playSound("click")}
            className="inline-flex items-center space-x-2 px-8 py-4 rounded-2xl bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white font-bold shadow-lg shadow-purple-500/20 transition transform hover:-translate-y-0.5"
          >
            <span>Get Started For Free</span>
            <ArrowRight className="h-5 w-5" />
          </Link>
        </div>
      </section>
    </div>
  );
}
