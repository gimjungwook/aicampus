'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/Button'
import { useWishlist } from './WishlistProvider'
import { useAuth } from '@/components/auth/AuthProvider'
import { Heart, Loader2 } from 'lucide-react'
import { cn } from '@/lib/utils/cn'

interface WishlistButtonProps {
  courseId: string
  variant?: 'full' | 'icon'
  className?: string
}

export function WishlistButton({ courseId, variant = 'full', className }: WishlistButtonProps) {
  const { user } = useAuth()
  const { isInWishlist, toggleWishlist, isLoading: contextLoading } = useWishlist()
  const [isPending, setIsPending] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const isWishlisted = isInWishlist(courseId)

  const handleClick = async () => {
    setError(null)

    if (!user) {
      setError('로그인이 필요합니다')
      return
    }

    setIsPending(true)
    try {
      const result = await toggleWishlist(courseId)
      if (!result.success && result.error) {
        setError(result.error)
      }
    } finally {
      setIsPending(false)
    }
  }

  // 아이콘 전용 버전 (작은 버튼)
  if (variant === 'icon') {
    return (
      <button
        onClick={handleClick}
        disabled={isPending || contextLoading}
        className={cn(
          'flex h-10 w-10 items-center justify-center rounded-sm border-2 transition-all hover:scale-105',
          isWishlisted
            ? 'border-destructive bg-destructive/10 text-destructive'
            : 'border-border bg-transparent hover:bg-muted',
          className
        )}
        aria-label={isWishlisted ? '찜 취소' : '찜하기'}
      >
        {isPending ? (
          <Loader2 className="h-5 w-5 animate-spin" />
        ) : (
          <Heart
            className={cn('h-5 w-5', isWishlisted && 'fill-current')}
          />
        )}
      </button>
    )
  }

  // 전체 버전 (텍스트 포함)
  return (
    <div>
      <Button
        variant="outline"
        size="xl"
        onClick={handleClick}
        disabled={isPending || contextLoading}
        className={cn(
          'transition-all',
          isWishlisted && 'border-destructive text-destructive hover:bg-destructive/10',
          className
        )}
      >
        {isPending ? (
          <Loader2 className="h-5 w-5 animate-spin" />
        ) : (
          <>
            <Heart
              className={cn('h-5 w-5', isWishlisted && 'fill-current')}
            />
            {isWishlisted ? '찜 취소' : '찜하기'}
          </>
        )}
      </Button>

      {error && (
        <p className="mt-2 text-center text-sm text-destructive">{error}</p>
      )}
    </div>
  )
}
