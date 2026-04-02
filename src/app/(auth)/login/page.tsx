"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import { ShieldAlert, Globe, Zap } from "lucide-react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleGoogleLogin = () => {
    setIsLoading(true);
    // Direct frontend redirect - no backend needed
    setTimeout(() => {
      router.push("/dashboard");
    }, 800);
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center relative overflow-hidden bg-slate-50 selection:bg-blue-500/30">
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
                  onClick={handleGoogleLogin}
                  disabled={isLoading}
                  className="w-full h-16 bg-[#0a0c10] rounded-2xl flex items-center justify-center gap-4 hover:bg-[#1a1c22] active:scale-[0.98] transition-all duration-300 shadow-xl group relative"
                >
                   {isLoading ? (
                     <div className="w-6 h-6 border-3 border-white/20 border-t-white rounded-full animate-spin" />
                   ) : (
                     <div className="flex items-center gap-4">
                        <svg className="w-5 h-5" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M44.5 20H24V29H35.8C34.7 33.9 30.1 37 24 37C16.8 37 11 31.2 11 24C11 16.8 16.8 11 24 11C27.1 11 30 12.1 32.2 14L38.9 7.3C34.8 3.5 29.7 1.5 24 1.5C11.6 1.5 1.5 11.6 1.5 24C1.5 36.4 11.6 46.5 24 46.5C35 46.5 44.5 38.6 44.5 26.5C44.5 24.5 44.2 22.5 43.8 20.5L44.5 20Z" fill="white"/>
                        </svg>
                        <span className="font-extrabold text-white uppercase tracking-[0.15em] text-[11px] antialiased">
                          Login with Google
                        </span>
                     </div>
                   )}
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
    </div>
  );
}



