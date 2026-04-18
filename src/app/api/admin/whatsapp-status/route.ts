import { NextResponse } from "next/server";

export async function GET() {
    try {
        // Use 127.0.0.1 instead of localhost to avoid IPv6 issues in Node 18+
        const res = await fetch("http://127.0.0.1:3001/qr", {
            cache: 'no-store',
            signal: AbortSignal.timeout(5000) // 5 second timeout
        });
        const data = await res.json();
        return NextResponse.json(data);
    } catch (error) {
        console.error("WhatsApp Status Proxy Error:", error);
        return NextResponse.json({
            status: "disconnected",
            error: "WhatsApp Server Offline",
            details: error instanceof Error ? error.message : "Connection failed"
        }, { status: 502 });
    }
}
