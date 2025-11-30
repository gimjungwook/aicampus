'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  LayoutDashboard,
  FolderTree,
  BookOpen,
  Tags,
  ChevronLeft,
} from 'lucide-react'
import { cn } from '@/lib/utils/cn'

const navItems = [
  {
    label: '대시보드',
    href: '/admin',
    icon: LayoutDashboard,
  },
  {
    label: '카테고리',
    href: '/admin/categories',
    icon: Tags,
  },
  {
    label: '코스',
    href: '/admin/courses',
    icon: BookOpen,
  },
]

export function AdminSidebar() {
  const pathname = usePathname()

  return (
    <aside className="flex h-full w-64 flex-col border-r border-border bg-card">
      {/* 헤더 */}
      <div className="flex h-14 items-center border-b border-border px-4">
        <Link href="/admin" className="flex items-center gap-2">
          <FolderTree className="h-6 w-6 text-primary" />
          <span className="font-bold text-lg">Admin</span>
        </Link>
      </div>

      {/* 네비게이션 */}
      <nav className="flex-1 space-y-1 p-4">
        {navItems.map((item) => {
          const isActive =
            item.href === '/admin'
              ? pathname === '/admin'
              : pathname.startsWith(item.href)

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors',
                isActive
                  ? 'bg-primary text-primary-foreground'
                  : 'text-muted-foreground hover:bg-muted hover:text-foreground'
              )}
            >
              <item.icon className="h-4 w-4" />
              {item.label}
            </Link>
          )
        })}
      </nav>

      {/* 푸터 */}
      <div className="border-t border-border p-4">
        <Link
          href="/"
          className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
        >
          <ChevronLeft className="h-4 w-4" />
          사이트로 돌아가기
        </Link>
      </div>
    </aside>
  )
}
