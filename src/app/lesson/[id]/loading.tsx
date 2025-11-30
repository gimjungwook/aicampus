import { Header } from '@/components/layout/Header'

export default function LessonLoading() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />

      <main className="flex-1">
        {/* 상단 네비게이션 스켈레톤 */}
        <div className="border-b border-border bg-card">
          <div className="mx-auto max-w-7xl px-4 py-3 lg:px-8">
            <div className="flex items-center gap-4">
              <div className="h-5 w-32 animate-pulse rounded bg-muted" />
              <div className="h-5 w-4 animate-pulse rounded bg-muted" />
              <div className="h-5 w-48 animate-pulse rounded bg-muted" />
            </div>
          </div>
        </div>

        {/* 메인 콘텐츠 스켈레톤 */}
        <div className="mx-auto max-w-7xl px-4 py-6 lg:px-8">
          <div className="flex flex-col gap-6 lg:flex-row">
            {/* 왼쪽 */}
            <div className="flex flex-col gap-4 lg:w-[60%]">
              {/* 영상 스켈레톤 */}
              <div className="aspect-video animate-pulse rounded-2xl bg-muted" />

              {/* 레슨 정보 스켈레톤 */}
              <div className="rounded-2xl border border-border bg-card p-4">
                <div className="mb-2 h-7 w-3/4 animate-pulse rounded bg-muted" />
                <div className="h-5 w-full animate-pulse rounded bg-muted" />
                <div className="mt-2 h-4 w-20 animate-pulse rounded bg-muted" />
              </div>

              {/* 네비게이션 스켈레톤 */}
              <div className="rounded-2xl border border-border bg-card p-4">
                <div className="mb-4 flex justify-between">
                  <div className="h-5 w-24 animate-pulse rounded bg-muted" />
                  <div className="h-5 w-16 animate-pulse rounded bg-muted" />
                </div>
                <div className="flex gap-2">
                  <div className="h-10 flex-1 animate-pulse rounded-lg bg-muted" />
                  <div className="h-10 w-10 animate-pulse rounded-lg bg-muted" />
                  <div className="h-10 flex-1 animate-pulse rounded-lg bg-muted" />
                </div>
              </div>
            </div>

            {/* 오른쪽: 샌드박스 스켈레톤 */}
            <div className="h-[600px] lg:h-auto lg:min-h-[700px] lg:w-[40%]">
              <div className="h-full animate-pulse rounded-2xl border border-border bg-muted" />
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
