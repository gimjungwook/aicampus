'use client'

import Link from 'next/link'
import Image from 'next/image'
import { cn } from '@/lib/utils/cn'
import { BookOpen, Star } from 'lucide-react'
import { Badge } from '@/components/ui/Badge'
import type { Course, CourseWithProgress } from '@/lib/types/course'
import { difficultyLabels } from '@/lib/types/course'

interface CourseCardProps {
  course: Course | CourseWithProgress
  showProgress?: boolean
}

// Type guard to check if course has progress info
function hasProgressInfo(course: Course | CourseWithProgress): course is CourseWithProgress {
  return 'progressPercent' in course && 'completedLessons' in course
}

export function CourseCard({ course, showProgress = true }: CourseCardProps) {
  const hasEnrollment = hasProgressInfo(course) && !!course.enrollment
  const shouldShowProgress = showProgress && hasEnrollment && hasProgressInfo(course)

  // 임시 평점 (실제로는 DB에서 가져와야 함)
  const rating = 4.8
  const reviewCount = Math.floor(course.total_lessons * 15 + 50)

  return (
    <Link href={`/courses/${course.id}`}>
      <article
        className={cn(
          'group flex h-full flex-col overflow-hidden',
          'transition-all duration-300',
          'hover:scale-[1.02]'
        )}
      >
        {/* 썸네일 영역 */}
        <div className="relative aspect-video overflow-hidden rounded-[15px] border border-[var(--card-border)]">
          {course.thumbnail_url ? (
            <Image
              src={course.thumbnail_url}
              alt={course.title}
              fill
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
              className="object-cover transition-transform duration-500 group-hover:scale-105"
            />
          ) : (
            <div className="flex h-full items-center justify-center bg-gradient-to-br from-primary/20 to-primary/5">
              <BookOpen className="h-16 w-16 text-primary/40" />
            </div>
          )}

          {/* Plus 뱃지 (프리미엄 코스만) */}
          {course.is_premium && (
            <Badge variant="plus" className="absolute left-4 top-3.5">
              Plus
            </Badge>
          )}

          {/* 진도 표시 (수강 중인 경우) */}
          {shouldShowProgress && hasProgressInfo(course) && course.progressPercent > 0 && (
            <div className="absolute bottom-0 left-0 right-0 h-1 bg-black/30">
              <div
                className="h-full bg-primary transition-all"
                style={{ width: `${course.progressPercent}%` }}
              />
            </div>
          )}
        </div>

        {/* 정보 영역 */}
        <div className="flex flex-1 flex-col pt-3 px-2">
          {/* 제목 */}
          <h3 className="font-semibold text-base leading-[1.4] line-clamp-2">
            {course.title}
          </h3>

          {/* 메타: 강사명 | 난이도 */}
          <p className="text-xs text-[var(--card-meta)] mt-1">
            {course.instructor_name || 'Mr. Beast'}
            <span className="mx-1">|</span>
            {difficultyLabels[course.difficulty]}
          </p>

          {/* 평점 */}
          <div className="flex items-center gap-1 mt-2">
            <Star className="h-[18px] w-[18px] fill-amber-400 text-amber-400" />
            <span className="font-semibold text-sm leading-[1.4]">{rating}</span>
            <span className="text-[var(--card-rating)] text-sm leading-[1.4]">({reviewCount})</span>
          </div>

          {/* 태그 뱃지 */}
          <div className="flex gap-1.5 mt-2">
            {course.is_best && <Badge variant="best">BEST</Badge>}
            {course.is_new && <Badge variant="new">NEW</Badge>}
            {course.is_hot && <Badge variant="hot">인기 급상승</Badge>}
          </div>
        </div>
      </article>
    </Link>
  )
}
