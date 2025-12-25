'use client'

import { useState, useRef } from 'react'
import Image from 'next/image'
import {
  uploadSectionImage,
  deleteSectionImage,
  reorderSectionImages
} from '@/lib/actions/course-images'
import type { CourseSectionImage, SectionType } from '@/lib/types/course'

interface ImageSectionEditorProps {
  courseId: string
  sectionType: SectionType
  images: CourseSectionImage[]
  onUpdate: () => void
}

const sectionTitles: Record<SectionType, string> = {
  intro: '클래스 소개',
  features: '클래스 특징',
  instructor: '강사 소개'
}

export function ImageSectionEditor({
  courseId,
  sectionType,
  images,
  onUpdate
}: ImageSectionEditorProps) {
  const [isUploading, setIsUploading] = useState(false)
  const [localImages, setLocalImages] = useState(images)
  const fileInputRef = useRef<HTMLInputElement>(null)

  // 파일 업로드 처리
  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setIsUploading(true)
    const formData = new FormData()
    formData.append('file', file)

    const result = await uploadSectionImage(courseId, sectionType, formData)

    if (result.success && result.image) {
      setLocalImages(prev => [...prev, result.image!])
      onUpdate()
    } else {
      alert(result.error || '업로드 실패')
    }

    setIsUploading(false)
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  // 이미지 삭제
  const handleDelete = async (imageId: string) => {
    if (!confirm('이미지를 삭제하시겠습니까?')) return

    const result = await deleteSectionImage(imageId)

    if (result.success) {
      setLocalImages(prev => prev.filter(img => img.id !== imageId))
      onUpdate()
    } else {
      alert(result.error || '삭제 실패')
    }
  }

  // 순서 변경 (위로)
  const moveUp = async (index: number) => {
    if (index === 0) return

    const newImages = [...localImages]
    ;[newImages[index - 1], newImages[index]] = [newImages[index], newImages[index - 1]]

    setLocalImages(newImages)
    await reorderSectionImages(courseId, sectionType, newImages.map(img => img.id))
    onUpdate()
  }

  // 순서 변경 (아래로)
  const moveDown = async (index: number) => {
    if (index === localImages.length - 1) return

    const newImages = [...localImages]
    ;[newImages[index], newImages[index + 1]] = [newImages[index + 1], newImages[index]]

    setLocalImages(newImages)
    await reorderSectionImages(courseId, sectionType, newImages.map(img => img.id))
    onUpdate()
  }

  return (
    <section id={sectionType} className="py-8">
      <div className="mx-auto max-w-4xl px-4">
        <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
          {sectionTitles[sectionType]}
          <span className="text-sm font-normal text-muted-foreground">
            (편집 모드)
          </span>
        </h3>

        {/* 이미지 목록 */}
        <div className="space-y-4">
          {localImages.map((image, index) => (
            <div
              key={image.id}
              className="relative border-2 border-dashed border-primary/50 rounded-lg p-2"
            >
              <Image
                src={image.image_url}
                alt={image.alt_text || ''}
                width={1200}
                height={400}
                className="w-full h-auto rounded"
              />

              {/* 오버레이 컨트롤 */}
              <div className="absolute top-4 right-4 flex gap-2">
                <button
                  onClick={() => moveUp(index)}
                  disabled={index === 0}
                  className="p-2 bg-white rounded-full shadow hover:bg-gray-100 disabled:opacity-50"
                  title="위로 이동"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                  </svg>
                </button>
                <button
                  onClick={() => moveDown(index)}
                  disabled={index === localImages.length - 1}
                  className="p-2 bg-white rounded-full shadow hover:bg-gray-100 disabled:opacity-50"
                  title="아래로 이동"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                <button
                  onClick={() => handleDelete(image.id)}
                  className="p-2 bg-red-500 text-white rounded-full shadow hover:bg-red-600"
                  title="삭제"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* 업로드 영역 */}
        <div
          className="mt-4 border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-primary transition-colors cursor-pointer"
          onClick={() => fileInputRef.current?.click()}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleFileSelect}
          />
          {isUploading ? (
            <p className="text-muted-foreground">업로드 중...</p>
          ) : (
            <>
              <svg className="w-12 h-12 mx-auto text-gray-400 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <p className="text-muted-foreground">
                클릭하거나 이미지를 드래그하여 업로드
              </p>
              <p className="text-sm text-muted-foreground mt-1">
                PNG, JPG, WEBP (최대 5MB)
              </p>
            </>
          )}
        </div>
      </div>
    </section>
  )
}
