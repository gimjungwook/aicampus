import { AdminHeader } from '@/components/admin'

export default function AdminLoading() {
  return (
    <>
      <AdminHeader title="로딩 중..." />

      <main className="flex-1 overflow-y-auto p-6">
        {/* 통계 카드 스켈레톤 */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="rounded border border-border bg-card p-6"
            >
              <div className="flex items-center gap-4">
                <div className="h-12 w-12 animate-pulse rounded bg-muted" />
                <div>
                  <div className="h-4 w-16 animate-pulse rounded bg-muted mb-2" />
                  <div className="h-7 w-12 animate-pulse rounded bg-muted" />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* 빠른 액션 섹션 스켈레톤 */}
        <div className="mt-8">
          <div className="mb-4 h-6 w-24 animate-pulse rounded bg-muted" />
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="flex items-center gap-3 rounded border border-border bg-card p-4"
              >
                <div className="h-9 w-9 animate-pulse rounded bg-muted" />
                <div className="flex-1">
                  <div className="h-5 w-28 animate-pulse rounded bg-muted mb-1" />
                  <div className="h-4 w-36 animate-pulse rounded bg-muted" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </>
  )
}
