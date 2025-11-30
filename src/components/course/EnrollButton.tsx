'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/Button'
import { enrollCourse, getNextLesson } from '@/lib/actions/progress'
import { useAuth } from '@/components/auth/AuthProvider'
import { Play, Loader2 } from 'lucide-react'

interface EnrollButtonProps {
  courseId: string
  isEnrolled: boolean
  progressPercent: number
}

export function EnrollButton({
  courseId,
  isEnrolled,
  progressPercent,
}: EnrollButtonProps) {
  const { user } = useAuth()
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const [error, setError] = useState<string | null>(null)

  const handleClick = async () => {
    setError(null)

    if (!user) {
      // 로그인 필요 - 로그인 후 돌아오도록 처리할 수 있음
      // 지금은 간단히 알림만
      setError('로그인이 필요합니다')
      return
    }

    startTransition(async () => {
      if (!isEnrolled) {
        // 수강 등록
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

  // 버튼 텍스트 결정
  const getButtonText = () => {
    if (!user) return '로그인하고 시작하기'
    if (!isEnrolled) return '수강 시작하기'
    if (progressPercent === 0) return '학습 시작하기'
    if (progressPercent === 100) return '다시 학습하기'
    return '이어서 학습하기'
  }

  return (
    <div>
      <Button
        size="xl"
        onClick={handleClick}
        disabled={isPending}
        className="w-full"
      >
        {isPending ? (
          <Loader2 className="h-5 w-5 animate-spin" />
        ) : (
          <>
            <Play className="h-5 w-5" />
            {getButtonText()}
          </>
        )}
      </Button>

      {error && (
        <p className="mt-2 text-center text-sm text-destructive">{error}</p>
      )}
    </div>
  )
}
