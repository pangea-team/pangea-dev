# Routing (Next.js App Router)

이 문서는 `app/` 구조를 "라우트 맵" 형태로 정리한 것입니다.
AI가 새 페이지를 만들 때 **기존 그룹 라우트/동적 라우트 패턴을 그대로 따라가도록** 돕습니다.

## 전역 레이아웃

- `app/layout.tsx`
  - 전역 CSS: `app/styles/globals.css`
  - 폰트 로드: Cormorant, Noto Serif KR, Pretendard (CSS 변수 주입)
  - `<html>` 에 폰트 변수 클래스 주입, `<body>` 에 `font-noto` 기본 적용

## 라우트 맵 (현재 `page.tsx` 기준)

### 루트

- `/` → `app/page.tsx`

### 인증 (Auth)

- 라우트 그룹: `app/(auth)/` — URL에 `/auth`가 포함되지 않음
- `app/(auth)/layout.tsx` — 인증 페이지 공통 레이아웃
- `/login` → `app/(auth)/login/page.tsx`

### 피드 (Feed)

- `/feed` → `app/feed/page.tsx`
- `/feed/upload` → `app/feed/upload/page.tsx`
- `/feed/user/[userId]` → `app/feed/user/[userId]/page.tsx`
  - 동적 파라미터: `userId`

### 카트 (Cart)

- `/cart` → `app/cart/page.tsx`

### 주문 (Order)

- `/order` → `app/order/page.tsx`
- `/order/complete` → `app/order/complete/page.tsx`
- `/order/failed` → `app/order/failed/page.tsx`
- `/order/processing` → `app/order/processing/page.tsx`

### 히스토리 (History)

- `/history/code` → `app/history/code/page.tsx`
- `/history/[copyId]` → `app/history/[copyId]/page.tsx`
  - 동적 파라미터: `copyId`

### 마이 (My)

- `/my/feed` → `app/my/feed/page.tsx`

### 알림 (Notifications)

- `/notifications` → `app/notifications/page.tsx`

### 요청 (Requests)

- `/requests` → `app/requests/page.tsx`

### 문장 (Sentence)

- `/sentence/[bookId]` → `app/sentence/[bookId]/page.tsx`
  - 동적 파라미터: `bookId`

---

## 라우팅 추가/변경 규칙 (AI용)

새 라우트를 추가할 때는 아래를 지킵니다.

- **기존 도메인 그룹(feed, order, my, history 등) 중 어디에 속하는지 먼저 결정합니다.**
- 인증이 필요한 페이지 그룹은 `(auth)` 방식으로 route group을 활용합니다.
- 동적 파라미터는 폴더명 `[param]` 패턴을 사용합니다.
- 페이지는 `page.tsx`, 공통 UI 프레임은 `layout.tsx`로 분리합니다.
- 라우트 전용 UI는 같은 세그먼트 내 `_components/`에 두고, `page.tsx`는 조립만 합니다.
- 클라이언트 API(`localStorage`, `window` 등) 사용 시 `'use client';`를 파일 최상단에 선언합니다.

## 라우트 그룹 (`(name)`) 규칙

- 괄호 폴더명은 URL 경로에 포함되지 않습니다.
- 같은 레이아웃을 공유하는 페이지 묶음에 사용합니다.
- 현재: `(auth)` — 로그인 등 인증 관련 페이지

## 동적 라우트 패턴

| 패턴 | 예시 URL | 파라미터 접근 |
| :--- | :--- | :--- |
| `[userId]` | `/feed/user/abc123` | `params.userId` |
| `[copyId]` | `/history/xyz456` | `params.copyId` |
| `[bookId]` | `/sentence/book789` | `params.bookId` |

Server Component에서 params 접근:

```tsx
// app/sentence/[bookId]/page.tsx
type Props = {
  params: Promise<{ bookId: string }>;
};

export default async function SentencePage({ params }: Props) {
  const { bookId } = await params;
  // ...
}
```

> Next.js 16+에서 `params`는 Promise로 전달됩니다. `await params`로 접근합니다.
