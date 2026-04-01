"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import { ShieldAlert, Globe, Zap, LogIn } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [isRegister, setIsRegister] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) return;

    setIsLoading(true);
    try {
      const endpoint = isRegister ? "/api/auth/register" : "/api/auth/login";
      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      
      if (data.success) {
        if (isRegister) {
          setIsRegister(false);
          alert("Operator onboarded. Please initiate connection.");
        } else {
          setTimeout(() => router.push("/dashboard"), 500);
        }
      } else {
        alert(data.message || "Access Denied");
      }
    } catch (error) {
      console.error("Auth failed", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center relative overflow-hidden bg-[#0a0c10] selection:bg-blue-500/30">
      {/* Dynamic Grid Background */}
      <div className="absolute inset-0 z-0 bg-[radial-gradient(circle_at_50%_50%,rgba(37,99,235,0.05),transparent_70%)]" />
      <div 
        className="absolute inset-0 z-0 opacity-[0.05]"
        style={{
          backgroundImage: `linear-gradient(#2563eb 0.5px, transparent 0.5px), linear-gradient(90deg, #2563eb 0.5px, transparent 0.5px)`,
          backgroundSize: "40px 40px",
        }}
      />

      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8 }}
        className="relative z-10 w-full max-w-lg mx-4"
      >
        <div className="bg-[#0f172a]/90 backdrop-blur-2xl rounded-[2.5rem] p-10 md:p-14 shadow-[0_0_80px_rgba(37,99,235,0.1)] border border-blue-500/20 relative overflow-hidden group">
          {/* Animated Border */}
          <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-blue-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />
          
          {/* Header */}
          <div className="text-center space-y-6 mb-12 relative z-10">
            <div className="relative inline-block">
               <motion.div
                 animate={{ rotate: 360 }}
                 transition={{ repeat: Infinity, duration: 20, ease: "linear" }}
                 className="absolute inset-0 bg-blue-500/10 blur-3xl rounded-full"
               />
               <ShieldAlert className="w-16 h-16 text-blue-500 relative z-10" />
            </div>
            
            <div className="space-y-2">
              <h1 className="text-4xl font-extrabold text-white tracking-tight">
                CrisisLens<span className="text-blue-500">AI</span>
              </h1>
              <p className="text-blue-400/60 font-bold uppercase tracking-[0.3em] text-[10px]">Neural Command Hub</p>
            </div>
          </div>

          <form onSubmit={handleAuth} className="w-full space-y-6 relative z-10">
              <div className="text-center space-y-2 mb-8">
                 <h2 className="text-xl font-bold text-white uppercase tracking-widest">{isRegister ? "Registration Mode" : "Operator Uplink"}</h2>
                 <p className="text-slate-500 text-sm">{isRegister ? "Onboarding new field agent to the grid." : "Secure identification required for access."}</p>
              </div>

              <div className="space-y-4">
                <div className="space-y-2">
                   <label className="text-[10px] font-black uppercase tracking-widest text-blue-400/80 ml-4">Terminal Identity</label>
                   <input 
                      type="email" 
                      placeholder="EMAIL_ADDRESS"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full h-14 bg-[#1e293b]/50 border border-blue-500/10 rounded-2xl px-6 text-white text-sm focus:outline-none focus:border-blue-500/50 transition-all placeholder:text-slate-600"
                      required
                   />
                </div>

                <div className="space-y-2">
                   <label className="text-[10px] font-black uppercase tracking-widest text-blue-400/80 ml-4">Access Key</label>
                   <input 
                      type="password" 
                      placeholder="SECURE_PASSPHRASE"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full h-14 bg-[#1e293b]/50 border border-blue-500/10 rounded-2xl px-6 text-white text-sm focus:outline-none focus:border-blue-500/50 transition-all placeholder:text-slate-600"
                      required
                   />
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full h-16 bg-blue-600 rounded-2xl flex items-center justify-center gap-4 hover:bg-blue-500 active:scale-[0.98] transition-all duration-300 shadow-[0_0_20px_rgba(37,99,235,0.2)] group relative overflow-hidden"
              >
                 {isLoading ? (
                   <div className="w-6 h-6 border-4 border-white/20 border-t-white rounded-full animate-spin" />
                 ) : (
                   <span className="font-black text-white uppercase tracking-[0.2em] text-xs">
                     {isRegister ? "Initiate Onboarding" : "Establish Connection"}
                   </span>
                 )}
                 {/* Internal FX */}
                 <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
              </button>

              <button
                type="button"
                onClick={() => setIsRegister(!isRegister)}
                className="w-full text-center text-slate-500 hover:text-blue-400 text-[10px] font-bold uppercase tracking-widest transition-colors"
              >
                {isRegister ? "Switch to Secure Login" : "Inscribe New identity"}
              </button>

              <div className="pt-8 border-t border-slate-800/50">
                <div className="flex items-center justify-center gap-8 opacity-30 text-white">
                   <div className="flex items-center gap-2">
                     <Globe className="w-3 h-3" />
                     <span className="text-[9px] font-black uppercase tracking-widest">Global Grid</span>
                   </div>
                   <div className="flex items-center gap-2">
                     <Zap className="w-3 h-3" />
                     <span className="text-[9px] font-black uppercase tracking-widest">Zero Latency</span>
                   </div>
                </div>
              </div>
          </form>
        </div>
      </motion.div>
    </div>
  );
}

