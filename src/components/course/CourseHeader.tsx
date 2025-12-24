'use client'

import Image from 'next/image'
import Link from 'next/link'
import { ArrowLeft, BookOpen, Clock } from 'lucide-react'
import { difficultyLabels } from '@/lib/types/course'
import type { Course, Category } from '@/lib/types/course'

interface CourseHeaderProps {
  course: Course & { category?: Category | null }
}

export function CourseHeader({ course }: CourseHeaderProps) {
  return (
    <div>
      {/* 뒤로가기 */}
      <Link
        href="/courses"
        className="mb-4 inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" />
        코스 목록
      </Link>

      {/* 썸네일 */}
      <div className="relative mb-6 aspect-video overflow-hidden rounded-2xl bg-muted">
        {course.thumbnail_url ? (
          <Image
            src={course.thumbnail_url}
            alt={course.title}
            fill
            className="object-cover"
            priority
          />
        ) : (
          <div className="flex h-full items-center justify-center bg-primary/5">
            <BookOpen className="h-20 w-20 text-primary/40" />
          </div>
        )}
      </div>

      {/* 뱃지 */}
      <div className="mb-3 flex flex-wrap gap-2">
        {course.category && (
          <span
            className="rounded-full px-3 py-1 text-sm font-medium"
            style={{
              backgroundColor: course.category.color
                ? `${course.category.color}20`
                : 'var(--primary-10)',
              color: course.category.color || 'var(--primary)',
            }}
          >
            {course.category.icon && (
              <span className="mr-1">{course.category.icon}</span>
            )}
            {course.category.name}
          </span>
        )}
        <span className="rounded-full bg-muted px-3 py-1 text-sm font-medium text-muted-foreground">
          {difficultyLabels[course.difficulty]}
        </span>
      </div>

      {/* 제목 */}
      <h1 className="mb-3 text-3xl font-bold">{course.title}</h1>

      {/* 설명 */}
      {course.description && (
        <p className="mb-4 whitespace-pre-line text-muted-foreground">{course.description}</p>
      )}

      {/* 메타 정보 */}
      <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
        <span className="flex items-center gap-1.5">
          <BookOpen className="h-4 w-4" />
          {course.total_lessons}개 레슨
        </span>
        {course.estimated_hours && (
          <span className="flex items-center gap-1.5">
            <Clock className="h-4 w-4" />약 {course.estimated_hours}시간
          </span>
        )}
      </div>
    </div>
  )
}
