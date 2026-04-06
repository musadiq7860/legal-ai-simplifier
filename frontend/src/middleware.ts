import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const protectedRoutes = ["/upload", "/results", "/history"];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Check if the route is protected
  const isProtected = protectedRoutes.some(
    (route) => pathname === route || pathname.startsWith(route + "/")
  );

  if (!isProtected) return NextResponse.next();

  // Check for Supabase auth cookies
  // Supabase stores the session in cookies with pattern: sb-<ref>-auth-token
  const cookies = request.cookies.getAll();
  const hasAuthCookie = cookies.some(
    (cookie) =>
      cookie.name.includes("auth-token") || cookie.name.includes("sb-")
  );

  if (!hasAuthCookie) {
    const signInUrl = new URL("/sign-in", request.url);
    signInUrl.searchParams.set("redirect", pathname);
    return NextResponse.redirect(signInUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/upload/:path*", "/results/:path*", "/history/:path*"],
};
