import { NextRequest, NextResponse } from "next/server";
import { createClient as createServerClient } from "@/utils/supabase/server";
import { createClient as createAdminClient } from "@supabase/supabase-js";

export async function POST (req:NextRequest){

    try {
        
        const {identifier,password} = await req.json()

        const supabase = await createServerClient()

        let emailToLogin = identifier

        if(!identifier.includes('@')){

            const supabaseAdmin = createAdminClient(
                process.env.NEXT_PUBLIC_SUPABASE_URL!,
                process.env.NEXT_SUPABASE_SERVICE_ROLE_KEY!
            )

            const {data:userData,error:userError} = await supabaseAdmin
                            .from('user')
                            .select('email')
                            .eq('username',identifier)
                            .single()

            if(userData?.email){
                emailToLogin = userData.email
            }else{
                return NextResponse.json(
                    {error:'User not found with the username'},
                    {status:404}
                )
            }
        }

         const {data,error} = await supabase.auth.signInWithPassword({
                email:emailToLogin,
                password
            })

            if(error){
                return NextResponse.json(
                    {error:error.message},
                    {status:404}
                )
            }

            return NextResponse.json(
                {
                    success:true,
                    message:'User logged in successfully',
                    user:data.user
                },
                {status:200}
            )

    } catch (error:any){
        return NextResponse.json(
            {error:error.message}
        )
    }
}