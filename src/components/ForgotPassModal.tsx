'use client'
import { useState } from 'react'
import axios from 'axios'
import { X, Mail, Loader2, CheckCircle2 } from 'lucide-react'

interface ForgotPasswordModalProps {
    isOpen: boolean
    onClose: () => void
}

export default function ForgotPasswordModal({ isOpen, onClose }: ForgotPasswordModalProps) {
    const [email, setEmail] = useState('')
    const [loading, setLoading] = useState(false)
    const [success, setSuccess] = useState(false)
    const [error, setError] = useState('')

    const handleSubmit = async () => {
        if (!email) return
        try {
            setLoading(true)
            setError('')
            await axios.post('/api/forgot-password', { email })
            setSuccess(true)
        } catch (err: any) {
            setError(err.response?.data?.error || 'Failed to send reset email')
        } finally {
            setLoading(false)
        }
    }

    const handleClose = () => {
        setEmail('')
        setError('')
        setSuccess(false)
        onClose()
    }

    if (!isOpen) return null

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center px-4">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/70 backdrop-blur-sm"
                onClick={handleClose}
            />

            {/* Modal */}
            <div className="relative w-full max-w-sm bg-white/5 backdrop-blur-2xl rounded-3xl border border-white/10 p-6 shadow-2xl z-10">
                {/* Close button */}
                <button
                    onClick={handleClose}
                    className="absolute top-4 right-4 text-white/50 hover:text-white hover:bg-white/10 p-1.5 rounded-full transition-all"
                >
                    <X size={18} />
                </button>

                {success ? (
                    <div className="text-center py-4">
                        <CheckCircle2 size={48} className="text-green-400 mx-auto mb-3" />
                        <h2 className="text-xl font-bold text-white mb-2">Check Your Email</h2>
                        <p className="text-white/60 text-sm">
                            If that email is registered, we've sent a password reset link.
                            The link expires in <span className="text-primary font-semibold">30 minutes</span>.
                        </p>
                        <button
                            onClick={handleClose}
                            className="mt-5 w-full bg-primary hover:bg-primary/90 text-white font-bold py-2.5 rounded-xl transition-all"
                        >
                            Done
                        </button>
                    </div>
                ) : (
                    <>
                        <div className="flex items-center gap-3 mb-5">
                            <div className="p-2 bg-primary/20 rounded-xl">
                                <Mail size={20} className="text-primary" />
                            </div>
                            <h2 className="text-lg font-bold text-white">Forgot Password?</h2>
                        </div>

                        <p className="text-white/60 text-sm mb-5">
                            Enter your registered email address and we'll send you a password reset link.
                        </p>

                        {error && (
                            <p className="text-red-400 text-sm text-center mb-4 p-3 bg-red-500/10 rounded-xl">
                                {error}
                            </p>
                        )}

                        <div className="flex flex-col gap-4">
                            <div className="flex flex-col">
                                <span className="mb-1.5 text-white/70 font-medium ml-1 text-sm">Email Address</span>
                                <input
                                    type="email"
                                    placeholder="you@example.com"
                                    className="p-3.5 bg-black/20 text-white rounded-xl border border-white/10 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all placeholder:text-white/20 text-sm"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
                                />
                            </div>

                            <button
                                onClick={handleSubmit}
                                disabled={loading || !email}
                                className="bg-primary hover:bg-primary/90 text-white font-bold py-3.5 rounded-xl hover:-translate-y-0.5 transition-all shadow-[0_0_20px_rgba(139,92,246,0.3)] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                            >
                                {loading ? (
                                    <>
                                        <Loader2 size={18} className="animate-spin" />
                                        Sending...
                                    </>
                                ) : (
                                    'Send Reset Link'
                                )}
                            </button>
                        </div>
                    </>
                )}
            </div>
        </div>
    )
}
