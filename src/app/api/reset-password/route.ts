import { createClient } from "@supabase/supabase-js";
import { error } from "console";
import { NextRequest, NextResponse } from "next/server";


export async function POST (req:NextRequest){

    try {
        
        const {password,token} = await req.json()

        if(!password || !token){
            return NextResponse.json(
                {error:'Password and token is required'},
                {status:400}
            )
        }

        if(password.length<8){
            return NextResponse.json(
                {error:'Password must be more then 8 characters'},
                {status:400}
            )
        }

        if(!/[A-Z]/.test(password)){
            return NextResponse.json(
                {error:'Password must contain at least one uppercase letter'},
                {status:400}
            )
        }

        const supabaseAdmin = createClient(
             process.env.NEXT_PUBLIC_SUPABASE_URL!,
             process.env.NEXT_SUPABASE_SERVICE_ROLE_KEY!
        )

        const {data:resetRecord,error:lookupError} = await supabaseAdmin 
                                .from('password_reset')
                                .select('*')
                                .eq('token',token)
                                .single()

        if(!resetRecord || lookupError){

            return NextResponse.json(
                {error:'Invalid or expired link'},
                {status:400}
            )

        }

        //token expiration
        if(new Date(resetRecord.expires_at)<new Date()){
            
            await supabaseAdmin.from('password_reset')
                               .delete()
                               .eq('token',token)

            return NextResponse.json(
                {error:'Reset link has been expired.Please try again'},
                {status:400}
            )

        }

        const {data:{users},error:usersError} = await supabaseAdmin.auth.admin.listUsers()

        const authUser = users.find(u=>u.email === resetRecord.email)

        if(!authUser){
            return NextResponse.json(
                {error:'User not found'},
                {status:400}
            )
        }

        //if user is found in auth user then update the password
        const {error:updateError} = await supabaseAdmin.auth.admin.updateUserById(
            authUser.id,
            {password}
        )

        if(updateError){
            return NextResponse.json(
                {error:'Failed to update the password'},
                {status:400}
            )
        }

        await supabaseAdmin 
                     .from('password_reset')
                     .delete()
                     .eq('token',token)

     return NextResponse.json({ 
        success: true,
        message: 'Password updated successfully!'
         })

    } catch (error: any) {
        return NextResponse.json(
            { error: error.message || 'Something went wrong' },
            { status: 500 }
        )
    }

}