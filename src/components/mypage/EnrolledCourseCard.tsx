'use client'

import Link from 'next/link'
import Image from 'next/image'
import { cn } from '@/lib/utils/cn'
import { Play, CheckCircle2 } from 'lucide-react'
import type { EnrolledCourseWithProgress } from '@/lib/types/user'
import { difficultyLabels } from '@/lib/types/course'

interface EnrolledCourseCardProps {
  course: EnrolledCourseWithProgress
}

export function EnrolledCourseCard({ course }: EnrolledCourseCardProps) {
  const isCompleted = course.progress_percent === 100

  return (
    <div className="group relative overflow-hidden rounded-sm border border-border bg-card transition-all hover:shadow-lg">
      {/* 썸네일 */}
      <div className="relative aspect-video overflow-hidden bg-muted">
        {course.thumbnail_url ? (
          <Image
            src={course.thumbnail_url}
            alt={course.title}
            fill
            className="object-cover transition-transform group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-muted-foreground">
            No Image
          </div>
        )}

        {/* 완료 배지 */}
        {isCompleted && (
          <div className="absolute right-3 top-3 flex items-center gap-1 rounded-full bg-primary px-2.5 py-1 text-xs font-medium text-primary-foreground">
            <CheckCircle2 className="h-3.5 w-3.5" />
            완료
          </div>
        )}
      </div>

      {/* 내용 */}
      <div className="p-4">
        {/* 카테고리 & 난이도 */}
        <div className="mb-2 flex items-center gap-2 text-xs text-muted-foreground">
          {course.category_name && (
            <span className="rounded-full bg-muted px-2 py-0.5">
              {course.category_name}
            </span>
          )}
          <span>{difficultyLabels[course.difficulty]}</span>
        </div>

        {/* 제목 */}
        <h3 className="mb-3 line-clamp-2 font-semibold text-foreground">
          {course.title}
        </h3>

        {/* 진도율 */}
        <div className="mb-3">
          <div className="mb-1 flex items-center justify-between text-xs">
            <span className="text-muted-foreground">
              {course.completed_lessons}/{course.total_lessons} 레슨
            </span>
            <span className={cn(
              'font-medium',
              isCompleted ? 'text-primary' : 'text-foreground'
            )}>
              {course.progress_percent}%
            </span>
          </div>
          <div className="h-2 overflow-hidden rounded-full bg-muted">
            <div
              className={cn(
                'h-full rounded-full transition-all',
                isCompleted ? 'bg-primary' : 'bg-primary/70'
              )}
              style={{ width: `${course.progress_percent}%` }}
            />
          </div>
        </div>

        {/* 학습하기 버튼 */}
        <Link
          href={`/courses/${course.id}`}
          className={cn(
            'flex w-full items-center justify-center gap-2 rounded-sm py-2.5 text-sm font-semibold',
            'transition-all duration-200',
            isCompleted
              ? 'bg-muted text-foreground hover:bg-muted/80'
              : 'bg-primary text-primary-foreground shadow-md shadow-primary/20 hover:bg-primary/90'
          )}
        >
          <Play className="h-4 w-4" />
          {isCompleted ? '복습하기' : '학습 계속하기'}
        </Link>
      </div>
    </div>
  )
}
