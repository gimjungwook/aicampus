-- ================================================
-- AI Campus 테스트 데이터
-- ================================================

-- 1. 카테고리 데이터
INSERT INTO categories (name, slug, icon, color, order_index) VALUES
('AI 기초', 'ai-basics', '🤖', '#58cc02', 1),
('프롬프트 엔지니어링', 'prompt-engineering', '📝', '#1cb0f6', 2),
('업무 활용', 'business', '💼', '#ff9600', 3),
('자동화', 'automation', '⚡', '#ce82ff', 4)
ON CONFLICT (slug) DO NOTHING;

-- 2. 코스 데이터
INSERT INTO courses (id, title, description, thumbnail_url, category_id, difficulty, estimated_hours, total_lessons) VALUES
(
  'a1000000-0000-0000-0000-000000000001',
  'AI 입문: ChatGPT 시작하기',
  '생성형 AI가 처음이신가요? ChatGPT를 통해 AI의 기본 개념부터 실제 활용법까지 배워보세요.',
  NULL,
  (SELECT id FROM categories WHERE slug = 'ai-basics'),
  'beginner',
  2.5,
  8
),
(
  'a1000000-0000-0000-0000-000000000002',
  '효과적인 프롬프트 작성법',
  'AI에게 원하는 답변을 얻는 비법! 프롬프트 엔지니어링의 핵심 원리와 실전 기법을 알아봅니다.',
  NULL,
  (SELECT id FROM categories WHERE slug = 'prompt-engineering'),
  'beginner',
  3.0,
  10
),
(
  'a1000000-0000-0000-0000-000000000003',
  'AI로 업무 효율 200% 높이기',
  '이메일, 보고서, 기획서 작성까지! 실무에서 바로 써먹는 AI 활용 노하우를 공개합니다.',
  NULL,
  (SELECT id FROM categories WHERE slug = 'business'),
  'intermediate',
  4.0,
  12
)
ON CONFLICT DO NOTHING;

-- 3. 모듈 데이터 (코스 1: AI 입문)
INSERT INTO modules (id, course_id, title, description, order_index) VALUES
(
  'b1000000-0000-0000-0000-000000000001',
  'a1000000-0000-0000-0000-000000000001',
  'AI란 무엇인가?',
  '인공지능의 기본 개념과 역사를 알아봅니다.',
  1
),
(
  'b1000000-0000-0000-0000-000000000002',
  'a1000000-0000-0000-0000-000000000001',
  'ChatGPT 시작하기',
  'ChatGPT 계정 생성부터 첫 대화까지 진행합니다.',
  2
),
(
  'b1000000-0000-0000-0000-000000000003',
  'a1000000-0000-0000-0000-000000000001',
  '실전 활용',
  '일상과 업무에서 ChatGPT를 활용하는 방법을 배웁니다.',
  3
)
ON CONFLICT DO NOTHING;

-- 4. 레슨 데이터 (모듈 1: AI란 무엇인가?)
INSERT INTO lessons (module_id, title, description, youtube_video_id, duration_minutes, order_index) VALUES
(
  'b1000000-0000-0000-0000-000000000001',
  '인공지능의 정의와 역사',
  'AI의 탄생부터 현재까지의 발전 과정을 살펴봅니다.',
  'dQw4w9WgXcQ',
  8,
  1
),
(
  'b1000000-0000-0000-0000-000000000001',
  '생성형 AI란?',
  'GPT, DALL-E 등 생성형 AI의 개념과 원리를 설명합니다.',
  'dQw4w9WgXcQ',
  10,
  2
),
(
  'b1000000-0000-0000-0000-000000000001',
  'AI의 장단점 이해하기',
  'AI를 활용할 때 알아야 할 장점과 한계점을 알아봅니다.',
  'dQw4w9WgXcQ',
  7,
  3
)
ON CONFLICT DO NOTHING;

-- 레슨 데이터 (모듈 2: ChatGPT 시작하기)
INSERT INTO lessons (module_id, title, description, youtube_video_id, duration_minutes, order_index) VALUES
(
  'b1000000-0000-0000-0000-000000000002',
  'ChatGPT 계정 만들기',
  '무료로 ChatGPT 계정을 생성하는 방법을 안내합니다.',
  'dQw4w9WgXcQ',
  5,
  1
),
(
  'b1000000-0000-0000-0000-000000000002',
  '첫 대화 시작하기',
  'ChatGPT와 첫 대화를 나눠보고 기본 사용법을 익힙니다.',
  'dQw4w9WgXcQ',
  8,
  2
)
ON CONFLICT DO NOTHING;

-- 레슨 데이터 (모듈 3: 실전 활용)
INSERT INTO lessons (module_id, title, description, youtube_video_id, duration_minutes, order_index) VALUES
(
  'b1000000-0000-0000-0000-000000000003',
  '일상에서 AI 활용하기',
  '요리, 여행, 학습 등 일상생활에서 AI를 활용하는 방법을 알아봅니다.',
  'dQw4w9WgXcQ',
  12,
  1
),
(
  'b1000000-0000-0000-0000-000000000003',
  '업무에서 AI 활용하기',
  '이메일, 문서 작성 등 업무에서 AI를 활용하는 방법을 배웁니다.',
  'dQw4w9WgXcQ',
  15,
  2
),
(
  'b1000000-0000-0000-0000-000000000003',
  'AI 활용 팁과 주의사항',
  'AI를 더 효과적으로 사용하기 위한 팁과 주의할 점을 정리합니다.',
  'dQw4w9WgXcQ',
  10,
  3
)
ON CONFLICT DO NOTHING;

-- 5. 코스 2 모듈 & 레슨 (프롬프트 엔지니어링)
INSERT INTO modules (id, course_id, title, description, order_index) VALUES
(
  'b2000000-0000-0000-0000-000000000001',
  'a1000000-0000-0000-0000-000000000002',
  '프롬프트 기초',
  '좋은 프롬프트란 무엇인지 알아봅니다.',
  1
),
(
  'b2000000-0000-0000-0000-000000000002',
  'a1000000-0000-0000-0000-000000000002',
  '프롬프트 패턴',
  '실무에서 자주 쓰이는 프롬프트 패턴을 학습합니다.',
  2
)
ON CONFLICT DO NOTHING;

INSERT INTO lessons (module_id, title, description, youtube_video_id, duration_minutes, order_index) VALUES
(
  'b2000000-0000-0000-0000-000000000001',
  '프롬프트란 무엇인가?',
  'AI에게 전달하는 명령어, 프롬프트의 개념을 이해합니다.',
  'dQw4w9WgXcQ',
  8,
  1
),
(
  'b2000000-0000-0000-0000-000000000001',
  '좋은 프롬프트의 조건',
  '효과적인 프롬프트가 갖춰야 할 요소를 알아봅니다.',
  'dQw4w9WgXcQ',
  10,
  2
),
(
  'b2000000-0000-0000-0000-000000000001',
  '맥락 제공하기',
  'AI에게 충분한 맥락을 제공하는 방법을 배웁니다.',
  'dQw4w9WgXcQ',
  12,
  3
),
(
  'b2000000-0000-0000-0000-000000000002',
  '역할 부여 패턴',
  'AI에게 역할을 부여해 더 나은 결과를 얻는 방법',
  'dQw4w9WgXcQ',
  10,
  1
),
(
  'b2000000-0000-0000-0000-000000000002',
  '예시 제공 패턴',
  'Few-shot learning으로 AI의 이해도를 높이는 방법',
  'dQw4w9WgXcQ',
  12,
  2
),
(
  'b2000000-0000-0000-0000-000000000002',
  '단계별 사고 유도',
  'Chain of Thought 기법으로 복잡한 문제 해결하기',
  'dQw4w9WgXcQ',
  15,
  3
),
(
  'b2000000-0000-0000-0000-000000000002',
  '출력 형식 지정하기',
  '원하는 형식으로 결과를 받는 방법',
  'dQw4w9WgXcQ',
  8,
  4
)
ON CONFLICT DO NOTHING;
