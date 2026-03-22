"use client";

/**
 * Normalize media URLs for better cross-browser compatibility.
 * Cloudinary: inject `f_auto,q_auto` so older browsers get a supported format.
 */
export function normalizeMediaUrl(url: string): string {
  if (!url) return url;
  if (!url.includes("res.cloudinary.com")) return url;
  if (!url.includes("/upload/")) return url;
  if (url.includes("/upload/f_auto") || url.includes("/upload/q_auto")) return url;

  const [prefix, rest] = url.split("/upload/");
  if (!prefix || !rest) return url;
  return `${prefix}/upload/f_auto,q_auto/${rest}`;
}

