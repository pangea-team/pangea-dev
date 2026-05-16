<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

---

# 프로젝트 가이드

이 파일은 AI 코딩 에이전트(Claude Code, Cursor, Copilot 등)가 이 저장소에서 작업할 때 참고하는 가이드입니다.

## 작업 방식

- **코딩 전 계획 수립**: 3개 이상의 파일이나 50줄 이상에 영향을 주는 작업은 먼저 계획을 제시하고 승인을 기다릴 것. 곧바로 코드 작성 시작 금지.
- **가정은 명시적으로**: 요청이 모호하면 진행하기 전에 가정을 나열할 것. 한 가지 해석으로 조용히 밀고 나가지 말 것.
- **외과적 변경**: 요청된 부분만 수정할 것. 시키지 않은 인접 코드/주석/포맷을 "개선"하지 말 것.
- **기존 패턴 따르기**: 새 패턴을 만들기 전에 코드베이스에 비슷한 패턴이 있는지 먼저 확인할 것 (예: `_components/`의 형제 파일들).
- **섣부른 추상화 금지**: 한 번만 쓰이는 로직은 인라인으로 둘 것. 두세 번째 출현부터 추출할 것.
- **트레이드오프 드러내기**: 유효한 접근법이 여러 개일 때, 조용히 하나를 고르지 말고 각각을 명명하고 하나를 추천할 것.

## 명령어

- `pnpm dev` — Next.js 개발 서버 실행
- `pnpm build` — 프로덕션 빌드 (푸시 전 반드시 통과해야 함)
- `pnpm start` — 빌드 산출물 실행
- `pnpm check` — Biome lint + format 자동 적용 (`--write`, 커밋 전 실행)
- `pnpm lint` / `pnpm format` — lint 또는 format만 실행
- `pnpm db:types` — Supabase 스키마로부터 `lib/supabase/database.types.ts` 재생성 (DB 스키마 변경 시 실행 후 커밋)

테스트 러너는 설정되어 있지 않습니다.

## 스택 정보

- **Next.js 16.2.4** (App Router 전용). 위 nextjs-agent-rules에 명시된 대로, 이 버전은 학습 데이터와 비교해 breaking changes가 있으므로 Next.js 관련 코드를 작성하기 전에 `node_modules/next/dist/docs/`의 관련 문서를 먼저 읽을 것.
- **React 19.2.4** + React Server Components. 기본은 Server Component이며, 필요할 때만 `'use client'`를 추가할 것.
- **Tailwind CSS v4** (PostCSS 기반). 디자인 토큰은 `app/styles/colors.css`와 `app/styles/typography.css`의 `@theme` 블록에 정의되어 있으며, Tailwind가 이 토큰들로부터 유틸리티 클래스를 자동 생성함.
- **Biome**가 린터/포매터 (ESLint/Prettier 아님). Husky pre-commit 훅이 lint-staged를 통해 `biome check --write`를 실행함.
- **pnpm 10.33.0**이 `packageManager` 필드로 고정되어 있음 — npm/yarn lockfile을 추가하지 말 것.

## 아키텍처

### 라우팅 & 레이아웃

- 모든 라우트는 `app/` 아래에 위치. 라우트 세그먼트 내에서 `_` 접두사가 붙은 폴더는 해당 세그먼트 전용:
  - `_components/` — 해당 라우트 하위 트리에서만 쓰이는 UI
  - `_hooks/`, `_lib/` — 해당 세그먼트 전용 헬퍼
- 루트 레벨의 `components/`, `hooks/`, `lib/`, `types/`는 **여러 라우트 세그먼트에서 재사용되는 코드 전용**. 실제로 공유되는 게 아니면 위로 끌어올리지 말 것.
- import 경로는 `@/*` absolute path 사용 (`tsconfig.json`에 설정됨).
- `(auth)`는 인증 페이지용 route group — 괄호는 URL 구조에 영향을 주지 않음.
- Server Component에서 `params`는 **`Promise`** 로 전달됨 (Next.js 16+). `const { id } = await params;` 패턴으로 접근.

### 스타일링 시스템

- 글로벌 진입점: `app/styles/globals.css`에서 Tailwind, `spacing.css`, `colors.css`, `typography.css`를 import. `app/layout.tsx`에서 한 번만 로드됨.
- `app/styles/colors.css`는 색상 토큰(`--color-ink-*`, `--color-tint-*` 등)과 시맨틱 별칭(`--color-background`, `--color-text`, `--color-primary` 등)을 정의함.
- `app/styles/typography.css`는 텍스트 토큰(예: `text-noto-body-1`)을 정의하고 클래스별로 `font-family`도 함께 바인딩함. 따라서 `<p className="text-noto-body-1">`만으로 이미 Noto Serif KR이 적용되므로 별도의 `font-*` 유틸리티를 함께 쓰지 말 것.
- `app/styles/spacing.css`에 간격·레이아웃·아바타 토큰이 정의되어 있음 (`app/styles/spacing.css` 주석 참고). 적용 규칙:
  - **작은 값(4~24px)**: Tailwind 기본 scale(`gap-2`, `p-4` 등) — 아이콘·라벨·폼 필드 내부만.
  - **중간~큰 간격**: `gap-comp-sm`, `gap-section-md`, `px-page-x` 등 **토큰 유틸만** 사용. 컴포넌트에 `clamp()`·`py-[80px]` 금지.
  - **레이아웃 max-width**: `max-w-layout-feed`, `max-w-layout-explore`, `max-w-layout-content`, `max-w-layout-form` 등 토큰 사용.
  - **가로 패딩**: 일반 페이지 `px-page-x`, 홈·에디토리얼 블록 `px-content-x` / `py-content-y` — 한 래퍼에만 적용(이중 패딩 금지).
- **반응형 2계층** (혼용 규칙):
  1. **유동 토큰** — `spacing.css`·`typography.css`의 `clamp()`가 뷰포트에 따라 스케일 (`gap-comp-sm`, `text-noto-display`, `text-noto-profile-name`).
  2. **브레이크포인트** — **레이아웃 구조만** (`flex-col`→`md:flex-row`, `grid-cols-1`→`md:grid-cols-2`, `hidden`/`sticky`). 같은 축의 `gap`을 브레이크포인트로 바꿀 때는 **열 수·방향이 바뀔 때만** (예: 피드 1열→2열 시 `md:gap-x-section-sm`).
- **브레이크포인트 역할** (Tailwind 기본):
  - `sm` (640px): 헤더·푸터·드로어 등 **크롬 UI**만.
  - `md` (768px): 본문 **2열·가로 배치** 전환의 기본.
  - `xl` (1280px): 피드 **3열 그리드** 등 넓은 데스크톱 전용.
- body에는 암묵적으로 `background: var(--color-background)`와 `color: var(--color-text)`가 적용되어 있음. 즉 `bg-background`, `text-primary`(기본 텍스트 색)는 이미 상속되므로 다시 붙이지 말 것 — 의도적으로 기본값과 다르게 할 때만 오버라이드.

### 폰트 (3가지, `app/layout.tsx`에 연결됨)

- `--font-cormorant` (Google Cormorant) — 영문 serif, 로고/디스플레이용
- `--font-noto` (Google Noto Serif KR) — 한글 메인, 제목 및 본문
- `--font-pretendard` (로컬 woff2, `public/fonts/`) — 한글 보조, 모던 본문
- 크기/줄높이/굵기/패밀리가 함께 결정되도록, raw `font-*` 유틸리티보다 타이포그래피 유틸리티 클래스(`text-{family}-*`)를 우선 사용할 것.

## 컨벤션

코드 스타일, 네이밍, TypeScript/React 규칙, Tailwind 사용법 등 세부 규칙은 [CODING_CONVENTION.md](./docs/CODING_CONVENTION.md)를 참고할 것.

## Git 워크플로우

브랜치 전략, 커밋 컨벤션, PR 절차는 [CONTRIBUTING.md](./docs/CONTRIBUTING.md)를 참고할 것.