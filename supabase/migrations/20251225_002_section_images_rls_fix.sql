-- ================================================
-- Fix: course_section_images RLS 정책 재적용
-- ================================================

-- RLS 활성화
ALTER TABLE course_section_images ENABLE ROW LEVEL SECURITY;

-- 기존 정책 삭제
DROP POLICY IF EXISTS "section_images_public_read" ON course_section_images;
DROP POLICY IF EXISTS "section_images_admin_insert" ON course_section_images;
DROP POLICY IF EXISTS "section_images_admin_update" ON course_section_images;
DROP POLICY IF EXISTS "section_images_admin_delete" ON course_section_images;

-- 정책 재생성
CREATE POLICY "section_images_public_read" ON course_section_images
  FOR SELECT USING (true);

CREATE POLICY "section_images_admin_insert" ON course_section_images
  FOR INSERT WITH CHECK (is_admin());

CREATE POLICY "section_images_admin_update" ON course_section_images
  FOR UPDATE USING (is_admin());

CREATE POLICY "section_images_admin_delete" ON course_section_images
  FOR DELETE USING (is_admin());

-- ================================================
-- Storage: course-images 버킷 생성 및 정책
-- ================================================

-- 버킷 생성 (이미 존재하면 무시)
INSERT INTO storage.buckets (id, name, public)
VALUES ('course-images', 'course-images', true)
ON CONFLICT (id) DO NOTHING;

-- Storage 정책 삭제 후 재생성
DROP POLICY IF EXISTS "course_images_public_read" ON storage.objects;
DROP POLICY IF EXISTS "course_images_admin_insert" ON storage.objects;
DROP POLICY IF EXISTS "course_images_admin_update" ON storage.objects;
DROP POLICY IF EXISTS "course_images_admin_delete" ON storage.objects;

-- 누구나 읽기 가능
CREATE POLICY "course_images_public_read" ON storage.objects
  FOR SELECT USING (bucket_id = 'course-images');

-- 관리자만 업로드 가능
CREATE POLICY "course_images_admin_insert" ON storage.objects
  FOR INSERT WITH CHECK (bucket_id = 'course-images' AND is_admin());

-- 관리자만 수정 가능
CREATE POLICY "course_images_admin_update" ON storage.objects
  FOR UPDATE USING (bucket_id = 'course-images' AND is_admin());

-- 관리자만 삭제 가능
CREATE POLICY "course_images_admin_delete" ON storage.objects
  FOR DELETE USING (bucket_id = 'course-images' AND is_admin());
