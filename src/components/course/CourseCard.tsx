'use client'

import Link from 'next/link'
import Image from 'next/image'
import { cn } from '@/lib/utils/cn'
import { BookOpen, Star, Bookmark } from 'lucide-react'
import type { CourseWithProgress } from '@/lib/types/course'
import { difficultyLabels } from '@/lib/types/course'

interface CourseCardProps {
  course: CourseWithProgress
  showProgress?: boolean
}

export function CourseCard({ course, showProgress = true }: CourseCardProps) {
  const hasEnrollment = !!course.enrollment
  const shouldShowProgress = showProgress && hasEnrollment

  // 임시 평점 (실제로는 DB에서 가져와야 함)
  const rating = 4.8
  const reviewCount = Math.floor(course.total_lessons * 15 + 50)

  return (
    <Link href={`/courses/${course.id}`}>
      <article
        className={cn(
          'group flex h-full flex-col overflow-hidden rounded-2xl bg-card',
          'transition-all duration-300',
          'hover:scale-[1.02]'
        )}
      >
        {/* 썸네일 영역 - 그라디언트 오버레이 + 텍스트 */}
        <div className="relative aspect-[4/5] overflow-hidden rounded-2xl">
          {course.thumbnail_url ? (
            <Image
              src={course.thumbnail_url}
              alt={course.title}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-110"
            />
          ) : (
            <div className="flex h-full items-center justify-center bg-gradient-to-br from-primary/20 to-primary/5">
              <BookOpen className="h-16 w-16 text-primary/40" />
            </div>
          )}

          {/* 그라디언트 오버레이 */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

          {/* 상단 좌측: AI Campus 뱃지 */}
          <div className="absolute left-3 top-3">
            <span className="rounded-lg bg-white/95 px-2.5 py-1.5 text-xs font-bold text-gray-900 shadow-sm backdrop-blur-sm">
              AI Campus
            </span>
          </div>

          {/* 상단 우측: 북마크 아이콘 */}
          <button
            onClick={(e) => {
              e.preventDefault()
              // TODO: 북마크 기능
            }}
            className="absolute right-3 top-3 rounded-lg bg-black/30 p-2 text-white/80 backdrop-blur-sm transition-colors hover:bg-black/50 hover:text-white"
          >
            <Bookmark className="h-5 w-5" />
          </button>

          {/* 하단: 제목 오버레이 */}
          <div className="absolute bottom-0 left-0 right-0 p-4">
            <h3 className="text-xl font-bold leading-tight text-white drop-shadow-lg line-clamp-2">
              {course.title}
            </h3>
          </div>

          {/* 진도 표시 (수강 중인 경우) */}
          {shouldShowProgress && course.progressPercent > 0 && (
            <div className="absolute bottom-0 left-0 right-0 h-1 bg-black/30">
              <div
                className="h-full bg-primary transition-all"
                style={{ width: `${course.progressPercent}%` }}
              />
            </div>
          )}
        </div>

        {/* 하단 정보 영역 */}
        <div className="flex flex-1 flex-col p-3">
          {/* 제목 (이미지 밖) */}
          <p className="mb-2 text-sm font-medium text-foreground line-clamp-2">
            {course.description || course.title}
          </p>

          {/* 카테고리 | 난이도 */}
          <p className="mb-2 text-xs text-muted-foreground">
            {course.category?.name || 'AI 활용'}
            <span className="mx-1.5">|</span>
            {difficultyLabels[course.difficulty]}
          </p>

          {/* 평점 & 레슨 수 */}
          <div className="mt-auto flex items-center gap-3 text-sm">
            <div className="flex items-center gap-1">
              <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
              <span className="font-semibold text-foreground">{rating}</span>
              <span className="text-muted-foreground">({reviewCount})</span>
            </div>
            <span className="text-muted-foreground">
              {course.total_lessons}개 레슨
            </span>
          </div>
        </div>
      </article>
    </Link>
  )
}
