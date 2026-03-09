import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function updateSession(request: NextRequest) {
    try {
        let supabaseResponse = NextResponse.next({
            request: {
                headers: request.headers,
            },
        })

        const url = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
        const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''

        if (!url || !key) {
            console.warn('Supabase credentials missing in middleware.')
        }

        const supabase = createServerClient(
            url,
            key,
            {
                cookies: {
                    getAll() {
                        return request.cookies.getAll()
                    },
                    setAll(cookiesToSet) {
                        cookiesToSet.forEach(({ name, value, options }) => request.cookies.set(name, value))
                        supabaseResponse = NextResponse.next({
                            request: {
                                headers: request.headers,
                            },
                        })
                        cookiesToSet.forEach(({ name, value, options }) =>
                            supabaseResponse.cookies.set(name, value, options)
                        )
                    },
                },
            }
        )

        // IMPORTANT: Avoid writing any logic between createServerClient and
        // supabase.auth.getUser().
        const {
            data: { user },
        } = await supabase.auth.getUser()

        const isAuthRoute = request.nextUrl.pathname.startsWith('/auth') || request.nextUrl.pathname === '/login' || request.nextUrl.pathname === '/signup'
        const isDashboardRoute = request.nextUrl.pathname.startsWith('/dashboard')

        if (!user && isDashboardRoute) {
            const url = request.nextUrl.clone()
            url.pathname = '/auth'
            return NextResponse.redirect(url)
        }

        if (user && isAuthRoute) {
            const url = request.nextUrl.clone()
            url.pathname = '/dashboard'
            return NextResponse.redirect(url)
        }

        return supabaseResponse
    } catch (e) {
        console.error('Middleware Error:', e)
        return NextResponse.next({
            request: {
                headers: request.headers,
            },
        })
    }
}
