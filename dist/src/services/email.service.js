"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.EmailService = void 0;
const nodemailer_1 = __importDefault(require("nodemailer"));
const app_error_1 = require("../errors/app.error");
const transporter = nodemailer_1.default.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_APP_PASSWORD,
    },
});
class EmailService {
    static async sendOtpEmail(to, otp, context) {
        if (!process.env.GMAIL_USER || !process.env.GMAIL_APP_PASSWORD) {
            console.warn(`[EmailService] Skipping email send. Configure GMAIL_USER and GMAIL_APP_PASSWORD. OTP for ${to} is ${otp}`);
            return;
        }
        let subject = 'Your OTP Code';
        let html = `<p>Your code is <strong>${otp}</strong>.</p>`;
        if (context === 'registration') {
            subject = 'Welcome to Chat App! Verify your email';
            html = `<p>Welcome! Your email verification code is <strong>${otp}</strong>. It expires in 15 minutes.</p>`;
        }
        else if (context === 'password_reset') {
            subject = 'Password Reset Request';
            html = `<p>You requested a password reset. Your OTP is <strong>${otp}</strong>. It expires in 15 minutes.</p>`;
        }
        else if (context === 'resend') {
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
        }
        catch (error) {
            console.error('[EmailService] Failed to send email via Gmail SMTP:', error);
            throw new app_error_1.AppError(1008, 500);
        }
    }
}
exports.EmailService = EmailService;
