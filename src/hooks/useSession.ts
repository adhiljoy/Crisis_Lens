"use client";

import { useEffect, useState, useCallback, useMemo } from "react";
import { usePathname } from "next/navigation";

export interface Session {
  userId: string;
  email: string;
  role: 'admin' | 'user';
}

export function useSession() {
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const pathname = usePathname();

  const fetchSession = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/auth/me', { cache: 'no-store' });
      const data = await res.json();
      if (data.success) {
        setSession(data.user);
      } else {
        setSession(null);
      }
    } catch (err) {
      console.error("Failed to fetch session:", err);
      setSession(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Fetch session on mount and when pathname changes
  useEffect(() => {
    fetchSession();
  }, [fetchSession, pathname]);

  const value = useMemo(() => ({
    session,
    isLoading,
    refreshSession: fetchSession
  }), [session, isLoading, fetchSession]);

  return value;
}
