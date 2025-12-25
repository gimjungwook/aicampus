import Image from 'next/image'
import type { CourseSectionImage, SectionType } from '@/lib/types/course'

interface ImageSectionProps {
  sectionId: SectionType
  images: CourseSectionImage[]
  className?: string
}

const sectionTitles: Record<SectionType, string> = {
  intro: '클래스 소개',
  features: '클래스 특징',
  instructor: '강사 소개'
}

export function ImageSection({
  sectionId,
  images,
  className = ''
}: ImageSectionProps) {
  // 이미지가 없으면 렌더링하지 않음
  if (images.length === 0) {
    return null
  }

  // order_index로 정렬
  const sortedImages = [...images].sort((a, b) => a.order_index - b.order_index)

  return (
    <section
      id={sectionId}
      className={`py-12 ${className}`}
    >
      <div className="mx-auto max-w-4xl px-4">
        {/* 섹션 제목 (스크린 리더용) */}
        <h2 className="sr-only">{sectionTitles[sectionId]}</h2>

        {/* 이미지 목록 */}
        <div className="space-y-0">
          {sortedImages.map((image, index) => (
            <div key={image.id} className="relative w-full">
              <Image
                src={image.image_url}
                alt={image.alt_text || sectionTitles[sectionId]}
                width={1200}
                height={800}
                className="w-full h-auto"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 1200px"
                priority={index === 0 && sectionId === 'intro'}
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
