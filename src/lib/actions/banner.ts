'use server'

import { createClient } from '@/lib/supabase/server'
import type { ArticleBanner } from '@/lib/types/banner'

export async function getActiveBanners(): Promise<ArticleBanner[]> {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('article_banners')
    .select('*')
    .eq('is_active', true)
    .order('display_order', { ascending: true })

  if (error) {
    console.error('Failed to fetch banners:', error)
    return []
  }

  return data || []
}
