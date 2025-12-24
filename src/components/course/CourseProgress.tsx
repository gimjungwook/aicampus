'use client'

import { cn } from '@/lib/utils/cn'

interface CourseProgressProps {
  completedLessons: number
  totalLessons: number
  progressPercent: number
  className?: string
}

export function CourseProgress({
  completedLessons,
  totalLessons,
  progressPercent,
  className,
}: CourseProgressProps) {
  // SVG 원형 진도 바 계산
  const size = 120
  const strokeWidth = 10
  const radius = (size - strokeWidth) / 2
  const circumference = 2 * Math.PI * radius
  const offset = circumference - (progressPercent / 100) * circumference

  return (
    <div
      className={cn(
        'flex items-center gap-6 rounded-sm border border-border bg-card p-6',
        className
      )}
    >
      {/* 원형 진도 차트 */}
      <div className="relative">
        <svg width={size} height={size} className="-rotate-90">
          {/* 배경 원 */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke="var(--muted)"
            strokeWidth={strokeWidth}
          />
          {/* 진도 원 */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke="var(--primary)"
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            className="transition-all duration-500"
          />
        </svg>
        {/* 중앙 텍스트 */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-2xl font-bold">{progressPercent}%</span>
        </div>
      </div>

      {/* 진도 정보 */}
      <div>
        <p className="mb-1 text-lg font-bold">
          {progressPercent === 100 ? '완료!' : '학습 중'}
        </p>
        <p className="text-sm text-muted-foreground">
          {completedLessons}/{totalLessons} 레슨 완료
        </p>
        {progressPercent > 0 && progressPercent < 100 && (
          <p className="mt-2 text-sm text-primary">
            {totalLessons - completedLessons}개 레슨 남음
          </p>
        )}
      </div>
    </div>
  )
}
