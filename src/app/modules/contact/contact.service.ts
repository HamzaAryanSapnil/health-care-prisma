import nodemailer from 'nodemailer';
import config from '../../../config';

interface ContactEmailData {
    name: string;
    email: string;
    subject: string;
    message: string;
}

const sendContactEmail = async (data: ContactEmailData) => {
    const transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 587,
        secure: false, // Use `true` for port 465, `false` for all other ports
        auth: {
            user: config.emailSender.email,
            pass: config.emailSender.app_pass,
        },
        tls: {
            rejectUnauthorized: false
        }
    });

    const htmlContent = `
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Contact Form Submission</title>
        </head>
        <body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #f5f5f5;">
            <table role="presentation" style="width: 100%; border-collapse: collapse;">
                <tr>
                    <td align="center" style="padding: 40px 0;">
                        <table role="presentation" style="width: 600px; border-collapse: collapse; background-color: #ffffff; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
                            <!-- Header -->
                            <tr>
                                <td style="padding: 40px 40px 20px 40px; text-align: center; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); border-radius: 8px 8px 0 0;">
                                    <h1 style="margin: 0; color: #ffffff; font-size: 28px; font-weight: 600;">PH Health Care</h1>
                                </td>
                            </tr>
                            <!-- Content -->
                            <tr>
                                <td style="padding: 40px;">
                                    <h2 style="margin: 0 0 20px 0; color: #333333; font-size: 24px; font-weight: 600;">New Contact Form Submission</h2>
                                    
                                    <div style="background-color: #f5f5f5; padding: 20px; border-radius: 8px; margin: 20px 0;">
                                        <p style="margin: 0 0 10px 0; color: #666666; font-size: 16px; line-height: 24px;">
                                            <strong style="color: #333333;">Name:</strong> ${data.name}
                                        </p>
                                        <p style="margin: 0 0 10px 0; color: #666666; font-size: 16px; line-height: 24px;">
                                            <strong style="color: #333333;">Email:</strong> <a href="mailto:${data.email}" style="color: #667eea; text-decoration: none;">${data.email}</a>
                                        </p>
                                        <p style="margin: 0; color: #666666; font-size: 16px; line-height: 24px;">
                                            <strong style="color: #333333;">Subject:</strong> ${data.subject}
                                        </p>
                                    </div>
                                    
                                    <div style="margin-top: 20px;">
                                        <h3 style="margin: 0 0 15px 0; color: #333333; font-size: 18px; font-weight: 600;">Message:</h3>
                                        <p style="margin: 0; color: #666666; font-size: 16px; line-height: 24px; white-space: pre-wrap;">${data.message}</p>
                                    </div>
                                </td>
                            </tr>
                            <!-- Footer -->
                            <tr>
                                <td style="padding: 20px 40px; text-align: center; background-color: #f5f5f5; border-radius: 0 0 8px 8px;">
                                    <p style="margin: 0; color: #999999; font-size: 12px;">
                                        This email was sent from the PH Health Care contact form.
                                    </p>
                                </td>
                            </tr>
                        </table>
                    </td>
                </tr>
            </table>
        </body>
        </html>
    `;

    const info = await transporter.sendMail({
        from: '"PH Health Care" <shafayat.ph@gmail.com>', // sender address
        to: 'hamzaswapnil@gmail.com', // recipient email
        replyTo: data.email, // reply to user's email
        subject: `Contact Form: ${data.subject}`, // Subject line
        html: htmlContent, // html body
    });

    return info;
};

export const ContactService = {
    sendContactEmail
};

