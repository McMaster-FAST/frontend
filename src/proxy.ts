import { auth } from "@/auth";
import { NextResponse } from "next/server";

export default auth((req) => {
  const pathname = req.nextUrl.pathname;

  const isLoggedIn = !!req.auth;
  const userRoles = (req.auth?.user as any)?.roles || [];

  if (!isLoggedIn && pathname !== "/auth/signin") {
    return NextResponse.redirect(new URL("/auth/signin", req.url));
  }

  // An example of how to protect a page based on roles (We don't have roles yet!)
  // const isCourseDashboard = /^\/courses\/[^/]+\/dashboard$/.test(pathname);

  // if (isCourseDashboard) {
  //   if (!userRoles.includes("admin")) {
  //     // Use rewrite to show the denied page while keeping the URL the same
  //     return NextResponse.rewrite(new URL("/auth/denied", req.url));
  //   }
  // }

  return NextResponse.next();
});

// Do not block public assets and auth pages
export const config = {
  matcher: ["/((?!api|_next/static|_next/image|auth|favicon.ico|images|ping).*)"],
};
