'use client'

import { useState, useRef } from 'react'
import { uploadContentImage } from '@/lib/actions/admin'
import { Upload, X, Loader2, Image as ImageIcon } from 'lucide-react'
import Image from 'next/image'
import { Button } from '@/components/ui/Button'

interface ImageUploaderProps {
  value?: string | null
  onChange: (url: string | null) => void
  folder?: string
  className?: string
  aspectRatio?: 'video' | 'banner' | 'square'
}

export function ImageUploader({
  value,
  onChange,
  folder = 'images',
  className,
  aspectRatio = 'video',
}: ImageUploaderProps) {
  const aspectClasses = {
    video: 'aspect-video',
    banner: 'aspect-[5/1]',
    square: 'aspect-square',
  }
  const [isUploading, setIsUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // 파일 크기 체크 (5MB)
    if (file.size > 5 * 1024 * 1024) {
      setError('파일 크기는 5MB 이하여야 합니다.')
      return
    }

    // 파일 타입 체크
    if (!file.type.startsWith('image/')) {
      setError('이미지 파일만 업로드 가능합니다.')
      return
    }

    setIsUploading(true)
    setError(null)

    const formData = new FormData()
    formData.append('image', file)
    formData.append('folder', folder)

    try {
      const result = await uploadContentImage(formData)
      if (result.success && result.data) {
        onChange(result.data.url)
      } else {
        setError(result.error || '업로드 실패')
      }
    } catch {
      setError('업로드 중 오류가 발생했습니다.')
    } finally {
      setIsUploading(false)
      // 같은 파일 재선택 가능하도록 초기화
      if (inputRef.current) {
        inputRef.current.value = ''
      }
    }
  }

  const handleRemove = () => {
    onChange(null)
  }

  return (
    <div className={className}>
      {value ? (
        <div className="relative inline-block w-full max-w-md">
          <div className={`relative ${aspectClasses[aspectRatio]} w-full overflow-hidden rounded border border-border`}>
            <Image
              src={value}
              alt="업로드된 이미지"
              fill
              className="object-cover"
            />
          </div>
          <button
            type="button"
            onClick={handleRemove}
            className="absolute -right-2 -top-2 rounded-full bg-destructive p-1 text-destructive-foreground hover:bg-destructive/90"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={isUploading}
          className={`flex ${aspectClasses[aspectRatio]} w-full max-w-md flex-col items-center justify-center gap-2 rounded border-2 border-dashed border-border hover:border-primary hover:bg-muted/50 transition-colors disabled:opacity-50`}
        >
          {isUploading ? (
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          ) : (
            <>
              <ImageIcon className="h-8 w-8 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">
                클릭하여 이미지 업로드
              </span>
            </>
          )}
        </button>
      )}

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        onChange={handleUpload}
        className="hidden"
      />

      {error && <p className="mt-2 text-sm text-destructive">{error}</p>}
    </div>
  )
}
