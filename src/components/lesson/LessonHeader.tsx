'use client'

import Link from 'next/link'
import { ChevronLeft, PanelRight, PanelRightClose } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { LessonContext } from '@/lib/types/lesson'

interface LessonHeaderProps {
  context: LessonContext
  isSandboxVisible: boolean
  onToggleSandbox: () => void
}

export function LessonHeader({ context, isSandboxVisible, onToggleSandbox }: LessonHeaderProps) {
  return (
    <div className="shrink-0 border-b border-border bg-card">
      <div className="flex items-center justify-between px-4 py-3">
        {/* 좌측: Breadcrumb */}
        <div className="flex items-center gap-4 min-w-0">
          <Link
            href={`/courses/${context.courseId}`}
            className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground shrink-0"
          >
            <ChevronLeft className="h-4 w-4" />
            {context.courseTitle}
          </Link>
          <span className="text-muted-foreground shrink-0">/</span>
          <span className="text-sm font-medium truncate">{context.lesson.title}</span>
        </div>

        {/* 우측: 샌드박스 토글 (데스크톱만) */}
        <div className="hidden lg:flex items-center gap-3 shrink-0">
          <span className="text-sm text-muted-foreground">AI 샌드박스</span>
          <button
            onClick={onToggleSandbox}
            className={cn(
              "relative flex items-center justify-center w-10 h-10 rounded-sm transition-colors",
              isSandboxVisible
                ? "bg-primary/10 text-primary hover:bg-primary/20"
                : "bg-muted text-muted-foreground hover:bg-muted/80"
            )}
            aria-label={isSandboxVisible ? "샌드박스 숨기기" : "샌드박스 보이기"}
          >
            {isSandboxVisible ? (
              <PanelRight className="h-5 w-5" />
            ) : (
              <PanelRightClose className="h-5 w-5" />
            )}
          </button>
        </div>
      </div>
    </div>
  )
}
