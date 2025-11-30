import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { CourseCardSkeletonGrid } from '@/components/course/CourseCardSkeleton'

export default function CoursesLoading() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />

      <main className="flex-1">
        <div className="mx-auto max-w-7xl px-4 py-8 lg:px-8">
          {/* 헤더 스켈레톤 */}
          <div className="mb-8">
            <div className="mb-2 h-9 w-24 animate-pulse rounded bg-muted" />
            <div className="h-5 w-64 animate-pulse rounded bg-muted" />
          </div>

          {/* 카테고리 필터 스켈레톤 */}
          <div className="mb-6 flex gap-2">
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className="h-9 w-20 animate-pulse rounded-full bg-muted"
              />
            ))}
          </div>

          {/* 코스 그리드 스켈레톤 */}
          <CourseCardSkeletonGrid count={6} />
        </div>
      </main>

      <Footer />
    </div>
  )
}
