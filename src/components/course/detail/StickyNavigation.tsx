'use client'

import { cn } from '@/lib/utils/cn'

interface StickyNavigationProps {
  activeSection: string
  onSectionClick: (sectionId: string) => void
  visibleSections: string[]
}

const allSections = [
  { id: 'intro', label: '소개' },
  { id: 'curriculum', label: '커리큘럼' },
  { id: 'faq', label: 'FAQ' },
  { id: 'notice', label: '수강전 참고사항' },
  { id: 'reviews', label: '수강후기' },
  { id: 'recommended', label: '관련 코스' },
]

export function StickyNavigation({
  activeSection,
  onSectionClick,
  visibleSections
}: StickyNavigationProps) {
  // 항상 표시되는 섹션 + 동적 섹션
  const alwaysVisible = ['intro', 'curriculum', 'reviews', 'recommended']
  const sections = allSections.filter(
    s => alwaysVisible.includes(s.id) || visibleSections.includes(s.id)
  )

  return (
    <nav className="sticky top-[81px] z-40 border-b border-border bg-background">
      <div className="mx-auto max-w-6xl px-4">
        <ul className="flex h-[52px] items-center gap-8 overflow-x-auto scrollbar-hide">
          {sections.map(section => (
            <li key={section.id}>
              <button
                onClick={() => onSectionClick(section.id)}
                className={cn(
                  'h-[52px] text-[15px] whitespace-nowrap transition-colors relative',
                  activeSection === section.id
                    ? 'text-foreground font-semibold'
                    : 'text-muted-foreground hover:text-foreground'
                )}
              >
                {section.label}
                {activeSection === section.id && (
                  <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-foreground" />
                )}
              </button>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  )
}
