import { getCategories, getCoursesWithProgress } from '@/lib/actions/course'
import { getActiveBanners } from '@/lib/actions/banner'
import { CoursesPageClient } from '@/components/course/CoursesPageClient'

export const metadata = {
  title: '코스 | AI Campus',
  description: 'AI 활용 능력을 키워보세요. 실습 중심의 강의로 배워봐요.',
}

export default async function CoursesPage() {
  const [categories, courses, banners] = await Promise.all([
    getCategories(),
    getCoursesWithProgress(),
    getActiveBanners(),
  ])

  // 추천, BEST, NEW 코스 분리
  const recommendedCourses = courses.filter(c => c.is_hot).slice(0, 4)
  const popularCourses = courses.filter(c => c.is_best).slice(0, 8)
  const newCourses = courses.filter(c => c.is_new).slice(0, 8)

  return (
    <CoursesPageClient
      categories={categories}
      courses={courses}
      banners={banners}
      recommendedCourses={recommendedCourses}
      popularCourses={popularCourses}
      newCourses={newCourses}
    />
  )
}
