"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAppState } from "@/components/AppState";
import { 
  Lock, 
  Mail, 
  User, 
  ArrowRight, 
  Key, 
  ArrowLeft,
  ShieldCheck,
  Sparkles
} from "lucide-react";

export default function AuthPage() {
  const router = useRouter();
  const { updateUser, playSound, triggerConfetti } = useAppState();

  const [activeTab, setActiveTab] = useState<"login" | "signup" | "forgot" | "otp">("login");
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [otpCode, setOtpCode] = useState(["", "", "", ""]);
  const [selectedAvatar, setSelectedAvatar] = useState("👨‍💻");
  const [errorMsg, setErrorMsg] = useState("");

  const avatars = ["👨‍💻", "👩‍💻", "🤖", "🚀", "🌌", "👾", "🦊", "🦁", "🐼", "🦄"];

  const handleSocialLogin = (provider: string) => {
    playSound("click");
    // Simulate JWT token issuance and login
    const mockUser = {
      username: provider === "Google" ? "G_Developer" : "Git_Hacker",
      email: `${provider.toLowerCase()}@algoquiz.pro`,
      role: "student" as const,
      level: 1,
      xp: 100,
      coins: 55,
      streak: 1,
      lastActive: new Date().toISOString(),
      rank: 45,
      accuracy: 80,
      weakSubjects: ["Algorithms"],
      strongSubjects: ["Java"],
      badges: ["Code Rookie"],
      bookmarks: [],
      favoriteQuestions: [],
      dailyRewardsClaimed: false,
    };
    
    localStorage.setItem("algoquiz_token", "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.mockToken");
    updateUser(mockUser);
    triggerConfetti();
    playSound("win");
    router.push("/dashboard");
  };

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    playSound("click");
    setErrorMsg("");

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (!res.ok || data.error) {
        setErrorMsg(data.error || "Login failed");
        playSound("incorrect");
        return;
      }

      localStorage.setItem("algoquiz_token", data.token);
      updateUser(data.user);
      playSound("win");
      triggerConfetti();
      router.push("/dashboard");
    } catch (err) {
      console.error(err);
      setErrorMsg("Network error connecting to DSA Database backend.");
      playSound("incorrect");
    }
  };

  const handleSignupSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    playSound("click");
    setErrorMsg("");
    setActiveTab("otp");
  };

  const handleOtpChange = (element: HTMLInputElement, index: number) => {
    if (isNaN(Number(element.value))) return false;
    
    const newOtp = [...otpCode];
    newOtp[index] = element.value;
    setOtpCode(newOtp);

    // Auto-focus next input
    if (element.value !== "" && element.nextSibling) {
      (element.nextSibling as HTMLInputElement).focus();
    }
  };

  const handleOtpSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    playSound("click");
    setErrorMsg("");

    try {
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username,
          email,
          password,
          avatar: selectedAvatar,
        }),
      });
      const data = await res.json();
      if (!res.ok || data.error) {
        setErrorMsg(data.error || "Signup failed");
        playSound("incorrect");
        setActiveTab("signup");
        return;
      }

      localStorage.setItem("algoquiz_token", data.token);
      updateUser(data.user);
      playSound("level_up");
      triggerConfetti();
      router.push("/dashboard");
    } catch (err) {
      console.error(err);
      setErrorMsg("Network error connecting to DSA Database backend.");
      playSound("incorrect");
      setActiveTab("signup");
    }
  };

  return (
    <div className="flex justify-center items-center py-12 md:py-20">
      <div className="glass rounded-3xl w-full max-w-lg p-8 md:p-10 border border-white/10 relative overflow-hidden shadow-2xl">
        
        {/* Glow Line */}
        <div className="absolute top-0 left-0 w-full h-[3px] bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500" />
        
        {/* Logo / Header */}
        <div className="text-center mb-8 space-y-2">
          <h2 className="text-2xl md:text-3xl font-extrabold text-white">
            {activeTab === "login" && "Welcome Back"}
            {activeTab === "signup" && "Create Your Account"}
            {activeTab === "forgot" && "Reset Password"}
            {activeTab === "otp" && "Verify OTP"}
          </h2>
          <p className="text-xs md:text-sm text-slate-400">
            {activeTab === "login" && "Access your personalized CS learning path."}
            {activeTab === "signup" && "Start climbing the global leaderboards."}
            {activeTab === "forgot" && "We will send verification codes to your mail."}
            {activeTab === "otp" && "We sent a 4-digit code to your email."}
          </p>
        </div>

        {/* Error message banner */}
        {errorMsg && (
          <div className="mb-6 p-4 rounded-xl border border-red-500/20 bg-red-500/10 text-red-400 text-xs font-semibold text-center animate-shake">
            ⚠️ {errorMsg}
          </div>
        )}

        {/* Auth form views */}
        {activeTab === "login" && (
          <form onSubmit={handleLoginSubmit} className="space-y-5">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-400">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
                <input
                  type="email"
                  required
                  placeholder="name@university.edu"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-slate-900/60 border border-white/10 rounded-xl py-3 pl-11 pr-4 text-sm text-white focus:outline-none focus:border-purple-500/80 transition"
                />
              </div>
              <span className="text-[10px] text-slate-500">Hint: Enter &apos;admin@algoquiz.pro&apos; to try Admin mode!</span>
            </div>

            <div className="space-y-1.5">
              <div className="flex justify-between items-center">
                <label className="text-xs font-semibold text-slate-400">Password</label>
                <button
                  type="button"
                  onClick={() => { playSound("click"); setActiveTab("forgot"); }}
                  className="text-xs text-purple-400 hover:text-purple-300 transition"
                >
                  Forgot Password?
                </button>
              </div>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-slate-900/60 border border-white/10 rounded-xl py-3 pl-11 pr-4 text-sm text-white focus:outline-none focus:border-purple-500/80 transition"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full flex items-center justify-center space-x-2 py-3 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white font-bold transition shadow-lg shadow-purple-500/10"
            >
              <span>Login to Dashboard</span>
              <ArrowRight className="h-4 w-4" />
            </button>

            {/* Social Separator */}
            <div className="flex items-center my-6">
              <div className="h-[1px] flex-1 bg-white/5" />
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest px-3">or continue with</span>
              <div className="h-[1px] flex-1 bg-white/5" />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <button
                type="button"
                onClick={() => handleSocialLogin("Google")}
                className="flex items-center justify-center space-x-2 py-2.5 rounded-xl border border-white/5 bg-white/5 text-slate-300 hover:text-white hover:bg-white/10 transition text-sm"
              >
                <span className="text-red-400 font-bold font-mono">G</span>
                <span>Google</span>
              </button>
              <button
                type="button"
                onClick={() => handleSocialLogin("GitHub")}
                className="flex items-center justify-center space-x-2 py-2.5 rounded-xl border border-white/5 bg-white/5 text-slate-300 hover:text-white hover:bg-white/10 transition text-sm"
              >
                <span className="text-slate-400 font-bold font-mono">Git</span>
                <span>GitHub</span>
              </button>
            </div>

            <div className="text-center pt-4">
              <p className="text-xs text-slate-400">
                New to AlgoQuiz Pro?{" "}
                <button
                  type="button"
                  onClick={() => { playSound("click"); setActiveTab("signup"); }}
                  className="text-purple-400 hover:text-purple-300 font-bold transition"
                >
                  Create Account
                </button>
              </p>
            </div>
          </form>
        )}

        {activeTab === "signup" && (
          <form onSubmit={handleSignupSubmit} className="space-y-5">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-400">Select Avatar Symbol</label>
              <div className="flex items-center justify-between p-3 rounded-xl bg-slate-900/60 border border-white/10">
                <span className="text-3xl pr-4">{selectedAvatar}</span>
                <div className="flex-1 flex gap-2 overflow-x-auto py-1">
                  {avatars.map((av, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => { playSound("click"); setSelectedAvatar(av); }}
                      className={`text-xl p-1 rounded-lg border hover:bg-white/10 transition ${
                        selectedAvatar === av ? "border-purple-500 bg-purple-500/10" : "border-transparent"
                      }`}
                    >
                      {av}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-400">Username</label>
              <div className="relative">
                <User className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
                <input
                  type="text"
                  required
                  placeholder="AlgoCoder99"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full bg-slate-900/60 border border-white/10 rounded-xl py-3 pl-11 pr-4 text-sm text-white focus:outline-none focus:border-purple-500/80 transition"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-400">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
                <input
                  type="email"
                  required
                  placeholder="name@university.edu"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-slate-900/60 border border-white/10 rounded-xl py-3 pl-11 pr-4 text-sm text-white focus:outline-none focus:border-purple-500/80 transition"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-400">Password</label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-slate-900/60 border border-white/10 rounded-xl py-3 pl-11 pr-4 text-sm text-white focus:outline-none focus:border-purple-500/80 transition"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full flex items-center justify-center space-x-2 py-3 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white font-bold transition shadow-lg"
            >
              <span>Get OTP Code</span>
              <Sparkles className="h-4 w-4" />
            </button>

            <div className="text-center pt-2">
              <button
                type="button"
                onClick={() => { playSound("click"); setActiveTab("login"); }}
                className="text-xs text-slate-400 hover:text-white transition flex items-center justify-center mx-auto space-x-1"
              >
                <ArrowLeft className="h-3 w-3" />
                <span>Back to Login</span>
              </button>
            </div>
          </form>
        )}

        {activeTab === "forgot" && (
          <form onSubmit={(e) => { e.preventDefault(); setActiveTab("otp"); }} className="space-y-5">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-400">Enter Verified Email</label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
                <input
                  type="email"
                  required
                  placeholder="student@algoquiz.pro"
                  className="w-full bg-slate-900/60 border border-white/10 rounded-xl py-3 pl-11 pr-4 text-sm text-white focus:outline-none focus:border-purple-500/80 transition"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full flex items-center justify-center space-x-2 py-3 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold transition"
            >
              <span>Send OTP Verification</span>
              <Key className="h-4 w-4" />
            </button>

            <div className="text-center pt-2">
              <button
                type="button"
                onClick={() => { playSound("click"); setActiveTab("login"); }}
                className="text-xs text-slate-400 hover:text-white transition flex items-center justify-center mx-auto space-x-1"
              >
                <ArrowLeft className="h-3 w-3" />
                <span>Back to Login</span>
              </button>
            </div>
          </form>
        )}

        {activeTab === "otp" && (
          <form onSubmit={handleOtpSubmit} className="space-y-6">
            <div className="flex justify-center space-x-4">
              {otpCode.map((data, index) => (
                <input
                  key={index}
                  type="text"
                  maxLength={1}
                  required
                  value={data}
                  onChange={(e) => handleOtpChange(e.target, index)}
                  onFocus={(e) => e.target.select()}
                  className="w-12 h-14 bg-slate-900/80 border-2 border-white/10 rounded-xl text-center text-xl font-bold text-white focus:outline-none focus:border-purple-500 transition"
                />
              ))}
            </div>

            <button
              type="submit"
              className="w-full flex items-center justify-center space-x-2 py-3 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white font-bold transition"
            >
              <span>Verify & Continue</span>
              <ShieldCheck className="h-4 w-4" />
            </button>

            <div className="text-center">
              <p className="text-xs text-slate-400">
                {"Didn't receive the code? "}
                <button
                  type="button"
                  onClick={() => { playSound("click"); alert("New code dispatched!"); }}
                  className="text-purple-400 hover:text-purple-300 font-bold transition"
                >
                  Resend Code
                </button>
              </p>
            </div>
          </form>
        )}

      </div>
    </div>
  );
}
