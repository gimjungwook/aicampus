'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Badge } from '@/components/ui/Badge'
import { cn } from '@/lib/utils/cn'
import type { ArticleBanner as BannerType } from '@/lib/types/banner'

interface ArticleBannerProps {
  banners: BannerType[]
}

// **텍스트** 형식을 악센트 색상으로 변환
function renderWithAccent(text: string, accentColor: string | null) {
  if (!accentColor) return text

  const parts = text.split(/(\*\*[^*]+\*\*)/)
  return parts.map((part, index) => {
    if (part.startsWith('**') && part.endsWith('**')) {
      const innerText = part.slice(2, -2)
      return (
        <span key={index} style={{ color: accentColor }}>
          {innerText}
        </span>
      )
    }
    return part
  })
}

export function ArticleBanner({ banners }: ArticleBannerProps) {
  const [currentIndex, setCurrentIndex] = useState(0)

  useEffect(() => {
    if (banners.length <= 1) return
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % banners.length)
    }, 5000)
    return () => clearInterval(timer)
  }, [banners.length])

  const banner = banners[currentIndex]
  if (!banner) return null

  const content = (
    <div className="relative w-full aspect-[5/1] rounded-[15px] overflow-hidden">
      {banner.image_url && (
        <Image
          src={banner.image_url}
          alt=""
          fill
          className="object-cover object-right"
          sizes="(max-width: 1289px) 100vw, 1289px"
          priority
        />
      )}
      <div
        className="absolute inset-0"
        style={{
          background: `linear-gradient(to right, ${banner.gradient_color} 0%, ${banner.gradient_color} 25%, transparent 60%)`
        }}
      />
      <div className="absolute left-[42px] top-1/2 -translate-y-1/2">
        <Badge variant="article" className="mb-3">{banner.badge_text}</Badge>
        <h2 className="text-2xl md:text-3xl font-bold text-white leading-[1.3] whitespace-pre-line">
          {renderWithAccent(banner.title, banner.accent_color)}
        </h2>
        {banner.subtitle && (
          <p className="text-base md:text-lg text-white mt-3 leading-[1.4] whitespace-nowrap">
            {renderWithAccent(banner.subtitle, banner.accent_color)}
          </p>
        )}
      </div>
      {banners.length > 1 && (
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
          {banners.map((_, index) => (
            <button
              key={index}
              onClick={(e) => {
                e.preventDefault()
                setCurrentIndex(index)
              }}
              className={cn(
                'w-2 h-2 rounded-full transition-colors',
                index === currentIndex ? 'bg-white' : 'bg-white/40'
              )}
            />
          ))}
        </div>
      )}
    </div>
  )

  return banner.link_url ? (
    <Link href={banner.link_url}>{content}</Link>
  ) : (
    content
  )
}
