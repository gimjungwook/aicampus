import { notFound } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { ChevronLeft } from 'lucide-react'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { NewsLikeButton } from '@/components/news/NewsLikeButton'
import { NewsCommentSection } from '@/components/news/NewsCommentSection'
import { MarkdownRenderer } from '@/components/news/MarkdownRenderer'
import { getNewsPostById, getNewsComments } from '@/lib/actions/news'
import { createClient } from '@/lib/supabase/server'

interface FeedDetailPageProps {
  params: Promise<{ id: string }>
}

export async function generateMetadata({ params }: FeedDetailPageProps) {
  const { id } = await params
  const post = await getNewsPostById(id)

  if (!post) {
    return { title: '피드를 찾을 수 없습니다 | AI Campus' }
  }

  return {
    title: `${post.title} | AI Campus`,
    description: post.excerpt || post.content.slice(0, 150),
  }
}

function getTimeAgo(dateString: string | null): string {
  if (!dateString) return ''

  const now = new Date()
  const date = new Date(dateString)
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000)

  if (diffInSeconds < 60) return '방금'
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}분 전`
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}시간 전`
  if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)}일 전`

  return date.toLocaleDateString('ko-KR', { month: 'long', day: 'numeric' })
}

export default async function FeedDetailPage({ params }: FeedDetailPageProps) {
  const { id } = await params

  const [post, comments] = await Promise.all([
    getNewsPostById(id),
    getNewsComments(id),
  ])

  if (!post) {
    notFound()
  }

  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const timeAgo = getTimeAgo(post.published_at)

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Header />

      <main className="flex-1">
        <div className="max-w-xl mx-auto">
          {/* 상단 바 */}
          <div className="sticky top-16 z-20 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="flex items-center h-14 px-4">
              <Link
                href="/feed"
                className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                <ChevronLeft className="h-5 w-5" />
                <span>피드</span>
              </Link>
            </div>
          </div>

          {/* 메인 포스트 */}
          <article className="px-4 py-4">
            <div className="flex gap-3">
              {/* 아바타 */}
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
                {/* 연결선 (댓글이 있을 때만) */}
                {comments.length > 0 && (
                  <div className="mt-2 w-0.5 flex-1 bg-border/50 min-h-[20px]" />
                )}
              </div>

              {/* 콘텐츠 */}
              <div className="flex-1 min-w-0 pb-4">
                {/* 헤더 */}
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-foreground">
                    {post.author?.display_name || '익명'}
                  </span>
                  <span className="text-muted-foreground text-sm">
                    · {timeAgo}
                  </span>
                </div>

                {/* 제목 */}
                <h1 className="mt-2 text-xl font-bold text-foreground leading-tight">
                  {post.title}
                </h1>

                {/* 본문 (마크다운) */}
                <div className="mt-4 prose prose-sm dark:prose-invert max-w-none">
                  <MarkdownRenderer content={post.content} />
                </div>

                {/* 태그 */}
                {post.tags.length > 0 && (
                  <div className="mt-4 flex flex-wrap gap-2">
                    {post.tags.map((tag) => (
                      <Link
                        key={tag.id}
                        href={`/feed?tag=${tag.slug}`}
                        className="text-primary text-sm hover:underline"
                      >
                        #{tag.name}
                      </Link>
                    ))}
                  </div>
                )}

                {/* 좋아요 버튼 */}
                <div className="mt-6 pt-4 border-t border-border/50">
                  <NewsLikeButton
                    postId={post.id}
                    initialLiked={post.is_liked || false}
                    initialCount={post.likes_count}
                    isLoggedIn={!!user}
                  />
                </div>
              </div>
            </div>
          </article>

          {/* 구분선 */}
          <div className="border-t border-border" />

          {/* 댓글 섹션 */}
          <div className="px-4 py-6">
            <NewsCommentSection
              postId={post.id}
              comments={comments}
              currentUserId={user?.id}
              isLoggedIn={!!user}
            />
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
