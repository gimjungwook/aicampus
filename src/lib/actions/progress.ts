'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

// 코스 수강 등록
export async function enrollCourse(courseId: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return { success: false, error: '로그인이 필요합니다' }
  }

  // 이미 등록되어 있는지 확인
  const { data: existing } = await supabase
    .from('user_enrollments')
    .select('id')
    .eq('user_id', user.id)
    .eq('course_id', courseId)
    .single()

  if (existing) {
    return { success: true, message: '이미 등록된 코스입니다' }
  }

  // 수강 등록
  const { error } = await supabase
    .from('user_enrollments')
    .insert({
      user_id: user.id,
      course_id: courseId,
    })

  if (error) {
    console.error('Error enrolling course:', error)
    return { success: false, error: '수강 등록에 실패했습니다' }
  }

  revalidatePath(`/courses/${courseId}`)
  revalidatePath('/courses')

  return { success: true }
}

// 레슨 완료 처리
export async function completeLesson(lessonId: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return { success: false, error: '로그인이 필요합니다' }
  }

  // upsert로 완료 처리
  const { error } = await supabase
    .from('lesson_progress')
    .upsert(
      {
        user_id: user.id,
        lesson_id: lessonId,
        completed: true,
        completed_at: new Date().toISOString(),
      },
      { onConflict: 'user_id,lesson_id' }
    )

  if (error) {
    console.error('Error completing lesson:', error)
    return { success: false, error: '레슨 완료 처리에 실패했습니다' }
  }

  // 레슨의 코스 ID 가져오기 (revalidate용)
  const { data: lesson } = await supabase
    .from('lessons')
    .select(`
      module_id,
      modules!inner(course_id)
    `)
    .eq('id', lessonId)
    .single()

  if (lesson && lesson.modules) {
    const modules = lesson.modules as unknown as { course_id: string }
    const courseId = modules.course_id
    revalidatePath(`/courses/${courseId}`)
  }

  return { success: true }
}

// 레슨 완료 취소
export async function uncompleteLesson(lessonId: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return { success: false, error: '로그인이 필요합니다' }
  }

  const { error } = await supabase
    .from('lesson_progress')
    .update({
      completed: false,
      completed_at: null,
    })
    .eq('user_id', user.id)
    .eq('lesson_id', lessonId)

  if (error) {
    console.error('Error uncompleting lesson:', error)
    return { success: false, error: '레슨 완료 취소에 실패했습니다' }
  }

  return { success: true }
}

// 코스 완료 처리
export async function completeCourse(courseId: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return { success: false, error: '로그인이 필요합니다' }
  }

  const { error } = await supabase
    .from('user_enrollments')
    .update({
      completed_at: new Date().toISOString(),
    })
    .eq('user_id', user.id)
    .eq('course_id', courseId)

  if (error) {
    console.error('Error completing course:', error)
    return { success: false, error: '코스 완료 처리에 실패했습니다' }
  }

  revalidatePath(`/courses/${courseId}`)
  revalidatePath('/courses')
  revalidatePath('/mypage')

  return { success: true }
}

// 첫 번째 미완료 레슨 찾기
export async function getNextLesson(courseId: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  // 모듈과 레슨 가져오기
  const { data: modules } = await supabase
    .from('modules')
    .select(`
      id,
      order_index,
      lessons(id, order_index)
    `)
    .eq('course_id', courseId)
    .order('order_index')

  if (!modules || modules.length === 0) {
    return null
  }

  // 모든 레슨 순서대로 정렬
  const allLessons = modules
    .sort((a, b) => a.order_index - b.order_index)
    .flatMap(m =>
      (m.lessons as { id: string; order_index: number }[])
        .sort((a, b) => a.order_index - b.order_index)
        .map(l => l.id)
    )

  if (!user) {
    // 비로그인: 첫 번째 레슨 반환
    return allLessons[0] || null
  }

  // 완료된 레슨 목록
  const { data: progress } = await supabase
    .from('lesson_progress')
    .select('lesson_id')
    .eq('user_id', user.id)
    .eq('completed', true)

  const completedSet = new Set(progress?.map(p => p.lesson_id) || [])

  // 첫 번째 미완료 레슨 찾기
  const nextLesson = allLessons.find(id => !completedSet.has(id))

  return nextLesson || allLessons[allLessons.length - 1] // 다 완료했으면 마지막 레슨
}
