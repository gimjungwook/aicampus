'use client'

import { useState, useTransition } from 'react'
import { Heart } from 'lucide-react'
import { toggleNewsLike } from '@/lib/actions/news'
import { cn } from '@/lib/utils'

interface NewsLikeButtonProps {
  postId: string
  initialLiked: boolean
  initialCount: number
  isLoggedIn: boolean
}

export function NewsLikeButton({
  postId,
  initialLiked,
  initialCount,
  isLoggedIn,
}: NewsLikeButtonProps) {
  const [liked, setLiked] = useState(initialLiked)
  const [count, setCount] = useState(initialCount)
  const [isPending, startTransition] = useTransition()

  const handleClick = () => {
    if (!isLoggedIn) {
      // 로그인 페이지로 이동
      window.location.href = `/login?next=/feed/${postId}`
      return
    }

    // Optimistic update
    setLiked(!liked)
    setCount(liked ? count - 1 : count + 1)

    startTransition(async () => {
      try {
        const result = await toggleNewsLike(postId)
        setLiked(result.liked)
        setCount(result.count)
      } catch {
        // 에러 시 롤백
        setLiked(liked)
        setCount(count)
      }
    })
  }

  return (
    <button
      onClick={handleClick}
      disabled={isPending}
      className={cn(
        'flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-medium transition-all',
        liked
          ? 'bg-red-500/10 text-red-500 hover:bg-red-500/20'
          : 'bg-muted text-muted-foreground hover:bg-muted/80 hover:text-foreground'
      )}
    >
      <Heart
        className={cn('h-5 w-5 transition-transform', liked && 'fill-current scale-110')}
      />
      <span>{count}</span>
    </button>
  )
}
