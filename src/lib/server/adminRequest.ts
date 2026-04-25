import { NextResponse } from "next/server";
import { verifyAdminSessionToken, ADMIN_SESSION_COOKIE } from "@/lib/server/adminSession";

export function isAdminRequestAuthenticated(request: Request) {
  const cookieHeader = request.headers.get("cookie") || "";
  const parts = cookieHeader.split(/;\s*/).filter(Boolean);
  const token = parts
    .map((part) => part.split("="))
    .find(([name]) => name === ADMIN_SESSION_COOKIE)?.[1];

  return Boolean(verifyAdminSessionToken(token));
}

export function requireAdminRequest(request: Request) {
  if (isAdminRequestAuthenticated(request)) return null;
  return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
}
