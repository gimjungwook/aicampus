import { Header } from '@/components/layout/Header'

export default function SandboxLoading() {
  return (
    <div className="flex h-screen flex-col">
      <Header />

      <main className="flex flex-1 overflow-hidden">
        {/* 사이드바 스켈레톤 */}
        <aside className="hidden w-72 border-r border-border bg-card lg:block">
          <div className="p-3">
            <div className="h-10 w-full animate-pulse rounded-lg bg-muted" />
          </div>
          <div className="space-y-2 p-2">
            {[...Array(5)].map((_, i) => (
              <div
                key={i}
                className="h-16 animate-pulse rounded-lg bg-muted"
              />
            ))}
          </div>
        </aside>

        {/* 메인 영역 스켈레톤 */}
        <div className="flex flex-1 flex-col items-center justify-center p-6">
          <div className="h-12 w-12 animate-spin rounded-full border-4 border-primary border-t-transparent" />
        </div>
      </main>
    </div>
  )
}
