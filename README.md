# 🌏 Pangea

> 사람이 설명이 아니라 흔적으로 이해되는 세계를 만든다.

## 🚀 시작하기

```bash
pnpm install
pnpm dev
```

## 🗄️ DB 타입 업데이트

DB 스키마 변경 시 아래 명령어를 실행한 뒤 `lib/supabase/database.types.ts`를 커밋하세요.
손으로 row 타입을 작성하지 마세요 — 모든 타입은 자동 생성 타입(`Tables<'테이블명'>`)에서 파생합니다.

```bash
pnpm db:types
```

## 🛠 기술 스택

**Core**
- React
- TypeScript
- Next.js (App Router)

**Data & State**
- TanStack Query
- Supabase

**Styling & Animation**
- Tailwind CSS
- Motion.js

**Deployment**
- Vercel

## ⚙️ 개발 환경

- **Package Manager:** pnpm
- **Lint & Format:** Biome
- **Git Hooks:** Husky + lint-staged
- **Commit Convention:** commitlint
- **CI/CD:** GitHub Actions

## 📚 문서

- [기여 가이드 (CONTRIBUTING.md)](./docs/CONTRIBUTING.md) — 개발 환경, 브랜치 전략, PR 절차
- [코딩 컨벤션 (CODING_CONVENTION.md)](./docs/CODING_CONVENTION.md) — 네이밍, 폴더 구조, 스타일 규칙

  
