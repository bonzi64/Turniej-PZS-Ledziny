import { type NextRequest, NextResponse } from "next/server";

// tylko szybkie odbicie bez ciasteczka – właściwa weryfikacja sesji jest w requireStaff()
export function proxy(request: NextRequest) {
  if (request.nextUrl.pathname.startsWith("/admin/login")) return NextResponse.next();
  if (request.cookies.has("pzs_sid")) return NextResponse.next();
  return NextResponse.redirect(new URL("/admin/login", request.url));
}

export const config = {
  matcher: ["/admin", "/admin/:path*"],
};
