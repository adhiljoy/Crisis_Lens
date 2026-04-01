import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { getSession } from '@/lib/session';

export async function GET() {
  try {
    const session = await getSession();
    if (!session || session.role !== 'admin') {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    const logs = await db.getLogs();
    return NextResponse.json({ success: true, data: logs });
  } catch (error) {
    console.error("Failed to fetch logs:", error);
    return NextResponse.json({ success: false, error: "Database error" }, { status: 500 });
  }
}
