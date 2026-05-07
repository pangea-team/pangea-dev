# 아키텍처 개요 (Big picture)

이 프로젝트는 `app/` 기반의 **App Router** 구조를 사용합니다.

- 라우트 맵·세부 규칙은 `ROUTING.md`를 단일 소스로 봅니다.

전역 레이아웃은 `app/layout.tsx`에서 구성합니다.

- 전역 CSS import: `app/styles/globals.css`
- 폰트 로드(Cormorant, Noto Serif KR, Pretendard)는 여기서만 수행합니다.

## 폴더 구조 원칙

```
pangea-dev/
├── app/                    # Next.js App Router
│   ├── styles/             # 글로벌 CSS, 디자인 토큰 (globals, colors, typography, spacing)
│   ├── (auth)/             # 인증 라우트 그룹 (URL에 영향 없음)
│   └── (route)/            # 라우트 세그먼트
│       ├── page.tsx        # 페이지 조립만 담당
│       ├── layout.tsx      # 세그먼트 레이아웃 (필요 시)
│       ├── _components/    # 해당 라우트 전용 UI
│       ├── _hooks/         # 해당 라우트 전용 훅 (필요 시)
│       └── _lib/           # 해당 라우트 전용 유틸/목업 (필요 시)
├── components/             # 여러 라우트에서 재사용하는 공통 UI
├── hooks/                  # 공통 훅
├── lib/                    # 유틸 & 외부 클라이언트 인스턴스
├── types/                  # 공통 타입
└── public/                 # 정적 파일 (로컬 폰트 woff2 등)
```

- 페이지(`page.tsx`)는 UI 조립만 담당하고, 실 UI 구현은 `_components/`로 분리합니다.
- **실제로 여러 라우트에서 공유되는 코드만** `components/`, `hooks/`, `lib/`로 올립니다.
- import 경로는 `@/*` absolute path를 사용합니다 (`tsconfig.json` `paths` 기준).

## 데이터/상태 흐름

### Server Component 우선

- 기본적으로 모든 컴포넌트는 **Server Component**입니다.
- 데이터 페칭은 Server Component(`page.tsx` 또는 `_components/` 내 서버 컴포넌트)에서 직접 처리합니다.
- `useState`, `useEffect`, 브라우저 API, TanStack Query hooks 등 클라이언트 기능이 필요한 경우에만 파일 상단에 `'use client';`를 선언합니다.

### TanStack Query (클라이언트 mutation/캐싱)

- 클라이언트에서 mutation이나 캐시 관리가 필요한 경우 TanStack Query를 사용합니다.
- QueryClient는 `lib/queryClient.ts`에서 생성하고, Provider는 `components/ReactQueryProvider.tsx`로 연결합니다.
- 새 도메인 훅은 `app/(route)/_hooks/` 또는 `hooks/` 아래에서 관리합니다.

> TanStack Query가 아직 설치되지 않은 경우 `pnpm add @tanstack/react-query`로 추가합니다.

## 스타일링/토큰

- 스타일·토큰의 단일 소스는 `STYLING_TOKENS.md`입니다.
- 진입점: `app/styles/globals.css` → `colors.css`, `typography.css`, `spacing.css`를 순서대로 import합니다.

## 폰트 (3가지)

폰트 로드는 **`app/layout.tsx`에서만** 수행하며, 그 외 파일에서는 CSS 변수·타이포 클래스만 사용합니다.

| 역할 | 폰트 | CSS 변수 |
| :--- | :--- | :--- |
| 영문 세리프, 로고·디스플레이 | Cormorant (Google) | `--font-cormorant` |
| 한글 메인, 제목·본문 | Noto Serif KR (Google) | `--font-noto` |
| 한글 보조, 모던 본문 | Pretendard (로컬 woff2) | `--font-pretendard` |

## 에셋/이미지/SVG

- 이미지는 `next/image`를 우선 사용합니다.
- 외부 이미지 호스트는 `next.config.ts`의 `images.remotePatterns`로 허용합니다.
- SVG는 `@svgr/webpack`으로 React 컴포넌트 import가 가능합니다 (webpack rule 설정됨).
- 로컬 폰트는 `public/fonts/`에 woff2로 보관합니다.
