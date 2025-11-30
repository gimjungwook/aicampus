'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import type { Profile, ProfileUpdateData, EnrolledCourseWithProgress } from '@/lib/types/user'

// 프로필 조회
export async function getProfile(): Promise<Profile | null> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) return null

  const { data: profile, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single()

  if (error) {
    // 프로필이 없으면 생성
    if (error.code === 'PGRST116') {
      const { data: newProfile } = await supabase
        .from('profiles')
        .insert({
          id: user.id,
          email: user.email!,
          nickname: user.user_metadata?.full_name || user.email?.split('@')[0],
          avatar_url: user.user_metadata?.avatar_url,
        })
        .select()
        .single()

      return newProfile
    }
    console.error('Error fetching profile:', error)
    return null
  }

  return profile
}

// 프로필 수정
export async function updateProfile(data: ProfileUpdateData): Promise<{ success: boolean; error?: string }> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return { success: false, error: '로그인이 필요합니다' }
  }

  const { error } = await supabase
    .from('profiles')
    .update({
      ...data,
      updated_at: new Date().toISOString(),
    })
    .eq('id', user.id)

  if (error) {
    console.error('Error updating profile:', error)
    return { success: false, error: '프로필 수정에 실패했습니다' }
  }

  revalidatePath('/mypage')
  return { success: true }
}

// 프로필 사진 업로드
export async function uploadAvatar(formData: FormData): Promise<{ success: boolean; url?: string; error?: string }> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return { success: false, error: '로그인이 필요합니다' }
  }

  const file = formData.get('avatar') as File
  if (!file) {
    return { success: false, error: '파일이 없습니다' }
  }

  // 파일 크기 체크 (2MB)
  if (file.size > 2 * 1024 * 1024) {
    return { success: false, error: '파일 크기는 2MB 이하여야 합니다' }
  }

  // 파일 형식 체크
  const allowedTypes = ['image/jpeg', 'image/png', 'image/webp']
  if (!allowedTypes.includes(file.type)) {
    return { success: false, error: 'JPG, PNG, WebP 형식만 허용됩니다' }
  }

  // 파일 이름 생성
  const fileExt = file.name.split('.').pop()
  const fileName = `${user.id}/avatar.${fileExt}`

  // 기존 파일 삭제 (에러 무시)
  await supabase.storage.from('avatars').remove([`${user.id}/avatar.jpg`, `${user.id}/avatar.png`, `${user.id}/avatar.webp`])

  // 업로드
  const { error: uploadError } = await supabase.storage
    .from('avatars')
    .upload(fileName, file, { upsert: true })

  if (uploadError) {
    console.error('Error uploading avatar:', uploadError)
    return { success: false, error: '파일 업로드에 실패했습니다' }
  }

  // 공개 URL 가져오기
  const { data: { publicUrl } } = supabase.storage
    .from('avatars')
    .getPublicUrl(fileName)

  // 프로필 업데이트
  const { error: updateError } = await supabase
    .from('profiles')
    .update({
      avatar_url: publicUrl,
      updated_at: new Date().toISOString(),
    })
    .eq('id', user.id)

  if (updateError) {
    console.error('Error updating avatar_url:', updateError)
    return { success: false, error: '프로필 업데이트에 실패했습니다' }
  }

  revalidatePath('/mypage')
  return { success: true, url: publicUrl }
}

// 계정 삭제
export async function deleteAccount(): Promise<{ success: boolean; error?: string }> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return { success: false, error: '로그인이 필요합니다' }
  }

  // 1. 프로필 삭제 (CASCADE로 다른 데이터도 삭제됨)
  const { error: profileError } = await supabase
    .from('profiles')
    .delete()
    .eq('id', user.id)

  if (profileError) {
    console.error('Error deleting profile:', profileError)
    return { success: false, error: '프로필 삭제에 실패했습니다' }
  }

  // 2. Storage에서 아바타 삭제
  await supabase.storage.from('avatars').remove([`${user.id}/avatar.jpg`, `${user.id}/avatar.png`, `${user.id}/avatar.webp`])

  // 3. 로그아웃
  await supabase.auth.signOut()

  return { success: true }
}

// 수강 중인 코스 목록 조회
export async function getEnrolledCourses(): Promise<EnrolledCourseWithProgress[]> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) return []

  // 수강 등록된 코스 조회
  const { data: enrollments, error } = await supabase
    .from('user_enrollments')
    .select(`
      enrolled_at,
      completed_at,
      courses (
        id,
        title,
        description,
        thumbnail_url,
        total_lessons,
        difficulty,
        categories (name)
      )
    `)
    .eq('user_id', user.id)
    .order('enrolled_at', { ascending: false })

  if (error || !enrollments) {
    console.error('Error fetching enrollments:', error)
    return []
  }

  // 완료된 레슨 수 조회
  const { data: progress } = await supabase
    .from('lesson_progress')
    .select('lesson_id, lessons!inner(module_id, modules!inner(course_id))')
    .eq('user_id', user.id)
    .eq('completed', true)

  // 코스별 완료 레슨 수 계산
  const completedByCoursе: Record<string, number> = {}
  if (progress) {
    progress.forEach((p) => {
      const lesson = p.lessons as unknown as { module_id: string; modules: { course_id: string } }
      const courseId = lesson.modules.course_id
      completedByCoursе[courseId] = (completedByCoursе[courseId] || 0) + 1
    })
  }

  // 결과 변환
  return enrollments.map((e) => {
    const course = e.courses as unknown as {
      id: string
      title: string
      description: string | null
      thumbnail_url: string | null
      total_lessons: number
      difficulty: 'beginner' | 'intermediate' | 'advanced'
      categories: { name: string } | null
    }

    const completedLessons = completedByCoursе[course.id] || 0
    const progressPercent = course.total_lessons > 0
      ? Math.round((completedLessons / course.total_lessons) * 100)
      : 0

    return {
      id: course.id,
      title: course.title,
      description: course.description,
      thumbnail_url: course.thumbnail_url,
      category_name: course.categories?.name || null,
      difficulty: course.difficulty,
      total_lessons: course.total_lessons,
      completed_lessons: completedLessons,
      progress_percent: progressPercent,
      enrolled_at: e.enrolled_at,
      completed_at: e.completed_at,
      last_accessed_lesson_id: null, // 나중에 구현
    }
  })
}
