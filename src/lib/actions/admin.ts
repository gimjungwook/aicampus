'use server'

import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { checkAdminRole } from '@/lib/utils/admin'
import { revalidatePath } from 'next/cache'
import type {
  CategoryFormData,
  CourseFormData,
  ModuleFormData,
  LessonFormData,
  DashboardStats,
  AdminActionResult,
  Category,
  Course,
  Module,
  Lesson,
} from '@/lib/types/admin'

// ============ 권한 체크 헬퍼 ============

async function requireAdminAction() {
  if (!(await checkAdminRole())) {
    throw new Error('Unauthorized')
  }
  return createAdminClient()
}

// ============ DASHBOARD ============

export async function getDashboardStats(): Promise<DashboardStats> {
  const supabase = await requireAdminAction()

  const [courses, lessons, users, enrollments] = await Promise.all([
    supabase.from('courses').select('id', { count: 'exact', head: true }),
    supabase.from('lessons').select('id', { count: 'exact', head: true }),
    supabase.from('profiles').select('id', { count: 'exact', head: true }),
    supabase.from('user_enrollments').select('id', { count: 'exact', head: true }),
  ])

  return {
    totalCourses: courses.count || 0,
    totalLessons: lessons.count || 0,
    totalUsers: users.count || 0,
    totalEnrollments: enrollments.count || 0,
  }
}

// ============ CATEGORIES ============

export async function getAdminCategories(): Promise<Category[]> {
  const supabase = await requireAdminAction()

  const { data, error } = await supabase
    .from('categories')
    .select('*')
    .order('order_index', { ascending: true })

  if (error) throw new Error(error.message)
  return data || []
}

export async function createCategory(
  formData: CategoryFormData
): Promise<AdminActionResult<Category>> {
  try {
    const supabase = await requireAdminAction()

    const { data, error } = await supabase
      .from('categories')
      .insert(formData)
      .select()
      .single()

    if (error) throw new Error(error.message)

    revalidatePath('/admin/categories')
    revalidatePath('/courses')

    return { success: true, data }
  } catch (error) {
    return { success: false, error: (error as Error).message }
  }
}

export async function updateCategory(
  id: string,
  formData: Partial<CategoryFormData>
): Promise<AdminActionResult<Category>> {
  try {
    const supabase = await requireAdminAction()

    const { data, error } = await supabase
      .from('categories')
      .update(formData)
      .eq('id', id)
      .select()
      .single()

    if (error) throw new Error(error.message)

    revalidatePath('/admin/categories')
    revalidatePath('/courses')

    return { success: true, data }
  } catch (error) {
    return { success: false, error: (error as Error).message }
  }
}

export async function deleteCategory(id: string): Promise<AdminActionResult> {
  try {
    const supabase = await requireAdminAction()

    const { error } = await supabase.from('categories').delete().eq('id', id)

    if (error) throw new Error(error.message)

    revalidatePath('/admin/categories')
    revalidatePath('/courses')

    return { success: true }
  } catch (error) {
    return { success: false, error: (error as Error).message }
  }
}

export async function reorderCategories(
  categoryIds: string[]
): Promise<AdminActionResult> {
  try {
    const supabase = await requireAdminAction()

    for (let i = 0; i < categoryIds.length; i++) {
      const { error } = await supabase
        .from('categories')
        .update({ order_index: i })
        .eq('id', categoryIds[i])

      if (error) throw new Error(error.message)
    }

    revalidatePath('/admin/categories')
    revalidatePath('/courses')

    return { success: true }
  } catch (error) {
    return { success: false, error: (error as Error).message }
  }
}

// ============ COURSES ============

export async function getAdminCourses(): Promise<Course[]> {
  const supabase = await requireAdminAction()

  const { data, error } = await supabase
    .from('courses')
    .select('*, category:categories(*)')
    .order('created_at', { ascending: false })

  if (error) throw new Error(error.message)
  return data || []
}

export async function getAdminCourse(id: string): Promise<Course | null> {
  const supabase = await requireAdminAction()

  const { data, error } = await supabase
    .from('courses')
    .select('*, category:categories(*)')
    .eq('id', id)
    .single()

  if (error) return null
  return data
}

export async function createCourse(
  formData: CourseFormData
): Promise<AdminActionResult<Course>> {
  try {
    const supabase = await requireAdminAction()

    const { data, error } = await supabase
      .from('courses')
      .insert(formData)
      .select()
      .single()

    if (error) throw new Error(error.message)

    revalidatePath('/admin/courses')
    revalidatePath('/courses')

    return { success: true, data }
  } catch (error) {
    return { success: false, error: (error as Error).message }
  }
}

export async function updateCourse(
  id: string,
  formData: Partial<CourseFormData>
): Promise<AdminActionResult<Course>> {
  try {
    const supabase = await requireAdminAction()

    const { data, error } = await supabase
      .from('courses')
      .update(formData)
      .eq('id', id)
      .select()
      .single()

    if (error) throw new Error(error.message)

    revalidatePath('/admin/courses')
    revalidatePath(`/admin/courses/${id}`)
    revalidatePath('/courses')
    revalidatePath(`/courses/${id}`)

    return { success: true, data }
  } catch (error) {
    return { success: false, error: (error as Error).message }
  }
}

export async function deleteCourse(id: string): Promise<AdminActionResult> {
  try {
    const supabase = await requireAdminAction()

    const { error } = await supabase.from('courses').delete().eq('id', id)

    if (error) throw new Error(error.message)

    revalidatePath('/admin/courses')
    revalidatePath('/courses')

    return { success: true }
  } catch (error) {
    return { success: false, error: (error as Error).message }
  }
}

// ============ MODULES ============

export async function getModulesByCourse(courseId: string): Promise<Module[]> {
  const supabase = await requireAdminAction()

  const { data, error } = await supabase
    .from('modules')
    .select('*')
    .eq('course_id', courseId)
    .order('order_index', { ascending: true })

  if (error) throw new Error(error.message)
  return data || []
}

export async function createModule(
  courseId: string,
  formData: ModuleFormData
): Promise<AdminActionResult<Module>> {
  try {
    const supabase = await requireAdminAction()

    // 현재 모듈 수 조회하여 order_index 설정
    const { count } = await supabase
      .from('modules')
      .select('id', { count: 'exact', head: true })
      .eq('course_id', courseId)

    const { data, error } = await supabase
      .from('modules')
      .insert({
        ...formData,
        course_id: courseId,
        order_index: formData.order_index ?? (count || 0),
      })
      .select()
      .single()

    if (error) throw new Error(error.message)

    revalidatePath(`/admin/courses/${courseId}/modules`)
    revalidatePath(`/courses/${courseId}`)

    return { success: true, data }
  } catch (error) {
    return { success: false, error: (error as Error).message }
  }
}

export async function updateModule(
  id: string,
  formData: Partial<ModuleFormData>
): Promise<AdminActionResult<Module>> {
  try {
    const supabase = await requireAdminAction()

    const { data, error } = await supabase
      .from('modules')
      .update(formData)
      .eq('id', id)
      .select()
      .single()

    if (error) throw new Error(error.message)

    revalidatePath('/admin/courses')
    revalidatePath('/courses')

    return { success: true, data }
  } catch (error) {
    return { success: false, error: (error as Error).message }
  }
}

export async function deleteModule(id: string): Promise<AdminActionResult> {
  try {
    const supabase = await requireAdminAction()

    const { error } = await supabase.from('modules').delete().eq('id', id)

    if (error) throw new Error(error.message)

    revalidatePath('/admin/courses')
    revalidatePath('/courses')

    return { success: true }
  } catch (error) {
    return { success: false, error: (error as Error).message }
  }
}

export async function reorderModules(
  courseId: string,
  moduleIds: string[]
): Promise<AdminActionResult> {
  try {
    const supabase = await requireAdminAction()

    for (let i = 0; i < moduleIds.length; i++) {
      const { error } = await supabase
        .from('modules')
        .update({ order_index: i })
        .eq('id', moduleIds[i])

      if (error) throw new Error(error.message)
    }

    revalidatePath(`/admin/courses/${courseId}/modules`)
    revalidatePath(`/courses/${courseId}`)

    return { success: true }
  } catch (error) {
    return { success: false, error: (error as Error).message }
  }
}

// ============ LESSONS ============

export async function getLessonsByModule(moduleId: string): Promise<Lesson[]> {
  const supabase = await requireAdminAction()

  const { data, error } = await supabase
    .from('lessons')
    .select('*')
    .eq('module_id', moduleId)
    .order('order_index', { ascending: true })

  if (error) throw new Error(error.message)
  return data || []
}

export async function getAdminLesson(id: string): Promise<Lesson | null> {
  const supabase = await requireAdminAction()

  const { data, error } = await supabase
    .from('lessons')
    .select('*')
    .eq('id', id)
    .single()

  if (error) return null
  return data
}

export async function createLesson(
  moduleId: string,
  formData: LessonFormData
): Promise<AdminActionResult<Lesson>> {
  try {
    const supabase = await requireAdminAction()

    // 현재 레슨 수 조회하여 order_index 설정
    const { count } = await supabase
      .from('lessons')
      .select('id', { count: 'exact', head: true })
      .eq('module_id', moduleId)

    const { data, error } = await supabase
      .from('lessons')
      .insert({
        ...formData,
        module_id: moduleId,
        order_index: formData.order_index ?? (count || 0),
      })
      .select()
      .single()

    if (error) throw new Error(error.message)

    revalidatePath('/admin/courses')
    revalidatePath('/courses')

    return { success: true, data }
  } catch (error) {
    return { success: false, error: (error as Error).message }
  }
}

export async function updateLesson(
  id: string,
  formData: Partial<LessonFormData>
): Promise<AdminActionResult<Lesson>> {
  try {
    const supabase = await requireAdminAction()

    const { data, error } = await supabase
      .from('lessons')
      .update(formData)
      .eq('id', id)
      .select()
      .single()

    if (error) throw new Error(error.message)

    revalidatePath('/admin/courses')
    revalidatePath('/courses')
    revalidatePath(`/lesson/${id}`)

    return { success: true, data }
  } catch (error) {
    return { success: false, error: (error as Error).message }
  }
}

export async function deleteLesson(id: string): Promise<AdminActionResult> {
  try {
    const supabase = await requireAdminAction()

    const { error } = await supabase.from('lessons').delete().eq('id', id)

    if (error) throw new Error(error.message)

    revalidatePath('/admin/courses')
    revalidatePath('/courses')

    return { success: true }
  } catch (error) {
    return { success: false, error: (error as Error).message }
  }
}

export async function reorderLessons(
  moduleId: string,
  lessonIds: string[]
): Promise<AdminActionResult> {
  try {
    const supabase = await requireAdminAction()

    for (let i = 0; i < lessonIds.length; i++) {
      const { error } = await supabase
        .from('lessons')
        .update({ order_index: i })
        .eq('id', lessonIds[i])

      if (error) throw new Error(error.message)
    }

    revalidatePath('/admin/courses')
    revalidatePath('/courses')

    return { success: true }
  } catch (error) {
    return { success: false, error: (error as Error).message }
  }
}

// ============ IMAGE UPLOAD ============

export async function uploadContentImage(
  formData: FormData
): Promise<AdminActionResult<{ url: string }>> {
  try {
    const supabase = await requireAdminAction()

    const file = formData.get('image') as File
    if (!file) throw new Error('No file provided')

    const folder = (formData.get('folder') as string) || 'general'
    const fileName = `${folder}/${Date.now()}-${file.name.replace(/[^a-zA-Z0-9.-]/g, '_')}`

    const { error } = await supabase.storage.from('content').upload(fileName, file)

    if (error) throw new Error(error.message)

    const {
      data: { publicUrl },
    } = supabase.storage.from('content').getPublicUrl(fileName)

    return { success: true, data: { url: publicUrl } }
  } catch (error) {
    return { success: false, error: (error as Error).message }
  }
}

export async function deleteContentImage(
  url: string
): Promise<AdminActionResult> {
  try {
    const supabase = await requireAdminAction()

    // URL에서 파일 경로 추출
    const urlObj = new URL(url)
    const pathParts = urlObj.pathname.split('/content/')
    if (pathParts.length < 2) throw new Error('Invalid URL')

    const filePath = pathParts[1]

    const { error } = await supabase.storage.from('content').remove([filePath])

    if (error) throw new Error(error.message)

    return { success: true }
  } catch (error) {
    return { success: false, error: (error as Error).message }
  }
}
