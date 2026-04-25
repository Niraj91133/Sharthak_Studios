export const SITE_URL = "https://sharthakstudio.com";

export type PublicSiteSettings = {
  name: string;
  legalName: string;
  founder: string;
  phoneDisplay: string;
  phoneDigits: string;
  whatsappNumber: string;
  email: string;
  instagramUrl: string;
  instagramHandle: string;
  googleBusinessProfileUrl: string;
  addressLine1: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  serviceAreas: string[];
};

export const DEFAULT_PUBLIC_SITE_SETTINGS: PublicSiteSettings = {
  name: "Sharthak Studio",
  legalName: "Sharthak Studio",
  founder: "Sonu Sharthak",
  phoneDisplay: "+91 70918 76067",
  phoneDigits: "917091876067",
  whatsappNumber: "917091876067",
  email: "gmediastudio598@gmail.com",
  instagramUrl: "https://instagram.com/sharthak_studio",
  instagramHandle: "@sharthak_studio",
  googleBusinessProfileUrl: "",
  addressLine1: "Mirza Galib College, Dr. Q.H. Khan's Compound Building",
  city: "Gaya",
  state: "Bihar",
  postalCode: "823001",
  country: "IN",
  serviceAreas: ["Gaya", "Patna", "Muzaffarpur", "Deoghar", "Bihar"],
};

export function normalizeDigits(value: string): string {
  return value.replace(/\D+/g, "");
}

export function ensureInstagramHandle(value: string): string {
  const trimmed = value.trim();
  if (!trimmed) return "";
  return trimmed.startsWith("@") ? trimmed : `@${trimmed.replace(/^@+/, "")}`;
}

export function buildInstagramUrl(value: string): string {
  const trimmed = value.trim();
  if (!trimmed) return "";
  if (/^https?:\/\//i.test(trimmed)) return trimmed;
  return `https://instagram.com/${trimmed.replace(/^@+/, "")}`;
}

export function withDerivedSiteFields(settings: PublicSiteSettings) {
  const phoneDigits = normalizeDigits(settings.phoneDigits || settings.phoneDisplay);
  const whatsappNumber = normalizeDigits(settings.whatsappNumber || phoneDigits);
  const instagramHandle = ensureInstagramHandle(settings.instagramHandle);
  const instagramUrl = buildInstagramUrl(settings.instagramUrl || instagramHandle);

  return {
    ...settings,
    phoneDigits,
    whatsappNumber,
    instagramHandle,
    instagramUrl,
    googleBusinessProfileUrl: settings.googleBusinessProfileUrl?.trim() || "",
    phoneHref: phoneDigits ? `tel:+${phoneDigits}` : "tel:",
    whatsappHref: whatsappNumber ? `https://wa.me/${whatsappNumber}` : "https://wa.me/",
    emailHref: settings.email ? `mailto:${settings.email}` : "mailto:",
  };
}

export const BUSINESS_DETAILS = withDerivedSiteFields(DEFAULT_PUBLIC_SITE_SETTINGS);

export const DEFAULT_TITLE =
  "Wedding photographer in gaya, Bihar | Sharthak Studio";

export const DEFAULT_DESCRIPTION =
  "Best Wedding photographer & cinematographer in Gaya, Bihar. Sharthak Studio specializes in cinematic wedding films, pre-wedding shoots, maternity, and baby photography in Gaya, Patna, Muzaffarpur, and across Bihar.";

export const DEFAULT_PRICE_RANGE = "$$";
