# 코드 컨벤션

이 프로젝트는 **Biome**를 린터/포매터로 사용합니다. (ESLint/Prettier 아님)

## 자동화 기준 (Biome)

`biome.json` 설정 기준:

- **들여쓰기**: space, 2칸
- **줄 너비**: 100자
- **따옴표**: 싱글 쿼트 (`'`), JSX는 더블 쿼트 (`"`)
- **세미콜론**: 사용 (`always`)
- **trailing comma**: `all`
- **import 정렬**: Biome `organizeImports`가 자동 처리
- **Tailwind 클래스 순서**: Biome가 자동 정렬 (`pnpm check` 시 적용)
- **`any` 사용**: `warn` (불가피할 경우 `unknown` + narrowing)
- **non-null assertion (`!`)**: `warn` (최소화)

## import 규칙

Biome `organizeImports`가 자동 정렬합니다. 커밋 전 `pnpm check`를 실행하면 자동 적용됩니다.

- **경로는 `@/*` alias** 사용 (`tsconfig.json` `paths` 기준)
- 상대경로 (`../../..`)는 가능하면 피하고 alias로 정리합니다.

## 네이밍 규칙

| 대상 | 규칙 | 예시 |
| :--- | :--- | :--- |
| 컴포넌트 파일 | `PascalCase.tsx` | `FeedCard.tsx` |
| 컴포넌트 이름 | `PascalCase` | `FeedCard` |
| 훅 파일/함수 | `camelCase` / `use*` | `use-feed.ts`, `useGetFeedList` |
| 유틸/lib 파일 | `kebab-case` | `query-client.ts` |
| 변수 / 함수 | `camelCase` | `getUserData` |
| 상수 | `UPPER_SNAKE_CASE` | `MAX_RETRY_COUNT` |
| 타입 | `PascalCase` | `type User = { ... }` |
| Boolean | `is`, `has`, `should` 접두사 | `isLoading`, `hasError` |
| 이벤트 핸들러 (내부) | `handle*` | `handleClick` |
| 이벤트 핸들러 (props) | `on*` | `onClick`, `onSubmit` |

## TypeScript

- `type`으로 통일 (`interface` 사용 지양)
- `any` 금지 — 불가피할 경우 `unknown` + narrowing
- 함수 파라미터 3개 이상: 객체로 받기
- 컴포넌트 props: `Props` 타입으로 통일
- `as` 타입 단언은 최소화하고, 사용 시 사유를 주석으로 명시

```ts
type Props = {
  title: string;
  isActive: boolean;
  onClick: () => void;
};

export default function Button({ title, isActive, onClick }: Props) {
  // ...
}
```

## 파일/폴더 배치 규칙

**AI가 새 기능을 추가할 때의 기본 배치 원칙**입니다.

| 종류 | 위치 |
| :--- | :--- |
| 라우팅/페이지 | `app/**/page.tsx` |
| 라우트 레이아웃 | `app/**/layout.tsx` |
| 라우트 전용 컴포넌트 | `app/(route)/_components/` |
| 라우트 전용 훅 | `app/(route)/_hooks/` |
| 라우트 전용 유틸/목업 | `app/(route)/_lib/` |
| 공통 컴포넌트 (다수 라우트 재사용) | `components/` |
| 공통 훅 | `hooks/` |
| 유틸/클라이언트 인스턴스 | `lib/` |
| 공통 타입 | `types/` |
| 전역 스타일·토큰 | `app/styles/` |
| 정적 파일·폰트 | `public/` |

## React / Next.js 규칙

- **Server Component 우선** — 필요할 때만 `'use client'` 선언
- `'use client'`는 파일 **최상단** 첫 줄에 선언
- 한 파일에 하나의 컴포넌트, `export default` 사용
- 폰트 로드는 `app/layout.tsx`에서만 (`next/font`)

## 스타일링 규칙

- 클래스 순서는 Biome가 자동 정렬합니다.
- Tailwind 토큰 우선 (`text-noto-body-1`, `bg-background`, `p-comp-sm` 등)
- 임의값 (`w-[327px]`)은 토큰이 없을 때만 허용
- 인라인 `style={{}}` 지양
- `cn()` 사용 범위:
  - ✅ 외부 `className` prop 머지: `cn('base', className)`
  - ✅ 2개 이상의 조건부 클래스: `cn('base', isActive && 'active')`
  - ❌ 단순 정적 클래스 나열: `cn('mt-4 text-primary')` → `"mt-4 text-primary"`
  - ❌ 변수와 정적 클래스 단순 결합: `cn(baseStyles, 'mt-4')` → `` `${baseStyles} mt-4` ``

## "새로 추가할 때" 체크리스트

- [ ] 같은 도메인의 기존 폴더 구조를 그대로 따랐는가?
- [ ] 라우팅은 App Router 규칙을 준수했는가? (`page.tsx`, `layout.tsx`)
- [ ] 컴포넌트 배치 경계가 올바른가? (라우트 전용 vs 공통)
- [ ] `'use client'` 필요 여부를 확인했는가?
- [ ] alias import를 사용했는가? (`@/` 사용)
- [ ] `pnpm check` + `pnpm build`를 통과할 수 있는가?
