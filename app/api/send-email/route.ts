import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

export async function POST(request:any) {
    try {
        const { subject, message, sendTo } = await request.json();

        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.GMAIL_USER,
                pass: process.env.GMAIL_PASS,
            },
        });

        const mailOptions = {
            from: process.env.GMAIL_USER,
            to: sendTo,
            subject: subject,
            html: message,
        };

        await transporter.sendMail(mailOptions);

        return NextResponse.json({ message: "Email sent successfully" }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ message: "Failed to send email" }, { status: 500 });
    }
}