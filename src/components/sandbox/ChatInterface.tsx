'use client'

import { useRef, useEffect, KeyboardEvent } from 'react'
import { Send, Square, AlertCircle, Loader2 } from 'lucide-react'
import { cn } from '@/lib/utils/cn'
import { MessageBubble, TypingIndicator } from './MessageBubble'
import { WelcomeScreen } from './WelcomeScreen'
import type { Message, SandboxUsage } from '@/lib/types/lesson'

interface ChatInterfaceProps {
  messages: Message[]
  inputValue: string
  onInputChange: (value: string) => void
  onSend: () => void
  onStop?: () => void
  isLoading: boolean
  isLoadingMessages?: boolean
  isStreaming: boolean
  usage: SandboxUsage
  error?: string
  disabled?: boolean
  placeholder?: string
}

export function ChatInterface({
  messages,
  inputValue,
  onInputChange,
  onSend,
  onStop,
  isLoading,
  isLoadingMessages = false,
  isStreaming,
  usage,
  error,
  disabled,
  placeholder = 'AI에게 질문해보세요...',
}: ChatInterfaceProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  // 메시지 추가 시 스크롤
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  // textarea 자동 높이 조절
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto'
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 200)}px`
    }
  }, [inputValue])

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      if (!isLoading && !isExhausted && inputValue.trim()) {
        onSend()
      }
    }
  }

  const handlePromptClick = (prompt: string) => {
    onInputChange(prompt)
    // 입력 후 포커스
    setTimeout(() => textareaRef.current?.focus(), 100)
  }

  const isExhausted = usage.count >= usage.limit
  const resetTime = formatResetTime(usage.resetAt)

  return (
    <div className="flex h-full flex-col">
      {/* 메시지 영역 */}
      <div className="flex-1 overflow-y-auto">
        {isLoadingMessages && messages.length === 0 ? (
          <div className="mx-auto max-w-3xl space-y-6 p-4 pb-32">
            {/* 사용자 메시지 스켈레톤 */}
            <div className="flex justify-end">
              <div className="max-w-[85%] space-y-2">
                <div className="h-4 w-48 animate-pulse rounded bg-muted ml-auto" />
                <div className="h-4 w-32 animate-pulse rounded bg-muted ml-auto" />
              </div>
            </div>
            {/* AI 응답 스켈레톤 */}
            <div className="flex justify-start">
              <div className="max-w-[85%] space-y-2">
                <div className="h-4 w-64 animate-pulse rounded bg-muted" />
                <div className="h-4 w-56 animate-pulse rounded bg-muted" />
                <div className="h-4 w-48 animate-pulse rounded bg-muted" />
              </div>
            </div>
            {/* 사용자 메시지 스켈레톤 */}
            <div className="flex justify-end">
              <div className="max-w-[85%] space-y-2">
                <div className="h-4 w-40 animate-pulse rounded bg-muted ml-auto" />
              </div>
            </div>
            {/* AI 응답 스켈레톤 */}
            <div className="flex justify-start">
              <div className="max-w-[85%] space-y-2">
                <div className="h-4 w-72 animate-pulse rounded bg-muted" />
                <div className="h-4 w-64 animate-pulse rounded bg-muted" />
              </div>
            </div>
          </div>
        ) : messages.length === 0 ? (
          <WelcomeScreen onPromptClick={handlePromptClick} />
        ) : (
          <div className="mx-auto max-w-3xl space-y-6 p-4 pb-32">
            {messages.map((message, index) => (
              <MessageBubble
                key={message.id}
                message={message}
                isStreaming={isStreaming && index === messages.length - 1 && message.role === 'assistant'}
              />
            ))}

            {isLoading && !isStreaming && <TypingIndicator />}

            <div ref={messagesEndRef} />
          </div>
        )}
      </div>

      {/* 하단 고정 입력 영역 */}
      <div className="bg-gradient-to-t from-background via-background to-transparent">
        <div className="mx-auto max-w-3xl px-4 pb-4 pt-2">
          {/* 에러 메시지 */}
          {error && (
            <div className="mb-3 flex items-center gap-2 rounded bg-destructive/10 px-4 py-3 text-sm text-destructive">
              <AlertCircle className="h-4 w-4 shrink-0" />
              {error}
            </div>
          )}

          {/* 소진 메시지 */}
          {isExhausted && (
            <div className="mb-3 rounded bg-amber-500/10 px-4 py-3 text-sm text-amber-600 dark:text-amber-400">
              오늘 사용량을 모두 소진했습니다. {resetTime}에 초기화됩니다.
            </div>
          )}

          {/* 입력 영역 */}
          <div className={cn(
            'relative rounded border border-border/50 bg-card p-3',
            'transition-all duration-200',
            'focus-within:border-primary focus-within:shadow-[0_0_0_2px_rgba(88,204,2,0.25)]',
            disabled && 'opacity-50'
          )}>
            {/* 텍스트 입력 */}
            <textarea
              ref={textareaRef}
              value={inputValue}
              onChange={(e) => onInputChange(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={placeholder}
              disabled={disabled || isExhausted}
              rows={1}
              className={cn(
                'w-full resize-none bg-transparent px-1 py-1 text-sm',
                'placeholder:text-muted-foreground',
                'focus:outline-none focus-visible:outline-none outline-none',
                'disabled:cursor-not-allowed',
                '[&:focus-visible]:outline-none [&:focus-visible]:ring-0'
              )}
            />

            {/* 하단 툴바: 사용량 + 전송 버튼 */}
            <div className="mt-2 flex items-center justify-between">
              {/* 사용량 표시 */}
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <div className="h-1.5 w-16 overflow-hidden rounded-full bg-muted">
                  <div
                    className={cn(
                      'h-full rounded-full transition-all',
                      usage.count >= usage.limit ? 'bg-destructive' : 'bg-primary'
                    )}
                    style={{ width: `${Math.min((usage.count / usage.limit) * 100, 100)}%` }}
                  />
                </div>
                <span>{usage.count}/{usage.limit}</span>
              </div>

              {/* 전송/중지 버튼 */}
              {isStreaming && onStop ? (
                <button
                  onClick={onStop}
                  className="flex h-8 w-8 items-center justify-center rounded bg-destructive text-destructive-foreground transition-colors hover:bg-destructive/90"
                >
                  <Square className="h-4 w-4" />
                </button>
              ) : (
                <button
                  onClick={onSend}
                  disabled={!inputValue.trim() || isLoading || isExhausted || disabled}
                  className={cn(
                    'flex h-8 w-8 items-center justify-center rounded transition-all',
                    'disabled:cursor-not-allowed disabled:opacity-40',
                    inputValue.trim() && !isLoading && !isExhausted
                      ? 'bg-primary text-primary-foreground hover:bg-primary/90 shadow-md shadow-primary/20'
                      : 'bg-muted text-muted-foreground'
                  )}
                >
                  {isLoading ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Send className="h-4 w-4" />
                  )}
                </button>
              )}
            </div>
          </div>

          {/* 하단 힌트 */}
          <p className="mt-2 text-center text-xs text-muted-foreground/70">
            Enter로 전송 • Shift+Enter로 줄바꿈
          </p>
        </div>
      </div>
    </div>
  )
}

// 초기화 시간 포맷
function formatResetTime(resetAt: string): string {
  const reset = new Date(resetAt)
  const now = new Date()
  const diff = reset.getTime() - now.getTime()

  if (diff <= 0) return '곧'

  const hours = Math.floor(diff / (1000 * 60 * 60))
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))

  if (hours > 0) {
    return `${hours}시간 ${minutes}분 후`
  }
  return `${minutes}분 후`
}
