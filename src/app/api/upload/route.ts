import { NextResponse } from "next/server";
import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
    cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
    api_key: process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Route Handlers in App Router do not use 'export const config' for bodyParser.
// Use 'nextConfig.experimental.serverActions.bodySizeLimit' or similar next.config settings instead.

export async function POST(request: Request) {
    try {
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
        let buffer = Buffer.from(new Uint8Array(bytes));
        let fileName = file.name;
        // Remove extension from filename for public_id
        const publicId = fileName.substring(0, fileName.lastIndexOf('.')) || fileName;

        let uploadOptions: any = {
            folder: "sharthak_studio",
            public_id: publicId,
            resource_type: "auto",
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
