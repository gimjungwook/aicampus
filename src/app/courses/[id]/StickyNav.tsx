'use client'

import { useState, useEffect } from 'react'
import { cn } from '@/lib/utils/cn'

const navItems = [
  { id: 'intro', label: '클래스 소개' },
  { id: 'features', label: '클래스 특징' },
  { id: 'instructor', label: '강사 소개' },
  { id: 'curriculum', label: '커리큘럼' },
  { id: 'reviews', label: '후기' },
  { id: 'recommended', label: '추천 클래스' },
]

export function StickyNav() {
  const [activeSection, setActiveSection] = useState('intro')

  useEffect(() => {
    const observerOptions = {
      root: null,
      rootMargin: '-100px 0px -50% 0px', // header 높이 고려
      threshold: 0,
    }

    const observerCallback: IntersectionObserverCallback = (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setActiveSection(entry.target.id)
        }
      })
    }

    const observer = new IntersectionObserver(observerCallback, observerOptions)

    // 각 섹션 관찰
    navItems.forEach(({ id }) => {
      const element = document.getElementById(id)
      if (element) {
        observer.observe(element)
      }
    })

    return () => observer.disconnect()
  }, [])

  const handleClick = (id: string) => {
    const element = document.getElementById(id)
    if (element) {
      const headerOffset = 120 // header + nav 높이
      const elementPosition = element.getBoundingClientRect().top
      const offsetPosition = elementPosition + window.pageYOffset - headerOffset

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth',
      })
    }
  }

  return (
    <nav className="sticky top-16 z-40 bg-[#393939]">
      <div className="container mx-auto">
        <div className="flex items-center justify-center gap-12">
          {navItems.map(({ id, label }) => (
            <button
              key={id}
              onClick={() => handleClick(id)}
              className={cn(
                'relative py-4 text-sm transition-colors',
                activeSection === id
                  ? 'text-white after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-full after:bg-white'
                  : 'text-gray-400 hover:text-white'
              )}
            >
              {label}
            </button>
          ))}
        </div>
      </div>
    </nav>
  )
}
