// 뉴스 포스트 기본 타입
export interface NewsPost {
  id: string
  title: string
  content: string
  excerpt: string | null
  thumbnail_url: string | null
  author_id: string
  is_published: boolean
  published_at: string | null
  created_at: string
  updated_at: string
}

// 태그 타입
export interface NewsTag {
  id: string
  name: string
  slug: string
  created_at: string
}

// 좋아요 타입
export interface NewsLike {
  id: string
  post_id: string
  user_id: string
  created_at: string
}

// 댓글 타입
export interface NewsComment {
  id: string
  post_id: string
  user_id: string
  parent_id: string | null
  content: string
  created_at: string
  updated_at: string
}

// 작성자 정보 타입
export interface NewsAuthor {
  id: string
  display_name: string | null
  avatar_url: string | null
}

// 확장 타입: 상세 정보 포함
export interface NewsPostWithDetails extends NewsPost {
  tags: NewsTag[]
  author: NewsAuthor
  likes_count: number
  comments_count: number
  is_liked?: boolean  // 현재 유저가 좋아요 했는지
}

// 확장 타입: 댓글 + 작성자 정보
export interface NewsCommentWithAuthor extends NewsComment {
  author: NewsAuthor
  replies?: NewsCommentWithAuthor[]  // 대댓글
}

// Form 타입: 포스트 생성/수정
export interface NewsPostFormData {
  title: string
  content: string
  excerpt?: string | null
  thumbnail_url?: string | null
  tag_ids?: string[]
  is_published?: boolean
}

// Form 타입: 태그 생성
export interface NewsTagFormData {
  name: string
  slug: string
}

// 댓글 생성 데이터
export interface NewsCommentFormData {
  content: string
  parent_id?: string | null
}

// 피드 목록 조회 옵션
export interface NewsFeedOptions {
  tag?: string        // 태그 슬러그로 필터링
  limit?: number      // 가져올 개수 (기본 10)
  offset?: number     // 오프셋 (더보기용)
}

// 피드 목록 응답
export interface NewsFeedResponse {
  posts: NewsPostWithDetails[]
  hasMore: boolean
  total: number
}
