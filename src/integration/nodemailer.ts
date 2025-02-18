import { createTransport, SendMailOptions, Transporter } from 'nodemailer'


class Mail {

    private transporter: Transporter
    private mailOptions: SendMailOptions

    constructor() {
        this.transporter = createTransport({
            service: 'gmail',
            auth: {
                user: 'riyur017@gmail.com',
                pass: 'umxaxhxfoemodrqe'
            }
        })

        this.mailOptions = {
            from: 'riyur017@gmail.com',
            subject: 'Email Verification',
        }
    }

    public sendVerificationEmail(email: string, verifyLink: string): Promise<any> {
        this.mailOptions.to = email,
        this.mailOptions.html = `<h2>Email Verification</h2>
            <p>Click the button below to verify your email address:</p>
            <a href="${verifyLink}" style="text-decoration: none; padding: 10px 20px; background-color: #433D8B; color: white; border-radius: 5px; font-size: 16px; text-align: center; display: inline-block;">
                Verify Email
            </a>
            <p>If you didn't sign up for an account, please ignore this email.</p>`


            return new Promise((resolve, reject) => {
                this.transporter.sendMail(this.mailOptions, (error, info) => {
                    if (error) {
                        console.error('Error sending email:', error.message);
                        reject(error);
                    } else {
                        console.log('Email sent:', info.response);
                        resolve(info);
                    }
                });
            });
    }

    public sendMentorVerificationEmail(email: string, verifyLink: string): Promise<any> {
        this.mailOptions.to = email,
        this.mailOptions.html = `<h2>Email Verification</h2>
            <p>Click the button below to verify your email address:</p>
            <a href="${verifyLink}" style="text-decoration: none; padding: 10px 20px; background-color: #433D8B; color: white; border-radius: 5px; font-size: 16px; text-align: center; display: inline-block;">
                Verify Email
            </a>
            <p>If you didn't sign up for an account, please ignore this email.</p>`


            return new Promise((resolve, reject) => {
                this.transporter.sendMail(this.mailOptions, (error, info) => {
                    if (error) {
                        console.error('Error sending email:', error.message);
                        reject(error);
                    } else {
                        console.log('Email sent:', info.response);
                        resolve(info);
                    }
                });
            });
    }

    public sendRemainderMail(email: string, name: string): Promise<any> {
        this.mailOptions.to = email;
        this.mailOptions.subject = "Reminder: Stay on Track with Learn&Grow!";
        this.mailOptions.html = `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #ddd; border-radius: 10px; background-color: #f9f9f9;">
                <h2 style="text-align: center; color: #433D8B;">Stay Consistent with Learn&Grow!</h2>
                <p style="font-size: 16px; color: #333;">
                    Hello <b>${name}</b>,  
                    We noticed that you haven't studied for a while on <strong>Learn&Grow</strong>.  
                    Remember, consistency is key to mastering new skills!
                </p>
                <p style="font-size: 16px; color: #333;">
                    Take a few minutes today to continue your learning journey. Small steps lead to big success!
                </p>
                <div style="text-align: center; margin: 20px 0;">
                    <a href="http://localhost:3000/pages/student/login" style="text-decoration: none; padding: 10px 20px; background-color: #433D8B; color: white; border-radius: 5px; font-size: 16px; display: inline-block;">
                        Start Learning Now
                    </a>
                </div>
                <p style="font-size: 14px; color: #777; text-align: center;">
                    If you have any questions, feel free to contact us at support@learnandgrow.com.  
                </p>
                <p style="font-size: 14px; color: #777; text-align: center;">Keep learning, keep growing! 🚀</p>
            </div>
        `;
    
        return new Promise((resolve, reject) => {
            this.transporter.sendMail(this.mailOptions, (error, info) => {
                if (error) {
                    console.error('Error sending email:', error.message);
                    reject(error);
                } else {
                    console.log('Email sent:', info.response);
                    resolve(info);
                }
            });
        });
    }
    



    public sendOtp(email: string, otp: string): Promise<any> {
        const verifyLink = `your-verification-link-here`;  // You can add the verification link if needed.
    
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
                } else {
                    console.log('Email sent:', info.response);
                    resolve(info);
                }
            });
        });
    }
    
}

export default Mail



// const mail = new Mail();
// const verifyLink = 'https://your-site.com/verify?token=some-unique-token';  // Replace with your actual verification link
// mail.sendVerificationEmail('recipient@example.com', verifyLink)
//     .then(info => {
//         console.log('Verification email sent successfully:', info);
//     })
//     .catch(error => {
//         console.error('Failed to send verification email:', error);
//     });