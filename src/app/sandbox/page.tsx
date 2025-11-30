'use client'

import { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { Header } from '@/components/layout/Header'
import { ConversationList } from '@/components/sandbox/ConversationList'
import { ChatInterface } from '@/components/sandbox/ChatInterface'
import { useSandbox } from '@/lib/hooks/useSandbox'
import { useAuth } from '@/components/auth/AuthProvider'
import {
  getConversations,
  createConversation,
  deleteConversation,
} from '@/lib/actions/sandbox'
import type { ConversationWithPreview } from '@/lib/types/sandbox'
import { Menu, X, PanelLeft } from 'lucide-react'
import { cn } from '@/lib/utils/cn'

export default function SandboxPage() {
  const { user, loading: authLoading } = useAuth()
  const router = useRouter()
  const [conversations, setConversations] = useState<ConversationWithPreview[]>([])
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [isCreating, setIsCreating] = useState(false)
  const [isSidebarOpen, setIsSidebarOpen] = useState(true)
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false)
  const [inputValue, setInputValue] = useState('')

  const { messages, isLoading, isStreaming, usage, sendMessage, stopStreaming } =
    useSandbox({ conversationId: selectedId })

  // 메시지 전송 핸들러 (대화 없으면 자동 생성)
  const handleSend = useCallback(async () => {
    if (!inputValue.trim()) return

    const message = inputValue.trim()
    setInputValue('')

    // 선택된 대화가 없으면 새로 생성
    if (!selectedId) {
      setIsCreating(true)
      const conversation = await createConversation()
      if (conversation) {
        setConversations((prev) => [conversation, ...prev])
        setSelectedId(conversation.id)
        // conversationId를 직접 전달하여 클로저 문제 해결
        sendMessage(message, conversation.id)
      }
      setIsCreating(false)
    } else {
      sendMessage(message)
    }
  }, [inputValue, sendMessage, selectedId])

  // 로그인 확인
  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/?login=required&next=/sandbox')
    }
  }, [user, authLoading, router])

  // 대화 목록 로드
  useEffect(() => {
    if (!user) return

    const loadConversations = async () => {
      const data = await getConversations()
      setConversations(data)

      // 첫 번째 대화 자동 선택 (옵션 - 빈 상태로 시작하려면 주석 처리)
      // if (data.length > 0 && !selectedId) {
      //   setSelectedId(data[0].id)
      // }
    }

    loadConversations()
  }, [user])

  // 대화 생성
  const handleCreate = async () => {
    setIsCreating(true)
    const conversation = await createConversation()
    if (conversation) {
      setConversations((prev) => [conversation, ...prev])
      setSelectedId(conversation.id)
      setIsMobileSidebarOpen(false)
    }
    setIsCreating(false)
  }

  // 대화 삭제
  const handleDelete = async (id: string) => {
    const success = await deleteConversation(id)
    if (success) {
      setConversations((prev) => prev.filter((c) => c.id !== id))
      if (selectedId === id) {
        const remaining = conversations.filter((c) => c.id !== id)
        setSelectedId(remaining.length > 0 ? remaining[0].id : null)
      }
    }
  }

  // 대화 선택
  const handleSelect = (id: string) => {
    setSelectedId(id)
    setIsMobileSidebarOpen(false)
  }

  // 새 대화 시작 (선택 해제)
  const handleNewChat = () => {
    setSelectedId(null)
    setIsMobileSidebarOpen(false)
  }

  if (authLoading) {
    return (
      <div className="flex min-h-screen flex-col bg-background">
        <Header />
        <main className="flex flex-1 items-center justify-center">
          <div className="h-10 w-10 animate-spin rounded-full border-3 border-primary border-t-transparent" />
        </main>
      </div>
    )
  }

  if (!user) {
    return null
  }

  return (
    <div className="flex h-screen flex-col bg-background">
      <Header />

      <main className="relative flex flex-1 overflow-hidden">
        {/* 모바일 사이드바 오버레이 */}
        {isMobileSidebarOpen && (
          <div
            className="fixed inset-0 z-20 bg-black/50 backdrop-blur-sm lg:hidden"
            onClick={() => setIsMobileSidebarOpen(false)}
          />
        )}

        {/* 사이드바 */}
        <aside
          className={cn(
            'absolute inset-y-0 left-0 z-20 w-72 border-r border-border bg-card',
            'transition-transform duration-300 ease-in-out',
            // 모바일
            'lg:relative lg:z-0',
            isMobileSidebarOpen ? 'translate-x-0' : '-translate-x-full',
            // 데스크톱
            isSidebarOpen ? 'lg:translate-x-0' : 'lg:-translate-x-full lg:absolute'
          )}
        >
          <ConversationList
            conversations={conversations}
            selectedId={selectedId}
            onSelect={handleSelect}
            onCreate={handleCreate}
            onDelete={handleDelete}
            onClose={() => setIsSidebarOpen(false)}
            isCreating={isCreating}
          />
        </aside>

        {/* 메인 채팅 영역 */}
        <div className={cn(
          'relative flex flex-1 flex-col min-w-0',
          'transition-all duration-300 ease-in-out'
        )}>
          {/* 사이드바 열기 버튼 (데스크톱 - 사이드바 닫혔을 때) */}
          {!isSidebarOpen && (
            <button
              onClick={() => setIsSidebarOpen(true)}
              className={cn(
                'absolute left-4 top-4 z-10 hidden lg:flex',
                'h-9 w-9 items-center justify-center rounded-lg',
                'bg-card border border-border shadow-sm',
                'text-muted-foreground hover:text-foreground hover:bg-muted',
                'transition-all duration-200'
              )}
            >
              <PanelLeft className="h-4 w-4" />
            </button>
          )}

          {/* 모바일 메뉴 버튼 */}
          <button
            onClick={() => setIsMobileSidebarOpen(!isMobileSidebarOpen)}
            className={cn(
              'absolute left-4 top-4 z-10 lg:hidden',
              'h-9 w-9 flex items-center justify-center rounded-lg',
              'bg-card border border-border shadow-sm',
              'text-muted-foreground hover:text-foreground hover:bg-muted',
              'transition-all duration-200'
            )}
          >
            {isMobileSidebarOpen ? (
              <X className="h-4 w-4" />
            ) : (
              <Menu className="h-4 w-4" />
            )}
          </button>

          <ChatInterface
            messages={messages}
            inputValue={inputValue}
            onInputChange={setInputValue}
            onSend={handleSend}
            onStop={stopStreaming}
            isLoading={isLoading || isCreating}
            isStreaming={isStreaming}
            usage={usage}
            placeholder={selectedId ? "AI에게 무엇이든 물어보세요..." : "메시지를 입력하면 새 대화가 시작됩니다..."}
          />
        </div>
      </main>
    </div>
  )
}
