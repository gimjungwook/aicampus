'use client'

import { useState, useCallback, useEffect, useRef } from 'react'
import type { Message, SandboxUsage } from '@/lib/types/lesson'

const STORAGE_KEY_PREFIX = 'sandbox_messages_'

interface UseLessonSandboxOptions {
  lessonId: string
}

interface UseLessonSandboxReturn {
  messages: Message[]
  inputValue: string
  setInputValue: (value: string) => void
  sendMessage: () => void
  stopStreaming: () => void
  clearMessages: () => void
  isLoading: boolean
  isStreaming: boolean
  usage: SandboxUsage
  error: string | null
}

export function useLessonSandbox({ lessonId }: UseLessonSandboxOptions): UseLessonSandboxReturn {
  const [messages, setMessages] = useState<Message[]>([])
  const [inputValue, setInputValue] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [isStreaming, setIsStreaming] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [usage, setUsage] = useState<SandboxUsage>({
    count: 0,
    limit: 5,
    resetAt: '',
  })

  const abortControllerRef = useRef<AbortController | null>(null)
  const storageKey = `${STORAGE_KEY_PREFIX}${lessonId}`

  // sessionStorage에서 메시지 로드
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const stored = sessionStorage.getItem(storageKey)
      if (stored) {
        try {
          setMessages(JSON.parse(stored))
        } catch {
          sessionStorage.removeItem(storageKey)
        }
      }
    }
  }, [storageKey])

  // 메시지 변경 시 sessionStorage에 저장
  useEffect(() => {
    if (typeof window !== 'undefined' && messages.length > 0) {
      sessionStorage.setItem(storageKey, JSON.stringify(messages))
    }
  }, [messages, storageKey])

  // 사용량 조회
  useEffect(() => {
    const fetchUsage = async () => {
      try {
        const res = await fetch(`/api/chat?lessonId=${lessonId}`)
        if (res.ok) {
          const data = await res.json()
          setUsage(data)
        }
      } catch {
        // 에러 무시, 기본값 사용
      }
    }

    fetchUsage()
  }, [lessonId])

  // 메시지 전송
  const sendMessage = useCallback(async () => {
    if (!inputValue.trim() || isLoading) return

    const userMessage: Message = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: inputValue.trim(),
      timestamp: Date.now(),
    }

    setMessages((prev) => [...prev, userMessage])
    setInputValue('')
    setIsLoading(true)
    setError(null)

    // AI 응답 메시지 placeholder
    const assistantMessage: Message = {
      id: `assistant-${Date.now()}`,
      role: 'assistant',
      content: '',
      timestamp: Date.now(),
    }

    setMessages((prev) => [...prev, assistantMessage])

    try {
      abortControllerRef.current = new AbortController()

      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: userMessage.content,
          conversationHistory: messages,
          lessonId,
        }),
        signal: abortControllerRef.current.signal,
      })

      if (!res.ok) {
        const errorData = await res.json()
        throw new Error(errorData.error || '요청 처리 중 오류가 발생했습니다.')
      }

      if (!res.body) {
        throw new Error('응답을 받을 수 없습니다.')
      }

      setIsStreaming(true)
      const reader = res.body.getReader()
      const decoder = new TextDecoder()
      let fullContent = ''

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
              if (parsed.error) {
                throw new Error(parsed.error)
              }
              if (parsed.text) {
                fullContent += parsed.text
                setMessages((prev) => {
                  const updated = [...prev]
                  const lastMsg = updated[updated.length - 1]
                  if (lastMsg.role === 'assistant') {
                    lastMsg.content = fullContent
                  }
                  return updated
                })
              }
            } catch {
              // JSON 파싱 실패 무시
            }
          }
        }
      }

      // 사용량 갱신
      setUsage((prev) => ({
        ...prev,
        count: prev.count + 1,
      }))
    } catch (err) {
      if ((err as Error).name === 'AbortError') {
        // 사용자가 중단함
        return
      }

      setError((err as Error).message)
      // 실패한 AI 메시지 제거
      setMessages((prev) => prev.slice(0, -1))
    } finally {
      setIsLoading(false)
      setIsStreaming(false)
      abortControllerRef.current = null
    }
  }, [inputValue, isLoading, messages, lessonId])

  // 스트리밍 중단
  const stopStreaming = useCallback(() => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort()
      setIsStreaming(false)
      setIsLoading(false)
    }
  }, [])

  // 대화 초기화
  const clearMessages = useCallback(() => {
    setMessages([])
    if (typeof window !== 'undefined') {
      sessionStorage.removeItem(storageKey)
    }
  }, [storageKey])

  return {
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
  }
}
