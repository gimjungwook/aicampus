import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'

export default function CourseDetailLoading() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />

      <main className="flex-1">
        <div className="mx-auto max-w-4xl px-4 py-8 lg:px-8">
          {/* 뒤로가기 스켈레톤 */}
          <div className="mb-4 h-5 w-20 animate-pulse rounded bg-muted" />

          {/* 썸네일 스켈레톤 */}
          <div className="mb-6 aspect-video animate-pulse rounded-2xl bg-muted" />

          {/* 뱃지 스켈레톤 */}
          <div className="mb-3 flex gap-2">
            <div className="h-7 w-20 animate-pulse rounded-full bg-muted" />
            <div className="h-7 w-16 animate-pulse rounded-full bg-muted" />
          </div>

          {/* 제목 스켈레톤 */}
          <div className="mb-3 h-9 w-3/4 animate-pulse rounded bg-muted" />

          {/* 설명 스켈레톤 */}
          <div className="mb-4 space-y-2">
            <div className="h-5 w-full animate-pulse rounded bg-muted" />
            <div className="h-5 w-2/3 animate-pulse rounded bg-muted" />
          </div>

          {/* 메타 정보 스켈레톤 */}
          <div className="flex gap-4">
            <div className="h-5 w-20 animate-pulse rounded bg-muted" />
            <div className="h-5 w-24 animate-pulse rounded bg-muted" />
          </div>

          {/* 버튼 스켈레톤 */}
          <div className="mt-8 h-16 w-full animate-pulse rounded-2xl bg-muted" />

          {/* 커리큘럼 스켈레톤 */}
          <div className="mt-12">
            <div className="mb-4 h-7 w-24 animate-pulse rounded bg-muted" />
            <div className="space-y-3">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="h-16 animate-pulse rounded-2xl bg-muted"
                />
              ))}
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
