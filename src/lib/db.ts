import crypto from 'crypto';

export interface User {
  id: string;
  email: string;
  role: 'admin' | 'user';
  createdAt: number;
}

export interface OTPRecord {
  email: string;
  otp: string;
  expiresAt: number;
  attempts: number;
}

export interface Report {
  id: string;
  email: string;
  type: string;
  severity: string;
  status: 'ACTIVE' | 'RESOLVED';
  location: string;
  time: string;
  pulse: boolean;
  description: string;
  riskLevel: number;
  confidence: number;
  actions: string[];
}

export interface ActivityLog {
  id: string;
  email: string;
  action: 'LOGIN' | 'LOGOUT' | 'REPORT' | 'ANALYSIS';
  timestamp: number;
  data?: any;
}

interface DBState {
  users: Map<string, User>;
  otps: Map<string, OTPRecord>;
  reports: Map<string, Report>;
  logs: Map<string, ActivityLog>;
}

const getDBState = (): DBState => {
  if (!(globalThis as any).__NEXUS_DB_MAPMAP) {
    (globalThis as any).__NEXUS_DB_MAPMAP = { 
      users: new Map<string, User>(), 
      otps: new Map<string, OTPRecord>(), 
      reports: new Map<string, Report>(),
      logs: new Map<string, ActivityLog>()
    };
  }
  return (globalThis as any).__NEXUS_DB_MAPMAP;
};

export const db = {
  getUserByEmail: (email: string) => {
    const state = getDBState();
    return state.users.get(email.trim().toLowerCase()) || null;
  },
  createUser: (email: string) => {
    const state = getDBState();
    const normalizedEmail = email.trim().toLowerCase();
    const isAdmin = normalizedEmail === 'adhiljoyappu@gmail.com';
    let id: string;
    try {
      id = crypto.randomUUID();
    } catch {
      id = `usr-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    }
    const newUser: User = { 
      id, 
      email: normalizedEmail, 
      role: isAdmin ? 'admin' : 'user', 
      createdAt: Date.now() 
    };
    state.users.set(normalizedEmail, newUser);
    return newUser;
  },
  saveOtp: (email: string, otp: string) => {
    const state = getDBState();
    const normalizedEmail = email.trim().toLowerCase();
    state.otps.set(normalizedEmail, {
      email: normalizedEmail,
      otp,
      expiresAt: Date.now() + 5 * 60 * 1000,
      attempts: 0
    });
  },
  getOtpRecord: (email: string) => {
    const state = getDBState();
    return state.otps.get(email.trim().toLowerCase()) || null;
  },
  incrementOtpAttempt: (email: string) => {
    const state = getDBState();
    const normalizedEmail = email.trim().toLowerCase();
    const record = state.otps.get(normalizedEmail);
    if (record) {
      record.attempts += 1;
      state.otps.set(normalizedEmail, record);
    }
  },
  deleteOtp: (email: string) => {
    const state = getDBState();
    state.otps.delete(email.trim().toLowerCase());
  },
  saveReport: (report: Report) => {
    const state = getDBState();
    state.reports.set(report.id, report);
  },
  getReports: () => {
    const state = getDBState();
    return Array.from(state.reports.values()).sort((a, b) => b.id.localeCompare(a.id));
  },
  updateReportStatus: (id: string, status: 'ACTIVE' | 'RESOLVED') => {
    const state = getDBState();
    const report = state.reports.get(id);
    if (report) {
      report.status = status;
      state.reports.set(id, report);
    }
  },
  logActivity: (log: Omit<ActivityLog, 'id' | 'timestamp'>) => {
    const state = getDBState();
    let id: string;
    try {
      id = crypto.randomUUID();
    } catch {
      id = `log-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    }
    const timestamp = Date.now();
    state.logs.set(id, { id, timestamp, ...log });
  },
  getLogs: () => {
    const state = getDBState();
    return Array.from(state.logs.values()).sort((a, b) => b.timestamp - a.timestamp);
  },
  getUsersCount: () => {
    const state = getDBState();
    return state.users.size;
  },
  getActiveSessionsCount: () => {
    const state = getDBState();
    const logs = Array.from(state.logs.values());
    const logins = logs.filter(l => l.action === 'LOGIN').map(l => l.email);
    const logouts = logs.filter(l => l.action === 'LOGOUT').map(l => l.email);
    const active = new Set(logins.filter(email => !logouts.includes(email)));
    return active.size || 1; // Default to 1 to represent the current admin
  }
};
