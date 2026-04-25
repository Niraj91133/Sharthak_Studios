import { NextResponse } from "next/server";
import nodemailer from "nodemailer";
import { getPublicSiteSettings } from "@/lib/server/siteSettings";

const RATE_LIMIT_WINDOW_MS = 10 * 60 * 1000;
const RATE_LIMIT_MAX_REQUESTS = 5;
const requestLog = new Map<string, number[]>();

function getClientIp(req: Request): string {
    return req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
}

function isRateLimited(ip: string): boolean {
    const now = Date.now();
    const recent = (requestLog.get(ip) || []).filter((timestamp) => now - timestamp < RATE_LIMIT_WINDOW_MS);
    if (recent.length >= RATE_LIMIT_MAX_REQUESTS) {
        requestLog.set(ip, recent);
        return true;
    }
    recent.push(now);
    requestLog.set(ip, recent);
    return false;
}

function cleanInput(value: unknown, maxLength: number): string {
    if (typeof value !== "string") return "";
    return value.replace(/\s+/g, " ").trim().slice(0, maxLength);
}

export async function POST(req: Request) {
    try {
        const ip = getClientIp(req);
        if (isRateLimited(ip)) {
            return NextResponse.json({ error: "Too many requests. Please try again shortly." }, { status: 429 });
        }

        const body = await req.json();
        const name = cleanInput(body?.name, 80);
        const phone = cleanInput(body?.phone, 30);
        const event_name = cleanInput(body?.event_name, 80);
        const event_date = cleanInput(body?.event_date, 40);

        if (!name || !phone) {
            return NextResponse.json({ error: "Name and phone are required." }, { status: 400 });
        }

        const emailUser = process.env.EMAIL_USER;
        const emailPass = process.env.EMAIL_PASS;
        if (!emailUser || !emailPass) {
            return NextResponse.json(
                { error: "Email env vars missing (EMAIL_USER, EMAIL_PASS)" },
                { status: 500 }
            );
        }

        const transporter = nodemailer.createTransport({
            host: 'smtp.gmail.com',
            port: 465,
            secure: true,
            auth: {
                user: emailUser,
                pass: emailPass.replace(/\s+/g, '')
            }
        });

        const siteSettings = await getPublicSiteSettings();

        const mailOptions = {
            from: `"Sharthak Studio Bot" <${emailUser}>`, // sender address
            to: siteSettings.email || emailUser, // list of receivers
            subject: `✨ New Photography Lead: ${name}`, // Subject line
            html: `
                <div style="font-family: sans-serif; padding: 20px; border: 1px solid #eee; border-radius: 10px; max-width: 600px; color: #333;">
                    <h1 style="color: #000; border-bottom: 2px solid #000; padding-bottom: 10px; margin-bottom: 20px;">Sharthak Studio - New Lead Captured</h1>
                    <p><strong>Name:</strong> ${name}</p>
                    <p><strong>Phone:</strong> ${phone}</p>
                    <p><strong>Event Name:</strong> ${event_name || "Not specified"}</p>
                    <p><strong>Event Date:</strong> ${event_date || "Not specified"}</p>
                    <hr style="border: 0; border-top: 1px solid #eee; margin: 20px 0;" />
                    <p style="font-size: 12px; color: #777;">This inquiry was captured automatically via the Sharthak Studio landing page popup.</p>
                </div>
            `
        };

        await transporter.sendMail(mailOptions);

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("Email sending failed:", error);
        return NextResponse.json({ error: "Failed to send email notification" }, { status: 500 });
    }
}
