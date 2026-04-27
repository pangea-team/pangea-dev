# Contributing Guide

`pangea-dev`의 개발 환경 설정부터 PR 머지까지의 흐름을 정리한 가이드입니다.

## 개발 환경

- **Node.js**: 20 이상
- **패키지 매니저**: pnpm `10.33.0` (`package.json`의 `packageManager` 필드 기준)

```bash
# 의존성 설치
pnpm install

# 개발 서버 실행
pnpm dev
```

## 주요 스크립트

| 명령어           | 설명                                      |
| ---------------- | ----------------------------------------- |
| `pnpm dev`       | Next.js 개발 서버 실행                    |
| `pnpm build`     | 프로덕션 빌드                             |
| `pnpm start`     | 빌드 산출물 실행                          |
| `pnpm lint`      | Biome로 린트 검사                         |
| `pnpm format`    | Biome로 포맷팅 적용                       |
| `pnpm check`     | Biome lint + format 일괄 적용 (`--write`) |

## 브랜치 전략

- `main` — 배포 브랜치
- `dev` — 통합 개발 브랜치 (PR의 기본 base)
- 작업 브랜치는 `dev`에서 분기하고, 머지 대상도 `dev`로 합니다.

브랜치 이름 예시:

```
feat/#12-login-form
fix/#34-header-overflow
chore/#56-ci-config
```

## 코드 스타일

- 포맷터 / 린터는 [Biome](https://biomejs.dev/)을 사용합니다. 설정은 [biome.json](biome.json) 참고.
- 커밋 전 `pnpm check`로 자동 정리할 수 있습니다.
- Husky `pre-commit` 훅이 `lint-staged`를 통해 변경된 파일에만 `biome check --write`를 실행합니다.

## 커밋 메시지 규칙

[Conventional Commits](https://www.conventionalcommits.org/)를 따르며, `commit-msg` 훅에서 commitlint로 검증합니다. 규칙은 [commitlint.config.js](commitlint.config.js)에 정의되어 있습니다.

### 형식

```
<type>: <subject> (#이슈번호)
```

- **type**: `feat`, `fix`, `chore`, `refactor`, `docs`, `style` 만 허용 (소문자)
- **subject**: 비워둘 수 없으며, 마침표(`.`)로 끝나면 안 됩니다
- **header**: 최대 100자
- **이슈 번호**: 필수 (`#숫자` 형식)

### 예시

```
feat: 로그인 폼 컴포넌트 추가 (#12)
fix: 헤더 모바일 오버플로우 수정 (#34)
chore: CI 워크플로우 노드 버전 업그레이드 (#56)
```

## Pull Request

1. 작업 전, 대응되는 이슈가 있는지 확인하고 없으면 [이슈 템플릿](.github/ISSUE_TEMPLATE/issue.md)으로 생성합니다.
2. `dev` 기준으로 브랜치를 생성해 작업합니다.
3. 푸시 전 로컬에서 다음을 확인하세요.
   - `pnpm check` — 린트/포맷 통과
   - `pnpm build` — 빌드 성공
4. PR을 생성하면 [PR 템플릿](.github/PULL_REQUEST_TEMPLATE.md)이 자동으로 채워집니다. 다음 항목을 작성해 주세요.
   - **관련 이슈**: `closes #이슈번호`
   - **작업 내용**: 변경 사항 요약
   - **리뷰 요청 사항**: 리뷰어가 집중해서 봐주면 좋을 부분
5. CI([.github/workflows/ci.yml](.github/workflows/ci.yml))의 `Lint & Build` 잡이 통과해야 머지할 수 있습니다.
6. 리뷰 승인 후 머지합니다.

## 이슈

- 기능 / 버그 / 기타 모두 [이슈 템플릿](.github/ISSUE_TEMPLATE/issue.md)을 사용해 주세요.
- 작업 단위가 큰 경우 `TODO` 체크리스트를 활용해 진행 상황을 공유합니다.
