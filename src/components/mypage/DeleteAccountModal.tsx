'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { cn } from '@/lib/utils/cn'
import { AlertTriangle, Loader2, X } from 'lucide-react'
import { deleteAccount } from '@/lib/actions/profile'

interface DeleteAccountModalProps {
  isOpen: boolean
  onClose: () => void
}

export function DeleteAccountModal({ isOpen, onClose }: DeleteAccountModalProps) {
  const router = useRouter()
  const [confirmText, setConfirmText] = useState('')
  const [isPending, startTransition] = useTransition()
  const [error, setError] = useState<string | null>(null)

  const handleDelete = () => {
    if (confirmText !== '계정 삭제') return

    setError(null)
    startTransition(async () => {
      const result = await deleteAccount()

      if (result.success) {
        router.push('/?deleted=true')
      } else {
        setError(result.error || '계정 삭제에 실패했습니다')
      }
    })
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* 백드롭 */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* 모달 */}
      <div className="relative mx-4 w-full max-w-md rounded-2xl bg-card p-6 shadow-xl">
        {/* 닫기 버튼 */}
        <button
          onClick={onClose}
          className="absolute right-4 top-4 rounded-lg p-1 text-muted-foreground hover:bg-muted hover:text-foreground"
        >
          <X className="h-5 w-5" />
        </button>

        {/* 아이콘 */}
        <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-destructive/10">
          <AlertTriangle className="h-7 w-7 text-destructive" />
        </div>

        {/* 제목 */}
        <h2 className="mb-2 text-center text-xl font-bold text-foreground">
          계정을 삭제하시겠습니까?
        </h2>

        {/* 설명 */}
        <p className="mb-6 text-center text-sm text-muted-foreground">
          계정을 삭제하면 모든 학습 기록과 데이터가 영구적으로 삭제됩니다.
          이 작업은 되돌릴 수 없습니다.
        </p>

        {/* 확인 입력 */}
        <div className="mb-4">
          <label className="mb-2 block text-sm font-medium text-foreground">
            확인을 위해 &quot;계정 삭제&quot;를 입력하세요
          </label>
          <input
            type="text"
            value={confirmText}
            onChange={(e) => setConfirmText(e.target.value)}
            placeholder="계정 삭제"
            className={cn(
              'w-full rounded-xl border border-border bg-background px-4 py-3 text-sm',
              'placeholder:text-muted-foreground',
              'focus:border-destructive focus:outline-none focus:ring-2 focus:ring-destructive/20'
            )}
          />
        </div>

        {/* 에러 */}
        {error && (
          <div className="mb-4 rounded-xl bg-destructive/10 px-4 py-3 text-sm text-destructive">
            {error}
          </div>
        )}

        {/* 버튼 */}
        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 rounded-xl border border-border bg-background py-3 text-sm font-medium text-foreground hover:bg-muted"
          >
            취소
          </button>
          <button
            onClick={handleDelete}
            disabled={confirmText !== '계정 삭제' || isPending}
            className={cn(
              'flex-1 rounded-xl bg-destructive py-3 text-sm font-semibold text-destructive-foreground',
              'transition-all hover:bg-destructive/90',
              'disabled:cursor-not-allowed disabled:opacity-50'
            )}
          >
            {isPending ? (
              <Loader2 className="mx-auto h-5 w-5 animate-spin" />
            ) : (
              '삭제하기'
            )}
          </button>
        </div>
      </div>
    </div>
  )
}
