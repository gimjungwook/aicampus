'use client'

import { NewsCommentForm } from './NewsCommentForm'
import { NewsCommentItem } from './NewsCommentItem'
import { MessageCircle } from 'lucide-react'
import type { NewsCommentWithAuthor } from '@/lib/types/news'

interface NewsCommentSectionProps {
  postId: string
  comments: NewsCommentWithAuthor[]
  currentUserId?: string
  isLoggedIn: boolean
}

export function NewsCommentSection({
  postId,
  comments,
  currentUserId,
  isLoggedIn,
}: NewsCommentSectionProps) {
  const totalCount = comments.reduce(
    (acc, comment) => acc + 1 + (comment.replies?.length || 0),
    0
  )

  return (
    <section className="space-y-6">
      {/* 헤더 */}
      <div className="flex items-center gap-2">
        <MessageCircle className="h-5 w-5" />
        <h2 className="text-lg font-bold">댓글 {totalCount > 0 && `(${totalCount})`}</h2>
      </div>

      {/* 댓글 작성 폼 */}
      <NewsCommentForm postId={postId} isLoggedIn={isLoggedIn} />

      {/* 댓글 목록 */}
      {comments.length > 0 ? (
        <div className="space-y-4">
          {comments.map((comment) => (
            <NewsCommentItem
              key={comment.id}
              comment={comment}
              postId={postId}
              currentUserId={currentUserId}
              isLoggedIn={isLoggedIn}
            />
          ))}
        </div>
      ) : (
        <div className="rounded bg-muted/50 py-8 text-center">
          <p className="text-muted-foreground">아직 댓글이 없습니다.</p>
          <p className="mt-1 text-sm text-muted-foreground">첫 번째 댓글을 작성해보세요!</p>
        </div>
      )}
    </section>
  )
}
