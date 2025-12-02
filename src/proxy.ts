import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  // (Unauthenticated users get auto-redirected to /auth/signin before reaching here)
  function middleware(req) {
    const pathname = req.nextUrl.pathname;
    const userRoles = req.nextauth.token?.roles || [];

    // Just an example of how roles could be used to prevent users from viewing certain pages
    const isCourseDashboard = /^\/courses\/[^/]+\/dashboard$/.test(pathname);

    if (isCourseDashboard) {
      if (!userRoles.includes("admin")) {
        return NextResponse.rewrite(new URL("/auth/denied", req.url));
      }
    }
  },
  {
    callbacks: {
      // Ensure the token exists
      authorized: ({ token }) => !!token,
    },
    pages: {
      signIn: "/auth/signin",
    },
  }
);

// Do not block public assets and auth pages
export const config = {
  matcher: ["/((?!api|_next/static|_next/image|auth|favicon.ico|images).*)"],
};
