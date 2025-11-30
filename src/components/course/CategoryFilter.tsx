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
          'shrink-0 rounded-full px-4 py-2 text-sm font-medium transition-colors',
          selectedSlug === 'all'
            ? 'bg-primary text-primary-foreground'
            : 'bg-muted text-muted-foreground hover:bg-muted/80'
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
            'shrink-0 rounded-full px-4 py-2 text-sm font-medium transition-colors',
            selectedSlug === category.slug
              ? 'bg-primary text-primary-foreground'
              : 'bg-muted text-muted-foreground hover:bg-muted/80'
          )}
        >
          {category.icon && <span className="mr-1">{category.icon}</span>}
          {category.name}
        </button>
      ))}
    </div>
  )
}
