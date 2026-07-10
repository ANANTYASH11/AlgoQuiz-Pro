"use client";

import { useEffect, useState, useRef } from "react";
import { useAppState } from "@/components/AppState";
import { UserProfile } from "@/lib/db/mockDb";
import { 
  Award, 
  Edit3, 
  ShieldCheck, 
  Calendar,
  Coins,
  Zap,
  CheckCircle2,
  FileDown
} from "lucide-react";
import { useRouter } from "next/navigation";

export default function ProfilePage() {
  const router = useRouter();
  const { user, attempts, playSound, updateUser, triggerConfetti } = useAppState();

  const [editMode, setEditMode] = useState(false);
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [college, setCollege] = useState("DTU");
  const [dept, setDept] = useState("CSE");
  
  // Certificate view state
  const [certModalOpen, setCertModalOpen] = useState(false);
  
  // Canvas Ref
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const token = localStorage.getItem("algoquiz_token");
    if (!token) {
      router.push("/auth");
      return;
    }
    if (user) {
      setTimeout(() => {
        setUsername(user.username);
        setEmail(user.email);
      }, 0);
    }
  }, [user, router]);

  if (!user) return null;

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    playSound("correct");
    
    const updated: UserProfile = {
      ...user,
      username,
      email,
      college,
      dept
    };

    updateUser(updated);
    setEditMode(false);
    triggerConfetti();
  };

  const handleGenerateCertificate = () => {
    playSound("click");
    // Generate a unique Certificate ID
    const randomId = generateCertificateId();
    setCertModalOpen(true);

    // Draw the certificate on the canvas shortly after modal mounts
    setTimeout(() => {
      drawCertificate(randomId);
    }, 100);
  };

  const drawCertificate = (id: string) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Dimensions: 800 x 600
    ctx.clearRect(0, 0, 800, 600);

    // 1. Background Gradient
    const bgGrad = ctx.createLinearGradient(0, 0, 800, 600);
    bgGrad.addColorStop(0, "#080b15");
    bgGrad.addColorStop(1, "#150b28");
    ctx.fillStyle = bgGrad;
    ctx.fillRect(0, 0, 800, 600);

    // 2. Gold Frame Border
    ctx.strokeStyle = "#d97706";
    ctx.lineWidth = 6;
    ctx.strokeRect(20, 20, 760, 560);

    ctx.strokeStyle = "#f59e0b";
    ctx.lineWidth = 2;
    ctx.strokeRect(30, 30, 740, 540);

    // 3. Corner Seals
    const drawCornerOrnament = (x: number, y: number) => {
      ctx.fillStyle = "#f59e0b";
      ctx.beginPath();
      ctx.arc(x, y, 10, 0, Math.PI * 2);
      ctx.fill();
    };
    drawCornerOrnament(35, 35);
    drawCornerOrnament(765, 35);
    drawCornerOrnament(35, 565);
    drawCornerOrnament(765, 565);

    // 4. Header Titles
    ctx.textAlign = "center";
    ctx.fillStyle = "#ffffff";
    ctx.font = "bold 32px 'Space Grotesk', Arial";
    ctx.fillText("ALGOQUIZ PRO", 400, 100);

    ctx.fillStyle = "#a78bfa";
    ctx.font = "italic 16px Arial";
    ctx.fillText("HONORARY CERTIFICATE OF MASTERY", 400, 130);

    // Separator line
    ctx.strokeStyle = "rgba(255,255,255,0.1)";
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(250, 155);
    ctx.lineTo(550, 155);
    ctx.stroke();

    // 5. Body Text
    ctx.fillStyle = "#94a3b8";
    ctx.font = "14px Arial";
    ctx.fillText("This is to certify that the developer", 400, 195);

    // Student Name (Glow gradient)
    ctx.fillStyle = "#f8fafc";
    ctx.font = "bold 38px 'Space Grotesk', Arial";
    ctx.fillText(user.username.toUpperCase(), 400, 250);

    ctx.fillStyle = "#94a3b8";
    ctx.font = "14px Arial";
    ctx.fillText("has successfully qualified CS assessments on AlgoQuiz Pro,", 400, 295);
    ctx.fillText("demonstrating mastery over Data Structures, Algorithms, and Core CS Concepts.", 400, 320);

    // 6. Metrics & Details
    ctx.fillStyle = "#3b82f6";
    ctx.font = "bold 15px Arial";
    ctx.fillText(`Accuracy: ${user.accuracy}%  |  Rank: #${user.rank}  |  Level: ${user.level}`, 400, 370);

    // 7. Signature Seal & QR Code
    // Seal Circle
    ctx.fillStyle = "#f59e0b";
    ctx.beginPath();
    ctx.arc(600, 480, 35, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = "#000000";
    ctx.font = "bold 10px Arial";
    ctx.fillText("VERIFIED", 600, 483);

    // QR Code simulation
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(150, 440, 70, 70);
    // Draw tiny squares to simulate QR code
    ctx.fillStyle = "#000000";
    ctx.fillRect(155, 445, 20, 20);
    ctx.fillRect(195, 445, 20, 20);
    ctx.fillRect(155, 485, 20, 20);
    // Random dots
    ctx.fillRect(180, 470, 10, 10);
    ctx.fillRect(190, 480, 10, 10);
    ctx.fillRect(170, 455, 10, 10);

    // QR Verification Text
    ctx.fillStyle = "#94a3b8";
    ctx.font = "10px Arial";
    ctx.fillText("Scan QR to Verify", 185, 525);

    // 8. Signatures
    ctx.strokeStyle = "#a78bfa";
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(350, 485);
    ctx.lineTo(470, 485);
    ctx.stroke();

    ctx.fillStyle = "#f8fafc";
    ctx.font = "italic 12px Arial";
    ctx.fillText("AI Evaluator Sign", 410, 505);

    // 9. Certificate ID Footer
    ctx.fillStyle = "#475569";
    ctx.font = "10px Courier New";
    ctx.fillText(`Certificate ID: ${id}`, 400, 550);
  };

  const handleDownloadCert = () => {
    playSound("click");
    const canvas = canvasRef.current;
    if (!canvas) return;

    // Save as PNG
    const link = document.createElement("a");
    link.download = `Certificate_${user.username}_AlgoQuiz.png`;
    link.href = canvas.toDataURL("image/png");
    link.click();
  };

  return (
    <div className="space-y-8">
      {/* HEADER SUMMARY */}
      <section className="glass rounded-3xl p-6 md:p-8 border border-white/10 flex flex-col md:flex-row justify-between items-center gap-6 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-blue-600/10 via-purple-600/10 to-transparent pointer-events-none" />
        
        <div className="flex items-center space-x-4 relative z-10 w-full md:w-auto">
          <div className="h-16 w-16 rounded-2xl bg-purple-600/20 border border-purple-500/30 flex items-center justify-center text-4xl shadow-lg">
            👨‍💻
          </div>
          <div className="space-y-1">
            <h3 className="text-xl font-bold text-white">{user.username}</h3>
            <p className="text-xs text-slate-400">{user.email}</p>
            <div className="flex items-center space-x-2 text-[10px] text-purple-400 font-bold uppercase pt-0.5">
              <span>{dept || "CSE"} Dept</span>
              <span>•</span>
              <span>{college || "DTU"}</span>
            </div>
          </div>
        </div>

        <div className="flex gap-3 relative z-10 w-full md:w-auto">
          <button
            onClick={() => { playSound("click"); setEditMode(!editMode); }}
            className="flex-1 md:flex-none flex items-center justify-center space-x-2 px-4 py-2.5 rounded-xl border border-white/10 bg-slate-900/60 text-slate-300 hover:text-white transition text-xs font-semibold"
          >
            <Edit3 className="h-4 w-4" />
            <span>Edit Profile</span>
          </button>
          
          {user.accuracy >= 70 ? (
            <button
              onClick={handleGenerateCertificate}
              className="flex-1 md:flex-none flex items-center justify-center space-x-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-yellow-500 to-amber-500 hover:from-yellow-400 hover:to-amber-400 text-slate-950 font-bold transition text-xs"
            >
              <Award className="h-4 w-4" />
              <span>Get Certificate</span>
            </button>
          ) : (
            <button
              disabled
              className="flex-1 md:flex-none flex items-center justify-center space-x-2 px-4 py-2.5 rounded-xl bg-slate-900 border border-white/5 text-slate-500 text-xs font-semibold cursor-not-allowed"
              title="Maintain > 70% Accuracy to unlock certificates"
            >
              <Award className="h-4 w-4 opacity-50" />
              <span>Locked (Req 70% Acc)</span>
            </button>
          )}
        </div>
      </section>

      {/* EDIT MODAL */}
      {editMode && (
        <section className="glass rounded-3xl p-6 border border-white/10 max-w-lg mx-auto">
          <form onSubmit={handleSaveProfile} className="space-y-4">
            <h4 className="font-bold text-white text-md">Edit Profile Credentials</h4>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-xs text-slate-400">Username</label>
                <input
                  type="text"
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full bg-slate-950 border border-white/10 rounded-xl px-3 py-2 text-xs text-white"
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs text-slate-400">Email</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-slate-950 border border-white/10 rounded-xl px-3 py-2 text-xs text-white"
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs text-slate-400">College / University</label>
                <input
                  type="text"
                  required
                  value={college}
                  onChange={(e) => setCollege(e.target.value)}
                  className="w-full bg-slate-950 border border-white/10 rounded-xl px-3 py-2 text-xs text-white"
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs text-slate-400">Department</label>
                <input
                  type="text"
                  required
                  value={dept}
                  onChange={(e) => setDept(e.target.value)}
                  className="w-full bg-slate-950 border border-white/10 rounded-xl px-3 py-2 text-xs text-white"
                />
              </div>
            </div>
            <div className="flex gap-3 pt-2">
              <button
                type="submit"
                className="flex-1 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs"
              >
                Save Updates
              </button>
              <button
                type="button"
                onClick={() => { playSound("click"); setEditMode(false); }}
                className="px-4 py-2.5 rounded-xl border border-white/10 text-slate-400 hover:text-white text-xs"
              >
                Cancel
              </button>
            </div>
          </form>
        </section>
      )}

      {/* GAMIFICATION & PROGRESS LOGS */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Achievements Progress Card */}
        <div className="glass rounded-2xl p-5 border border-white/5 space-y-4">
          <h4 className="text-xs font-bold text-slate-400 uppercase border-b border-white/5 pb-2">Achievements & XP</h4>
          
          <div className="space-y-4">
            {/* Level progress bar */}
            <div className="space-y-1.5">
              <div className="flex justify-between items-center text-xs font-bold">
                <span className="text-yellow-400 flex items-center space-x-1">
                  <Zap className="h-4 w-4 fill-current" />
                  <span>Level {user.level}</span>
                </span>
                <span className="text-slate-400">{user.xp % 500} / 500 XP</span>
              </div>
              <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden border border-white/5">
                <div 
                  className="h-full bg-gradient-to-r from-blue-500 to-purple-600 rounded-full"
                  style={{ width: `${((user.xp % 500) / 500) * 100}%` }}
                />
              </div>
            </div>

            {/* Coins */}
            <div className="flex items-center justify-between p-3 rounded-xl bg-slate-900/40 border border-white/5 text-xs">
              <div className="flex items-center space-x-2 text-amber-500">
                <Coins className="h-4.5 w-4.5" />
                <span className="font-bold text-slate-300">Gold Coin Treasury</span>
              </div>
              <span className="font-black text-white">{user.coins} Coins</span>
            </div>
          </div>
        </div>

        {/* Badges Box */}
        <div className="glass rounded-2xl p-5 border border-white/5 space-y-4 md:col-span-2">
          <h4 className="text-xs font-bold text-slate-400 uppercase border-b border-white/5 pb-2">Badges Unlocked</h4>
          <div className="flex flex-wrap gap-3">
            {user.badges.map((badge, idx) => (
              <div 
                key={idx} 
                className="flex items-center space-x-1.5 px-3 py-2 rounded-xl bg-gradient-to-r from-purple-950/40 to-slate-900/60 border border-purple-500/20 text-xs font-bold text-purple-300"
              >
                <ShieldCheck className="h-4 w-4 text-purple-400" />
                <span>{badge}</span>
              </div>
            ))}
            {user.badges.length === 0 && (
              <div className="text-xs text-slate-500 italic py-2">No badges unlocked yet. Solve quizzes to earn honors!</div>
            )}
          </div>
        </div>

      </section>

      {/* QUIZ HISTORY LIST */}
      <section className="glass rounded-2xl p-6 border border-white/5 space-y-4">
        <h4 className="text-xs font-bold text-slate-400 uppercase border-b border-white/5 pb-2 flex items-center space-x-2">
          <Calendar className="h-4.5 w-4.5" />
          <span>Quiz Attempts Audit History</span>
        </h4>

        <div className="divide-y divide-white/5">
          {attempts.map((attempt, idx) => (
            <div key={idx} className="py-3 flex items-center justify-between text-xs">
              <div className="space-y-0.5">
                <div className="font-bold text-white">{attempt.subject} Quiz</div>
                <div className="text-[10px] text-slate-500">
                  {new Date(attempt.date).toLocaleString()} • {attempt.difficulty}
                </div>
              </div>
              <div className="text-right">
                <div className="font-bold text-white">{attempt.score} / {attempt.totalQuestions} answers correct</div>
                <div className="text-[10px] text-emerald-400 font-bold">{attempt.accuracy}% accuracy</div>
              </div>
            </div>
          ))}
          {attempts.length === 0 && (
            <div className="py-8 text-center text-slate-500 text-xs">No quiz history available. Play an arena session to compile stats!</div>
          )}
        </div>
      </section>

      {/* CERTIFICATE DISPLAY MODAL */}
      {certModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
          <div className="glass rounded-3xl border border-white/10 w-full max-w-3xl p-6 relative overflow-hidden shadow-2xl space-y-6">
            <div className="flex justify-between items-center pb-2 border-b border-white/5">
              <h3 className="text-md font-bold text-white flex items-center space-x-2">
                <CheckCircle2 className="h-5 w-5 text-emerald-500" />
                <span>Verified Mastery Honors</span>
              </h3>
              <button
                onClick={() => { playSound("click"); setCertModalOpen(false); }}
                className="text-slate-400 hover:text-white text-xs font-bold"
              >
                Close
              </button>
            </div>

            {/* Canvas Render Screen */}
            <div className="flex justify-center border border-white/5 rounded-2xl overflow-hidden bg-slate-950/60 p-2">
              <canvas 
                ref={canvasRef} 
                width={800} 
                height={600} 
                className="w-full max-w-xl aspect-[4/3] rounded-lg shadow-lg"
              />
            </div>

            <div className="flex gap-4">
              <button
                onClick={handleDownloadCert}
                className="flex-1 py-3 rounded-xl bg-gradient-to-r from-yellow-500 to-amber-500 hover:from-yellow-400 hover:to-amber-400 text-slate-950 font-bold text-sm shadow flex items-center justify-center space-x-2"
              >
                <FileDown className="h-4.5 w-4.5" />
                <span>Download Image Certificate</span>
              </button>
              <button
                onClick={() => { playSound("click"); window.print(); }}
                className="px-6 py-3 rounded-xl border border-white/10 text-slate-300 hover:text-white transition text-xs font-semibold"
              >
                Print PDF
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}

function generateCertificateId(): string {
  return "AQ-" + Math.floor(100000 + Math.random() * 900000).toString() + "-2026";
}
