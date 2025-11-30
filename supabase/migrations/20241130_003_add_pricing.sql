-- ================================================
-- 가격 및 접근 레벨 필드 추가
-- ================================================

-- courses 테이블에 price, access_level 컬럼 추가
ALTER TABLE courses
ADD COLUMN IF NOT EXISTS price INTEGER DEFAULT NULL,
ADD COLUMN IF NOT EXISTS access_level TEXT DEFAULT 'free' CHECK (access_level IN ('free', 'lite', 'pro', 'enterprise'));

-- 기존 코스 데이터 업데이트 (무료로 설정)
UPDATE courses SET access_level = 'free' WHERE access_level IS NULL;
