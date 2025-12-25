-- ================================================
-- 후기 샘플 데이터
-- 코스 ID: a1000000-0000-0000-0000-000000000002
-- 강사: gomshua@gmail.com
-- 수강자 2명 + 각각 강사 답글 1개
-- ================================================

-- 1. 테이블 비우기
TRUNCATE review_replies CASCADE;
TRUNCATE course_reviews CASCADE;

-- 2. 리뷰 데이터 삽입 (수강자 2명)
-- 리뷰 1: Hwan Kim
INSERT INTO course_reviews (course_id, user_id, rating, content, progress_percent, created_at)
SELECT
  'a1000000-0000-0000-0000-000000000002'::uuid,
  p.id,
  5,
  '프롬프트를 6가지 요소(Task, Context, Exemplars, Persona, Format, Tone)로 나눠서 설명해줘서 구조적으로 이해하기 좋았어요.',
  24,
  '2025-05-25 10:30:00+09'
FROM profiles p
WHERE p.id != (SELECT id FROM auth.users WHERE email = 'gomshua@gmail.com')
ORDER BY random()
LIMIT 1;

-- 리뷰 2: 다른 수강자
INSERT INTO course_reviews (course_id, user_id, rating, content, progress_percent, created_at)
SELECT
  'a1000000-0000-0000-0000-000000000002'::uuid,
  p.id,
  5,
  '프롬프트를 6가지 요소(Task, Context, Exemplars, Persona, Format, Tone)로 나눠서 설명해줘서 구조적으로 이해하기 좋았어요.',
  24,
  '2025-05-25 10:30:00+09'
FROM profiles p
WHERE p.id != (SELECT id FROM auth.users WHERE email = 'gomshua@gmail.com')
  AND p.id NOT IN (SELECT user_id FROM course_reviews WHERE course_id = 'a1000000-0000-0000-0000-000000000002')
ORDER BY random()
LIMIT 1;

-- 3. 강의자 답글 (gomshua@gmail.com) - 각 리뷰에 1개씩
-- 첫 번째 리뷰에 답글
INSERT INTO review_replies (review_id, user_id, content, created_at)
SELECT
  r.id,
  u.id,
  '제 강의를 아주 잘 시청하셨군요. 추가적으로 말씀을 드리자면, 그 모든 요소들의 초성을 더하면 TCEPFT입니다. 읽으면 티셉프트인데, 이게 무엇을 의미하냐면, 딱히 없습니다. 이런 말을 왜 하냐면, 이것이 강사가 답장을 쳤을 때를 대비한 더미텍스트이기 때문입니다.',
  '2025-05-25 12:00:00+09'
FROM course_reviews r
CROSS JOIN auth.users u
WHERE r.course_id = 'a1000000-0000-0000-0000-000000000002'
  AND u.email = 'gomshua@gmail.com'
ORDER BY r.created_at DESC
LIMIT 1;

-- 두 번째 리뷰에 답글
INSERT INTO review_replies (review_id, user_id, content, created_at)
SELECT
  r.id,
  u.id,
  '제 강의를 아주 잘 시청하셨군요. 추가적으로 말씀을 드리자면, 그 모든 요소들의 초성을 더하면 TCEPFT입니다. 읽으면 티셉프트인데, 이게 무엇을 의미하냐면, 딱히 없습니다. 이런 말을 왜 하냐면, 이것이 강사가 답장을 쳤을 때를 대비한 더미텍스트이기 때문입니다.',
  '2025-05-25 12:00:00+09'
FROM course_reviews r
CROSS JOIN auth.users u
WHERE r.course_id = 'a1000000-0000-0000-0000-000000000002'
  AND u.email = 'gomshua@gmail.com'
  AND r.id NOT IN (SELECT review_id FROM review_replies)
ORDER BY r.created_at ASC
LIMIT 1;
