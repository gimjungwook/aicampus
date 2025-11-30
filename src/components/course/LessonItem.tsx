'use client'

import Link from 'next/link'
import { cn } from '@/lib/utils/cn'
import { Check, Circle, Lock, Play } from 'lucide-react'
import type { LessonWithProgress } from '@/lib/types/course'

interface LessonItemProps {
  lesson: LessonWithProgress
  lessonIndex: number
  moduleIndex: number
  isEnrolled: boolean
  courseId: string
}

export function LessonItem({
  lesson,
  lessonIndex,
  moduleIndex,
  isEnrolled,
  courseId,
}: LessonItemProps) {
  const isLocked = !isEnrolled
  const isCompleted = lesson.isCompleted

  // 레슨 번호 형식: 1-1, 1-2, 2-1 등
  const lessonNumber = `${moduleIndex + 1}-${lessonIndex + 1}`

  const content = (
    <div
      className={cn(
        'flex items-center gap-3 px-4 py-3 transition-colors',
        isLocked
          ? 'cursor-not-allowed opacity-60'
          : 'cursor-pointer hover:bg-muted/50'
      )}
    >
      {/* 상태 아이콘 */}
      <div className="flex h-6 w-6 shrink-0 items-center justify-center">
        {isLocked ? (
          <Lock className="h-4 w-4 text-muted-foreground" />
        ) : isCompleted ? (
          <div className="flex h-6 w-6 items-center justify-center rounded-full bg-primary">
            <Check className="h-4 w-4 text-primary-foreground" />
          </div>
        ) : (
          <Circle className="h-5 w-5 text-muted-foreground" />
        )}
      </div>

      {/* 레슨 정보 */}
      <div className="flex-1 min-w-0">
        <p
          className={cn(
            'text-sm font-medium truncate',
            isCompleted && 'text-muted-foreground'
          )}
        >
          {lessonNumber}. {lesson.title}
        </p>
      </div>

      {/* 재생 시간 */}
      {lesson.duration_minutes && (
        <span className="shrink-0 text-xs text-muted-foreground">
          {lesson.duration_minutes}분
        </span>
      )}

      {/* 재생 버튼 (호버 시) */}
      {!isLocked && (
        <Play className="h-4 w-4 shrink-0 text-primary opacity-0 transition-opacity group-hover/lesson:opacity-100" />
      )}
    </div>
  )

  if (isLocked) {
    return <div className="group/lesson">{content}</div>
  }

  return (
    <Link
      href={`/lesson/${lesson.id}`}
      className="group/lesson block"
    >
      {content}
    </Link>
  )
}
