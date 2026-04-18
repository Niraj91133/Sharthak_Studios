import { NextResponse } from "next/server";

export async function GET() {
    try {
        const res = await fetch("http://localhost:3001/qr", {
            cache: 'no-store'
        });
        const data = await res.json();
        return NextResponse.json(data);
    } catch (error) {
        return NextResponse.json({ status: "disconnected", error: "WhatsApp Server Offline" }, { status: 502 });
    }
}
