-- ================================================
-- Phase 13-1: 강의 상세 페이지 리디자인 - DB 마이그레이션
-- ================================================

-- 1. 코스 섹션 이미지 테이블
CREATE TABLE IF NOT EXISTS course_section_images (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  course_id UUID NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
  section_type TEXT NOT NULL CHECK (section_type IN ('intro', 'features', 'instructor')),
  image_url TEXT NOT NULL,
  order_index INTEGER DEFAULT 0,
  alt_text TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. 코스 리뷰 테이블
CREATE TABLE IF NOT EXISTS course_reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  course_id UUID NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  content TEXT NOT NULL,
  progress_percent INTEGER DEFAULT 0 CHECK (progress_percent >= 0 AND progress_percent <= 100),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(course_id, user_id)
);

-- 3. 리뷰 답변 테이블 (강사/관리자)
CREATE TABLE IF NOT EXISTS review_replies (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  review_id UUID NOT NULL REFERENCES course_reviews(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(review_id)
);

-- ================================================
-- RLS 정책
-- ================================================

-- course_section_images RLS
ALTER TABLE course_section_images ENABLE ROW LEVEL SECURITY;
CREATE POLICY "section_images_public_read" ON course_section_images FOR SELECT USING (true);
CREATE POLICY "section_images_admin_insert" ON course_section_images FOR INSERT
  WITH CHECK (is_admin());
CREATE POLICY "section_images_admin_update" ON course_section_images FOR UPDATE
  USING (is_admin());
CREATE POLICY "section_images_admin_delete" ON course_section_images FOR DELETE
  USING (is_admin());

-- course_reviews RLS
ALTER TABLE course_reviews ENABLE ROW LEVEL SECURITY;
CREATE POLICY "reviews_public_read" ON course_reviews FOR SELECT USING (true);
CREATE POLICY "reviews_user_insert" ON course_reviews FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "reviews_user_update" ON course_reviews FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "reviews_user_delete" ON course_reviews FOR DELETE
  USING (auth.uid() = user_id OR is_admin());

-- review_replies RLS
ALTER TABLE review_replies ENABLE ROW LEVEL SECURITY;
CREATE POLICY "replies_public_read" ON review_replies FOR SELECT USING (true);
CREATE POLICY "replies_admin_insert" ON review_replies FOR INSERT
  WITH CHECK (is_admin());
CREATE POLICY "replies_user_update" ON review_replies FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "replies_user_delete" ON review_replies FOR DELETE
  USING (auth.uid() = user_id OR is_admin());

-- ================================================
-- 인덱스
-- ================================================

CREATE INDEX IF NOT EXISTS idx_section_images_course ON course_section_images(course_id);
CREATE INDEX IF NOT EXISTS idx_section_images_type ON course_section_images(course_id, section_type);
CREATE INDEX IF NOT EXISTS idx_section_images_order ON course_section_images(course_id, section_type, order_index);

CREATE INDEX IF NOT EXISTS idx_reviews_course ON course_reviews(course_id);
CREATE INDEX IF NOT EXISTS idx_reviews_user ON course_reviews(user_id);
CREATE INDEX IF NOT EXISTS idx_reviews_rating ON course_reviews(course_id, rating);
CREATE INDEX IF NOT EXISTS idx_reviews_created ON course_reviews(course_id, created_at DESC);

CREATE INDEX IF NOT EXISTS idx_replies_review ON review_replies(review_id);

-- ================================================
-- updated_at 트리거
-- ================================================

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_reviews_updated_at ON course_reviews;
CREATE TRIGGER trigger_reviews_updated_at
  BEFORE UPDATE ON course_reviews
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS trigger_replies_updated_at ON review_replies;
CREATE TRIGGER trigger_replies_updated_at
  BEFORE UPDATE ON review_replies
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
