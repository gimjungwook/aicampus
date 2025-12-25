import { notFound } from 'next/navigation'
import Image from 'next/image'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { getCourseWithProgress } from '@/lib/actions/course'
import { difficultyLabels } from '@/lib/types/course'
import { BarChart3, Clock, Hash } from 'lucide-react'

interface CourseDesignPageProps {
  params: Promise<{ id: string }>
}

export async function generateMetadata({ params }: CourseDesignPageProps) {
  const { id } = await params
  const course = await getCourseWithProgress(id)

  if (!course) {
    return { title: '코스를 찾을 수 없습니다 | AI Campus' }
  }

  return {
    title: `[Design] ${course.title} | AI Campus`,
    description: `${course.title} 코스 디자인 테스트 페이지`,
  }
}

export default async function CourseDesignPage({
  params,
}: CourseDesignPageProps) {
  const { id } = await params
  const course = await getCourseWithProgress(id)

  if (!course) {
    notFound()
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Header />

      <main className="flex-1">
        {/* 배너 섹션 - 썸네일 */}
        <section className="relative w-full bg-black">
          <div className="mx-auto max-w-3xl">
            <div className="relative h-[28rem] w-full overflow-hidden">
              {course.thumbnail_url ? (
                <Image
                  src={course.thumbnail_url}
                  alt={course.title}
                  fill
                  className="object-contain"
                  priority
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center bg-gray-800">
                  <span className="text-gray-400">썸네일 없음</span>
                </div>
              )}
              {/* 검은색 오버레이 */}
              <div className="pointer-events-none absolute inset-0 bg-black/40" />
              {/* 좌우 그라디언트 오버레이 */}
              <div className="pointer-events-none absolute inset-y-0 left-0 w-48 bg-gradient-to-r from-black to-transparent" />
              <div className="pointer-events-none absolute inset-y-0 right-0 w-48 bg-gradient-to-l from-black to-transparent" />
              {/* 하단 그라디언트 오버레이 */}
              <div className="pointer-events-none absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-black to-transparent" />
              {/* 코스 제목 및 메타 정보 */}
              <div className="absolute inset-0 flex flex-col items-center justify-center gap-6">
                <h1 className="text-3xl font-bold text-white">{course.title}</h1>

                {/* 메타 정보 */}
                <div className="flex items-center gap-6">
                  {/* 난이도 */}
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-white/10 backdrop-blur-sm">
                      <BarChart3 className="h-5 w-5 text-white" />
                    </div>
                    <div className="text-left">
                      <p className="text-xs text-white/60">난이도</p>
                      <p className="text-sm font-medium text-white">{difficultyLabels[course.difficulty]}</p>
                    </div>
                  </div>

                  {/* 학습 시간 */}
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-white/10 backdrop-blur-sm">
                      <Clock className="h-5 w-5 text-white" />
                    </div>
                    <div className="text-left">
                      <p className="text-xs text-white/60">학습 시간</p>
                      <p className="text-sm font-medium text-white">
                        {course.estimated_hours ? `${course.estimated_hours}시간` : `${course.total_lessons}분+`}
                      </p>
                    </div>
                  </div>

                  {/* 카테고리 */}
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-white/10 backdrop-blur-sm">
                      <Hash className="h-5 w-5 text-white" />
                    </div>
                    <div className="text-left">
                      <p className="text-xs text-white/60">카테고리</p>
                      <p className="text-sm font-medium text-white">{course.category?.name || '미분류'}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 콘텐츠 영역 */}
        <div className="container mx-auto px-4 py-8">
          <div className="mb-8 rounded-sm border border-yellow-500 bg-yellow-50 p-4">
            <p className="text-sm font-medium text-yellow-800">
              디자인 테스트 페이지 - 코스: {course.title}
            </p>
          </div>

          <div className="space-y-8">
            <h1 className="text-3xl font-bold">{course.title}</h1>
            <p className="text-gray-600">{course.description}</p>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
