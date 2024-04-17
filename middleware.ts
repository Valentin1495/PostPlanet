// Resource: https://clerk.com/docs/nextjs/middleware#auth-middleware
// Copy the middleware code as it is from the above resource

import { authMiddleware, redirectToSignIn } from '@clerk/nextjs';
import { NextResponse } from 'next/server';

export default authMiddleware({
  afterAuth(auth, req) {
    if (auth.userId && req.nextUrl.pathname === '/') {
      const onboarding = new URL('/onboarding', req.url);
      return NextResponse.redirect(onboarding);
    }
    if (!auth.userId && !auth.isPublicRoute) {
      return redirectToSignIn({ returnBackUrl: req.url });
    }
  },
  // An array of public routes that don't require authentication.
  publicRoutes: ['/api/uploadthing'],

  // An array of routes to be ignored by the authentication middleware.
  ignoredRoutes: [],
});

export const config = {
  matcher: ['/((?!.*\\..*|_next).*)', '/', '/(api|trpc)(.*)'],
};
