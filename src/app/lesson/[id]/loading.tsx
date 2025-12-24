import { Header } from '@/components/layout/Header'

export default function LessonLoading() {
  return (
    <div className="flex h-screen flex-col overflow-hidden">
      <Header />

      <main className="flex flex-1 flex-col overflow-hidden">
        {/* 상단 네비게이션 스켈레톤 */}
        <div className="shrink-0 border-b border-border bg-card">
          <div className="px-4 py-3">
            <div className="flex items-center gap-4">
              <div className="h-5 w-32 animate-pulse rounded-sm bg-muted" />
              <div className="h-5 w-4 animate-pulse rounded-sm bg-muted" />
              <div className="h-5 w-48 animate-pulse rounded-sm bg-muted" />
            </div>
          </div>
        </div>

        {/* 메인 콘텐츠 */}
        <div className="flex-1 overflow-hidden">
          {/* 모바일: 세로 스택 */}
          <div className="flex flex-col gap-6 p-4 lg:hidden">
            {/* 영상 스켈레톤 */}
            <div className="aspect-video animate-pulse rounded-sm bg-muted" />

            {/* 레슨 정보 스켈레톤 */}
            <div className="rounded-sm border border-border bg-card p-4">
              <div className="mb-2 h-7 w-3/4 animate-pulse rounded-sm bg-muted" />
              <div className="h-5 w-full animate-pulse rounded-sm bg-muted" />
            </div>

            {/* 네비게이션 스켈레톤 */}
            <div className="rounded-sm border border-border bg-card p-4">
              <div className="flex gap-2">
                <div className="h-10 flex-1 animate-pulse rounded-sm bg-muted" />
                <div className="h-10 w-10 animate-pulse rounded-sm bg-muted" />
                <div className="h-10 flex-1 animate-pulse rounded-sm bg-muted" />
              </div>
            </div>

            {/* 샌드박스 스켈레톤 */}
            <div className="h-[500px] animate-pulse rounded-sm border border-border bg-muted" />
          </div>

          {/* 데스크톱: 50:50 좌우 분할 */}
          <div className="hidden h-full lg:flex">
            {/* 왼쪽 패널 (50%) */}
            <div className="flex w-1/2 flex-col gap-4 overflow-y-auto p-4">
              {/* 영상/블로그 스켈레톤 */}
              <div className="aspect-video animate-pulse rounded-sm bg-muted" />

              {/* 레슨 정보 스켈레톤 */}
              <div className="shrink-0 rounded-sm border border-border bg-card p-4">
                <div className="mb-2 h-7 w-3/4 animate-pulse rounded-sm bg-muted" />
                <div className="h-5 w-full animate-pulse rounded-sm bg-muted" />
                <div className="mt-2 h-4 w-20 animate-pulse rounded-sm bg-muted" />
              </div>

              {/* 네비게이션 스켈레톤 */}
              <div className="shrink-0 rounded-sm border border-border bg-card p-4">
                <div className="mb-4 flex justify-between">
                  <div className="h-5 w-24 animate-pulse rounded-sm bg-muted" />
                  <div className="h-5 w-16 animate-pulse rounded-sm bg-muted" />
                </div>
                <div className="flex gap-2">
                  <div className="h-10 flex-1 animate-pulse rounded-sm bg-muted" />
                  <div className="h-10 w-10 animate-pulse rounded-sm bg-muted" />
                  <div className="h-10 flex-1 animate-pulse rounded-sm bg-muted" />
                </div>
              </div>
            </div>

            {/* 디바이더 스켈레톤 */}
            <div className="flex w-2 shrink-0 items-center justify-center">
              <div className="h-12 w-full rounded-sm bg-border" />
            </div>

            {/* 오른쪽 패널 (50%) - 샌드박스 */}
            <div className="w-1/2 p-4 pl-0">
              <div className="h-full animate-pulse rounded-sm border border-border bg-muted" />
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
