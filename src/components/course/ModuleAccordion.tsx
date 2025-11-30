'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronDown } from 'lucide-react'
import { cn } from '@/lib/utils/cn'
import { LessonItem } from './LessonItem'
import type { ModuleWithProgress } from '@/lib/types/course'

interface ModuleAccordionProps {
  module: ModuleWithProgress
  moduleIndex: number
  isEnrolled: boolean
  courseId: string
  defaultOpen?: boolean
}

export function ModuleAccordion({
  module,
  moduleIndex,
  isEnrolled,
  courseId,
  defaultOpen = false,
}: ModuleAccordionProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen)

  const completedCount = module.completedCount
  const totalCount = module.lessons.length
  const isAllCompleted = completedCount === totalCount && totalCount > 0

  return (
    <div className="overflow-hidden rounded-2xl border border-border">
      {/* 헤더 */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          'flex w-full items-center justify-between p-4',
          'bg-card transition-colors hover:bg-muted/50'
        )}
      >
        <div className="flex items-center gap-3">
          <ChevronDown
            className={cn(
              'h-5 w-5 text-muted-foreground transition-transform',
              isOpen && 'rotate-180'
            )}
          />
          <div className="text-left">
            <p className="font-bold">
              모듈 {moduleIndex + 1}: {module.title}
            </p>
            {module.description && (
              <p className="text-sm text-muted-foreground">
                {module.description}
              </p>
            )}
          </div>
        </div>

        <span
          className={cn(
            'rounded-full px-2.5 py-1 text-xs font-medium',
            isAllCompleted
              ? 'bg-primary/10 text-primary'
              : 'bg-muted text-muted-foreground'
          )}
        >
          {completedCount}/{totalCount} 완료
        </span>
      </button>

      {/* 레슨 목록 */}
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            initial={{ height: 0 }}
            animate={{ height: 'auto' }}
            exit={{ height: 0 }}
            transition={{ duration: 0.2 }}
          >
            <div className="border-t divide-y">
              {module.lessons.map((lesson, index) => (
                <LessonItem
                  key={lesson.id}
                  lesson={lesson}
                  lessonIndex={index}
                  moduleIndex={moduleIndex}
                  isEnrolled={isEnrolled}
                  courseId={courseId}
                />
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
