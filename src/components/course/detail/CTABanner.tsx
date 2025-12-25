'use client'

import { useRouter } from 'next/navigation'
import { Play, Loader2 } from 'lucide-react'
import { useState, useTransition } from 'react'
import { enrollCourse, getNextLesson } from '@/lib/actions/progress'
import { useAuth } from '@/components/auth/AuthProvider'

interface CTABannerProps {
  courseId: string
  courseTitle: string
  isEnrolled: boolean
}

export function CTABanner({ courseId, courseTitle, isEnrolled }: CTABannerProps) {
  const { user } = useAuth()
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const [error, setError] = useState<string | null>(null)

  const handleClick = async () => {
    setError(null)

    if (!user) {
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

      const nextLessonId = await getNextLesson(courseId)
      if (nextLessonId) {
        router.push(`/lesson/${nextLessonId}`)
      }
    })
  }

  return (
    <section className="bg-[var(--cta-red)] py-12">
      <div className="mx-auto max-w-6xl px-4 text-center">
        <h2 className="mb-2 text-2xl font-bold text-white lg:text-3xl">
          지금 바로 시작하세요!
        </h2>
        <p className="mb-6 text-white/80">
          {courseTitle}
        </p>

        <button
          onClick={handleClick}
          disabled={isPending}
          className="inline-flex items-center gap-2 rounded-lg bg-white px-8 py-4 text-lg font-bold text-[var(--cta-red)] transition-colors hover:bg-white/90 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isPending ? (
            <Loader2 className="h-5 w-5 animate-spin" />
          ) : (
            <>
              <Play className="h-5 w-5" />
              {isEnrolled ? '이어서 학습하기' : '수강 시작하기'}
            </>
          )}
        </button>

        {error && (
          <p className="mt-4 text-sm text-white/80">{error}</p>
        )}
      </div>
    </section>
  )
}
