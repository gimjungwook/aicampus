'use client'

import { YouTubePlayer } from '@/components/lesson/YouTubePlayer'
import { LessonSandbox } from '@/components/lesson/LessonSandbox'
import { LessonNavigation } from '@/components/lesson/LessonNavigation'
import { MarkdownRenderer } from '@/components/sandbox/MarkdownRenderer'
import { ResizablePanels } from '@/components/lesson/ResizablePanels'
import type { LessonContext } from '@/lib/types/lesson'

interface LessonContentProps {
  context: LessonContext
  isCompleted: boolean
}

export function LessonContent({ context, isCompleted }: LessonContentProps) {
  const leftPanel = (
    <div className="flex h-full flex-col gap-4 overflow-y-auto p-4">
      {/* 콘텐츠 영역 (비디오 또는 블로그) */}
      {context.lesson.content_type === 'video' ? (
        <YouTubePlayer
          videoId={context.lesson.youtube_video_id!}
          title={context.lesson.title}
        />
      ) : (
        <div className="flex-1 overflow-y-auto rounded-2xl border border-border bg-card p-6">
          <MarkdownRenderer content={context.lesson.markdown_content || ''} />
        </div>
      )}

      {/* 레슨 정보 */}
      <div className="shrink-0 rounded-2xl border border-border bg-card p-4">
        <h1 className="mb-2 text-xl font-bold">{context.lesson.title}</h1>
        {context.lesson.description && (
          <p className="text-sm text-muted-foreground">
            {context.lesson.description}
          </p>
        )}
        {context.lesson.duration_minutes && (
          <p className="mt-2 text-xs text-muted-foreground">
            약 {context.lesson.duration_minutes}분
          </p>
        )}
      </div>

      {/* 네비게이션 */}
      <div className="shrink-0">
        <LessonNavigation context={context} isCompleted={isCompleted} />
      </div>
    </div>
  )

  const rightPanel = (
    <div className="h-full p-4 pl-0">
      <LessonSandbox
        lessonId={context.lesson.id}
        lessonTitle={context.lesson.title}
      />
    </div>
  )

  return (
    <>
      {/* 모바일: 세로 스택 */}
      <div className="flex flex-col gap-6 p-4 lg:hidden">
        {/* 콘텐츠 영역 */}
        {context.lesson.content_type === 'video' ? (
          <YouTubePlayer
            videoId={context.lesson.youtube_video_id!}
            title={context.lesson.title}
          />
        ) : (
          <div className="max-h-[500px] overflow-y-auto rounded-2xl border border-border bg-card p-6">
            <MarkdownRenderer content={context.lesson.markdown_content || ''} />
          </div>
        )}

        {/* 레슨 정보 */}
        <div className="rounded-2xl border border-border bg-card p-4">
          <h1 className="mb-2 text-xl font-bold">{context.lesson.title}</h1>
          {context.lesson.description && (
            <p className="text-sm text-muted-foreground">
              {context.lesson.description}
            </p>
          )}
        </div>

        {/* 네비게이션 */}
        <LessonNavigation context={context} isCompleted={isCompleted} />

        {/* 샌드박스 */}
        <div className="h-[500px]">
          <LessonSandbox
            lessonId={context.lesson.id}
            lessonTitle={context.lesson.title}
          />
        </div>
      </div>

      {/* 데스크톱: 리사이즈 가능한 좌우 패널 */}
      <div className="hidden h-[calc(100vh-120px)] lg:block">
        <ResizablePanels
          leftPanel={leftPanel}
          rightPanel={rightPanel}
          defaultLeftWidth={50}
          minLeftWidth={35}
          maxLeftWidth={65}
        />
      </div>
    </>
  )
}
