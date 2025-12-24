'use client'

import { Sparkles, Code, BookOpen, Lightbulb, ArrowRight } from 'lucide-react'
import { cn } from '@/lib/utils/cn'

interface WelcomeScreenProps {
  onPromptClick?: (prompt: string) => void
}

const suggestedPrompts = [
  {
    icon: Code,
    title: '코드 설명',
    prompt: '파이썬에서 리스트 컴프리헨션이 뭔지 쉽게 설명해줘',
    color: 'text-blue-500',
    bg: 'bg-blue-500/10',
  },
  {
    icon: BookOpen,
    title: '개념 학습',
    prompt: 'AI가 어떻게 학습하는지 비전공자도 이해할 수 있게 설명해줘',
    color: 'text-purple-500',
    bg: 'bg-purple-500/10',
  },
  {
    icon: Lightbulb,
    title: '실무 활용',
    prompt: '엑셀 업무를 자동화하는 방법을 알려줘',
    color: 'text-amber-500',
    bg: 'bg-amber-500/10',
  },
]

export function WelcomeScreen({ onPromptClick }: WelcomeScreenProps) {
  return (
    <div className="flex h-full flex-col items-center justify-center px-4">
      {/* 로고 및 인사말 */}
      <div className="mb-8 text-center">
        <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded bg-gradient-to-br from-primary/20 to-primary/5 shadow-lg shadow-primary/10">
          <Sparkles className="h-8 w-8 text-primary" />
        </div>
        <h1 className="mb-2 text-2xl font-bold text-foreground">
          안녕하세요!
        </h1>
        <p className="text-base text-muted-foreground">
          무엇이든 물어보세요. AI가 도와드릴게요.
        </p>
      </div>

      {/* 추천 프롬프트 */}
      <div className="w-full max-w-xl space-y-3">
        <p className="mb-4 text-center text-sm text-muted-foreground">
          이런 것들을 시도해보세요
        </p>
        {suggestedPrompts.map((item, index) => (
          <button
            key={index}
            onClick={() => onPromptClick?.(item.prompt)}
            className={cn(
              'group flex w-full items-center gap-4 rounded border border-border bg-card p-4',
              'transition-all duration-200',
              'hover:border-primary/30 hover:bg-primary/5 hover:shadow-md'
            )}
          >
            <div className={cn('rounded p-2.5', item.bg)}>
              <item.icon className={cn('h-5 w-5', item.color)} />
            </div>
            <div className="flex-1 text-left">
              <p className="text-sm font-medium text-foreground">{item.title}</p>
              <p className="text-sm text-muted-foreground line-clamp-1">
                {item.prompt}
              </p>
            </div>
            <ArrowRight className="h-4 w-4 text-muted-foreground opacity-0 transition-all group-hover:translate-x-1 group-hover:opacity-100" />
          </button>
        ))}
      </div>

      {/* 하단 힌트 */}
      <p className="mt-8 text-center text-xs text-muted-foreground/70">
        Enter로 전송 • Shift+Enter로 줄바꿈
      </p>
    </div>
  )
}
