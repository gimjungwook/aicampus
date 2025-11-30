-- ================================================
-- Phase 8: 블로그 콘텐츠 타입 지원 추가
-- ================================================

-- 1. 새 컬럼 추가
ALTER TABLE lessons
ADD COLUMN IF NOT EXISTS content_type TEXT DEFAULT 'video'
  CHECK (content_type IN ('video', 'blog')),
ADD COLUMN IF NOT EXISTS markdown_content TEXT,
ADD COLUMN IF NOT EXISTS is_free BOOLEAN DEFAULT FALSE;

-- 2. youtube_video_id NULL 허용으로 변경
ALTER TABLE lessons
ALTER COLUMN youtube_video_id DROP NOT NULL;

-- 3. 기존 데이터 마이그레이션 (모두 video 타입으로 설정)
UPDATE lessons SET content_type = 'video' WHERE content_type IS NULL;

-- 4. 데이터 무결성 제약조건 추가
-- video 타입이면 youtube_video_id 필수, blog 타입이면 markdown_content 필수
ALTER TABLE lessons
ADD CONSTRAINT lessons_content_check CHECK (
  (content_type = 'video' AND youtube_video_id IS NOT NULL) OR
  (content_type = 'blog' AND markdown_content IS NOT NULL)
);

-- 5. is_free 인덱스 추가 (무료 레슨 조회 최적화)
CREATE INDEX IF NOT EXISTS idx_lessons_is_free ON lessons(is_free) WHERE is_free = TRUE;

-- 6. content_type 인덱스 추가
CREATE INDEX IF NOT EXISTS idx_lessons_content_type ON lessons(content_type);
