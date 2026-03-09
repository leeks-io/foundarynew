'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createSupabaseBrowserClient } from '@/utils/supabase/client'
import { Loader2, Eye, EyeOff } from 'lucide-react'

export default function AuthPage() {
    const router = useRouter()
    const supabase = createSupabaseBrowserClient()
    const [mode, setMode] = useState<'signin' | 'signup' | 'reset'>('signin')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [fullName, setFullName] = useState('')
    const [showPassword, setShowPassword] = useState(false)
    const [loading, setLoading] = useState(false)
    const [message, setMessage] = useState<{ type: 'error' | 'success'; text: string } | null>(null)

    useEffect(() => {
        supabase.auth.getSession().then(({ data: { session } }) => {
            if (session) router.replace('/dashboard')
        })
    }, [])

    const handleAuth = async () => {
        setLoading(true)
        setMessage(null)

        if (mode === 'reset') {
            const { error } = await supabase.auth.resetPasswordForEmail(email, {
                redirectTo: `${window.location.origin}/auth/update-password`,
            })
            setLoading(false)
            if (error) setMessage({ type: 'error', text: error.message })
            else setMessage({ type: 'success', text: 'Check your email for a reset link.' })
            return
        }

        if (mode === 'signup') {
            const { error } = await supabase.auth.signUp({
                email,
                password,
                options: {
                    data: { full_name: fullName },
                    emailRedirectTo: `${window.location.origin}/auth/callback`,
                },
            })
            setLoading(false)
            if (error) setMessage({ type: 'error', text: error.message })
            else setMessage({ type: 'success', text: 'Check your email to confirm your account.' })
            return
        }

        // Sign in
        const { error } = await supabase.auth.signInWithPassword({ email, password })
        setLoading(false)
        if (error) {
            setMessage({ type: 'error', text: error.message })
        } else {
            router.replace('/dashboard')
        }
    }

    const handleOAuth = async (provider: 'google' | 'github') => {
        await supabase.auth.signInWithOAuth({
            provider,
            options: { redirectTo: `${window.location.origin}/auth/callback` },
        })
    }

    return (
        <div className="min-h-screen bg-black flex items-center justify-center p-4">
            <div className="w-full max-w-sm">
                {/* Logo */}
                <div className="flex items-center gap-2 mb-8 justify-center">
                    <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center">
                        <span className="text-black font-bold">F</span>
                    </div>
                    <span className="text-white font-semibold text-lg">Foundry</span>
                </div>

                <div className="bg-zinc-950 border border-zinc-800 rounded-2xl p-6 space-y-5">
                    <div>
                        <h1 className="text-white font-semibold text-lg">
                            {mode === 'signin' ? 'Welcome back' : mode === 'signup' ? 'Create account' : 'Reset password'}
                        </h1>
                        <p className="text-zinc-500 text-sm mt-1">
                            {mode === 'signin'
                                ? 'Sign in to your Foundry account'
                                : mode === 'signup'
                                    ? 'Join the marketplace for internet builders'
                                    : 'Enter your email to get a reset link'}
                        </p>
                    </div>

                    {/* OAuth */}
                    {mode !== 'reset' && (
                        <div className="space-y-2">
                            <button
                                onClick={() => handleOAuth('google')}
                                className="w-full flex items-center justify-center gap-2 py-2.5 bg-zinc-900 border border-zinc-700 rounded-xl text-sm text-white hover:bg-zinc-800 transition-colors"
                            >
                                <svg className="w-4 h-4" viewBox="0 0 24 24">
                                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                                </svg>
                                Continue with Google
                            </button>
                            <button
                                onClick={() => handleOAuth('github')}
                                className="w-full flex items-center justify-center gap-2 py-2.5 bg-zinc-900 border border-zinc-700 rounded-xl text-sm text-white hover:bg-zinc-800 transition-colors"
                            >
                                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z" />
                                </svg>
                                Continue with GitHub
                            </button>
                            <div className="relative">
                                <div className="absolute inset-0 flex items-center">
                                    <div className="w-full border-t border-zinc-800" />
                                </div>
                                <div className="relative flex justify-center">
                                    <span className="px-3 bg-zinc-950 text-zinc-500 text-xs">or</span>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Form */}
                    <div className="space-y-3">
                        {mode === 'signup' && (
                            <input
                                type="text"
                                placeholder="Full name"
                                value={fullName}
                                onChange={e => setFullName(e.target.value)}
                                className="w-full px-3 py-2.5 bg-zinc-900 border border-zinc-700 rounded-xl text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-zinc-500"
                            />
                        )}
                        <input
                            type="email"
                            placeholder="Email address"
                            value={email}
                            onChange={e => setEmail(e.target.value)}
                            className="w-full px-3 py-2.5 bg-zinc-900 border border-zinc-700 rounded-xl text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-zinc-500"
                        />
                        {mode !== 'reset' && (
                            <div className="relative">
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    placeholder="Password"
                                    value={password}
                                    onChange={e => setPassword(e.target.value)}
                                    onKeyDown={e => e.key === 'Enter' && handleAuth()}
                                    className="w-full px-3 py-2.5 pr-10 bg-zinc-900 border border-zinc-700 rounded-xl text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-zinc-500"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-300"
                                >
                                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                </button>
                            </div>
                        )}
                    </div>

                    {/* Message */}
                    {message && (
                        <p className={`text-xs ${message.type === 'error' ? 'text-red-400' : 'text-green-400'}`}>
                            {message.text}
                        </p>
                    )}

                    {/* Submit */}
                    <button
                        onClick={handleAuth}
                        disabled={loading}
                        className="w-full py-2.5 bg-white text-black rounded-xl font-medium text-sm hover:bg-zinc-200 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                    >
                        {loading && <Loader2 className="w-4 h-4 animate-spin" />}
                        {mode === 'signin' ? 'Sign in' : mode === 'signup' ? 'Create account' : 'Send reset link'}
                    </button>

                    {/* Footer links */}
                    <div className="text-center space-y-2 text-xs text-zinc-500">
                        {mode === 'signin' && (
                            <>
                                <button onClick={() => { setMode('reset'); setMessage(null) }} className="hover:text-white transition-colors block w-full">
                                    Forgot password?
                                </button>
                                <p>
                                    Don&apos;t have an account?{' '}
                                    <button onClick={() => { setMode('signup'); setMessage(null) }} className="text-white hover:underline">
                                        Sign up
                                    </button>
                                </p>
                            </>
                        )}
                        {mode === 'signup' && (
                            <p>
                                Already have an account?{' '}
                                <button onClick={() => { setMode('signin'); setMessage(null) }} className="text-white hover:underline">
                                    Sign in
                                </button>
                            </p>
                        )}
                        {mode === 'reset' && (
                            <button onClick={() => { setMode('signin'); setMessage(null) }} className="hover:text-white transition-colors">
                                Back to sign in
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}
