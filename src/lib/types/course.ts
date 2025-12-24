// 카테고리
export interface Category {
  id: string
  name: string
  slug: string
  icon: string | null
  color: string | null
  order_index: number
  created_at: string
}

// 접근 레벨 타입
export type AccessLevel = 'free' | 'lite' | 'pro' | 'enterprise'

// 코스
export interface Course {
  id: string
  title: string
  description: string | null
  thumbnail_url: string | null
  total_lessons: number
  category_id: string | null
  difficulty: 'beginner' | 'intermediate' | 'advanced'
  estimated_hours: number | null
  price: number | null
  access_level: AccessLevel | null
  created_at: string
  // 새로 추가된 필드
  instructor_name?: string    // 강사명
  is_premium?: boolean        // 프리미엄 코스 여부 (Plus 뱃지)
  is_best?: boolean           // BEST 태그
  is_new?: boolean            // NEW 태그
  is_hot?: boolean            // 인기 급상승 태그
  // 조인된 데이터
  category?: Category
  modules?: Module[]
}

// 모듈
export interface Module {
  id: string
  course_id: string
  title: string
  description: string | null
  order_index: number
  created_at: string
  // 조인된 데이터
  lessons?: Lesson[]
}

// 콘텐츠 타입
export type ContentType = 'video' | 'blog'

// 레슨
export interface Lesson {
  id: string
  module_id: string
  title: string
  description: string | null
  youtube_video_id: string | null  // 블로그 타입은 null
  duration_minutes: number | null
  order_index: number
  created_at: string
  // Phase 8: 블로그 콘텐츠 지원
  content_type: ContentType
  markdown_content: string | null
  is_free: boolean
}

// 수강 등록
export interface UserEnrollment {
  id: string
  user_id: string
  course_id: string
  enrolled_at: string
  completed_at: string | null
}

// 레슨 진도
export interface LessonProgress {
  id: string
  user_id: string
  lesson_id: string
  completed: boolean
  completed_at: string | null
}

// 진도 정보가 포함된 코스
export interface CourseWithProgress extends Course {
  enrollment?: UserEnrollment | null
  completedLessons: number
  progressPercent: number
}

// 진도 정보가 포함된 레슨
export interface LessonWithProgress extends Lesson {
  progress?: LessonProgress | null
  isCompleted: boolean
}

// 진도 정보가 포함된 모듈
export interface ModuleWithProgress extends Module {
  lessons: LessonWithProgress[]
  completedCount: number
}

// 난이도 레이블
export const difficultyLabels = {
  beginner: '입문',
  intermediate: '중급',
  advanced: '고급',
} as const

// 접근 레벨 레이블
export const accessLevelLabels: Record<AccessLevel, string> = {
  free: '무료',
  lite: 'Lite',
  pro: 'Pro',
  enterprise: 'Enterprise',
} as const
