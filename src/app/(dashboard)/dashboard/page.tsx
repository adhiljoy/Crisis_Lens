"use client";

import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { 
  AlertCircle, 
  Plus, 
  History, 
  CheckCircle, 
  Clock, 
  MapPin, 
  Activity,
  ArrowRight
} from "lucide-react";
import Link from "next/link";
import { useSession } from "@/hooks/useSession";
import { Button } from "@/components/ui/Button";

interface Report {
  id: string;
  type: string;
  severity: string;
  status: string;
  location: string;
  time: string;
  description: string;
  riskLevel: number;
}

export default function UserDashboard() {
  const { session } = useSession();
  const [reports, setReports] = useState<Report[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchMyReports() {
      try {
        const res = await fetch('/api/reports');
        const data = await res.json();
        if (data.success) {
          setReports(data.data);
        }
      } catch (err) {
        console.error("Failed to fetch reports:", err);
      } finally {
        setIsLoading(false);
      }
    }
    fetchMyReports();
  }, []);

  const activeReports = reports.filter(r => r.status === 'ACTIVE');
  const resolvedCount = reports.filter(r => r.status === 'RESOLVED').length;

  return (
    <div className="max-w-6xl mx-auto space-y-12 pb-20">
      
      {/* Hero Welcome */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col md:flex-row md:items-center justify-between gap-8 pt-6"
      >
        <div className="space-y-2">
           <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight flex items-center gap-4">
              <span className="w-2 h-10 bg-blue-600 rounded-full"></span>
              Personal Intelligence Terminal
           </h1>
           <div className="flex items-center gap-6 mt-1 ml-6">
              <p className="text-slate-400 font-medium font-sans italic">{session?.email}</p>
              <div className="flex items-center gap-2 px-3 py-1 bg-blue-50 border border-blue-100 rounded-full shadow-sm">
                <div className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-pulse"></div>
                <span className="text-[10px] font-bold text-blue-600 uppercase tracking-widest">{session?.role} Auth</span>
              </div>
           </div>
        </div>

        <Link href="/report">
          <motion.button 
             whileHover={{ scale: 1.02 }}
             whileTap={{ scale: 0.98 }}
             className="px-8 py-5 bg-blue-600 text-white rounded-[1.5rem] font-bold uppercase tracking-widest text-xs flex items-center gap-3 shadow-2xl shadow-blue-600/30 group"
          >
             <Plus className="w-5 h-5 group-hover:rotate-90 transition-transform duration-300" />
             Issue New Report
          </motion.button>
        </Link>
      </motion.div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
         <div className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-xl shadow-blue-900/5 relative overflow-hidden group">
            <h3 className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-4 flex items-center gap-2">
              <Activity className="w-4 h-4 text-blue-500" /> Active Streams
            </h3>
            <p className="text-4xl font-black text-slate-900 font-sans">{activeReports.length}</p>
            <p className="text-[10px] font-bold text-slate-300 uppercase mt-2 tracking-tighter">Live crisis telemetry currently reporting</p>
         </div>

         <div className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-xl shadow-blue-900/5 relative overflow-hidden group">
            <h3 className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-4 flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-emerald-500" /> Resolved Tasks
            </h3>
            <p className="text-4xl font-black text-slate-900 font-sans">{resolvedCount}</p>
            <p className="text-[10px] font-bold text-slate-300 uppercase mt-2 tracking-tighter">Incidents neutralized via triage</p>
         </div>

         <div className="bg-slate-900 p-8 rounded-[2.5rem] shadow-2xl shadow-blue-900/10 flex items-center justify-between group overflow-hidden relative">
            <div className="absolute inset-0 bg-blue-600/10 blur-[100px] opacity-0 group-hover:opacity-100 transition-opacity"></div>
            <div className="relative z-10">
               <h3 className="text-[10px] font-bold uppercase tracking-widest text-blue-400 mb-2">System Status</h3>
               <p className="text-xl font-bold text-white uppercase tracking-tight">OPERATIONAL</p>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center border border-white/10 group-hover:bg-blue-600 transition-all">
               <Clock className="w-6 h-6 text-blue-500 group-hover:text-white" />
            </div>
         </div>
      </div>

      {/* Personal History */}
      <div className="space-y-8 pt-8">
        <div className="flex items-center justify-between border-b border-slate-50 pb-6">
           <h2 className="text-[12px] font-black uppercase tracking-[0.25em] text-slate-400 flex items-center gap-3">
              <History className="w-5 h-5" /> Recent Intelligence Transmissions
           </h2>
           <Link href="/report" className="text-[10px] font-bold text-blue-600 hover:tracking-[0.1em] transition-all uppercase flex items-center gap-2">
              View Log History <ArrowRight className="w-3 h-3" />
           </Link>
        </div>

        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-20 space-y-4">
             <div className="w-10 h-10 border-4 border-blue-50 border-t-blue-600 rounded-full animate-spin"></div>
             <p className="text-slate-300 font-bold text-[10px] uppercase tracking-widest">Compiling Terminal Data...</p>
          </div>
        ) : reports.length === 0 ? (
          <div className="bg-slate-50/50 p-20 rounded-[3rem] border-2 border-dashed border-slate-100 flex flex-col items-center justify-center text-center space-y-6">
             <div className="w-20 h-20 rounded-full bg-white flex items-center justify-center shadow-inner border border-slate-100">
                <AlertCircle className="w-10 h-10 text-slate-200" />
             </div>
             <div className="space-y-2">
                <h3 className="text-2xl font-bold text-slate-900 font-sans tracking-tight">No Active Transmissions Found</h3>
                <p className="text-slate-400 font-medium max-w-sm mx-auto text-sm">Your telemetry log is currently empty. Initiate a new report to populate your grid intelligence.</p>
             </div>
             <Link href="/report">
               <Button className="!rounded-2xl !px-10">Start First Uplink</Button>
             </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
             {reports.map((report, i) => (
               <motion.div
                 key={report.id}
                 initial={{ opacity: 0, y: 10 }}
                 animate={{ opacity: 1, y: 0 }}
                 transition={{ delay: i * 0.05 }}
                 className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-xl shadow-blue-900/5 hover:border-blue-200 transition-all group overflow-hidden relative"
               >
                 <div className="flex justify-between items-start mb-6">
                    <div className="space-y-1">
                       <span className="text-[10px] font-bold text-slate-300 uppercase tracking-tighter">ID: {report.id}</span>
                       <h4 className="text-lg font-bold text-slate-900 tracking-tight">{report.type}</h4>
                    </div>
                    <div className={`px-4 py-1.5 rounded-2xl text-[10px] font-bold uppercase tracking-widest border
                      ${report.severity === 'CRITICAL' ? 'bg-red-50 text-red-600 border-red-100' : 'bg-blue-50 text-blue-600 border-blue-100'}
                    `}>
                      {report.severity}
                    </div>
                 </div>

                 <div className="space-y-6">
                    <p className="text-sm font-medium text-slate-500 leading-relaxed font-sans line-clamp-2 italic">"{report.description}"</p>
                    
                    <div className="flex items-center justify-between border-t border-slate-50 pt-6">
                       <div className="flex items-center gap-6">
                          <div className="flex items-center gap-1.5">
                             <MapPin className="w-3.5 h-3.5 text-blue-500" />
                             <span className="text-[10px] font-bold uppercase text-slate-400">{report.location}</span>
                          </div>
                          <div className="flex items-center gap-1.5">
                             <Clock className="w-3.5 h-3.5 text-slate-300" />
                             <span className="text-[10px] font-bold uppercase text-slate-400">{report.time}</span>
                          </div>
                       </div>
                       
                       <div className={`w-3 h-3 rounded-full ${report.status === 'ACTIVE' ? 'bg-blue-500 animate-pulse' : 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.4)]'}`}></div>
                    </div>
                 </div>

                 {/* Subtle decorative glow */}
                 <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-blue-50 rounded-full blur-[60px] opacity-0 group-hover:opacity-100 transition-opacity"></div>
               </motion.div>
             ))}
          </div>
        )}
      </div>

    </div>
  );
}
