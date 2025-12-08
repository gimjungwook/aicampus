'use client'

import { useEffect, useState, useTransition } from 'react'
import { FeedCard } from './FeedCard'
import { getNewsPosts } from '@/lib/actions/news'
import type { NewsPostWithDetails, NewsTag } from '@/lib/types/news'
import { Loader2 } from 'lucide-react'

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

  useEffect(() => {
    setPosts(initialPosts)
    setHasMore(initialHasMore)
    setActiveTag(selectedTag || '')
  }, [initialPosts, initialHasMore, selectedTag])

  const loadMore = () => {
    startTransition(async () => {
      const result = await getNewsPosts({
        tag: activeTag || undefined,
        offset: posts.length,
        limit: 10,
      })
      setPosts(prev => [...prev, ...result.posts])
      setHasMore(result.hasMore)
    })
  }

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
      <div className="sticky top-0 z-10 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b border-border">
        <div className="flex gap-1 px-4 py-3 overflow-x-auto scrollbar-hide">
          <button
            onClick={() => handleTagChange('')}
            className={`px-4 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
              !activeTag
                ? 'bg-foreground text-background'
                : 'bg-muted hover:bg-muted/80 text-foreground'
            }`}
          >
            전체
          </button>
          {tags.map(tag => (
            <button
              key={tag.id}
              onClick={() => handleTagChange(tag.slug)}
              className={`px-4 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
                activeTag === tag.slug
                  ? 'bg-foreground text-background'
                  : 'bg-muted hover:bg-muted/80 text-foreground'
              }`}
            >
              {tag.name}
            </button>
          ))}
        </div>
      </div>

      {/* 피드 목록 */}
      <div className="divide-y-0">
        {posts.length === 0 ? (
          <div className="py-20 text-center text-muted-foreground">
            <p>아직 피드가 없습니다.</p>
          </div>
        ) : (
          posts.map(post => <FeedCard key={post.id} post={post} />)
        )}
      </div>

      {/* 더보기 버튼 */}
      {hasMore && (
        <div className="py-8 text-center">
          <button
            onClick={loadMore}
            disabled={isPending}
            className="px-6 py-2 rounded-full bg-muted hover:bg-muted/80 text-foreground text-sm font-medium transition-colors disabled:opacity-50"
          >
            {isPending ? (
              <Loader2 className="h-4 w-4 animate-spin mx-auto" />
            ) : (
              '더 보기'
            )}
          </button>
        </div>
      )}
    </div>
  )
}
