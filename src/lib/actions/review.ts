'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import type { CourseReview, ReviewStats } from '@/lib/types/course'

// 리뷰 작성
export async function createReview(
  courseId: string,
  rating: number,
  content: string
): Promise<{ success: boolean; error?: string; review?: CourseReview }> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return { success: false, error: '로그인이 필요합니다.' }
  }

  // 현재 진도율 가져오기
  const progressPercent = await getUserProgressPercent(supabase, courseId, user.id)

  const { data, error } = await supabase
    .from('course_reviews')
    .insert({
      course_id: courseId,
      user_id: user.id,
      rating,
      content,
      progress_percent: progressPercent
    })
    .select()
    .single()

  if (error) {
    if (error.code === '23505') {
      return { success: false, error: '이미 리뷰를 작성하셨습니다.' }
    }
    return { success: false, error: error.message }
  }

  revalidatePath(`/courses/${courseId}`)
  return { success: true, review: data }
}

// 리뷰 수정
export async function updateReview(
  reviewId: string,
  rating: number,
  content: string
): Promise<{ success: boolean; error?: string }> {
  const supabase = await createClient()

  const { data: review, error: fetchError } = await supabase
    .from('course_reviews')
    .select('course_id')
    .eq('id', reviewId)
    .single()

  if (fetchError) {
    return { success: false, error: '리뷰를 찾을 수 없습니다.' }
  }

  const { error } = await supabase
    .from('course_reviews')
    .update({ rating, content })
    .eq('id', reviewId)

  if (error) {
    return { success: false, error: error.message }
  }

  revalidatePath(`/courses/${review.course_id}`)
  return { success: true }
}

// 리뷰 삭제
export async function deleteReview(
  reviewId: string
): Promise<{ success: boolean; error?: string }> {
  const supabase = await createClient()

  const { data: review, error: fetchError } = await supabase
    .from('course_reviews')
    .select('course_id')
    .eq('id', reviewId)
    .single()

  if (fetchError) {
    return { success: false, error: '리뷰를 찾을 수 없습니다.' }
  }

  const { error } = await supabase
    .from('course_reviews')
    .delete()
    .eq('id', reviewId)

  if (error) {
    return { success: false, error: error.message }
  }

  revalidatePath(`/courses/${review.course_id}`)
  return { success: true }
}

// 리뷰 목록 조회 (페이지네이션)
export async function getCourseReviews(
  courseId: string,
  page: number = 1,
  limit: number = 10
): Promise<{ reviews: CourseReview[]; total: number }> {
  const supabase = await createClient()
  const offset = (page - 1) * limit

  const { data, error, count } = await supabase
    .from('course_reviews')
    .select(`
      *,
      user:profiles(nickname, avatar_url),
      reply:review_replies(*)
    `, { count: 'exact' })
    .eq('course_id', courseId)
    .order('created_at', { ascending: false })
    .range(offset, offset + limit - 1)

  if (error) {
    console.error('Error fetching reviews:', error)
    return { reviews: [], total: 0 }
  }

  // reply 배열을 단일 객체로 변환
  const reviews = (data || []).map(review => ({
    ...review,
    reply: review.reply?.[0] || null
  }))

  return {
    reviews,
    total: count || 0
  }
}

// 리뷰 통계 조회
export async function getReviewStats(courseId: string): Promise<ReviewStats> {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('course_reviews')
    .select('rating')
    .eq('course_id', courseId)

  if (error || !data || data.length === 0) {
    return { avgRating: 0, reviewCount: 0 }
  }

  const avgRating = data.reduce((sum, r) => sum + r.rating, 0) / data.length

  return {
    avgRating: Math.round(avgRating * 10) / 10,
    reviewCount: data.length
  }
}

// 강사 답변 작성
export async function createReviewReply(
  reviewId: string,
  content: string
): Promise<{ success: boolean; error?: string }> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return { success: false, error: '로그인이 필요합니다.' }
  }

  const { error } = await supabase
    .from('review_replies')
    .insert({
      review_id: reviewId,
      user_id: user.id,
      content
    })

  if (error) {
    if (error.code === '23505') {
      return { success: false, error: '이미 답변이 존재합니다.' }
    }
    return { success: false, error: error.message }
  }

  revalidatePath('/courses/[id]', 'page')
  return { success: true }
}

// 강사 답변 수정
export async function updateReviewReply(
  replyId: string,
  content: string
): Promise<{ success: boolean; error?: string }> {
  const supabase = await createClient()

  const { error } = await supabase
    .from('review_replies')
    .update({ content })
    .eq('id', replyId)

  if (error) {
    return { success: false, error: error.message }
  }

  revalidatePath('/courses/[id]', 'page')
  return { success: true }
}

// 강사 답변 삭제
export async function deleteReviewReply(
  replyId: string
): Promise<{ success: boolean; error?: string }> {
  const supabase = await createClient()

  const { error } = await supabase
    .from('review_replies')
    .delete()
    .eq('id', replyId)

  if (error) {
    return { success: false, error: error.message }
  }

  revalidatePath('/courses/[id]', 'page')
  return { success: true }
}

// 리뷰 작성 가능 여부 확인
export async function canUserReview(courseId: string): Promise<{
  canReview: boolean
  reason?: string
  existingReview?: CourseReview
}> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return { canReview: false, reason: '로그인이 필요합니다.' }
  }

  // 수강 등록 확인
  const { data: enrollment } = await supabase
    .from('user_enrollments')
    .select('id')
    .eq('course_id', courseId)
    .eq('user_id', user.id)
    .single()

  if (!enrollment) {
    return { canReview: false, reason: '수강 등록 후 리뷰를 작성할 수 있습니다.' }
  }

  // 기존 리뷰 확인
  const { data: existingReview } = await supabase
    .from('course_reviews')
    .select('*')
    .eq('course_id', courseId)
    .eq('user_id', user.id)
    .single()

  if (existingReview) {
    return { canReview: false, reason: '이미 리뷰를 작성하셨습니다.', existingReview }
  }

  return { canReview: true }
}

// 유저 진도율 가져오기 (헬퍼 함수)
async function getUserProgressPercent(
  supabase: Awaited<ReturnType<typeof createClient>>,
  courseId: string,
  userId: string
): Promise<number> {
  // 코스의 모든 레슨 ID 가져오기
  const { data: modules } = await supabase
    .from('modules')
    .select('id')
    .eq('course_id', courseId)

  if (!modules || modules.length === 0) return 0

  const moduleIds = modules.map(m => m.id)

  const { data: lessons } = await supabase
    .from('lessons')
    .select('id')
    .in('module_id', moduleIds)

  if (!lessons || lessons.length === 0) return 0

  const lessonIds = lessons.map(l => l.id)

  // 완료한 레슨 수
  const { count } = await supabase
    .from('lesson_progress')
    .select('id', { count: 'exact', head: true })
    .eq('user_id', userId)
    .eq('completed', true)
    .in('lesson_id', lessonIds)

  return Math.round(((count || 0) / lessons.length) * 100)
}
