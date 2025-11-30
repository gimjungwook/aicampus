'use client'

import { useState, useRef, useTransition } from 'react'
import Image from 'next/image'
import { cn } from '@/lib/utils/cn'
import { Camera, Loader2, Check, User } from 'lucide-react'
import { updateProfile, uploadAvatar } from '@/lib/actions/profile'
import type { Profile } from '@/lib/types/user'

interface ProfileEditFormProps {
  profile: Profile
  onUpdate?: () => void
}

export function ProfileEditForm({ profile, onUpdate }: ProfileEditFormProps) {
  const [nickname, setNickname] = useState(profile.nickname || '')
  const [marketingConsent, setMarketingConsent] = useState(profile.marketing_consent)
  const [avatarUrl, setAvatarUrl] = useState(profile.avatar_url)
  const [isPending, startTransition] = useTransition()
  const [isUploading, setIsUploading] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleAvatarClick = () => {
    fileInputRef.current?.click()
  }

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setIsUploading(true)
    setMessage(null)

    const formData = new FormData()
    formData.append('avatar', file)

    const result = await uploadAvatar(formData)

    if (result.success && result.url) {
      setAvatarUrl(result.url + '?t=' + Date.now()) // 캐시 무효화
      setMessage({ type: 'success', text: '프로필 사진이 변경되었습니다' })
      onUpdate?.()
    } else {
      setMessage({ type: 'error', text: result.error || '업로드에 실패했습니다' })
    }

    setIsUploading(false)
    // 같은 파일 다시 선택 가능하도록
    e.target.value = ''
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setMessage(null)

    startTransition(async () => {
      const result = await updateProfile({
        nickname: nickname.trim() || null,
        marketing_consent: marketingConsent,
      })

      if (result.success) {
        setMessage({ type: 'success', text: '프로필이 저장되었습니다' })
        onUpdate?.()
      } else {
        setMessage({ type: 'error', text: result.error || '저장에 실패했습니다' })
      }
    })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* 프로필 사진 */}
      <div className="flex flex-col items-center gap-4">
        <button
          type="button"
          onClick={handleAvatarClick}
          disabled={isUploading}
          className={cn(
            'relative h-24 w-24 overflow-hidden rounded-full border-4 border-border',
            'bg-muted transition-all hover:border-primary',
            'focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2',
            isUploading && 'cursor-not-allowed opacity-70'
          )}
        >
          {avatarUrl ? (
            <Image
              src={avatarUrl}
              alt="프로필 사진"
              fill
              className="object-cover"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center">
              <User className="h-12 w-12 text-muted-foreground" />
            </div>
          )}
          <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 transition-opacity hover:opacity-100">
            {isUploading ? (
              <Loader2 className="h-6 w-6 animate-spin text-white" />
            ) : (
              <Camera className="h-6 w-6 text-white" />
            )}
          </div>
        </button>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp"
          onChange={handleFileChange}
          className="hidden"
        />
        <p className="text-xs text-muted-foreground">
          JPG, PNG, WebP (최대 2MB)
        </p>
      </div>

      {/* 이메일 (읽기 전용) */}
      <div>
        <label className="mb-2 block text-sm font-medium text-foreground">
          이메일
        </label>
        <input
          type="email"
          value={profile.email}
          disabled
          className="w-full rounded-xl border border-border bg-muted px-4 py-3 text-sm text-muted-foreground"
        />
      </div>

      {/* 닉네임 */}
      <div>
        <label className="mb-2 block text-sm font-medium text-foreground">
          닉네임
        </label>
        <input
          type="text"
          value={nickname}
          onChange={(e) => setNickname(e.target.value)}
          placeholder="닉네임을 입력하세요"
          maxLength={20}
          className={cn(
            'w-full rounded-xl border border-border bg-background px-4 py-3 text-sm',
            'placeholder:text-muted-foreground',
            'focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20'
          )}
        />
      </div>

      {/* 마케팅 동의 */}
      <div className="flex items-start gap-3">
        <button
          type="button"
          onClick={() => setMarketingConsent(!marketingConsent)}
          className={cn(
            'mt-0.5 h-5 w-5 shrink-0 rounded border-2 transition-colors',
            marketingConsent
              ? 'border-primary bg-primary text-primary-foreground'
              : 'border-border bg-background'
          )}
        >
          {marketingConsent && <Check className="h-full w-full p-0.5" />}
        </button>
        <div>
          <p className="text-sm font-medium text-foreground">마케팅 정보 수신 동의</p>
          <p className="text-xs text-muted-foreground">
            새로운 코스, 프로모션 등의 정보를 받아보실 수 있습니다.
          </p>
        </div>
      </div>

      {/* 메시지 */}
      {message && (
        <div className={cn(
          'rounded-xl px-4 py-3 text-sm',
          message.type === 'success'
            ? 'bg-primary/10 text-primary'
            : 'bg-destructive/10 text-destructive'
        )}>
          {message.text}
        </div>
      )}

      {/* 저장 버튼 */}
      <button
        type="submit"
        disabled={isPending}
        className={cn(
          'w-full rounded-xl bg-primary py-3 text-sm font-semibold text-primary-foreground',
          'shadow-md shadow-primary/20 transition-all',
          'hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-50'
        )}
      >
        {isPending ? (
          <Loader2 className="mx-auto h-5 w-5 animate-spin" />
        ) : (
          '저장하기'
        )}
      </button>
    </form>
  )
}
