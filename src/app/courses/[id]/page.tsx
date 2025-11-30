import { notFound } from 'next/navigation'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import {
  CourseHeader,
  CourseProgress,
  ModuleAccordion,
  EnrollButton,
} from '@/components/course'
import { getCourseWithProgress } from '@/lib/actions/course'
import type { ModuleWithProgress } from '@/lib/types/course'

interface CourseDetailPageProps {
  params: Promise<{ id: string }>
}

export async function generateMetadata({ params }: CourseDetailPageProps) {
  const { id } = await params
  const course = await getCourseWithProgress(id)

  if (!course) {
    return { title: '코스를 찾을 수 없습니다 | AI Campus' }
  }

  return {
    title: `${course.title} | AI Campus`,
    description: course.description || `${course.title} 코스를 학습해보세요.`,
  }
}

export default async function CourseDetailPage({
  params,
}: CourseDetailPageProps) {
  const { id } = await params
  const course = await getCourseWithProgress(id)

  if (!course) {
    notFound()
  }

  const isEnrolled = !!course.enrollment
  const modules = course.modules as ModuleWithProgress[]

  return (
    <div className="flex min-h-screen flex-col">
      <Header />

      <main className="flex-1">
        <div className="mx-auto max-w-4xl px-4 py-8 lg:px-8">
          {/* 코스 헤더 */}
          <CourseHeader course={course} />

          {/* 진도 & 버튼 영역 */}
          <div className="mt-8 space-y-4">
            {/* 진도 표시 (수강 등록된 경우) */}
            {isEnrolled && (
              <CourseProgress
                completedLessons={course.completedLessons}
                totalLessons={course.total_lessons}
                progressPercent={course.progressPercent}
              />
            )}

            {/* 수강 시작/이어하기 버튼 */}
            <EnrollButton
              courseId={course.id}
              isEnrolled={isEnrolled}
              progressPercent={course.progressPercent}
            />
          </div>

          {/* 커리큘럼 */}
          <section className="mt-12">
            <h2 className="mb-4 text-xl font-bold">커리큘럼</h2>
            <div className="space-y-3">
              {modules.map((module, index) => (
                <ModuleAccordion
                  key={module.id}
                  module={module}
                  moduleIndex={index}
                  isEnrolled={isEnrolled}
                  courseId={course.id}
                  defaultOpen={index === 0}
                />
              ))}
            </div>

            {modules.length === 0 && (
              <div className="rounded-2xl border border-border bg-muted/30 p-8 text-center">
                <p className="text-muted-foreground">
                  아직 준비 중인 코스입니다. 곧 콘텐츠가 추가됩니다!
                </p>
              </div>
            )}
          </section>
        </div>
      </main>

      <Footer />
    </div>
  )
}
