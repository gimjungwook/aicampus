import { NextRequest, NextResponse } from 'next/server'
import { GoogleGenerativeAI } from '@google/generative-ai'
import { createClient } from '@/lib/supabase/server'

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GEMINI_API_KEY || '')
const INDEPENDENT_LIMIT = 20

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: '로그인이 필요합니다.' }, { status: 401 })
    }

    const { message } = await request.json()

    if (!message) {
      return NextResponse.json({ error: 'Message is required' }, { status: 400 })
    }

    const today = new Date().toISOString().split('T')[0]

    // 사용량 체크 (독립 샌드박스 기준)
    const { data: usage } = await supabase
      .from('sandbox_usage')
      .select('count')
      .eq('user_id', user.id)
      .eq('usage_date', today)
      .is('lesson_id', null)
      .maybeSingle()

    const currentCount = usage?.count || 0
    if (currentCount >= INDEPENDENT_LIMIT) {
      return NextResponse.json(
        { error: '오늘 사용량을 모두 소진했습니다. 내일 다시 시도해주세요.', resetAt: getKSTMidnight() },
        { status: 429 }
      )
    }

    const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' })

    const prompt = `다음 사용자 메시지를 보고, 이 대화에 적합한 짧은 제목을 생성해주세요.
제목은 10자 이내로 간결하게 작성하고, 따옴표나 다른 부연 설명 없이 제목만 출력하세요.

사용자 메시지: "${message.slice(0, 200)}"

제목:`

    const result = await model.generateContent(prompt)
    const title = result.response.text().trim().slice(0, 30)

    await incrementIndependentUsage(supabase, user.id, today)

    return NextResponse.json({ title })
  } catch (error) {
    console.error('Generate title error:', error)
    return NextResponse.json(
      { error: 'Failed to generate title' },
      { status: 500 }
    )
  }
}

// KST 자정 계산 (429 응답용)
function getKSTMidnight(): string {
  const now = new Date()
  const kstOffset = 9 * 60 * 60 * 1000
  const kstNow = new Date(now.getTime() + kstOffset)
  const tomorrow = new Date(kstNow)
  tomorrow.setUTCHours(24, 0, 0, 0)
  return tomorrow.toISOString()
}

async function incrementIndependentUsage(
  supabase: Awaited<ReturnType<typeof createClient>>,
  userId: string,
  date: string
) {
  const { error } = await supabase.rpc('increment_sandbox_usage', {
    p_user_id: userId,
    p_lesson_id: null,
    p_usage_date: date,
  })

  if (!error) return

  const { data: existing } = await supabase
    .from('sandbox_usage')
    .select('id, count')
    .eq('user_id', userId)
    .eq('usage_date', date)
    .is('lesson_id', null)
    .maybeSingle()

  if (!existing) {
    await supabase
      .from('sandbox_usage')
      .insert({
        user_id: userId,
        lesson_id: null,
        usage_date: date,
        count: 1,
      })
    return
  }

  await supabase
    .from('sandbox_usage')
    .update({ count: existing.count + 1 })
    .eq('id', existing.id)
}
