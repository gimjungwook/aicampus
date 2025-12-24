'use client'

import { useState, useCallback } from 'react'
import { User, Sparkles, Copy, Check, RefreshCw } from 'lucide-react'
import { cn } from '@/lib/utils/cn'
import { MarkdownRenderer } from './MarkdownRenderer'
import type { Message } from '@/lib/types/lesson'

interface MessageBubbleProps {
  message: Message
  isStreaming?: boolean
  onRegenerate?: () => void
}

export function MessageBubble({ message, isStreaming, onRegenerate }: MessageBubbleProps) {
  const [copied, setCopied] = useState(false)
  const isUser = message.role === 'user'

  const handleCopy = useCallback(async () => {
    await navigator.clipboard.writeText(message.content)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }, [message.content])

  if (isUser) {
    return (
      <div className="flex justify-end animate-in fade-in slide-in-from-bottom-2 duration-300">
        <div className="flex max-w-[80%] items-start gap-3">
          <div className="rounded rounded-br-md bg-primary px-4 py-3 text-primary-foreground shadow-sm">
            <p className="whitespace-pre-wrap text-sm leading-relaxed">{message.content}</p>
          </div>
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/10">
            <User className="h-4 w-4 text-primary" />
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="group animate-in fade-in slide-in-from-bottom-2 duration-300">
      <div className="flex items-start gap-3">
        {/* AI 아바타 */}
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-primary/20 to-primary/5">
          <Sparkles className="h-4 w-4 text-primary" />
        </div>

        {/* 메시지 컨텐츠 */}
        <div className="flex-1 min-w-0">
          <div className="rounded rounded-tl-md bg-muted/50 px-4 py-3">
            <MarkdownRenderer content={message.content} />
            {isStreaming && (
              <span className="inline-block h-4 w-0.5 animate-pulse bg-primary ml-0.5" />
            )}
          </div>

          {/* 액션 버튼들 */}
          {!isStreaming && message.content && (
            <div className="mt-2 flex items-center gap-1 opacity-0 transition-opacity group-hover:opacity-100">
              <button
                onClick={handleCopy}
                className="flex items-center gap-1.5 rounded px-2.5 py-1.5 text-xs text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
              >
                {copied ? (
                  <>
                    <Check className="h-3.5 w-3.5 text-primary" />
                    <span className="text-primary">복사됨</span>
                  </>
                ) : (
                  <>
                    <Copy className="h-3.5 w-3.5" />
                    복사
                  </>
                )}
              </button>
              {onRegenerate && (
                <button
                  onClick={onRegenerate}
                  className="flex items-center gap-1.5 rounded px-2.5 py-1.5 text-xs text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
                >
                  <RefreshCw className="h-3.5 w-3.5" />
                  다시 생성
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

// 타이핑 인디케이터
export function TypingIndicator() {
  return (
    <div className="flex items-start gap-3 animate-in fade-in duration-300">
      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-primary/20 to-primary/5">
        <Sparkles className="h-4 w-4 text-primary" />
      </div>
      <div className="rounded rounded-tl-md bg-muted/50 px-4 py-3">
        <div className="flex items-center gap-1.5">
          <span className="h-2 w-2 animate-bounce rounded-full bg-primary/40 [animation-delay:-0.3s]" />
          <span className="h-2 w-2 animate-bounce rounded-full bg-primary/40 [animation-delay:-0.15s]" />
          <span className="h-2 w-2 animate-bounce rounded-full bg-primary/40" />
        </div>
      </div>
    </div>
  )
}
