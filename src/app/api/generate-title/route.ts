import { NextRequest, NextResponse } from 'next/server'
import { GoogleGenerativeAI } from '@google/generative-ai'

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GEMINI_API_KEY || '')

export async function POST(request: NextRequest) {
  try {
    const { message } = await request.json()

    if (!message) {
      return NextResponse.json({ error: 'Message is required' }, { status: 400 })
    }

    const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' })

    const prompt = `다음 사용자 메시지를 보고, 이 대화에 적합한 짧은 제목을 생성해주세요.
제목은 10자 이내로 간결하게 작성하고, 따옴표나 다른 부연 설명 없이 제목만 출력하세요.

사용자 메시지: "${message.slice(0, 200)}"

제목:`

    const result = await model.generateContent(prompt)
    const title = result.response.text().trim().slice(0, 30)

    return NextResponse.json({ title })
  } catch (error) {
    console.error('Generate title error:', error)
    return NextResponse.json(
      { error: 'Failed to generate title' },
      { status: 500 }
    )
  }
}
