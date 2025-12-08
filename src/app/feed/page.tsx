import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { FeedList } from '@/components/feed'
import { getNewsPosts, getNewsTags } from '@/lib/actions/news'
import { getUserRole } from '@/lib/utils/admin'
import { PenSquare } from 'lucide-react'
import Link from 'next/link'

interface FeedPageProps {
  searchParams: Promise<{ tag?: string }>
}

export const metadata = {
  title: '피드 | AI Campus',
  description: '최신 AI 트렌드와 소식을 확인하세요',
}

export default async function FeedPage({ searchParams }: FeedPageProps) {
  const params = await searchParams
  const selectedTag = params.tag

  const [feedData, tags, userRole] = await Promise.all([
    getNewsPosts({ tag: selectedTag, limit: 10 }),
    getNewsTags(),
    getUserRole(),
  ])

  const isAdmin = userRole === 'admin' || userRole === 'super_admin'

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Header />

      <main className="flex-1">
        {/* 상단 타이틀 바 */}
        <div className="sticky top-16 z-20 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          <div className="max-w-xl mx-auto px-4">
            <div className="flex items-center justify-between h-14">
              <h1 className="text-xl font-bold">피드</h1>
              {isAdmin && (
                <Link
                  href="/feed/write"
                  className="flex items-center gap-1.5 text-sm font-medium text-primary hover:text-primary/80 transition-colors"
                >
                  <PenSquare className="h-4 w-4" />
                  글쓰기
                </Link>
              )}
            </div>
          </div>
        </div>

        {/* 피드 리스트 */}
        <FeedList
          initialPosts={feedData.posts}
          initialHasMore={feedData.hasMore}
          tags={tags}
          selectedTag={selectedTag}
        />
      </main>

      <Footer />
    </div>
  )
}
