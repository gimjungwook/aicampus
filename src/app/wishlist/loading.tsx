import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'

function CourseCardSkeleton() {
  return (
    <div className="flex gap-4 rounded-sm border border-border bg-card p-4">
      {/* 썸네일 스켈레톤 */}
      <div className="h-24 w-40 shrink-0 animate-pulse rounded-sm bg-muted" />

      {/* 정보 스켈레톤 */}
      <div className="flex flex-1 flex-col justify-between">
        <div>
          <div className="h-3 w-16 animate-pulse rounded bg-muted" />
          <div className="mt-2 h-5 w-3/4 animate-pulse rounded bg-muted" />
          <div className="mt-2 h-3 w-1/3 animate-pulse rounded bg-muted" />
        </div>
        <div className="flex items-center justify-between">
          <div className="h-3 w-24 animate-pulse rounded bg-muted" />
          <div className="h-4 w-12 animate-pulse rounded bg-muted" />
        </div>
      </div>
    </div>
  )
}

export default function WishlistLoading() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />

      <main className="flex-1">
        <div className="mx-auto max-w-6xl px-4 py-8 lg:px-8">
          {/* 헤더 스켈레톤 */}
          <div className="mb-6 flex items-center justify-between">
            <div className="h-8 w-32 animate-pulse rounded bg-muted" />
            <div className="h-5 w-24 animate-pulse rounded bg-muted" />
          </div>

          {/* 콘텐츠 스켈레톤 */}
          <div className="grid gap-8 lg:grid-cols-3">
            {/* 코스 목록 스켈레톤 */}
            <div className="space-y-4 lg:col-span-2">
              <CourseCardSkeleton />
              <CourseCardSkeleton />
              <CourseCardSkeleton />
            </div>

            {/* 사이드바 스켈레톤 */}
            <div className="lg:col-span-1">
              <div className="rounded-sm border border-border bg-card p-6">
                <div className="h-6 w-24 animate-pulse rounded bg-muted" />
                <div className="mt-4 space-y-3">
                  <div className="flex justify-between">
                    <div className="h-4 w-32 animate-pulse rounded bg-muted" />
                    <div className="h-4 w-12 animate-pulse rounded bg-muted" />
                  </div>
                  <div className="flex justify-between">
                    <div className="h-4 w-28 animate-pulse rounded bg-muted" />
                    <div className="h-4 w-12 animate-pulse rounded bg-muted" />
                  </div>
                </div>
                <div className="my-4 h-px bg-border" />
                <div className="flex justify-between">
                  <div className="h-5 w-24 animate-pulse rounded bg-muted" />
                  <div className="h-6 w-16 animate-pulse rounded bg-muted" />
                </div>
                <div className="mt-6 h-14 w-full animate-pulse rounded-sm bg-muted" />
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
