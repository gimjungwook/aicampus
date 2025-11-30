-- ================================================
-- AI Campus 추가 테스트 데이터 (가격/접근레벨 포함)
-- ================================================

-- 기존 코스에 가격 및 접근 레벨 업데이트
UPDATE courses SET price = NULL, access_level = 'free' WHERE id = 'a1000000-0000-0000-0000-000000000001';
UPDATE courses SET price = NULL, access_level = 'free' WHERE id = 'a1000000-0000-0000-0000-000000000002';
UPDATE courses SET price = 29000, access_level = 'lite' WHERE id = 'a1000000-0000-0000-0000-000000000003';

-- 추가 코스 데이터 (다양한 가격/접근 레벨)
INSERT INTO courses (id, title, description, thumbnail_url, category_id, difficulty, estimated_hours, total_lessons, price, access_level) VALUES
(
  'a1000000-0000-0000-0000-000000000004',
  'Claude로 개발하기 (AI Coding)',
  'Anthropic의 Claude를 활용한 코딩. 자연어로 코드를 작성하고, 디버깅하고, 리팩토링하는 방법을 배웁니다.',
  NULL,
  (SELECT id FROM categories WHERE slug = 'ai-basics'),
  'intermediate',
  5.0,
  15,
  49000,
  'pro'
),
(
  'a1000000-0000-0000-0000-000000000005',
  'Midjourney 마스터 클래스',
  '이미지 생성 AI의 선두주자 Midjourney를 완벽히 마스터합니다. 프롬프트 작성부터 고급 설정까지.',
  NULL,
  (SELECT id FROM categories WHERE slug = 'prompt-engineering'),
  'intermediate',
  4.5,
  12,
  39000,
  'lite'
),
(
  'a1000000-0000-0000-0000-000000000006',
  'AI 자동화로 일하는 시간 줄이기',
  'Make, Zapier, n8n을 활용한 업무 자동화. 반복 작업을 AI에게 맡기고 창의적인 일에 집중하세요.',
  NULL,
  (SELECT id FROM categories WHERE slug = 'automation'),
  'beginner',
  3.5,
  10,
  NULL,
  'free'
),
(
  'a1000000-0000-0000-0000-000000000007',
  'GPT-4 API 활용 실전 가이드',
  'OpenAI API를 실무에 적용하는 방법. 챗봇, 문서 분석, 콘텐츠 생성 등 다양한 활용 사례를 다룹니다.',
  NULL,
  (SELECT id FROM categories WHERE slug = 'automation'),
  'advanced',
  6.0,
  18,
  69000,
  'pro'
),
(
  'a1000000-0000-0000-0000-000000000008',
  'AI로 마케팅 콘텐츠 제작하기',
  '블로그 포스팅, SNS 콘텐츠, 광고 카피까지! AI를 활용한 마케팅 콘텐츠 제작의 A to Z.',
  NULL,
  (SELECT id FROM categories WHERE slug = 'business'),
  'beginner',
  2.5,
  8,
  NULL,
  'free'
),
(
  'a1000000-0000-0000-0000-000000000009',
  'Enterprise AI 전략 수립',
  '기업 내 AI 도입 전략. 임원진을 위한 AI 이해, ROI 분석, 팀 교육 로드맵까지.',
  NULL,
  (SELECT id FROM categories WHERE slug = 'business'),
  'advanced',
  8.0,
  20,
  199000,
  'enterprise'
),
(
  'a1000000-0000-0000-0000-000000000010',
  'Notion AI 완전 정복',
  'Notion AI 기능 200% 활용하기. 문서 작성, 요약, 번역, 브레인스토밍까지 모두 다룹니다.',
  NULL,
  (SELECT id FROM categories WHERE slug = 'business'),
  'beginner',
  2.0,
  6,
  19000,
  'lite'
)
ON CONFLICT DO NOTHING;

-- 코스 4: Claude로 개발하기 - 모듈
INSERT INTO modules (id, course_id, title, description, order_index) VALUES
(
  'b4000000-0000-0000-0000-000000000001',
  'a1000000-0000-0000-0000-000000000004',
  'Claude 소개',
  'Claude AI의 특징과 장점을 알아봅니다.',
  1
),
(
  'b4000000-0000-0000-0000-000000000002',
  'a1000000-0000-0000-0000-000000000004',
  '코드 작성 도우미로 활용',
  'Claude를 활용한 코드 작성 방법을 배웁니다.',
  2
),
(
  'b4000000-0000-0000-0000-000000000003',
  'a1000000-0000-0000-0000-000000000004',
  '디버깅과 리팩토링',
  'Claude로 코드 오류를 찾고 개선하는 방법을 학습합니다.',
  3
)
ON CONFLICT DO NOTHING;

-- 코스 4 레슨
INSERT INTO lessons (module_id, title, description, youtube_video_id, duration_minutes, order_index) VALUES
(
  'b4000000-0000-0000-0000-000000000001',
  'Claude란? 다른 AI와의 차이점',
  'Anthropic Claude의 특징과 GPT와의 차이점을 알아봅니다.',
  'dQw4w9WgXcQ',
  12,
  1
),
(
  'b4000000-0000-0000-0000-000000000001',
  'Claude 프로젝트 설정하기',
  '개발 환경에서 Claude를 효과적으로 설정하는 방법',
  'dQw4w9WgXcQ',
  10,
  2
),
(
  'b4000000-0000-0000-0000-000000000002',
  '자연어로 함수 작성하기',
  '요구사항을 자연어로 설명해 함수를 생성합니다.',
  'dQw4w9WgXcQ',
  15,
  1
),
(
  'b4000000-0000-0000-0000-000000000002',
  '테스트 코드 자동 생성',
  'Claude를 활용해 테스트 케이스를 자동으로 생성합니다.',
  'dQw4w9WgXcQ',
  12,
  2
),
(
  'b4000000-0000-0000-0000-000000000003',
  '버그 찾기와 해결',
  '코드의 버그를 Claude에게 찾아달라고 요청하는 방법',
  'dQw4w9WgXcQ',
  14,
  1
),
(
  'b4000000-0000-0000-0000-000000000003',
  '코드 리팩토링 가이드',
  '더 나은 코드로 개선하는 리팩토링 기법',
  'dQw4w9WgXcQ',
  18,
  2
)
ON CONFLICT DO NOTHING;

-- 코스 5: Midjourney 마스터 클래스 - 모듈
INSERT INTO modules (id, course_id, title, description, order_index) VALUES
(
  'b5000000-0000-0000-0000-000000000001',
  'a1000000-0000-0000-0000-000000000005',
  'Midjourney 시작하기',
  'Discord 가입부터 첫 이미지 생성까지',
  1
),
(
  'b5000000-0000-0000-0000-000000000002',
  'a1000000-0000-0000-0000-000000000005',
  '프롬프트 작성 테크닉',
  '원하는 이미지를 얻기 위한 프롬프트 작성법',
  2
)
ON CONFLICT DO NOTHING;

-- 코스 5 레슨
INSERT INTO lessons (module_id, title, description, youtube_video_id, duration_minutes, order_index) VALUES
(
  'b5000000-0000-0000-0000-000000000001',
  'Discord 설정과 구독',
  'Midjourney 사용을 위한 Discord 설정',
  'dQw4w9WgXcQ',
  8,
  1
),
(
  'b5000000-0000-0000-0000-000000000001',
  '첫 번째 이미지 만들기',
  '간단한 프롬프트로 첫 이미지 생성하기',
  'dQw4w9WgXcQ',
  10,
  2
),
(
  'b5000000-0000-0000-0000-000000000002',
  '스타일 파라미터 마스터하기',
  '--style, --chaos, --stylize 파라미터 활용법',
  'dQw4w9WgXcQ',
  15,
  1
),
(
  'b5000000-0000-0000-0000-000000000002',
  '이미지 프롬프트와 블렌딩',
  '이미지를 참조해 새로운 이미지 생성하기',
  'dQw4w9WgXcQ',
  12,
  2
)
ON CONFLICT DO NOTHING;

-- 코스 6: AI 자동화 - 모듈
INSERT INTO modules (id, course_id, title, description, order_index) VALUES
(
  'b6000000-0000-0000-0000-000000000001',
  'a1000000-0000-0000-0000-000000000006',
  '자동화 도구 소개',
  'Make, Zapier, n8n의 특징 비교',
  1
),
(
  'b6000000-0000-0000-0000-000000000002',
  'a1000000-0000-0000-0000-000000000006',
  '실전 자동화 워크플로우',
  '실무에서 바로 쓸 수 있는 자동화 템플릿',
  2
)
ON CONFLICT DO NOTHING;

-- 코스 6 레슨
INSERT INTO lessons (module_id, title, description, youtube_video_id, duration_minutes, order_index) VALUES
(
  'b6000000-0000-0000-0000-000000000001',
  '자동화란 무엇인가',
  '업무 자동화의 개념과 장점',
  'dQw4w9WgXcQ',
  8,
  1
),
(
  'b6000000-0000-0000-0000-000000000001',
  'Make vs Zapier vs n8n',
  '각 도구의 장단점 비교',
  'dQw4w9WgXcQ',
  12,
  2
),
(
  'b6000000-0000-0000-0000-000000000002',
  '이메일 자동 분류하기',
  '수신 메일을 자동으로 분류하고 응답하기',
  'dQw4w9WgXcQ',
  15,
  1
),
(
  'b6000000-0000-0000-0000-000000000002',
  'AI와 연동한 문서 처리',
  'GPT API를 활용한 문서 자동 요약',
  'dQw4w9WgXcQ',
  18,
  2
)
ON CONFLICT DO NOTHING;

-- 코스 8: AI 마케팅 - 모듈
INSERT INTO modules (id, course_id, title, description, order_index) VALUES
(
  'b8000000-0000-0000-0000-000000000001',
  'a1000000-0000-0000-0000-000000000008',
  'AI 마케팅 기초',
  'AI를 활용한 마케팅의 기본 개념',
  1
),
(
  'b8000000-0000-0000-0000-000000000002',
  'a1000000-0000-0000-0000-000000000008',
  '콘텐츠 제작 실습',
  '다양한 마케팅 콘텐츠 제작 실습',
  2
)
ON CONFLICT DO NOTHING;

-- 코스 8 레슨
INSERT INTO lessons (module_id, title, description, youtube_video_id, duration_minutes, order_index) VALUES
(
  'b8000000-0000-0000-0000-000000000001',
  '마케팅에서 AI 활용 현황',
  '현재 마케팅 업계의 AI 활용 트렌드',
  'dQw4w9WgXcQ',
  10,
  1
),
(
  'b8000000-0000-0000-0000-000000000001',
  'AI 마케팅 도구 소개',
  'Copy.ai, Jasper 등 마케팅 AI 도구',
  'dQw4w9WgXcQ',
  8,
  2
),
(
  'b8000000-0000-0000-0000-000000000002',
  '블로그 포스팅 작성',
  'AI로 SEO 최적화된 블로그 글 작성하기',
  'dQw4w9WgXcQ',
  15,
  1
),
(
  'b8000000-0000-0000-0000-000000000002',
  'SNS 콘텐츠 대량 생성',
  '인스타그램, 트위터용 콘텐츠 빠르게 만들기',
  'dQw4w9WgXcQ',
  12,
  2
)
ON CONFLICT DO NOTHING;

-- 코스 10: Notion AI - 모듈
INSERT INTO modules (id, course_id, title, description, order_index) VALUES
(
  'b0100000-0000-0000-0000-000000000001',
  'a1000000-0000-0000-0000-000000000010',
  'Notion AI 기본',
  'Notion AI 기능 소개와 기본 사용법',
  1
),
(
  'b0100000-0000-0000-0000-000000000002',
  'a1000000-0000-0000-0000-000000000010',
  '고급 활용',
  'Notion AI를 200% 활용하는 팁',
  2
)
ON CONFLICT DO NOTHING;

-- 코스 10 레슨
INSERT INTO lessons (module_id, title, description, youtube_video_id, duration_minutes, order_index) VALUES
(
  'b0100000-0000-0000-0000-000000000001',
  'Notion AI 시작하기',
  'Notion AI 활성화와 첫 사용',
  'dQw4w9WgXcQ',
  8,
  1
),
(
  'b0100000-0000-0000-0000-000000000001',
  '문서 자동 작성',
  '초안부터 완성까지 AI 활용하기',
  'dQw4w9WgXcQ',
  10,
  2
),
(
  'b0100000-0000-0000-0000-000000000002',
  '회의록 요약과 액션아이템',
  '긴 회의록을 요약하고 할 일 추출하기',
  'dQw4w9WgXcQ',
  12,
  1
),
(
  'b0100000-0000-0000-0000-000000000002',
  'Notion AI + 데이터베이스',
  '데이터베이스와 AI의 강력한 조합',
  'dQw4w9WgXcQ',
  15,
  2
)
ON CONFLICT DO NOTHING;
