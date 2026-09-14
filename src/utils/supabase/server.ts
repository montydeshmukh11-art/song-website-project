import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

export async function createClient (){
    const cookiesStored = await cookies()

    return createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,{
            cookies:{
                getAll(){
                    return cookiesStored.getAll()
                },
                setAll(cookiesToSet){
                  try {
                    
                    cookiesToSet.forEach(({name,value,options
                    })=>{
                         cookiesStored.set(name,value,options)
                    })
                  } catch (error) {
                    console.log(error)
                  }
                }
            }
        }
    )

}