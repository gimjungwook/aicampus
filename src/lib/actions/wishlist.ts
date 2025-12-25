'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import type { WishlistItem, Course } from '@/lib/types'

// 위시리스트에 추가
export async function addToWishlist(courseId: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return { success: false, error: '로그인이 필요합니다' }
  }

  const { error } = await supabase
    .from('user_wishlists')
    .insert({
      user_id: user.id,
      course_id: courseId,
    })

  if (error) {
    // unique constraint violation - 이미 추가됨
    if (error.code === '23505') {
      return { success: true, message: '이미 찜한 강의입니다' }
    }
    console.error('Error adding to wishlist:', error)
    return { success: false, error: '찜하기에 실패했습니다' }
  }

  revalidatePath('/wishlist')
  revalidatePath(`/courses/${courseId}`)

  return { success: true }
}

// 위시리스트에서 삭제
export async function removeFromWishlist(courseId: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return { success: false, error: '로그인이 필요합니다' }
  }

  const { error } = await supabase
    .from('user_wishlists')
    .delete()
    .eq('user_id', user.id)
    .eq('course_id', courseId)

  if (error) {
    console.error('Error removing from wishlist:', error)
    return { success: false, error: '찜 취소에 실패했습니다' }
  }

  revalidatePath('/wishlist')
  revalidatePath(`/courses/${courseId}`)

  return { success: true }
}

// 위시리스트 전체 조회 (코스 정보 포함)
export async function getWishlist(): Promise<WishlistItem[]> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return []
  }

  const { data, error } = await supabase
    .from('user_wishlists')
    .select(`
      id,
      user_id,
      course_id,
      added_at,
      courses (
        id,
        title,
        description,
        thumbnail_url,
        total_lessons,
        category_id,
        difficulty,
        estimated_hours,
        price,
        access_level,
        created_at,
        instructor_name,
        is_premium,
        is_best,
        is_new,
        is_hot,
        categories (
          id,
          name,
          slug,
          icon,
          color,
          order_index,
          created_at
        )
      )
    `)
    .eq('user_id', user.id)
    .order('added_at', { ascending: false })

  if (error) {
    console.error('Error fetching wishlist:', error)
    return []
  }

  // 데이터 변환
  return (data || []).map(item => ({
    id: item.id,
    user_id: item.user_id,
    course_id: item.course_id,
    added_at: item.added_at,
    course: {
      ...(item.courses as unknown as Course),
      category: (item.courses as unknown as { categories: Course['category'] }).categories,
    },
  }))
}

// 위시리스트 개수 조회 (헤더 배지용)
export async function getWishlistCount(): Promise<number> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return 0
  }

  const { count, error } = await supabase
    .from('user_wishlists')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', user.id)

  if (error) {
    console.error('Error fetching wishlist count:', error)
    return 0
  }

  return count || 0
}

// 특정 코스가 위시리스트에 있는지 확인
export async function isInWishlist(courseId: string): Promise<boolean> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return false
  }

  const { data, error } = await supabase
    .from('user_wishlists')
    .select('id')
    .eq('user_id', user.id)
    .eq('course_id', courseId)
    .single()

  if (error) {
    // PGRST116: no rows returned (정상적으로 없는 경우)
    if (error.code === 'PGRST116') {
      return false
    }
    console.error('Error checking wishlist:', error)
    return false
  }

  return !!data
}

// 위시리스트 ID 목록만 조회 (빠른 체크용)
export async function getWishlistIds(): Promise<string[]> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return []
  }

  const { data, error } = await supabase
    .from('user_wishlists')
    .select('course_id')
    .eq('user_id', user.id)

  if (error) {
    console.error('Error fetching wishlist ids:', error)
    return []
  }

  return (data || []).map(item => item.course_id)
}
