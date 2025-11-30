'use client'

import { Suspense, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { useAuth } from '@/components/auth/AuthProvider'
import { GoogleLoginButton } from '@/components/auth/GoogleLoginButton'

function LoginContent() {
  const { user, loading } = useAuth()
  const router = useRouter()
  const searchParams = useSearchParams()
  const next = searchParams.get('next') || '/courses'

  // 이미 로그인된 경우 리다이렉트
  useEffect(() => {
    if (!loading && user) {
      router.push(next)
    }
  }, [user, loading, router, next])

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="h-10 w-10 animate-spin rounded-full border-3 border-primary border-t-transparent" />
      </div>
    )
  }

  if (user) {
    return null
  }

  return (
    <div className="flex min-h-screen">
      {/* 좌측: 로그인 폼 */}
      <div className="flex flex-1 flex-col items-center justify-center bg-background px-8">
        <div className="w-full max-w-sm">
          {/* 로고 */}
          <Link href="/" className="mb-12 inline-flex items-center gap-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-sm font-bold text-primary-foreground">
              AI
            </div>
            <span className="text-xl font-bold text-foreground">AI Campus</span>
          </Link>

          {/* Welcome 텍스트 */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-foreground">
              Welcome to
              <br />
              AI Campus
            </h1>
          </div>

          {/* Google 로그인 버튼 */}
          <GoogleLoginButton
            redirectTo={next}
            className="w-full rounded-xl border-2 border-border bg-background py-4 text-foreground hover:bg-muted"
          />

          {/* 하단 약관 링크 */}
          <p className="mt-12 text-center text-sm text-muted-foreground">
            <Link href="/terms" className="hover:underline">
              이용약관
            </Link>
            <span className="mx-2">·</span>
            <Link href="/privacy" className="hover:underline">
              개인정보 처리방침
            </Link>
          </p>
        </div>
      </div>

      {/* 우측: 브랜딩 (lg 이상에서만 표시) */}
      <div className="relative hidden flex-1 items-center justify-center overflow-hidden bg-gradient-to-br from-primary/30 via-primary/10 to-emerald-100 dark:from-primary/20 dark:via-primary/5 dark:to-emerald-900/20 lg:flex">
        {/* 블러 효과 */}
        <div className="absolute -right-20 -top-20 h-80 w-80 rounded-full bg-primary/20 blur-3xl" />
        <div className="absolute -bottom-20 -left-20 h-80 w-80 rounded-full bg-emerald-400/20 blur-3xl" />

        {/* 슬로건 */}
        <div className="relative z-10 px-12 text-center">
          <div className="inline-flex items-center justify-center rounded-2xl bg-white px-8 py-6 shadow-lg">
            <p className="text-2xl font-semibold text-gray-800">
              배우고, 실습하고, 성장하세요
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

function LoginFallback() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background">
      <div className="h-10 w-10 animate-spin rounded-full border-3 border-primary border-t-transparent" />
    </div>
  )
}

export default function LoginPage() {
  return (
    <Suspense fallback={<LoginFallback />}>
      <LoginContent />
    </Suspense>
  )
}
