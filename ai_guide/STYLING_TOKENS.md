# Styling & Tokens (Tailwind v4 + CSS)

이 프로젝트는 Tailwind CSS v4를 사용하며, 전역 스타일과 디자인 토큰을 `app/styles/`에서 관리합니다.

## 전역 진입점

`app/styles/globals.css`

```css
@import "tailwindcss";
@import "./spacing.css";
@import "./colors.css";
@import "./typography.css";

body {
  background: var(--color-background);
  color: var(--color-text);
}
```

- `body`에 `background: var(--color-background)`와 `color: var(--color-text)`가 이미 적용되어 있습니다.
  - `bg-background`, `text-primary`(기본 텍스트) 클래스는 이미 상속되므로 **다시 붙이지 않습니다**.
  - 의도적으로 기본값과 다르게 할 때만 오버라이드합니다.

---

## 컬러 토큰 (`app/styles/colors.css`)

### 팔레트 (`@theme`)

| 토큰 | 값 | 용도 |
| :--- | :--- | :--- |
| `--color-ink-100` | `#493c5d` | |
| `--color-ink-200` | `#3d324d` | |
| `--color-ink-300` | `#31283e` | |
| `--color-ink-400` | `#251e2e` | primary dark ★ |
| `--color-ink-500` | `#18141f` | |
| `--color-tint-blue` | `#3c415d` | |
| `--color-tint-indigo` | `#413c5d` | |
| `--color-tint-violet` | `#493c5d` | |
| `--color-tint-plum` | `#523c5d` | 보조 퍼플 |
| `--color-tint-rose` | `#5a3c5d` | |
| `--color-surface-0` | `#ffffff` | 흰색 |
| `--color-surface-50` | `#fbfbfb` | |
| `--color-surface-100` | `#f4f2f7` | 페이지 배경 |
| `--color-lilac-300` | `#bfb8c9` | 옅은 라일락 |

### 시맨틱 별칭 (`:root`)

| CSS 변수 | 참조 | 의미 |
| :--- | :--- | :--- |
| `--background` | `var(--color-surface-100)` | 페이지 배경 |
| `--text` | `var(--color-ink-400)` | 메인 텍스트 |
| `--primary` | `var(--color-ink-400)` | 메인 브랜드 |
| `--purple2` | `var(--color-tint-plum)` | 보조 퍼플 |
| `--purple3` | `var(--color-lilac-300)` | 옅은 라일락 |
| `--white` | `var(--color-surface-0)` | 흰색 |

### Tailwind 유틸 (`@theme inline`)

위 시맨틱 별칭을 `--color-*` 형태로 Tailwind에 연결합니다.

| Tailwind 클래스 | 참조 |
| :--- | :--- |
| `bg-background` / `text-background` | `--color-background` |
| `text-text` / `bg-text` | `--color-text` |
| `bg-primary` / `text-primary` | `--color-primary` |
| `bg-purple2` / `text-purple2` | `--color-purple2` |
| `bg-purple3` / `text-purple3` | `--color-purple3` |
| `bg-white` (토큰) / `text-white` | `--color-white` |

권장 규칙:

- 새 색상은 `colors.css`의 `@theme`에 `--color-...` 네이밍으로 추가한 뒤 사용합니다.
- UI에서는 시맨틱 토큰(`bg-background`, `text-primary`)을 우선합니다.
- 임의 hex(`bg-[#f4f2f7]`)는 토큰이 없을 때만 허용합니다.
- `bg-white`, `text-black`(Tailwind 기본 고정값)은 테마와 어긋날 수 있으므로 토큰 기반을 사용합니다.

---

## 타이포그래피 유틸 클래스 (`app/styles/typography.css`)

타이포 클래스는 **폰트 크기·행간·굵기 + font-family를 한 번에** 적용합니다.
`text-noto-body-1`만 쓰면 Noto Serif KR이 자동 적용되므로, `font-noto`를 함께 쓰지 않습니다.

### Cormorant (영문 세리프, 로고·디스플레이)

| 클래스 | 크기 | 행간 | 굵기 |
| :--- | :--- | :--- | :--- |
| `text-cormorant-logo` | 24px | 28px | 400 |
| `text-cormorant-display-2` | 42px | 50px | 400 |
| `text-cormorant-display-3` | 20px | 24px | 400 |

### Noto Serif KR (한글 메인, 제목·본문)

| 클래스 | 크기 | 행간 | 굵기 |
| :--- | :--- | :--- | :--- |
| `text-noto-display` | 40px | 48px | 600 |
| `text-noto-heading-1` | 30px | 40px | 600 |
| `text-noto-title-1` | 30px | 40px | 500 |
| `text-noto-title-2` | 24px | 32px | 600 |
| `text-noto-subtitle-1` | 18px | 26px | 400 |
| `text-noto-subtitle-2` | 18px | 26px | 500 |
| `text-noto-body-1` | 13px | 20px | 400 |
| `text-noto-body-2` | 10px | 18px | 400 |
| `text-noto-caption` | 10px | 18px | 300 |

### Pretendard (한글 보조, 모던 본문)

| 클래스 | 크기 | 행간 | 굵기 |
| :--- | :--- | :--- | :--- |
| `text-pretendard-subtitle-1` | 18px | 26px | 400 |
| `text-pretendard-body-1` | 16px | 24px | 300 |
| `text-pretendard-body-2` | 14px | 20px | 300 |
| `text-pretendard-body-3` | 12px | 18px | 300 |
| `text-pretendard-caption` | 10px | 18px | 300 |

권장 규칙:

- 텍스트 크기/행간은 임의 Tailwind 조합(`text-[14px] leading-[20px]`) 대신 **타이포 유틸 클래스 + 색 토큰** 조합을 우선합니다.
  - 예: `<p className="text-pretendard-body-2 text-text">`

---

## 간격 토큰 (`app/styles/spacing.css`)

`clamp()`로 정의된 반응형 토큰입니다.

| Tailwind 클래스 | 범위 | 용도 |
| :--- | :--- | :--- |
| `p-comp-sm` / `gap-comp-sm` | 20 ~ 40px | 작은 컴포넌트 간격 |
| `p-section-sm` / `gap-section-sm` | 48 ~ 80px | 작은 섹션 간격 |
| `p-section-md` / `gap-section-md` | 64 ~ 128px | 중간 섹션 간격 |
| `p-section-lg` / `gap-section-lg` | 80 ~ 160px | 큰 섹션 간격 |
| `p-hero` | 96 ~ 252px | Hero 영역 상하 간격 |
| `px-page-x` | 24 ~ 80px | 페이지 좌우 padding |

간격 사용 기준:

- **작은 값(4~24px)**: Tailwind 기본 scale(`p-1` ~ `p-6`, `gap-1` ~ `gap-6`) 그대로 사용합니다.
- **컴포넌트 간 / 섹션 간 값**: `spacing.css` 반응형 토큰을 사용합니다.
- `clamp()`나 임의값(`py-[80px]`)은 직접 쓰지 않습니다.

---

## 폰트 로드 (`app/layout.tsx`)

```tsx
const cormorant = Cormorant({ variable: '--font-cormorant', ... });
const notoSerifKR = Noto_Serif_KR({ variable: '--font-noto', ... });
const pretendard = localFont({ variable: '--font-pretendard', ... });
```

- 각 변수는 `<html className={...}>` 에 넣어 전역에 전달합니다.
- 기본 본문은 `<body className="font-noto">` 로 Noto Serif KR이 적용됩니다.
- 그 외 파일에서는 `--font-*` 변수를 직접 쓰지 않고, 위의 `text-{family}-*` 유틸 클래스를 사용합니다.

## 새 토큰 추가 시

- 색: `colors.css`의 `@theme`에 `--color-...` 추가 → `:root`에 시맨틱 별칭 추가 → `@theme inline`에 연결
- 타이포: `typography.css`의 `@theme`에 토큰 추가 → 해당 font-family `.text-*` selector에 포함
- 간격: `spacing.css`의 `@theme`에 `--spacing-...` 추가 (clamp 패턴 유지)
- 팀 합의 없이 임의로 추가하지 않습니다.
