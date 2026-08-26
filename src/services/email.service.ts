import nodemailer from 'nodemailer';
import { AppError } from '../errors/app.error';

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_APP_PASSWORD,
    },
});

export class EmailService {
    static async sendOtpEmail(
        to: string,
        otp: string,
        context: 'registration' | 'password_reset' | 'resend',
    ) {
        if (!process.env.GMAIL_USER || !process.env.GMAIL_APP_PASSWORD) {
            console.warn(
                `[EmailService] Skipping email send. Configure GMAIL_USER and GMAIL_APP_PASSWORD. OTP for ${to} is ${otp}`,
            );
            return;
        }

        let subject = 'Your OTP Code';
        let html = `<p>Your code is <strong>${otp}</strong>.</p>`;

        if (context === 'registration') {
            subject = 'Welcome to Chat App! Verify your email';
            html = `<p>Welcome! Your email verification code is <strong>${otp}</strong>. It expires in 15 minutes.</p>`;
        } else if (context === 'password_reset') {
            subject = 'Password Reset Request';
            html = `<p>You requested a password reset. Your OTP is <strong>${otp}</strong>. It expires in 15 minutes.</p>`;
        } else if (context === 'resend') {
            subject = 'Your New Email Verification Code';
            html = `<p>You requested a new verification code. Your OTP is <strong>${otp}</strong>. It expires in 15 minutes.</p>`;
        }

        try {
            const info = await transporter.sendMail({
                from: `"ChatApp" <${process.env.GMAIL_USER}>`,
                to: to,
                subject,
                html,
            });

            console.log('Email sent successfully:', info.messageId);
            return info;
        } catch (error) {
            console.error('[EmailService] Failed to send email via Gmail SMTP:', error);
            throw new AppError(1008, 500);
        }
    }
}
