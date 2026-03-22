"use client";

import { useMemo } from "react";
import { useMediaContext } from "@/context/MediaContext";
import { normalizeMediaUrl } from "@/lib/normalizeMediaUrl";

export type MediaAsset = {
  src: string;
  isUploaded: boolean;
  type?: string;
};

/**
 * Returns media source + whether it's an uploaded (LIVE) asset.
 * Use `isUploaded` to switch object-fit to `contain` to avoid cropping.
 */
export function useMediaAsset(slotId: string, fallback: string): MediaAsset {
  const { getSlot } = useMediaContext();
  const slot = getSlot(slotId);

  return useMemo(() => {
    const isUploaded = Boolean(slot?.uploadedFile && slot.useOnSite);
    const src = isUploaded ? normalizeMediaUrl(slot!.uploadedFile!.url) : fallback;
    return { src, isUploaded, type: slot?.type };
  }, [fallback, slot]);
}

