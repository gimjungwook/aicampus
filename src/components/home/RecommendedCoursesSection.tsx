'use client'

import { SectionHeader } from './SectionHeader'
import { CourseGrid } from '@/components/course/CourseGrid'
import type { CourseWithProgress } from '@/lib/types/course'

interface RecommendedCoursesSectionProps {
  courses: CourseWithProgress[]
}

export function RecommendedCoursesSection({ courses }: RecommendedCoursesSectionProps) {
  if (courses.length === 0) return null

  return (
    <section className="py-12">
      <SectionHeader
        title="AI Campus가 추천하는 강의"
        subtitle="지금 가장 주목받는 강의를 만나보세요."
      />
      <CourseGrid courses={courses.slice(0, 4)} showProgress={false} />
    </section>
  )
}
