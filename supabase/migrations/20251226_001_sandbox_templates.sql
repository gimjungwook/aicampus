-- Sandbox 템플릿 테이블 생성
-- 레슨별로 여러 개의 템플릿을 저장할 수 있음

CREATE TABLE IF NOT EXISTS lesson_sandbox_templates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  lesson_id UUID NOT NULL REFERENCES lessons(id) ON DELETE CASCADE,
  title VARCHAR(100) NOT NULL,
  content TEXT NOT NULL,
  order_index INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 인덱스
CREATE INDEX idx_lesson_sandbox_templates_lesson_id ON lesson_sandbox_templates(lesson_id);

-- RLS 정책
ALTER TABLE lesson_sandbox_templates ENABLE ROW LEVEL SECURITY;

-- 모든 사용자가 읽을 수 있음
CREATE POLICY "lesson_sandbox_templates_select"
  ON lesson_sandbox_templates
  FOR SELECT
  TO authenticated, anon
  USING (true);

-- 관리자만 쓰기/수정/삭제 가능 (is_admin() 함수 사용)
CREATE POLICY "lesson_sandbox_templates_insert"
  ON lesson_sandbox_templates
  FOR INSERT
  TO authenticated
  WITH CHECK (is_admin());

CREATE POLICY "lesson_sandbox_templates_update"
  ON lesson_sandbox_templates
  FOR UPDATE
  TO authenticated
  USING (is_admin());

CREATE POLICY "lesson_sandbox_templates_delete"
  ON lesson_sandbox_templates
  FOR DELETE
  TO authenticated
  USING (is_admin());

-- updated_at 자동 업데이트 트리거
CREATE OR REPLACE FUNCTION update_lesson_sandbox_templates_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_lesson_sandbox_templates_updated_at
  BEFORE UPDATE ON lesson_sandbox_templates
  FOR EACH ROW
  EXECUTE FUNCTION update_lesson_sandbox_templates_updated_at();
