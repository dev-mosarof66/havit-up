import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { jwtVerify } from 'jose';

const secretKey = process.env.JWT_SECRET || "super-secret-key-for-dev-only";
const key = new TextEncoder().encode(secretKey);

export async function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;

  // Define routes that require authentication
  const isProtectedRoute = path.startsWith('/dashboard') || path.startsWith('/habits') || path.startsWith('/analytics');

  if (isProtectedRoute) {
    const session = request.cookies.get('session')?.value;
    
    if (!session) {
      return NextResponse.redirect(new URL('/', request.url));
    }

    try {
      // Verify JWT
      await jwtVerify(session, key, {
        algorithms: ["HS256"],
      });
      return NextResponse.next();
    } catch (err) {
      // Invalid token
      return NextResponse.redirect(new URL('/', request.url));
    }
  }

  // Redirect authenticated users away from the landing page to the dashboard
  if (path === '/') {
    const session = request.cookies.get('session')?.value;
    if (session) {
      try {
        await jwtVerify(session, key, { algorithms: ["HS256"] });
        return NextResponse.redirect(new URL('/dashboard', request.url));
      } catch (err) {
        // Ignore invalid token on landing page
      }
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
