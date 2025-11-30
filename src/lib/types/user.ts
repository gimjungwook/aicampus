// 사용자 프로필
export interface Profile {
  id: string
  email: string
  nickname: string | null
  avatar_url: string | null
  marketing_consent: boolean
  created_at: string
  updated_at: string
}

// 수강 코스 (진도 포함)
export interface EnrolledCourseWithProgress {
  id: string
  title: string
  description: string | null
  thumbnail_url: string | null
  category_name: string | null
  difficulty: 'beginner' | 'intermediate' | 'advanced'
  total_lessons: number
  completed_lessons: number
  progress_percent: number
  enrolled_at: string
  completed_at: string | null
  last_accessed_lesson_id: string | null
}

// 프로필 수정 데이터
export interface ProfileUpdateData {
  nickname?: string
  marketing_consent?: boolean
}
