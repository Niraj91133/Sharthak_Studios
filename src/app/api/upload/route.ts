import { NextResponse } from "next/server";
import { v2 as cloudinary } from "cloudinary";
import type { UploadApiErrorResponse, UploadApiOptions, UploadApiResponse } from "cloudinary";

export const runtime = "nodejs";

cloudinary.config({
    cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
    api_key: process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

function safePublicId(fileName: string) {
    const base = (fileName || "upload").replace(/\.[^/.]+$/, "");
    const slug = base
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "")
        .slice(0, 80);
    return slug || `upload-${Date.now()}`;
}

// Route Handlers in App Router do not use 'export const config' for bodyParser.
// Use 'nextConfig.experimental.serverActions.bodySizeLimit' or similar next.config settings instead.

export async function POST(request: Request) {
    try {
        if (!process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || !process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY || !process.env.CLOUDINARY_API_SECRET) {
            return NextResponse.json({ error: "Cloudinary env vars missing. Check .env.local" }, { status: 500 });
        }

        const formData = await request.formData();
        const file = formData.get("file") as File;

        if (!file) {
            return NextResponse.json({ error: "No file provided" }, { status: 400 });
        }

        // Server-side size check (301MB to be safe)
        if (file.size > 301 * 1024 * 1024) {
            return NextResponse.json({ error: "File too large (>300MB)" }, { status: 413 });
        }

        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(new Uint8Array(bytes));
        const fileName = file.name || "upload";
        const publicId = safePublicId(fileName);

        let uploadOptions: UploadApiOptions = {
            folder: "sharthak_studio",
            public_id: publicId,
            resource_type: "auto",
            overwrite: true,
        };

        const fileExtension = fileName.split('.').pop()?.toLowerCase() || '';
        const isImage = file.type.startsWith("image/") || ['jpg', 'jpeg', 'png', 'webp', 'avif', 'heic'].includes(fileExtension);
        const isVideo =
            file.type.startsWith("video/") ||
            [
                'mp4', 'mov', 'avi', 'mkv', 'webm', 'm4v', 'flv', 'wmv', '3gp', 'ogv',
                'ts', 'mts', 'm2ts'
            ].includes(fileExtension) ||
            // Some browsers send empty type for videos; treat unknown non-images as videos for this endpoint.
            (!isImage && (!file.type || file.type === "application/octet-stream"));

        // Optimized Cloudinary settings for high speed and high quality
        if (isImage) {
            uploadOptions = {
                ...uploadOptions,
                resource_type: "image",
                quality: "auto:best",
                fetch_format: "auto",
            };
        } else if (isVideo) {
            uploadOptions = {
                ...uploadOptions,
                resource_type: "video",
                // Reduce size while maintaining quality: constrain to 1080x1920, encode to MP4 (H.264/AAC),
                // and let Cloudinary pick an efficient quality target.
                transformation: [
                    {
                        crop: "limit",
                        width: 1080,
                        height: 1920,
                        fetch_format: "mp4",
                        video_codec: "h264",
                        audio_codec: "aac",
                        quality: "auto:good",
                    },
                ],
            };
        }

        // Upload to Cloudinary
        const result = await new Promise<UploadApiResponse>((resolve, reject) => {
            const uploadStream = cloudinary.uploader.upload_stream(
                uploadOptions,
                (error?: UploadApiErrorResponse, result?: UploadApiResponse) => {
                    if (error) reject(error);
                    else if (result) resolve(result);
                    else reject(new Error("Upload failed: empty response"));
                }
            );
            uploadStream.end(buffer);
        });

        return NextResponse.json(result);
    } catch (error) {
        console.error("Cloudinary Upload Error:", error);
        const message = error instanceof Error ? error.message : "Upload failed";
        return NextResponse.json({ error: message }, { status: 500 });
    }
}
