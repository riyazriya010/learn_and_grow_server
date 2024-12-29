"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const nodemailer_1 = require("nodemailer");
class Mail {
    constructor() {
        this.transporter = (0, nodemailer_1.createTransport)({
            service: 'gmail',
            auth: {
                user: 'riyur017@gmail.com',
                pass: 'umxaxhxfoemodrqe'
            }
        });
        this.mailOptions = {
            from: 'riyur017@gmail.com',
            subject: 'Email Verification',
        };
    }
    sendVerificationEmail(email, verifyLink) {
        this.mailOptions.to = email,
            this.mailOptions.html = `<h2>Email Verification</h2>
            <p>Click the button below to verify your email address:</p>
            <a href="${verifyLink}" style="text-decoration: none; padding: 10px 20px; background-color: #433D8B; color: white; border-radius: 5px; font-size: 16px; text-align: center; display: inline-block;">
                Verify Email
            </a>
            <p>If you didn't sign up for an account, please ignore this email.</p>`;
        return new Promise((resolve, reject) => {
            this.transporter.sendMail(this.mailOptions, (error, info) => {
                if (error) {
                    console.error('Error sending email:', error.message);
                    reject(error);
                }
                else {
                    console.log('Email sent:', info.response);
                    resolve(info);
                }
            });
        });
    }
    sendMentorVerificationEmail(email, verifyLink) {
        this.mailOptions.to = email,
            this.mailOptions.html = `<h2>Email Verification</h2>
            <p>Click the button below to verify your email address:</p>
            <a href="${verifyLink}" style="text-decoration: none; padding: 10px 20px; background-color: #433D8B; color: white; border-radius: 5px; font-size: 16px; text-align: center; display: inline-block;">
                Verify Email
            </a>
            <p>If you didn't sign up for an account, please ignore this email.</p>`;
        return new Promise((resolve, reject) => {
            this.transporter.sendMail(this.mailOptions, (error, info) => {
                if (error) {
                    console.error('Error sending email:', error.message);
                    reject(error);
                }
                else {
                    console.log('Email sent:', info.response);
                    resolve(info);
                }
            });
        });
    }
    sendOtp(email, otp) {
        const verifyLink = `your-verification-link-here`; // You can add the verification link if needed.
        this.mailOptions.to = email;
        this.mailOptions.html = `
            <h2>Email Verification</h2>
            <p>We received a request to verify your email address. Please use the following OTP to complete the verification process:</p>
            <h3 style="font-weight: bold; font-size: 24px; color: #433D8B;">${otp}</h3>
            <p>If you didn't sign up for an account, please ignore this email.</p>
            <p>This OTP will expire in 1 minute.</p>
        `;
        return new Promise((resolve, reject) => {
            this.transporter.sendMail(this.mailOptions, (error, info) => {
                if (error) {
                    console.error('Error sending email:', error.message);
                    reject(error);
                }
                else {
                    console.log('Email sent:', info.response);
                    resolve(info);
                }
            });
        });
    }
}
exports.default = Mail;
// const mail = new Mail();
// const verifyLink = 'https://your-site.com/verify?token=some-unique-token';  // Replace with your actual verification link
// mail.sendVerificationEmail('recipient@example.com', verifyLink)
//     .then(info => {
//         console.log('Verification email sent successfully:', info);
//     })
//     .catch(error => {
//         console.error('Failed to send verification email:', error);
//     });