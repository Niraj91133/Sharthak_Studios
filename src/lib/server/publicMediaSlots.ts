import "server-only";

import { SEO_CITIES, type SeoService } from "@/lib/seo";

export type PublicMediaSlot = {
  id: string;
  section: string;
  frame: string;
  type: string;
  categoryLabel?: string;
  orderIndex?: number;
  uploadedFileUrl: string;
  uploadedFileName?: string;
};

function getSupabaseHeaders() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !anonKey) {
    return null;
  }

  return {
    url,
    headers: {
      apikey: anonKey,
      Authorization: `Bearer ${anonKey}`,
      "Content-Type": "application/json",
    },
  };
}

function normalizeCloudinaryUrl(url: string) {
  if (!url.includes("res.cloudinary.com")) return url;
  if (!url.includes("/upload/")) return url;
  if (url.includes("/upload/f_auto") || url.includes("/upload/q_auto")) return url;

  const [prefix, rest] = url.split("/upload/");
  if (!prefix || !rest) return url;
  return `${prefix}/upload/f_auto,q_auto/${rest}`;
}

function normalizeSlot(input: Record<string, unknown>): PublicMediaSlot | null {
  const uploadedFileUrl = typeof input.uploaded_file_url === "string" ? input.uploaded_file_url : "";
  const useOnSite = Boolean(input.use_on_site);
  const type = typeof input.type === "string" ? input.type : "image";

  if (!uploadedFileUrl || !useOnSite || type !== "image") {
    return null;
  }

  return {
    id: typeof input.id === "string" ? input.id : "",
    section: typeof input.section === "string" ? input.section : "",
    frame: typeof input.frame === "string" ? input.frame : "",
    type,
    categoryLabel: typeof input.category_label === "string" ? input.category_label : undefined,
    orderIndex: typeof input.order_index === "number" ? input.order_index : undefined,
    uploadedFileUrl: normalizeCloudinaryUrl(uploadedFileUrl),
    uploadedFileName: typeof input.uploaded_file_name === "string" ? input.uploaded_file_name : undefined,
  };
}

export async function getPublishedMediaSlots(): Promise<PublicMediaSlot[]> {
  const config = getSupabaseHeaders();
  if (!config) return [];

  const res = await fetch(
    `${config.url}/rest/v1/media_slots?select=id,section,frame,type,category_label,order_index,uploaded_file_url,uploaded_file_name,use_on_site&order=order_index.asc.nullslast`,
    {
      headers: config.headers,
      next: { revalidate: 300 },
    },
  );

  if (!res.ok) {
    return [];
  }

  const data = (await res.json()) as unknown;
  if (!Array.isArray(data)) return [];

  return data
    .map((item) => normalizeSlot((item ?? {}) as Record<string, unknown>))
    .filter((item): item is PublicMediaSlot => Boolean(item));
}

function uniqueById<T extends { id: string }>(items: T[]) {
  const seen = new Set<string>();
  return items.filter((item) => {
    if (seen.has(item.id)) return false;
    seen.add(item.id);
    return true;
  });
}

function tokenize(value: string) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, " ")
    .split(" ")
    .filter(Boolean);
}

function scoreSlot(slot: PublicMediaSlot, keywords: string[]) {
  const haystack = `${slot.section} ${slot.frame} ${slot.categoryLabel || ""} ${slot.uploadedFileName || ""}`.toLowerCase();
  let score = 0;

  for (const keyword of keywords) {
    if (haystack.includes(keyword)) score += 4;
    const parts = tokenize(keyword);
    for (const part of parts) {
      if (part.length > 2 && haystack.includes(part)) score += 2;
    }
  }

  if (slot.section.includes("GALLERY")) score += 5;
  if (slot.section.includes("SERVICE")) score += 3;
  if (slot.section.includes("WHY CHOOSE")) score += 2;
  if (slot.orderIndex !== undefined) score += Math.max(0, 10 - slot.orderIndex / 5);

  return score;
}

export function selectMediaForService(
  slots: PublicMediaSlot[],
  service: SeoService,
  cityName?: string,
) {
  const cityKeywords = cityName
    ? [
        cityName.toLowerCase(),
        ...SEO_CITIES.filter((city) => city.name === cityName).flatMap((city) => city.nearbyAreas.map((item) => item.toLowerCase())),
      ]
    : [];

  const keywords = uniqueById(
    [{ id: "base", value: service.name }, { id: "short", value: service.shortName }, { id: "prefix", value: service.titlePrefix }]
      .concat(service.keywords.map((value, index) => ({ id: `kw-${index}`, value })))
      .concat(cityKeywords.map((value, index) => ({ id: `city-${index}`, value })))
      .map((item) => ({ id: item.id, value: item.value.toLowerCase() })),
  ).map((item) => item.value);

  const ranked = [...slots]
    .map((slot) => ({
      slot,
      score: scoreSlot(slot, keywords),
    }))
    .sort((a, b) => b.score - a.score);

  const picked = uniqueById(ranked.map((entry) => entry.slot)).slice(0, 8);
  const fallback = uniqueById(slots).slice(0, 8);
  const finalItems = picked.length >= 4 ? picked : uniqueById([...picked, ...fallback]).slice(0, 8);

  return {
    hero: finalItems[0],
    secondary: finalItems[1],
    gallery: finalItems.slice(0, 6),
  };
}
