import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { getSession } from '@/lib/session';

export async function GET() {
  try {
    const session = await getSession();
    if (!session || session.role !== 'admin') {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    const reports = db.getReports();
    const stats = {
      totalUsers: db.getUsersCount(), // Need to add this to db.ts
      totalReports: reports.length,
      criticalAlerts: reports.filter(r => r.severity === 'CRITICAL').length,
      activeSessions: db.getActiveSessionsCount(), // Or just a mock if not tracked
      resolvedReports: reports.filter(r => r.status === 'RESOLVED').length
    };

    return NextResponse.json({ success: true, data: stats });
  } catch (error) {
    console.error("Failed to fetch admin stats:", error);
    return NextResponse.json({ success: false, error: "Database error" }, { status: 500 });
  }
}
