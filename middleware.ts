import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token;
    const pathname = req.nextUrl.pathname;

    // Admin only routes
    if (pathname.startsWith("/dashboard/admin") && token?.role !== "admin") {
      return NextResponse.redirect(new URL("/login?error=unauthorized", req.url));
    }

    // Insider only routes
    if (
      pathname.startsWith("/dashboard/insider") &&
      token?.role !== "insider" &&
      token?.role !== "admin"
    ) {
      return NextResponse.redirect(new URL("/login?error=unauthorized", req.url));
    }

    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        const pathname = req.nextUrl.pathname;

        // Public routes
        const publicRoutes = [
          "/",
          "/colleges",
          "/compare",
          "/quiz",
          "/login",
          "/register",
          "/api/auth",
          "/api/colleges",
          "/_next",
          "/favicon.ico",
          "/manifest.json",
        ];

        const isPublic = publicRoutes.some((route) =>
          pathname.startsWith(route)
        );

        if (isPublic) return true;

        // Protected routes require token
        return !!token;
      },
    },
  }
);

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|manifest.json|icons/).*)",
  ],
};
