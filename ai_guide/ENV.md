# ENV / Runtime config

이 프로젝트는 Next.js App Router 기반이며, 클라이언트 번들에서 참조되는 값은 **반드시 `NEXT_PUBLIC_` prefix**를 사용합니다.

로컬 개발은 `.env.local`을 사용하고 (커밋 금지), 저장소에는 예시로 `.env.example`만 둡니다.

## 빠른 시작

```bash
cp .env.example .env.local
# 값 채우기
pnpm dev
```

## 환경 변수 분류 원칙

| 종류 | Prefix | 접근 가능 범위 |
| :--- | :--- | :--- |
| 클라이언트에서 필요한 공개 값 | `NEXT_PUBLIC_` | Server + Client 모두 |
| 서버 전용 시크릿/키 | 없음 | Server Component, Route Handler만 |

- **클라이언트에 노출되면 안 되는 값은 `NEXT_PUBLIC_`로 만들지 않습니다.**
- Server Component에서만 사용하는 API 키, DB 연결 문자열 등은 prefix 없이 선언합니다.
- 공개 가능한 값(API base URL, 서비스 식별자 등)만 `NEXT_PUBLIC_`를 붙입니다.

## 환경 변수 목록

> 현재 프로젝트에 추가된 환경 변수 기준으로 업데이트합니다.

### `NEXT_PUBLIC_API_URL` (필요 시 추가)

- **역할**: API base URL
- **사용처**: `lib/axiosInstance.ts` (axios 도입 시), Server Component fetch
- **예시 값**: `https://api.pangea.app`

### 기타 서비스 키

새 외부 서비스를 연결할 때:

- 공개 식별자 성격 → `NEXT_PUBLIC_` 사용
- 시크릿 성격 → prefix 없이, Server Component / Route Handler에서만 사용

## 보안/운영 권장 사항

- `.env.local`은 `.gitignore`에 포함되어야 합니다 (`.env.local`은 Next.js가 기본으로 gitignore 처리합니다).
- CI/CD 환경에서는 Secret 관리 도구(GitHub Actions Secrets 등)를 통해 주입합니다.
- 로컬에서만 필요한 값(디버그 플래그 등)은 `.env.local`에만 두고 `.env.example`에는 키 이름과 설명만 남깁니다.

## `.env.example` 작성 예시

```bash
# API
NEXT_PUBLIC_API_URL=https://api.pangea.app

# 서버 전용 (값을 노출하지 않음)
# DATABASE_URL=
```
