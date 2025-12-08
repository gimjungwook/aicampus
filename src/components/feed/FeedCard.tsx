'use client'

import Link from 'next/link'
import Image from 'next/image'
import { Heart, MessageCircle, MoreHorizontal } from 'lucide-react'
import type { NewsPostWithDetails } from '@/lib/types/news'

interface FeedCardProps {
  post: NewsPostWithDetails
}

export function FeedCard({ post }: FeedCardProps) {
  const timeAgo = getTimeAgo(post.published_at)

  return (
    <article className="relative">
      <Link href={`/feed/${post.id}`} className="block">
        <div className="flex gap-3 px-4 py-4 hover:bg-muted/30 transition-colors">
          {/* 아바타 + 연결선 */}
          <div className="flex flex-col items-center">
            <div className="relative h-10 w-10 flex-shrink-0 overflow-hidden rounded-full bg-gradient-to-br from-primary/20 to-primary/10 ring-1 ring-border/50">
              {post.author?.avatar_url ? (
                <Image
                  src={post.author.avatar_url}
                  alt={post.author.display_name || ''}
                  fill
                  className="object-cover"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center text-sm font-semibold text-primary">
                  {(post.author?.display_name || 'A').charAt(0).toUpperCase()}
                </div>
              )}
            </div>
            {/* 연결선 */}
            <div className="mt-2 w-0.5 flex-1 bg-border/50 min-h-[20px]" />
          </div>

          {/* 콘텐츠 */}
          <div className="flex-1 min-w-0 pb-2">
            {/* 헤더 */}
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2 min-w-0">
                <span className="font-semibold text-foreground truncate">
                  {post.author?.display_name || '익명'}
                </span>
                <span className="text-muted-foreground text-sm flex-shrink-0">
                  · {timeAgo}
                </span>
              </div>
              <button
                className="p-1 hover:bg-muted rounded-full transition-colors"
                onClick={(e) => e.preventDefault()}
              >
                <MoreHorizontal className="h-4 w-4 text-muted-foreground" />
              </button>
            </div>

            {/* 제목 */}
            <h3 className="mt-1 font-bold text-foreground leading-snug">
              {post.title}
            </h3>

            {/* 본문 미리보기 */}
            {post.excerpt && (
              <p className="mt-1.5 text-foreground/80 text-[15px] leading-relaxed line-clamp-3">
                {post.excerpt}
              </p>
            )}

            {/* 태그 */}
            {post.tags.length > 0 && (
              <div className="mt-3 flex flex-wrap gap-1.5">
                {post.tags.slice(0, 3).map(tag => (
                  <span
                    key={tag.id}
                    className="text-primary text-sm hover:underline"
                  >
                    #{tag.name}
                  </span>
                ))}
              </div>
            )}

            {/* 액션 버튼 */}
            <div className="mt-3 flex items-center gap-4">
              <button
                className="flex items-center gap-1.5 text-muted-foreground hover:text-red-500 transition-colors group"
                onClick={(e) => e.preventDefault()}
              >
                <Heart className={`h-[18px] w-[18px] ${post.is_liked ? 'fill-red-500 text-red-500' : 'group-hover:scale-110 transition-transform'}`} />
                <span className="text-sm">{post.likes_count || ''}</span>
              </button>
              <button
                className="flex items-center gap-1.5 text-muted-foreground hover:text-primary transition-colors"
                onClick={(e) => e.preventDefault()}
              >
                <MessageCircle className="h-[18px] w-[18px]" />
                <span className="text-sm">{post.comments_count || ''}</span>
              </button>
            </div>
          </div>
        </div>
      </Link>

      {/* 구분선 */}
      <div className="ml-[52px] mr-4 border-b border-border/50" />
    </article>
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
