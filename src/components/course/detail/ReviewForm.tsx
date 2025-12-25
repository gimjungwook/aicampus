'use client'

import { useState } from 'react'
import { StarRating } from './StarRating'
import { createReview, updateReview } from '@/lib/actions/review'
import type { CourseReview } from '@/lib/types/course'

interface ReviewFormProps {
  courseId: string
  existingReview?: CourseReview
  progressPercent: number
  onSuccess?: () => void
  onCancel?: () => void
}

export function ReviewForm({
  courseId,
  existingReview,
  progressPercent,
  onSuccess,
  onCancel
}: ReviewFormProps) {
  const [rating, setRating] = useState(existingReview?.rating || 0)
  const [content, setContent] = useState(existingReview?.content || '')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const isEditing = !!existingReview
  const isValid = rating > 0 && content.trim().length >= 10

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!isValid) return

    setIsSubmitting(true)
    setError(null)

    const result = isEditing
      ? await updateReview(existingReview.id, rating, content)
      : await createReview(courseId, rating, content)

    if (result.success) {
      onSuccess?.()
    } else {
      setError(result.error || '오류가 발생했습니다.')
    }

    setIsSubmitting(false)
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-[#f9f9f9] border border-[#e7e7e7] rounded-[8px] p-6"
    >
      <h3 className="text-lg font-bold mb-4">
        {isEditing ? '리뷰 수정하기' : '내 수강 후기 남기기'}
      </h3>

      {/* 별점 선택 */}
      <div className="mb-4">
        <label className="block text-sm font-medium mb-2">별점</label>
        <StarRating
          rating={rating}
          onChange={setRating}
          size="lg"
        />
      </div>

      {/* 리뷰 내용 */}
      <div className="mb-4">
        <label className="block text-sm font-medium mb-2">리뷰 내용</label>
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="강의에 대한 솔직한 후기를 남겨주세요. (최소 10자)"
          className="w-full h-32 p-3 border border-gray-300 rounded-md resize-none focus:outline-none focus:ring-2 focus:ring-primary"
        />
        <p className="text-xs text-muted-foreground mt-1">
          현재 진도율: {progressPercent}%
        </p>
      </div>

      {/* 에러 메시지 */}
      {error && (
        <p className="text-sm text-red-500 mb-4">{error}</p>
      )}

      {/* 버튼 */}
      <div className="flex gap-2">
        <button
          type="submit"
          disabled={!isValid || isSubmitting}
          className={`
            flex-1 py-3 rounded-md font-medium transition-colors
            ${isValid
              ? 'bg-primary text-white hover:bg-primary/90'
              : 'bg-[#b1b1b1] text-white cursor-not-allowed'
            }
          `}
        >
          {isSubmitting ? '저장 중...' : isEditing ? '수정하기' : '등록하기'}
        </button>

        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="px-6 py-3 border border-gray-300 rounded-md hover:bg-gray-50"
          >
            취소
          </button>
        )}
      </div>
    </form>
  )
}
