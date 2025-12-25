import { notFound } from 'next/navigation'
import Image from 'next/image'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { getCourseWithProgress, getCourseSectionImages } from '@/lib/actions/course'
import { difficultyLabels } from '@/lib/types/course'
import type { ModuleWithProgress } from '@/lib/types/course'
import { BarChart3, Clock, Hash } from 'lucide-react'
import { CurriculumAccordion } from './CurriculumAccordion'

const sectionTitles = {
  intro: '클래스 소개',
  features: '클래스 특징',
  instructor: '강사 소개',
} as const

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
  const [course, sectionImages] = await Promise.all([
    getCourseWithProgress(id),
    getCourseSectionImages(id),
  ])

  if (!course) {
    notFound()
  }

  const sections = ['intro', 'features', 'instructor'] as const
  const modules = (course.modules || []) as ModuleWithProgress[]

  return (
    <div className="flex min-h-screen flex-col">
      <Header />

      <main className="flex-1 bg-black">
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
              <div className="pointer-events-none absolute inset-0 bg-black/60" />
              {/* 좌우 그라디언트 오버레이 */}
              <div className="pointer-events-none absolute inset-y-0 left-0 w-48 bg-gradient-to-r from-black to-transparent" />
              <div className="pointer-events-none absolute inset-y-0 right-0 w-48 bg-gradient-to-l from-black to-transparent" />
              {/* 하단 그라디언트 오버레이 */}
              <div className="pointer-events-none absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-black to-transparent" />
              {/* 코스 제목 및 메타 정보 */}
              <div className="absolute inset-0 flex flex-col items-center justify-end gap-3 pb-5">
                <h1 className="text-3xl font-bold text-white">{course.title}</h1>

                {/* 메타 정보 */}
                <div className="flex items-center gap-6 mb-2">
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

                {/* 수강하기 버튼 */}
                <button className="rounded-lg bg-red-500 px-24 py-2.5 text-base font-semibold text-white transition-colors hover:bg-red-600">
                  지금 수강하기
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* 네비게이션 탭 */}
        <nav className="sticky top-16 z-40 bg-[#393939]">
          <div className="container mx-auto">
            <div className="flex items-center justify-center gap-12">
              <button className="relative py-4 text-sm text-white after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-full after:bg-white">
                클래스 소개
              </button>
              <button className="py-4 text-sm text-gray-400 hover:text-white">
                클래스 특징
              </button>
              <button className="py-4 text-sm text-gray-400 hover:text-white">
                강사 소개
              </button>
              <button className="py-4 text-sm text-gray-400 hover:text-white">
                커리큘럼
              </button>
              <button className="py-4 text-sm text-gray-400 hover:text-white">
                후기
              </button>
              <button className="py-4 text-sm text-gray-400 hover:text-white">
                추천 클래스
              </button>
            </div>
          </div>
        </nav>

        {/* 콘텐츠 영역 - 섹션 이미지 (전체 너비, 패딩/마진 없음) */}
        <div className="bg-black">
          {sections.map((sectionType) => {
            const images = sectionImages[sectionType] || []
            return images.map((image) => (
              <Image
                key={image.id}
                src={image.image_url}
                alt={image.alt_text || sectionTitles[sectionType]}
                width={1920}
                height={1080}
                className="block w-full h-auto"
              />
            ))
          })}

          {/* 이미지가 하나도 없을 때 */}
          {sections.every((s) => (sectionImages[s] || []).length === 0) && (
            <div className="py-16 text-center text-gray-400">
              <p>아직 등록된 섹션 이미지가 없습니다.</p>
              <p className="mt-2 text-sm">admin에서 이미지를 추가해주세요.</p>
            </div>
          )}
        </div>

        {/* 커리큘럼 섹션 */}
        <CurriculumAccordion modules={modules} />
      </main>

      <Footer />
    </div>
  )
}
