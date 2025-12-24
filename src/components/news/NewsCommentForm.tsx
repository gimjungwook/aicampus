'use client'

import { useState, useTransition } from 'react'
import { Button } from '@/components/ui/Button'
import { createNewsComment } from '@/lib/actions/news'
import { Send } from 'lucide-react'

interface NewsCommentFormProps {
  postId: string
  parentId?: string
  isLoggedIn: boolean
  onSuccess?: () => void
  onCancel?: () => void
  placeholder?: string
}

export function NewsCommentForm({
  postId,
  parentId,
  isLoggedIn,
  onSuccess,
  onCancel,
  placeholder = '댓글을 작성해주세요...',
}: NewsCommentFormProps) {
  const [content, setContent] = useState('')
  const [isPending, startTransition] = useTransition()
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!isLoggedIn) {
      window.location.href = `/login?next=/feed/${postId}`
      return
    }

    if (!content.trim()) return

    setError(null)

    startTransition(async () => {
      try {
        await createNewsComment(postId, content.trim(), parentId)
        setContent('')
        onSuccess?.()
      } catch (err) {
        setError((err as Error).message)
      }
    })
  }

  if (!isLoggedIn) {
    return (
      <div className="rounded bg-muted p-4 text-center">
        <p className="text-sm text-muted-foreground">
          댓글을 작성하려면{' '}
          <a href={`/login?next=/feed/${postId}`} className="font-medium text-primary hover:underline">
            로그인
          </a>
          이 필요합니다.
        </p>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder={placeholder}
        rows={3}
        className="w-full resize-none rounded border border-border bg-background px-4 py-3 text-sm placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
      />

      {error && (
        <p className="text-sm text-destructive">{error}</p>
      )}

      <div className="flex items-center justify-end gap-2">
        {onCancel && (
          <Button type="button" variant="ghost" size="sm" onClick={onCancel}>
            취소
          </Button>
        )}
        <Button
          type="submit"
          size="sm"
          disabled={isPending || !content.trim()}
          isLoading={isPending}
        >
          <Send className="mr-1.5 h-4 w-4" />
          {parentId ? '답글 작성' : '댓글 작성'}
        </Button>
      </div>
    </form>
  )
}
