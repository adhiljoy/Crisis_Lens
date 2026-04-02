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

    // Resilient identity resolution
    let user;
    try {
      user = await db.getUserByEmail(normalizedEmail);
      if (!user) {
        console.log(`[USER_PROVISION] New operator identity created for: ${normalizedEmail}`);
        user = await db.createUser(normalizedEmail);
      }
    } catch (dbError) {
      console.warn(`[AUTH_UPLINK_RESILIENCE] Database unavailable. Falling back to simulated identity.`, dbError);
      // Construct a valid mock user object if DB is not reachable
      user = { 
        _id: "DEMO_" + Math.random().toString(36).substring(7).toUpperCase(), 
        email: normalizedEmail 
      };
    }

    // Role Escalation
    const role = normalizedEmail === 'adhiljoyappu@gmail.com' ? 'admin' : 'user';

    // Lock session
    await createSession(user._id.toString(), normalizedEmail, role);

    // Activity logging (silent failure if DB down)
    try {
      await db.logActivity({ 
        email: normalizedEmail, 
        action: 'LOGIN',
        data: { role, method: 'Simulated OAuth (Resilient)' } 
      });
    } catch {}
    
    console.log(`[HANDSHAKE_COMPLETE] Terminal connection established for: ${normalizedEmail} as ${role}`);
    return NextResponse.json({ success: true, message: "Security handshake complete", user: { email: normalizedEmail, role } });
  } catch (error: any) {
    console.error(`[AUTH_FATAL] Operational failure in handshake system:`, error);
    return NextResponse.json({ success: false, message: "Identity verification failed" }, { status: 500 });
  }
}
