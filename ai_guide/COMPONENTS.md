# Components Guide

이 문서는 "컴포넌트를 어디에 만들고, 어떤 기준으로 분리하는지"를 정리합니다.
AI가 새 UI를 추가할 때 **기존 코드의 경계(라우트 전용 vs 공통, Server vs Client)를 깨지 않도록** 하는 것이 목적입니다.

## 디렉토리 경계

### `app/(route)/_components/`

- 해당 라우트 세그먼트 **하위 트리에서만** 쓰이는 UI를 둡니다.
- 다른 라우트가 가져가면 안 됩니다.
- 예:
  - `app/(auth)/login/_components/KaKaoLoginButton.tsx` — 로그인 페이지 전용
  - `app/feed/_components/FeedCard.tsx` — feed 라우트 전용

### `components/`

- **실제로 여러 라우트**에서 재사용되는 공통 UI를 둡니다.
- 현재 파일: `Header.tsx`, `Icon.tsx`
- 한 곳에서만 쓰이는 컴포넌트는 여기로 끌어올리지 않습니다.

> 규칙: 한 번만 쓰이면 라우트 `_components/`에, 두 번째 재사용이 생기면 `components/`로 올립니다.

---

## Server Component 기준 (기본)

**별도 선언 없으면 Server Component**입니다.

다음 중 하나라도 해당하면 파일 최상단에 `'use client';`를 선언합니다.

- `useState`, `useEffect` 등 React hook 사용
- `localStorage`, `window`, `document` 사용
- TanStack Query hooks (`useQuery`, `useMutation`) 사용
- Next.js 클라이언트 훅 (`useRouter`, `useSearchParams`, `usePathname`) 사용
- 이벤트 핸들러가 있는 인터랙티브 컴포넌트

예시:

- `app/(auth)/login/_components/KaKaoLoginButton.tsx` — 버튼 클릭 이벤트 → `'use client'`
- `app/sentence/[bookId]/page.tsx` — 데이터 페칭만 → Server Component

---

## 컴포넌트 파일 규칙

- 파일명: **PascalCase** (예: `FeedCard.tsx`, `OrderSummary.tsx`)
- 한 파일에 **하나의 컴포넌트**, `export default`로 통일
- props 타입은 `Props`로 통일:

```tsx
type Props = {
  title: string;
  onClick: () => void;
};

export default function FeedCard({ title, onClick }: Props) {
  // ...
}
```

---

## 스타일링 규칙 (컴포넌트 내)

- Tailwind 토큰(`text-noto-body-1`, `bg-background`, `p-comp-sm` 등)을 우선합니다.
- `cn()`은 다음 두 경우에만 사용합니다:
  - 외부 `className` prop 머지: `cn('base-class', className)`
  - 2개 이상의 조건부 클래스: `cn('base', isActive && 'border-primary')`
- 단순 정적 클래스 나열에는 `cn()`을 쓰지 않습니다.
- 인라인 `style={{}}` 사용을 지양합니다.

---

## 이미지/에셋 규칙

- 이미지는 `next/image`를 우선 사용합니다.
- SVG 아이콘은 `components/Icon.tsx` + `lib/iconMap.ts` 패턴을 참고합니다.
- 외부 이미지 호스트는 `next.config.ts`의 `images.remotePatterns`로 허용합니다.

---

## "새 컴포넌트 추가" 체크리스트

- [ ] 어느 라우트에서만 쓰이는가? → `app/(route)/_components/`
- [ ] 여러 라우트에서 실제로 재사용되는가? → `components/`
- [ ] `'use client'`가 필요한가? (hook, 이벤트, 브라우저 API 등)
- [ ] 타이포 유틸 클래스 + 컬러 토큰으로 스타일링했는가?
- [ ] `cn()`은 필요한 경우에만 사용했는가?
- [ ] props 타입을 `Props`로 선언했는가?
