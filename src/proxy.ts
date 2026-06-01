import { NextResponse } from "next/server";
import type { NextFetchEvent, NextRequest } from "next/server";

import { auth } from "@/shared/lib/auth";

type MiddlewareHandler = (
  request: NextRequest,
  event: NextFetchEvent,
) => ReturnType<ReturnType<typeof auth>>;

function getRoleHome(role: string) {
  if (role === "SUPER_ADMIN") return "/admin";
  if (role === "TEACHER") return "/teacher";
  return "/";
}

const withAuth = auth((req) => {
  const { pathname } = req.nextUrl;
  const session = req.auth;

  if (pathname === "/login" || pathname === "/login/teacher") {
    if (session?.user) {
      return NextResponse.redirect(
        new URL(getRoleHome(session.user.role), req.url),
      );
    }
    return NextResponse.next();
  }

  if (!session) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  const role = session.user.role;

  if (pathname.startsWith("/admin") && role !== "SUPER_ADMIN") {
    return NextResponse.redirect(new URL(getRoleHome(role), req.url));
  }

  if (pathname.startsWith("/teacher") && role !== "TEACHER") {
    return NextResponse.redirect(new URL(getRoleHome(role), req.url));
  }

  if (
    (pathname === "/" ||
      pathname.startsWith("/step") ||
      pathname === "/profile") &&
    role !== "STUDENT"
  ) {
    return NextResponse.redirect(new URL(getRoleHome(role), req.url));
  }

  return NextResponse.next();
});

export function proxy(request: NextRequest, event: NextFetchEvent) {
  return (withAuth as unknown as MiddlewareHandler)(request, event);
}

export const config = {
  matcher: [
    "/((?!api|_next|icons|uploads|manifest.json|sw.js|favicon.ico|robots.txt).*)",
  ],
};
