import { NextResponse } from "next/server";

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const baseUrl = process.env.WHATSAPP_SERVER_URL || "http://127.0.0.1:3001";
        const targetUrl = `${baseUrl.replace(/\/$/, '')}/send`;

        const res = await fetch(targetUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Bypass-Tunnel-Reminder': 'true'
            },
            body: JSON.stringify(body),
            signal: AbortSignal.timeout(30000) // 30 second timeout for PDF sending
        });

        const data = await res.json();
        if (res.ok) {
            return NextResponse.json(data);
        } else {
            return NextResponse.json(data, { status: res.status });
        }
    } catch (error) {
        console.error("WhatsApp Send Proxy Error:", error);
        return NextResponse.json({
            error: "WhatsApp Server Communication Failed",
            details: error instanceof Error ? error.message : "Connect failed"
        }, { status: 502 });
    }
}
