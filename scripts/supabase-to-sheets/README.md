# Supabase → Google Sheets Sync

Supabase 테이블 데이터를 Google Sheets로 자동 동기화하는 TypeScript 스크립트입니다.

---

## 파일 구조

```
scripts/supabase-to-sheets/
├── src/
│   ├── config.ts      # 환경변수 로딩 & 유효성 검사
│   ├── supabase.ts    # Supabase 데이터 조회
│   ├── sheets.ts      # Google Sheets 쓰기 (overwrite / append)
│   └── sync.ts        # 진입점
├── .github/workflows/sync.yml   # GitHub Actions 자동화
├── .env.example
├── package.json
└── tsconfig.json
```

---

## 1단계 — 의존성 설치

프로젝트 루트 또는 이 디렉토리에서:

```bash
# 루트에서 (workspace 전체)
pnpm install

# 또는 이 디렉토리에서만
cd scripts/supabase-to-sheets
pnpm install
```

---

## 2단계 — Google Cloud 서비스 계정 만들기

### 2-1. 서비스 계정 생성

1. [Google Cloud Console](https://console.cloud.google.com) 접속
2. **IAM 및 관리자 → 서비스 계정** → **서비스 계정 만들기**
3. 이름 입력 후 생성 (역할은 따로 부여 안 해도 됨)
4. 생성된 계정 클릭 → **키** 탭 → **키 추가 → JSON 키 만들기**
5. 다운로드된 JSON 파일 저장

### 2-2. Google Sheets API 활성화

1. **API 및 서비스 → 라이브러리** 검색창에 `Google Sheets API`
2. **사용 설정(Enable)** 클릭

### 2-3. 시트 공유

1. Google Sheets에서 동기화할 스프레드시트 열기
2. 우상단 **공유** 버튼 클릭
3. JSON 키 파일의 `client_email` 값 붙여넣기 (예: `sync@project.iam.gserviceaccount.com`)
4. 권한: **편집자**로 설정 후 **완료**

### 2-4. 시트 ID 확인

스프레드시트 URL에서 추출:
```
https://docs.google.com/spreadsheets/d/[여기가_SHEET_ID]/edit
```

---

## 3단계 — 환경변수 설정

```bash
cp .env.example .env
```

`.env` 파일 작성:

```env
SUPABASE_URL=https://abcdefgh.supabase.co
SUPABASE_SERVICE_ROLE_KEY=eyJhbGc...

GOOGLE_SHEET_ID=1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgVE2upms
GOOGLE_SERVICE_ACCOUNT_KEY={"type":"service_account","project_id":"..."}

TABLE_NAME=users
COLUMNS=id,name,email,created_at
SHEET_NAME=Sheet1
SYNC_MODE=overwrite
```

> `GOOGLE_SERVICE_ACCOUNT_KEY`에는 JSON 파일 내용 전체를 **한 줄**로 붙여넣으세요.
> 터미널에서 한 줄로 변환하는 방법:
> ```bash
> cat your-key.json | tr -d '\n'
> ```

---

## 다중 테이블 동기화

`SYNC_TARGETS`를 설정하면 여러 테이블을 한 번에 동기화할 수 있습니다.  
`SYNC_TARGETS`가 있으면 **다중 모드**, 없으면 **단일 모드** (기존 동작)로 동작합니다.

### SYNC_TARGETS 형식

```
SYNC_TARGETS=테이블명:시트탭명,테이블명:시트탭명,...
```

예시:
```env
SYNC_TARGETS=orders:orders,saved_sentences:saved_sentences,users:users
```

### 테이블별 컬럼 지정

`COLUMNS_<TABLE_NAME_대문자>` 형식으로 각 테이블의 컬럼을 지정합니다.  
해당 변수가 없으면 전체 컬럼(`SELECT *`)을 가져옵니다.

```env
COLUMNS_ORDERS=order_number,recipient_name,recipient_phone,total_amount,created_at
COLUMNS_SAVED_SENTENCES=note,content_index,created_at
COLUMNS_USERS=name,kakao_name,trace,wants_to_see_others,survey_answered_at,created_at
```

### 다중 모드 실행 결과 예시

```
[sync] mode=overwrite  targets=3
[1/3] Syncing orders → orders tab...
✓ orders: 24 rows synced
[2/3] Syncing saved_sentences → saved_sentences tab...
✓ saved_sentences: 187 rows synced
[3/3] Syncing users → users tab...
✗ users: failed - Supabase query failed: ...

2/3 succeeded, 1 failed  elapsed=3.12s
```

한 테이블이 실패해도 나머지 테이블은 계속 동기화됩니다.  
모든 테이블이 성공해야 exit code 0, 하나라도 실패하면 exit code 1로 종료됩니다.

### GitHub Actions — 다중 모드 Secrets

다중 모드에서는 `TABLE_NAME`, `COLUMNS`, `SHEET_NAME` 대신 아래 시크릿을 등록합니다:

| Secret 이름 | 예시 값 |
|-------------|---------|
| `SYNC_TARGETS` | `orders:orders,users:users` |
| `COLUMNS_ORDERS` | `order_number,recipient_name,...` |
| `COLUMNS_SAVED_SENTENCES` | `note,content_index,created_at` |
| `COLUMNS_USERS` | `name,kakao_name,created_at` |

> `SYNC_MODE`는 단일/다중 모드 공통으로 적용됩니다.

---

## 4단계 — 실행

```bash
# 전체 덮어쓰기 (기본)
pnpm run sync

# 새 행만 추가
pnpm run sync:append

# 또는 CLI 인수로 직접 지정
pnpm dlx ts-node src/sync.ts --mode=overwrite
pnpm dlx ts-node src/sync.ts --mode=append
```

실행 결과 예시:
```
[sync] mode=overwrite  table=users
[sync] fetched 342 rows from Supabase
[sync] done  rows=342  elapsed=1.84s
```

---

## 5단계 — 자동화

### 방법 A: GitHub Actions (권장)

`.github/workflows/sync.yml` 파일이 포함되어 있습니다.

**Secrets 등록 방법:**
1. GitHub 저장소 → **Settings** → **Secrets and variables** → **Actions**
2. **New repository secret** 버튼 클릭
3. 아래 항목을 하나씩 추가:

| Secret 이름 | 값 |
|-------------|-----|
| `SUPABASE_URL` | Supabase 프로젝트 URL |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase 서비스 롤 키 |
| `GOOGLE_SHEET_ID` | 스프레드시트 ID |
| `GOOGLE_SERVICE_ACCOUNT_KEY` | 서비스 계정 JSON (한 줄) |
| `TABLE_NAME` | 동기화할 테이블명 |
| `COLUMNS` | 쉼표 구분 컬럼명 (선택, 비우면 전체) |
| `SHEET_NAME` | 시트 탭 이름 (선택, 기본값 Sheet1) |

기본 스케줄: **매일 오전 9시 KST**  
워크플로우 파일의 cron 표현식을 수정해 변경할 수 있습니다.

---

### 방법 B: 로컬 cron (macOS/Linux)

```bash
# crontab -e 로 열어서 추가
# 매일 오전 9시 실행
0 9 * * * cd /path/to/scripts/supabase-to-sheets && pnpm run sync >> /tmp/sync.log 2>&1
```

---

### 방법 C: Vercel Cron (Next.js 프로젝트)

`app/api/sync/route.ts` 파일 생성:

```typescript
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  // Vercel Cron 인증 (무단 호출 차단)
  const authHeader = request.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // sync 로직을 직접 호출하거나 별도 API로 분리
  return NextResponse.json({ synced: true });
}
```

`vercel.json`:
```json
{
  "crons": [
    {
      "path": "/api/sync",
      "schedule": "0 0 * * *"
    }
  ]
}
```

---

## 동작 방식

| 모드 | 동작 |
|------|------|
| `overwrite` | 시트 전체를 지우고 헤더 + 전체 데이터로 다시 씀 |
| `append` | 시트 맨 아래에 새 행을 추가 (비어 있으면 헤더도 추가) |

---

## 에러 대응

| 에러 메시지 | 원인 | 해결 |
|-------------|------|------|
| `Missing required environment variable` | `.env` 누락 | 환경변수 확인 |
| `GOOGLE_SERVICE_ACCOUNT_KEY is not valid JSON` | JSON 형식 오류 | `cat your-key.json \| tr -d '\n'` 으로 재변환 |
| `Supabase query failed` | 테이블명 오류 또는 권한 부족 | `TABLE_NAME`, `SUPABASE_SERVICE_ROLE_KEY` 확인 |
| `The caller does not have permission` | 시트 공유 안 됨 | `client_email`로 시트 편집자 권한 부여 |
