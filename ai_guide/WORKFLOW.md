# 브랜치/PR/CI 워크플로우

이 문서는 이 저장소의 **협업 방식과 자동화 규칙**을 정리합니다.

## 로컬 개발

- 패키지 매니저: **pnpm** (`pnpm@10.33.0` 고정 — npm/yarn lockfile 추가 금지)
- 린터/포매터: **Biome** (ESLint/Prettier 아님)

```bash
pnpm install
pnpm dev
```

## 주요 명령어

| 명령 | 설명 |
| :--- | :--- |
| `pnpm dev` | Next.js 개발 서버 실행 |
| `pnpm build` | 프로덕션 빌드 |
| `pnpm check` | Biome lint + format 자동 적용 (`--write`) — **커밋 전 반드시 실행** |
| `pnpm lint` | Biome lint만 실행 |
| `pnpm format` | Biome format만 실행 |

## 커밋 규칙 (commitlint + Husky)

### 커밋 메시지 포맷

`commitlint.config.js` 규칙을 따릅니다.

- **허용 타입**: `feat`, `fix`, `chore`, `refactor`, `docs`, `style` (소문자만)
- subject 필수
- 헤더 길이: **100자 이내**
- 제목 끝에 마침표 금지
- **이슈 번호 필수**: 헤더에 `(#숫자)` 포함

예시:

- `feat: add sentence detail page (#42)`
- `fix: correct order processing redirect (#88)`
- `chore: add pretendard font subset (#15)`

### Git hooks (Husky)

- `pre-commit`: `lint-staged` 실행 → 변경된 파일에 `biome check --write` 자동 적용
  - 대상: `*.{js,jsx,ts,tsx,json}`
- `commit-msg`: commitlint 실행

## 브랜치 전략

- **`dev`** 브랜치에서 작업 브랜치를 분기하고, `dev`로 머지합니다.
- **`main`**은 배포 브랜치입니다. `dev` → `main` 머지로 배포합니다.
- 직접 `main`에 push하지 않습니다.

## Pull Request

`.github/PULL_REQUEST_TEMPLATE.md` 형식을 사용합니다.

- 관련 이슈
- 작업 내용
- 리뷰 요청 사항
- 스크린샷

## CI (GitHub Actions)

`.github/workflows/ci.yml` 기준:

- 트리거: `dev`, `main`에 대한 push / PR
- 단계:
  1. `pnpm install --frozen-lockfile`
  2. `pnpm check` (Biome lint + format 검사)
  3. `pnpm build`

PR 머지 조건: **`pnpm check` + `pnpm build` 모두 통과** 필수.

## 푸시 전 체크리스트

1. `pnpm check` 통과 (Biome 경고 없음)
2. `pnpm build` 통과 (TypeScript 오류 없음)
3. 커밋 메시지 형식 준수 (`<type>: <subject> (#issue)`)
