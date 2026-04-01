import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import connectDB from '../../../../../backend/db';
import User from '../../../../../backend/models/User';
import bcrypt from 'bcryptjs';
import { db } from '@/lib/db';

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json({ success: false, message: "Identification credentials required" }, { status: 400 });
    }

    await connectDB();
    const normalizedEmail = email.toLowerCase();
    
    const user = await User.findOne({ email: normalizedEmail });
    
    if (!user) {
      return NextResponse.json({ success: false, message: "Operator signature not found" }, { status: 401 });
    }

    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) {
      return NextResponse.json({ success: false, message: "Decryption mismatch" }, { status: 401 });
    }

    // Role Escalation
    const role = user.role;

    // Create session cookie
    const cookieStore = await cookies();
    cookieStore.set("session", JSON.stringify({ userId: user._id.toString(), email: user.email, role }), {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      path: "/",
      maxAge: 7 * 24 * 60 * 60,
      sameSite: 'lax'
    });

    // Log Activity
    await db.logActivity({ 
      email: user.email, 
      action: 'LOGIN',
      data: { role, method: 'CREDENTIAL_HANDSHAKE' } 
    });

    console.log(`[USER_UPLINK] Terminal connection established for: ${user.email} as ${role}`);

    return NextResponse.json({ success: true, message: "Uplink established" });
  } catch (error: any) {
    console.error("Handshake fatal:", error);
    return NextResponse.json({ success: false, message: "Handshake failure: GRID_ACCESS_DENIED" }, { status: 500 });
  }
}
