-- ================================================
-- AI Campus 뉴스피드 시스템 스키마
-- ================================================

-- 1. 뉴스 포스트 테이블
CREATE TABLE IF NOT EXISTS news_posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  content TEXT NOT NULL,                    -- 마크다운 콘텐츠
  excerpt TEXT,                             -- 미리보기용 요약 (150자)
  thumbnail_url TEXT,                       -- 썸네일 이미지
  author_id UUID NOT NULL REFERENCES auth.users(id),
  is_published BOOLEAN DEFAULT false,
  published_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. 태그 테이블
CREATE TABLE IF NOT EXISTS news_tags (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,                -- 예: ChatGPT, Claude, 프롬프트팁
  slug TEXT NOT NULL UNIQUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. 포스트-태그 연결 테이블
CREATE TABLE IF NOT EXISTS news_post_tags (
  post_id UUID NOT NULL REFERENCES news_posts(id) ON DELETE CASCADE,
  tag_id UUID NOT NULL REFERENCES news_tags(id) ON DELETE CASCADE,
  PRIMARY KEY (post_id, tag_id)
);

-- 4. 좋아요 테이블
CREATE TABLE IF NOT EXISTS news_likes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id UUID NOT NULL REFERENCES news_posts(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(post_id, user_id)
);

-- 5. 댓글 테이블 (2단계 지원, 대댓글 있으면 삭제 불가)
CREATE TABLE IF NOT EXISTS news_comments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id UUID NOT NULL REFERENCES news_posts(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  parent_id UUID REFERENCES news_comments(id) ON DELETE RESTRICT,  -- 대댓글 있으면 삭제 불가
  content TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ================================================
-- Row Level Security (RLS)
-- ================================================

ALTER TABLE news_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE news_tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE news_post_tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE news_likes ENABLE ROW LEVEL SECURITY;
ALTER TABLE news_comments ENABLE ROW LEVEL SECURITY;

-- 포스트: 공개된 것만 모두 읽기, 관리자만 쓰기
CREATE POLICY "news_posts_public_read" ON news_posts
  FOR SELECT USING (is_published = true);
CREATE POLICY "news_posts_admin_all" ON news_posts
  FOR ALL USING (is_admin());

-- 태그: 모두 읽기, 관리자만 쓰기
CREATE POLICY "news_tags_public_read" ON news_tags
  FOR SELECT USING (true);
CREATE POLICY "news_tags_admin_all" ON news_tags
  FOR ALL USING (is_admin());

-- 포스트-태그: 모두 읽기, 관리자만 쓰기
CREATE POLICY "news_post_tags_public_read" ON news_post_tags
  FOR SELECT USING (true);
CREATE POLICY "news_post_tags_admin_all" ON news_post_tags
  FOR ALL USING (is_admin());

-- 좋아요: 모두 읽기, 본인만 쓰기/삭제
CREATE POLICY "news_likes_public_read" ON news_likes
  FOR SELECT USING (true);
CREATE POLICY "news_likes_user_insert" ON news_likes
  FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "news_likes_user_delete" ON news_likes
  FOR DELETE USING (auth.uid() = user_id);

-- 댓글: 모두 읽기, 본인만 쓰기/수정/삭제
CREATE POLICY "news_comments_public_read" ON news_comments
  FOR SELECT USING (true);
CREATE POLICY "news_comments_user_insert" ON news_comments
  FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "news_comments_user_update" ON news_comments
  FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "news_comments_user_delete" ON news_comments
  FOR DELETE USING (auth.uid() = user_id);

-- ================================================
-- 인덱스
-- ================================================

CREATE INDEX IF NOT EXISTS idx_news_posts_published ON news_posts(is_published, published_at DESC);
CREATE INDEX IF NOT EXISTS idx_news_likes_post ON news_likes(post_id);
CREATE INDEX IF NOT EXISTS idx_news_likes_user ON news_likes(user_id);
CREATE INDEX IF NOT EXISTS idx_news_comments_post ON news_comments(post_id);
CREATE INDEX IF NOT EXISTS idx_news_comments_parent ON news_comments(parent_id);
CREATE INDEX IF NOT EXISTS idx_news_post_tags_post ON news_post_tags(post_id);
CREATE INDEX IF NOT EXISTS idx_news_post_tags_tag ON news_post_tags(tag_id);

-- ================================================
-- 초기 태그 데이터
-- ================================================

INSERT INTO news_tags (name, slug) VALUES
  ('ChatGPT', 'chatgpt'),
  ('Claude', 'claude'),
  ('Gemini', 'gemini'),
  ('프롬프트 팁', 'prompt-tips'),
  ('업계 동향', 'industry-trends'),
  ('신기능', 'new-features')
ON CONFLICT (slug) DO NOTHING;
