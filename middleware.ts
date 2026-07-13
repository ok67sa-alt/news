import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Allow all /admin and /api routes to pass through to Next.js
  if (pathname.startsWith('/admin') || pathname.startsWith('/api')) {
    return NextResponse.next();
  }

  // Allow Next.js internal routes and static assets with caching
  if (pathname.startsWith('/_next') || pathname.startsWith('/uploads')) {
    const response = NextResponse.next();
    // Cache static assets for 1 year
    if (pathname.match(/\.(js|css|png|jpg|jpeg|gif|svg|ico|woff|woff2|ttf|eot)$/)) {
      response.headers.set('Cache-Control', 'public, max-age=31536000, immutable');
    }
    return response;
  }

  // For all other routes (frontend SPA), serve index.html with no-cache headers
  if (
    !pathname.includes('.') && // Not a file with extension
    pathname !== '/' && // Root is handled separately
    !pathname.startsWith('/admin') &&
    !pathname.startsWith('/api')
  ) {
    // Rewrite to index.html for SPA routing
    const url = request.nextUrl.clone();
    url.pathname = '/index.html';
    const response = NextResponse.rewrite(url);
    // Prevent caching of HTML to ensure users get latest version
    response.headers.set('Cache-Control', 'no-cache, no-store, must-revalidate');
    response.headers.set('Pragma', 'no-cache');
    response.headers.set('Expires', '0');
    return response;
  }

  // For root and other static files
  const response = NextResponse.next();
  // Prevent HTML caching
  if (pathname === '/' || pathname.endsWith('.html')) {
    response.headers.set('Cache-Control', 'no-cache, no-store, must-revalidate');
    response.headers.set('Pragma', 'no-cache');
    response.headers.set('Expires', '0');
  }
  return response;
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
