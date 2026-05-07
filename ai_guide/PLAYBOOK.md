# AI 작업 Playbook (pangea-dev 스타일)

이 문서는 "AI에게 작업을 맡길 때" 실패/재작업을 줄이기 위한 **표준 절차 + 프롬프트 템플릿**입니다.

## 기본 원칙 (반드시)

- **기존 패턴 우선**: 비슷한 화면/도메인 파일을 먼저 찾아 그대로 확장합니다.
- **레이어 분리 유지**
  - 라우팅/페이지: `app/**`
  - 라우트 전용 UI: `app/(route)/_components/`
  - 공통 UI: `components/`
  - 공통 훅: `hooks/`
  - 유틸/클라이언트: `lib/`
  - 공통 타입: `types/`
- **품질 게이트 통과**: `pnpm check` + `pnpm build`가 통과해야 완료
- **커밋 규칙 준수**: 헤더에 `(#이슈번호)` 포함 (예: `feat: ... (#42)`)

## AI 작업 방식 원칙 (CLAUDE.md 기준)

- **코딩 전 계획 수립**: 3개 이상의 파일이나 50줄 이상에 영향을 주는 작업은 먼저 계획을 제시하고 승인을 기다릴 것. 곧바로 코드 작성 시작 금지.
- **가정은 명시적으로**: 요청이 모호하면 진행하기 전에 가정을 나열할 것. 한 가지 해석으로 조용히 밀고 나가지 말 것.
- **외과적 변경**: 요청된 부분만 수정할 것. 시키지 않은 인접 코드/주석/포맷을 "개선"하지 말 것.
- **기존 패턴 따르기**: 새 패턴을 만들기 전에 코드베이스에 비슷한 패턴이 있는지 먼저 확인할 것 (예: `_components/`의 형제 파일들).
- **섣부른 추상화 금지**: 한 번만 쓰이는 로직은 인라인으로 둘 것. 두세 번째 출현부터 추출할 것.
- **트레이드오프 드러내기**: 유효한 접근법이 여러 개일 때, 조용히 하나를 고르지 말고 각각을 명명하고 하나를 추천할 것.

## AI에게 주는 "작업 지시" 최소 구성

아래 4가지를 반드시 포함하세요.

- **목표**: 어떤 화면/기능을 구현하는지
- **완료 조건**: UI/동작/에러 케이스까지 무엇이 되면 끝인지
- **파일 배치 규칙**: `CONVENTIONS.md`, `ROUTING.md` 준수
- **테스트/검증**: 최소 `pnpm check`, `pnpm build`

## 표준 프롬프트 템플릿

아래 템플릿을 그대로 복사해 사용하면 좋습니다.

```text
너는 이 저장소의 컨벤션을 따라 작업하는 AI 개발자다.
작업 전 다음 문서를 먼저 읽고, 그 규칙을 반드시 지켜라:
- CLAUDE.md
- .cursor/docs/ai_guide/CONVENTIONS.md
- .cursor/docs/ai_guide/ROUTING.md
- .cursor/docs/ai_guide/COMPONENTS.md
- .cursor/docs/ai_guide/STYLING_TOKENS.md
- .cursor/docs/ai_guide/API_GUIDE.md

[작업 목표]
- ...

[완료 조건]
- ...

[제약]
- Next.js App Router(`app/`) 구조를 유지
- 기본은 Server Component, 클라이언트 기능이 필요할 때만 'use client' 선언
- 라우트 전용 UI는 app/(route)/_components/에, 공유 UI는 components/에 배치
- import는 @/* alias 사용
- 변경 후 pnpm check와 pnpm build를 통과해야 함
- 스타일은 Tailwind 토큰(text-noto-*, text-pretendard-*, bg-background 등) 우선

[추가 맥락/레퍼런스 파일]
- 비슷한 화면: app/.../page.tsx
- 비슷한 컴포넌트: app/.../_components/...
```

## 작업 절차 (권장 루틴)

1. **라우팅 결정**
   - 새 페이지면 `ROUTING.md`를 보고 어떤 라우트 그룹/세그먼트에 넣을지 결정합니다.

2. **UI 골격 구성**
   - `app/.../page.tsx`는 조립만 하고, 실 UI는 `app/.../_components/`로 분리합니다.
   - 여러 라우트에서 재사용하는 UI만 `components/`로 올립니다.

3. **데이터 페칭**
   - Server Component에서 직접 fetch/처리합니다 (기본).
   - 클라이언트 mutation/캐싱이 필요한 경우 TanStack Query hooks를 `_hooks/`에 작성합니다.

4. **스타일/토큰**
   - 타이포 유틸 (`text-noto-body-1`, `text-pretendard-body-1`) + 컬러 토큰 (`text-primary`, `bg-background`) 조합을 우선합니다.
   - 간격은 `spacing.css` 토큰 (`p-section-md`, `gap-comp-sm`) 또는 Tailwind 기본 scale 사용합니다.

5. **검증**
   - `pnpm check`
   - `pnpm build`

## 흔한 실수 방지 (이 프로젝트에서 특히)

- **`'use client'` 누락**
  - `useState`, `useEffect`, `useRouter`, `useSearchParams`, TanStack Query hooks, `localStorage`, `window` 사용 시 반드시 파일 최상단에 `'use client';` 선언.

- **토큰 미사용**
  - `text-[14px]` 같은 임의값 대신 `typography.css`의 `text-pretendard-body-2` 등을 사용합니다.
  - `bg-[#f4f2f7]` 대신 `bg-background`를 사용합니다.

- **잘못된 폰트 유틸 중복**
  - `text-noto-body-1`을 쓰면 이미 Noto Serif KR font-family가 적용되므로 `font-noto`를 함께 쓰지 않습니다.

- **`cn()` 남용**
  - 단순 정적 문자열 나열에는 `cn()`을 쓰지 않습니다.
  - 외부 `className` 머지 또는 2개 이상의 조건부 클래스에만 사용합니다.

- **파일 배치 혼동**
  - 해당 라우트에서만 쓰는 컴포넌트는 `app/(route)/_components/`에, 실제로 여러 라우트에서 쓰는 것만 `components/`에 둡니다.
