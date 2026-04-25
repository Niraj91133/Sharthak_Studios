import { NextResponse } from "next/server";
import { buildAdminLogoutCookie } from "@/lib/server/adminSession";

export async function POST() {
  const response = NextResponse.json({ ok: true });
  response.cookies.set(buildAdminLogoutCookie());
  return response;
}
