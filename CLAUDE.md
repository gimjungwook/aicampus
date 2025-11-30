# AI Campus MVP

## 프로젝트 개요
비기술 직군을 위한 AI 활용 교육 플랫폼

## 진행 상황 추적

구현 진행 상황은 `../docs/` 폴더의 Phase별 문서에서 추적합니다:
- `../docs/README.md` - 전체 진행 현황 대시보드
- `../docs/phase-X-*.md` - 각 Phase별 상세 체크리스트

### Phase 작업 완료 시
1. 해당 `phase-X.md` 파일의 체크박스를 `[x]`로 변경
2. `../docs/README.md`의 진행률 및 상태 업데이트
3. Total Progress 갱신

### 현재 진행 상태
- Phase 0: 환경 설정 - ✅ 완료 (8/8)
- Phase 1: Database - ✅ 완료 (6/6)
- Phase 2: 인증 시스템 - ✅ 완료 (7/7)
- Phase 3: 공통 컴포넌트 - ✅ 완료 (9/9)
- Phase 4: 코스 시스템 - ✅ 완료 (9/9)
- Phase 5: AI 샌드박스 - ✅ 완료 (11/11)
- Phase 6: 사용자 기능 - ✅ 완료 (7/7)
- Phase 7: 마무리 & 배포 - ✅ 완료 (7/7)
- Phase 8: 블로그 렌더링 - ⬜ 대기 (0/6)
- Phase 9: 콘텐츠 관리 - ⬜ 대기 (0/6)

---

## 기술 스택
- **프레임워크**: Next.js 16+ (App Router)
- **스타일링**: Tailwind CSS
- **백엔드**: Supabase (Auth, DB, Storage, Edge Functions)
- **AI**: Google Gemini 2.0 Flash
- **배포**: Vercel

---

## 주요 명령어

```bash
# 개발 서버
npm run dev                    # http://localhost:3000

# Supabase
supabase db push              # DB 마이그레이션 적용
supabase functions deploy     # Edge Function 배포
supabase secrets set KEY=val  # 시크릿 설정

# 빌드
npm run build
npm start
```

---

## 프로젝트 구조

```
aicampus/
├── src/
│   ├── app/           # Next.js 페이지 (App Router)
│   ├── components/    # React 컴포넌트
│   └── lib/           # 유틸리티 및 Supabase 클라이언트
├── supabase/
│   ├── functions/     # Edge Functions
│   └── migrations/    # DB 마이그레이션
├── .env.local         # 환경 변수 (git 제외)
└── CLAUDE.md          # 이 파일
```

---

## Supabase 프로젝트
- **Project Ref**: `nirsvkvnqmeqzdaphnim`
- **Region**: South Asia (Mumbai)
- **URL**: https://nirsvkvnqmeqzdaphnim.supabase.co

---

## 사용량 제한
- 레슨 샌드박스: 5회/레슨/일
- 독립 샌드박스: 20회/일
- 초기화 시간: KST 00:00
