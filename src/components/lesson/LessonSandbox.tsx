'use client'

import { Sparkles, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { ChatInterface } from '@/components/sandbox/ChatInterface'
import { useLessonSandbox } from '@/lib/hooks/useLessonSandbox'

interface LessonSandboxProps {
  lessonId: string
  lessonTitle?: string
}

export function LessonSandbox({ lessonId, lessonTitle }: LessonSandboxProps) {
  const {
    messages,
    inputValue,
    setInputValue,
    sendMessage,
    stopStreaming,
    clearMessages,
    isLoading,
    isStreaming,
    usage,
    error,
  } = useLessonSandbox({ lessonId })

  return (
    <div className="flex h-full flex-col rounded-sm border border-border bg-card">
      {/* 헤더 */}
      <div className="flex items-center justify-between border-b border-border px-4 py-3">
        <div className="flex items-center gap-2">
          <div className="rounded-full bg-primary/10 p-1.5">
            <Sparkles className="h-4 w-4 text-primary" />
          </div>
          <div>
            <h3 className="text-sm font-semibold">AI 샌드박스</h3>
            {lessonTitle && (
              <p className="text-xs text-muted-foreground line-clamp-1">
                {lessonTitle}
              </p>
            )}
          </div>
        </div>
        {messages.length > 0 && (
          <Button
            variant="ghost"
            size="sm"
            onClick={clearMessages}
            className="text-muted-foreground hover:text-destructive"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        )}
      </div>

      {/* 채팅 인터페이스 */}
      <div className="flex-1 overflow-hidden">
        <ChatInterface
          messages={messages}
          inputValue={inputValue}
          onInputChange={setInputValue}
          onSend={sendMessage}
          onStop={stopStreaming}
          isLoading={isLoading}
          isStreaming={isStreaming}
          usage={usage}
          error={error || undefined}
          placeholder="이 레슨에 대해 궁금한 점을 질문해보세요..."
        />
      </div>
    </div>
  )
}
