import { NextResponse } from "next/server";
import { v2 as cloudinary } from "cloudinary";

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

        // Server-side size check (101MB to be safe)
        if (file.size > 101 * 1024 * 1024) {
            return NextResponse.json({ error: "File too large (>100MB)" }, { status: 413 });
        }

        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(new Uint8Array(bytes));
        const fileName = file.name || "upload";
        const publicId = safePublicId(fileName);

        let uploadOptions: any = {
            folder: "sharthak_studio",
            public_id: publicId,
            resource_type: "auto",
            overwrite: true,
        };

        const fileExtension = fileName.split('.').pop()?.toLowerCase() || '';
        const isImage = file.type.startsWith("image/") || ['jpg', 'jpeg', 'png', 'webp', 'avif', 'heic', 'jpg'].includes(fileExtension);
        const isVideo = file.type.startsWith("video/") || ['mp4', 'mov', 'avi', 'mkv', 'webm'].includes(fileExtension);

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
                quality: "auto:best",
                transformation: [
                    { quality: "auto:best" },
                    { fetch_format: "auto" }
                ],
            };
        }

        // Upload to Cloudinary
        const result = await new Promise((resolve, reject) => {
            const uploadStream = cloudinary.uploader.upload_stream(
                uploadOptions,
                (error, result) => {
                    if (error) reject(error);
                    else resolve(result);
                }
            );
            uploadStream.end(buffer);
        });

        return NextResponse.json(result);
    } catch (error: any) {
        console.error("Cloudinary Upload Error:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
