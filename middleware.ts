import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// This is the Edge Middleware for strict RBAC
export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  
  // In production, we'll fetch the Better Auth session token or verify it using the edge client
  const sessionToken = request.cookies.get("better-auth.session_token")?.value
  
  // MOCK RBAC for development visualization
  // To test different views, you can set a mock cookie or just let it pass for now.
  const mockUserRole = request.cookies.get("mock_role")?.value || (sessionToken ? "superadmin" : null)

  // If no user is logged in (mocked or real), kick them to /auth
  if (!mockUserRole) {
    if (pathname.startsWith('/owner') || pathname.startsWith('/superadmin') || pathname.startsWith('/tenant')) {
      return NextResponse.redirect(new URL('/auth', request.url))
    }
    return NextResponse.next()
  }

  // 1. Protect Owner Dashboard
  if (pathname.startsWith('/owner')) {
    if (mockUserRole !== 'owner' && mockUserRole !== 'superadmin') {
      return NextResponse.redirect(new URL('/tenant', request.url)) // redirect unauthorized to their own space
    }
  }

  // 2. Protect Super Admin Dashboard
  if (pathname.startsWith('/superadmin')) {
    if (mockUserRole !== 'superadmin') {
      return NextResponse.redirect(new URL('/tenant', request.url))
    }
  }
  
  // 3. Protect Tenant Dashboard
  if (pathname.startsWith('/tenant')) {
    if (mockUserRole !== 'tenant' && mockUserRole !== 'superadmin') {
       return NextResponse.redirect(new URL('/owner', request.url))
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    '/owner/:path*',
    '/superadmin/:path*',
    '/tenant/:path*'
  ],
}
