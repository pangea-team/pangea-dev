# Coding Convention

`pangea-dev`의 코딩 컨벤션 문서입니다. Biome로 자동화되지 않는 영역에 대한 팀 합의 사항을 정리합니다.

## 📑 Table of Contents

- [네이밍](#네이밍)
- [폴더 구조](#폴더-구조)
- [TypeScript](#typescript)
- [React / Next.js](#react--nextjs)
- [Styling (Tailwind CSS)](#styling-tailwind-css)
- [디자인 토큰 · 폰트 · 글로벌 스타일](#디자인-토큰--폰트--글로벌-스타일)

## 네이밍

| 대상 | 규칙 | 예시 |
| :--- | :--- | :--- |
| 파일명 | `kebab-case` | `user-profile.tsx` |
| 컴포넌트 | `PascalCase` | `UserProfile` |
| 변수 / 함수 | `camelCase` | `getUserData` |
| 상수 | `UPPER_SNAKE_CASE` | `MAX_RETRY_COUNT` |
| 타입 | `PascalCase` | `type User = { ... }` |
| Boolean | `is`, `has`, `should` 접두사 | `isLoading`, `hasError` |
| 이벤트 핸들러 (내부) | `handle*` | `handleClick` |
| 이벤트 핸들러 (props) | `on*` | `onClick`, `onSubmit` |

> 타입 선언은 `type`으로 통일합니다. (`interface` 사용 지양)

## 폴더 구조

```
pangea-dev/
├── app/                         # Next.js App Router
│   ├── styles/                  # 글로벌 CSS, 컬러·타이포 토큰 (globals, colors, typography)
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
└── public/                      # 정적 파일 (로컬 폰트 woff2 등)
```

- 라우트별 화면 조립은 `app/.../page.tsx` 등에서 하고, 그 페이지 전용 UI는 같은 세그먼트의 `_components/`에 둔다.
- 여러 라우트에서 재사용되는 조각만 루트의 `components/`, `hooks/`, `lib/`로 올린다.
- import 경로는 `@/` absolute path 사용
- import 순서는 Biome가 자동 정렬

## TypeScript

- `any` 사용 금지 — 불가피할 경우 `unknown`으로 받고 narrowing
- 함수 파라미터가 3개 이상이면 객체로 받기
- 컴포넌트 props는 `Props` 타입으로 통일
- `as` 타입 단언은 최소화하고, 사용 시 사유를 주석으로 명시

```ts
type Props = {
  title: string;
  onClick: () => void;
};

export default function Button({ title, onClick }: Props) {
  // ...
}
```

## React / Next.js

- **Server Component 우선** — 필요할 때만 `'use client'` 선언
- `'use client'` 지시어는 파일 최상단에 명시
- 데이터 페칭은 Server Component에서 처리
- 클라이언트 mutation 및 캐싱이 필요한 경우 TanStack Query 사용
- 한 파일에 하나의 컴포넌트, `export default` 통일
- **폰트 로드**는 루트 `app/layout.tsx`에서만 `next/font`로 처리한다 (역할·변수명은 [디자인 토큰 · 폰트](#디자인-토큰--폰트--글로벌-스타일) 참고).

## Styling (Tailwind CSS)

- 클래스 순서는 Biome가 자동 정렬
- 반복되는 클래스 조합은 `cn()` 유틸 + `cva` 활용
- 디자인 토큰을 우선 사용하고, 임의값(`w-[327px]`)은 토큰이 없을 때만 사용
- 인라인 스타일(`style={{}}`) 사용 지양

## 디자인 토큰 · 폰트 · 글로벌 스타일

PR [#14](https://github.com/pangea-team/pangea-dev/pull/14)에서 도입한 초기 레이아웃·디자인 시스템을 기준으로 한다.

### 스타일·토큰 소스

- **글로벌 스타일과 토큰 정의는 `app/styles/`에 둔다.** (`globals.css`, `colors.css`, `typography.css`)
- `app/styles/globals.css`는 `tailwindcss` import 후 `colors.css` · `typography.css`를 가져오고, `body` 기본 배경·글자색을 둔다.
- 컴포넌트·페이지에 **임의 색(hex)·임의 `font-family`**를 남발하지 않는다. **Tailwind v4 `@theme` / `:root`**와 **`typography.css`의 타이포 토큰·유틸 클래스**를 우선한다.
- 새 색·타이포가 필요하면 **토큰을 먼저 추가**한 뒤 사용한다. 필요 여부가 불명확하면 팀과 합의한다.

### 컬러 시스템 (`colors.css`)

- `@theme`에 팔레트(ink, surface, tint 등)를 정의하고, `:root`에 시맨틱 별칭(`--background`, `--text`, `--primary` 등)을 둔다.
- `@theme inline`으로 `bg-background` 등에 쓰는 **`--color-background`**, **`--color-text`** 등을 `:root` 변수와 연결한다.

### 폰트 역할 및 변수 (`layout.tsx` + `typography.css`)

폰트는 **역할별로 고정**하고, **루트 `app/layout.tsx`에서만** `next/font`로 로드해 CSS 변수를 주입한다. 그 외 파일에서는 **`--font-*` 테마 변수**와 **`typography.css`의 `text-*` 유틸·클래스**만 사용한다.

| 역할 | 폰트 | 테마 변수 (`font-*`, `.text-*`) |
| :--- | :--- | :--- |
| 영문 세리프, 로고·디스플레이 | Cormorant (`next/font/google`) | `--font-cormorant` |
| 한글 메인(제목·본문 중심) | Noto Sans KR (`next/font/google`) | `--font-noto` |
| 한글 보조·모던 본문 | Pretendard (`next/font/local`, `public/fonts/` woff2 서브셋) | `--font-pretendard` |

- `layout.tsx`에서 각 폰트에 `variable: '--font-cormorant'` 등으로 지정한 뒤, 이를 `<html className={...}>`에 넣어 문서 전역에 전달한다. 기본 본문 폰트는 `<body>`에 `font-noto` 등 토큰 기반 유틸로 맞춘다.
- `typography.css`의 **`@theme`**에 타이포 크기·행간·굵기 토큰을 정의하고, **`@theme inline`**에서 `--font-cormorant` 등을 Tailwind `font-*` 유틸과 맞물리게 한다. **`.text-noto-*`**, **`.text-cormorant-*`**, **`.text-pretendard-*`** 클래스는 해당 패밀리의 `font-family`까지 묶어서 쓸 수 있다.
- **자체 호스팅 폰트**는 `public/fonts/`에 둔다. 가능하면 **woff2** 형식을 쓴다.

### Tailwind와 토큰

- 컬러·타이포 관련 클래스는 **`colors.css` · `typography.css`에 정의된 `@theme`/유틸**을 우선하고, **`-[...]` 임의값**은 해당 토큰이 없을 때만 허용한다 (위 Styling 절과 동일 취지).

### 전역 베이스 (`globals.css` / `body`)

`globals.css`의 **`body`**에는 이미 다음이 들어 있다. 즉 **클래스를 안 입혀도** 페이지 기본은 이 색이다.

```css
body {
  background: var(--color-background);
  color: var(--color-text);
}
```

- **의미:** `--color-background` / `--color-text`가 테마에 맞게 바뀌면, 페이지 전체 기본 배경·글자색도 같이 맞춰진다(라이트/다크 등 변수 설계 전제).
- **작업 시:** 어떤 **섹션·카드만** 배경이나 글자 대비를 다르게 쓰고 싶으면, 그 **블록 루트**에 배경·텍스트 색을 직접 지정한다. “`body`가 알아서 해 주겠지”처럼 **전역값에만 기대고 내부는 비워 두지 않는다**(가독·대비 깨짐 방지).
- **주의:** `bg-white`, `text-black`은 색이 **고정**이라, 테마·토큰과 어긋날 수 있다. 가능하면 **`colors.css` 등 토큰 기반** 클래스나 CSS 변수를 쓴다.
