import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// Edge Middleware for strict Role Based Access Control
export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  
  try {
    // Call the Better Auth API backend to verify the session
    // We pass the cookie header securely from the incoming request
    const response = await fetch("https://hsrpg-api.pginbengaluru72.workers.dev/api/auth/get-session", {
      headers: {
        cookie: request.headers.get("cookie") || "",
      }
    })

    const sessionData = await response.json()
    const userRole = sessionData?.user?.role

    // If no user is logged in, kick them to /auth
    if (!sessionData || !sessionData.user || !userRole) {
      if (pathname.startsWith('/owner') || pathname.startsWith('/superadmin') || pathname.startsWith('/tenant')) {
        return NextResponse.redirect(new URL('/auth', request.url))
      }
      return NextResponse.next()
    }

    // 1. Protect Owner Dashboard
    if (pathname.startsWith('/owner')) {
      if (userRole !== 'owner' && userRole !== 'superadmin') {
        return NextResponse.redirect(new URL('/tenant', request.url)) // redirect unauthorized to their own space
      }
    }

    // 2. Protect Super Admin Dashboard
    if (pathname.startsWith('/superadmin')) {
      if (userRole !== 'superadmin') {
        return NextResponse.redirect(new URL('/tenant', request.url))
      }
    }
    
    // 3. Protect Tenant Dashboard
    if (pathname.startsWith('/tenant')) {
      if (userRole !== 'tenant' && userRole !== 'superadmin') {
         return NextResponse.redirect(new URL('/owner', request.url))
      }
    }

    return NextResponse.next()
  } catch (error) {
    console.error("Middleware Auth Error:", error)
    // If the auth server fails, fail securely by redirecting to auth
    return NextResponse.redirect(new URL('/auth', request.url))
  }
}

export const config = {
  matcher: [
    '/owner/:path*',
    '/superadmin/:path*',
    '/tenant/:path*'
  ],
}
