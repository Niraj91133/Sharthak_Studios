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
    phoneHref: phoneDigits ? `tel:+${phoneDigits}` : "tel:",
    whatsappHref: whatsappNumber ? `https://wa.me/${whatsappNumber}` : "https://wa.me/",
    emailHref: settings.email ? `mailto:${settings.email}` : "mailto:",
  };
}

export const BUSINESS_DETAILS = withDerivedSiteFields(DEFAULT_PUBLIC_SITE_SETTINGS);

export const DEFAULT_TITLE =
  "Sharthak Studio | Wedding Photographer & Cinematographer in Gaya, Bihar";

export const DEFAULT_DESCRIPTION =
  "Sharthak Studio is a wedding photographer and cinematographer in Gaya, Bihar for weddings, pre-wedding shoots, maternity, baby shoots, and event coverage across Bihar.";
