'use client'

import { useState } from 'react'
import { format } from 'date-fns'
import { ko } from 'date-fns/locale'
import { updateReviewReply, deleteReviewReply, createReviewReply } from '@/lib/actions/review'
import type { ReviewReply } from '@/lib/types/course'

interface ReviewReplyComponentProps {
  reply: ReviewReply
  instructorName?: string
  canEdit?: boolean
  onUpdate?: () => void
}

export function ReviewReplyComponent({
  reply,
  instructorName = '강사',
  canEdit = false,
  onUpdate
}: ReviewReplyComponentProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [content, setContent] = useState(reply.content)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleUpdate = async () => {
    if (!content.trim()) return

    setIsSubmitting(true)
    const result = await updateReviewReply(reply.id, content)

    if (result.success) {
      setIsEditing(false)
      onUpdate?.()
    } else {
      alert(result.error)
    }
    setIsSubmitting(false)
  }

  const handleDelete = async () => {
    if (!confirm('답변을 삭제하시겠습니까?')) return

    const result = await deleteReviewReply(reply.id)

    if (result.success) {
      onUpdate?.()
    } else {
      alert(result.error)
    }
  }

  return (
    <div className="mt-4 ml-6 bg-[#f8f9fa] rounded-[8px] p-4">
      {/* 헤더 */}
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <span className="text-[14px] font-bold text-[#495059]">
            {instructorName}
          </span>
          <span className="bg-[#ffeef1] text-[#ff0000] text-[11px] rounded-[4px] px-2 py-0.5">
            강의자
          </span>
        </div>
        <span className="text-[14px] text-[#858e97]">
          {format(new Date(reply.created_at), 'yyyy.MM.dd', { locale: ko })}
        </span>
      </div>

      {/* 내용 */}
      {isEditing ? (
        <div className="space-y-3">
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-md resize-none h-24"
          />
          <div className="flex gap-2">
            <button
              onClick={handleUpdate}
              disabled={isSubmitting}
              className="px-4 py-2 bg-primary text-white text-sm rounded-md disabled:opacity-50"
            >
              {isSubmitting ? '저장 중...' : '저장'}
            </button>
            <button
              onClick={() => {
                setContent(reply.content)
                setIsEditing(false)
              }}
              className="px-4 py-2 border border-gray-300 text-sm rounded-md"
            >
              취소
            </button>
          </div>
        </div>
      ) : (
        <>
          <p className="text-[16px] text-[#202529] leading-[27px]">
            {reply.content}
          </p>

          {/* 수정/삭제 버튼 */}
          {canEdit && (
            <div className="mt-3 flex gap-2">
              <button
                onClick={() => setIsEditing(true)}
                className="text-sm text-muted-foreground hover:text-foreground"
              >
                수정
              </button>
              <button
                onClick={handleDelete}
                className="text-sm text-red-500 hover:text-red-600"
              >
                삭제
              </button>
            </div>
          )}
        </>
      )}
    </div>
  )
}

// 답변 작성 폼
interface ReplyFormProps {
  reviewId: string
  onSuccess: () => void
  onCancel: () => void
}

export function ReplyForm({ reviewId, onSuccess, onCancel }: ReplyFormProps) {
  const [content, setContent] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!content.trim()) return

    setIsSubmitting(true)
    const result = await createReviewReply(reviewId, content)

    if (result.success) {
      onSuccess()
    } else {
      alert(result.error)
    }
    setIsSubmitting(false)
  }

  return (
    <form onSubmit={handleSubmit} className="bg-[#f8f9fa] rounded-lg p-4">
      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="답변을 작성해주세요."
        className="w-full p-3 border border-gray-300 rounded-md resize-none h-24 mb-3"
      />
      <div className="flex gap-2">
        <button
          type="submit"
          disabled={isSubmitting || !content.trim()}
          className="px-4 py-2 bg-primary text-white text-sm rounded-md disabled:opacity-50"
        >
          {isSubmitting ? '저장 중...' : '답변 등록'}
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 border border-gray-300 text-sm rounded-md"
        >
          취소
        </button>
      </div>
    </form>
  )
}
