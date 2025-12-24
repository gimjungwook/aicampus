import { cn } from '@/lib/utils/cn'

interface CourseCardSkeletonProps {
  className?: string
}

export function CourseCardSkeleton({ className }: CourseCardSkeletonProps) {
  return (
    <div
      className={cn(
        'overflow-hidden rounded-sm bg-card',
        className
      )}
    >
      {/* 썸네일 스켈레톤 - 16:9 비율 */}
      <div className="relative aspect-video animate-pulse rounded-sm bg-muted">
        {/* 상단 뱃지 스켈레톤 */}
        <div className="absolute left-3 top-3 h-7 w-20 rounded-sm bg-muted-foreground/20" />
        {/* 상단 북마크 스켈레톤 */}
        <div className="absolute right-3 top-3 h-9 w-9 rounded-sm bg-muted-foreground/20" />
        {/* 하단 제목 스켈레톤 */}
        <div className="absolute bottom-4 left-4 right-4 space-y-2">
          <div className="h-6 w-3/4 rounded-sm bg-muted-foreground/20" />
          <div className="h-6 w-1/2 rounded-sm bg-muted-foreground/20" />
        </div>
      </div>

      {/* 하단 정보 스켈레톤 */}
      <div className="p-3">
        {/* 설명 */}
        <div className="mb-2 space-y-1">
          <div className="h-4 w-full animate-pulse rounded-sm bg-muted" />
          <div className="h-4 w-2/3 animate-pulse rounded-sm bg-muted" />
        </div>

        {/* 카테고리 | 난이도 */}
        <div className="mb-2 h-3 w-24 animate-pulse rounded-sm bg-muted" />

        {/* 평점 & 레슨 수 */}
        <div className="flex items-center gap-3">
          <div className="h-4 w-20 animate-pulse rounded-sm bg-muted" />
          <div className="h-4 w-16 animate-pulse rounded-sm bg-muted" />
        </div>
      </div>
    </div>
  )
}

// 그리드용 스켈레톤
export function CourseCardSkeletonGrid({ count = 6 }: { count?: number }) {
  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {Array.from({ length: count }).map((_, i) => (
        <CourseCardSkeleton key={i} />
      ))}
    </div>
  )
}
