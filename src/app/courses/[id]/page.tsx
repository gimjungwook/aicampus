import { notFound } from 'next/navigation'
import Image from 'next/image'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { getCourseWithProgress, getCourseSectionImages, getRecommendedCourses } from '@/lib/actions/course'
import { createClient } from '@/lib/supabase/server'
import { difficultyLabels } from '@/lib/types/course'
import type { ModuleWithProgress } from '@/lib/types/course'
import { BarChart3, Clock, Hash } from 'lucide-react'
import { CurriculumAccordion } from './CurriculumAccordion'
import { ReviewSection } from './ReviewSection'
import { RecommendedSection } from './RecommendedSection'
import { StickyNav } from './StickyNav'
import { StickyFooter } from './StickyFooter'
import { BannerButton } from './BannerButton'

const sectionTitles = {
  intro: '클래스 소개',
  features: '클래스 특징',
  instructor: '강사 소개',
} as const

interface CoursePageProps {
  params: Promise<{ id: string }>
}

export async function generateMetadata({ params }: CoursePageProps) {
  const { id } = await params
  const course = await getCourseWithProgress(id)

  if (!course) {
    return { title: '코스를 찾을 수 없습니다 | AI Campus' }
  }

  return {
    title: `${course.title} | AI Campus`,
    description: course.description || `${course.title} 코스 상세 페이지`,
  }
}

export default async function CoursePage({
  params,
}: CoursePageProps) {
  const { id } = await params
  const supabase = await createClient()

  const [course, sectionImages, { data: { user } }] = await Promise.all([
    getCourseWithProgress(id),
    getCourseSectionImages(id),
    supabase.auth.getUser(),
  ])

  // 코스가 있을 때만 추천 코스 가져오기
  const recommendedCourses = course
    ? await getRecommendedCourses(id, course.category_id, 4)
    : []

  if (!course) {
    notFound()
  }

  // 현재 사용자 프로필 가져오기
  let currentUser = null
  if (user) {
    const { data: profile } = await supabase
      .from('profiles')
      .select('id, nickname, avatar_url')
      .eq('id', user.id)
      .single()
    if (profile) {
      currentUser = profile
    }
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
            <div className="relative h-[60vh] w-full overflow-hidden">
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
                <div className="flex items-center justify-center gap-8 mb-2">
                  {/* 난이도 */}
                  <div className="flex flex-col items-center gap-1">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-white/10 backdrop-blur-sm">
                      <BarChart3 className="h-5 w-5 text-white" />
                    </div>
                    <div className="text-center">
                      <p className="text-xs text-white/60">난이도</p>
                      <p className="text-sm font-medium text-white">{difficultyLabels[course.difficulty as keyof typeof difficultyLabels]}</p>
                    </div>
                  </div>

                  {/* 학습 시간 */}
                  <div className="flex flex-col items-center gap-1">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-white/10 backdrop-blur-sm">
                      <Clock className="h-5 w-5 text-white" />
                    </div>
                    <div className="text-center">
                      <p className="text-xs text-white/60">학습 시간</p>
                      <p className="text-sm font-medium text-white">
                        {course.estimated_hours ? `${course.estimated_hours}시간` : `${course.total_lessons}분+`}
                      </p>
                    </div>
                  </div>

                  {/* 카테고리 */}
                  <div className="flex flex-col items-center gap-1">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-white/10 backdrop-blur-sm">
                      <Hash className="h-5 w-5 text-white" />
                    </div>
                    <div className="text-center">
                      <p className="text-xs text-white/60">카테고리</p>
                      <p className="text-sm font-medium text-white">{course.category?.name || '미분류'}</p>
                    </div>
                  </div>
                </div>

                {/* 수강하기 버튼 */}
                <BannerButton
                  courseId={id}
                  isEnrolled={!!course.enrollment}
                  isLoggedIn={!!user}
                />
              </div>
            </div>
          </div>
        </section>

        {/* 네비게이션 탭 */}
        <StickyNav />

        {/* 콘텐츠 영역 - 섹션 이미지 (각 섹션별 id 부여) */}
        {/* 클래스 소개 */}
        <section id="intro" className="bg-black">
          {(sectionImages.intro || []).map((image) => (
            <Image
              key={image.id}
              src={image.image_url}
              alt={image.alt_text || sectionTitles.intro}
              width={1920}
              height={1080}
              className="block w-full h-auto"
            />
          ))}
          {(sectionImages.intro || []).length === 0 && (
            <div className="py-16 text-center text-gray-400">
              <p>클래스 소개 이미지가 없습니다.</p>
            </div>
          )}
        </section>

        {/* 클래스 특징 */}
        <section id="features" className="bg-black">
          {(sectionImages.features || []).map((image) => (
            <Image
              key={image.id}
              src={image.image_url}
              alt={image.alt_text || sectionTitles.features}
              width={1920}
              height={1080}
              className="block w-full h-auto"
            />
          ))}
          {(sectionImages.features || []).length === 0 && (
            <div className="py-16 text-center text-gray-400">
              <p>클래스 특징 이미지가 없습니다.</p>
            </div>
          )}
        </section>

        {/* 강사 소개 */}
        <section id="instructor" className="bg-black">
          {(sectionImages.instructor || []).map((image) => (
            <Image
              key={image.id}
              src={image.image_url}
              alt={image.alt_text || sectionTitles.instructor}
              width={1920}
              height={1080}
              className="block w-full h-auto"
            />
          ))}
          {(sectionImages.instructor || []).length === 0 && (
            <div className="py-16 text-center text-gray-400">
              <p>강사 소개 이미지가 없습니다.</p>
            </div>
          )}
        </section>

        {/* 커리큘럼 섹션 */}
        <CurriculumAccordion modules={modules} />

        {/* 후기 섹션 */}
        <ReviewSection courseId={id} currentUser={currentUser} />

        {/* 추천 강의 섹션 */}
        <RecommendedSection courses={recommendedCourses} currentCourseId={id} />

        {/* Sticky footer 공간 확보 */}
        <div className="h-16 bg-white" />
      </main>

      {/* Sticky Footer */}
      <StickyFooter
        title={course.title}
        courseId={id}
        isEnrolled={!!course.enrollment}
        isLoggedIn={!!user}
      />

      <Footer />
    </div>
  )
}
