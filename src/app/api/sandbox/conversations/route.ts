import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: '로그인이 필요합니다.' }, { status: 401 })
  }

  const { data, error } = await supabase
    .from('conversations')
    .select('*')
    .eq('user_id', user.id)
    .order('updated_at', { ascending: false })

  if (error) {
    return NextResponse.json({ error: '대화를 불러오지 못했습니다.' }, { status: 500 })
  }

  return NextResponse.json(data || [])
}

export async function POST() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: '로그인이 필요합니다.' }, { status: 401 })
  }

  const { data, error } = await supabase
    .from('conversations')
    .insert({ user_id: user.id, title: '새 대화' })
    .select()
    .single()

  if (error) {
    return NextResponse.json({ error: '대화를 생성하지 못했습니다.' }, { status: 500 })
  }

  return NextResponse.json(data)
}
