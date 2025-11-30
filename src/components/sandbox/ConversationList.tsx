'use client'

import { useState } from 'react'
import { cn } from '@/lib/utils/cn'
import { Plus, MessageSquare, Trash2, Loader2, Sparkles, MoreHorizontal, PanelLeftClose } from 'lucide-react'
import type { ConversationWithPreview } from '@/lib/types/sandbox'

interface ConversationListProps {
  conversations: ConversationWithPreview[]
  selectedId: string | null
  onSelect: (id: string) => void
  onCreate: () => Promise<void>
  onDelete: (id: string) => Promise<void>
  onClose?: () => void
  isCreating?: boolean
}

export function ConversationList({
  conversations,
  selectedId,
  onSelect,
  onCreate,
  onDelete,
  onClose,
  isCreating = false,
}: ConversationListProps) {
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const [menuOpenId, setMenuOpenId] = useState<string | null>(null)

  const handleDelete = async (e: React.MouseEvent, id: string) => {
    e.stopPropagation()
    setDeletingId(id)
    setMenuOpenId(null)
    await onDelete(id)
    setDeletingId(null)
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffMs = now.getTime() - date.getTime()
    const diffMins = Math.floor(diffMs / 60000)
    const diffHours = Math.floor(diffMs / 3600000)
    const diffDays = Math.floor(diffMs / 86400000)

    if (diffMins < 1) return '방금 전'
    if (diffMins < 60) return `${diffMins}분 전`
    if (diffHours < 24) return `${diffHours}시간 전`
    if (diffDays < 7) return `${diffDays}일 전`
    return date.toLocaleDateString('ko-KR', { month: 'short', day: 'numeric' })
  }

  // 대화를 날짜별로 그룹화
  const groupedConversations = groupByDate(conversations)

  return (
    <div className="flex h-full flex-col bg-muted/30">
      {/* 헤더 */}
      <div className="flex items-center justify-between border-b border-border px-4 py-3">
        <div className="flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-primary" />
          <span className="font-semibold text-foreground">AI 샌드박스</span>
        </div>
        {onClose && (
          <button
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-lg text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
          >
            <PanelLeftClose className="h-4 w-4" />
          </button>
        )}
      </div>

      {/* 새 대화 버튼 */}
      <div className="p-3">
        <button
          onClick={onCreate}
          disabled={isCreating}
          className={cn(
            'flex w-full items-center justify-center gap-2 rounded-xl border border-dashed border-border py-3',
            'text-sm font-medium text-muted-foreground',
            'transition-all duration-200',
            'hover:border-primary/50 hover:bg-primary/5 hover:text-primary',
            'disabled:cursor-not-allowed disabled:opacity-50'
          )}
        >
          {isCreating ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <>
              <Plus className="h-4 w-4" />
              새 대화
            </>
          )}
        </button>
      </div>

      {/* 대화 목록 */}
      <div className="flex-1 overflow-y-auto px-2 pb-4">
        {conversations.length === 0 ? (
          <div className="flex flex-col items-center justify-center px-4 py-12 text-center">
            <div className="mb-3 rounded-full bg-muted p-3">
              <MessageSquare className="h-6 w-6 text-muted-foreground/50" />
            </div>
            <p className="text-sm font-medium text-muted-foreground">
              대화가 없습니다
            </p>
            <p className="mt-1 text-xs text-muted-foreground/70">
              메시지를 입력하면 대화가 시작됩니다
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {Object.entries(groupedConversations).map(([dateLabel, convos]) => (
              <div key={dateLabel}>
                <p className="mb-2 px-2 text-xs font-medium text-muted-foreground/70">
                  {dateLabel}
                </p>
                <div className="space-y-1">
                  {convos.map((conversation) => (
                    <div key={conversation.id} className="group relative">
                      {/* 대화 선택 영역 */}
                      <div
                        role="button"
                        tabIndex={0}
                        onClick={() => onSelect(conversation.id)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' || e.key === ' ') {
                            e.preventDefault()
                            onSelect(conversation.id)
                          }
                        }}
                        className={cn(
                          'flex w-full cursor-pointer items-center gap-3 rounded-xl px-3 py-2.5 text-left',
                          'transition-all duration-150',
                          selectedId === conversation.id
                            ? 'bg-primary/10 text-foreground'
                            : 'hover:bg-muted text-muted-foreground hover:text-foreground'
                        )}
                      >
                        <MessageSquare className={cn(
                          'h-4 w-4 shrink-0 transition-colors',
                          selectedId === conversation.id ? 'text-primary' : ''
                        )} />
                        <div className="min-w-0 flex-1">
                          <p className="truncate text-sm font-medium">
                            {conversation.title}
                          </p>
                        </div>

                        {/* 더보기 메뉴 버튼 - div 안에 있지만 실제로는 별도 버튼 */}
                        <button
                          onClick={(e) => {
                            e.stopPropagation()
                            setMenuOpenId(menuOpenId === conversation.id ? null : conversation.id)
                          }}
                          className={cn(
                            'shrink-0 rounded-lg p-1.5 opacity-0 transition-all',
                            'hover:bg-muted-foreground/10',
                            'group-hover:opacity-100',
                            menuOpenId === conversation.id && 'opacity-100 bg-muted-foreground/10'
                          )}
                        >
                          <MoreHorizontal className="h-4 w-4" />
                        </button>
                      </div>

                      {/* 드롭다운 메뉴 */}
                      {menuOpenId === conversation.id && (
                        <>
                          <div
                            className="fixed inset-0 z-10"
                            onClick={() => setMenuOpenId(null)}
                          />
                          <div className="absolute right-2 top-full z-20 mt-1 rounded-xl border border-border bg-card p-1 shadow-lg">
                            <button
                              onClick={(e) => handleDelete(e, conversation.id)}
                              disabled={deletingId === conversation.id}
                              className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-destructive hover:bg-destructive/10 transition-colors"
                            >
                              {deletingId === conversation.id ? (
                                <Loader2 className="h-4 w-4 animate-spin" />
                              ) : (
                                <Trash2 className="h-4 w-4" />
                              )}
                              삭제
                            </button>
                          </div>
                        </>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

// 대화를 날짜별로 그룹화하는 헬퍼 함수
function groupByDate(conversations: ConversationWithPreview[]): Record<string, ConversationWithPreview[]> {
  const groups: Record<string, ConversationWithPreview[]> = {}
  const now = new Date()
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
  const yesterday = new Date(today.getTime() - 86400000)
  const lastWeek = new Date(today.getTime() - 7 * 86400000)

  conversations.forEach((conv) => {
    const date = new Date(conv.updated_at)
    const convDate = new Date(date.getFullYear(), date.getMonth(), date.getDate())

    let label: string
    if (convDate.getTime() >= today.getTime()) {
      label = '오늘'
    } else if (convDate.getTime() >= yesterday.getTime()) {
      label = '어제'
    } else if (convDate.getTime() >= lastWeek.getTime()) {
      label = '지난 7일'
    } else {
      label = date.toLocaleDateString('ko-KR', { year: 'numeric', month: 'long' })
    }

    if (!groups[label]) {
      groups[label] = []
    }
    groups[label].push(conv)
  })

  return groups
}
