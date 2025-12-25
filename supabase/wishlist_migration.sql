-- ================================================
-- AI Campus - 위시리스트 마이그레이션 스크립트
-- Supabase SQL Editor에서 실행하세요
-- ================================================

-- 1. user_wishlists 테이블
CREATE TABLE IF NOT EXISTS user_wishlists (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  course_id UUID NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
  added_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, course_id)
);

-- 2. 인덱스
CREATE INDEX IF NOT EXISTS idx_wishlists_user ON user_wishlists(user_id);
CREATE INDEX IF NOT EXISTS idx_wishlists_course ON user_wishlists(course_id);
CREATE INDEX IF NOT EXISTS idx_wishlists_added ON user_wishlists(added_at DESC);

-- 3. RLS 활성화
ALTER TABLE user_wishlists ENABLE ROW LEVEL SECURITY;

-- 4. RLS 정책
CREATE POLICY "Users can view own wishlists"
  ON user_wishlists FOR SELECT TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own wishlists"
  ON user_wishlists FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own wishlists"
  ON user_wishlists FOR DELETE TO authenticated
  USING (auth.uid() = user_id);
