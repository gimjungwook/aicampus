-- ================================================
-- AI Sandbox 사용량 추적 테이블
-- ================================================

-- sandbox_usage 테이블 생성
CREATE TABLE IF NOT EXISTS sandbox_usage (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  lesson_id UUID REFERENCES lessons(id) ON DELETE CASCADE,
  usage_date DATE NOT NULL DEFAULT CURRENT_DATE,
  count INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, lesson_id, usage_date)
);

-- 인덱스 생성
CREATE INDEX IF NOT EXISTS idx_sandbox_usage_user_date ON sandbox_usage(user_id, usage_date);
CREATE INDEX IF NOT EXISTS idx_sandbox_usage_lesson ON sandbox_usage(lesson_id);

-- RLS 활성화
ALTER TABLE sandbox_usage ENABLE ROW LEVEL SECURITY;

-- RLS 정책: 자신의 사용량만 접근 가능
CREATE POLICY "sandbox_usage_select_own" ON sandbox_usage
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "sandbox_usage_insert_own" ON sandbox_usage
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "sandbox_usage_update_own" ON sandbox_usage
  FOR UPDATE USING (auth.uid() = user_id);

-- 독립 샌드박스 사용량 (lesson_id가 NULL인 경우)을 위한 테이블
-- 동일한 테이블 사용, lesson_id = NULL로 구분

COMMENT ON TABLE sandbox_usage IS 'AI 샌드박스 사용량 추적. lesson_id가 NULL이면 독립 샌드박스';
COMMENT ON COLUMN sandbox_usage.lesson_id IS '레슨 ID. NULL이면 독립 샌드박스 사용량';
COMMENT ON COLUMN sandbox_usage.count IS '해당 날짜의 사용 횟수';

-- 사용량 증가 RPC 함수
CREATE OR REPLACE FUNCTION increment_sandbox_usage(
  p_user_id UUID,
  p_lesson_id UUID,
  p_usage_date DATE
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  INSERT INTO sandbox_usage (user_id, lesson_id, usage_date, count)
  VALUES (p_user_id, p_lesson_id, p_usage_date, 1)
  ON CONFLICT (user_id, lesson_id, usage_date)
  DO UPDATE SET count = sandbox_usage.count + 1;
END;
$$;
