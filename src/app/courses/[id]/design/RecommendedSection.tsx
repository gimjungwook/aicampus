import { CourseCard } from '@/components/course/CourseCard'
import type { Course } from '@/lib/types/course'

interface RecommendedSectionProps {
  courses: Course[]
  currentCourseId: string
}

export function RecommendedSection({ courses, currentCourseId }: RecommendedSectionProps) {
  // 현재 코스 제외
  const filteredCourses = courses.filter((c) => c.id !== currentCourseId).slice(0, 4)

  if (filteredCourses.length === 0) {
    return null
  }

  return (
    <section id="recommended" className="bg-white py-12">
      <div className="container mx-auto px-4">
        <h2 className="mb-8 text-2xl font-bold text-gray-900">
          당신이 놓치지 말아야 할 추천 강의
        </h2>

        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
          {filteredCourses.map((course) => (
            <CourseCard key={course.id} course={course} showProgress={false} />
          ))}
        </div>
      </div>
    </section>
  )
}
