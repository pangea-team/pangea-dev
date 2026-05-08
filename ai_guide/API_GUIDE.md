# API Guide

이 프로젝트의 데이터 레이어는 다음 원칙을 따릅니다.

- **Server Component 우선**: 데이터 페칭은 기본적으로 Server Component에서 처리합니다.
- **TanStack Query**: 클라이언트 mutation, 캐시 관리, 낙관적 업데이트가 필요한 경우에만 사용합니다.
- **도메인별 분리**: API 로직을 라우트나 컴포넌트에 직접 두지 않고 별도 모듈로 분리합니다.

---

## Server Component 데이터 페칭 (기본 패턴)

Server Component에서 직접 `fetch` 또는 API 클라이언트를 사용합니다.

```tsx
// app/feed/page.tsx (Server Component)
export default async function FeedPage() {
  const data = await fetch(`${process.env.API_URL}/feeds`).then(r => r.json());
  return <FeedList items={data} />;
}
```

- Next.js App Router의 Server Component에서는 `async/await`를 바로 쓸 수 있습니다.
- 민감한 키/토큰은 서버에서만 사용하고 `NEXT_PUBLIC_` prefix를 붙이지 않습니다.

---

## TanStack Query (클라이언트 mutation/캐싱)

클라이언트에서 mutation이나 캐시 관리가 필요한 경우 TanStack Query를 사용합니다.

> TanStack Query가 설치되어 있지 않은 경우:
> ```bash
> pnpm add @tanstack/react-query
> ```

### 설정

- QueryClient: `lib/queryClient.ts`에서 생성합니다.
- Provider: `components/ReactQueryProvider.tsx` (Client Component) 로 연결합니다.
- Provider는 `app/layout.tsx`의 `<body>` 안에 감쌉니다.

### 도메인 훅 배치

| 범위 | 위치 |
| :--- | :--- |
| 특정 라우트에서만 쓰이는 훅 | `app/(route)/_hooks/` |
| 여러 라우트에서 공유하는 훅 | `hooks/` |

### 파일 구조 (권장)

도메인별로 아래 패턴을 따릅니다.

```
app/(route)/
└── _hooks/
    └── use-feed.ts       # useQuery / useMutation hooks
```

또는 여러 곳에서 쓰인다면:

```
hooks/
└── use-feed.ts
```

### Hook 네이밍

- Query hook: `useGet{Resource}` (예: `useGetFeedList`)
- Mutation hook: `usePost{Resource}`, `usePatch{Resource}`, `useDelete{Resource}`

### 기본 패턴

```ts
// hooks/use-feed.ts
'use client';

import { useQuery } from '@tanstack/react-query';

export function useGetFeedList() {
  return useQuery({
    queryKey: ['feeds'],
    queryFn: () => fetch('/api/feeds').then(r => r.json()),
  });
}
```

- `enabled: !!id` 패턴으로 파라미터가 준비되기 전 쿼리를 방지합니다.
- mutation 이후 캐시 처리:
  - **invalidate**: 목록/연관 데이터 갱신이 필요할 때
  - **setQueryData**: 응답으로 상세 캐시를 부분 업데이트할 때
  - **removeQueries**: 삭제 후 상세 캐시를 제거할 때

---

## HTTP 클라이언트 (axios 도입 시)

axios가 필요하면 인스턴스를 **`lib/axiosInstance.ts` 하나**에서만 생성합니다.

```ts
// lib/axiosInstance.ts
import axios from 'axios';

export const axiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  timeout: 5000,
});
```

- request interceptor: 인증 토큰 첨부
- response interceptor: 401 처리, 에러 로깅
- API 호출 함수는 `lib/axiosInstance.ts`를 import해서 사용하며, 컴포넌트에서 직접 axios를 쓰지 않습니다.

---

## 에러 처리 원칙

- 네트워크/서버 에러 로깅은 HTTP 클라이언트 인터셉터에서 수행합니다.
- 인증 만료(401): 토큰 제거 + 로그인 페이지로 이동합니다.
- 사용자 메시지(토스트/모달): **도메인 훅은 데이터/캐시만** 담당하고, UX 메시지는 페이지/컴포넌트에서 처리합니다.

---

## 환경 변수

- 서버에서만 사용하는 API 키/시크릿: `NEXT_PUBLIC_` prefix 없이 서버 컴포넌트에서만 사용합니다.
- 클라이언트에서 필요한 API base URL 등 공개 가능한 값만 `NEXT_PUBLIC_`를 붙입니다.
- 자세한 내용은 `ENV.md`를 참고합니다.
