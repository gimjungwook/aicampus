'use client'

import Link from 'next/link'
import Image from 'next/image'
import { Heart, MessageCircle } from 'lucide-react'
import type { NewsPostWithDetails } from '@/lib/types/news'

interface FeedPreviewProps {
  posts: NewsPostWithDetails[]
}

export function FeedPreview({ posts }: FeedPreviewProps) {
  if (posts.length === 0) return null

  return (
    <div className="space-y-0 divide-y divide-border/50 rounded border bg-card">
      {posts.slice(0, 5).map((post) => (
        <FeedPreviewItem key={post.id} post={post} />
      ))}
    </div>
  )
}

function FeedPreviewItem({ post }: { post: NewsPostWithDetails }) {
  const timeAgo = getTimeAgo(post.published_at)

  return (
    <Link href={`/feed/${post.id}`} className="block">
      <article className="flex gap-3 p-4 hover:bg-muted/30 transition-colors">
        {/* 아바타 */}
        <div className="relative h-9 w-9 flex-shrink-0 overflow-hidden rounded-full bg-gradient-to-br from-primary/20 to-primary/10 ring-1 ring-border/50">
          {post.author?.avatar_url ? (
            <Image
              src={post.author.avatar_url}
              alt={post.author.display_name || ''}
              fill
              className="object-cover"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-xs font-semibold text-primary">
              {(post.author?.display_name || 'A').charAt(0).toUpperCase()}
            </div>
          )}
        </div>

        {/* 콘텐츠 */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 text-sm">
            <span className="font-semibold text-foreground truncate">
              {post.author?.display_name || '익명'}
            </span>
            <span className="text-muted-foreground flex-shrink-0">
              · {timeAgo}
            </span>
          </div>

          <h3 className="mt-0.5 font-medium text-foreground line-clamp-1">
            {post.title}
          </h3>

          {post.excerpt && (
            <p className="mt-1 text-sm text-muted-foreground line-clamp-1">
              {post.excerpt}
            </p>
          )}

          {/* 태그 + 반응 */}
          <div className="mt-2 flex items-center gap-3 text-xs text-muted-foreground">
            {post.tags.length > 0 && (
              <span className="text-primary">#{post.tags[0].name}</span>
            )}
            <span className="flex items-center gap-1">
              <Heart className={`h-3.5 w-3.5 ${post.is_liked ? 'fill-red-500 text-red-500' : ''}`} />
              {post.likes_count || 0}
            </span>
            <span className="flex items-center gap-1">
              <MessageCircle className="h-3.5 w-3.5" />
              {post.comments_count || 0}
            </span>
          </div>
        </div>
      </article>
    </Link>
  )
}

function getTimeAgo(dateString: string | null): string {
  if (!dateString) return ''

  const now = new Date()
  const date = new Date(dateString)
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000)

  if (diffInSeconds < 60) return '방금'
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}분`
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}시간`
  if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)}일`

  return date.toLocaleDateString('ko-KR', { month: 'short', day: 'numeric' })
}
