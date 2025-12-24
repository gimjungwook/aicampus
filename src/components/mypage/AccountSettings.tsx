'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { cn } from '@/lib/utils/cn'
import { Sun, Moon, Monitor, Trash2, LogOut } from 'lucide-react'
import { useTheme } from '@/lib/hooks/useTheme'
import { DeleteAccountModal } from './DeleteAccountModal'
import { createClient } from '@/lib/supabase/client'

export function AccountSettings() {
  const router = useRouter()
  const { theme, setTheme } = useTheme()
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)

  const handleLogout = async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push('/')
    router.refresh()
  }

  const themeOptions = [
    { value: 'light' as const, label: '라이트', icon: Sun },
    { value: 'dark' as const, label: '다크', icon: Moon },
    { value: 'system' as const, label: '시스템', icon: Monitor },
  ]

  return (
    <div className="space-y-6">
      {/* 테마 설정 */}
      <div className="rounded-sm border border-border bg-card p-6">
        <h3 className="mb-4 text-lg font-semibold text-foreground">테마 설정</h3>
        <div className="flex gap-3">
          {themeOptions.map(({ value, label, icon: Icon }) => (
            <button
              key={value}
              onClick={() => setTheme(value)}
              className={cn(
                'flex flex-1 flex-col items-center gap-2 rounded-sm border-2 py-4 transition-all',
                theme === value
                  ? 'border-primary bg-primary/5'
                  : 'border-border hover:border-primary/50'
              )}
            >
              <Icon className={cn(
                'h-6 w-6',
                theme === value ? 'text-primary' : 'text-muted-foreground'
              )} />
              <span className={cn(
                'text-sm font-medium',
                theme === value ? 'text-primary' : 'text-muted-foreground'
              )}>
                {label}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* 로그아웃 */}
      <div className="rounded-sm border border-border bg-card p-6">
        <h3 className="mb-4 text-lg font-semibold text-foreground">로그아웃</h3>
        <p className="mb-4 text-sm text-muted-foreground">
          현재 기기에서 로그아웃합니다.
        </p>
        <button
          onClick={handleLogout}
          className={cn(
            'flex w-full items-center justify-center gap-2 rounded-sm border border-border py-3',
            'text-sm font-medium text-foreground',
            'transition-colors hover:bg-muted'
          )}
        >
          <LogOut className="h-4 w-4" />
          로그아웃
        </button>
      </div>

      {/* 계정 삭제 */}
      <div className="rounded-sm border border-destructive/20 bg-card p-6">
        <h3 className="mb-4 text-lg font-semibold text-destructive">위험 영역</h3>
        <p className="mb-4 text-sm text-muted-foreground">
          계정을 삭제하면 모든 데이터가 영구적으로 삭제됩니다.
          이 작업은 되돌릴 수 없습니다.
        </p>
        <button
          onClick={() => setIsDeleteModalOpen(true)}
          className={cn(
            'flex w-full items-center justify-center gap-2 rounded-sm border border-destructive py-3',
            'text-sm font-medium text-destructive',
            'transition-colors hover:bg-destructive/10'
          )}
        >
          <Trash2 className="h-4 w-4" />
          계정 삭제
        </button>
      </div>

      {/* 삭제 확인 모달 */}
      <DeleteAccountModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
      />
    </div>
  )
}
