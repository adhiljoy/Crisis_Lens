import { NextResponse, NextRequest } from 'next/server';

export async function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const sessionCookie = req.cookies.get('session')?.value;
  
  let role = null;
  let isAuthorized = false;

  if (sessionCookie) {
    try {
      const payload = JSON.parse(sessionCookie);
      role = payload.role;
      isAuthorized = true;
    } catch {
      // Invalid session format
    }
  }

  // Protect Admin Routes
  if (pathname.startsWith('/admin')) {
    if (!isAuthorized) {
      return NextResponse.redirect(new URL('/login', req.url));
    }
    if (role !== 'admin') {
      return NextResponse.redirect(new URL('/dashboard', req.url));
    }
  }

  // Redirect authenticated users from /login
  if (pathname === '/login' && isAuthorized) {
    const redirectUrl = role === 'admin' ? '/admin' : '/dashboard';
    return NextResponse.redirect(new URL(redirectUrl, req.url));
  }

  // Auth requirement for dashboard and others
  const authRoutes = ['/dashboard', '/report', '/settings', '/admin'];
  if (authRoutes.some(route => pathname.startsWith(route)) && !isAuthorized) {
    return NextResponse.redirect(new URL('/login', req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
