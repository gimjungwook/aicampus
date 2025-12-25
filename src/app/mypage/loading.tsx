import { Header } from '@/components/layout/Header'
import { Skeleton } from '@/components/ui/Skeleton'

export default function MyPageLoading() {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Header />

      <main className="flex-1">
        <div className="mx-auto max-w-5xl px-4 py-8">
          {/* 페이지 헤더 스켈레톤 */}
          <div className="mb-8">
            <Skeleton className="h-9 w-40" />
            <Skeleton className="mt-3 h-5 w-64" />
          </div>

          {/* 탭 스켈레톤 */}
          <div className="mb-8 flex gap-4 border-b border-border pb-3">
            <Skeleton className="h-8 w-32" />
            <Skeleton className="h-8 w-20" />
            <Skeleton className="h-8 w-16" />
          </div>

          {/* 콘텐츠 스켈레톤 - 코스 카드 */}
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="overflow-hidden rounded-sm border border-border bg-card">
                <Skeleton className="aspect-video w-full" />
                <div className="p-4">
                  <div className="mb-2 flex gap-2">
                    <Skeleton className="h-5 w-16 rounded-full" />
                    <Skeleton className="h-5 w-12" />
                  </div>
                  <Skeleton className="mb-3 h-6 w-full" />
                  <Skeleton className="mb-1 h-4 w-24" />
                  <Skeleton className="mb-4 h-2 w-full rounded-full" />
                  <Skeleton className="h-10 w-full rounded-sm" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  )
}
