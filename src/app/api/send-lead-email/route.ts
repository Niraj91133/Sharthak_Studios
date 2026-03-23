import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

export async function POST(req: Request) {
    try {
        const { name, phone, event_name, event_date } = await req.json();

        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL_USER || 'gmediastudio598@gmail.com',
                pass: process.env.EMAIL_PASS || 'smtd rihk wxvy kgbq'
            }
        });

        const mailOptions = {
            from: `"Sharthak Studio Bot" <${process.env.EMAIL_USER || 'gmediastudio598@gmail.com'}>`, // sender address
            to: process.env.EMAIL_USER || 'gmediastudio598@gmail.com', // list of receivers
            subject: `✨ New Photography Lead: ${name}`, // Subject line
            html: `
                <div style="font-family: sans-serif; padding: 20px; border: 1px solid #eee; border-radius: 10px; max-width: 600px; color: #333;">
                    <h1 style="color: #000; border-bottom: 2px solid #000; padding-bottom: 10px; margin-bottom: 20px;">Sharthak Studio - New Lead Captured</h1>
                    <p><strong>Name:</strong> ${name}</p>
                    <p><strong>Phone:</strong> ${phone}</p>
                    <p><strong>Event Name:</strong> ${event_name || 'Not specified'}</p>
                    <p><strong>Event Date:</strong> ${event_date || 'Not specified'}</p>
                    <hr style="border: 0; border-top: 1px solid #eee; margin: 20px 0;" />
                    <p style="font-size: 12px; color: #777;">This inquiry was captured automatically via the Sharthak Studio landing page popup.</p>
                </div>
            `
        };

        await transporter.sendMail(mailOptions);

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Email sending failed:', error);
        return NextResponse.json({ error: 'Failed to send email notification' }, { status: 500 });
    }
}
