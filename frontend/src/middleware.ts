import { getToken } from 'next-auth/jwt';
import { NextRequest, NextResponse } from 'next/server';

const PROTECTED = ['/dashboard'];
const AUTH_ONLY = ['/login', '/register'];

export async function middleware(req: NextRequest) {
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
  const { pathname } = req.nextUrl;

  if (PROTECTED.some((p) => pathname.startsWith(p)) && !token) {
    const url = new URL('/login', req.url);
    url.searchParams.set('callbackUrl', pathname);
    return NextResponse.redirect(url);
  }

  if (AUTH_ONLY.some((p) => pathname.startsWith(p)) && token) {
    return NextResponse.redirect(new URL('/dashboard', req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/dashboard/:path*', '/login', '/register'],
};
