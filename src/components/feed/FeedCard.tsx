'use client'

import Link from 'next/link'
import Image from 'next/image'
import { Heart, MessageCircle, Bookmark } from 'lucide-react'
import type { NewsPostWithDetails } from '@/lib/types/news'

interface FeedCardProps {
  post: NewsPostWithDetails
}

// 마크다운 본문에서 첫 번째 이미지 URL 추출
function extractFirstImage(content: string): string | null {
  // 마크다운 이미지 패턴: ![alt](url)
  const mdMatch = content.match(/!\[.*?\]\((.*?)\)/)
  if (mdMatch) return mdMatch[1]

  // HTML img 태그 패턴
  const htmlMatch = content.match(/<img[^>]+src=["']([^"']+)["']/)
  if (htmlMatch) return htmlMatch[1]

  return null
}

export function FeedCard({ post }: FeedCardProps) {
  const timeAgo = getTimeAgo(post.published_at)
  // thumbnail_url이 없으면 본문에서 이미지 추출
  const thumbnailUrl = post.thumbnail_url || extractFirstImage(post.content)

  return (
    <article className="group relative">
      <Link href={`/feed/${post.id}`} className="block">
        <div className="flex gap-3 px-4 py-4 transition-colors hover:bg-muted/40">
          {/* 아바타 */}
          <div className="flex-shrink-0">
            <div className="relative h-10 w-10 overflow-hidden rounded-full bg-gradient-to-br from-primary/20 to-primary/5 ring-1 ring-border/30">
              {post.author?.avatar_url ? (
                <Image
                  src={post.author.avatar_url}
                  alt={post.author.display_name || ''}
                  fill
                  sizes="40px"
                  className="object-cover"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center text-sm font-semibold text-primary">
                  {(post.author?.display_name || 'A').charAt(0).toUpperCase()}
                </div>
              )}
            </div>
          </div>

          {/* 콘텐츠 */}
          <div className="flex flex-1 min-w-0 gap-3">
            {/* 텍스트 영역 */}
            <div className="flex-1 min-w-0">
              {/* 헤더 */}
              <div className="flex items-center gap-2">
                <span className="font-semibold text-foreground truncate text-[15px]">
                  {post.author?.display_name || '익명'}
                </span>
                <span className="text-muted-foreground text-sm flex-shrink-0">
                  · {timeAgo}
                </span>
              </div>

              {/* 제목 */}
              <h3 className="mt-1 font-bold text-foreground leading-snug line-clamp-2 group-hover:text-primary transition-colors">
                {post.title}
              </h3>

              {/* 본문 미리보기 */}
              {post.excerpt && (
                <p className="mt-1.5 text-foreground/70 text-[15px] leading-relaxed line-clamp-2">
                  {post.excerpt}
                </p>
              )}

              {/* 태그 */}
              {post.tags.length > 0 && (
                <div className="mt-2.5 flex flex-wrap gap-1.5">
                  {post.tags.slice(0, 3).map(tag => (
                    <span
                      key={tag.id}
                      className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-primary/10 text-primary"
                    >
                      {tag.name}
                    </span>
                  ))}
                </div>
              )}

              {/* 액션 버튼 */}
              <div className="mt-3 flex items-center gap-5">
                <button
                  className="flex items-center gap-1.5 text-muted-foreground hover:text-red-500 transition-colors"
                  onClick={(e) => e.preventDefault()}
                >
                  <Heart
                    className={`h-4 w-4 transition-transform hover:scale-110 ${
                      post.is_liked ? 'fill-red-500 text-red-500' : ''
                    }`}
                  />
                  {post.likes_count > 0 && (
                    <span className="text-xs font-medium">{post.likes_count}</span>
                  )}
                </button>
                <button
                  className="flex items-center gap-1.5 text-muted-foreground hover:text-primary transition-colors"
                  onClick={(e) => e.preventDefault()}
                >
                  <MessageCircle className="h-4 w-4" />
                  {post.comments_count > 0 && (
                    <span className="text-xs font-medium">{post.comments_count}</span>
                  )}
                </button>
                <button
                  className="flex items-center text-muted-foreground hover:text-primary transition-colors ml-auto"
                  onClick={(e) => e.preventDefault()}
                >
                  <Bookmark className="h-4 w-4" />
                </button>
              </div>
            </div>

            {/* 썸네일 이미지 */}
            {thumbnailUrl && (
              <div className="flex-shrink-0">
                <div className="relative w-[100px] h-[100px] rounded-lg overflow-hidden bg-muted">
                  <Image
                    src={thumbnailUrl}
                    alt=""
                    fill
                    className="object-cover transition-transform group-hover:scale-105"
                    sizes="100px"
                  />
                </div>
              </div>
            )}
          </div>
        </div>
      </Link>

      {/* 구분선 */}
      <div className="mx-4 border-b border-border/50" />
    </article>
  )
}

// 피드 카드 스켈레톤
export function FeedCardSkeleton() {
  return (
    <div className="px-4 py-4">
      <div className="flex gap-3">
        {/* 아바타 스켈레톤 */}
        <div className="h-10 w-10 rounded-full bg-muted animate-pulse flex-shrink-0" />

        {/* 콘텐츠 스켈레톤 */}
        <div className="flex flex-1 gap-3">
          <div className="flex-1 space-y-2">
            {/* 헤더 */}
            <div className="flex items-center gap-2">
              <div className="h-4 w-20 bg-muted rounded animate-pulse" />
              <div className="h-3 w-12 bg-muted rounded animate-pulse" />
            </div>
            {/* 제목 */}
            <div className="h-5 w-3/4 bg-muted rounded animate-pulse" />
            {/* 본문 */}
            <div className="space-y-1.5 pt-1">
              <div className="h-4 w-full bg-muted rounded animate-pulse" />
              <div className="h-4 w-2/3 bg-muted rounded animate-pulse" />
            </div>
            {/* 태그 */}
            <div className="flex gap-1.5 pt-1">
              <div className="h-5 w-14 bg-muted rounded-full animate-pulse" />
              <div className="h-5 w-16 bg-muted rounded-full animate-pulse" />
            </div>
            {/* 액션 */}
            <div className="flex gap-5 pt-2">
              <div className="h-4 w-10 bg-muted rounded animate-pulse" />
              <div className="h-4 w-10 bg-muted rounded animate-pulse" />
            </div>
          </div>

          {/* 썸네일 스켈레톤 */}
          <div className="w-[100px] h-[100px] rounded-lg bg-muted animate-pulse flex-shrink-0" />
        </div>
      </div>

      {/* 구분선 */}
      <div className="mt-4 border-b border-border/50" />
    </div>
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
