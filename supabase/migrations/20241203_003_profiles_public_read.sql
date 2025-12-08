-- ================================================
-- profiles 테이블 공개 읽기 정책 및 외래 키 관계 추가
-- ================================================

-- 1. profiles 공개 읽기 정책 추가
DROP POLICY IF EXISTS "profiles_public_read" ON profiles;
CREATE POLICY "profiles_public_read" ON profiles
  FOR SELECT USING (true);

-- 2. news_posts.author_id → profiles.id 외래 키 추가
-- (PostgREST가 profiles 테이블과 조인할 수 있도록)
ALTER TABLE news_posts
  DROP CONSTRAINT IF EXISTS news_posts_author_id_profiles_fkey;

ALTER TABLE news_posts
  ADD CONSTRAINT news_posts_author_id_profiles_fkey
  FOREIGN KEY (author_id) REFERENCES profiles(id) ON DELETE CASCADE;

-- 3. news_comments.user_id → profiles.id 외래 키 추가
ALTER TABLE news_comments
  DROP CONSTRAINT IF EXISTS news_comments_user_id_profiles_fkey;

ALTER TABLE news_comments
  ADD CONSTRAINT news_comments_user_id_profiles_fkey
  FOREIGN KEY (user_id) REFERENCES profiles(id) ON DELETE CASCADE;
