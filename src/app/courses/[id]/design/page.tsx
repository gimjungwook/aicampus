import { notFound } from 'next/navigation'
import Image from 'next/image'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { getCourseWithProgress } from '@/lib/actions/course'

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
