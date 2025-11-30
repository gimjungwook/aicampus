-- ================================================
-- Phase 8: 블로그 콘텐츠 타입 지원
-- Supabase 대시보드 SQL Editor에서 실행
-- ================================================

-- 1. 새 컬럼 추가
ALTER TABLE lessons
ADD COLUMN IF NOT EXISTS content_type TEXT DEFAULT 'video'
  CHECK (content_type IN ('video', 'blog')),
ADD COLUMN IF NOT EXISTS markdown_content TEXT,
ADD COLUMN IF NOT EXISTS is_free BOOLEAN DEFAULT FALSE;

-- 2. youtube_video_id NULL 허용
ALTER TABLE lessons
ALTER COLUMN youtube_video_id DROP NOT NULL;

-- 3. 기존 데이터 업데이트
UPDATE lessons SET content_type = 'video' WHERE content_type IS NULL;

-- 4. 인덱스 추가
CREATE INDEX IF NOT EXISTS idx_lessons_is_free ON lessons(is_free) WHERE is_free = TRUE;
CREATE INDEX IF NOT EXISTS idx_lessons_content_type ON lessons(content_type);

-- 완료 확인
SELECT column_name, data_type, is_nullable
FROM information_schema.columns
WHERE table_name = 'lessons'
AND column_name IN ('content_type', 'markdown_content', 'is_free');
