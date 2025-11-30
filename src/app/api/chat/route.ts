import { GoogleGenerativeAI } from '@google/generative-ai'
import { createClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GEMINI_API_KEY || '')

// 사용량 제한
const LESSON_LIMIT = 5 // 레슨당 일일 5회
const INDEPENDENT_LIMIT = 20 // 독립 샌드박스 일일 20회

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json(
        { error: '로그인이 필요합니다.' },
        { status: 401 }
      )
    }

    const { message, conversationHistory, lessonId } = await request.json()

    if (!message) {
      return NextResponse.json(
        { error: '메시지를 입력해주세요.' },
        { status: 400 }
      )
    }

    // 사용량 체크
    const today = new Date().toISOString().split('T')[0]
    const limit = lessonId ? LESSON_LIMIT : INDEPENDENT_LIMIT

    // 현재 사용량 조회
    const { data: usageData } = await supabase
      .from('sandbox_usage')
      .select('count')
      .eq('user_id', user.id)
      .eq('usage_date', today)
      .is('lesson_id', lessonId || null)
      .single()

    const currentCount = usageData?.count || 0

    if (currentCount >= limit) {
      const resetTime = getKSTMidnight()
      return NextResponse.json(
        {
          error: '오늘 사용량을 모두 소진했습니다. 내일 다시 시도해주세요.',
          resetAt: resetTime,
          count: currentCount,
          limit,
        },
        { status: 429 }
      )
    }

    // Gemini API 호출 (스트리밍)
    const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' })

    // 대화 히스토리 구성
    const history = conversationHistory?.map((msg: { role: string; content: string }) => ({
      role: msg.role === 'user' ? 'user' : 'model',
      parts: [{ text: msg.content }],
    })) || []

    const chat = model.startChat({ history })

    // 스트리밍 응답
    const result = await chat.sendMessageStream(message)

    // 스트리밍 응답을 위한 ReadableStream 생성
    const encoder = new TextEncoder()
    let firstTokenReceived = false

    const stream = new ReadableStream({
      async start(controller) {
        try {
          for await (const chunk of result.stream) {
            const text = chunk.text()
            if (text) {
              // 첫 토큰 수신 시 사용량 증가
              if (!firstTokenReceived) {
                firstTokenReceived = true
                await incrementUsage(supabase, user.id, lessonId, today)
              }
              controller.enqueue(encoder.encode(`data: ${JSON.stringify({ text })}\n\n`))
            }
          }
          controller.enqueue(encoder.encode('data: [DONE]\n\n'))
          controller.close()
        } catch (error) {
          console.error('Streaming error:', error)
          controller.enqueue(
            encoder.encode(
              `data: ${JSON.stringify({ error: 'AI 서비스가 일시적으로 불안정합니다.' })}\n\n`
            )
          )
          controller.close()
        }
      },
    })

    return new Response(stream, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        Connection: 'keep-alive',
      },
    })
  } catch (error) {
    console.error('Chat API error:', error)
    return NextResponse.json(
      { error: 'AI 서비스가 일시적으로 불안정합니다. 잠시 후 다시 시도해주세요.' },
      { status: 500 }
    )
  }
}

// 사용량 증가 함수
async function incrementUsage(
  supabase: Awaited<ReturnType<typeof createClient>>,
  userId: string,
  lessonId: string | null,
  date: string
) {
  // upsert로 사용량 증가
  const { error } = await supabase.rpc('increment_sandbox_usage', {
    p_user_id: userId,
    p_lesson_id: lessonId,
    p_usage_date: date,
  })

  if (error) {
    // RPC가 없으면 직접 upsert
    await supabase
      .from('sandbox_usage')
      .upsert(
        {
          user_id: userId,
          lesson_id: lessonId,
          usage_date: date,
          count: 1,
        },
        {
          onConflict: 'user_id,lesson_id,usage_date',
        }
      )
      .select()
      .single()
      .then(async ({ data }) => {
        if (data) {
          await supabase
            .from('sandbox_usage')
            .update({ count: data.count + 1 })
            .eq('id', data.id)
        }
      })
  }
}

// KST 자정 시간 계산
function getKSTMidnight(): string {
  const now = new Date()
  const kstOffset = 9 * 60 * 60 * 1000 // KST = UTC + 9
  const kstNow = new Date(now.getTime() + kstOffset)

  // 다음 자정 계산
  const tomorrow = new Date(kstNow)
  tomorrow.setUTCHours(24, 0, 0, 0)

  return tomorrow.toISOString()
}

// 사용량 조회 API
export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json(
        { error: '로그인이 필요합니다.' },
        { status: 401 }
      )
    }

    const { searchParams } = new URL(request.url)
    const lessonId = searchParams.get('lessonId')

    const today = new Date().toISOString().split('T')[0]
    const limit = lessonId ? LESSON_LIMIT : INDEPENDENT_LIMIT

    // 현재 사용량 조회
    let query = supabase
      .from('sandbox_usage')
      .select('count')
      .eq('user_id', user.id)
      .eq('usage_date', today)

    if (lessonId) {
      query = query.eq('lesson_id', lessonId)
    } else {
      query = query.is('lesson_id', null)
    }

    const { data } = await query.single()

    return NextResponse.json({
      count: data?.count || 0,
      limit,
      resetAt: getKSTMidnight(),
    })
  } catch (error) {
    console.error('Usage API error:', error)
    return NextResponse.json({ count: 0, limit: 5, resetAt: getKSTMidnight() })
  }
}
