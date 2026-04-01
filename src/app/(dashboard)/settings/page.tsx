"use client";

import { motion } from "framer-motion";
import { 
  Settings as SettingsIcon, 
  User, 
  Bell, 
  Shield, 
  Database, 
  Globe, 
  Cpu, 
  Lock,
  ChevronRight,
  Zap,
  Activity,
  LogOut
} from "lucide-react";
import { useSession } from "@/hooks/useSession";
import { Button } from "@/components/ui/Button";

export default function SettingsPage() {
  const { session } = useSession();

  const settingsGroups = [
    {
      title: "Identity & Profile",
      icon: User,
      items: [
        { label: "Display Email", value: session?.email || "operator@nexus.core", type: "text" },
        { label: "Operational Role", value: session?.role || "USER", badge: true },
        { label: "Nexus Node ID", value: session?.userId?.substring(0, 8) || "NXS-000", type: "text" }
      ]
    },
    {
      title: "Security Protocols",
      icon: Shield,
      items: [
        { label: "Multi-Factor Authentication", value: "ENABLED", color: "text-emerald-500" },
        { label: "Session Encryption", value: "AES-256-GCM", color: "text-blue-500" },
        { label: "Handshake Timeout", value: "5 Minutes" }
      ]
    },
    {
      title: "System Telemetry",
      icon: Activity,
      items: [
        { label: "AI Engine", value: "GEMINI-1.5-FLASH", color: "text-blue-600" },
        { label: "Network Latency", value: "14ms", color: "text-emerald-500" },
        { label: "Core Integrity", value: "100%", color: "text-emerald-600" }
      ]
    }
  ];

  return (
    <div className="max-w-5xl mx-auto space-y-10 pb-20">
      <header className="flex items-center justify-between border-b border-slate-200 pb-8">
        <div>
           <h1 className="text-3xl font-bold font-sans tracking-tight text-slate-900 uppercase flex items-center gap-4">
             <div className="p-3 bg-blue-50 rounded-2xl shadow-sm border border-blue-100">
                <SettingsIcon className="w-8 h-8 text-blue-600" /> 
             </div>
             System Configuration
           </h1>
           <p className="text-slate-500 font-sans font-medium text-sm mt-4 ml-2 uppercase tracking-widest text-[10px]">Adjust neural parameters and identity credentials.</p>
        </div>
        
        <div className="flex items-center gap-4">
           <div className="px-5 py-2 bg-slate-900 rounded-2xl shadow-xl flex items-center gap-3">
              <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.8)]"></div>
              <span className="text-[10px] font-black text-white uppercase tracking-widest">System Online</span>
           </div>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
         
         {/* Sidebar Navigation */}
         <div className="lg:col-span-4 space-y-4">
            {["Profile", "Security", "Notifications", "Data", "Appearance"].map((item, i) => (
              <button 
                key={item}
                className={`w-full flex items-center justify-between p-5 rounded-[1.5rem] transition-all group ${i === 0 ? 'bg-white shadow-xl shadow-blue-500/5 border border-blue-100 text-blue-600' : 'text-slate-400 hover:bg-white/50 hover:text-slate-600'}`}
              >
                 <span className="text-[11px] font-black uppercase tracking-[0.15em]">{item}</span>
                 <ChevronRight className={`w-4 h-4 transition-transform ${i === 0 ? 'translate-x-0' : '-translate-x-2 opacity-0 group-hover:translate-x-0 group-hover:opacity-100'}`} />
              </button>
            ))}
            
            <div className="pt-10">
               <div className="bg-gradient-to-br from-slate-900 to-slate-800 p-8 rounded-[2.5rem] shadow-2xl relative overflow-hidden group">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-blue-600/20 blur-3xl group-hover:opacity-100 opacity-50 transition-opacity"></div>
                  <Cpu className="w-10 h-10 text-blue-400 mb-6 relative z-10" />
                  <h4 className="text-white font-bold text-sm mb-2 relative z-10">Nexus Core V2.4</h4>
                  <p className="text-slate-400 text-[10px] uppercase font-bold tracking-widest leading-relaxed relative z-10">Enterprise Intelligence Node • Stable Channel Alpha-1</p>
               </div>
            </div>
         </div>

         {/* Settings Content */}
         <div className="lg:col-span-8 space-y-10">
            {settingsGroups.map((group, idx) => (
               <motion.div 
                 key={group.title}
                 initial={{ opacity: 0, y: 20 }}
                 animate={{ opacity: 1, y: 0 }}
                 transition={{ delay: idx * 0.1 }}
                 className="bg-white rounded-[2.5rem] p-8 border border-slate-50 shadow-xl shadow-blue-900/5 space-y-8"
               >
                  <div className="flex items-center gap-4 border-b border-slate-50 pb-6">
                     <div className="p-2.5 bg-blue-50 rounded-xl">
                        <group.icon className="w-5 h-5 text-blue-600" />
                     </div>
                     <h3 className="text-sm font-black uppercase tracking-widest text-slate-900">{group.title}</h3>
                  </div>

                  <div className="space-y-6">
                     {group.items.map((item: any) => (
                        <div key={item.label} className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-4 rounded-2xl hover:bg-slate-50 transition-colors group">
                           <div>
                              <p className="text-[10px] uppercase font-black text-slate-400 tracking-widest mb-1">{item.label}</p>
                              <p className={`text-sm font-bold font-sans ${item.color || 'text-slate-600'}`}>
                                 {item.value}
                              </p>
                           </div>
                           {item.badge ? (
                              <span className="px-4 py-1.5 bg-blue-600 text-white text-[9px] font-black uppercase rounded-full shadow-lg shadow-blue-600/20">
                                 {item.value} Authority
                              </span>
                           ) : (
                              <button className="text-[10px] font-black uppercase text-blue-600 hover:text-blue-700 transition-colors tracking-widest opacity-0 group-hover:opacity-100">
                                 Modify Parameter
                              </button>
                           )}
                        </div>
                     ))}
                  </div>
               </motion.div>
            ))}

            <div className="bg-red-50/50 p-8 rounded-[2.5rem] border border-red-100 flex items-center justify-between group">
               <div className="flex items-center gap-6">
                  <div className="p-4 bg-red-100 rounded-2xl text-red-600">
                     <Lock className="w-6 h-6" />
                  </div>
                  <div>
                     <h4 className="text-sm font-black uppercase text-red-600 tracking-widest">Terminate Linkage</h4>
                     <p className="text-[11px] font-bold text-slate-400 mt-1">Disconnect current terminal and clear session encryption keys.</p>
                  </div>
               </div>
               <Button className="!bg-red-600 hover:!bg-red-700 text-white !rounded-xl shadow-lg shadow-red-600/20">
                  Disconnect
               </Button>
            </div>
         </div>

      </div>
    </div>
  );
}
