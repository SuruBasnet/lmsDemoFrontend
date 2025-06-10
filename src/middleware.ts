// middleware.ts
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const isAuthenticated = request.cookies.get('auth_token')?.value
  const publicPaths = ['/auth/login', '/auth/register']

  const { pathname } = request.nextUrl

  if (!isAuthenticated && !publicPaths.some(path => pathname.startsWith(path))) {
    const loginUrl = new URL('/auth/login', request.url)
    loginUrl.searchParams.set('from', pathname)
    return NextResponse.redirect(loginUrl)
  }

  if (isAuthenticated && publicPaths.includes(pathname)) {
    return NextResponse.redirect(new URL('/', request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    '/((?!auth/login|auth/register|api|_next/static|_next/image|favicon.ico).*)',
  ],
}
