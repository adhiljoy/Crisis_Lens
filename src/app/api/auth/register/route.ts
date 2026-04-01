import { NextResponse } from 'next/server';
import connectDB from '../../../../../backend/db';
import User from '../../../../../backend/models/User';
import bcrypt from 'bcryptjs';

export async function POST(req: Request) {
  try {
    await connectDB();
    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json({ success: false, message: "Credential alignment required" }, { status: 400 });
    }

    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return NextResponse.json({ success: false, message: "Operator signature already registered" }, { status: 400 });
    }

    const hashedPassword = await bcrypt.hash(password, 12);
    const isAdmin = email.toLowerCase() === 'adhiljoyappu@gmail.com';
    
    await User.create({
      email: email.toLowerCase(),
      password: hashedPassword,
      role: isAdmin ? 'admin' : 'user'
    });

    console.log(`[USER_ONBOARD] New operator registered: ${email}`);

    return NextResponse.json({ success: true, message: "Operator onboarding complete" });
  } catch (error: any) {
    console.error("Uplink handshake failed:", error);
    return NextResponse.json({ success: false, message: "System failure during onboarding" }, { status: 500 });
  }
}
