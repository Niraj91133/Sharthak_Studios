import { NextResponse } from "next/server";
import { v2 as cloudinary } from "cloudinary";
import { requireAdminRequest } from "@/lib/server/adminRequest";

cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

function toNumber(value: unknown): number | null {
  return typeof value === "number" && Number.isFinite(value) ? value : null;
}

export async function GET(request: Request) {
  const unauthorized = requireAdminRequest(request);
  if (unauthorized) return unauthorized;

  try {
    if (
      !process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME ||
      !process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY ||
      !process.env.CLOUDINARY_API_SECRET
    ) {
      return NextResponse.json(
        { ok: false, error: "Cloudinary env vars missing" },
        { status: 500 },
      );
    }

    // Cloudinary Admin API: usage endpoint
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const usage: any = await cloudinary.api.usage();

    const usedBytes = toNumber(usage?.storage?.usage);
    const limitBytes = toNumber(usage?.storage?.limit);
    const usedPct =
      usedBytes !== null && limitBytes !== null && limitBytes > 0
        ? Math.max(0, Math.min(1, usedBytes / limitBytes))
        : null;

    return NextResponse.json({
      ok: true,
      storage: {
        usedBytes,
        limitBytes,
        usedPct,
      },
      raw: {
        // keep minimal raw for debugging without leaking too much
        plan: usage?.plan ?? null,
        last_updated: usage?.last_updated ?? null,
      },
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Usage fetch failed";
    return NextResponse.json({ ok: false, error: message }, { status: 500 });
  }
}
