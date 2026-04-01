import { cookies } from 'next/headers';

/**
 * MISSION-CRITICAL IDENTITY EXTRACTION
 * Updated to parse simple JSON session tokens as requested.
 */
export async function getSession() {
  try {
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get('session')?.value;
    
    if (!sessionCookie) return null;

    // Try parsing as JSON first (New standard requested)
    try {
      const payload = JSON.parse(sessionCookie);
      return payload;
    } catch {
      // Fallback if it was still a JWT
      return null;
    }
  } catch (error) {
    console.error('Failed to extract session identity:', error);
    return null;
  }
}

export async function clearSession() {
  try {
    const cookieStore = await cookies();
    cookieStore.set('session', '', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      expires: new Date(0),
      sameSite: 'lax',
      path: '/',
    });
  } catch (err) {
    console.error("Cleanup failure:", err);
  }
}

// Keeping this for compatibility, but its logic is now inside /api/verify-otp
export async function createSession(userId: string, email: string, role: string) {
  const cookieStore = await cookies();
  cookieStore.set('session', JSON.stringify({ userId, email, role }), {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    maxAge: 7 * 24 * 60 * 60,
    sameSite: 'lax',
    path: '/',
  });
}
