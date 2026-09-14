import nodemailer from 'nodemailer'

export const sendVerificationEmail = async (email:string,username:string,action_link:string)=>{

   try { const transporter = nodemailer.createTransport({
        host:"smtp.resend.com",
        port:465,
        auth:{
            user:'resend',
            pass:process.env.RESEND_API_KEY!
        }
    })

    const mailOptions = {
        from:'melodyStream <onboarding@resend.dev>',
        to:email,
        subject:'Verify your email account',
        html:`
         <div style="font-family: Arial, sans-serif; padding: 20px; text-align: center;">
                    <h2>Welcome to MelodyStream! 🎵</h2>
                    <p>Hi ${username},</p>
                    <p>Thank you for signing up. Please click the button below to verify your email address:</p>
                    <a href="${action_link}" style="display: inline-block; padding: 10px 20px; background-color: #8b5cf6; color: white; text-decoration: none; border-radius: 5px; margin-top: 15px;">Verify My Email</a>
                    <p style="margin-top: 20px; color: #666; font-size: 12px;">If you didn't request this, you can safely ignore this email.</p>
                </div>
        `
    }

    const mailer = await transporter.sendMail(mailOptions)

    console.log('Email sent successfully to mailtrap! Message Id: %s',mailer.messageId)

    return {success:true}

}
    catch(error){
         console.error('Error sending verification email:',error)
         throw error
    }

}