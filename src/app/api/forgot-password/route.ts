import { createClient } from "@supabase/supabase-js";
import { sendPasswordResetEmail } from "@/lib/resetPass-mailer";
import crypto from 'crypto'
import { NextRequest, NextResponse } from "next/server";

export async function POST (req:NextRequest){

   try {
    
     const {email} = await req.json()

    if(!email){
        console.error('Enter the email')
        return NextResponse.json(
            {error:'Email is required'},
            {status:404}
        )
    }

    const supabaseAdmin = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_SUPABASE_SERVICE_ROLE_KEY!
    )

    const {data:existingUser, error: lookupError} = await supabaseAdmin
                                       .from('user')
                                       .select('email')
                                       .eq('email',email)
                                       .single()

    if(!existingUser || lookupError){
        // We return a 404 so the frontend knows it failed during testing.
        return NextResponse.json(
            { error: 'Email not found in database' },
            { status: 404 }
        )
    }

    await supabaseAdmin
                   .from('password_reset')
                   .delete()
                   .eq('email',email)

    const token = crypto.randomBytes(32).toString('hex')
    const expiresAt = new Date(Date.now() + 30*60*1000)

    const {error:insertError} = await supabaseAdmin
                          .from('password_reset')
                          .insert({
                        email:email,
                        token:token,
                        expires_at:expiresAt       
                          })

    if(insertError){
        console.error("Insert Error: ", insertError)
        return NextResponse.json(
            {error:'Database error: Did you create the password_reset table?'},
            {status: 500}
        )
    }

    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || req.nextUrl.origin
    
    const resetLink = `${baseUrl}/reset-password?token=${token}`

    await sendPasswordResetEmail(email,resetLink)

    return NextResponse.json({
        success:true,
        message:'If the email is registered the email has been sent'
    })

   } catch (error:any) {
    return NextResponse.json(
        {error:error.message || 'Something went wrong trying to send email'},
        {status:500}
    )
   }


}