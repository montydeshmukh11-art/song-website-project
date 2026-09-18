import { NextRequest, NextResponse } from "next/server";
import { createClient as createServerClient } from "@/utils/supabase/server";
import { createClient as createAdminClient } from "@supabase/supabase-js";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
}

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

            const {data:userData} = await supabaseAdmin
                            .from('user')
                            .select('email')
                            .eq('username',identifier)
                            .single()

            if(userData?.email){
                emailToLogin = userData.email
            }else{
                return NextResponse.json(
                    {error:'User not found with the username'},
                    {
                        status:404,headers:corsHeaders
                    }
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
                    {
                        status:404,headers:corsHeaders
                    }
                )
            }

            return NextResponse.json(
                {
                    success:true,
                    message:'User logged in successfully',
                    user:{
                        id:data.user.id,
                        email:data.user.email,
                        username:data.user.user_metadata?.username || identifier
                    },
                    token:data.session.access_token
                },
                {
                    status:200,headers:corsHeaders
                }
            )

    } catch (error:any){
        return NextResponse.json(
            {error:error.message},
            {
                status:400,headers:corsHeaders
            }
        )
    }
}


export async function OPTIONS(){
    
    return NextResponse.json({},{
      headers:corsHeaders
    })

}