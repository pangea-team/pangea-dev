@AGENTS.md
# CLAUDE.md

이 파일은 Claude Code(claude.ai/code)가 이 저장소에서 작업할 때 참고하는 가이드입니다.

@AGENTS.md

## 명령어

- `pnpm dev` — Next.js 개발 서버 실행
- `pnpm build` — 프로덕션 빌드 (푸시 전 반드시 통과해야 함)
- `pnpm check` — Biome lint + format 자동 적용 (`--write`, 커밋 전 실행)
- `pnpm lint` / `pnpm format` — lint 또는 format만 실행

테스트 러너는 설정되어 있지 않습니다.

## 스택 정보

- **Next.js 16.2.4** (App Router 전용). AGENTS.md에 명시된 대로, 이 버전은 학습 데이터와 비교해 breaking changes가 있으므로 Next.js 관련 코드를 작성하기 전에 `node_modules/next/dist/docs/`의 관련 문서를 먼저 읽을 것.
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

### 스타일링 시스템

- 글로벌 진입점: `app/styles/globals.css`에서 Tailwind, `colors.css`, `typography.css`를 import. `app/layout.tsx`에서 한 번만 로드됨.
- `app/styles/colors.css`는 색상 토큰(`--color-ink-*`, `--color-tint-*` 등)과 시맨틱 별칭(`--color-background`, `--color-text`, `--color-primary` 등)을 정의함.
- `app/styles/typography.css`는 텍스트 토큰(예: `text-noto-body-1`)을 정의하고 클래스별로 `font-family`도 함께 바인딩함. 따라서 `<p className="text-noto-body-1">`만으로 이미 Noto Serif KR이 적용되므로 별도의 `font-*` 유틸리티를 함께 쓰지 말 것.
- `app/styles/spacing.css`는 반응형 간격 토큰(`--spacing-comp-*`, `--spacing-section-*`, `--spacing-hero`, `--spacing-page-x` 등)을 `clamp()`로 정의함. 간격을 적용할 때:
  - **작은 값(4~24px)**: Tailwind 기본 scale(`p-1` ~ `p-6`, `gap-1` ~ `gap-6` 등) 그대로 사용 — 화면 크기에 따라 변하지 않아도 되는 자잘한 간격.
  - **중간(컴포넌트 간) / 큰(섹션 간) 값**: `spacing.css`의 반응형 토큰 사용 (`p-section-md`, `gap-comp-sm` 등). 직접 `clamp()`나 임의값(`py-[80px]`)을 쓰지 말 것
- body에는 암묵적으로 `background: var(--color-background)`와 `color: var(--color-text)`가 적용되어 있음. 즉 `bg-background`, `text-primary`(기본 텍스트 색)는 이미 상속되므로 다시 붙이지 말 것 — 의도적으로 기본값과 다르게 할 때만 오버라이드.

### 폰트 (3가지, `app/layout.tsx`에 연결됨)

- `--font-cormorant` (Google Cormorant) — 영문 serif, 로고/디스플레이용
- `--font-noto` (Google Noto Serif KR) — 한글 메인, 제목 및 본문
- `--font-pretendard` (로컬 woff2, `public/fonts/`) — 한글 보조, 모던 본문
- 크기/줄높이/굵기/패밀리가 함께 결정되도록, raw `font-*` 유틸리티보다 타이포그래피 유틸리티 클래스(`text-{family}-*`)를 우선 사용할 것.

## 컨벤션

전체 목록은 CODING_CONVENTION.md에 있습니다. 핵심만 추리면:

- 컴포넌트 파일명: `PascalCase.tsx`. 컴포넌트: `PascalCase`. `interface` 대신 `type` 사용.
- 한 파일에 하나의 컴포넌트, `export default` 사용.
- 컴포넌트 props 타입은 `Props`로 통일. 함수 파라미터가 3개 이상이면 객체로 받기.
- `any`는 Biome가 경고 — `unknown`으로 받고 narrowing 할 것.
- 인라인 `style={{}}` 지양, Tailwind 토큰 사용. 임의값(`w-[327px]`)은 토큰이 없을 때만.
- `cn()`은 외부 `className` 머지 또는 2개 이상의 조건부 클래스에만 사용 — 자세한 건 CODING_CONVENTION.md 참고.
- 이벤트 핸들러: 내부는 `handle*`, props는 `on*`.

## Git 워크플로우

- `dev`에서 브랜치를 분기하고 `dev`로 머지. `main`은 배포 브랜치.
- commitlint가 commit-msg 훅을 통해 Conventional Commits를 강제함.
  - 허용 타입: `feat`, `fix`, `chore`, `refactor`, `docs`, `style` (소문자만)
  - 형식: `<type>: <subject> (#issue)` — 이슈 번호 필수, 헤더 100자 이하, 끝에 마침표 없음
- 푸시 전: `pnpm check`와 `pnpm build`가 모두 통과해야 함. CI는 Lint & Build(`.github/workflows/ci.yml`)를 실행하며 실패 시 머지가 차단됨.

## 작업 방식

- **코딩 전 계획 수립**: 3개 이상의 파일이나 50줄 이상에 영향을 주는 작업은 먼저 계획을 제시하고 승인을 기다릴 것. 곧바로 코드 작성 시작 금지.
- **가정은 명시적으로**: 요청이 모호하면 진행하기 전에 가정을 나열할 것. 한 가지 해석으로 조용히 밀고 나가지 말 것.
- **외과적 변경**: 요청된 부분만 수정할 것. 시키지 않은 인접 코드/주석/포맷을 "개선"하지 말 것.
- **기존 패턴 따르기**: 새 패턴을 만들기 전에 코드베이스에 비슷한 패턴이 있는지 먼저 확인할 것 (예: `_components/`의 형제 파일들).
- **섣부른 추상화 금지**: 한 번만 쓰이는 로직은 인라인으로 둘 것. 두세 번째 출현부터 추출할 것.
- **트레이드오프 드러내기**: 유효한 접근법이 여러 개일 때, 조용히 하나를 고르지 말고 각각을 명명하고 하나를 추천할 것.