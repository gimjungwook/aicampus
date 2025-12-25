'use client'

import { useState } from 'react'
import { ChevronUp } from 'lucide-react'
import { cn } from '@/lib/utils/cn'
import type { ModuleWithProgress } from '@/lib/types/course'

interface CurriculumAccordionProps {
  modules: ModuleWithProgress[]
}

export function CurriculumAccordion({ modules }: CurriculumAccordionProps) {
  return (
    <section id="curriculum" className="bg-white py-12">
      <div className="container mx-auto px-4">
        <h2 className="mb-8 text-2xl font-bold text-gray-900">커리큘럼</h2>

        <div className="mx-auto max-w-3xl space-y-4">
          {modules.map((module, index) => (
            <ModuleItem
              key={module.id}
              module={module}
              index={index}
              defaultOpen={index === 0}
            />
          ))}
        </div>
      </div>
    </section>
  )
}

function ModuleItem({
  module,
  index,
  defaultOpen = false,
}: {
  module: ModuleWithProgress
  index: number
  defaultOpen?: boolean
}) {
  const [isOpen, setIsOpen] = useState(defaultOpen)

  // 총 시간 계산 (분:초 형식)
  const formatDuration = (minutes: number | null) => {
    if (!minutes) return '00:00'
    const mins = Math.floor(minutes)
    const secs = Math.round((minutes - mins) * 60)
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }

  return (
    <div>
      {/* 모듈 헤더 - 박스 안에 */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex w-full items-center justify-between rounded-lg border border-gray-200 bg-white p-4 hover:bg-gray-50"
      >
        <div className="flex items-center gap-3">
          <span className="flex h-7 w-7 items-center justify-center rounded bg-gray-900 text-sm font-bold text-white">
            {index + 1}
          </span>
          <span className="font-bold text-gray-900">{module.title}</span>
          <span className="text-sm text-gray-400">{module.lessons.length}개의 레슨</span>
        </div>
        <ChevronUp
          className={cn(
            'h-5 w-5 text-gray-400 transition-transform',
            !isOpen && 'rotate-180'
          )}
        />
      </button>

      {/* 레슨 목록 - 박스 밖, 선으로 연결 */}
      {isOpen && (
        <div className="py-2 pl-10 pr-4">
          {module.lessons.map((lesson, lessonIndex) => (
            <div
              key={lesson.id}
              className="relative flex items-center justify-between py-2"
            >
              {/* 세로 선 */}
              {lessonIndex < module.lessons.length - 1 && (
                <div className="absolute -left-[21px] top-5 h-full w-px bg-gray-300" />
              )}
              {/* 점 */}
              <div className="absolute -left-6 top-1/2 h-2 w-2 -translate-y-1/2 rounded-full bg-gray-300" />
              <span className="text-sm text-gray-700">
                {lessonIndex + 1}. {lesson.title}
              </span>
              <span className="text-sm text-gray-400">
                {formatDuration(lesson.duration_minutes)}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
