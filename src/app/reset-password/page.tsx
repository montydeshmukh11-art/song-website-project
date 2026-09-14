'use client'
import { useState } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { EyeIcon, EyeOff, CheckCircle2 } from 'lucide-react'
import axios from 'axios'

export default function ResetPasswordPage() {
    const router = useRouter()
    const searchParams = useSearchParams()
    const token = searchParams.get('token')

    const [password, setPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [showPassword, setShowPassword] = useState(false)
    const [showConfirm, setShowConfirm] = useState(false)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')
    const [success, setSuccess] = useState(false)

    if (!token) {
        return (
            <div className="flex justify-center items-center min-h-[calc(100dvh-5rem)] px-4">
                <div className="text-center">
                    <p className="text-red-400 mb-4">Invalid or missing reset link.</p>
                    <Link href="/login" className="text-primary hover:underline">
                        Back to Login
                    </Link>
                </div>
            </div>
        )
    }

    const handleReset = async () => {
        setError('')

        if (!password || !confirmPassword) {
            setError('Please fill in all fields')
            return
        }
        if (password.length < 8) {
            setError('Password must be at least 8 characters')
            return
        }
        if (!/[A-Z]/.test(password)) {
            setError('Password must contain at least one uppercase letter')
            return
        }
        if (password !== confirmPassword) {
            setError('Passwords do not match')
            return
        }

        try {
            setLoading(true)
            await axios.post('/api/reset-password', { token, password })
            setSuccess(true)
            // Auto-redirect to login after 3 seconds
            setTimeout(() => router.push('/login'), 3000)
        } catch (err: any) {
            setError(err.response?.data?.error || 'Failed to reset password')
        } finally {
            setLoading(false)
        }
    }

    if (success) {
        return (
            <div className="flex justify-center items-center min-h-[calc(100dvh-5rem)] px-4">
                <div className="w-full max-w-md text-center py-8 px-6 bg-white/5 backdrop-blur-2xl rounded-3xl border border-white/10 shadow-2xl">
                    <CheckCircle2 size={56} className="text-green-400 mx-auto mb-4" />
                    <h1 className="text-2xl font-bold text-white mb-2">Password Updated!</h1>
                    <p className="text-white/60 text-sm mb-4">
                        Your password has been changed successfully. Redirecting you to login...
                    </p>
                    <Link href="/login" className="text-primary hover:underline text-sm">
                        Go to Login now
                    </Link>
                </div>
            </div>
        )
    }

    return (
        <div className="flex justify-center items-center min-h-[calc(100dvh-5rem)] py-8 px-3">
            <div className="w-full max-w-md my-auto py-7 px-5 sm:p-8 bg-white/5 backdrop-blur-2xl rounded-3xl border border-white/10 shadow-2xl">
                <h1 className="text-2xl sm:text-3xl font-extrabold mb-2 text-center text-white">
                    Reset Password
                </h1>
                <p className="text-white/50 text-sm text-center mb-6">
                    Enter your new password below.
                </p>

                {error && (
                    <p className="text-red-400 text-sm text-center mb-4 p-3 bg-red-500/10 rounded-xl">
                        {error}
                    </p>
                )}

                <div className="flex flex-col gap-4">
                    {/* New Password */}
                    <div className="flex flex-col">
                        <span className="mb-1.5 text-white/70 font-medium ml-1">New Password</span>
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

                    {/* Confirm Password */}
                    <div className="flex flex-col">
                        <span className="mb-1.5 text-white/70 font-medium ml-1">Confirm Password</span>
                        <div className="relative flex items-center">
                            <input
                                type={showConfirm ? 'text' : 'password'}
                                placeholder="••••••••"
                                required
                                className="p-3.5 bg-black/20 text-white rounded-xl border border-white/10 w-full pr-12 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all placeholder:text-white/20"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                            />
                            <button
                                type="button"
                                className="absolute right-4 text-white/50 hover:text-white transition-colors"
                                onClick={() => setShowConfirm(!showConfirm)}
                            >
                                {showConfirm ? <EyeIcon size={20} /> : <EyeOff size={20} />}
                            </button>
                        </div>
                    </div>

                    <button
                        onClick={handleReset}
                        disabled={loading}
                        className="mt-2 bg-primary hover:bg-primary/90 text-white font-bold py-4 rounded-xl hover:-translate-y-0.5 transition-all shadow-[0_0_20px_rgba(139,92,246,0.3)] disabled:opacity-50"
                    >
                        {loading ? 'Updating...' : 'Update Password'}
                    </button>

                    <div className="text-center text-white/60 text-sm">
                        <Link href="/login" className="text-primary hover:underline">
                            ← Back to Login
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    )
}
