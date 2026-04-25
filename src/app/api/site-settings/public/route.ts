import { NextResponse } from "next/server";
import { getPublicSiteSettings } from "@/lib/server/siteSettings";

export async function GET() {
  const settings = await getPublicSiteSettings();
  return NextResponse.json(settings);
}
