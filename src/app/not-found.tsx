import Link from 'next/link'
import { Home, BookOpen, MessageSquare, Search } from 'lucide-react'

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background px-4">
      <div className="text-center">
        {/* 404 Badge */}
        <div className="mb-6 inline-flex items-center justify-center rounded-full bg-primary/10 px-4 py-2">
          <span className="text-sm font-semibold text-primary">404</span>
        </div>

        {/* Icon */}
        <div className="mx-auto mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-muted">
          <Search className="h-12 w-12 text-muted-foreground" />
        </div>

        {/* Title */}
        <h1 className="mb-2 text-3xl font-bold text-foreground">
          페이지를 찾을 수 없어요
        </h1>

        {/* Description */}
        <p className="mb-8 max-w-md text-muted-foreground">
          요청하신 페이지가 존재하지 않거나 이동되었을 수 있습니다.
          <br />
          주소를 다시 확인해 주세요.
        </p>

        {/* Primary Action */}
        <Link
          href="/"
          className="mb-8 inline-flex items-center justify-center gap-2 rounded bg-primary px-8 py-3 font-semibold text-primary-foreground transition-all hover:bg-primary/90 hover:scale-105"
        >
          <Home className="h-5 w-5" />
          홈으로 돌아가기
        </Link>

        {/* Divider */}
        <div className="mx-auto mb-6 flex max-w-xs items-center gap-4">
          <div className="h-px flex-1 bg-border" />
          <span className="text-sm text-muted-foreground">또는</span>
          <div className="h-px flex-1 bg-border" />
        </div>

        {/* Quick Links */}
        <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
          <Link
            href="/courses"
            className="inline-flex items-center justify-center gap-2 rounded border border-border bg-background px-6 py-3 font-medium text-foreground transition-colors hover:bg-muted"
          >
            <BookOpen className="h-5 w-5 text-primary" />
            코스 둘러보기
          </Link>

          <Link
            href="/sandbox"
            className="inline-flex items-center justify-center gap-2 rounded border border-border bg-background px-6 py-3 font-medium text-foreground transition-colors hover:bg-muted"
          >
            <MessageSquare className="h-5 w-5 text-primary" />
            AI 샌드박스
          </Link>
        </div>
      </div>
    </div>
  )
}
