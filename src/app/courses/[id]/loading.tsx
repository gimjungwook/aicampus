import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'

export default function CourseDetailLoading() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />

      <main className="flex-1">
        <div className="mx-auto max-w-4xl px-4 py-8 lg:px-8">
          {/* 뒤로가기 스켈레톤 */}
          <div className="mb-4 h-5 w-20 animate-pulse rounded-sm bg-muted" />

          {/* 썸네일 스켈레톤 */}
          <div className="mb-6 aspect-video animate-pulse rounded-sm bg-muted" />

          {/* 뱃지 스켈레톤 */}
          <div className="mb-3 flex gap-2">
            <div className="h-7 w-20 animate-pulse rounded-full bg-muted" />
            <div className="h-7 w-16 animate-pulse rounded-full bg-muted" />
          </div>

          {/* 제목 스켈레톤 */}
          <div className="mb-3 h-9 w-3/4 animate-pulse rounded-sm bg-muted" />

          {/* 설명 스켈레톤 */}
          <div className="mb-4 space-y-2">
            <div className="h-5 w-full animate-pulse rounded-sm bg-muted" />
            <div className="h-5 w-2/3 animate-pulse rounded-sm bg-muted" />
          </div>

          {/* 메타 정보 스켈레톤 */}
          <div className="flex gap-4">
            <div className="h-5 w-20 animate-pulse rounded-sm bg-muted" />
            <div className="h-5 w-24 animate-pulse rounded-sm bg-muted" />
          </div>

          {/* 진도 & 버튼 영역 스켈레톤 */}
          <div className="mt-8 space-y-4">
            {/* 진도 표시 스켈레톤 (수강 등록 상태) */}
            <div className="rounded-sm border border-border bg-card p-4">
              <div className="flex items-center justify-between mb-2">
                <div className="h-4 w-32 animate-pulse rounded-sm bg-muted" />
                <div className="h-4 w-12 animate-pulse rounded-sm bg-muted" />
              </div>
              <div className="h-2 w-full animate-pulse rounded-full bg-muted" />
            </div>

            {/* 찜하기 + 수강 버튼 스켈레톤 */}
            <div className="flex flex-col gap-3 sm:flex-row">
              <div className="h-12 w-full sm:w-auto sm:px-6 animate-pulse rounded-sm bg-muted" />
              <div className="h-12 flex-1 animate-pulse rounded-sm bg-muted" />
            </div>
          </div>

          {/* 커리큘럼 스켈레톤 */}
          <div className="mt-12">
            <div className="mb-4 h-7 w-24 animate-pulse rounded-sm bg-muted" />
            <div className="space-y-3">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="rounded-sm border border-border bg-card p-4"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="h-6 w-6 animate-pulse rounded bg-muted" />
                      <div className="h-5 w-48 animate-pulse rounded-sm bg-muted" />
                    </div>
                    <div className="h-5 w-5 animate-pulse rounded bg-muted" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
