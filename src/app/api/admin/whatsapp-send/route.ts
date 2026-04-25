import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { requireAdminRequest } from "@/lib/server/adminRequest";

export async function POST(req: Request) {
    const unauthorized = requireAdminRequest(req);
    if (unauthorized) return unauthorized;

    try {
        const body = await req.json();
        let baseUrl = process.env.WHATSAPP_SERVER_URL;

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
