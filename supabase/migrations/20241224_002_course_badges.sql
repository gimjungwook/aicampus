-- courses 테이블에 배지/태그 관련 컬럼 추가
ALTER TABLE courses
ADD COLUMN IF NOT EXISTS instructor_name TEXT,
ADD COLUMN IF NOT EXISTS is_premium BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS is_best BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS is_new BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS is_hot BOOLEAN DEFAULT false;

-- 인덱스 추가
CREATE INDEX IF NOT EXISTS idx_courses_is_best ON courses(is_best) WHERE is_best = true;
CREATE INDEX IF NOT EXISTS idx_courses_is_new ON courses(is_new) WHERE is_new = true;
CREATE INDEX IF NOT EXISTS idx_courses_is_hot ON courses(is_hot) WHERE is_hot = true;

-- 모든 코스에 랜덤으로 배지 배정 (각각 50% 확률)
UPDATE courses SET
  is_best = (random() > 0.5),
  is_new = (random() > 0.5),
  is_hot = (random() > 0.7),
  is_premium = (random() > 0.7);
