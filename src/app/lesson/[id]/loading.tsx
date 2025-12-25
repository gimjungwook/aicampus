import { Header } from '@/components/layout/Header'

export default function LessonLoading() {
  return (
    <div className="flex h-screen flex-col overflow-hidden">
      <Header />

      <main className="flex flex-1 flex-col overflow-hidden">
        {/* LessonHeader 스켈레톤 */}
        <div className="shrink-0 border-b border-border bg-card">
          <div className="flex items-center justify-between px-4 py-3">
            {/* 좌측: Breadcrumb */}
            <div className="flex items-center gap-4 min-w-0">
              <div className="h-5 w-24 animate-pulse rounded-sm bg-muted" />
              <div className="h-5 w-3 animate-pulse rounded-sm bg-muted" />
              <div className="h-5 w-40 animate-pulse rounded-sm bg-muted" />
            </div>
            {/* 우측: 샌드박스 토글 */}
            <div className="hidden lg:flex items-center gap-3">
              <div className="h-4 w-20 animate-pulse rounded-sm bg-muted" />
              <div className="h-10 w-10 animate-pulse rounded-sm bg-muted" />
            </div>
          </div>
        </div>

        {/* 메인 콘텐츠 */}
        <div className="flex-1 overflow-hidden">
          {/* 모바일: 세로 스택 */}
          <div className="flex flex-col gap-6 overflow-y-auto p-4 lg:hidden">
            {/* 영상 스켈레톤 */}
            <div className="aspect-video animate-pulse rounded-sm bg-muted" />

            {/* 샌드박스 스켈레톤 */}
            <div className="h-[500px] animate-pulse rounded-sm border border-border bg-muted" />
          </div>

          {/* 데스크톱: 50:50 좌우 분할 */}
          <div className="hidden h-full lg:flex">
            {/* 왼쪽 패널 (50%) */}
            <div className="flex w-1/2 flex-col gap-4 overflow-y-auto p-4">
              {/* 영상/블로그 스켈레톤 */}
              <div className="aspect-video animate-pulse rounded-sm bg-muted" />
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

        {/* LessonFooter 스켈레톤 */}
        <div className="shrink-0 border-t border-border bg-card px-4 py-3">
          <div className="flex items-center justify-between">
            {/* 왼쪽: 홈 버튼 */}
            <div className="h-9 w-16 animate-pulse rounded-sm bg-muted" />

            {/* 오른쪽: 네비게이션 버튼 */}
            <div className="flex items-center gap-2">
              <div className="h-9 w-16 animate-pulse rounded-sm bg-muted" />
              <div className="h-9 w-24 animate-pulse rounded-sm bg-muted" />
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
