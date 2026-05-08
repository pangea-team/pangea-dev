# AI_GUIDE (Single entrypoint)

이 파일은 **AI가 작업을 시작할 때 반드시 읽는 "인덱스(목차)"** 입니다.
세부 규칙은 중복 없이 모두 `.cursor/docs/ai_guide/`에 모아두었습니다.

## 0) 빠른 시작

```bash
pnpm install
pnpm dev
```

## 1) AI가 반드시 지켜야 할 최상위 규칙 (요약)

- **문서 우선순위**: 아래 "2) 문서 맵"의 문서가 **규칙의 단일 소스(SSOT)** 입니다.
- **alias 사용**: import는 `@/*`를 우선 사용합니다. (세부: `CONVENTIONS.md`)
- **Server Component 우선**: 기본은 Server Component이며, 클라이언트 기능이 필요할 때만 `'use client';`를 선언합니다. (세부: `COMPONENTS.md`)
- **토큰 우선**: 색·타이포·간격은 `app/styles/`의 토큰을 사용합니다. 임의값은 토큰이 없을 때만 허용합니다. (세부: `STYLING_TOKENS.md`)
- **품질 게이트**: 완료 조건은 최소 `pnpm check` + `pnpm build` 통과입니다. (세부: `WORKFLOW.md`)

## 2) 문서 맵 (각 파일이 담당하는 "단 하나의 주제")

- `PLAYBOOK.md`: **AI에게 시키는 표준 절차/프롬프트 템플릿**
- `CONVENTIONS.md`: **코드 스타일 + 폴더 배치 규칙 (어디에 뭘 둘지)**
- `ROUTING.md`: **라우트 맵 + 새 라우트 추가 규칙**
- `API_GUIDE.md`: **Server Component fetch + TanStack Query 패턴, 데이터 레이어 설계**
- `COMPONENTS.md`: **라우트 전용 vs 공통 컴포넌트 경계 + 'use client' 기준**
- `STYLING_TOKENS.md`: **Tailwind v4 + `@theme` 토큰 (색·타이포·간격·폰트) 규칙**
- `ENV.md`: **환경변수 목록/역할/주입 방법**
- `WORKFLOW.md`: **커밋/PR/CI 자동화 규칙 (Biome, commitlint, Husky)**
- `ARCHITECTURE.md`: **전체 구조의 큰 그림 (레이어링 의도/전역 레이아웃 역할)**

## 3) 작업 요청 템플릿 (초간단)

AI에게 작업을 요청할 때는 `PLAYBOOK.md`의 템플릿을 사용합니다.
