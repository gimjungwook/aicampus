'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import type { Conversation, Message, ConversationWithPreview } from '@/lib/types/sandbox'

// 대화 목록 가져오기
export async function getConversations(): Promise<ConversationWithPreview[]> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) return []

  const { data, error } = await supabase
    .from('conversations')
    .select('*')
    .eq('user_id', user.id)
    .order('updated_at', { ascending: false })

  if (error) {
    console.error('Error fetching conversations:', error)
    return []
  }

  return data || []
}

// 대화 생성
export async function createConversation(): Promise<Conversation | null> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) return null

  const { data, error } = await supabase
    .from('conversations')
    .insert({ user_id: user.id, title: '새 대화' })
    .select()
    .single()

  if (error) {
    console.error('Error creating conversation:', error)
    return null
  }

  revalidatePath('/sandbox')
  return data
}

// 대화 삭제
export async function deleteConversation(conversationId: string): Promise<boolean> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) return false

  const { error } = await supabase
    .from('conversations')
    .delete()
    .eq('id', conversationId)
    .eq('user_id', user.id)

  if (error) {
    console.error('Error deleting conversation:', error)
    return false
  }

  revalidatePath('/sandbox')
  return true
}

// 대화 제목 업데이트
export async function updateConversationTitle(
  conversationId: string,
  title: string
): Promise<boolean> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) return false

  const { error } = await supabase
    .from('conversations')
    .update({ title })
    .eq('id', conversationId)
    .eq('user_id', user.id)

  if (error) {
    console.error('Error updating conversation title:', error)
    return false
  }

  revalidatePath('/sandbox')
  return true
}

// 메시지 목록 가져오기
export async function getMessages(conversationId: string): Promise<Message[]> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) return []

  // 해당 대화가 사용자의 것인지 확인
  const { data: conversation } = await supabase
    .from('conversations')
    .select('id')
    .eq('id', conversationId)
    .eq('user_id', user.id)
    .single()

  if (!conversation) return []

  const { data, error } = await supabase
    .from('messages')
    .select('*')
    .eq('conversation_id', conversationId)
    .order('created_at', { ascending: true })

  if (error) {
    console.error('Error fetching messages:', error)
    return []
  }

  return data || []
}

// 메시지 저장
export async function saveMessage(
  conversationId: string,
  role: 'user' | 'assistant',
  content: string
): Promise<Message | null> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) return null

  const { data, error } = await supabase
    .from('messages')
    .insert({ conversation_id: conversationId, role, content })
    .select()
    .single()

  if (error) {
    console.error('Error saving message:', error)
    return null
  }

  return data
}

// 독립 샌드박스 사용량 가져오기
export async function getIndependentSandboxUsage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return { count: 0, limit: 20, resetAt: '' }
  }

  const today = new Date().toISOString().split('T')[0]

  const { data } = await supabase
    .from('sandbox_usage')
    .select('count')
    .eq('user_id', user.id)
    .is('lesson_id', null)
    .eq('usage_date', today)
    .single()

  // KST 자정 계산
  const now = new Date()
  const kstOffset = 9 * 60 * 60 * 1000
  const kstNow = new Date(now.getTime() + kstOffset)
  const tomorrow = new Date(kstNow)
  tomorrow.setUTCHours(24, 0, 0, 0)

  return {
    count: data?.count || 0,
    limit: 20,
    resetAt: tomorrow.toISOString(),
  }
}
