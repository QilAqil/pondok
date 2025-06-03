// import { authMiddleware } from "@clerk/nextjs";

// export default authMiddleware({
//   publicRoutes: ["/", "/api/(.*)"],
// });

// export const config = {
//   matcher: ["/((?!.*\\..*|_next).*)", "/", "/(api|trpc)(.*)"],
// };


// import { clerkMiddleware } from '@clerk/nextjs/server'

// export default clerkMiddleware()

// export const config = {
//   matcher: [
//     // Skip Next.js internals and all static files, unless found in search params
//     '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
//     // Always run for API routes
//     '/(api|trpc)(.*)',
//   ],
// }

import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

// Define public routes
const isPublicRoute = createRouteMatcher(["/", "/api/(.*)", "/sign-in", "/sign-up"]);

export default clerkMiddleware(async (auth, req) => {
  const session = await auth();
  if (!session.userId && !isPublicRoute(req)) {
    return session.redirectToSignIn({ returnBackUrl: req.url });
  }
  return NextResponse.next();
});

export const config = {
  matcher: [
    // Apply to all routes except static files and Next.js internals
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg| trok|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    // Always apply to API and TRPC routes
    "/(api|trpc)(.*)",
  ],
};