'use client'

import Link from "next/link";
import { useState } from "react";
import {EyeIcon,EyeOff} from 'lucide-react'
import axios from "axios";

export default function SignUp (){

    const [email,setEmail] = useState<string>('')
    const [password,setPassword] = useState<string>('')
    const [confirmPassword,setConfirmPassword] = useState<string>('')
    const [username,setUsername] = useState<string>('')
    const [showPass,setShowPass] = useState<boolean>(false)
    const [showConfirmPass,setShowConfirmPassword] = useState(false)

    const [loading,setLoading] = useState(false)
    const [error,setError] = useState('')
    const [emailSent,setEmailSent] = useState(false)

    const SignUp = async ()=>{

        if(!email || !password || !username || !confirmPassword){
            setError('Please fill in all the fields')
            return
        }

        if(password.length < 8){
            setError('Password must be atleast 8 characters long')
            return
        }

        if(!/[A-Z]/.test(password)){
        setError('Password must atleast contain one upper character')
        return
        }

        if(password !== confirmPassword){
            setError('Passwords do not match')
            return
        }

        try {
            
            setLoading(true)
            setError('')

            const response = await axios.post('/api/signup',{
                email,username,password
            })

            console.log('sign up',response.data)
            setEmailSent(true)

        } catch (error:any) {
            
         console.error('Error signing up',error)
         setError(error.response?.data?.error || 'Failed to sign up')

        }finally{
            setLoading(false)
        }

    }

    if(emailSent){
         return (
            <div className="flex justify-center items-center min-h-[calc(100dvh-5rem)] py-8 px-3">
                <div className="w-full max-w-md my-auto py-7 px-5 sm:p-8 bg-white/5 backdrop-blur-2xl rounded-3xl border border-white/10 text-center">
                    <h1 className="text-2xl text-white/70 mb-4">Check Your Email 📧</h1>
                    <p className="text-white/60 mb-2">
                        We've sent a verification link to <span className="text-primary font-semibold">{email}</span>
                    </p>
                    <p className="text-white/40 text-sm mb-6">
                        Click the link in the email to verify your account. The link expires in 24 hours.
                    </p>
                    <Link href='/login' className="text-primary hover:underline">
                        Go to Login
                    </Link>
                </div>
            </div>
        )
    }

    return (
        <div className="flex justify-center items-center min-h-[calc(100dvh-5rem)] py-8 px-3">
            <div className="w-full max-w-md my-auto py-7 px-5 sm:p-8 bg-white/5 backdrop-blur-2xl rounded-3xl border border-white/10 shadow-2xl">
                
                {/* Loader */}
                {
                    loading ? <h1 className="text-2xl text-white/70 mb-6 text-center">Creating Your Account....</h1> : <h1 className="text-2xl text-white/70 mb-6 text-center">Create Your Account</h1>
                }
               
               {/* Error message */}
              {error && <p className="text-red-500 text-sm text-center mb-4">{error}</p>}
               
                <div className="flex flex-col gap-4">

                    {/* Email input */}
                    <div className="flex flex-col">
                        <span className="mb-1 text-white/70">Email</span>
                        <input
                            placeholder="enter email"
                            type="email"
                            required
                            className="p-3 bg-black/20 text-white rounded-md border border-white/20"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>

                    {/* Username input */}
                    <div className="flex flex-col">
                        <span className="mb-1 text-white/70">Username</span>
                        <input
                            type="text"
                            placeholder="enter username"
                            required
                            className="p-3 bg-black/20 text-white rounded-md border border-white/20"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                        />
                    </div>

                    {/* Password input */}
                    <div className="flex flex-col">
                        <span className="mb-1 text-white/70">Password</span>
                      <div className="relative flex items-center">
                            <input
                            type={showPass ? 'text' : 'password'}
                            placeholder="enter password"
                            required
                            className="p-3 bg-black/20 text-white rounded-md border border-white/20 w-full"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            />

                             <button
                             className="absolute right-3"
                             onClick={()=>setShowPass(!showPass)}
                             >
                                { showPass ? <EyeIcon/> : <EyeOff/>}
                             </button>

                      </div>
                    </div>

                  <div className="flex flex-col">
                        <span className="mb-1 text-white/70">Confirm Password</span>
                      <div className="relative flex items-center">
                            <input
                            type={showConfirmPass ? 'text' : 'password'}
                            placeholder="enter password"
                            required
                            className="p-3 bg-black/20 text-white rounded-md border border-white/20 w-full"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            />

                             <button
                             className="absolute right-3"
                             onClick={()=>setShowConfirmPassword(!showConfirmPass)}
                             >
                                { showConfirmPass ? <EyeIcon/> : <EyeOff/>}
                             </button>

                      </div>
                    </div>

                    <button
                        onClick={SignUp}
                        disabled={loading}
                        className="mt-4 bg-primary text-white font-bold py-3 rounded-md hover:bg-primary/90"
                    >
                        {loading ? 'Creating Account....' : 'Sign Up'}
                    </button>

                </div>

                <div className="mt-6 text-center text-white/60">
                    <span>Already Have An Account? </span>
                    <Link href='/login' className="text-primary ml-1 hover:underline">Log In</Link>
                </div>

            </div>
        </div>
    )

}