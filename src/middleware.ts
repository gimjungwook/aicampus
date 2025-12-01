import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

// 로그인이 필요한 보호 라우트
const protectedRoutes = ['/lesson', '/sandbox', '/mypage']
// Admin 라우트 (로그인 필요, 역할 체크는 layout에서)
const adminRoutes = ['/admin']

export async function middleware(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          )
          supabaseResponse = NextResponse.next({
            request,
          })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  // 세션 갱신 (중요: getUser()를 호출해야 세션이 갱신됨)
  const {
    data: { user },
  } = await supabase.auth.getUser()

  // 보호 라우트 체크
  const isProtectedRoute = protectedRoutes.some((route) =>
    request.nextUrl.pathname.startsWith(route)
  )

  if (isProtectedRoute && !user) {
    // 로그인 페이지로 리다이렉트 (현재 URL을 next 파라미터로 전달)
    const url = request.nextUrl.clone()
    url.pathname = '/login'
    url.searchParams.delete('login')
    url.searchParams.set('next', request.nextUrl.pathname)
    return NextResponse.redirect(url)
  }

  // Admin 라우트 체크 (로그인 필요, 역할 체크는 layout에서)
  const isAdminRoute = adminRoutes.some((route) =>
    request.nextUrl.pathname.startsWith(route)
  )

  if (isAdminRoute && !user) {
    const url = request.nextUrl.clone()
    url.pathname = '/login'
    url.searchParams.delete('login')
    url.searchParams.set('next', request.nextUrl.pathname)
    return NextResponse.redirect(url)
  }

  return supabaseResponse
}

export const config = {
  matcher: [
    /*
     * 보호 라우트에 대해서만 미들웨어 실행:
     * - lesson/*
     * - sandbox/*
     * - mypage/*
     * - admin/*
     */
    '/(lesson|sandbox|mypage|admin)(.*)',
  ],
}
