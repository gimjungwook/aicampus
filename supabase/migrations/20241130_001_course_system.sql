-- ================================================
-- AI Campus 코스 시스템 스키마
-- ================================================

-- 1. 카테고리 테이블
CREATE TABLE IF NOT EXISTS categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,
  slug TEXT NOT NULL UNIQUE,
  icon TEXT,
  color TEXT,
  order_index INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. 코스 테이블
CREATE TABLE IF NOT EXISTS courses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  thumbnail_url TEXT,
  total_lessons INTEGER DEFAULT 0,
  category_id UUID REFERENCES categories(id) ON DELETE SET NULL,
  difficulty TEXT CHECK (difficulty IN ('beginner', 'intermediate', 'advanced')) DEFAULT 'beginner',
  estimated_hours DECIMAL(4,1),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. 모듈 테이블
CREATE TABLE IF NOT EXISTS modules (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  course_id UUID NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  order_index INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. 레슨 테이블
CREATE TABLE IF NOT EXISTS lessons (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  module_id UUID NOT NULL REFERENCES modules(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  youtube_video_id TEXT NOT NULL,
  duration_minutes INTEGER,
  order_index INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. 수강 등록 테이블
CREATE TABLE IF NOT EXISTS user_enrollments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  course_id UUID NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
  enrolled_at TIMESTAMPTZ DEFAULT NOW(),
  completed_at TIMESTAMPTZ,
  UNIQUE(user_id, course_id)
);

-- 6. 레슨 진도 테이블
CREATE TABLE IF NOT EXISTS lesson_progress (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  lesson_id UUID NOT NULL REFERENCES lessons(id) ON DELETE CASCADE,
  completed BOOLEAN DEFAULT false,
  completed_at TIMESTAMPTZ,
  UNIQUE(user_id, lesson_id)
);

-- ================================================
-- Row Level Security (RLS)
-- ================================================

-- 카테고리: 모든 사용자 읽기 허용
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
CREATE POLICY "categories_public_read" ON categories FOR SELECT USING (true);

-- 코스: 모든 사용자 읽기 허용
ALTER TABLE courses ENABLE ROW LEVEL SECURITY;
CREATE POLICY "courses_public_read" ON courses FOR SELECT USING (true);

-- 모듈: 모든 사용자 읽기 허용
ALTER TABLE modules ENABLE ROW LEVEL SECURITY;
CREATE POLICY "modules_public_read" ON modules FOR SELECT USING (true);

-- 레슨: 모든 사용자 읽기 허용
ALTER TABLE lessons ENABLE ROW LEVEL SECURITY;
CREATE POLICY "lessons_public_read" ON lessons FOR SELECT USING (true);

-- 수강 등록: 본인만 읽기/쓰기
ALTER TABLE user_enrollments ENABLE ROW LEVEL SECURITY;
CREATE POLICY "enrollments_user_select" ON user_enrollments FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "enrollments_user_insert" ON user_enrollments FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "enrollments_user_update" ON user_enrollments FOR UPDATE USING (auth.uid() = user_id);

-- 레슨 진도: 본인만 읽기/쓰기
ALTER TABLE lesson_progress ENABLE ROW LEVEL SECURITY;
CREATE POLICY "progress_user_select" ON lesson_progress FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "progress_user_insert" ON lesson_progress FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "progress_user_update" ON lesson_progress FOR UPDATE USING (auth.uid() = user_id);

-- ================================================
-- 인덱스
-- ================================================

CREATE INDEX IF NOT EXISTS idx_courses_category ON courses(category_id);
CREATE INDEX IF NOT EXISTS idx_modules_course ON modules(course_id);
CREATE INDEX IF NOT EXISTS idx_lessons_module ON lessons(module_id);
CREATE INDEX IF NOT EXISTS idx_enrollments_user ON user_enrollments(user_id);
CREATE INDEX IF NOT EXISTS idx_enrollments_course ON user_enrollments(course_id);
CREATE INDEX IF NOT EXISTS idx_progress_user ON lesson_progress(user_id);
CREATE INDEX IF NOT EXISTS idx_progress_lesson ON lesson_progress(lesson_id);

-- ================================================
-- 트리거: total_lessons 자동 업데이트
-- ================================================

CREATE OR REPLACE FUNCTION update_course_total_lessons()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE courses
  SET total_lessons = (
    SELECT COUNT(*)
    FROM lessons l
    JOIN modules m ON l.module_id = m.id
    WHERE m.course_id = COALESCE(
      (SELECT course_id FROM modules WHERE id = NEW.module_id),
      (SELECT course_id FROM modules WHERE id = OLD.module_id)
    )
  )
  WHERE id = COALESCE(
    (SELECT course_id FROM modules WHERE id = NEW.module_id),
    (SELECT course_id FROM modules WHERE id = OLD.module_id)
  );
  RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_update_total_lessons ON lessons;
CREATE TRIGGER trigger_update_total_lessons
AFTER INSERT OR DELETE ON lessons
FOR EACH ROW
EXECUTE FUNCTION update_course_total_lessons();
