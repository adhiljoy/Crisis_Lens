import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { createSession } from '@/lib/session';

export async function POST(req: Request) {
  try {
    const { email } = await req.json();

    if (!email || !/.+@.+\..+/.test(email)) {
      return NextResponse.json({ success: false, message: 'Valid identity identifier required' }, { status: 400 });
    }
    
    const normalizedEmail = email.trim().toLowerCase();
    
    console.log(`[DEMO_AUTH_UPLINK] Initiated for: ${normalizedEmail}`);

    // Auto-create user if not exists
    let user = db.getUserByEmail(normalizedEmail);
    if (!user) {
      console.log(`[USER_PROVISION] New operator identity created for: ${normalizedEmail}`);
      user = db.createUser(normalizedEmail);
    }

    // Role Escalation
    const role = normalizedEmail === 'adhiljoyappu@gmail.com' ? 'admin' : 'user';

    // Lock session
    await createSession(user.id, normalizedEmail, role);

    // Activity logging
    db.logActivity({ 
      email: normalizedEmail, 
      action: 'LOGIN',
      data: { role, method: 'Simulated OAuth' } 
    });
    
    console.log(`[HANDSHAKE_COMPLETE] Terminal connection established for: ${normalizedEmail} as ${role}`);
    return NextResponse.json({ success: true, message: "Security handshake complete", user: { email: normalizedEmail, role } });
  } catch (error: any) {
    console.error(`[AUTH_FATAL] Operational failure in handshake system:`, error);
    return NextResponse.json({ success: false, message: "Identity verification failed" }, { status: 500 });
  }
}
