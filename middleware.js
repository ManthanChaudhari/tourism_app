import { createServerClient } from "@supabase/ssr"
import { NextResponse } from "next/server"

// Define protected routes that require authentication
const protectedRoutes = [
  '/dashboard',
  '/profile',
  '/bookings',
  '/settings'
]

// Define auth routes that should redirect to dashboard if already authenticated
const authRoutes = [
  '/login',
  '/register',
  '/forgot-password'
]

export async function middleware(request) {
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    {
      cookies: {
        get(name) {
          return request.cookies.get(name)?.value
        },
        set(name, value, options) {
          response.cookies.set({
            name,
            value,
            ...options,
          })
        },
        remove(name, options) {
          response.cookies.set({
            name,
            value: "",
            ...options,
          })
        },
      },
    }
  )

  // Get the current user and session
  const { data: { user }, error } = await supabase.auth.getUser()
  
  const pathname = request.nextUrl.pathname
  const isProtectedRoute = protectedRoutes.some(route => pathname.startsWith(route))
  const isAuthRoute = authRoutes.some(route => pathname.startsWith(route))

  // Handle protected routes
  if (isProtectedRoute) {
    if (!user || error) {
      // User is not authenticated, redirect to login
      const loginUrl = new URL('/login', request.url)
      loginUrl.searchParams.set('redirectTo', pathname)
      return NextResponse.redirect(loginUrl)
    }

    // Check if email is confirmed for protected routes
    if (!user.email_confirmed_at) {
      const confirmUrl = new URL('/confirm-email', request.url)
      return NextResponse.redirect(confirmUrl)
    }
  }

  // Handle auth routes (login, register, etc.)
  if (isAuthRoute && user && user.email_confirmed_at) {
    // User is already authenticated and confirmed, redirect to dashboard or home
    const redirectTo = request.nextUrl.searchParams.get('redirectTo') || '/'
    return NextResponse.redirect(new URL(redirectTo, request.url))
  }

  // Handle password reset route
  if (pathname.startsWith('/reset-password')) {
    const accessToken = request.nextUrl.searchParams.get('access_token')
    const refreshToken = request.nextUrl.searchParams.get('refresh_token')
    
    if (accessToken && refreshToken) {
      // Set the session from the tokens
      const { error: sessionError } = await supabase.auth.setSession({
        access_token: accessToken,
        refresh_token: refreshToken
      })
      
      if (sessionError) {
        // Invalid tokens, redirect to forgot password
        return NextResponse.redirect(new URL('/forgot-password', request.url))
      }
    }
  }

  // Refresh session if needed
  try {
    const { data: { session } } = await supabase.auth.getSession()
    if (session) {
      // Check if session is about to expire (within 5 minutes)
      const expiresAt = session.expires_at * 1000 // Convert to milliseconds
      const now = Date.now()
      const fiveMinutes = 5 * 60 * 1000
      
      if (expiresAt - now < fiveMinutes) {
        // Refresh the session
        await supabase.auth.refreshSession()
      }
    }
  } catch (refreshError) {
    console.error('Session refresh error:', refreshError)
    // If refresh fails and user is on a protected route, redirect to login
    if (isProtectedRoute) {
      return NextResponse.redirect(new URL('/login', request.url))
    }
  }

  return response
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - api routes (handled separately)
     * Feel free to modify this pattern to include more paths.
     */
    "/((?!_next/static|_next/image|favicon.ico|api|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
}