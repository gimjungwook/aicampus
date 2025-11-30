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
            <Skeleton className="h-9 w-48" />
            <Skeleton className="mt-2 h-5 w-72" />
          </div>

          {/* 탭 스켈레톤 */}
          <div className="mb-8 flex gap-4 border-b border-border pb-px">
            <Skeleton className="h-10 w-32" />
            <Skeleton className="h-10 w-24" />
            <Skeleton className="h-10 w-20" />
          </div>

          {/* 콘텐츠 스켈레톤 */}
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="rounded-2xl border border-border bg-card p-4">
                <Skeleton className="mb-4 aspect-video w-full rounded-xl" />
                <Skeleton className="mb-2 h-4 w-20" />
                <Skeleton className="mb-4 h-6 w-full" />
                <Skeleton className="h-2 w-full rounded-full" />
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  )
}
