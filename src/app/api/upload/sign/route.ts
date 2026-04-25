import { NextResponse } from "next/server";
import { v2 as cloudinary } from "cloudinary";
import { requireAdminRequest } from "@/lib/server/adminRequest";

cloudinary.config({
    cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
    api_key: process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function POST(request: Request) {
    const unauthorized = requireAdminRequest(request);
    if (unauthorized) return unauthorized;

    try {
        if (!process.env.CLOUDINARY_API_SECRET) {
            return NextResponse.json(
                { error: "Server misconfigured: CLOUDINARY_API_SECRET is missing." },
                { status: 500 }
            );
        }

        const body = await request.json();
        const { paramsToSign } = body;

        if (!paramsToSign) {
            return NextResponse.json({ error: "No params to sign" }, { status: 400 });
        }

        const signature = cloudinary.utils.api_sign_request(paramsToSign, process.env.CLOUDINARY_API_SECRET);

        return NextResponse.json({ signature });
    } catch (error) {
        console.error("Cloudinary Sign Error:", error);
        return NextResponse.json({ error: "Failed to sign" }, { status: 500 });
    }
}
