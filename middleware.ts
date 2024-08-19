// Resource: https://clerk.com/docs/references/nextjs/clerk-middleware
// Copy the middleware code as it is from the above resource

import { clerkMiddleware } from '@clerk/nextjs/server';
import { updateSession } from './actions/user.actions';

export default clerkMiddleware(async (_, req) => {
  return await updateSession(req);
});

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Always run for API routes
    '/(api|trpc)(.*)',
  ],
};
