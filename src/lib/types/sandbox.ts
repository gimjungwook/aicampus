// 대화
export interface Conversation {
  id: string
  user_id: string
  title: string
  created_at: string
  updated_at: string
}

// 메시지
export interface Message {
  id: string
  conversation_id: string
  role: 'user' | 'assistant'
  content: string
  created_at: string
}

// 대화 + 마지막 메시지 미리보기
export interface ConversationWithPreview extends Conversation {
  lastMessage?: string
  messageCount?: number
}

// 샌드박스 사용량
export interface SandboxUsage {
  count: number
  limit: number
  resetAt: string
}
