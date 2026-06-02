import { NextResponse } from "next/server";
import type { NextFetchEvent, NextRequest } from "next/server";

import { auth } from "@/shared/lib/auth";

type MiddlewareHandler = (
  request: NextRequest,
  event: NextFetchEvent,
) => ReturnType<ReturnType<typeof auth>>;

const withAuth = auth((req) => {
  const { pathname } = req.nextUrl;
  const session = req.auth;

  if (pathname.startsWith("/teacher")) {
    return NextResponse.redirect(new URL("/", req.url));
  }

  if (pathname === "/login") {
    if (session?.user.role === "SUPER_ADMIN") {
      return NextResponse.redirect(new URL("/admin", req.url));
    }
    return NextResponse.next();
  }

  if (pathname.startsWith("/admin")) {
    if (!session || session.user.role !== "SUPER_ADMIN") {
      return NextResponse.redirect(new URL("/login", req.url));
    }
    return NextResponse.next();
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
