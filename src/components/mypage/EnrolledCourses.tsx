'use client'

import Link from 'next/link'
import { BookOpen, ArrowRight } from 'lucide-react'
import { EnrolledCourseCard } from './EnrolledCourseCard'
import type { EnrolledCourseWithProgress } from '@/lib/types/user'

interface EnrolledCoursesProps {
  courses: EnrolledCourseWithProgress[]
}

export function EnrolledCourses({ courses }: EnrolledCoursesProps) {
  if (courses.length === 0) {
    return (
      <div className="rounded-sm border border-border bg-card p-8 text-center">
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-muted">
          <BookOpen className="h-8 w-8 text-muted-foreground" />
        </div>
        <h3 className="mb-2 text-lg font-semibold text-foreground">
          수강 중인 코스가 없습니다
        </h3>
        <p className="mb-6 text-sm text-muted-foreground">
          다양한 AI 활용 강의를 시작해보세요!
        </p>
        <Link
          href="/courses"
          className="inline-flex items-center gap-2 rounded-sm bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground shadow-md shadow-primary/20 transition-colors hover:bg-primary/90"
        >
          코스 둘러보기
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    )
  }

  // 진행 중인 코스와 완료된 코스 분리
  const inProgress = courses.filter(c => c.progress_percent < 100)
  const completed = courses.filter(c => c.progress_percent === 100)

  return (
    <div className="space-y-8">
      {/* 진행 중인 코스 */}
      {inProgress.length > 0 && (
        <div>
          <h3 className="mb-4 text-lg font-semibold text-foreground">
            진행 중 ({inProgress.length})
          </h3>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {inProgress.map(course => (
              <EnrolledCourseCard key={course.id} course={course} />
            ))}
          </div>
        </div>
      )}

      {/* 완료된 코스 */}
      {completed.length > 0 && (
        <div>
          <h3 className="mb-4 text-lg font-semibold text-foreground">
            완료됨 ({completed.length})
          </h3>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {completed.map(course => (
              <EnrolledCourseCard key={course.id} course={course} />
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
