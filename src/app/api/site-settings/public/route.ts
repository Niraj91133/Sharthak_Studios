import { NextResponse } from "next/server";
import { getPublicSiteSettings } from "@/lib/server/siteSettings";

export async function GET() {
  try {
    const settings = await getPublicSiteSettings();
    return NextResponse.json(settings);
  } catch (error) {
    console.error("Public site settings API crashed:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
