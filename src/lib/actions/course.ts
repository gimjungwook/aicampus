'use server'

import { createClient } from '@/lib/supabase/server'
import type { Category, Course, CourseWithProgress, Lesson, CourseSectionImage } from '@/lib/types/course'

// 모든 카테고리 가져오기
export async function getCategories(): Promise<Category[]> {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('categories')
    .select('*')
    .order('order_index')

  if (error) {
    console.error('Error fetching categories:', error)
    return []
  }

  return data || []
}

// 난이도 정렬 순서 (기초 → 중급 → 고급)
const difficultyOrder = { beginner: 0, intermediate: 1, advanced: 2 }

// 모든 코스 가져오기 (카테고리 필터 포함)
export async function getCourses(categorySlug?: string): Promise<Course[]> {
  const supabase = await createClient()

  let query = supabase
    .from('courses')
    .select(`
      *,
      category:categories(*)
    `)

  // 카테고리 필터링
  if (categorySlug && categorySlug !== 'all') {
    // 먼저 카테고리 ID를 가져옴
    const { data: category } = await supabase
      .from('categories')
      .select('id')
      .eq('slug', categorySlug)
      .single()

    if (category) {
      query = query.eq('category_id', category.id)
    }
  }

  const { data, error } = await query

  if (error) {
    console.error('Error fetching courses:', error)
    return []
  }

  // 난이도 기준 정렬 (기초 → 중급 → 고급), 같은 난이도 내에서는 최신순
  const sorted = (data || []).sort((a, b) => {
    const diffA = difficultyOrder[a.difficulty as keyof typeof difficultyOrder] ?? 1
    const diffB = difficultyOrder[b.difficulty as keyof typeof difficultyOrder] ?? 1
    if (diffA !== diffB) return diffA - diffB
    return new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
  })

  return sorted
}

// 사용자 진도가 포함된 코스 목록 가져오기
export async function getCoursesWithProgress(
  categorySlug?: string
): Promise<CourseWithProgress[]> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  // 코스 가져오기
  const courses = await getCourses(categorySlug)

  if (courses.length === 0) return []

  if (!user) {
    // 비로그인 사용자: 진도 없이 반환
    return courses.map(course => ({
      ...course,
      enrollment: null,
      completedLessons: 0,
      progressPercent: 0,
    }))
  }

  const courseIds = courses.map((course) => course.id)

  // 사용자 수강 등록 정보 가져오기
  const { data: enrollments } = await supabase
    .from('user_enrollments')
    .select('*')
    .eq('user_id', user.id)

  // 사용자 레슨 진도 가져오기
  const { data: progress } = await supabase
    .from('lesson_progress')
    .select('lesson_id')
    .eq('user_id', user.id)
    .eq('completed', true)

  const completedLessonIds = new Set(progress?.map(p => p.lesson_id) || [])

  // 모든 모듈/레슨을 한 번에 가져와 N+1 및 빈 배열 .in() 오류 방지
  const { data: modulesData, error: modulesError } = await supabase
    .from('modules')
    .select('id, course_id')
    .in('course_id', courseIds)

  if (modulesError) {
    console.error('Error fetching modules:', modulesError)
  }

  const modulesByCourse = new Map<string, string[]>()
  const moduleIds: string[] = []
  modulesData?.forEach((m) => {
    modulesByCourse.set(m.course_id, [...(modulesByCourse.get(m.course_id) || []), m.id])
    moduleIds.push(m.id)
  })

  const lessonsByModule = new Map<string, string[]>()

  if (moduleIds.length > 0) {
    const { data: lessonsData, error: lessonsError } = await supabase
      .from('lessons')
      .select('id, module_id')
      .in('module_id', moduleIds)

    if (lessonsError) {
      console.error('Error fetching lessons:', lessonsError)
    }

    lessonsData?.forEach((lesson) => {
      lessonsByModule.set(
        lesson.module_id,
        [...(lessonsByModule.get(lesson.module_id) || []), lesson.id]
      )
    })
  }

  return courses.map(course => {
    const enrollment = enrollments?.find(e => e.course_id === course.id)
    const moduleIdsForCourse = modulesByCourse.get(course.id) || []
    const lessonIds = moduleIdsForCourse.flatMap((id) => lessonsByModule.get(id) || [])
    const completedCount = lessonIds.filter(id => completedLessonIds.has(id)).length
    const total = course.total_lessons || lessonIds.length

    return {
      ...course,
      enrollment: enrollment || null,
      completedLessons: completedCount,
      progressPercent: total > 0 ? Math.round((completedCount / total) * 100) : 0,
    }
  })
}

// 코스 상세 가져오기 (모듈, 레슨 포함)
export async function getCourseById(courseId: string) {
  const supabase = await createClient()

  const { data: course, error } = await supabase
    .from('courses')
    .select(`
      *,
      category:categories(*)
    `)
    .eq('id', courseId)
    .single()

  if (error || !course) {
    console.error('Error fetching course:', error)
    return null
  }

  // 모듈과 레슨 가져오기
  const { data: modules } = await supabase
    .from('modules')
    .select(`
      *,
      lessons(*)
    `)
    .eq('course_id', courseId)
    .order('order_index')

  // 각 모듈의 레슨 정렬
  const sortedModules = modules?.map(module => ({
    ...module,
    lessons: module.lessons?.sort((a: { order_index: number }, b: { order_index: number }) =>
      a.order_index - b.order_index
    ) || [],
  })) || []

  return {
    ...course,
    modules: sortedModules,
  }
}

// 코스 상세 + 사용자 진도 가져오기
export async function getCourseWithProgress(courseId: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const course = await getCourseById(courseId)

  if (!course) return null

  if (!user) {
    // 비로그인: 진도 정보 없이 반환
    return {
      ...course,
      enrollment: null,
      completedLessons: 0,
      progressPercent: 0,
      modules: course.modules.map((module: { lessons: Lesson[] }) => ({
        ...module,
        completedCount: 0,
        lessons: module.lessons.map((lesson: Lesson) => ({
          ...lesson,
          isCompleted: false,
          progress: null,
        })),
      })),
    }
  }

  // 수강 등록 확인
  const { data: enrollment } = await supabase
    .from('user_enrollments')
    .select('*')
    .eq('user_id', user.id)
    .eq('course_id', courseId)
    .single()

  // 레슨 진도 가져오기
  const { data: progressData } = await supabase
    .from('lesson_progress')
    .select('*')
    .eq('user_id', user.id)

  const progressMap = new Map(
    progressData?.map(p => [p.lesson_id, p]) || []
  )

  let totalCompleted = 0
  const modulesWithProgress = course.modules.map((module: { lessons: { id: string }[] }) => {
    let moduleCompleted = 0
    const lessonsWithProgress = module.lessons.map((lesson: { id: string }) => {
      const progress = progressMap.get(lesson.id)
      const isCompleted = progress?.completed || false
      if (isCompleted) {
        totalCompleted++
        moduleCompleted++
      }
      return {
        ...lesson,
        isCompleted,
        progress: progress || null,
      }
    })
    return {
      ...module,
      completedCount: moduleCompleted,
      lessons: lessonsWithProgress,
    }
  })

  const total = course.total_lessons ||
    course.modules.reduce((sum: number, m: { lessons: unknown[] }) => sum + m.lessons.length, 0)

  return {
    ...course,
    enrollment: enrollment || null,
    completedLessons: totalCompleted,
    progressPercent: total > 0 ? Math.round((totalCompleted / total) * 100) : 0,
    modules: modulesWithProgress,
  }
}

// ================================================
// Phase 13: 강의 상세 페이지 리디자인
// ================================================

// 코스 섹션 이미지 가져오기
export async function getCourseSectionImages(
  courseId: string
): Promise<Record<string, CourseSectionImage[]>> {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('course_section_images')
    .select('*')
    .eq('course_id', courseId)
    .order('order_index')

  if (error) {
    console.error('Error fetching section images:', error)
    return { intro: [], features: [], instructor: [] }
  }

  // 섹션 타입별로 그룹화
  const grouped: Record<string, CourseSectionImage[]> = {
    intro: [],
    features: [],
    instructor: [],
  }

  data?.forEach((image) => {
    if (grouped[image.section_type]) {
      grouped[image.section_type].push(image)
    }
  })

  return grouped
}

// 추천 코스 가져오기 (같은 카테고리 우선 + 인기순)
export async function getRecommendedCourses(
  courseId: string,
  categoryId: string | null,
  limit: number = 4
): Promise<Course[]> {
  const supabase = await createClient()

  // 1. 같은 카테고리의 다른 코스 가져오기
  let sameCategoryCourses: Course[] = []

  if (categoryId) {
    const { data } = await supabase
      .from('courses')
      .select(`
        *,
        category:categories(*)
      `)
      .eq('category_id', categoryId)
      .neq('id', courseId)
      .order('created_at', { ascending: false })
      .limit(limit)

    sameCategoryCourses = data || []
  }

  // 이미 충분한 경우 반환
  if (sameCategoryCourses.length >= limit) {
    return sameCategoryCourses.slice(0, limit)
  }

  // 2. 부족한 경우 다른 카테고리에서 추가
  const remainingCount = limit - sameCategoryCourses.length
  const excludeIds = [courseId, ...sameCategoryCourses.map(c => c.id)]

  const { data: otherCourses } = await supabase
    .from('courses')
    .select(`
      *,
      category:categories(*)
    `)
    .not('id', 'in', `(${excludeIds.join(',')})`)
    .order('created_at', { ascending: false })
    .limit(remainingCount)

  return [...sameCategoryCourses, ...(otherCourses || [])]
}
