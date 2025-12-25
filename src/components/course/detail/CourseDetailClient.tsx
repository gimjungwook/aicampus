'use client'

import { useState, useEffect, useRef, ReactNode } from 'react'
import { StickyNavigation } from './StickyNavigation'
import { BottomCTA } from './BottomCTA'
import { EditModeProvider } from './EditModeContext'

interface CourseDetailClientProps {
  children: ReactNode
  sidebarContent?: ReactNode
  visibleSections: string[]
  courseTitle: string
  courseId: string
  isEnrolled: boolean
  firstLessonId?: string
  isAdmin?: boolean
  onEnroll?: () => void
  showBottomCTA?: boolean
}

export function CourseDetailClient({
  children,
  sidebarContent,
  visibleSections,
  courseTitle,
  courseId,
  isEnrolled,
  firstLessonId,
  isAdmin = false,
  onEnroll,
  showBottomCTA = true
}: CourseDetailClientProps) {
  const [activeSection, setActiveSection] = useState('intro')
  const [editMode, setEditMode] = useState(false)
  const observerRef = useRef<IntersectionObserver | null>(null)

  useEffect(() => {
    // IntersectionObserver 설정
    observerRef.current = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id)
          }
        })
      },
      {
        rootMargin: '-140px 0px -50% 0px',
        threshold: 0
      }
    )

    // 각 섹션 관찰 (새 섹션 ID 포함)
    const sectionIds = ['intro', 'curriculum', 'faq', 'notice', 'reviews', 'recommended']
    sectionIds.forEach(id => {
      const element = document.getElementById(id)
      if (element) {
        observerRef.current?.observe(element)
      }
    })

    return () => {
      observerRef.current?.disconnect()
    }
  }, [])

  const handleSectionClick = (sectionId: string) => {
    const element = document.getElementById(sectionId)
    if (element) {
      const offset = 140 // Header + StickyNav 높이
      const top = element.getBoundingClientRect().top + window.scrollY - offset
      window.scrollTo({ top, behavior: 'smooth' })
    }
  }

  return (
    <EditModeProvider value={{ editMode, setEditMode }}>
      <StickyNavigation
        activeSection={activeSection}
        onSectionClick={handleSectionClick}
        visibleSections={visibleSections}
      />

      {/* 관리자 편집 버튼 */}
      {isAdmin && (
        <div className="mx-auto max-w-6xl px-4 py-2 flex justify-end">
          <button
            onClick={() => setEditMode(!editMode)}
            className={`
              px-4 py-2 text-sm rounded-md transition-colors
              ${editMode
                ? 'bg-green-500 text-white hover:bg-green-600'
                : 'bg-primary text-white hover:bg-primary/90'
              }
            `}
          >
            {editMode ? '편집 완료' : '섹션 편집'}
          </button>
        </div>
      )}

      {/* 2-column 레이아웃: 좌측 콘텐츠 + 우측 사이드바 */}
      <div className="mx-auto max-w-6xl px-4">
        <div className="flex gap-8 pb-[80px] lg:pb-0">
          {/* 메인 콘텐츠 */}
          <div className="flex-1 min-w-0">
            {children}
          </div>

          {/* 우측 사이드바 (데스크탑만) */}
          {sidebarContent && (
            <aside className="hidden lg:block w-[340px] shrink-0">
              {sidebarContent}
            </aside>
          )}
        </div>
      </div>

      {/* 하단 고정 CTA (모바일에서만 표시) */}
      {showBottomCTA && (
        <div className="lg:hidden">
          <BottomCTA
            courseTitle={courseTitle}
            courseId={courseId}
            isEnrolled={isEnrolled}
            firstLessonId={firstLessonId}
            onEnroll={onEnroll}
          />
        </div>
      )}
    </EditModeProvider>
  )
}
