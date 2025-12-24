'use client'

import { useState, useCallback } from 'react'
import { AlertCircle, RefreshCw } from 'lucide-react'
import { Button } from '@/components/ui/Button'

interface YouTubePlayerProps {
  videoId: string
  title?: string
  onEnded?: () => void
}

export function YouTubePlayer({ videoId, title }: YouTubePlayerProps) {
  const [error, setError] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  const handleLoad = useCallback(() => {
    setIsLoading(false)
    setError(false)
  }, [])

  const handleError = useCallback(() => {
    setError(true)
    setIsLoading(false)
  }, [])

  const handleRetry = useCallback(() => {
    setError(false)
    setIsLoading(true)
  }, [])

  if (error) {
    return (
      <div className="flex aspect-video flex-col items-center justify-center gap-4 rounded-sm bg-muted">
        <AlertCircle className="h-12 w-12 text-muted-foreground" />
        <p className="text-muted-foreground">영상을 불러올 수 없습니다</p>
        <Button onClick={handleRetry} variant="outline" size="sm">
          <RefreshCw className="mr-2 h-4 w-4" />
          다시 시도
        </Button>
      </div>
    )
  }

  return (
    <div className="relative aspect-video overflow-hidden rounded-sm bg-black">
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-muted">
          <div className="h-12 w-12 animate-spin rounded-full border-4 border-primary border-t-transparent" />
        </div>
      )}
      <iframe
        src={`https://www.youtube.com/embed/${videoId}?rel=0&modestbranding=1`}
        title={title || 'YouTube video'}
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
        onLoad={handleLoad}
        onError={handleError}
        className="absolute inset-0 h-full w-full border-0"
      />
      {title && !isLoading && (
        <div className="pointer-events-none absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4">
          <h2 className="text-lg font-semibold text-white">{title}</h2>
        </div>
      )}
    </div>
  )
}
