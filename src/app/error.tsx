'use client'

import { useEffect } from 'react'
import Link from 'next/link'
import { RefreshCw, Home, AlertCircle } from 'lucide-react'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error('Application error:', error)
  }, [error])

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background px-4">
      <div className="text-center">
        {/* Icon */}
        <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-destructive/10">
          <AlertCircle className="h-10 w-10 text-destructive" />
        </div>

        {/* Title */}
        <h1 className="mb-2 text-3xl font-bold text-foreground">
          문제가 발생했어요
        </h1>

        {/* Description */}
        <p className="mb-8 text-muted-foreground">
          일시적인 오류가 발생했습니다. 다시 시도해 주세요.
        </p>

        {/* Actions */}
        <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
          <button
            onClick={reset}
            className="inline-flex items-center justify-center gap-2 rounded bg-primary px-6 py-3 font-semibold text-primary-foreground transition-all hover:bg-primary/90 hover:scale-105"
          >
            <RefreshCw className="h-5 w-5" />
            다시 시도
          </button>

          <Link
            href="/"
            className="inline-flex items-center justify-center gap-2 rounded border border-border bg-background px-6 py-3 font-semibold text-foreground transition-all hover:bg-muted"
          >
            <Home className="h-5 w-5" />
            홈으로 돌아가기
          </Link>
        </div>

        {/* Error details (dev only) */}
        {process.env.NODE_ENV === 'development' && error.message && (
          <details className="mt-8 text-left">
            <summary className="cursor-pointer text-sm text-muted-foreground hover:text-foreground">
              오류 상세 정보
            </summary>
            <pre className="mt-2 max-w-lg overflow-auto rounded bg-muted p-4 text-xs text-muted-foreground">
              {error.message}
              {error.digest && `\n\nDigest: ${error.digest}`}
            </pre>
          </details>
        )}
      </div>
    </div>
  )
}
