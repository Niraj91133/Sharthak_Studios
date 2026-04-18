import { NextResponse } from "next/server";

export async function GET() {
    try {
        // Use 127.0.0.1 instead of localhost to avoid IPv6 issues in Node 18+
        const res = await fetch("http://127.0.0.1:3001/qr", {
            cache: 'no-store',
            next: { revalidate: 0 },
            signal: AbortSignal.timeout(8000) // Increased timeout to 8s
        });

        if (!res.ok) {
            throw new Error(`Server responded with ${res.status}`);
        }

        const data = await res.json();
        return NextResponse.json(data);
    } catch (error) {
        console.error("WhatsApp Status Proxy Error:", error);

        return NextResponse.json({
            status: "disconnected",
            error: "WhatsApp Server Offline",
            debug: error instanceof Error ? error.message : "Connection failed",
            timestamp: new Date().toISOString()
        }, { status: 200 }); // Return 200 so the frontend can read the JSON error
    }
}
