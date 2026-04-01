"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import { 
  ShieldCheck, 
  Search, 
  ArrowUpDown, 
  AlertOctagon, 
  Flame, 
  Activity, 
  Lock, 
  Mail, 
  Clock, 
  MapPin,
  ChevronRight,
  TrendingUp,
  AlertTriangle,
  CheckCircle2,
  History,
  BarChart3,
  LogIn,
  LogOut,
  Zap,
  Filter,
  Users
} from "lucide-react";
import { Button } from "@/components/ui/Button";

interface UnifiedActivity {
  id: string;
  email: string;
  action: 'LOGIN' | 'LOGOUT' | 'REPORT' | 'ANALYSIS';
  timestamp: number;
  data?: any;
}

export default function AdminDashboard() {
  const [logs, setLogs] = useState<UnifiedActivity[]>([]);
  const [reports, setReports] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'ALERTS' | 'AUDIT'>('ALERTS');
  const [filterUser, setFilterUser] = useState("");
  const [filterType, setFilterType] = useState("ALL");
  const [stats, setStats] = useState({ totalUsers: 0, totalReports: 0, criticalAlerts: 0, activeSessions: 0 });

  const fetchData = async () => {
    try {
      const [reportsRes, logsRes, statsRes] = await Promise.all([
        fetch('/api/reports'),
        fetch('/api/admin/logs'),
        fetch('/api/admin/stats')
      ]);
      const [reportsData, logsData, statsData] = await Promise.all([reportsRes.json(), logsRes.json(), statsRes.json()]);
      
      if (reportsData.success) setReports(reportsData.data);
      if (logsData.success) setLogs(logsData.data);
      if (statsData.success) setStats(statsData.data);
    } catch (err) {
      console.error("Failed to sync admin telemetry:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 10000);
    return () => clearInterval(interval);
  }, []);

  const resolveIncident = async (id: string) => {
    try {
      const res = await fetch('/api/reports', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, status: 'RESOLVED' })
      });
      if (res.ok) fetchData();
    } catch (err) {
      console.error("Failed to resolve:", err);
    }
  };

  const filteredLogs = logs
    .filter(log => !filterUser || log.email.toLowerCase().includes(filterUser.toLowerCase()))
    .filter(log => filterType === "ALL" || log.action === filterType);

  const filteredReports = reports.filter(r => r.status === 'ACTIVE');

  const chartData = [
     { label: "Fire", count: reports.filter(r => r.type.includes("Fire")).length, color: "bg-red-500" },
     { label: "Med", count: reports.filter(r => r.type.includes("Medical") || r.type.includes("Trauma")).length, color: "bg-blue-500" },
     { label: "Sec", count: reports.filter(r => r.type.includes("Security") || r.type.includes("Intrusion")).length, color: "bg-slate-800" },
     { label: "Logs", count: logs.length, color: "bg-slate-300" },
  ];
  const maxCount = Math.max(...chartData.map(d => d.count), 1);

  return (
    <div className="space-y-10 pb-20 max-w-7xl mx-auto flex flex-col lg:flex-row gap-8">
      
      {/* Primary Control Column */}
      <div className="flex-1 space-y-10">
        <header className="flex flex-col gap-10">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
             <div className="flex items-center gap-4">
                <div className="p-3 bg-blue-50 rounded-2xl border border-blue-100 shadow-sm relative">
                   <ShieldCheck className="w-8 h-8 text-blue-600 relative z-10" />
                   <div className="absolute inset-0 bg-blue-400/20 blur-xl animate-pulse rounded-full"></div>
                </div>
                <div>
                   <h1 className="text-3xl font-bold font-sans tracking-tight text-slate-900 uppercase">Nexus Command Hub</h1>
                   <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Restricted Access • Admin Priority Alpha</p>
                </div>
             </div>
             
             <div className="flex bg-slate-100 p-1.5 rounded-2xl gap-2">
                <button 
                  onClick={() => setActiveTab('ALERTS')}
                  className={`px-6 py-2.5 rounded-xl text-[10px] font-bold uppercase tracking-widest transition-all ${activeTab === 'ALERTS' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
                >
                   Live Alerts
                </button>
                <button 
                  onClick={() => setActiveTab('AUDIT')}
                  className={`px-6 py-2.5 rounded-xl text-[10px] font-bold uppercase tracking-widest transition-all ${activeTab === 'AUDIT' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
                >
                   Operation Audit
                </button>
             </div>
          </div>

          {/* Stats Summary Panel */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
             <div className="bg-white p-6 rounded-[2.5rem] border border-slate-100 shadow-xl shadow-blue-500/5 hover:border-blue-200 transition-all flex flex-col justify-between min-h-[140px]">
                <div className="flex items-center gap-2 text-blue-600">
                   <Users className="w-4 h-4" />
                   <span className="text-[10px] font-black uppercase tracking-widest">Total Nodes</span>
                </div>
                <p className="text-4xl font-black text-slate-900">{stats.totalUsers}</p>
             </div>
             <div className="bg-white p-6 rounded-[2.5rem] border border-slate-100 shadow-xl shadow-blue-500/5 hover:border-blue-200 transition-all flex flex-col justify-between min-h-[140px]">
                <div className="flex items-center gap-2 text-blue-600">
                   <TrendingUp className="w-4 h-4" />
                   <span className="text-[10px] font-black uppercase tracking-widest">All Telemetry</span>
                </div>
                <p className="text-4xl font-black text-slate-900">{stats.totalReports}</p>
             </div>
             <div className="bg-white p-6 rounded-[2.5rem] border border-red-50 shadow-xl shadow-red-500/5 hover:border-red-200 transition-all flex flex-col justify-between min-h-[140px] relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-20 h-20 bg-red-500/5 blur-2xl group-hover:opacity-100 opacity-50"></div>
                <div className="flex items-center gap-2 text-red-500">
                   <AlertOctagon className="w-4 h-4" />
                   <span className="text-[10px] font-black uppercase tracking-widest">Critical State</span>
                </div>
                <p className="text-4xl font-black text-red-600">{stats.criticalAlerts}</p>
             </div>
             <div className="bg-slate-900 p-6 rounded-[2.5rem] shadow-2xl relative overflow-hidden flex flex-col justify-between min-h-[140px] group transition-all hover:-translate-y-1">
                <div className="absolute top-0 right-0 w-24 h-24 bg-blue-600/10 blur-[50px] group-hover:opacity-100 opacity-50"></div>
                <div className="flex items-center gap-2 text-blue-400 font-black uppercase tracking-widest text-[10px]">
                   <Activity className="w-4 h-4" /> Command Link
                </div>
                <p className="text-4xl font-black text-white">{stats.activeSessions}</p>
             </div>
          </div>
        </header>

        {activeTab === 'ALERTS' ? (
          <div className="space-y-6">
             {/* Chart Overlay */}
             <div className="bg-white p-8 rounded-[3rem] border border-slate-50 shadow-xl shadow-blue-500/5">
                <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-8 flex items-center gap-2">
                    <BarChart3 className="w-4 h-4" /> Incident Profile Distribution
                </h3>
                <div className="flex items-end justify-between h-24 gap-6">
                   {chartData.map((d, i) => (
                     <div key={i} className="flex-1 flex flex-col items-center gap-3 group">
                        <motion.div 
                          initial={{ height: 0 }} 
                          animate={{ height: `${(d.count / maxCount) * 100}%` }} 
                          className={`w-full ${d.color} rounded-t-xl relative group-hover:brightness-110 transition-all shadow-sm`}
                        >
                           <div className="absolute -top-6 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity text-[10px] font-bold text-slate-900">{d.count}</div>
                        </motion.div>
                        <span className="text-[8px] font-black uppercase text-slate-400 tracking-tighter">{d.label}</span>
                     </div>
                   ))}
                </div>
             </div>

             <div className="grid grid-cols-1 gap-6">
                <AnimatePresence mode="popLayout">
                   {filteredReports.map((report) => (
                      <motion.div 
                        key={report.id}
                        layout
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        className={`group bg-white border border-slate-100 rounded-[2.5rem] p-8 flex flex-col md:flex-row items-center gap-8 transition-all hover:shadow-2xl hover:border-blue-100 ${report.severity === 'CRITICAL' ? 'border-red-100' : ''}`}
                      >
                         <div className={`w-16 h-16 rounded-[2rem] flex items-center justify-center shrink-0 shadow-inner ${report.severity === 'CRITICAL' ? 'bg-red-50 text-red-500' : 'bg-blue-50 text-blue-500'}`}>
                            {report.type.includes('Fire') ? <Flame className="w-8 h-8" /> : report.type.includes('Med') ? <Activity className="w-8 h-8" /> : <Lock className="w-8 h-8" />}
                         </div>
                         <div className="flex-1 space-y-2">
                            <div className="flex items-center gap-3">
                               <span className="text-sm font-bold text-slate-900 tracking-tight">{report.type}</span>
                               <span className={`text-[9px] font-black uppercase px-3 py-1 rounded-full ${report.severity === 'CRITICAL' ? 'bg-red-500 text-white shadow-lg shadow-red-500/20 animate-pulse' : 'bg-blue-50 text-blue-600 border border-blue-100'}`}>{report.severity}</span>
                            </div>
                            <p className="text-sm font-medium text-slate-500 line-clamp-1 opacity-70 italic font-sans leading-relaxed">"{report.description}"</p>
                            <div className="flex items-center gap-4 text-[10px] font-bold text-slate-300 uppercase tracking-tighter">
                               <span className="flex items-center gap-1.5"><Mail className="w-3.5 h-3.5 text-blue-400" /> {report.email}</span>
                               <span className="flex items-center gap-1.5"><MapPin className="w-3.5 h-3.5" /> {report.location}</span>
                            </div>
                         </div>
                         <div className="shrink-0">
                            <Button onClick={() => resolveIncident(report.id)} className="!h-14 !w-14 !p-0 !rounded-2xl !bg-slate-50 !text-slate-300 border border-slate-100 hover:!bg-emerald-500 hover:!text-white hover:!border-emerald-500 transition-all shadow-sm group">
                               <CheckCircle2 className="w-6 h-6 group-hover:scale-110 transition-transform" />
                            </Button>
                         </div>
                      </motion.div>
                   ))}
                </AnimatePresence>
             </div>
          </div>
        ) : (
          <div className="space-y-8">
             <div className="flex flex-col md:flex-row gap-6 bg-white/50 backdrop-blur-md p-6 rounded-[2.5rem] border border-slate-50 shadow-xl shadow-blue-500/5">
                <div className="flex-1 relative">
                   <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-300" />
                   <input 
                     type="text" 
                     placeholder="Filter by operator email..." 
                     className="w-full pl-14 pr-6 py-4 bg-white border border-slate-100 rounded-[1.5rem] text-[11px] font-bold uppercase tracking-widest focus:outline-none focus:ring-4 focus:ring-blue-500/5 focus:border-blue-400/50 transition-all shadow-inner"
                     value={filterUser}
                     onChange={(e) => setFilterUser(e.target.value)}
                   />
                </div>
                <div className="flex gap-2 bg-slate-50 p-1.5 rounded-[1.5rem] border border-slate-100 overflow-x-auto custom-scrollbar">
                   {["ALL", "LOGIN", "REPORT", "ANALYSIS", "LOGOUT"].map(t => (
                     <button 
                       key={t}
                       onClick={() => setFilterType(t)}
                       className={`px-5 py-2.5 rounded-2xl text-[9px] font-black uppercase tracking-[0.15em] transition-all whitespace-nowrap ${filterType === t ? 'bg-slate-900 text-white shadow-lg' : 'text-slate-400 hover:text-slate-600'}`}
                     >
                        {t}
                     </button>
                   ))}
                </div>
             </div>

             <div className="flex flex-col gap-4">
                <AnimatePresence mode="popLayout">
                   {filteredLogs.slice(0, 50).map((log) => (
                      <motion.div 
                        key={log.id}
                        layout
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="bg-white px-8 py-6 rounded-[2rem] border border-slate-50 flex items-center justify-between group hover:border-blue-200 transition-all shadow-xl shadow-blue-500/5"
                      >
                         <div className="flex items-center gap-8">
                            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 shadow-inner ${
                              log.action === 'LOGIN' ? 'bg-emerald-50 text-emerald-500' : 
                              log.action === 'LOGOUT' ? 'bg-red-50 text-red-500' :
                              log.action === 'REPORT' ? 'bg-blue-50 text-blue-600' : 'bg-slate-50 text-slate-500'}`}>
                               {log.action === 'LOGIN' ? <LogIn className="w-6 h-6" /> : 
                                log.action === 'LOGOUT' ? <LogOut className="w-6 h-6" /> :
                                log.action === 'REPORT' ? <AlertOctagon className="w-6 h-6" /> : <Zap className="w-6 h-6" />}
                            </div>
                            <div>
                               <div className="flex items-center gap-4">
                                  <span className="text-xs font-black text-slate-900 uppercase tracking-widest">{log.action} COMMAND</span>
                                  <span className="text-xs font-bold text-slate-400 font-sans border-l border-slate-100 pl-4">{log.email}</span>
                               </div>
                               <div className="flex items-center gap-2 mt-1 text-[10px] font-bold text-slate-300 uppercase tracking-tighter">
                                  <Clock className="w-3.5 h-3.5" /> {new Date(log.timestamp).toLocaleString()}
                               </div>
                            </div>
                         </div>
                         <div className="hidden lg:flex flex-col items-end gap-2">
                            {log.data && (
                               <div className="flex gap-2">
                                  {Object.keys(log.data).map(k => (
                                    <span key={k} className="text-[9px] font-black uppercase text-slate-400 bg-slate-50 px-3 py-1 rounded-full border border-slate-100">
                                       {k.replace('_', ' ')}: {typeof log.data[k] === 'object' ? '...' : log.data[k]}
                                    </span>
                                  ))}
                               </div>
                            )}
                         </div>
                      </motion.div>
                   ))}
                </AnimatePresence>
             </div>
          </div>
        )}
      </div>

      {/* Right Column: Active Statistics */}
      <div className="w-full lg:w-96 space-y-8">
         <div className="bg-white/50 backdrop-blur-3xl p-8 rounded-[3.5rem] border border-slate-50 shadow-2xl shadow-blue-500/5 space-y-10 group">
            <div>
               <h3 className="text-[11px] font-black uppercase tracking-[0.25em] text-slate-400 mb-8 flex items-center gap-3">
                  <TrendingUp className="w-5 h-5 text-emerald-500" /> System Integrity
               </h3>
               <div className="space-y-5">
                  <div className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-xl shadow-blue-500/5 group-hover:border-blue-200 transition-all">
                     <p className="text-[10px] font-black uppercase text-slate-300 tracking-widest mb-2">Authenticated Fleet</p>
                     <div className="flex items-baseline gap-2">
                        <p className="text-4xl font-black text-slate-900">{stats.totalUsers}</p>
                        <span className="text-[10px] font-bold text-slate-400 uppercase">NODES</span>
                     </div>
                  </div>
                  <div className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-xl shadow-blue-500/5 group-hover:border-blue-200 transition-all">
                     <p className="text-[10px] font-black uppercase text-slate-300 tracking-widest mb-2">Active AI Link</p>
                     <div className="flex items-center gap-3 text-blue-600 bg-blue-50/50 px-4 py-3 rounded-2xl border border-blue-100">
                        <Zap className="w-5 h-5 animate-pulse" />
                        <span className="text-xs font-black uppercase tracking-tight">GEMINI-1.5-FLASH</span>
                     </div>
                  </div>
               </div>
            </div>

            <div>
               <h3 className="text-[11px] font-black uppercase tracking-[0.25em] text-slate-400 mb-8 flex items-center gap-3">
                  <History className="w-5 h-5 text-blue-500" /> Live Audit Stream
               </h3>
               <div className="space-y-5 max-h-[450px] overflow-y-auto pr-3 custom-scrollbar">
                  {logs.slice(0, 15).map((l, i) => (
                    <div key={i} className="flex items-center gap-4 group/item">
                       <div className={`w-3 h-3 rounded-full border-2 border-white shadow-sm shrink-0 ${l.action === 'LOGIN' ? 'bg-emerald-500' : l.action === 'LOGOUT' ? 'bg-red-500' : 'bg-blue-500'}`} />
                       <div className="min-w-0 flex-1">
                          <p className="text-xs font-bold text-slate-800 truncate group-hover/item:text-blue-600 transition-colors">{l.email}</p>
                          <p className="text-[9px] font-bold text-slate-400 uppercase tracking-tighter">{l.action} COMMAND • {new Date(l.timestamp).toLocaleTimeString()}</p>
                       </div>
                    </div>
                  ))}
               </div>
            </div>
         </div>
      </div>

      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #e2e8f0; border-radius: 10px; }
      `}</style>
    </div>
  );
}
