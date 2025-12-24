-- article_banners 테이블 생성
CREATE TABLE IF NOT EXISTS article_banners (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  subtitle TEXT,
  badge_text TEXT DEFAULT 'Article',
  image_url TEXT,
  link_url TEXT,
  gradient_color TEXT DEFAULT '#000000',
  accent_color TEXT,
  is_active BOOLEAN DEFAULT true,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- RLS 활성화
ALTER TABLE article_banners ENABLE ROW LEVEL SECURITY;

-- 읽기 정책: 활성화된 배너만 모든 사용자가 읽기 가능
CREATE POLICY "Anyone can read active banners"
  ON article_banners FOR SELECT
  USING (is_active = true);

-- 관리자 정책: 관리자는 모든 작업 가능 (is_admin() 함수 사용)
CREATE POLICY "banners_admin_insert" ON article_banners
  FOR INSERT WITH CHECK (is_admin());
CREATE POLICY "banners_admin_update" ON article_banners
  FOR UPDATE USING (is_admin());
CREATE POLICY "banners_admin_delete" ON article_banners
  FOR DELETE USING (is_admin());

-- 인덱스
CREATE INDEX idx_article_banners_active ON article_banners(is_active, display_order);

-- 샘플 데이터
INSERT INTO article_banners (title, subtitle, badge_text, gradient_color, accent_color, display_order) VALUES
('AI 개발자,
비전공자도 가능할까?', '비전공자가 실무에서 반드시 갖춰야 할 마인드셋', 'Article', '#1a1a2e', '#00c3ea', 1),
('AI 시대에
디자이너로 살아남기', '디자이너의 역할을 완전히 재정의 하다.', 'Article', '#2d1f3d', NULL, 2);
