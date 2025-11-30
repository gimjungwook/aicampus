-- ================================================
-- Phase 8: 블로그 레슨 샘플 데이터 (수정된 버전)
-- Supabase 대시보드 SQL Editor에서 실행
--
-- 주의: phase8_blog_content.sql을 먼저 실행하세요!
-- ================================================

-- 블로그 레슨 1: AI 소개 (무료)
INSERT INTO lessons (
  module_id,
  title,
  description,
  content_type,
  markdown_content,
  is_free,
  order_index,
  youtube_video_id
)
SELECT
  m.id,
  'AI란 무엇인가? - 입문 가이드',
  'AI의 기본 개념과 역사를 알아봅니다.',
  'blog',
  '# AI란 무엇인가?

## 소개

인공지능(AI, Artificial Intelligence)은 인간의 학습, 추론, 지각, 언어 이해 등의 지능적 행동을 컴퓨터가 수행할 수 있도록 하는 기술입니다.

## AI의 역사

- **1950년대**: 앨런 튜링이 "기계가 생각할 수 있는가?"라는 질문 제기
- **1956년**: 다트머스 회의에서 "인공지능"이라는 용어 탄생
- **2010년대**: 딥러닝의 부상으로 AI 혁명 시작
- **2020년대**: ChatGPT, Claude 등 대규모 언어모델(LLM) 등장

## AI의 종류

### 1. 약한 AI (Narrow AI)
특정 작업에 특화된 AI. 현재 우리가 사용하는 대부분의 AI가 여기에 해당합니다.
- 음성 인식 (Siri, Alexa)
- 이미지 인식
- 추천 시스템

### 2. 강한 AI (General AI)
인간과 동등하거나 그 이상의 지능을 가진 AI. 아직 실현되지 않았습니다.

## 왜 지금 AI를 배워야 하나요?

> "AI는 새로운 전기와 같습니다." - Andrew Ng

AI 기술은 이미 우리 일상 곳곳에 스며들어 있습니다:

- **업무 자동화**: 반복적인 작업을 AI가 대신
- **의사결정 지원**: 데이터 기반 인사이트 제공
- **창작 활동**: 글쓰기, 이미지 생성, 코딩 보조

## 다음 단계

이 코스에서는 실제로 AI를 활용하는 방법을 배웁니다. 다음 레슨에서 만나요!

---

*이 글이 도움이 되셨나요? 다음 레슨으로 넘어가세요!*',
  true,  -- 무료 레슨
  100,   -- order_index (기존 레슨들 뒤에 추가)
  NULL   -- 블로그는 youtube_video_id 없음
FROM modules m
ORDER BY m.created_at
LIMIT 1;

-- 블로그 레슨 2: 프롬프트 작성법 (무료)
INSERT INTO lessons (
  module_id,
  title,
  description,
  content_type,
  markdown_content,
  is_free,
  order_index,
  youtube_video_id
)
SELECT
  m.id,
  '효과적인 프롬프트 작성법',
  'AI에게 원하는 결과를 얻기 위한 프롬프트 작성 기법',
  'blog',
  '# 효과적인 프롬프트 작성법

## 프롬프트란?

프롬프트(Prompt)는 AI에게 주는 **지시문** 또는 **질문**입니다.
좋은 프롬프트를 작성하면 더 정확하고 유용한 답변을 얻을 수 있습니다.

## 좋은 프롬프트의 5가지 원칙

### 1. 명확하게 (Be Specific)

**나쁜 예시:**
```
마케팅에 대해 알려줘
```

**좋은 예시:**
```
B2B SaaS 스타트업의 콘텐츠 마케팅 전략 5가지를
각각 장단점과 함께 설명해줘
```

### 2. 맥락 제공 (Provide Context)

AI에게 배경 정보를 제공하세요:

```
나는 5년차 마케터이고,
월 예산 500만원으로 리드 제네레이션을
개선하고 싶어. 현재 전환율은 2%야.
```

### 3. 역할 부여 (Assign a Role)

```
너는 10년 경력의 UX 디자이너야.
초보자가 이해하기 쉽게 설명해줘.
```

### 4. 출력 형식 지정 (Specify Format)

```
다음 형식으로 답변해줘:
- 제목
- 요약 (2문장)
- 상세 설명
- 예시 코드
```

### 5. 예시 제공 (Give Examples)

```
이런 스타일로 작성해줘:

입력: 사과
출력: 사과는 건강에 좋은 과일입니다.

입력: 바나나
출력: ?
```

## 실습: 프롬프트 개선하기

아래 프롬프트를 개선해보세요:

**Before:**
> 이메일 써줘

**After:**
> 신규 고객에게 보낼 환영 이메일을 작성해줘.
> - 톤: 친근하지만 전문적
> - 길이: 150단어 이내
> - 포함할 내용: 가입 감사, 서비스 소개, CTA 버튼
> - 제목도 3가지 제안해줘

## 정리

| 원칙 | 키워드 |
|------|--------|
| 명확성 | 구체적으로 |
| 맥락 | 배경 정보 |
| 역할 | 페르소나 |
| 형식 | 출력 구조 |
| 예시 | 샘플 제공 |

다음 레슨에서 실제로 AI 샌드박스에서 실습해보세요!',
  true,  -- 무료 레슨
  101,   -- order_index
  NULL
FROM modules m
ORDER BY m.created_at
LIMIT 1;

-- 결과 확인
SELECT
  l.id,
  l.title,
  l.content_type,
  l.is_free,
  l.order_index,
  m.title as module_title
FROM lessons l
JOIN modules m ON l.module_id = m.id
WHERE l.content_type = 'blog'
ORDER BY l.created_at DESC;
