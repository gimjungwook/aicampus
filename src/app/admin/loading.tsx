import { AdminHeader } from '@/components/admin'

export default function AdminLoading() {
  return (
    <>
      <AdminHeader title="로딩 중..." />

      <main className="flex-1 overflow-y-auto p-6">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="h-24 animate-pulse rounded-xl bg-muted"
            />
          ))}
        </div>
      </main>
    </>
  )
}
