'use client'

import { useEffect, useState, useTransition, useRef, useCallback } from 'react'
import { FeedCard, FeedCardSkeleton } from './FeedCard'
import { getNewsPosts } from '@/lib/actions/news'
import type { NewsPostWithDetails, NewsTag } from '@/lib/types/news'
import { Loader2, FileText } from 'lucide-react'

interface FeedListProps {
  initialPosts: NewsPostWithDetails[]
  initialHasMore: boolean
  tags: NewsTag[]
  selectedTag?: string
}

export function FeedList({ initialPosts, initialHasMore, tags, selectedTag }: FeedListProps) {
  const [posts, setPosts] = useState(initialPosts)
  const [hasMore, setHasMore] = useState(initialHasMore)
  const [isPending, startTransition] = useTransition()
  const [activeTag, setActiveTag] = useState(selectedTag || '')
  const [isLoadingMore, setIsLoadingMore] = useState(false)

  // Intersection Observer를 위한 ref
  const observerRef = useRef<IntersectionObserver | null>(null)
  const loadMoreRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    setPosts(initialPosts)
    setHasMore(initialHasMore)
    setActiveTag(selectedTag || '')
  }, [initialPosts, initialHasMore, selectedTag])

  // 무한 스크롤을 위한 Intersection Observer
  const loadMore = useCallback(() => {
    if (isLoadingMore || !hasMore) return

    setIsLoadingMore(true)
    startTransition(async () => {
      const result = await getNewsPosts({
        tag: activeTag || undefined,
        offset: posts.length,
        limit: 10,
      })
      setPosts(prev => [...prev, ...result.posts])
      setHasMore(result.hasMore)
      setIsLoadingMore(false)
    })
  }, [activeTag, posts.length, hasMore, isLoadingMore])

  // Intersection Observer 설정
  useEffect(() => {
    if (observerRef.current) {
      observerRef.current.disconnect()
    }

    observerRef.current = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !isLoadingMore) {
          loadMore()
        }
      },
      { threshold: 0.1, rootMargin: '100px' }
    )

    if (loadMoreRef.current) {
      observerRef.current.observe(loadMoreRef.current)
    }

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect()
      }
    }
  }, [hasMore, isLoadingMore, loadMore])

  const handleTagChange = (tag: string) => {
    const url = tag ? `/feed?tag=${tag}` : '/feed'
    window.history.pushState({}, '', url)
    setActiveTag(tag)

    startTransition(async () => {
      const result = await getNewsPosts({
        tag: tag || undefined,
        limit: 10,
      })
      setPosts(result.posts)
      setHasMore(result.hasMore)
    })
  }

  return (
    <div className="max-w-xl mx-auto">
      {/* 태그 필터 */}
      <div className="sticky top-0 z-10 bg-background/95 backdrop-blur-sm supports-[backdrop-filter]:bg-background/80 border-b border-border">
        <div className="flex gap-2 px-4 py-3 overflow-x-auto scrollbar-hide">
          <button
            onClick={() => handleTagChange('')}
            className={`px-3.5 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-all ${
              !activeTag
                ? 'bg-foreground text-background shadow-sm'
                : 'bg-muted/80 hover:bg-muted text-foreground'
            }`}
          >
            전체
          </button>
          {tags.map(tag => (
            <button
              key={tag.id}
              onClick={() => handleTagChange(tag.slug)}
              className={`px-3.5 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-all ${
                activeTag === tag.slug
                  ? 'bg-foreground text-background shadow-sm'
                  : 'bg-muted/80 hover:bg-muted text-foreground'
              }`}
            >
              {tag.name}
            </button>
          ))}
        </div>
      </div>

      {/* 로딩 상태 (태그 변경 시) */}
      {isPending && posts.length === 0 ? (
        <div className="divide-y-0">
          {Array.from({ length: 5 }).map((_, i) => (
            <FeedCardSkeleton key={i} />
          ))}
        </div>
      ) : posts.length === 0 ? (
        /* 빈 상태 */
        <div className="py-20 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-muted/50 mb-4">
            <FileText className="w-8 h-8 text-muted-foreground" />
          </div>
          <p className="text-muted-foreground font-medium">아직 피드가 없습니다</p>
          <p className="text-muted-foreground/70 text-sm mt-1">첫 번째 글을 작성해보세요</p>
        </div>
      ) : (
        /* 피드 목록 */
        <>
          <div className="divide-y-0">
            {posts.map(post => (
              <FeedCard key={post.id} post={post} />
            ))}
          </div>

          {/* 무한 스크롤 트리거 & 로딩 인디케이터 */}
          <div ref={loadMoreRef} className="py-8">
            {isLoadingMore && (
              <div className="flex justify-center">
                <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
              </div>
            )}
            {!hasMore && posts.length > 0 && (
              <p className="text-center text-sm text-muted-foreground">
                모든 피드를 확인했습니다
              </p>
            )}
          </div>
        </>
      )}
    </div>
  )
}

// 피드 목록 스켈레톤 (초기 로딩용)
export function FeedListSkeleton() {
  return (
    <div className="max-w-xl mx-auto">
      {/* 태그 필터 스켈레톤 */}
      <div className="sticky top-0 z-10 bg-background/95 backdrop-blur-sm border-b border-border">
        <div className="flex gap-2 px-4 py-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <div
              key={i}
              className="h-8 w-16 rounded-full bg-muted animate-pulse"
            />
          ))}
        </div>
      </div>

      {/* 피드 카드 스켈레톤 */}
      <div className="divide-y-0">
        {Array.from({ length: 5 }).map((_, i) => (
          <FeedCardSkeleton key={i} />
        ))}
      </div>
    </div>
  )
}
