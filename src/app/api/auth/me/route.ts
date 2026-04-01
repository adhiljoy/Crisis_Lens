import { NextResponse } from 'next/server';
import { getSession } from '@/lib/session';

export async function GET() {
  const session = await getSession();

  if (!session) {
    return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
  }

  return NextResponse.json({ 
    success: true, 
    user: {
      userId: session.userId,
      email: session.email,
      role: session.role
    } 
  });
}
