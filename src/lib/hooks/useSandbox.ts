'use client'

import { useState, useCallback, useRef, useEffect } from 'react'
import type { SandboxUsage } from '@/lib/types/sandbox'
import type { Message as UIMessage } from '@/lib/types/lesson'

interface UseSandboxOptions {
  conversationId: string | null
}

export function useSandbox({ conversationId }: UseSandboxOptions) {
  const [messages, setMessages] = useState<UIMessage[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [isStreaming, setIsStreaming] = useState(false)
  const [usage, setUsage] = useState<SandboxUsage>({ count: 0, limit: 20, resetAt: '' })
  const abortControllerRef = useRef<AbortController | null>(null)
  const skipLoadRef = useRef(false)

  const fetchUsage = useCallback(async () => {
    try {
      const res = await fetch('/api/chat')
      if (res.ok) {
        const data = await res.json()
        setUsage(data)
        return data as SandboxUsage
      }
      // 429 응답은 상위에서 처리
    } catch {
      // 네트워크 오류 시 이전 값을 유지
    }
    return null
  }, [])

  // 새 대화 생성 전 호출하여 로드 스킵 플래그 미리 설정
  const prepareForNewConversation = useCallback(() => {
    skipLoadRef.current = true
  }, [])

  // 대화 변경 시 메시지 로드
  useEffect(() => {
    if (!conversationId) {
      setMessages([])
      return
    }

    // 새 대화 생성 직후 첫 메시지 전송 시 로드 스킵 (race condition 방지)
    if (skipLoadRef.current) {
      skipLoadRef.current = false
      return
    }

    const loadMessages = async () => {
      setIsLoading(true)
      try {
        const res = await fetch(`/api/sandbox/messages?conversationId=${conversationId}`)
        if (!res.ok) {
          throw new Error('메시지를 불러오지 못했습니다.')
        }
        const dbMessages = await res.json()
        setMessages(
          dbMessages.map((m: { id: string; role: 'user' | 'assistant'; content: string; created_at: string }) => ({
            id: m.id,
            role: m.role,
            content: m.content,
            timestamp: new Date(m.created_at).getTime(),
          }))
        )
      } catch (error) {
        console.error(error)
      } finally {
        setIsLoading(false)
      }
    }

    loadMessages()
  }, [conversationId])

  // 사용량 로드
  useEffect(() => {
    fetchUsage()
  }, [fetchUsage])

  const sendMessage = useCallback(
    async (content: string, overrideConversationId?: string) => {
      const targetConversationId = overrideConversationId || conversationId
      if (!targetConversationId || !content.trim() || isStreaming) return

      const latestUsage = await fetchUsage()
      const effectiveUsage = latestUsage || usage
      if (effectiveUsage.count >= effectiveUsage.limit) {
        setUsage(effectiveUsage)
        return
      }

      // 새 대화 생성 직후 첫 메시지 전송 시 로드 스킵 플래그 설정
      if (overrideConversationId) {
        skipLoadRef.current = true
      }

      // 사용자 메시지 추가
      const userMessage: UIMessage = {
        id: `user-${Date.now()}`,
        role: 'user',
        content,
        timestamp: Date.now(),
      }
      setMessages((prev) => [...prev, userMessage])

      // DB에 사용자 메시지 저장 (스트리밍과 병렬 처리)
      let userMessageSaved = false
      const userMessagePromise = fetch('/api/sandbox/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ conversationId: targetConversationId, role: 'user', content }),
      })
        .then((res) => {
          if (!res.ok) throw new Error('Failed to save user message')
          userMessageSaved = true
        })
        .catch((error) => {
          console.error('Failed to save user message:', error)
        })

      // AI 응답 준비
      const assistantMessage: UIMessage = {
        id: `assistant-${Date.now()}`,
        role: 'assistant',
        content: '',
        timestamp: Date.now(),
      }
      setMessages((prev) => [...prev, assistantMessage])
      setIsStreaming(true)

      // 스트리밍 요청
      abortControllerRef.current = new AbortController()

      try {
        // API는 message와 conversationHistory를 기대함
        const conversationHistory = messages.map((m) => ({
          role: m.role,
          content: m.content,
        }))

        const response = await fetch('/api/chat', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            message: content,
            conversationHistory,
          }),
          signal: abortControllerRef.current.signal,
        })

        if (!response.ok) {
          if (response.status === 429) {
            const data = await response.json()
            setUsage((prev) => ({
              count: data?.count ?? prev.count,
              limit: data?.limit ?? prev.limit,
              resetAt: data?.resetAt ?? prev.resetAt,
            }))
            throw new Error(data?.error || '오늘 사용량을 모두 소진했습니다.')
          }
          throw new Error('응답을 받을 수 없습니다')
        }

        const reader = response.body?.getReader()
        if (!reader) throw new Error('스트리밍을 시작할 수 없습니다')

        const decoder = new TextDecoder()
        let fullContent = ''
        let isFirstChunk = true

        while (true) {
          const { done, value } = await reader.read()
          if (done) break

          const chunk = decoder.decode(value, { stream: true })
          const lines = chunk.split('\n')

          for (const line of lines) {
            if (line.startsWith('data: ')) {
              const data = line.slice(6)
              if (data === '[DONE]') continue

              try {
                const parsed = JSON.parse(data)
                if (parsed.text) {
                  fullContent += parsed.text
                  setMessages((prev) => {
                    const updated = [...prev]
                    const lastIdx = updated.length - 1
                    if (updated[lastIdx]?.role === 'assistant') {
                      updated[lastIdx] = {
                        ...updated[lastIdx],
                        content: fullContent,
                      }
                    }
                    return updated
                  })
                }

                // 첫 청크에서 제목 생성
                if (isFirstChunk && messages.length === 0) {
                  isFirstChunk = false
                  generateTitle(targetConversationId, content)
                }
              } catch {
                // JSON 파싱 실패 무시
              }
            }
          }
        }

        // DB에 어시스턴트 메시지 저장
        if (fullContent) {
          if (!userMessageSaved) {
            await userMessagePromise
          }
          await fetch('/api/sandbox/messages', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ conversationId: targetConversationId, role: 'assistant', content: fullContent }),
          })
        }

        // 사용량 업데이트 (서버 값 기준으로 동기화)
        await fetchUsage()
      } catch (error) {
        if ((error as Error).name === 'AbortError') {
          // 사용자가 중단함
        } else {
          console.error('Chat error:', error)
          setMessages((prev) => {
            const updated = [...prev]
            const lastIdx = updated.length - 1
            if (updated[lastIdx]?.role === 'assistant') {
              updated[lastIdx] = {
                ...updated[lastIdx],
                content: '죄송합니다. 오류가 발생했습니다. 다시 시도해주세요.',
              }
            }
            return updated
          })
        }
      } finally {
        setIsStreaming(false)
        abortControllerRef.current = null
        if (!userMessageSaved) {
          await userMessagePromise
        }
      }
    },
    [conversationId, messages, isStreaming, usage]
  )

  const stopStreaming = useCallback(() => {
    abortControllerRef.current?.abort()
    setIsStreaming(false)
  }, [])

  return {
    messages,
    isLoading,
    isStreaming,
    usage,
    sendMessage,
    stopStreaming,
    prepareForNewConversation,
  }
}

// 제목 자동 생성
async function generateTitle(conversationId: string, firstMessage: string) {
  try {
    const response = await fetch('/api/generate-title', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message: firstMessage }),
    })

    if (response.ok) {
      const { title } = await response.json()
      if (title) {
        await fetch(`/api/sandbox/conversations/${conversationId}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ title }),
        })
      }
    }
  } catch {
    // 제목 생성 실패해도 무시
  }
}
