import connectDB from '../../backend/db';
import User from '../../backend/models/User';
import OTP from '../../backend/models/OTP';
import Report from '../../backend/models/Report';
import ActivityLog from '../../backend/models/ActivityLog';

export interface UserType {
  email: string;
  role: 'admin' | 'user';
  createdAt: Date;
}

export interface OTPRecord {
  email: string;
  otp: string;
  expiresAt: Date;
  attempts: number;
}

export interface ReportType {
  id?: string;
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

export interface ActivityLogType {
  email: string;
  action: 'LOGIN' | 'LOGOUT' | 'REPORT' | 'ANALYSIS';
  timestamp: Date;
  data?: any;
}

export const db = {
  getUserByEmail: async (email: string) => {
    await connectDB();
    return await User.findOne({ email: email.trim().toLowerCase() }).lean();
  },
  createUser: async (email: string) => {
    await connectDB();
    const normalizedEmail = email.trim().toLowerCase();
    const isAdmin = normalizedEmail === 'adhiljoyappu@gmail.com';
    return await User.create({
      email: normalizedEmail,
      role: isAdmin ? 'admin' : 'user',
      password: 'OAUTH_PASSWORDLESS_NODE_' + Math.random().toString(36).substring(7)
    });
  },
  saveOtp: async (email: string, otp: string) => {
    await connectDB();
    const normalizedEmail = email.trim().toLowerCase();
    // Clear old OTPs for this user
    await OTP.deleteMany({ email: normalizedEmail });
    return await OTP.create({
      email: normalizedEmail,
      otp,
      expiresAt: new Date(Date.now() + 5 * 60 * 1000),
      attempts: 0
    });
  },
  getOtpRecord: async (email: string) => {
    await connectDB();
    return await OTP.findOne({ email: email.trim().toLowerCase() }).lean();
  },
  incrementOtpAttempt: async (email: string) => {
    await connectDB();
    const normalizedEmail = email.trim().toLowerCase();
    await OTP.updateOne({ email: normalizedEmail }, { $inc: { attempts: 1 } });
  },
  deleteOtp: async (email: string) => {
    await connectDB();
    await OTP.deleteOne({ email: email.trim().toLowerCase() });
  },
  saveReport: async (reportData: any) => {
    await connectDB();
    return await Report.create(reportData);
  },
  getReports: async () => {
    await connectDB();
    return await Report.find().sort({ createdAt: -1 }).lean();
  },
  updateReportStatus: async (id: string, status: 'ACTIVE' | 'RESOLVED') => {
    await connectDB();
    await Report.findByIdAndUpdate(id, { status });
  },
  logActivity: async (log: any) => {
    await connectDB();
    return await ActivityLog.create({
      ...log,
      timestamp: new Date()
    });
  },
  getLogs: async () => {
    await connectDB();
    return await ActivityLog.find().sort({ timestamp: -1 }).lean();
  },
  getUsersCount: async () => {
    await connectDB();
    return await User.countDocuments();
  },
  getActiveSessionsCount: async () => {
    await connectDB();
    const oneHourAgo = new Date(Date.now() - 3600000);
    const recentLogins = await ActivityLog.distinct('email', { 
      action: 'LOGIN', 
      timestamp: { $gte: oneHourAgo } 
    });
    return Math.max(recentLogins.length, 1);
  }
};

