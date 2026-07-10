import type { Metadata } from "next";
import { Space_Grotesk } from "next/font/google";
import "./globals.css";
import { AppStateProvider } from "@/components/AppState";
import Navbar from "@/components/Navbar";
import AIChatbot from "@/components/AIChatbot";

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "AlgoQuiz Pro - AI-Powered Premium Quiz Platform",
  description: "Experience the ultimate, gamified EdTech quiz platform. Test coding output, arrange algorithms, view weak subjects, battle players, and download verified certificates.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${spaceGrotesk.className} min-h-screen flex flex-col antialiased bg-grid-pattern relative`}>
        <AppStateProvider>
          {/* Drifting Background Blobs */}
          <div className="blob-container">
            <div className="blob blob-blue"></div>
            <div className="blob blob-purple"></div>
            <div className="blob blob-pink"></div>
          </div>

          {/* Floating Navbar */}
          <header className="py-4">
            <Navbar />
          </header>

          {/* Main Content Area */}
          <main className="flex-1 w-full max-w-7xl mx-auto px-4 md:px-8 py-6">
            {children}
          </main>

          {/* Floating Chatbot Assistant */}
          <AIChatbot />

          {/* Premium Footer */}
          <footer className="w-full border-t border-white/5 py-8 mt-12 bg-slate-950/20 backdrop-blur-md">
            <div className="max-w-7xl mx-auto px-4 md:px-8 flex flex-col md:flex-row items-center justify-between text-xs text-slate-500">
              <p>© 2026 AlgoQuiz Pro. Built for technical excellence, DSA viva readiness, and premium learning.</p>
              <div className="flex space-x-4 mt-4 md:mt-0">
                <a href="#features" className="hover:text-purple-400 transition">Features</a>
                <a href="#pricing" className="hover:text-purple-400 transition">Pricing</a>
                <a href="#faq" className="hover:text-purple-400 transition">FAQ</a>
                <a href="#support" className="hover:text-purple-400 transition">Support</a>
              </div>
            </div>
          </footer>
        </AppStateProvider>
      </body>
    </html>
  );
}
