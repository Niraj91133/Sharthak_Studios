import { NextResponse } from "next/server";
import nodemailer from "nodemailer";

export async function POST(req: Request) {
    try {
        const { clientName, breakdown, total, pdfBase64 } = await req.json();

        if (!clientName || !total) {
            return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
        }

        const transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS,
            },
        });

        // Email to Admin
        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: process.env.EMAIL_USER, // Sending to yourself
            subject: `✨ Sharthak Studio Quote: ${clientName}`,
            text: `Wedding Package Quote for ${clientName}\nTotal Estimate: ₹${total.toLocaleString()}`,
            html: `
                <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; background: #fff; padding: 40px; border: 1px solid #ddd; border-radius: 20px;">
                    <h1 style="font-size: 24px; font-weight: 900; letter-spacing: -1px; margin-bottom: 5px;">SHARTHAK STUDIO</h1>
                    <p style="font-size: 10px; text-transform: uppercase; letter-spacing: 3px; color: #999; margin-top: 0;">Premium Wedding Cinema & Photography</p>
                    <hr style="border: 0; border-top: 1px solid #eee; margin: 30px 0;" />
                    
                    <h2 style="font-size: 32px; font-weight: 900; margin-bottom: 20px;">Quote for ${clientName}</h2>
                    
                    <table style="width: 100%; border-collapse: collapse; margin-bottom: 30px;">
                        <thead>
                            <tr style="border-bottom: 2px solid #000;">
                                <th style="text-align: left; padding: 15px 0;">Description</th>
                                <th style="text-align: right; padding: 15px 0;">Amount</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${breakdown?.map((day: any) => day.items.length > 0 ? `
                                <tr style="border-bottom: 1px solid #eee;">
                                    <td style="padding: 20px 0;">
                                        <div style="font-weight: bold; font-size: 14px;">Day ${day.dayId}</div>
                                        <div style="font-size: 12px; color: #666;">${day.items.map((i: any) => i.label).join(", ")}</div>
                                    </td>
                                    <td style="text-align: right; font-weight: bold;">₹${day.dayTotal.toLocaleString()}</td>
                                </tr>
                            ` : "").join("")}
                        </tbody>
                    </table>

                    <div style="background: #000; color: #fff; padding: 30px; border-radius: 15px; display: flex; justify-content: space-between; align-items: center;">
                        <span style="font-weight: bold; text-transform: uppercase; font-size: 12px; letter-spacing: 2px; opacity: 0.6;">Grand Total</span>
                        <span style="font-size: 24px; font-weight: 900;">₹${total.toLocaleString()}</span>
                    </div>

                    <div style="margin-top: 40px; font-size: 10px; color: #999; text-transform: uppercase; letter-spacing: 1px;">
                        Attached is the official PDF quote for your records.
                    </div>
                </div>
            `,
            attachments: pdfBase64 ? [
                {
                    filename: `Quote_${clientName.replace(/\s+/g, "_")}.pdf`,
                    content: pdfBase64,
                    encoding: "base64",
                }
            ] : []
        };

        await transporter.sendMail(mailOptions);

        return NextResponse.json({ success: true });
    } catch (error: any) {
        console.error("Email Error:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
