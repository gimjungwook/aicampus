import { NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'

// 테스트 계정 이메일 - 이 계정만 초기화 가능
const TEST_EMAIL = 'yera040618@gmail.com'

export async function POST() {
  try {
    const supabase = createAdminClient()

    // 1. profiles 테이블에서 테스트 계정의 user_id 찾기
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('id')
      .eq('email', TEST_EMAIL)
      .single()

    if (profileError || !profile) {
      return NextResponse.json(
        { error: '테스트 계정을 찾을 수 없습니다.', details: profileError?.message },
        { status: 404 }
      )
    }

    const userId = profile.id

    // 2. lesson_progress 삭제
    const { error: progressError, count: progressCount } = await supabase
      .from('lesson_progress')
      .delete()
      .eq('user_id', userId)
      .select('id', { count: 'exact', head: true })

    if (progressError) {
      console.error('lesson_progress 삭제 오류:', progressError)
    }

    // 3. user_enrollments 삭제
    const { error: enrollmentError, count: enrollmentCount } = await supabase
      .from('user_enrollments')
      .delete()
      .eq('user_id', userId)
      .select('id', { count: 'exact', head: true })

    if (enrollmentError) {
      console.error('user_enrollments 삭제 오류:', enrollmentError)
    }

    // 4. sandbox_usage 삭제 (선택적)
    const { error: usageError } = await supabase
      .from('sandbox_usage')
      .delete()
      .eq('user_id', userId)

    if (usageError) {
      console.error('sandbox_usage 삭제 오류:', usageError)
    }

    // 5. sandbox_conversations 삭제 (선택적)
    const { error: conversationsError } = await supabase
      .from('sandbox_conversations')
      .delete()
      .eq('user_id', userId)

    if (conversationsError) {
      console.error('sandbox_conversations 삭제 오류:', conversationsError)
    }

    // 6. course_reviews 삭제 (선택적)
    const { error: reviewsError } = await supabase
      .from('course_reviews')
      .delete()
      .eq('user_id', userId)

    if (reviewsError) {
      console.error('course_reviews 삭제 오류:', reviewsError)
    }

    return NextResponse.json({
      success: true,
      message: `${TEST_EMAIL} 계정의 수강 정보가 초기화되었습니다.`,
      deleted: {
        lesson_progress: progressCount ?? 0,
        user_enrollments: enrollmentCount ?? 0,
        sandbox_usage: '삭제 시도됨',
        sandbox_conversations: '삭제 시도됨',
        course_reviews: '삭제 시도됨',
      },
    })
  } catch (error) {
    console.error('초기화 오류:', error)
    return NextResponse.json(
      { error: '초기화 중 오류가 발생했습니다.', details: String(error) },
      { status: 500 }
    )
  }
}
