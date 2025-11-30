import { cn } from '@/lib/utils/cn'

interface SkeletonProps {
  className?: string
}

export function Skeleton({ className }: SkeletonProps) {
  return (
    <div
      className={cn(
        'animate-pulse rounded-md bg-muted',
        className
      )}
    />
  )
}

// 프리셋 스켈레톤 컴포넌트들
export function SkeletonText({ className }: SkeletonProps) {
  return <Skeleton className={cn('h-4 w-full', className)} />
}

export function SkeletonTitle({ className }: SkeletonProps) {
  return <Skeleton className={cn('h-6 w-3/4', className)} />
}

export function SkeletonAvatar({ className }: SkeletonProps) {
  return <Skeleton className={cn('h-10 w-10 rounded-full', className)} />
}

export function SkeletonButton({ className }: SkeletonProps) {
  return <Skeleton className={cn('h-10 w-24', className)} />
}

export function SkeletonCard({ className }: SkeletonProps) {
  return (
    <div className={cn('space-y-3 rounded-lg border p-4', className)}>
      <Skeleton className="h-40 w-full rounded-md" />
      <SkeletonTitle />
      <SkeletonText className="w-full" />
      <SkeletonText className="w-2/3" />
    </div>
  )
}

export function SkeletonList({ count = 3, className }: SkeletonProps & { count?: number }) {
  return (
    <div className={cn('space-y-3', className)}>
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="flex items-center gap-3">
          <SkeletonAvatar />
          <div className="flex-1 space-y-2">
            <SkeletonText className="w-1/2" />
            <SkeletonText className="w-3/4" />
          </div>
        </div>
      ))}
    </div>
  )
}
