'use client'

import { useState } from 'react'
import { YouTubePlayer } from '@/components/lesson/YouTubePlayer'
import { LessonSandbox } from '@/components/lesson/LessonSandbox'
import { LessonHeader } from '@/components/lesson/LessonHeader'
import { LessonFooter } from '@/components/lesson/LessonFooter'
import { MarkdownRenderer } from '@/components/sandbox/MarkdownRenderer'
import { ResizablePanels } from '@/components/lesson/ResizablePanels'
import type { LessonContext } from '@/lib/types/lesson'

interface LessonContentProps {
  context: LessonContext
  isCompleted: boolean
}

export function LessonContent({ context, isCompleted }: LessonContentProps) {
  const [isSandboxVisible, setIsSandboxVisible] = useState(true)

  const videoAndInfo = (
    <div className="flex h-full flex-col gap-4 overflow-y-auto">
      {/* 콘텐츠 영역 (비디오 또는 블로그) */}
      {context.lesson.content_type === 'video' ? (
        <div className="flex h-full w-full items-center">
          <div className="w-full">
            <YouTubePlayer
              videoId={context.lesson.youtube_video_id!}
              title={context.lesson.title}
            />
          </div>
        </div>
      ) : (
        <div className="flex-1 overflow-y-auto rounded-sm border border-border bg-card p-6">
          <MarkdownRenderer content={context.lesson.markdown_content || ''} />
        </div>
      )}
    </div>
  )

  const sandboxPanel = (
    <div className="h-full">
      <LessonSandbox
        lessonId={context.lesson.id}
        lessonTitle={context.lesson.title}
      />
    </div>
  )

  return (
    <div className="flex h-full flex-col">
      {/* 헤더: breadcrumb + 샌드박스 토글 */}
      <LessonHeader
        context={context}
        isSandboxVisible={isSandboxVisible}
        onToggleSandbox={() => setIsSandboxVisible(!isSandboxVisible)}
      />

      {/* 메인 콘텐츠 영역 */}
      <div className="flex-1 overflow-hidden">
        {/* 모바일: 세로 스택 */}
        <div className="flex h-full flex-col gap-6 overflow-y-auto lg:hidden">
          {/* 콘텐츠 영역 */}
          {context.lesson.content_type === 'video' ? (
            <div className="flex flex-1 w-full items-center">
              <div className="w-full">
                <YouTubePlayer
                  videoId={context.lesson.youtube_video_id!}
                  title={context.lesson.title}
                />
              </div>
            </div>
          ) : (
            <div className="max-h-[500px] overflow-y-auto rounded-sm border border-border bg-card p-6">
              <MarkdownRenderer content={context.lesson.markdown_content || ''} />
            </div>
          )}

          {/* 샌드박스 */}
          <div className="h-[500px]">
            <LessonSandbox
              lessonId={context.lesson.id}
              lessonTitle={context.lesson.title}
            />
          </div>
        </div>

        {/* 데스크톱: 리사이즈 가능한 좌우 패널 또는 전체 너비 */}
        <div className="hidden h-full lg:block">
          {isSandboxVisible ? (
            <ResizablePanels
              leftPanel={videoAndInfo}
              rightPanel={sandboxPanel}
            />
          ) : (
            <div className="h-full">
              {videoAndInfo}
            </div>
          )}
        </div>
      </div>

      {/* 푸터: 홈 + 이전/다음 네비게이션 */}
      <LessonFooter context={context} isCompleted={isCompleted} />
    </div>
  )
}
