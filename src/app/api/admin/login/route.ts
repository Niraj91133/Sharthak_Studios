import { NextResponse } from "next/server";
import { buildAdminSessionCookie, createAdminSessionToken } from "@/lib/server/adminSession";
import { verifyAdminCredentials } from "@/lib/server/siteSettings";

function clean(value: unknown) {
  return typeof value === "string" ? value.trim() : "";
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const username = clean(body?.username);
    const password = clean(body?.password);

    if (!username || !password) {
      return NextResponse.json({ error: "Username and password are required." }, { status: 400 });
    }

    const isValid = await verifyAdminCredentials(username, password);
    if (!isValid) {
      return NextResponse.json({ error: "Invalid username or password." }, { status: 401 });
    }

    const response = NextResponse.json({ ok: true });
    response.cookies.set(buildAdminSessionCookie(createAdminSessionToken(username)));
    return response;
  } catch {
    return NextResponse.json({ error: "Login failed." }, { status: 500 });
  }
}
