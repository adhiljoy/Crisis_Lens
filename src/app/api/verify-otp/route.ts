import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { db } from '@/lib/db';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const email = body.email?.trim().toLowerCase();
    const otp = body.otp?.trim();

    if (!email || !otp) {
      return NextResponse.json({ success: false, message: 'Identity and security code are required' }, { status: 400 });
    }
    
    console.log(`[VERIFY_START] Attempting verification for: ${email}`);
    
    const record = await db.getOtpRecord(email);
    console.log(`[VERIFY_DEBUG] RECORD FOUND:`, record?.email, "Code:", record?.otp);
    
    if (!record) {
      console.warn(`[VERIFY_FAIL] No record existing for: ${email}`);
      return NextResponse.json({ success: false, message: 'Security code not found or expired' }, { status: 400 });
    }

    if (Date.now() > record.expiresAt.getTime()) {
      console.warn(`[VERIFY_FAIL] Code expired for: ${email}`);
      await db.deleteOtp(email);
      return NextResponse.json({ success: false, message: 'Uplink code has expired' }, { status: 400 });
    }

    if (record.attempts >= 3) {
      console.warn(`[VERIFY_FAIL] Too many attempts for: ${email}`);
      await db.deleteOtp(email);
      return NextResponse.json({ success: false, message: 'Security lockout: Too many failed attempts' }, { status: 400 });
    }

    // Compare as string (CRITICAL)
    if (String(record.otp) !== String(otp)) {
      console.warn(`[VERIFY_FAIL] Incorrect code for: ${email}. Target: ${record.otp}, Received: ${otp}`);
      await db.incrementOtpAttempt(email);
      return NextResponse.json({ success: false, message: 'Incorrect security code' }, { status: 400 });
    }

    // Success - Delete OTP so it cannot be reused
    await db.deleteOtp(email);
    console.log(`[VERIFY_SUCCESS] Security handshake verified for: ${email}`);

    // Auto-create user if not exists
    let user = await db.getUserByEmail(email);
    if (!user) {
      user = await db.createUser(email);
      console.log(`[USER_PROVISION] New operator identity created for: ${email}`);
    }

    // Role Escalation
    const role = email === 'adhiljoyappu@gmail.com' ? 'admin' : 'user';

    // CREATE SESSION COOKIE (DIRECTLY IN API)
    // NOTE: Using await cookies() as Next.js 16 requires it to be awaited
    const cookieStore = await cookies();
    cookieStore.set("session", JSON.stringify({ email, role }), {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      path: "/",
      maxAge: 7 * 24 * 60 * 60, // 7 days
      sameSite: 'lax'
    });

    console.log(`[SESSION_CREATED] Identity locked for: ${email} as ${role}`);

    // Activity logging
    await db.logActivity({ 
      email, 
      action: 'LOGIN',
      data: { role } 
    });
    
    console.log(`[HANDSHAKE_COMPLETE] Terminal connection established for: ${email}`);
    return NextResponse.json({ success: true, message: "Security handshake complete" });
  } catch (error: any) {
    console.error(`[VERIFY_FATAL] Operational failure in handshake system:`, error);
    return NextResponse.json({ success: false, message: "Identity verification failed" });
  }
}
