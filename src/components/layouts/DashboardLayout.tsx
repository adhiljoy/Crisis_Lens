"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { LayoutDashboard, AlertOctagon, Settings, LogOut, Hexagon, ShieldCheck } from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useSession } from "@/hooks/useSession";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { session, isLoading } = useSession();
  const [hoveredLink, setHoveredLink] = useState<string | null>(null);
  const [isSidebarHovered, setIsSidebarHovered] = useState(false);

  useEffect(() => {
    if (!isLoading && !session) {
      router.replace('/login');
    }
  }, [session, isLoading, router]);

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
    } catch (err) {
      console.error("Critical: Grid Node Logout API transmission failed:", err);
    } finally {
      router.replace('/login');
    }
  };

  const navLinks = [
    { href: "/dashboard", icon: LayoutDashboard, label: "Overview" },
    { href: "/report", icon: AlertOctagon, label: "Report Incident" },
    ...(session?.role === 'admin' ? [{ href: "/admin", icon: ShieldCheck, label: "Administration" }] : []),
    { href: "/settings", icon: Settings, label: "System Config" },
  ];

  return (
    <div className="flex h-screen bg-transparent text-slate-900 overflow-hidden relative font-sans">
      <motion.aside 
        initial={{ x: -100, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        onMouseEnter={() => setIsSidebarHovered(true)}
        onMouseLeave={() => setIsSidebarHovered(false)}
        className={`group/sidebar relative z-20 transition-all duration-500 ease-[cubic-bezier(0.4,0,0.2,1)] bg-white border-r border-slate-200 flex flex-col justify-between py-6 backdrop-blur-3xl overflow-hidden ${isSidebarHovered ? 'w-64 shadow-2xl' : 'w-20'}`}
      >
        <div>
          <div className="flex items-center justify-center md:justify-start px-6 mb-12">
            <div className="relative">
              <div className="absolute -inset-2 bg-blue-500/10 rounded-full blur-md animate-pulse"></div>
              <Hexagon className="w-8 h-8 text-blue-600 relative z-10 animate-spin" style={{ animationDuration: '15s' }} />
            </div>
            <motion.div
              animate={{ opacity: isSidebarHovered ? 1 : 0, width: isSidebarHovered ? 'auto' : 0, marginLeft: isSidebarHovered ? '12px' : '0px' }}
              transition={{ duration: 0.4 }}
              className="flex flex-col gap-0.5 overflow-hidden"
            >
              <h2 className="hidden md:block whitespace-nowrap font-sans font-bold tracking-tight text-slate-900 uppercase text-sm">
                Crisis<span className="text-blue-600">.AI</span>
              </h2>
              {session && (
                 <div className="flex items-center gap-1.5 mt-0.5">
                   {session.role === 'admin' ? (
                     <span className="flex items-center gap-1 px-2 py-0.5 bg-blue-600/[0.08] border border-blue-500/20 rounded-full shadow-[0_0_12px_rgba(37,99,235,0.15)]">
                        <div className="w-1 h-1 bg-blue-500 rounded-full animate-pulse shadow-[0_0_8px_rgba(37,99,235,0.8)]"></div>
                        <span className="text-[7px] font-black uppercase tracking-[0.15em] text-blue-600">Admin Authority</span>
                     </span>
                   ) : (
                     <span className="text-[7.5px] font-bold uppercase tracking-[0.2em] text-slate-400 font-sans pl-1">
                       OPERATOR NODE
                     </span>
                   )}
                 </div>
              )}
            </motion.div>
          </div>

          <nav className="flex flex-col gap-2 px-3">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              const isHovered = hoveredLink === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onMouseEnter={() => setHoveredLink(link.href)}
                  onMouseLeave={() => setHoveredLink(null)}
                  className="relative flex items-center gap-3 px-3 py-3 rounded-xl transition-all font-sans text-[11px] font-bold uppercase tracking-wider group"
                >
                  {(isActive || isHovered) && (
                    <motion.div
                      layoutId="sidebar-active"
                      className="absolute inset-0 bg-blue-50/80 rounded-xl border border-blue-100 shadow-[0_4px_12px_rgba(37,99,235,0.05)]"
                      transition={{ type: "spring", stiffness: 300, damping: 30 }}
                    />
                  )}
                  <link.icon className={`w-5 h-5 relative z-10 transition-all duration-300 shrink-0 ${isActive ? 'text-blue-600' : 'text-slate-400'}`} />
                  <motion.span 
                    animate={{ opacity: isSidebarHovered ? 1 : 0, width: isSidebarHovered ? 'auto' : 0 }}
                    transition={{ duration: 0.4 }}
                    className={`hidden md:block whitespace-nowrap overflow-hidden relative z-10 ${isActive ? 'text-blue-700' : 'text-slate-500'}`}
                  >
                    {link.label}
                  </motion.span>
                </Link>
              );
            })}
          </nav>
        </div>

        <div className="px-3">
          <div 
            onClick={handleLogout}
            className="flex items-center gap-3 px-3 py-3 rounded-xl hover:bg-red-50 text-slate-400 hover:text-red-500 transition-all font-sans text-[11px] font-bold uppercase group cursor-pointer border border-transparent hover:border-red-100"
          >
            <LogOut className="w-5 h-5 shrink-0" />
            <motion.span 
              animate={{ opacity: isSidebarHovered ? 1 : 0, width: isSidebarHovered ? 'auto' : 0 }}
              transition={{ duration: 0.4 }}
              className="hidden md:block whitespace-nowrap overflow-hidden"
            >
              Terminate Session
            </motion.span>
          </div>
        </div>
      </motion.aside>

      <main className="flex-1 relative z-10 overflow-auto">
        <div className="container mx-auto p-6 md:p-10 max-w-7xl">
          <AnimatePresence mode="wait">
            <motion.div
              key={pathname}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.4, ease: "easeInOut" }}
            >
              {children}
            </motion.div>
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
}
