import type { Lesson, Module } from './course'

// 채팅 메시지
export interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: number
}

// 샌드박스 사용량
export interface SandboxUsage {
  count: number
  limit: number
  resetAt: string
}

// 레슨 컨텍스트 (이전/다음 레슨 정보)
export interface LessonContext {
  lesson: LessonWithDetails
  prevLesson: Lesson | null
  nextLesson: Lesson | null
  module: Module
  courseId: string
  courseTitle: string
  isFirstLesson: boolean
  isLastLesson: boolean
  totalLessonsInCourse: number
  currentLessonIndex: number
}

// 상세 정보가 포함된 레슨
export interface LessonWithDetails extends Lesson {
  module?: Module
}

// 스트리밍 응답 청크
export interface StreamChunk {
  text?: string
  error?: string
}

// 채팅 요청
export interface ChatRequest {
  message: string
  conversationHistory?: Message[]
  lessonId?: string
}

// 채팅 응답 (에러 시)
export interface ChatErrorResponse {
  error: string
  resetAt?: string
  count?: number
  limit?: number
}
