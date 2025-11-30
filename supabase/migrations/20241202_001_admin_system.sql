-- ================================================
-- Phase 9: Admin System 스키마 확장
-- ================================================

-- 1. profiles 테이블에 role 컬럼 추가
ALTER TABLE profiles
ADD COLUMN IF NOT EXISTS role TEXT DEFAULT 'user'
  CHECK (role IN ('user', 'creator', 'admin', 'super_admin'));

CREATE INDEX IF NOT EXISTS idx_profiles_role ON profiles(role);

-- 2. Admin 체크 함수
CREATE OR REPLACE FUNCTION is_admin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM profiles
    WHERE id = auth.uid()
    AND role IN ('admin', 'super_admin')
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 3. 콘텐츠 테이블 Admin RLS 정책
-- Categories
CREATE POLICY "categories_admin_insert" ON categories
  FOR INSERT WITH CHECK (is_admin());
CREATE POLICY "categories_admin_update" ON categories
  FOR UPDATE USING (is_admin());
CREATE POLICY "categories_admin_delete" ON categories
  FOR DELETE USING (is_admin());

-- Courses
CREATE POLICY "courses_admin_insert" ON courses
  FOR INSERT WITH CHECK (is_admin());
CREATE POLICY "courses_admin_update" ON courses
  FOR UPDATE USING (is_admin());
CREATE POLICY "courses_admin_delete" ON courses
  FOR DELETE USING (is_admin());

-- Modules
CREATE POLICY "modules_admin_insert" ON modules
  FOR INSERT WITH CHECK (is_admin());
CREATE POLICY "modules_admin_update" ON modules
  FOR UPDATE USING (is_admin());
CREATE POLICY "modules_admin_delete" ON modules
  FOR DELETE USING (is_admin());

-- Lessons
CREATE POLICY "lessons_admin_insert" ON lessons
  FOR INSERT WITH CHECK (is_admin());
CREATE POLICY "lessons_admin_update" ON lessons
  FOR UPDATE USING (is_admin());
CREATE POLICY "lessons_admin_delete" ON lessons
  FOR DELETE USING (is_admin());

-- 4. content Storage 버킷 생성
INSERT INTO storage.buckets (id, name, public)
VALUES ('content', 'content', true)
ON CONFLICT (id) DO NOTHING;

-- Storage 정책
CREATE POLICY "content_admin_upload" ON storage.objects
  FOR INSERT WITH CHECK (bucket_id = 'content' AND is_admin());
CREATE POLICY "content_admin_update" ON storage.objects
  FOR UPDATE USING (bucket_id = 'content' AND is_admin());
CREATE POLICY "content_admin_delete" ON storage.objects
  FOR DELETE USING (bucket_id = 'content' AND is_admin());
CREATE POLICY "content_public_read" ON storage.objects
  FOR SELECT USING (bucket_id = 'content');
