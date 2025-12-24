'use client'

import { cn } from '@/lib/utils/cn'
import type { Category } from '@/lib/types/course'

interface CategoryFilterProps {
  categories: Category[]
  selectedSlug: string
  onSelect: (slug: string) => void
}

export function CategoryFilter({
  categories,
  selectedSlug,
  onSelect,
}: CategoryFilterProps) {
  return (
    <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
      {/* 전체 버튼 */}
      <button
        onClick={() => onSelect('all')}
        className={cn(
          'shrink-0 rounded-[4px] px-4 py-2.5 text-sm font-semibold transition-colors',
          selectedSlug === 'all'
            ? 'bg-[var(--filter-selected-bg)] text-[var(--filter-selected-text)]'
            : 'bg-[var(--filter-default-bg)] text-[var(--filter-default-text)] hover:bg-[#e5e5e6]'
        )}
      >
        전체
      </button>

      {/* 카테고리 버튼들 */}
      {categories.map((category) => (
        <button
          key={category.id}
          onClick={() => onSelect(category.slug)}
          className={cn(
            'shrink-0 rounded-[4px] px-4 py-2.5 text-sm font-semibold transition-colors',
            selectedSlug === category.slug
              ? 'bg-[var(--filter-selected-bg)] text-[var(--filter-selected-text)]'
              : 'bg-[var(--filter-default-bg)] text-[var(--filter-default-text)] hover:bg-[#e5e5e6]'
          )}
        >
          {category.name}
        </button>
      ))}
    </div>
  )
}
