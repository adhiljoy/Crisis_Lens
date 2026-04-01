import { NextResponse } from 'next/server';
import { clearSession, getSession } from '@/lib/session';
import { db } from '@/lib/db';

export async function POST() {
  try {
    const session = await getSession();
    if (session?.email) {
      db.logActivity({
        email: session.email as string,
        action: 'LOGOUT',
        data: { timestamp: new Date().toISOString() }
      });
    }
  } catch (err) {
    console.error("Logout activity logging failed:", err);
  } finally {
    await clearSession();
    return NextResponse.json({ success: true, message: "Logged out successfully" }, { status: 200 });
  }
}
