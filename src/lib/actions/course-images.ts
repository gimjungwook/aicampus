'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { checkAdminRole } from '@/lib/utils/admin'
import type { CourseSectionImage, SectionType } from '@/lib/types/course'

// 이미지 업로드
export async function uploadSectionImage(
  courseId: string,
  sectionType: SectionType,
  formData: FormData
): Promise<{ success: boolean; error?: string; image?: CourseSectionImage }> {
  // 관리자 확인
  if (!(await checkAdminRole())) {
    return { success: false, error: '권한이 없습니다.' }
  }

  const supabase = await createClient()
  const file = formData.get('file') as File
  const altText = formData.get('altText') as string | null

  if (!file) {
    return { success: false, error: '파일이 필요합니다.' }
  }

  // 파일 크기 체크 (5MB)
  if (file.size > 5 * 1024 * 1024) {
    return { success: false, error: '파일 크기는 5MB 이하여야 합니다.' }
  }

  // 파일명 생성 (중복 방지)
  const fileExt = file.name.split('.').pop()
  const fileName = `${Date.now()}-${Math.random().toString(36).slice(2)}.${fileExt}`
  const filePath = `${courseId}/${sectionType}/${fileName}`

  // Storage에 업로드
  const { error: uploadError } = await supabase.storage
    .from('course-images')
    .upload(filePath, file)

  if (uploadError) {
    return { success: false, error: uploadError.message }
  }

  // Public URL 생성
  const { data: urlData } = supabase.storage
    .from('course-images')
    .getPublicUrl(filePath)

  // 현재 최대 order_index 조회
  const { data: maxOrderData } = await supabase
    .from('course_section_images')
    .select('order_index')
    .eq('course_id', courseId)
    .eq('section_type', sectionType)
    .order('order_index', { ascending: false })
    .limit(1)
    .single()

  const nextOrderIndex = (maxOrderData?.order_index ?? -1) + 1

  // DB에 저장
  const { data, error: dbError } = await supabase
    .from('course_section_images')
    .insert({
      course_id: courseId,
      section_type: sectionType,
      image_url: urlData.publicUrl,
      order_index: nextOrderIndex,
      alt_text: altText
    })
    .select()
    .single()

  if (dbError) {
    return { success: false, error: dbError.message }
  }

  revalidatePath(`/courses/${courseId}`)
  return { success: true, image: data }
}

// 이미지 삭제
export async function deleteSectionImage(
  imageId: string
): Promise<{ success: boolean; error?: string }> {
  if (!(await checkAdminRole())) {
    return { success: false, error: '권한이 없습니다.' }
  }

  const supabase = await createClient()

  // 이미지 정보 조회
  const { data: image, error: fetchError } = await supabase
    .from('course_section_images')
    .select('*')
    .eq('id', imageId)
    .single()

  if (fetchError || !image) {
    return { success: false, error: '이미지를 찾을 수 없습니다.' }
  }

  // Storage에서 파일 삭제
  const filePath = image.image_url.split('/course-images/').pop()
  if (filePath) {
    await supabase.storage.from('course-images').remove([filePath])
  }

  // DB에서 삭제
  const { error: deleteError } = await supabase
    .from('course_section_images')
    .delete()
    .eq('id', imageId)

  if (deleteError) {
    return { success: false, error: deleteError.message }
  }

  revalidatePath(`/courses/${image.course_id}`)
  return { success: true }
}

// 이미지 순서 변경
export async function reorderSectionImages(
  courseId: string,
  sectionType: SectionType,
  imageIds: string[]
): Promise<{ success: boolean; error?: string }> {
  if (!(await checkAdminRole())) {
    return { success: false, error: '권한이 없습니다.' }
  }

  const supabase = await createClient()

  // 각 이미지의 order_index 업데이트
  const updates = imageIds.map((id, index) =>
    supabase
      .from('course_section_images')
      .update({ order_index: index })
      .eq('id', id)
  )

  const results = await Promise.all(updates)
  const hasError = results.some(r => r.error)

  if (hasError) {
    return { success: false, error: '순서 변경 중 오류가 발생했습니다.' }
  }

  revalidatePath(`/courses/${courseId}`)
  return { success: true }
}
