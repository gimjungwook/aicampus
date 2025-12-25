import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { CourseCardSkeletonGrid } from '@/components/course/CourseCardSkeleton'

function SectionSkeleton() {
  return (
    <section className="py-12">
      {/* 섹션 헤더 스켈레톤 */}
      <div className="mb-6">
        <div className="h-8 w-64 animate-pulse rounded bg-muted" />
        <div className="mt-2 h-5 w-96 animate-pulse rounded bg-muted" />
      </div>

      {/* 카테고리 필터 스켈레톤 */}
      <div className="mb-6 flex gap-2 overflow-x-auto">
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className="h-9 w-20 shrink-0 animate-pulse rounded-full bg-muted"
          />
        ))}
      </div>

      {/* 코스 그리드 스켈레톤 */}
      <CourseCardSkeletonGrid count={4} />

      {/* 더보기 버튼 스켈레톤 */}
      <div className="flex justify-center mt-10">
        <div className="h-14 w-64 animate-pulse rounded-sm bg-muted" />
      </div>
    </section>
  )
}

export default function CoursesLoading() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />

      <main className="flex-1">
        <div className="max-w-[1289px] mx-auto px-5 lg:px-0">
          {/* 아티클 배너 스켈레톤 */}
          <section className="pt-6">
            <div className="w-full aspect-[5/1] animate-pulse rounded-[15px] bg-muted" />
          </section>

          {/* 인기 강의 섹션 스켈레톤 */}
          <SectionSkeleton />

          {/* 신규 강의 섹션 스켈레톤 */}
          <SectionSkeleton />
        </div>
      </main>

      <Footer />
    </div>
  )
}
