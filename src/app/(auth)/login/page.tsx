"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { ShieldAlert, Globe, Zap, LogIn } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleGoogleLogin = async () => {
    // Simulated Identity Extraction (Bypassing NextAuth)
    const email = window.prompt("SECURE UPLINK: Enter operator email:");
    if (!email) return;

    setIsLoading(true);
    try {
      const res = await fetch("/api/auth/demo", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      
      if (data.success) {
        setTimeout(() => router.push("/dashboard"), 1000);
      } else {
        alert(data.message || "Uplink Denied");
      }
    } catch (error) {
      console.error("Sign-in failed", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center relative overflow-hidden bg-transparent selection:bg-blue-100">
      {/* Pattern Overlay */}
      <div 
        className="absolute inset-0 z-0 opacity-[0.03]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='30' height='30' viewBox='0 0 30 30' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M15 0l12.99 7.5v15L15 30 2.01 22.5V7.5L15 0z' fill='%232563eb' fill-opacity='1' fill-rule='evenodd'/%3E%3C/svg%3E")`,
          backgroundSize: "30px 30px",
        }}
      />

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="relative z-10 w-full max-w-lg mx-4"
      >
        <div className="bg-white/80 backdrop-blur-3xl rounded-[3rem] p-10 md:p-14 shadow-[0_32px_64px_-16px_rgba(37,99,235,0.12)] border border-white relative min-h-[500px] flex flex-col items-center justify-center">
          
          {/* Header */}
          <div className="text-center space-y-6 mb-12">
            <div className="relative inline-block">
               <motion.div
                 animate={{ rotate: 360 }}
                 transition={{ repeat: Infinity, duration: 20, ease: "linear" }}
                 className="absolute inset-0 bg-blue-600/5 blur-2xl rounded-full"
               />
               <ShieldAlert className="w-16 h-16 text-blue-600 relative z-10" />
            </div>
            
            <div className="space-y-2">
              <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight flex items-center justify-center gap-2">
                CrisisLens<span className="text-blue-600">AI</span>
              </h1>
              <p className="text-slate-400 font-bold uppercase tracking-[0.25em] text-[11px]">Neural Command Interface</p>
            </div>
          </div>

          <div className="w-full space-y-8">
             <div className="text-center space-y-2">
                <h2 className="text-xl font-bold text-slate-800">Operational Authentication</h2>
                <p className="text-slate-500 text-sm">Secure authorization required for grid uplink.</p>
             </div>

             <button
               onClick={handleGoogleLogin}
               disabled={isLoading}
               className="w-full h-16 bg-slate-900 border border-blue-500/30 rounded-3xl flex items-center justify-center gap-4 hover:bg-slate-800 hover:border-blue-400 active:scale-[0.98] transition-all duration-300 shadow-[0_0_20px_rgba(37,99,235,0.15)] hover:shadow-[0_0_40px_rgba(37,99,235,0.4)] group relative overflow-hidden"
             >
                {isLoading ? (
                  <div className="w-6 h-6 border-4 border-slate-700 border-t-blue-500 rounded-full animate-spin" />
                ) : (
                  <>
                    <div className="p-1 bg-white rounded-full shadow-[0_0_10px_rgba(255,255,255,0.5)]">
                      <Image src="https://www.google.com/favicon.ico" alt="Google" width={18} height={18} />
                    </div>
                    <span className="font-bold text-white uppercase tracking-[0.2em] text-[11px] text-shadow-sm">Login with Google</span>
                  </>
                )}
                {/* Ambient Glow & Scanline Effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-blue-600/0 via-blue-500/10 to-blue-600/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <div className="absolute bottom-0 inset-x-0 h-[2px] bg-gradient-to-r from-transparent via-blue-400 to-transparent opacity-50 group-hover:opacity-100 transition-opacity duration-500 shadow-[0_0_10px_rgba(96,165,250,0.8)]"></div>
             </button>

             <div className="pt-8 border-t border-slate-100">
               <div className="flex items-center justify-center gap-8 opacity-20">
                  <div className="flex items-center gap-2">
                    <Globe className="w-4 h-4" />
                    <span className="text-[10px] font-black uppercase tracking-widest">Global Link</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Zap className="w-4 h-4" />
                    <span className="text-[10px] font-black uppercase tracking-widest">Zero Latency</span>
                  </div>
               </div>
             </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
