'use server'

import { createClient } from '@/lib/supabase/server'
import type { LessonContext, LessonWithDetails } from '@/lib/types/lesson'
import type { Lesson, Module } from '@/lib/types/course'
import { redirect } from 'next/navigation'

// 레슨 상세 정보 가져오기
export async function getLessonById(lessonId: string): Promise<LessonWithDetails | null> {
  const supabase = await createClient()

  const { data: lesson, error } = await supabase
    .from('lessons')
    .select(`
      *,
      module:modules(*)
    `)
    .eq('id', lessonId)
    .single()

  if (error || !lesson) {
    console.error('Error fetching lesson:', error)
    return null
  }

  return lesson as LessonWithDetails
}

// 레슨 컨텍스트 가져오기 (이전/다음 레슨 정보 포함)
export async function getLessonContext(lessonId: string): Promise<LessonContext | null> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return null
  }

  // 1. 현재 레슨 정보 가져오기
  const { data: lesson, error: lessonError } = await supabase
    .from('lessons')
    .select(`
      *,
      module:modules(*)
    `)
    .eq('id', lessonId)
    .single()

  if (lessonError || !lesson) {
    console.error('Error fetching lesson:', lessonError)
    return null
  }

  const module = lesson.module as Module

  // 2. 코스 정보 가져오기
  const { data: course, error: courseError } = await supabase
    .from('courses')
    .select('id, title')
    .eq('id', module.course_id)
    .single()

  if (courseError || !course) {
    console.error('Error fetching course:', courseError)
    return null
  }

  // 2-1. 해당 코스 수강 등록 여부 확인 (미등록 시 접근 차단)
  const { data: enrollment } = await supabase
    .from('user_enrollments')
    .select('id')
    .eq('user_id', user.id)
    .eq('course_id', course.id)
    .maybeSingle()

  if (!enrollment) {
    redirect(`/courses/${course.id}`)
  }

  // 3. 코스의 모든 모듈과 레슨 가져오기
  const { data: modules, error: modulesError } = await supabase
    .from('modules')
    .select(`
      id,
      order_index,
      lessons(id, order_index)
    `)
    .eq('course_id', course.id)
    .order('order_index')

  if (modulesError || !modules) {
    console.error('Error fetching modules:', modulesError)
    return null
  }

  // 4. 모든 레슨을 순서대로 정렬
  const allLessons: { id: string; moduleIndex: number; lessonIndex: number }[] = []
  modules.forEach((mod, moduleIdx) => {
    const sortedLessons = (mod.lessons as { id: string; order_index: number }[])
      .sort((a, b) => a.order_index - b.order_index)
    sortedLessons.forEach((les, lessonIdx) => {
      allLessons.push({
        id: les.id,
        moduleIndex: moduleIdx,
        lessonIndex: lessonIdx,
      })
    })
  })

  // 5. 현재 레슨의 인덱스 찾기
  const currentIndex = allLessons.findIndex((l) => l.id === lessonId)
  if (currentIndex === -1) {
    console.error('Lesson not found in course')
    return null
  }

  // 6. 이전/다음 레슨 정보
  const prevLessonInfo = currentIndex > 0 ? allLessons[currentIndex - 1] : null
  const nextLessonInfo = currentIndex < allLessons.length - 1 ? allLessons[currentIndex + 1] : null

  let prevLesson: Lesson | null = null
  let nextLesson: Lesson | null = null

  if (prevLessonInfo) {
    const { data } = await supabase
      .from('lessons')
      .select('*')
      .eq('id', prevLessonInfo.id)
      .single()
    prevLesson = data
  }

  if (nextLessonInfo) {
    const { data } = await supabase
      .from('lessons')
      .select('*')
      .eq('id', nextLessonInfo.id)
      .single()
    nextLesson = data
  }

  return {
    lesson: lesson as LessonWithDetails,
    prevLesson,
    nextLesson,
    module,
    courseId: course.id,
    courseTitle: course.title,
    isFirstLesson: currentIndex === 0,
    isLastLesson: currentIndex === allLessons.length - 1,
    totalLessonsInCourse: allLessons.length,
    currentLessonIndex: currentIndex,
  }
}

// 레슨 완료 상태 확인
export async function isLessonCompleted(lessonId: string): Promise<boolean> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) return false

  const { data } = await supabase
    .from('lesson_progress')
    .select('completed')
    .eq('user_id', user.id)
    .eq('lesson_id', lessonId)
    .single()

  return data?.completed || false
}

// 샌드박스 사용량 가져오기
export async function getSandboxUsage(lessonId: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return { count: 0, limit: 5, resetAt: '' }
  }

  const today = new Date().toISOString().split('T')[0]

  const { data } = await supabase
    .from('sandbox_usage')
    .select('count')
    .eq('user_id', user.id)
    .eq('lesson_id', lessonId)
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
    limit: 5,
    resetAt: tomorrow.toISOString(),
  }
}
