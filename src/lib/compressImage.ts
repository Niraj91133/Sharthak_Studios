"use client";

export type CompressImageOptions = {
  maxBytes: number;
  targetRatio: number; // 0.5 - 0.7 recommended
  maxDimension: number; // e.g. 2600
};

function clamp(n: number, min: number, max: number) {
  return Math.max(min, Math.min(max, n));
}

async function loadBitmap(file: File): Promise<ImageBitmap> {
  if ("createImageBitmap" in globalThis) {
    return await createImageBitmap(file);
  }
  throw new Error("Image compression is not supported in this browser.");
}

async function canvasToBlob(
  canvas: HTMLCanvasElement,
  type: string,
  quality: number,
): Promise<Blob> {
  return await new Promise<Blob>((resolve, reject) => {
    canvas.toBlob(
      (blob) => {
        if (!blob) reject(new Error("Failed to encode image."));
        else resolve(blob);
      },
      type,
      quality,
    );
  });
}

function pickOutputType(): string {
  // Prefer modern formats; browser will fall back if unsupported.
  return "image/webp";
}

export async function compressImageFile(
  file: File,
  {
    maxBytes,
    targetRatio,
    maxDimension,
  }: CompressImageOptions,
): Promise<File> {
  if (!file.type.startsWith("image/")) return file;

  const targetBytes = Math.min(maxBytes, Math.floor(file.size * clamp(targetRatio, 0.5, 0.7)));
  const outType = pickOutputType();

  // Iteratively adjust quality, keeping it high as possible.
  const qualities = [0.92, 0.9, 0.88, 0.86, 0.84, 0.82, 0.8, 0.78, 0.76, 0.74];
  const scaleSteps = [1, 0.92, 0.84, 0.76, 0.68, 0.6, 0.52];
  let bestBlob: Blob | null = null;
  let bestBlobSize = Number.POSITIVE_INFINITY;

  for (const scaleStep of scaleSteps) {
    const bitmap = await loadBitmap(file);

    const originalW = bitmap.width;
    const originalH = bitmap.height;

    const stepMaxDimension = Math.max(640, Math.round(maxDimension * scaleStep));
    const maxDim = Math.max(originalW, originalH);
    const scale = maxDim > stepMaxDimension ? stepMaxDimension / maxDim : 1;

    const outW = Math.max(1, Math.round(originalW * scale));
    const outH = Math.max(1, Math.round(originalH * scale));

    const canvas = document.createElement("canvas");
    canvas.width = outW;
    canvas.height = outH;

    const ctx = canvas.getContext("2d", { alpha: false });
    if (!ctx) throw new Error("Failed to initialize image compressor.");

    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = "high";
    ctx.drawImage(bitmap, 0, 0, outW, outH);
    bitmap.close?.();

    for (const q of qualities) {
      const blob = await canvasToBlob(canvas, outType, q);
      if (blob.size < bestBlobSize) {
        bestBlob = blob;
        bestBlobSize = blob.size;
      }
      // Stop early once we hit our desired target (or hard cap).
      if (blob.size <= targetBytes || blob.size <= maxBytes) {
        bestBlob = blob;
        bestBlobSize = blob.size;
        break;
      }
    }

    if (bestBlob && bestBlob.size <= maxBytes) break;
  }

  if (!bestBlob) return file;

  // If compression doesn't help, keep the original.
  if (bestBlob.size >= file.size) return file;

  // If we still can't get under the hard cap, fail fast so callers can show a clear message.
  if (bestBlob.size > maxBytes) {
    throw new Error("Could not compress this image under the upload limit. Try a smaller resolution image.");
  }

  const baseName = file.name.replace(/\.[^/.]+$/, "");
  const outName = `${baseName}.webp`;
  return new File([bestBlob], outName, { type: outType, lastModified: Date.now() });
}
