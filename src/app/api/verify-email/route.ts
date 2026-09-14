import { createClient } from "@supabase/supabase-js";
import { NextResponse,NextRequest } from "next/server";

export async function GET (req:NextRequest){

    try {
        
        const token = req.nextUrl.searchParams.get('token')

        if(!token){
            return NextResponse.redirect(
                new URL(`/login?error=Invalid verification link`,req.url)
            )
        }

        const supabaseAdmin = createClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL!,
            process.env.NEXT_SUPABASE_SERVICE_ROLE_KEY!
        )

        //Search the pending user by the token
        const {data:pendingUser,error:lookupError} = await supabaseAdmin
                                                           .from('pending_user')
                                                           .select('*')
                                                           .eq('token',token)
                                                           .single()
        
        if(lookupError || !pendingUser){
            console.error('Lookup error',lookupError)
            return NextResponse.redirect(
                new URL('/login?error=Invalid or expired verification URL',req.url)
            )
        }

        //Token expiration check
        if(new Date(pendingUser.expires_at) < new Date()){
            await supabaseAdmin
                      .from('pending_user')
                      .delete()
                      .eq('token',token)

            return NextResponse.redirect(
                new URL('/login?error=Verification link expired signup again',req.url)
            )          
        }

        // check if auth user already exists (handles double-click / browser prefetch)
        const {data:existingAuthLookUp} = await supabaseAdmin.auth.admin.getUserById(pendingUser.id)

        const existingAuthUser = existingAuthLookUp?.user || null

        let userId:string

        if(existingAuthUser){
            // Auth user already exists 
            userId = existingAuthUser.id
        }else{
            
            const {data:authData,error:authError} = await supabaseAdmin.auth.admin.createUser({
                email:pendingUser.email,
                password:pendingUser.password,
                email_confirm:true
            })

            if(authError){
                console.error('Create auth error',authError)
                return NextResponse.redirect(
                    new URL(`/login?error=${encodeURIComponent(authError.message)}`,req.url)
                )
            }

            if(!authData?.user){
                console.error('Auth user creation returned no user data')
                return NextResponse.redirect(
                    new URL(`/login?error=Failed to create account.Please try again`,req.url)
                )
            }

            userId = authData.user.id
        }

        //check if user profile already exists
        const {data:existingProfile,error:profileLookupError} = await supabaseAdmin
                                              .from('user')
                                              .select('id')
                                              .eq('id',userId)
                                              .single()  
        

        if(profileLookupError && profileLookupError.code !== 'PGRST116'){
            //PGRST116 means no rows found 
            console.error('Profile lookup error ',profileLookupError)
        }

        if(!existingProfile){

            //insert user into the table
            const {error:userError} = await supabaseAdmin
                                  .from('user')
                                  .insert({
                                    id:userId,
                                    email:pendingUser.email,
                                    username:pendingUser.username
                                  })

            if(userError){
          //only clean up auth user if we just created it

          console.error('User profile insert error',userError)

          if(!existingAuthUser){
            await supabaseAdmin.auth.admin.deleteUser(userId)
          }

          return NextResponse.redirect(
            new URL(`/login?error=Failed to create user profile.Please try again`,req.url)
          )
            }

        }

        //delete the pending user record after the whole process
       const {error:deleteError} =  await supabaseAdmin
                     .from('pending_user')
                     .delete()
                     .eq('token',token)

        if(deleteError){
            console.error('Pemnding user cleanup error ',deleteError)
        }

        return NextResponse.redirect(
            new URL(`/login?verified=true`,req.url)
        )

    } catch (error:any) {

        console.error('Unexpected error during the verification ',error)

        return NextResponse.redirect(
            new URL(`/login?error=Something went wrong during verification`,req.url)
        )
    }

}