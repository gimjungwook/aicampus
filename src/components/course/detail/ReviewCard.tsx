'use client'

import { useState } from 'react'
import Image from 'next/image'
import { format } from 'date-fns'
import { ko } from 'date-fns/locale'
import { StarRating } from './StarRating'
import { ReviewReplyComponent, ReplyForm } from './ReviewReply'
import { deleteReview } from '@/lib/actions/review'
import type { CourseReview } from '@/lib/types/course'

interface ReviewCardProps {
  review: CourseReview
  isOwner?: boolean
  isAdmin?: boolean
  onEdit?: () => void
  onDelete?: () => void
  onUpdate?: () => void
}

export function ReviewCard({
  review,
  isOwner = false,
  isAdmin = false,
  onEdit,
  onDelete,
  onUpdate
}: ReviewCardProps) {
  const [isDeleting, setIsDeleting] = useState(false)
  const [showReplyForm, setShowReplyForm] = useState(false)

  const handleDelete = async () => {
    if (!confirm('리뷰를 삭제하시겠습니까?')) return

    setIsDeleting(true)
    const result = await deleteReview(review.id)

    if (result.success) {
      onDelete?.()
    } else {
      alert(result.error)
    }
    setIsDeleting(false)
  }

  return (
    <div className="border-b border-border py-6 last:border-b-0">
      {/* 헤더: 프로필, 별점, 날짜 */}
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          {/* 아바타 */}
          <div className="relative w-9 h-9 rounded-full overflow-hidden bg-muted">
            {review.user?.avatar_url ? (
              <Image
                src={review.user.avatar_url}
                alt={review.user.nickname}
                fill
                sizes="36px"
                className="object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-sm font-medium text-muted-foreground">
                {review.user?.nickname?.[0] || '?'}
              </div>
            )}
          </div>

          {/* 닉네임, 별점 */}
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[14px] font-bold text-[#495059]">
                {review.user?.nickname || '익명'}
              </span>
              <span className="text-[14px] text-[#858e97]">
                수강평
              </span>
            </div>
            <StarRating rating={review.rating} readonly size="sm" />
          </div>
        </div>

        {/* 날짜 + 진도 뱃지 */}
        <div className="flex items-center gap-2">
          <span className="text-[11px] bg-[#f8f9fa] text-[#858e97] rounded-full px-3 py-1">
            {review.progress_percent}% 수강
          </span>
          <span className="text-[14px] text-[#858e97]">
            {format(new Date(review.created_at), 'yyyy.MM.dd', { locale: ko })}
          </span>
        </div>
      </div>

      {/* 리뷰 내용 */}
      <p className="mt-4 text-[16px] text-[#202529] leading-[27px]">
        {review.content}
      </p>

      {/* 수정/삭제 버튼 (본인만) */}
      {isOwner && (
        <div className="mt-3 flex gap-2">
          <button
            onClick={onEdit}
            className="text-sm text-muted-foreground hover:text-foreground"
          >
            수정
          </button>
          <button
            onClick={handleDelete}
            disabled={isDeleting}
            className="text-sm text-red-500 hover:text-red-600 disabled:opacity-50"
          >
            {isDeleting ? '삭제 중...' : '삭제'}
          </button>
        </div>
      )}

      {/* 강사 답변 */}
      {review.reply && (
        <ReviewReplyComponent
          reply={review.reply}
          canEdit={isAdmin}
          onUpdate={onUpdate}
        />
      )}

      {/* 답변 작성 버튼 (관리자용) */}
      {isAdmin && !review.reply && !showReplyForm && (
        <button
          onClick={() => setShowReplyForm(true)}
          className="mt-3 text-sm text-primary hover:underline"
        >
          + 답변 작성
        </button>
      )}

      {/* 답변 작성 폼 */}
      {showReplyForm && (
        <div className="mt-4 ml-6">
          <ReplyForm
            reviewId={review.id}
            onSuccess={() => {
              setShowReplyForm(false)
              onUpdate?.()
            }}
            onCancel={() => setShowReplyForm(false)}
          />
        </div>
      )}
    </div>
  )
}
