'use client'

import { useState } from 'react'
import { MarkdownRenderer } from '@/components/sandbox/MarkdownRenderer'
import { cn } from '@/lib/utils/cn'

interface MarkdownEditorProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
  height?: string
}

export function MarkdownEditor({
  value,
  onChange,
  placeholder = '마크다운으로 작성하세요...',
  height = '400px',
}: MarkdownEditorProps) {
  const [activeTab, setActiveTab] = useState<'edit' | 'preview'>('edit')

  return (
    <div className="rounded-xl border border-border overflow-hidden">
      {/* 탭 헤더 */}
      <div className="flex border-b border-border bg-muted/50">
        <button
          type="button"
          onClick={() => setActiveTab('edit')}
          className={cn(
            'px-4 py-2 text-sm font-medium transition-colors',
            activeTab === 'edit'
              ? 'bg-background text-foreground border-b-2 border-primary -mb-[1px]'
              : 'text-muted-foreground hover:text-foreground'
          )}
        >
          편집
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('preview')}
          className={cn(
            'px-4 py-2 text-sm font-medium transition-colors',
            activeTab === 'preview'
              ? 'bg-background text-foreground border-b-2 border-primary -mb-[1px]'
              : 'text-muted-foreground hover:text-foreground'
          )}
        >
          미리보기
        </button>
      </div>

      {/* 콘텐츠 영역 */}
      <div style={{ height }}>
        {activeTab === 'edit' ? (
          <textarea
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder}
            className="w-full h-full p-4 resize-none font-mono text-sm bg-background focus:outline-none"
          />
        ) : (
          <div className="p-4 h-full overflow-y-auto">
            {value ? (
              <MarkdownRenderer content={value} />
            ) : (
              <p className="text-muted-foreground italic">미리볼 내용이 없습니다</p>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
