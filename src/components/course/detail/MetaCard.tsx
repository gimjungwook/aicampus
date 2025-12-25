'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { Heart, Play, Loader2, BookOpen, Clock, CheckCircle } from 'lucide-react'
import { enrollCourse, getNextLesson } from '@/lib/actions/progress'
import { useAuth } from '@/components/auth/AuthProvider'
import { useWishlist } from '@/components/wishlist/WishlistProvider'
import { cn } from '@/lib/utils/cn'
import type { Course } from '@/lib/types/course'

interface MetaCardProps {
  course: Course
  isEnrolled: boolean
  progressPercent: number
  completedLessons: number
}

export function MetaCard({
  course,
  isEnrolled,
  progressPercent,
  completedLessons
}: MetaCardProps) {
  const { user } = useAuth()
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const [error, setError] = useState<string | null>(null)
  const { isInWishlist, addToWishlist, removeFromWishlist, isLoading: wishlistLoading } = useWishlist()

  const inWishlist = isInWishlist(course.id)

  const handleEnrollClick = async () => {
    setError(null)

    if (!user) {
      router.push('/login')
      return
    }

    startTransition(async () => {
      if (!isEnrolled) {
        const result = await enrollCourse(course.id)
        if (!result.success) {
          setError(result.error || '수강 등록에 실패했습니다')
          return
        }
      }

      const nextLessonId = await getNextLesson(course.id)
      if (nextLessonId) {
        router.push(`/lesson/${nextLessonId}`)
      }
    })
  }

  const handleWishlistClick = async () => {
    if (!user) {
      router.push('/login')
      return
    }

    if (inWishlist) {
      await removeFromWishlist(course.id)
    } else {
      await addToWishlist(course.id)
    }
  }

  const getButtonText = () => {
    if (!user) return '로그인하고 시작하기'
    if (!isEnrolled) return '지금 수강하기'
    if (progressPercent === 0) return '학습 시작하기'
    if (progressPercent === 100) return '다시 학습하기'
    return '이어서 학습하기'
  }

  return (
    <div className="sticky top-[140px] rounded-lg border border-border bg-card p-6 shadow-lg">
      {/* 가격 */}
      <div className="mb-4">
        {course.price === 0 || !course.price ? (
          <div className="text-3xl font-bold text-[var(--cta-red)]">무료</div>
        ) : (
          <div className="text-3xl font-bold">₩{course.price.toLocaleString()}</div>
        )}
      </div>

      {/* 수강 버튼 */}
      <button
        onClick={handleEnrollClick}
        disabled={isPending}
        className={cn(
          'flex w-full items-center justify-center gap-2 rounded-lg py-4 text-lg font-bold text-white transition-colors',
          'bg-[var(--cta-red)] hover:bg-[var(--cta-red-hover)]',
          'disabled:cursor-not-allowed disabled:opacity-50'
        )}
      >
        {isPending ? (
          <Loader2 className="h-5 w-5 animate-spin" />
        ) : (
          <>
            <Play className="h-5 w-5" />
            {getButtonText()}
          </>
        )}
      </button>

      {error && (
        <p className="mt-2 text-center text-sm text-destructive">{error}</p>
      )}

      {/* 위시리스트 버튼 */}
      {!isEnrolled && (
        <button
          onClick={handleWishlistClick}
          disabled={wishlistLoading}
          className={cn(
            'mt-3 flex w-full items-center justify-center gap-2 rounded-lg border py-3 font-medium transition-colors',
            inWishlist
              ? 'border-[var(--cta-red)] bg-[var(--cta-red)]/10 text-[var(--cta-red)]'
              : 'border-border hover:border-[var(--cta-red)] hover:text-[var(--cta-red)]'
          )}
        >
          <Heart className={cn('h-5 w-5', inWishlist && 'fill-current')} />
          {inWishlist ? '위시리스트에 추가됨' : '위시리스트에 추가'}
        </button>
      )}

      {/* 진도율 표시 (수강 중인 경우) */}
      {isEnrolled && progressPercent > 0 && (
        <div className="mt-4 rounded-lg bg-muted/50 p-4">
          <div className="mb-2 flex items-center justify-between text-sm">
            <span className="text-muted-foreground">학습 진도</span>
            <span className="font-medium">{progressPercent}%</span>
          </div>
          <div className="h-2 overflow-hidden rounded-full bg-muted">
            <div
              className="h-full rounded-full bg-primary transition-all"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
          <div className="mt-2 flex items-center gap-1 text-sm text-muted-foreground">
            <CheckCircle className="h-4 w-4" />
            {completedLessons} / {course.total_lessons} 레슨 완료
          </div>
        </div>
      )}

      {/* 구분선 */}
      <div className="my-5 border-t border-border" />

      {/* 코스 정보 */}
      <div className="space-y-3">
        <div className="flex items-center justify-between text-sm">
          <span className="flex items-center gap-2 text-muted-foreground">
            <BookOpen className="h-4 w-4" />
            레슨 수
          </span>
          <span className="font-medium">{course.total_lessons}개</span>
        </div>

        {course.estimated_hours && (
          <div className="flex items-center justify-between text-sm">
            <span className="flex items-center gap-2 text-muted-foreground">
              <Clock className="h-4 w-4" />
              예상 학습 시간
            </span>
            <span className="font-medium">약 {course.estimated_hours}시간</span>
          </div>
        )}

        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">수강 기간</span>
          <span className="font-medium">무제한</span>
        </div>
      </div>
    </div>
  )
}
