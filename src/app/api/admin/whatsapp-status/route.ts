import { NextResponse } from "next/server";

export async function GET() {
    // Try multiple local addresses to find where the express server is listening
    const targets = [
        "http://127.0.0.1:3001/qr",
        "http://localhost:3001/qr",
        "http://[::1]:3001/qr"
    ];

    let lastError: any = null;

    for (const url of targets) {
        try {
            const res = await fetch(url, {
                cache: 'no-store',
                next: { revalidate: 0 },
                signal: AbortSignal.timeout(3000)
            });

            if (res.ok) {
                const data = await res.json();
                return NextResponse.json(data);
            }
        } catch (e) {
            lastError = e;
            continue;
        }
    }

    return NextResponse.json({
        status: "disconnected",
        error: "WhatsApp Server Offline",
        debug: lastError instanceof Error ? lastError.message : "Connect failed",
        code: lastError?.code || "UNKNOWN",
        timestamp: new Date().toISOString()
    }, { status: 200 });
}
