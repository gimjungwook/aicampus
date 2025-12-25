'use client'

import Link from 'next/link'
import Image from 'next/image'
import { X, Clock, BookOpen } from 'lucide-react'
import { Badge } from '@/components/ui/Badge'
import { useWishlist } from './WishlistProvider'
import type { WishlistItem } from '@/lib/types'
import { difficultyLabels } from '@/lib/types/course'

interface WishlistCourseCardProps {
  item: WishlistItem
}

export function WishlistCourseCard({ item }: WishlistCourseCardProps) {
  const { removeFromWishlist } = useWishlist()
  const { course } = item

  const handleRemove = async (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    await removeFromWishlist(course.id)
  }

  return (
    <div className="group relative flex gap-4 rounded-sm border border-border bg-card p-4 transition-shadow hover:shadow-md">
      {/* 삭제 버튼 */}
      <button
        onClick={handleRemove}
        className="absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-full bg-muted/80 opacity-0 transition-opacity hover:bg-destructive hover:text-white group-hover:opacity-100"
        aria-label="위시리스트에서 삭제"
      >
        <X className="h-4 w-4" />
      </button>

      {/* 썸네일 */}
      <Link href={`/courses/${course.id}`} className="shrink-0">
        <div className="relative h-24 w-40 overflow-hidden rounded-sm bg-muted">
          {course.thumbnail_url ? (
            <Image
              src={course.thumbnail_url}
              alt={course.title}
              fill
              sizes="160px"
              className="object-cover transition-transform group-hover:scale-105"
            />
          ) : (
            <div className="flex h-full items-center justify-center">
              <BookOpen className="h-8 w-8 text-muted-foreground" />
            </div>
          )}
        </div>
      </Link>

      {/* 정보 */}
      <div className="flex min-w-0 flex-1 flex-col justify-between">
        <div>
          {/* 카테고리 & 뱃지 */}
          <div className="flex flex-wrap items-center gap-2">
            {course.category && (
              <span className="text-xs font-medium text-muted-foreground">
                {course.category.name}
              </span>
            )}
            {course.is_new && <Badge variant="new">NEW</Badge>}
            {course.is_best && <Badge variant="best">BEST</Badge>}
            {course.is_hot && <Badge variant="hot">HOT</Badge>}
          </div>

          {/* 제목 */}
          <Link href={`/courses/${course.id}`}>
            <h3 className="mt-1 line-clamp-2 font-bold text-card-foreground transition-colors hover:text-primary">
              {course.title}
            </h3>
          </Link>

          {/* 강사명 & 난이도 */}
          <div className="mt-1 flex items-center gap-2 text-sm text-muted-foreground">
            {course.instructor_name && (
              <>
                <span>{course.instructor_name}</span>
                <span>•</span>
              </>
            )}
            <span>{difficultyLabels[course.difficulty]}</span>
          </div>
        </div>

        {/* 메타 정보 */}
        <div className="mt-2 flex items-center justify-between">
          <div className="flex items-center gap-3 text-xs text-muted-foreground">
            <span className="flex items-center gap-1">
              <BookOpen className="h-3.5 w-3.5" />
              {course.total_lessons}개 레슨
            </span>
            {course.estimated_hours && (
              <span className="flex items-center gap-1">
                <Clock className="h-3.5 w-3.5" />
                약 {course.estimated_hours}시간
              </span>
            )}
          </div>

          {/* 가격 */}
          <div className="text-right">
            {course.price === 0 || !course.price ? (
              <span className="font-bold text-primary">무료</span>
            ) : (
              <span className="font-bold">₩{course.price.toLocaleString()}</span>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
