# Coding Convention

`pangea-dev`의 코딩 컨벤션 문서입니다. Biome로 자동화되지 않는 영역에 대한 팀 합의 사항을 정리합니다.

## 📑 Table of Contents

- [Biome 자동화 기준](#biome-자동화-기준)
- [네이밍](#네이밍)
- [폴더 구조](#폴더-구조)
- [TypeScript](#typescript)
- [React / Next.js](#react--nextjs)
- [Styling (Tailwind CSS)](#styling-tailwind-css)

## Biome 자동화 기준

이 프로젝트는 **Biome**를 린터/포매터로 사용합니다 (ESLint/Prettier 아님). 아래 항목은 `biome.json` 설정 기준으로 자동 적용되며, 커밋 전 `pnpm check` 실행 시 모두 반영됩니다.

| 항목 | 설정 |
| :--- | :--- |
| 들여쓰기 | space, 2칸 |
| 줄 너비 | 100자 |
| 따옴표 | 싱글 (`'`), JSX는 더블 (`"`) |
| 세미콜론 | 항상 사용 (`always`) |
| trailing comma | `all` |
| import 정렬 | `organizeImports` 자동 처리 |
| Tailwind 클래스 순서 | 자동 정렬 |
| `any` 사용 | `warn` — 불가피하면 `unknown` + narrowing |
| non-null assertion (`!`) | `warn` — 최소화 |

> Husky `pre-commit` 훅이 `lint-staged`를 통해 변경된 `*.{js,jsx,ts,tsx,json}` 파일에 `biome check --write`를 자동 실행합니다.

## 네이밍

| 대상 | 규칙 | 예시 |
| :--- | :--- | :--- |
| 컴포넌트 파일 | `PascalCase` | `UserProfile.tsx` |
| 컴포넌트 | `PascalCase` | `UserProfile` |
| 훅 파일 | `kebab-case` + `use-` 접두사 | `use-feed.ts` |
| 훅 함수 | `camelCase` + `use` 접두사 | `useGetFeedList` |
| 유틸 / lib 파일 | `kebab-case` | `query-client.ts` |
| 변수 / 함수 | `camelCase` | `getUserData` |
| 상수 | `UPPER_SNAKE_CASE` | `MAX_RETRY_COUNT` |
| 타입 | `PascalCase` | `type User = { ... }` |
| Boolean | `is`, `has`, `should` 접두사 | `isLoading`, `hasError` |
| 이벤트 핸들러 (내부) | `handle*` | `handleClick` |
| 이벤트 핸들러 (props) | `on*` | `onClick`, `onSubmit` |

> 타입 선언은 `type`으로 통일합니다. (`interface` 사용 지양)

## 폴더 구조

​```text
pangea-dev/
├── app/                         # Next.js App Router
│   └── (route)/                 # 라우트 세그먼트별
│       ├── page.tsx
│       ├── layout.tsx
│       ├── _components/         # 해당 라우트(트리) 전용 컴포넌트
│       ├── _hooks/              # 해당 라우트 전용 훅 (필요 시)
│       ├── _lib/                # 해당 라우트 전용 목업·토큰 등 (필요 시)
│       └── ...                  # loading, error, route handlers 등
├── components/                  # 여러 라우트에서 쓰는 공통 UI
├── hooks/                       # 공통 훅
├── lib/                         # 유틸 & 외부 클라이언트
├── types/                       # 공통 타입
└── public/                      # 정적 파일
​```

- 라우트별 화면 조립은 `app/.../page.tsx` 등에서 하고, 그 페이지 전용 UI는 같은 세그먼트의 `_components/`에 둔다.
- 여러 라우트에서 재사용되는 조각만 루트의 `components/`, `hooks/`, `lib/`로 올린다.
- import 경로는 `@/` absolute path 사용
- import 순서는 Biome가 자동 정렬

## TypeScript

- `any` 사용 금지 — 불가피할 경우 `unknown`으로 받고 narrowing
- 함수 파라미터가 3개 이상이면 객체로 받기
- 컴포넌트 props는 `Props` 타입으로 통일
- `as` 타입 단언은 최소화하고, 사용 시 사유를 주석으로 명시

​```ts
type Props = {
  title: string;
  onClick: () => void;
};

export default function Button({ title, onClick }: Props) {
  // ...
}
​```

## React / Next.js

- **Server Component 우선** — 필요할 때만 `'use client'` 선언
- `'use client'` 지시어는 파일 최상단에 명시
- 데이터 페칭은 Server Component에서 처리
- 클라이언트 mutation 및 캐싱이 필요한 경우 TanStack Query 사용
- 한 파일에 하나의 컴포넌트, `export default` 통일
- `next/image`에서 `public` 이미지 사용 시 문자열 경로(`src="/images/..."`) 대신 정적 import를 사용한다.
- 라우트 경로는 하드코딩하지 않고 `lib/constants/path.ts`의 `PATH` 상수를 사용한다. 동적 경로는 `PATH.FEED_USER(userId)`처럼 함수 형태로 호출.


## Styling (Tailwind CSS)

- 클래스 순서는 Biome가 자동 정렬
- 디자인 토큰을 우선 사용 — 색/간격/폰트는 `app/styles/colors.css`, `spacing.css`, `typography.css`에 정의된 토큰을 사용
- 반응형 규칙(유동 토큰 vs 브레이크포인트, `page-x`/`content-x`, `sm`/`md`/`xl` 역할)은 [AGENTS.md](../AGENTS.md) 스타일링 섹션 참고
- 토큰에 없는 값만 임의값(`w-[327px]`) 사용
- 인라인 스타일(`style={{}}`) 사용 지양
- **`cn()` 은 다음 두 경우에만 사용**:
  - 외부 `className` prop 머지: `cn('base', className)`
  - 2개 이상의 조건부 클래스: `cn('base', isActive && 'border-primary')`
  - 그 외엔 일반 문자열 또는 템플릿 리터럴 사용
    - ❌ `cn('mt-4 text-primary')` → ✅ `"mt-4 text-primary"`
    - ❌ `cn(baseStyles, 'mt-4')` → ✅ `` `${baseStyles} mt-4` ``


