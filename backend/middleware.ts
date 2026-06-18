import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Allow all /admin and /api routes to pass through to Next.js
  if (pathname.startsWith('/admin') || pathname.startsWith('/api')) {
    return NextResponse.next();
  }

  // Allow Next.js internal routes
  if (pathname.startsWith('/_next') || pathname.startsWith('/uploads')) {
    return NextResponse.next();
  }

  // For all other routes (frontend SPA), serve index.html
  if (
    !pathname.includes('.') && // Not a file with extension
    pathname !== '/' && // Root is handled separately
    !pathname.startsWith('/admin') &&
    !pathname.startsWith('/api')
  ) {
    // Rewrite to index.html for SPA routing
    const url = request.nextUrl.clone();
    url.pathname = '/index.html';
    return NextResponse.rewrite(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
};
