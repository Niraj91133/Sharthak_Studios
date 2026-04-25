import { NextResponse } from "next/server";
import { requireAdminRequest } from "@/lib/server/adminRequest";
import {
  getAdminUsername,
  getPublicSiteSettings,
  updateAdminSettings,
  updatePublicSiteSettings,
} from "@/lib/server/siteSettings";

function toStringArray(value: unknown) {
  if (!Array.isArray(value)) return [];
  return value.map((item) => String(item || "")).filter(Boolean);
}

export async function GET(request: Request) {
  const unauthorized = requireAdminRequest(request);
  if (unauthorized) return unauthorized;

  const [publicSettings, adminUsername] = await Promise.all([
    getPublicSiteSettings(),
    getAdminUsername(),
  ]);

  return NextResponse.json({
    public: publicSettings,
    admin: {
      username: adminUsername,
    },
  });
}

export async function PUT(request: Request) {
  const unauthorized = requireAdminRequest(request);
  if (unauthorized) return unauthorized;

  try {
    const body = await request.json();
    const publicInput = (body?.public ?? {}) as Record<string, unknown>;
    const adminInput = (body?.admin ?? {}) as Record<string, unknown>;

    const currentUsername = await getAdminUsername();
    const username = typeof adminInput.username === "string" ? adminInput.username : undefined;
    const currentPassword = typeof adminInput.currentPassword === "string" ? adminInput.currentPassword : undefined;
    const newPassword = typeof adminInput.newPassword === "string" ? adminInput.newPassword : undefined;
    const shouldUpdateAdmin = Boolean(
      (username && username.trim() && username.trim() !== currentUsername) ||
      (newPassword && newPassword.trim()),
    );

    const adminSettings = shouldUpdateAdmin
      ? await updateAdminSettings({ username, currentPassword, newPassword })
      : { username: currentUsername };

    const publicSettings = await updatePublicSiteSettings({
      name: typeof publicInput.name === "string" ? publicInput.name : undefined,
      legalName: typeof publicInput.legalName === "string" ? publicInput.legalName : undefined,
      founder: typeof publicInput.founder === "string" ? publicInput.founder : undefined,
      phoneDisplay: typeof publicInput.phoneDisplay === "string" ? publicInput.phoneDisplay : undefined,
      phoneDigits: typeof publicInput.phoneDigits === "string" ? publicInput.phoneDigits : undefined,
      whatsappNumber: typeof publicInput.whatsappNumber === "string" ? publicInput.whatsappNumber : undefined,
      email: typeof publicInput.email === "string" ? publicInput.email : undefined,
      instagramUrl: typeof publicInput.instagramUrl === "string" ? publicInput.instagramUrl : undefined,
      instagramHandle: typeof publicInput.instagramHandle === "string" ? publicInput.instagramHandle : undefined,
      addressLine1: typeof publicInput.addressLine1 === "string" ? publicInput.addressLine1 : undefined,
      city: typeof publicInput.city === "string" ? publicInput.city : undefined,
      state: typeof publicInput.state === "string" ? publicInput.state : undefined,
      postalCode: typeof publicInput.postalCode === "string" ? publicInput.postalCode : undefined,
      country: typeof publicInput.country === "string" ? publicInput.country : undefined,
      serviceAreas: toStringArray(publicInput.serviceAreas),
    });

    return NextResponse.json({
      ok: true,
      public: publicSettings,
      admin: adminSettings,
    });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to update settings." },
      { status: 400 },
    );
  }
}
