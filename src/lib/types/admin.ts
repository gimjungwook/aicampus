import type { Category, Course, Module, Lesson } from './course'

// ============ ADMIN TYPES ============

export type UserRole = 'user' | 'creator' | 'admin' | 'super_admin'

export interface AdminProfile {
  id: string
  email: string
  nickname: string | null
  role: UserRole
}

// ============ FORM DATA TYPES ============

export interface CategoryFormData {
  name: string
  slug: string
  icon?: string | null
  color?: string | null
  order_index?: number
}

export interface CourseFormData {
  title: string
  description?: string | null
  thumbnail_url?: string | null
  category_id?: string | null
  difficulty: 'beginner' | 'intermediate' | 'advanced'
  estimated_hours?: number | null
  price?: number | null
  access_level: 'free' | 'lite' | 'pro' | 'enterprise'
  // 배지 필드
  is_hot?: boolean      // 추천 (AI Campus 추천 강의)
  is_best?: boolean     // BEST 태그
  is_new?: boolean      // NEW 태그
}

export interface ModuleFormData {
  title: string
  description?: string | null
  order_index?: number
}

export interface LessonFormData {
  title: string
  description?: string | null
  content_type: 'video' | 'blog'
  youtube_video_id?: string | null
  markdown_content?: string | null
  duration_minutes?: number | null
  is_free?: boolean
  order_index?: number
}

export interface BannerFormData {
  title: string
  subtitle?: string | null
  badge_text?: string
  image_url?: string | null
  link_url?: string | null
  gradient_color?: string
  accent_color?: string | null
  is_active?: boolean
  display_order?: number
}

// ============ SANDBOX TEMPLATE TYPES ============

export interface SandboxTemplate {
  id: string
  lesson_id: string
  title: string
  content: string
  order_index: number
  created_at: string
  updated_at: string
}

export interface SandboxTemplateFormData {
  title: string
  content: string
  order_index?: number
}

export interface Banner {
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

// ============ DASHBOARD STATS ============

export interface DashboardStats {
  totalCourses: number
  totalLessons: number
  totalUsers: number
  totalEnrollments: number
}

// ============ ADMIN ACTION RESULTS ============

export interface AdminActionResult<T = void> {
  success: boolean
  data?: T
  error?: string
}

// Re-export for convenience
export type { Category, Course, Module, Lesson }
