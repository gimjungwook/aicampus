'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { Loader2 } from 'lucide-react'
import { enrollCourse, getNextLesson } from '@/lib/actions/progress'

interface StickyFooterProps {
  title: string
  courseId: string
  isEnrolled: boolean
  isLoggedIn: boolean
}

export function StickyFooter({ title, courseId, isEnrolled, isLoggedIn }: StickyFooterProps) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const [error, setError] = useState<string | null>(null)

  // 수강 신청 하기
  const handleEnroll = async () => {
    setError(null)

    if (!isLoggedIn) {
      router.push('/login')
      return
    }

    startTransition(async () => {
      if (!isEnrolled) {
        const result = await enrollCourse(courseId)
        if (!result.success) {
          setError(result.error || '수강 등록에 실패했습니다')
          return
        }
      }
      // 등록 후 페이지 새로고침
      router.refresh()
    })
  }

  // 지금 당장 시청하기
  const handleWatch = async () => {
    setError(null)

    if (!isLoggedIn) {
      router.push('/login')
      return
    }

    startTransition(async () => {
      // 수강 등록 안 되어있으면 먼저 등록
      if (!isEnrolled) {
        const result = await enrollCourse(courseId)
        if (!result.success) {
          setError(result.error || '수강 등록에 실패했습니다')
          return
        }
      }

      // 다음 레슨으로 이동
      const nextLessonId = await getNextLesson(courseId)
      if (nextLessonId) {
        router.push(`/lesson/${nextLessonId}`)
      }
    })
  }

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-[#1d1d1d]">
      <div className="container mx-auto flex items-center justify-between px-4 py-3.5">
        {/* 코스 제목 */}
        <p className="text-base font-medium text-white">{title}</p>

        {/* 버튼 그룹 */}
        <div className="flex items-center gap-3">
          {error && <span className="text-sm text-red-400">{error}</span>}

          <button
            onClick={handleEnroll}
            disabled={isPending || isEnrolled}
            className="rounded-md bg-white px-4 py-2.5 text-sm font-medium text-black transition-colors hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isPending ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : isEnrolled ? (
              '수강 중'
            ) : (
              '수강 신청 하기'
            )}
          </button>
          <button
            onClick={handleWatch}
            disabled={isPending}
            className="rounded-md bg-[#ff153c] px-4 py-2.5 text-sm font-bold text-white transition-colors hover:bg-red-600 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isPending ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              '지금 당장 시청하기'
            )}
          </button>
        </div>
      </div>
    </div>
  )
}
