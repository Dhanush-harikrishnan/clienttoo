import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'

const isProtectedRoute = createRouteMatcher([
  '/dashboard(.*)',
  '/api/payment(.*)',
  '/callback(.*)',
])

const isPublicRoute = createRouteMatcher([
  '/',
  '/sign-in(.*)',
  '/sign-up(.*)',
  '/api/webhook(.*)',
])

export default clerkMiddleware(async (auth, req) => {
  const { userId } = await auth()
  const url = req.nextUrl.clone()

  // If user is authenticated and trying to access auth pages, redirect to dashboard
  if (userId && (url.pathname === '/sign-in' || url.pathname === '/sign-up')) {
    url.pathname = '/dashboard'
    return NextResponse.redirect(url)
  }

  // Protect private routes
  if (isProtectedRoute(req) && !userId) {
    url.pathname = '/sign-in'
    return NextResponse.redirect(url)
  }

  return NextResponse.next()
})

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Always run for API routes
    '/(api|trpc)(.*)',
  ],
}
