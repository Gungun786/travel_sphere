import { NextResponse } from 'next/server';
import { auth } from './auth';

export default auth((request) => {
  const { pathname, search } = request.nextUrl;
  const isPublic =
    pathname === '/' ||
    pathname === '/login' ||
    pathname.startsWith('/api/auth/');

  if (!request.auth && !isPublic) {
    const loginUrl = new URL('/login', request.nextUrl);
    loginUrl.searchParams.set('callbackUrl', `${pathname}${search}`);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
});

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};
