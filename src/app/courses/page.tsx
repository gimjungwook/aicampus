import { getCategories, getCoursesWithProgress } from '@/lib/actions/course'
import { CoursesPageClient } from '@/components/course/CoursesPageClient'

export const metadata = {
  title: '코스 | AI Campus',
  description: 'AI 활용 능력을 키워보세요. 실습 중심의 강의로 배워봐요.',
}

export default async function CoursesPage() {
  const [categories, courses] = await Promise.all([
    getCategories(),
    getCoursesWithProgress(),
  ])

  return <CoursesPageClient categories={categories} courses={courses} />
}
