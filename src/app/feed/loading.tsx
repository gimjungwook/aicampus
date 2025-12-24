import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'

function FeedCardSkeleton() {
  return (
    <div className="relative">
      <div className="flex gap-3 px-4 py-4">
        {/* 아바타 + 연결선 */}
        <div className="flex flex-col items-center">
          <div className="h-10 w-10 flex-shrink-0 animate-pulse rounded-full bg-muted" />
          <div className="mt-2 w-0.5 flex-1 bg-border/50 min-h-[20px]" />
        </div>

        {/* 콘텐츠 */}
        <div className="flex-1 min-w-0 pb-2">
          {/* 헤더 */}
          <div className="flex items-center gap-2">
            <div className="h-4 w-24 animate-pulse rounded bg-muted" />
            <div className="h-4 w-12 animate-pulse rounded bg-muted" />
          </div>

          {/* 제목 */}
          <div className="mt-2 h-5 w-3/4 animate-pulse rounded bg-muted" />

          {/* 본문 미리보기 */}
          <div className="mt-2 space-y-1.5">
            <div className="h-4 w-full animate-pulse rounded bg-muted" />
            <div className="h-4 w-2/3 animate-pulse rounded bg-muted" />
          </div>

          {/* 태그 */}
          <div className="mt-3 flex gap-2">
            <div className="h-4 w-16 animate-pulse rounded bg-muted" />
            <div className="h-4 w-14 animate-pulse rounded bg-muted" />
            <div className="h-4 w-12 animate-pulse rounded bg-muted" />
          </div>

          {/* 액션 버튼 */}
          <div className="mt-3 flex items-center gap-4">
            <div className="h-5 w-12 animate-pulse rounded bg-muted" />
            <div className="h-5 w-12 animate-pulse rounded bg-muted" />
          </div>
        </div>
      </div>

      {/* 구분선 */}
      <div className="ml-[52px] mr-4 border-b border-border/50" />
    </div>
  )
}

export default function FeedLoading() {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Header />

      <main className="flex-1">
        {/* 상단 타이틀 바 */}
        <div className="sticky top-16 z-20 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          <div className="max-w-xl mx-auto px-4">
            <div className="flex items-center justify-between h-14">
              <div className="h-6 w-16 animate-pulse rounded bg-muted" />
            </div>
          </div>
        </div>

        {/* 피드 리스트 스켈레톤 */}
        <div className="max-w-xl mx-auto">
          {[1, 2, 3, 4, 5].map((i) => (
            <FeedCardSkeleton key={i} />
          ))}
        </div>
      </main>

      <Footer />
    </div>
  )
}
