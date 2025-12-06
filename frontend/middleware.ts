import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

// Public routes
const isPublicRoute = createRouteMatcher([
  "/",
  "/sign-in(.*)",
  "/sign-up(.*)",
]);

export default clerkMiddleware((auth, req) => {
  if (!isPublicRoute(req)) {
    auth.protect(); // <-- fixed here
  }
});

export const config = {
  matcher: [
    // Protect everything except static files
    "/((?!_next|.*\\..*).*)",
    // Protect API routes too
    "/(api)(.*)",
  ],
};
