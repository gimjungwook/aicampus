'use client'

import { cn } from '@/lib/utils/cn'

// Material Design Search Icon
function SearchIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="currentColor"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z" />
    </svg>
  )
}

interface SearchBarProps {
  placeholder?: string
  className?: string
  onSearch?: (query: string) => void
}

export function SearchBar({
  placeholder = '진짜 성장을 도와줄 강의를 찾아보세요.',
  className,
  onSearch
}: SearchBarProps) {
  return (
    <div
      className={cn(
        'flex items-center gap-2 px-4 py-2',
        'bg-[var(--search-bg)] border border-[var(--search-border)]',
        'rounded-full',
        className
      )}
    >
      <SearchIcon className="h-5 w-5 text-muted-foreground" />
      <input
        type="text"
        placeholder={placeholder}
        className="flex-1 bg-transparent text-sm placeholder:text-[var(--search-placeholder)] outline-none"
        onChange={(e) => onSearch?.(e.target.value)}
      />
    </div>
  )
}
