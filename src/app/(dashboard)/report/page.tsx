"use client";

import { motion, Variants } from "framer-motion";
import { useState, useRef } from "react";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { Send, Upload, Crosshair, MapPin, Zap, AlertOctagon, Activity, X } from "lucide-react";
import Image from "next/image";

interface AnalysisResult {
  type: string;
  risk: string;
  confidence: number;
  actions: string[];
}

export default function ReportIncidentPage() {
  const [step, setStep] = useState(1);
  const [description, setDescription] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  
  // Image Upload State
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedFile(null);
    setImagePreview(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (step === 1) {
      setStep(2);
      setIsAnalyzing(true);
      setResult(null); // Clear previous results
      
      try {
        const res = await fetch("/api/analyze", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ 
            description,
            image: imagePreview 
          })
        });
        const data = await res.json();
        if (data.success) {
          setResult(data.data);
          // Only set optimisticAlert for simulation in Dashboard
          sessionStorage.setItem('optimisticAlert', JSON.stringify({ ...data.data, isNew: true, isOptimistic: true }));
        }
      } catch {
        console.error("AI Analysis failed");
      } finally {
        setIsAnalyzing(false);
      }
    }
  };

  const resetForm = () => {
    setStep(1);
    setDescription("");
    setSelectedFile(null);
    setImagePreview(null);
    setResult(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const container: Variants = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.1 } }
  };
  const item: Variants = {
    hidden: { opacity: 0, y: 15 },
    show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" } }
  };

  const runDemo = async () => {
     setDescription("Critical fire detected in central operations hub. Immediate evacuation initiated. Requesting fire suppression and emergency medical support.");
     setStep(2);
     setIsAnalyzing(true);
     setResult(null);

     // Triggering AI with the demo data
     try {
        const res = await fetch("/api/analyze", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ 
            description: "Critical fire detected in central operations hub. Immediate evacuation initiated. Requesting fire suppression and emergency medical support.",
            image: null 
          })
        });
        const data = await res.json();
        if (data.success) {
           setResult(data.data);
           sessionStorage.setItem('optimisticAlert', JSON.stringify({ ...data.data, isNew: true, isOptimistic: true }));
        }
     } catch (err) {
        console.error("Demo Simulation Failed:", err);
     } finally {
        setIsAnalyzing(false);
     }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-10 pb-20">
      <header className="border-b border-slate-200 pb-8 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
           <h1 className="text-3xl font-bold font-sans tracking-tight text-slate-900 uppercase flex items-center gap-4">
             <div className="p-3 bg-red-50 rounded-2xl shadow-sm border border-red-100">
                <AlertOctagon className="w-8 h-8 text-red-600" /> 
             </div>
             Submit Incident Report
           </h1>
           <p className="text-slate-500 font-sans font-medium text-sm mt-4 ml-2 max-w-lg">Uplink data to AI Nexus for immediate risk assessment and strategic response.</p>
        </div>

        <button 
          onClick={runDemo}
          className="px-6 py-3 bg-gradient-to-r from-blue-600 to-cyan-500 text-white rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] shadow-xl shadow-blue-500/20 hover:scale-[1.03] active:scale-[0.97] transition-all flex items-center gap-3 group border border-white/20"
        >
          <Zap className="w-4 h-4 group-hover:animate-pulse" />
          Demo Simulation
        </button>
      </header>

      <motion.div variants={container} initial="hidden" animate="show" className="grid grid-cols-1 lg:grid-cols-5 gap-8">
        
        {/* Left Side: Form */}
        <motion.div variants={item} className="lg:col-span-3 bg-white p-8 space-y-8 self-start relative shadow-2xl shadow-blue-900/5 border border-slate-100 rounded-[2.5rem]">
          <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/5 blur-[60px] rounded-full -z-10"></div>
          
          <form onSubmit={handleSubmit} className="space-y-8 relative z-10">
            <div className="space-y-3">
              <label className="text-[10px] uppercase tracking-[0.15em] text-slate-400 font-bold flex gap-2 items-center ml-1">
                 <Crosshair className="w-4 h-4 text-blue-500" />
                 Target Coordinates
              </label>
              <div className="relative">
                <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-blue-400" />
                <Input placeholder="LAT 42.3601 • LON -71.0589 (Auto-detecting...)" className="pl-12 bg-slate-50 border-slate-100 font-semibold" disabled />
              </div>
            </div>

            <div className="space-y-3">
              <label className="text-[10px] uppercase tracking-[0.15em] text-slate-400 font-bold flex gap-2 items-center ml-1">
                  <Zap className="w-4 h-4 text-orange-500" />
                  Incident Log
              </label>
              <div className="relative group">
                <div className="absolute -inset-1 bg-blue-500/5 rounded-[2rem] blur opacity-0 group-focus-within:opacity-100 transition duration-500"></div>
                <textarea 
                  className="relative w-full h-40 rounded-[1.5rem] border border-slate-100 bg-slate-50 p-5 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-4 focus:ring-blue-500/5 focus:border-blue-500/50 focus:bg-white resize-none font-sans font-medium transition-all shadow-sm"
                  placeholder="Describe the emergency in detail. AI requires clear context for accuracy."
                  required
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  disabled={step > 1}
                />
              </div>
            </div>

            <div className="space-y-3">
               <label className="text-[10px] uppercase tracking-[0.15em] text-slate-400 font-bold flex gap-2 items-center ml-1">
                  <Upload className="w-4 h-4 text-emerald-500" />
                  Visual Telemetry
              </label>
              
              <input 
                type="file" 
                ref={fileInputRef} 
                className="hidden" 
                accept="image/jpeg,image/png,image/webp" 
                onChange={handleImageChange}
              />

              <div 
                onClick={triggerFileInput}
                className={`border-2 border-dashed transition-all p-4 rounded-[2rem] flex flex-col items-center justify-center cursor-pointer relative overflow-hidden group min-h-[180px]
                  ${imagePreview ? 'border-blue-500/50 bg-blue-50/10' : 'border-slate-100 bg-slate-50 hover:border-blue-500/30 hover:bg-blue-50/50'}
                `}
              >
                 {imagePreview ? (
                   <div className="relative w-full h-48 rounded-2xl overflow-hidden shadow-lg border border-white/50 animate-in fade-in zoom-in duration-500">
                     <Image src={imagePreview} alt="Preview" fill className="object-cover" />
                     <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end justify-center pb-4">
                        <span className="text-white text-[10px] font-bold uppercase tracking-widest bg-blue-600 px-3 py-1 rounded-full">Replace Image</span>
                     </div>
                     <button 
                       onClick={removeImage}
                       className="absolute top-3 right-3 p-2 bg-red-500 text-white rounded-full shadow-lg hover:bg-red-600 transition-colors z-20"
                     >
                       <X className="w-4 h-4" />
                     </button>
                   </div>
                 ) : (
                   <>
                     <Upload className="w-10 h-10 text-slate-300 group-hover:text-blue-500 mb-4 transition-all duration-300" />
                     <span className="text-xs font-bold uppercase text-slate-400 tracking-widest text-center group-hover:text-blue-600 transition-colors duration-300">
                       Drag & Drop or Click to Uplink
                     </span>
                     <span className="text-[10px] uppercase font-bold text-slate-300 mt-2 tracking-tighter">.JPG, .PNG, .WEBP • MAX 128MB</span>
                     {/* Scan line effect */}
                     <div className="absolute top-0 left-0 w-full h-1 bg-blue-500 opacity-0 group-hover:opacity-100 group-hover:animate-scan shadow-[0_0_15px_rgba(37,99,235,0.4)]"></div>
                   </>
                 )}
              </div>
            </div>

            {step === 1 && (
              <Button type="submit" className="w-full py-7 text-base rounded-[1.5rem] shadow-xl shadow-blue-500/20 ripple-btn group">
                <Send className="w-5 h-5 mr-3 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" /> 
                Transmit to AI Nexus
              </Button>
            )}
          </form>
        </motion.div>

        {/* Right Side: AI Analysis Panel */}
        <motion.div variants={item} className="lg:col-span-2 flex flex-col space-y-4">
          <div className="bg-white p-8 border border-slate-100 rounded-[2.5rem] shadow-2xl shadow-blue-900/5 relative flex-1 min-h-[450px] flex flex-col">
            <div className="relative z-10 flex-1 flex flex-col">
              <h3 className="text-[10px] font-bold tracking-[0.2em] uppercase text-blue-600 mb-8 flex items-center justify-between border-b border-slate-50 pb-4">
                 <span>AI Assessment</span>
                 {isAnalyzing && (
                   <span className="flex items-center gap-2 text-blue-500">
                     <span className="flex items-center font-bold">
                       PROCESSING
                       <motion.span animate={{ opacity: [0, 1, 0] }} transition={{ repeat: Infinity, duration: 1, ease: "easeInOut", times: [0, 0.5, 1] }}>.</motion.span>
                       <motion.span animate={{ opacity: [0, 1, 0] }} transition={{ repeat: Infinity, duration: 1, ease: "easeInOut", times: [0.2, 0.7, 1] }}>.</motion.span>
                       <motion.span animate={{ opacity: [0, 1, 0] }} transition={{ repeat: Infinity, duration: 1, ease: "easeInOut", times: [0.4, 0.9, 1] }}>.</motion.span>
                     </span>
                   </span>
                 )}
              </h3>

            {step === 1 && (
              <div className="flex-1 flex flex-col items-center justify-center space-y-4">
                 <div className="w-16 h-16 rounded-full bg-slate-50 flex items-center justify-center border border-slate-100 shadow-inner">
                    <Activity className="w-6 h-6 text-slate-300" />
                 </div>
                 <p className="text-slate-300 font-bold text-[10px] uppercase tracking-[0.2em] text-center max-w-[200px]">
                    Neural Engine Ready. Waiting for primary data uplink.
                 </p>
              </div>
            )}

            {step === 2 && isAnalyzing && (
              <div className="flex-1 flex flex-col items-center justify-center space-y-8">
                 <div className="relative">
                    <div className="w-24 h-24 rounded-full border-[6px] border-blue-50 border-t-blue-600 animate-spin" style={{ animationDuration: '1s' }}></div>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <Zap className="w-8 h-8 text-blue-600 animate-pulse" />
                    </div>
                 </div>
                 
                 <div className="w-full max-w-[200px] space-y-4">
                   <div className="bg-slate-100 h-2 rounded-full overflow-hidden">
                     <motion.div 
                       initial={{ width: "0%" }}
                       animate={{ width: "100%" }}
                       transition={{ duration: 3, ease: "linear" }}
                       className="h-full bg-blue-600 shadow-sm shadow-blue-500/30"
                     />
                   </div>
                   <p className="text-center text-slate-400 font-bold text-[9px] uppercase tracking-widest animate-pulse">Analyzing incident vectors...</p>
                 </div>
              </div>
            )}

            {step === 2 && !result && !isAnalyzing && (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex-1 flex flex-col items-center justify-center space-y-6"
              >
                 <div className="relative">
                    <div className="absolute inset-0 bg-red-500/20 blur-2xl rounded-full animate-pulse"></div>
                    <div className="w-16 h-16 rounded-full bg-red-50 flex items-center justify-center border border-red-100 relative z-10">
                       <AlertOctagon className="w-6 h-6 text-red-500" />
                    </div>
                 </div>
                 <div className="text-center space-y-1">
                    <p className="text-red-600 font-bold text-[10px] uppercase tracking-[0.2em]">Neural Uplink Failure</p>
                    <p className="text-slate-400 text-[9px] font-medium max-w-[200px]">AI Nexus is currently unreachable. Check your network or API configuration.</p>
                 </div>
                 <Button 
                   onClick={() => setStep(1)} 
                   variant="outline" 
                   className="h-10 px-6 rounded-xl border-slate-200 text-slate-500 hover:text-blue-600 hover:bg-blue-50 transition-all font-bold text-[9px] uppercase tracking-widest"
                 >
                   Return to Terminal
                 </Button>
              </motion.div>
            )}

            {step === 2 && result && !isAnalyzing && (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="space-y-8 flex-1"
              >
                <div className="grid grid-cols-1 gap-4">
                  <div className="p-6 bg-red-50 border border-red-100 rounded-3xl relative overflow-hidden group hover:shadow-lg hover:shadow-red-500/5 transition-all duration-500">
                    <div className="absolute top-0 left-0 w-1.5 h-full bg-red-500"></div>
                    <h4 className="text-[10px] uppercase tracking-widest text-slate-400 font-bold mb-2">Threat Magnitude</h4>
                    <p className="text-2xl font-bold font-sans text-red-600 flex items-center gap-3">
                       {result.risk} <AlertOctagon className="w-6 h-6" />
                    </p>
                  </div>
                  <div className="p-6 bg-blue-50 border border-blue-100 rounded-3xl relative overflow-hidden group hover:shadow-lg hover:shadow-blue-500/5 transition-all duration-500">
                    <div className="absolute top-0 left-0 w-1.5 h-full bg-blue-600"></div>
                    <h4 className="text-[10px] uppercase tracking-widest text-slate-400 font-bold mb-2">Detected Scenario</h4>
                    <p className="text-xl font-bold font-sans text-blue-600 truncate">
                       {result.type}
                    </p>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex justify-between items-end mb-2">
                    <h4 className="text-[10px] uppercase tracking-[0.2em] text-slate-400 font-bold">Confidence Telemetry</h4>
                    <span className="text-sm font-bold font-sans text-blue-600">{result.confidence}%</span>
                  </div>
                  <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden relative">
                    <motion.div 
                      className="h-full bg-blue-600 shadow-sm shadow-blue-500/20"
                      initial={{ width: 0 }}
                      animate={{ width: `${result.confidence}%` }}
                      transition={{ duration: 1.5, ease: "easeInOut", delay: 0.3 }}
                    />
                  </div>
                </div>

                <div className="space-y-4 pt-6 mt-6 border-t border-slate-50">
                   <h4 className="text-[10px] uppercase tracking-[0.2em] text-slate-400 font-bold">Priority Countermeasures</h4>
                   <ul className="space-y-3">
                     {result.actions.map((action: string, i: number) => (
                       <motion.li 
                         key={i}
                         initial={{ opacity: 0, x: -10 }}
                         animate={{ opacity: 1, x: 0 }}
                         transition={{ delay: 0.2 + (i * 0.1) }}
                         className="text-[11px] font-bold text-slate-600 flex items-center gap-4 bg-slate-50 p-3 rounded-2xl border border-slate-100 shadow-sm"
                       >
                         <div className="w-2 h-2 rounded-full bg-blue-600 shadow-sm shadow-blue-500/50 shrink-0" />
                         {action}
                       </motion.li>
                     ))}
                   </ul>
                </div>

                <div className="pt-8">
                  <Button 
                    onClick={resetForm}
                    variant="outline"
                    className="w-full !rounded-2xl !bg-slate-50 border-slate-200 text-slate-500 hover:text-blue-600 hover:bg-blue-50 transition-all font-sans text-[10px] uppercase font-bold tracking-widest"
                  >
                     Register New Sub-Incident
                  </Button>
                </div>
              </motion.div>
            )}

            </div>
          </div>
        </motion.div>
      </motion.div>

      <style jsx global>{`
        @keyframes scan {
          0% { transform: translateY(0); }
          50% { transform: translateY(180px); }
          100% { transform: translateY(0); }
        }
        .animate-scan {
          animation: scan 2s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}
