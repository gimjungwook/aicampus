import { requireAdmin } from '@/lib/utils/admin'
import { AdminSidebar } from '@/components/admin'

export const metadata = {
  title: 'Admin | AI Campus',
  description: 'AI Campus 관리자 페이지',
}

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  // Admin 권한 체크 (권한 없으면 리다이렉트)
  await requireAdmin()

  return (
    <div className="flex h-screen">
      <AdminSidebar />
      <div className="flex flex-1 flex-col overflow-hidden">
        {children}
      </div>
    </div>
  )
}
