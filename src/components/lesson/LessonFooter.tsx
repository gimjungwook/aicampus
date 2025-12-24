'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { ChevronLeft, ChevronRight, Home, CheckCircle, Trophy } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Modal } from '@/components/ui/Modal'
import { completeLesson, completeCourse } from '@/lib/actions/progress'
import type { LessonContext } from '@/lib/types/lesson'

interface LessonFooterProps {
  context: LessonContext
  isCompleted: boolean
}

export function LessonFooter({ context, isCompleted }: LessonFooterProps) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [showCompletionModal, setShowCompletionModal] = useState(false)

  const handleComplete = async () => {
    if (isLoading) return
    setIsLoading(true)

    try {
      // 레슨 완료 처리
      await completeLesson(context.lesson.id)

      if (context.isLastLesson) {
        // 마지막 레슨인 경우 코스 완료 처리
        await completeCourse(context.courseId)
        setShowCompletionModal(true)
      } else if (context.nextLesson) {
        // 다음 레슨으로 이동
        router.push(`/lesson/${context.nextLesson.id}`)
      }
    } catch (error) {
      console.error('Failed to complete lesson:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleNext = async () => {
    if (!context.nextLesson) return

    // 다음으로 이동 시 현재 레슨 완료 처리
    if (!isCompleted) {
      await completeLesson(context.lesson.id)
    }
    router.push(`/lesson/${context.nextLesson.id}`)
  }

  return (
    <>
      <div className="shrink-0 border-t border-border bg-card px-4 py-3">
        <div className="flex items-center justify-between">
          {/* 왼쪽: 홈 버튼 */}
          <Link href="/">
            <Button variant="outline" size="sm">
              <Home className="mr-1.5 h-4 w-4" />
              홈
            </Button>
          </Link>

          {/* 오른쪽: 네비게이션 버튼 */}
          <div className="flex items-center gap-2">
            {/* 이전 레슨 */}
            {context.prevLesson ? (
              <Link href={`/lesson/${context.prevLesson.id}`}>
                <Button variant="outline" size="sm">
                  <ChevronLeft className="mr-1 h-4 w-4" />
                  이전
                </Button>
              </Link>
            ) : (
              <Button variant="outline" size="sm" disabled>
                <ChevronLeft className="mr-1 h-4 w-4" />
                이전
              </Button>
            )}

            {/* 다음 레슨 또는 완료 */}
            {context.isLastLesson ? (
              <Button
                onClick={handleComplete}
                disabled={isLoading}
                size="sm"
              >
                {isLoading ? (
                  '처리 중...'
                ) : isCompleted ? (
                  <>
                    <Trophy className="mr-1 h-4 w-4" />
                    코스 완료!
                  </>
                ) : (
                  <>
                    코스 완료
                    <CheckCircle className="ml-1 h-4 w-4" />
                  </>
                )}
              </Button>
            ) : (
              <Button
                onClick={handleNext}
                disabled={isLoading || !context.nextLesson}
                size="sm"
              >
                {isCompleted ? '다음' : '완료 & 다음'}
                <ChevronRight className="ml-1 h-4 w-4" />
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* 코스 완료 축하 모달 */}
      <Modal
        isOpen={showCompletionModal}
        onClose={() => {
          setShowCompletionModal(false)
          router.push(`/courses/${context.courseId}`)
        }}
        title=""
      >
        <div className="flex flex-col items-center py-6 text-center">
          <div className="mb-4 rounded-full bg-primary/10 p-4">
            <Trophy className="h-12 w-12 text-primary" />
          </div>
          <h2 className="mb-2 text-2xl font-bold">축하합니다!</h2>
          <p className="mb-6 text-muted-foreground">
            <span className="font-semibold text-foreground">{context.courseTitle}</span>
            <br />
            코스를 모두 완료했습니다!
          </p>
          <Button
            onClick={() => {
              setShowCompletionModal(false)
              router.push(`/courses/${context.courseId}`)
            }}
          >
            코스 페이지로 돌아가기
          </Button>
        </div>
      </Modal>
    </>
  )
}
