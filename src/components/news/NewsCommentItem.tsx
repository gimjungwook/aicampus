'use client'

import { useState, useTransition } from 'react'
import { CornerDownRight, MoreHorizontal, Pencil, Trash2, MessageCircle } from 'lucide-react'
import { deleteNewsComment, updateNewsComment } from '@/lib/actions/news'
import { NewsCommentForm } from './NewsCommentForm'
import { Button } from '@/components/ui/Button'
import type { NewsCommentWithAuthor } from '@/lib/types/news'

interface NewsCommentItemProps {
  comment: NewsCommentWithAuthor
  postId: string
  currentUserId?: string
  isLoggedIn: boolean
  isReply?: boolean
}

export function NewsCommentItem({
  comment,
  postId,
  currentUserId,
  isLoggedIn,
  isReply = false,
}: NewsCommentItemProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [isReplying, setIsReplying] = useState(false)
  const [editContent, setEditContent] = useState(comment.content)
  const [showMenu, setShowMenu] = useState(false)
  const [isPending, startTransition] = useTransition()
  const [error, setError] = useState<string | null>(null)

  const isOwner = currentUserId === comment.user_id
  const hasReplies = comment.replies && comment.replies.length > 0

  const handleDelete = () => {
    if (!confirm('댓글을 삭제하시겠습니까?')) return

    setError(null)
    startTransition(async () => {
      try {
        await deleteNewsComment(comment.id)
      } catch (err) {
        setError((err as Error).message)
      }
    })
  }

  const handleUpdate = () => {
    if (!editContent.trim()) return

    setError(null)
    startTransition(async () => {
      try {
        await updateNewsComment(comment.id, editContent.trim())
        setIsEditing(false)
      } catch (err) {
        setError((err as Error).message)
      }
    })
  }

  const formattedDate = new Date(comment.created_at).toLocaleDateString('ko-KR', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })

  return (
    <div className={isReply ? 'ml-8 border-l-2 border-border pl-4' : ''}>
      <div className="rounded bg-card p-4">
        {/* 헤더 */}
        <div className="mb-2 flex items-start justify-between">
          <div className="flex items-center gap-2">
            {isReply && <CornerDownRight className="h-4 w-4 text-muted-foreground" />}
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-sm font-bold text-primary">
              {comment.author.display_name?.charAt(0).toUpperCase() || 'U'}
            </div>
            <div>
              <p className="text-sm font-medium">{comment.author.display_name || '익명'}</p>
              <p className="text-xs text-muted-foreground">{formattedDate}</p>
            </div>
          </div>

          {/* 메뉴 (본인만) */}
          {isOwner && !isEditing && (
            <div className="relative">
              <button
                onClick={() => setShowMenu(!showMenu)}
                className="rounded p-1 hover:bg-muted"
              >
                <MoreHorizontal className="h-4 w-4 text-muted-foreground" />
              </button>

              {showMenu && (
                <div className="absolute right-0 top-8 z-10 w-32 rounded border bg-card shadow-lg">
                  <button
                    onClick={() => {
                      setIsEditing(true)
                      setShowMenu(false)
                    }}
                    className="flex w-full items-center gap-2 px-3 py-2 text-sm hover:bg-muted"
                  >
                    <Pencil className="h-4 w-4" />
                    수정
                  </button>
                  <button
                    onClick={() => {
                      handleDelete()
                      setShowMenu(false)
                    }}
                    disabled={hasReplies}
                    className="flex w-full items-center gap-2 px-3 py-2 text-sm text-destructive hover:bg-destructive/10 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    <Trash2 className="h-4 w-4" />
                    {hasReplies ? '삭제 불가' : '삭제'}
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        {/* 콘텐츠 */}
        {isEditing ? (
          <div className="space-y-2">
            <textarea
              value={editContent}
              onChange={(e) => setEditContent(e.target.value)}
              className="w-full resize-none rounded border border-border bg-background px-3 py-2 text-sm focus:border-primary focus:outline-none"
              rows={3}
            />
            <div className="flex justify-end gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setIsEditing(false)
                  setEditContent(comment.content)
                }}
              >
                취소
              </Button>
              <Button
                size="sm"
                onClick={handleUpdate}
                disabled={isPending || !editContent.trim()}
                isLoading={isPending}
              >
                저장
              </Button>
            </div>
          </div>
        ) : (
          <p className="whitespace-pre-wrap text-sm text-foreground">{comment.content}</p>
        )}

        {/* 에러 */}
        {error && <p className="mt-2 text-xs text-destructive">{error}</p>}

        {/* 답글 버튼 (루트 댓글만) */}
        {!isReply && !isEditing && (
          <button
            onClick={() => setIsReplying(!isReplying)}
            className="mt-2 flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground"
          >
            <MessageCircle className="h-3.5 w-3.5" />
            답글
          </button>
        )}
      </div>

      {/* 답글 작성 폼 */}
      {isReplying && (
        <div className="ml-8 mt-2 border-l-2 border-border pl-4">
          <NewsCommentForm
            postId={postId}
            parentId={comment.id}
            isLoggedIn={isLoggedIn}
            placeholder="답글을 작성해주세요..."
            onSuccess={() => setIsReplying(false)}
            onCancel={() => setIsReplying(false)}
          />
        </div>
      )}

      {/* 대댓글 목록 */}
      {comment.replies && comment.replies.length > 0 && (
        <div className="mt-2 space-y-2">
          {comment.replies.map((reply) => (
            <NewsCommentItem
              key={reply.id}
              comment={reply}
              postId={postId}
              currentUserId={currentUserId}
              isLoggedIn={isLoggedIn}
              isReply
            />
          ))}
        </div>
      )}
    </div>
  )
}
