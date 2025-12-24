export interface ArticleBanner {
  id: string
  title: string
  subtitle: string | null
  badge_text: string
  image_url: string | null
  link_url: string | null
  gradient_color: string
  accent_color: string | null
  is_active: boolean
  display_order: number
  created_at: string
  updated_at: string
}
