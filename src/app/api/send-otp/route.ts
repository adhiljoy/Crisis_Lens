import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { sendOTPEmail } from '@/lib/mail';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const email = body.email?.trim().toLowerCase();

    if (!email || !/.+@.+\..+/.test(email)) {
      return NextResponse.json({ success: false, message: 'Valid identity identifier required' }, { status: 400 });
    }
    
    // Generate 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    
    // Save to Mock DB (5 min expiry)
    db.saveOtp(email, otp);

    console.log(`[HANDSHAKE INITIATED] Target: ${email}`);

    // Try to send email
    const emailResult = await sendOTPEmail(email, otp);

    const isDev = process.env.NODE_ENV === 'development';

    if (!emailResult.success) {
      console.warn(`[SECURITY FALLBACK] Email failed for ${email}. Error:`, emailResult.error);
      console.log(`[LOCAL DEV OVERRIDE] OTP for ${email} is: ${otp}`);
      
      const payload: { success: boolean, message: string, otp?: string } = {
        success: true,
        message: "OTP initialized via local fallback"
      };
      
      if (isDev) {
        payload.otp = otp;
      }
      return NextResponse.json(payload);
    }
    
    console.log(`[UPLINK SUCCESS] Security code dispatched to ${email}`);

    const successPayload: { success: boolean, message: string, otp?: string } = {
      success: true,
      message: "Security uplink successful. Check credentials."
    };

    if (isDev) {
      successPayload.otp = otp;
    }
    
    return NextResponse.json(successPayload);
  } catch (error) {
    console.error("Critical: Handshake failure:", error);
    return NextResponse.json({ success: false, message: "Failed to initialize security handshake" }, { status: 200 });
  }
}
