import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { requireAdminRequest } from "@/lib/server/adminRequest";

export async function GET(request: Request) {
    const unauthorized = requireAdminRequest(request);
    if (unauthorized) return unauthorized;

    let baseUrl = process.env.WHATSAPP_SERVER_URL;

    // If no ENV var (common on Vercel if user didn't set it), try Supabase
    if (!baseUrl || baseUrl === "http://127.0.0.1:3001") {
        try {
            const { data } = await supabase!
                .from('studio_config')
                .select('value')
                .eq('id', 'whatsapp_url')
                .single();
            if (data?.value) baseUrl = data.value;
        } catch (e) {
            console.error("Supabase config fetch failed:", e);
        }
    }

    if (!baseUrl) baseUrl = "http://127.0.0.1:3001";

    // Try multiple local addresses if baseUrl is the default, otherwise use baseUrl
    const targets = baseUrl === "http://127.0.0.1:3001"
        ? ["http://127.0.0.1:3001/qr", "http://localhost:3001/qr", "http://[::1]:3001/qr"]
        : [`${baseUrl.replace(/\/$/, '')}/qr`];

    let lastError: any = null;

    for (const url of targets) {
        try {
            const res = await fetch(url, {
                cache: 'no-store',
                next: { revalidate: 0 },
                headers: {
                    'Bypass-Tunnel-Reminder': 'true'
                },
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
