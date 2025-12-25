import { Header } from '@/components/layout/Header'

export default function SandboxLoading() {
  return (
    <div className="flex h-screen flex-col bg-background">
      <Header />

      <main className="flex flex-1 overflow-hidden">
        {/* 사이드바 스켈레톤 */}
        <aside className="hidden w-72 shrink-0 border-r border-border bg-card lg:block">
          {/* 새 대화 버튼 */}
          <div className="p-3">
            <div className="h-10 w-full animate-pulse rounded bg-muted" />
          </div>
          {/* 대화 목록 스켈레톤 */}
          <div className="space-y-2 p-2">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="p-3 rounded">
                <div className="h-4 w-3/4 animate-pulse rounded bg-muted mb-2" />
                <div className="h-3 w-1/2 animate-pulse rounded bg-muted" />
              </div>
            ))}
          </div>
        </aside>

        {/* 메인 영역 스켈레톤 */}
        <div className="flex flex-1 flex-col min-w-0">
          {/* 모바일 메뉴 버튼 스켈레톤 */}
          <div className="absolute left-4 top-20 z-10 lg:hidden">
            <div className="h-9 w-9 animate-pulse rounded bg-muted" />
          </div>

          {/* WelcomeScreen 스타일 스켈레톤 */}
          <div className="flex flex-1 flex-col items-center justify-center px-4">
            {/* 로고 및 인사말 */}
            <div className="mb-8 flex flex-col items-center">
              <div className="mb-6 h-16 w-16 animate-pulse rounded bg-muted" />
              <div className="h-8 w-32 animate-pulse rounded bg-muted mb-2" />
              <div className="h-5 w-56 animate-pulse rounded bg-muted" />
            </div>

            {/* 추천 프롬프트 스켈레톤 */}
            <div className="w-full max-w-xl space-y-3">
              <div className="h-4 w-40 mx-auto animate-pulse rounded bg-muted mb-4" />
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="flex items-center gap-4 rounded border border-border bg-card p-4"
                >
                  <div className="h-10 w-10 shrink-0 animate-pulse rounded bg-muted" />
                  <div className="flex-1">
                    <div className="h-4 w-20 animate-pulse rounded bg-muted mb-1.5" />
                    <div className="h-4 w-48 animate-pulse rounded bg-muted" />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 하단 입력창 스켈레톤 */}
          <div className="bg-gradient-to-t from-background via-background to-transparent">
            <div className="mx-auto max-w-3xl px-4 pb-4 pt-2">
              <div className="rounded border border-border/50 bg-card p-3">
                {/* 텍스트 입력 */}
                <div className="h-6 w-full animate-pulse rounded bg-muted mb-2" />
                {/* 하단 툴바 */}
                <div className="mt-2 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="h-1.5 w-16 animate-pulse rounded-full bg-muted" />
                    <div className="h-4 w-10 animate-pulse rounded bg-muted" />
                  </div>
                  <div className="h-8 w-8 animate-pulse rounded bg-muted" />
                </div>
              </div>
              <div className="mt-2 flex justify-center">
                <div className="h-3 w-48 animate-pulse rounded bg-muted" />
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
