import nodemailer from 'nodemailer'

// Add this NEW function below your existing sendVerificationEmail function
export const sendPasswordResetEmail = async (email: string, reset_link: string) => {
    try {
        const transporter = nodemailer.createTransport({
            host: "smtp.resend.com",
            port: 465,
            auth: {
                user: 'resend',
                pass: process.env.RESEND_API_KEY!
            }
        })

        const mailOptions = {
            from: 'melodyStream <onboarding@resend.dev>',
            to: email,
            subject: 'Reset Your MelodyStream Password',
            html: `
                <div style="font-family: Arial, sans-serif; padding: 20px; text-align: center;">
                    <h2>Password Reset Request 🔑</h2>
                    <p>We received a request to reset your MelodyStream password.</p>
                    <p>Click the button below to set a new password. This link expires in <strong>30 minutes</strong>.</p>
                    <a href="${reset_link}" style="display: inline-block; padding: 10px 20px; background-color: #8b5cf6; color: white; text-decoration: none; border-radius: 5px; margin-top: 15px;">Reset Password</a>
                    <p style="margin-top: 20px; color: #666; font-size: 12px;">If you didn't request this, you can safely ignore this email. Your password will not change.</p>
                </div>
            `
        }

        const mailer = await transporter.sendMail(mailOptions)
        console.log('Password reset email sent! Message Id:', mailer.messageId)
        return { success: true }

    } catch (error) {
        console.error('Error sending password reset email:', error)
        throw error
    }
}
