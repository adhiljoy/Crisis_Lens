"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import { ShieldAlert, Globe, Zap } from "lucide-react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [showEmailModal, setShowEmailModal] = useState(false);
  const [email, setEmail] = useState("");
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes("@")) {
      setError("Valid operator identifier required.");
      return;
    }

    setIsLoading(true);
    setError(null);
    
    try {
      // Direct session uplink via demo bypass as required for simplified mockup
      const response = await fetch("/api/auth/demo", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim().toLowerCase() }),
      });
      
      const data = await response.json();
      if (data.success) {
        // Precise timing for visual feedback
        setTimeout(() => {
          router.push("/dashboard");
        }, 300);
      } else {
        setError(data.message || "Uplink rejected.");
        setIsLoading(false);
      }
    } catch (err) {
      console.error("Communication failure:", err);
      setError("Neural link failure. Try again.");
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center relative overflow-hidden bg-slate-50 selection:bg-blue-500/30 font-sans">
      {/* Light Grid Background */}
      <div 
        className="absolute inset-0 z-0 opacity-[0.05]"
        style={{
          backgroundImage: `linear-gradient(#2563eb 1px, transparent 1px), linear-gradient(90deg, #2563eb 1px, transparent 1px)`,
          backgroundSize: "40px 40px",
        }}
      />

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="relative z-10 w-full max-w-[500px] mx-4"
      >
        <div className="bg-white/95 backdrop-blur-2xl rounded-[3rem] p-12 md:p-16 shadow-[0_20px_60px_-15px_rgba(37,99,235,0.1)] border border-blue-500/10 relative overflow-hidden">
          
          {/* Header */}
          <div className="text-center space-y-4 mb-16 relative z-10">
            <div className="relative inline-block mb-2">
               <div className="absolute inset-0 bg-blue-500/10 blur-3xl rounded-full" />
               <ShieldAlert className="w-16 h-16 text-blue-600 relative z-10" />
            </div>
            
            <div className="space-y-1">
              <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight">
                CrisisLens <span className="text-blue-600">AI</span>
              </h1>
              <p className="text-blue-500/50 font-black uppercase tracking-[0.4em] text-[9px]">Neural Command Interface</p>
            </div>
          </div>

          <div className="w-full space-y-10 relative z-10">
              <div className="text-center space-y-2">
                 <h2 className="text-2xl font-bold text-slate-800 tracking-tight">Operational Authentication</h2>
                 <p className="text-slate-400 text-sm font-medium">Secure authorization required for grid uplink.</p>
              </div>

              <div className="space-y-4">
                <button
                  type="button"
                  onClick={() => setShowEmailModal(true)}
                  className="w-full h-16 bg-[#0f172a] rounded-[1.25rem] flex items-center justify-center gap-4 hover:opacity-95 active:scale-95 transition-all shadow-2xl group border border-white/10"
                >
                  <div className="w-6 h-6 bg-white rounded-full flex items-center justify-center shrink-0">
                    <span className="text-slate-900 font-black text-[12px]">G</span>
                  </div>
                  <span className="font-extrabold text-[#ffffff] uppercase tracking-[0.2em] text-[11px] block">
                    Login with Google
                  </span>
                </button>
              </div>

              <div className="pt-10 border-t border-slate-100/80">
                <div className="flex items-center justify-center gap-10 opacity-30 text-slate-500">
                   <div className="flex items-center gap-2">
                     <Globe className="w-3 h-3" />
                     <span className="text-[9px] font-black uppercase tracking-widest">Global Link</span>
                   </div>
                   <div className="flex items-center gap-2">
                     <Zap className="w-3 h-3" />
                     <span className="text-[9px] font-black uppercase tracking-widest">Zero Latency</span>
                   </div>
                </div>
              </div>
          </div>
        </div>
      </motion.div>

      {/* Login Modal */}
      {showEmailModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
            onClick={() => !isLoading && setShowEmailModal(false)}
          />
          <motion.div 
            initial={{ scale: 0.9, opacity: 0, y: 10 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            className="relative z-10 w-full max-w-[400px] bg-white rounded-[2.5rem] shadow-2xl border border-slate-100 p-10 overflow-hidden"
          >
            <div className="absolute top-0 right-0 p-6">
                <button 
                  onClick={() => setShowEmailModal(false)}
                  className="p-2 hover:bg-slate-50 rounded-full transition-colors text-slate-400"
                >
                  <Zap className="w-4 h-4 rotate-45" />
                </button>
            </div>

            <div className="space-y-6">
              <div className="space-y-2">
                <h3 className="text-xl font-bold text-slate-900">Direct Uplink</h3>
                <p className="text-slate-500 text-sm">Enter identifier for instant authorization.</p>
              </div>

              <form onSubmit={handleLogin} className="space-y-4">
                <div className="space-y-1">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="operator@crisislens.ai"
                    className="w-full h-14 bg-slate-50 border border-slate-200 rounded-2xl px-5 text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-medium placeholder:text-slate-400"
                    autoFocus
                  />
                  {error && (
                    <motion.p 
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="text-red-500 text-[10px] font-bold uppercase tracking-wider pl-2"
                    >
                      {error}
                    </motion.p>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full h-14 bg-blue-600 rounded-2xl flex items-center justify-center gap-3 hover:bg-blue-700 active:scale-[0.98] transition-all shadow-lg shadow-blue-500/25 disabled:opacity-50 disabled:cursor-not-allowed group relative overflow-hidden"
                >
                  {isLoading && (
                    <motion.div 
                      className="absolute inset-0 bg-white/20"
                      initial={{ width: "0%" }}
                      animate={{ width: "100%" }}
                      transition={{ duration: 1.5, repeat: Infinity }}
                    />
                  )}
                  <span className="font-bold text-white uppercase tracking-widest text-[11px] relative z-10">
                    {isLoading ? "Synchronizing..." : "Initiate Login"}
                  </span>
                </button>
              </form>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}
