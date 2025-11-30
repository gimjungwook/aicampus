import { cn } from '@/lib/utils/cn'
import { CourseCard } from './CourseCard'
import type { CourseWithProgress } from '@/lib/types/course'

interface CourseGridProps {
  courses: CourseWithProgress[]
  showProgress?: boolean
  className?: string
}

export function CourseGrid({
  courses,
  showProgress = true,
  className,
}: CourseGridProps) {
  if (courses.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <div className="mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-muted">
          <span className="text-4xl">📚</span>
        </div>
        <h3 className="mb-2 text-lg font-bold">코스가 없습니다</h3>
        <p className="text-sm text-muted-foreground">
          곧 새로운 코스가 추가될 예정이에요!
        </p>
      </div>
    )
  }

  return (
    <div
      className={cn(
        'grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4',
        className
      )}
    >
      {courses.map((course) => (
        <CourseCard
          key={course.id}
          course={course}
          showProgress={showProgress}
        />
      ))}
    </div>
  )
}
