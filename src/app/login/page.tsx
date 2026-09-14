'use client'

import Link from "next/link";
import { useState } from "react";
import { EyeIcon, EyeOff } from 'lucide-react'
import axios from "axios";
import { useSearchParams } from "next/navigation";
import ForgotPasswordModal from "@/components/ForgotPassModal";

export default function LoginPage() {

    const [identifier, setIdentifier] = useState<string>(''); // Email or Username
    const [password, setPassword] = useState<string>('');
    const [showPassword, setShowPassword] = useState<boolean>(false);
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')

    const searchParams = useSearchParams()
    const verified = searchParams.get('verified')
    const urlError = searchParams.get('error')

    const [showForgotPassword,setShowForgotPassword] = useState(false)

    const handleLogin = async () => {

        if (!identifier || !password) return

        try {

            setLoading(true)
            setError('')

            const response = await axios.post('/api/login', {
                identifier,
                password
            })

            console.log('Login successful', response.data)
            window.location.href = '/'

        } catch (error: any) {

            console.log('Error logging in', error)
            setError(error.response?.data?.error || 'Failed to login')

        } finally {
            setLoading(false)
        }

    }

    return (
        <div className="flex justify-center items-center min-h-[calc(100dvh-5rem)] relative overflow-hidden py-8 px-3">
            {/* Glowing Background Orbs */}
            <div className="absolute top-1/4 left-1/4 w-96 h-96  rounded-full blur-[120px] pointer-events-none"></div>
            <div className="absolute bottom-1/4 right-1/4 w-96 h-96 rounded-full blur-[120px] pointer-events-none"></div>
            <div className="w-full max-w-md my-auto py-7 px-5 sm:p-8 bg-white/5 backdrop-blur-2xl rounded-3xl border border-white/10 relative z-10 shadow-2xl">
                <h1 className="text-2xl sm:text-3xl font-extrabold mb-6 sm:mb-8 text-center text-transparent bg-clip-text bg-white">
                    Welcome Back
                </h1>

                {verified && (
                    <p className="text-green-400 text-sm text-center mb-4 p-3 bg-green-400/10 rounded-lg">
                        ✅ Email verified successfully! You can now log in.
                    </p>
                )}
                {urlError && (
                    <p className="text-red-500 text-sm text-center mb-4 p-3 bg-red-500/10 rounded-lg">
                        {urlError}
                    </p>
                )}

                {/* Error message text */}
                {error && <p className="text-red-500 text-sm text-center mb-4">{error}</p>}
                <div className="flex flex-col gap-5">

                    {/* Identifier (Email/Username) input */}
                    <div className="flex flex-col">
                        <span className="mb-1.5 text-white/70 font-medium ml-1">Email or Username</span>
                        <input
                            placeholder="you@example.com or username"
                            type="text"
                            required
                            className="p-3.5 bg-black/20 text-white rounded-xl border border-white/10 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all placeholder:text-white/20"
                            value={identifier}
                            onChange={(e) => setIdentifier(e.target.value)}
                        />
                    </div>
                    {/* Password input with eye icon */}
                    <div className="flex flex-col">
                        <span className="mb-1.5 text-white/70 font-medium ml-1">Password</span>
                       
                        <div className="relative flex items-center">
                       
                            <input
                                type={showPassword ? 'text' : 'password'}
                                placeholder="••••••••"
                                required
                                className="p-3.5 bg-black/20 text-white rounded-xl border border-white/10 w-full pr-12 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all placeholder:text-white/20"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                       
                            <button
                                type="button"
                                className="absolute right-4 text-white/50 hover:text-white transition-colors"
                                onClick={() => setShowPassword(!showPassword)}
                            >
                                {showPassword ? <EyeIcon size={20} /> : <EyeOff size={20} />}
                       
                            </button>
                       
                        </div>

                    </div>
                   
                    <button
                        onClick={handleLogin}
                        disabled={loading}
                        className="mt-4 cursor-pointer bg-primary hover:bg-primary/90 text-primary-foreground font-bold py-4 rounded-xl hover:-translate-y-0.5 transition-all shadow-[0_0_20px_rgba(139,92,246,0.3)] disabled:opacity-50"
                    >
                        {loading ? 'Logging in...' : 'Log In'}
                    </button>

                    <button
                    type="button"
                    onClick={
                        ()=>setShowForgotPassword(true)
                    }
                     className="text-xs text-white/40 hover:text-primary text-center w-full mt-1 transition-colors"
                    >
                    Forgot Password?
                    </button>

                    <ForgotPasswordModal
                    isOpen={showForgotPassword}
                    onClose={()=>setShowForgotPassword(false)}
                    />

                </div>
                <div className="mt-8 text-center text-white/60 text-sm">
                
                    <span>Don't Have An Account? </span>

                    <Link href='/signup' className="text-primary ml-1 font-semibold hover:underline underline-offset-4 hover:text-primary/80">
                        Sign Up
                    </Link>

                </div>
            </div>
        </div>
    );
}
