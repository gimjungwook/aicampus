import { notFound } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { ArrowLeft, Calendar, Clock } from 'lucide-react'
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

  if (diffInSeconds < 60) return '방금 전'
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}분 전`
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}시간 전`
  if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)}일 전`

  return date.toLocaleDateString('ko-KR', { month: 'long', day: 'numeric' })
}

function getReadingTime(content: string): number {
  const wordsPerMinute = 200
  const words = content.trim().split(/\s+/).length
  return Math.max(1, Math.ceil(words / wordsPerMinute))
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
  const readingTime = getReadingTime(post.content)

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Header />

      <main className="flex-1">
        <div className="max-w-2xl mx-auto">
          {/* 상단 네비게이션 */}
          <div className="sticky top-16 z-20 border-b border-border bg-background/95 backdrop-blur-sm supports-[backdrop-filter]:bg-background/80">
            <div className="flex items-center h-14 px-4">
              <Link
                href="/feed"
                className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors group"
              >
                <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-0.5" />
                <span>피드로 돌아가기</span>
              </Link>
            </div>
          </div>

          {/* 메인 포스트 */}
          <article className="px-4 py-8">
            {/* 작성자 정보 */}
            <div className="flex items-center gap-3 mb-6">
              <div className="relative h-11 w-11 flex-shrink-0 overflow-hidden rounded-full bg-gradient-to-br from-primary/20 to-primary/5 ring-1 ring-border/30">
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
              <div>
                <p className="font-semibold text-foreground">
                  {post.author?.display_name || '익명'}
                </p>
                <div className="flex items-center gap-3 text-sm text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <Calendar className="h-3.5 w-3.5" />
                    {timeAgo}
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="h-3.5 w-3.5" />
                    {readingTime}분 읽기
                  </span>
                </div>
              </div>
            </div>

            {/* 제목 */}
            <h1 className="text-2xl sm:text-3xl font-bold text-foreground leading-tight mb-6">
              {post.title}
            </h1>

            {/* 태그 */}
            {post.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-8">
                {post.tags.map((tag) => (
                  <Link
                    key={tag.id}
                    href={`/feed?tag=${tag.slug}`}
                    className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-primary/10 text-primary hover:bg-primary/20 transition-colors"
                  >
                    {tag.name}
                  </Link>
                ))}
              </div>
            )}

            {/* 본문 (마크다운) */}
            <div className="prose prose-neutral dark:prose-invert max-w-none prose-headings:font-bold prose-a:text-primary prose-a:no-underline hover:prose-a:underline prose-img:rounded-lg prose-pre:bg-muted prose-code:text-primary prose-code:bg-muted prose-code:px-1 prose-code:py-0.5 prose-code:rounded prose-code:before:content-none prose-code:after:content-none">
              <MarkdownRenderer content={post.content} />
            </div>

            {/* 좋아요 섹션 */}
            <div className="mt-10 pt-6 border-t border-border">
              <NewsLikeButton
                postId={post.id}
                initialLiked={post.is_liked || false}
                initialCount={post.likes_count}
                isLoggedIn={!!user}
              />
            </div>
          </article>

          {/* 구분선 */}
          <div className="mx-4 border-t border-border" />

          {/* 댓글 섹션 */}
          <div className="px-4 py-8">
            <h2 className="text-lg font-bold text-foreground mb-6">
              댓글 {comments.length > 0 && <span className="text-primary">({comments.length})</span>}
            </h2>
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
