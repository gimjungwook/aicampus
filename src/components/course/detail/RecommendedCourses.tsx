import { getRecommendedCourses } from '@/lib/actions/course'
import { CourseCard } from '@/components/course/CourseCard'

interface RecommendedCoursesProps {
  courseId: string
  categoryId: string | null
}

export async function RecommendedCourses({
  courseId,
  categoryId
}: RecommendedCoursesProps) {
  const courses = await getRecommendedCourses(courseId, categoryId, 4)

  if (courses.length === 0) {
    return null
  }

  return (
    <section id="recommended" className="py-12 border-t border-border">
      <h2 className="mb-6 text-2xl font-bold">관련 코스</h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {courses.map((course) => (
          <CourseCard key={course.id} course={course} />
        ))}
      </div>
    </section>
  )
}
