'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { Loader2 } from 'lucide-react'
import { enrollCourse, getNextLesson } from '@/lib/actions/progress'

interface BannerButtonProps {
  courseId: string
  isEnrolled: boolean
  isLoggedIn: boolean
}

export function BannerButton({ courseId, isEnrolled, isLoggedIn }: BannerButtonProps) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const [error, setError] = useState<string | null>(null)

  const handleClick = async () => {
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
    <div className="flex flex-col items-center gap-2">
      <button
        onClick={handleClick}
        disabled={isPending}
        className="rounded-lg bg-red-500 px-24 py-2.5 text-base font-semibold text-white transition-colors hover:bg-red-600 disabled:cursor-not-allowed disabled:opacity-50"
      >
        {isPending ? (
          <Loader2 className="h-5 w-5 animate-spin" />
        ) : (
          '지금 수강하기'
        )}
      </button>
      {error && <span className="text-sm text-red-400">{error}</span>}
    </div>
  )
}
