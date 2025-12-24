import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'

function CommentSkeleton() {
  return (
    <div className="flex gap-3 py-4">
      {/* 아바타 */}
      <div className="h-8 w-8 flex-shrink-0 animate-pulse rounded-full bg-muted" />
      {/* 콘텐츠 */}
      <div className="flex-1">
        <div className="flex items-center gap-2">
          <div className="h-4 w-20 animate-pulse rounded bg-muted" />
          <div className="h-3 w-10 animate-pulse rounded bg-muted" />
        </div>
        <div className="mt-2 space-y-1">
          <div className="h-4 w-full animate-pulse rounded bg-muted" />
          <div className="h-4 w-2/3 animate-pulse rounded bg-muted" />
        </div>
      </div>
    </div>
  )
}

export default function FeedDetailLoading() {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Header />

      <main className="flex-1">
        <div className="max-w-xl mx-auto">
          {/* 상단 바 */}
          <div className="sticky top-16 z-20 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="flex items-center h-14 px-4">
              <div className="h-5 w-12 animate-pulse rounded bg-muted" />
            </div>
          </div>

          {/* 메인 포스트 */}
          <article className="px-4 py-4">
            <div className="flex gap-3">
              {/* 아바타 */}
              <div className="flex flex-col items-center">
                <div className="h-10 w-10 flex-shrink-0 animate-pulse rounded-full bg-muted" />
                <div className="mt-2 w-0.5 flex-1 bg-border/50 min-h-[20px]" />
              </div>

              {/* 콘텐츠 */}
              <div className="flex-1 min-w-0 pb-4">
                {/* 헤더 */}
                <div className="flex items-center gap-2">
                  <div className="h-4 w-24 animate-pulse rounded bg-muted" />
                  <div className="h-4 w-12 animate-pulse rounded bg-muted" />
                </div>

                {/* 제목 */}
                <div className="mt-2 h-7 w-full animate-pulse rounded bg-muted" />

                {/* 본문 */}
                <div className="mt-4 space-y-2">
                  <div className="h-4 w-full animate-pulse rounded bg-muted" />
                  <div className="h-4 w-full animate-pulse rounded bg-muted" />
                  <div className="h-4 w-3/4 animate-pulse rounded bg-muted" />
                  <div className="h-4 w-full animate-pulse rounded bg-muted" />
                  <div className="h-4 w-5/6 animate-pulse rounded bg-muted" />
                  <div className="h-4 w-full animate-pulse rounded bg-muted" />
                  <div className="h-4 w-2/3 animate-pulse rounded bg-muted" />
                  <div className="h-4 w-1/2 animate-pulse rounded bg-muted" />
                </div>

                {/* 태그 */}
                <div className="mt-4 flex flex-wrap gap-2">
                  <div className="h-4 w-16 animate-pulse rounded bg-muted" />
                  <div className="h-4 w-14 animate-pulse rounded bg-muted" />
                  <div className="h-4 w-12 animate-pulse rounded bg-muted" />
                </div>

                {/* 좋아요 버튼 */}
                <div className="mt-6 pt-4 border-t border-border/50">
                  <div className="h-6 w-24 animate-pulse rounded bg-muted" />
                </div>
              </div>
            </div>
          </article>

          {/* 구분선 */}
          <div className="border-t border-border" />

          {/* 댓글 섹션 */}
          <div className="px-4 py-6">
            <div className="mb-4 h-5 w-20 animate-pulse rounded bg-muted" />

            {/* 댓글 입력창 스켈레톤 */}
            <div className="mb-6 h-20 w-full animate-pulse rounded-sm border border-border bg-muted" />

            {/* 댓글 목록 */}
            <div className="space-y-2 divide-y divide-border/50">
              <CommentSkeleton />
              <CommentSkeleton />
              <CommentSkeleton />
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
