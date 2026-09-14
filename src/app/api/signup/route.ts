import { createClient } from "@supabase/supabase-js"
import { NextRequest, NextResponse } from "next/server"
import { sendVerificationEmail } from "@/lib/Verification-mailer"
import crypto from 'crypto'

export async function POST(req:NextRequest){

    try {
        
        const {email,password,username} = await req.json()        

        const supabaseAdmin = createClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL!,
            process.env.NEXT_SUPABASE_SERVICE_ROLE_KEY!
        )

        // check if user exists in the database
        const {data:existingUser} = await supabaseAdmin.
                                       from('user')
                                       .select('username')
                                       .eq('username',username)
                                       .single()

        if(existingUser){
            return NextResponse.json(
                {error:"User already exists"},
                {status:400}
            )
        }

        // check if email exists in the database
        const {data:existingAuth} = await supabaseAdmin
                                           .from('user')
                                           .select('email')
                                           .eq('email',email)
                                           .single()

        if(existingAuth){
            return NextResponse.json(
                {error:'Email already registered'},
                {status:400}
            )
        }

        // Delete any existing pending user for the email in case they are re-signing up
        await supabaseAdmin
              .from('pending_user')
              .delete()
              .eq('email',email)

        
        const token = crypto.randomBytes(32).toString('hex') 
      
        const expiresAt = new Date(Date.now() + 1*1000*60*60) //means 1 hours

        const {error:insertError} = await supabaseAdmin
                                           .from('pending_user')
                                           .insert({
                                            email,
                                            username,
                                            password,
                                            token,
                                            expires_at:expiresAt
                                           })

        if(insertError){
            return NextResponse.json(
                {error:'Failed to process signup'},
                {status:500}
            )
        }

        // Build verification Url
          const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || req.nextUrl.origin

          const verificationLink = `${baseUrl}/api/verify-email?token=${token}`

        //   Send verification email

         await sendVerificationEmail(email,username,verificationLink)

         return NextResponse.json({
            success:true,
            message:'Verification email has been sent'
         }
        )

    } catch (error:any){
        return NextResponse.json(
            {error:error.message || 'Something went wrong while signing up'},
            {status:500}
        )
    }
}