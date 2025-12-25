import { notFound } from 'next/navigation'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import {
  CourseDetailClient,
  HeroSection,
  MetaCard,
  MisconceptionSection,
  LearningTargetSection,
  ImageSection,
  CurriculumSection,
  CTABanner,
  ReviewSection,
  RecommendedCourses,
} from '@/components/course/detail'
import { getCourseWithProgress, getCourseSectionImages } from '@/lib/actions/course'
import { getReviewStats } from '@/lib/actions/review'
import { createClient } from '@/lib/supabase/server'
import { checkAdminRole } from '@/lib/utils/admin'
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

  // 병렬로 데이터 가져오기
  const supabase = await createClient()
  const [course, sectionImages, reviewStats, isAdmin, { data: { user } }] = await Promise.all([
    getCourseWithProgress(id),
    getCourseSectionImages(id),
    getReviewStats(id),
    checkAdminRole(),
    supabase.auth.getUser()
  ])

  if (!course) {
    notFound()
  }

  const isEnrolled = !!course.enrollment
  const modules = course.modules as ModuleWithProgress[]

  // 이미지가 있는 섹션만 필터링
  const visibleSections = (['intro'] as const).filter(
    section => sectionImages[section]?.length > 0
  )

  // 첫 번째 레슨 ID
  const firstLessonId = modules[0]?.lessons?.[0]?.id

  return (
    <div className="flex min-h-screen flex-col">
      <Header />

      <main className="flex-1">
        {/* 히어로 섹션 */}
        <HeroSection course={course} reviewStats={reviewStats} />

        {/* 클라이언트 래퍼 (스크롤 + 편집 모드 + 2-column 레이아웃) */}
        <CourseDetailClient
          visibleSections={visibleSections}
          courseTitle={course.title}
          courseId={course.id}
          isEnrolled={isEnrolled}
          firstLessonId={firstLessonId}
          isAdmin={isAdmin}
          sidebarContent={
            <MetaCard
              course={course}
              isEnrolled={isEnrolled}
              progressPercent={course.progressPercent}
              completedLessons={course.completedLessons}
            />
          }
        >
          {/* 소개 섹션 */}
          <section id="intro" className="py-12">
            {/* 이미지 섹션 (있는 경우) */}
            {sectionImages.intro?.length > 0 && (
              <ImageSection sectionId="intro" images={sectionImages.intro} />
            )}

            {/* 착각 섹션 */}
            <MisconceptionSection />

            {/* 추천 대상 섹션 */}
            <LearningTargetSection />
          </section>

          {/* 커리큘럼 */}
          <CurriculumSection
            modules={modules}
            isEnrolled={isEnrolled}
            courseId={course.id}
          />

          {/* CTA 배너 */}
          <CTABanner
            courseId={course.id}
            courseTitle={course.title}
            isEnrolled={isEnrolled}
          />

          {/* 리뷰 섹션 */}
          <ReviewSection
            courseId={course.id}
            isEnrolled={isEnrolled}
            progressPercent={course.progressPercent}
            currentUserId={user?.id}
            isAdmin={isAdmin}
          />

          {/* 추천 클래스 */}
          <RecommendedCourses
            courseId={course.id}
            categoryId={course.category_id}
          />
        </CourseDetailClient>
      </main>

      <Footer />
    </div>
  )
}
