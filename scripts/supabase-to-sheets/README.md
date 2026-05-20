# Supabase → Google Sheets 동기화 운영 가이드

> 이 문서는 동기화 스크립트를 운영하는 사람을 위한 가이드입니다.
> 팀원은 시트만 열람하고, 운영자가 이 스크립트를 관리합니다.
> 운영자 부재 시 이 문서만 보고 인수인계할 수 있도록 작성됐습니다.

---

## 1. 개요

Supabase DB의 테이블 데이터를 Google Sheets로 자동 동기화하는 스크립트입니다.

- **동기화 주기**: 매일 오전 9시 KST 자동 실행 (GitHub Actions)
- **동기화 방식**: `overwrite` — 실행할 때마다 시트 전체를 지우고 최신 데이터로 덮어씀
- **실행 위치**: GitHub Actions (로컬 실행 불필요, 수동 트리거 가능)

---

## 2. 동기화 대상 목록

현재 아래 3개 테이블이 동기화됩니다. 각 테이블은 Google Sheets의 해당 탭에 기록됩니다.

| Supabase 테이블 | Google Sheets 탭 | 컬럼 설정 Secret |
|----------------|-----------------|----------------|
| `orders` | `orders` | `COLUMNS_ORDERS` |
| `saved_sentences_with_user` | `saved_sentences` | `COLUMNS_SAVED_SENTENCES` |
| `users` | `users` | `COLUMNS_USERS` |

동기화 대상은 GitHub Secret `SYNC_TARGETS` 값으로 관리합니다.  
현재 값 예시: `orders:orders,saved_sentences_with_user:saved_sentences,users:users`

---

## 3. 시트 사용 시 주의사항

**팀원에게 공유할 때 반드시 안내해야 하는 내용입니다.**

| 금지 사항 | 이유 |
|----------|------|
| 시트를 "표(Table)"로 변환하지 말 것 | 덮어쓰기 실행 시 오류 발생 |
| 1행 헤더 수정하지 말 것 | 스크립트가 헤더를 덮어씌움, 수정 내용 사라짐 |
| 탭 이름 변경하지 말 것 | `SYNC_TARGETS`의 탭명과 불일치 시 해당 탭 동기화 중단 |
| 시트에 데이터를 직접 입력하지 말 것 | 매일 오전 9시에 전체 덮어씌워지므로 사라짐 |
| 열 순서 변경·열 삭제하지 말 것 | 다음 동기화 시 원래 순서로 복원됨 |

> **요약**: 시트는 읽기 전용으로 사용하세요. 데이터를 가공하려면 별도 시트에 복사해서 사용하세요.

---

## 4. 새 테이블 추가하는 방법

새 Supabase 테이블을 동기화 대상에 추가하는 절차입니다.

### 4-1. Google Sheets에 탭 추가

1. 동기화 스프레드시트 열기
2. 하단 `+` 버튼으로 새 탭 추가
3. 탭 이름을 원하는 이름으로 설정 (예: `new_table`)

### 4-2. GitHub Secrets 수정

GitHub 저장소 → **Settings → Secrets and variables → Actions**

**`SYNC_TARGETS` 수정:**
- 기존 값 뒤에 `,새테이블명:새탭명` 추가
- 예시: `orders:orders,users:users` → `orders:orders,users:users,new_table:new_table`

**`COLUMNS_새테이블명_대문자` 추가 (선택):**
- 특정 컬럼만 동기화하려면 추가 (없으면 전체 컬럼 `SELECT *`)
- Secret 이름: `COLUMNS_NEW_TABLE`
- 값: `id,name,created_at` (쉼표로 구분, 공백 없이)

### 4-3. 수동 실행으로 확인

→ [6. 수동 실행 방법](#6-수동-실행-방법-github-actions) 참고

---

## 5. 새 컬럼 추가하는 방법

기존 테이블에 컬럼을 추가하거나 제거하는 절차입니다.

### 5-1. GitHub Secrets 수정

GitHub 저장소 → **Settings → Secrets and variables → Actions**

해당 테이블의 `COLUMNS_테이블명_대문자` Secret 값을 수정합니다.

| 테이블 | Secret 이름 |
|--------|------------|
| `orders` | `COLUMNS_ORDERS` |
| `saved_sentences_with_user` | `COLUMNS_SAVED_SENTENCES` |
| `users` | `COLUMNS_USERS` |

**예시**: `orders` 테이블에 `status` 컬럼 추가
- 기존: `order_number,recipient_name,total_amount,created_at`
- 수정: `order_number,recipient_name,total_amount,status,created_at`

> **주의**: 컬럼 이름은 Supabase 테이블의 실제 컬럼명과 정확히 일치해야 합니다.

### 5-2. 수동 실행으로 확인

→ [6. 수동 실행 방법](#6-수동-실행-방법-github-actions) 참고

다음 자동 실행(오전 9시)부터 새 컬럼이 반영됩니다.  
`overwrite` 모드이므로 헤더도 자동으로 업데이트됩니다.

---

## 6. 수동 실행 방법 (GitHub Actions)

자동 스케줄을 기다리지 않고 즉시 동기화하는 방법입니다.

1. GitHub 저장소 → 상단 **Actions** 탭 클릭
2. 왼쪽 목록에서 **"Supabase to Google Sheets Sync"** 선택
3. 오른쪽 **"Run workflow"** 버튼 클릭
4. `Sync mode` 선택:
   - `overwrite` (기본값, 권장): 시트 전체 덮어쓰기
   - `append`: 기존 데이터 유지 + 새 행 추가
5. **"Run workflow"** 초록 버튼 클릭
6. 잠시 후 목록에 실행 항목이 나타남 — 클릭하면 로그 확인 가능

> **실행 시간**: 보통 1~3분 소요

---

## 7. 트러블슈팅

### 7-1. 시트에 데이터가 안 들어올 때

**확인 순서:**

1. **Actions 로그 확인**  
   GitHub → Actions → 가장 최근 실행 클릭 → `sync` job → `Run sync` 단계 로그 확인

2. **Secrets 누락 여부 확인**  
   오류 메시지 `Missing required environment variable`이 있으면  
   GitHub → Settings → Secrets and variables → Actions에서 아래 항목이 모두 있는지 확인:
   - `SUPABASE_URL`
   - `SUPABASE_SERVICE_ROLE_KEY`
   - `GOOGLE_SHEET_ID`
   - `GOOGLE_SERVICE_ACCOUNT_KEY`
   - `SYNC_TARGETS`

3. **시트 공유 권한 확인**  
   오류 메시지 `The caller does not have permission`이 있으면  
   Google Sheets → 공유 → 서비스 계정 이메일(`client_email`)이 **편집자** 권한으로 등록됐는지 확인  
   서비스 계정 이메일은 `GOOGLE_SERVICE_ACCOUNT_KEY` Secret 값 안의 `"client_email"` 필드에 있습니다.

4. **JSON 형식 오류 확인**  
   오류 메시지 `GOOGLE_SERVICE_ACCOUNT_KEY is not valid JSON`이 있으면  
   → [8. 키/시크릿 관리](#8-키시크릿-관리) → Google 서비스 계정 키 재등록 참고

---

### 7-2. 특정 테이블만 실패할 때

Actions 로그에서 `✗ 테이블명: failed - ...` 메시지를 찾아 확인합니다.

| 오류 메시지 | 원인 | 해결 |
|------------|------|------|
| `Supabase query failed` | 테이블명 오타 또는 존재하지 않는 컬럼명 | `SYNC_TARGETS`의 테이블명, `COLUMNS_*`의 컬럼명을 Supabase와 대조 |
| `relation "테이블명" does not exist` | Supabase에 해당 테이블 없음 | `SYNC_TARGETS`에서 해당 항목 제거 또는 테이블명 수정 |
| `column "컬럼명" does not exist` | 해당 컬럼이 없거나 이름 변경됨 | `COLUMNS_*` Secret에서 컬럼명 수정 |
| 탭 관련 오류 | Google Sheets에 해당 탭이 없음 | 스프레드시트에서 탭 이름이 `SYNC_TARGETS`의 탭명과 일치하는지 확인 |

**다중 동기화 특성**: 한 테이블이 실패해도 나머지 테이블은 계속 동기화됩니다.  
로그 마지막 줄 `X/3 succeeded, Y failed`로 성공/실패 수 확인 가능합니다.

---

### 7-3. 자동 실행이 안 돌 때

**확인 순서:**

1. **Actions가 비활성화됐는지 확인**  
   GitHub → Actions 탭 → 워크플로우 목록에 "This workflow is disabled" 배너가 있으면  
   → **"Enable workflow"** 클릭

2. **cron은 기본 브랜치(main)에서만 실행됨**  
   `sync.yml`이 `main` 브랜치에 있는지 확인합니다.  
   `dev` 브랜치에만 있으면 자동 실행되지 않습니다.

3. **GitHub Actions 무료 한도 초과 여부**  
   GitHub → Settings → Billing에서 Actions 사용량 확인  
   무료 한도 초과 시 유료 플랜 업그레이드 필요

4. **60일 이상 저장소 활동 없으면 cron 자동 비활성화**  
   GitHub 정책으로 60일 이상 push 없으면 스케줄 워크플로우가 비활성화됩니다.  
   → Actions에서 워크플로우 재활성화 후 수동 실행으로 확인

---

## 8. 키/시크릿 관리

### 현재 등록된 Secrets 목록

GitHub 저장소 → **Settings → Secrets and variables → Actions** 에서 관리합니다.

| Secret 이름 | 내용 | 발급처 |
|-------------|------|--------|
| `SUPABASE_URL` | Supabase 프로젝트 URL | Supabase Dashboard |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase 서비스 롤 키 (전체 접근 권한) | Supabase Dashboard |
| `GOOGLE_SHEET_ID` | 스프레드시트 ID (URL에서 추출) | Google Sheets URL |
| `GOOGLE_SERVICE_ACCOUNT_KEY` | 서비스 계정 JSON 전체 (한 줄) | Google Cloud Console |
| `SYNC_TARGETS` | 동기화 대상 테이블:탭 목록 | 운영자가 직접 설정 |
| `COLUMNS_ORDERS` | orders 테이블 동기화 컬럼 목록 | 운영자가 직접 설정 |
| `COLUMNS_SAVED_SENTENCES` | saved_sentences_with_user 동기화 컬럼 목록 | 운영자가 직접 설정 |
| `COLUMNS_USERS` | users 테이블 동기화 컬럼 목록 | 운영자가 직접 설정 |

---

### SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY 확인 및 재발급

**확인 위치:**
1. [Supabase Dashboard](https://app.supabase.com) → 해당 프로젝트 선택
2. 왼쪽 메뉴 → **Project Settings → API**
3. `Project URL` → `SUPABASE_URL`
4. `service_role` (secret) → `SUPABASE_SERVICE_ROLE_KEY`

> `service_role` 키는 DB 전체 접근 권한이 있는 키입니다. 외부에 노출되지 않도록 주의하세요.

**재발급 방법:**
- Supabase에서 키를 직접 재발급하는 기능은 없습니다.
- 키가 노출됐다면 Supabase 프로젝트를 새로 생성하거나, 지원팀에 문의하세요.

---

### GOOGLE_SERVICE_ACCOUNT_KEY 확인 및 재발급

**확인 위치:**
1. [Google Cloud Console](https://console.cloud.google.com) → 해당 프로젝트 선택
2. 왼쪽 메뉴 → **IAM 및 관리자 → 서비스 계정**
3. 동기화용 서비스 계정 클릭 → **키** 탭

**새 키 발급:**
1. **키 추가 → JSON 키 만들기** → JSON 파일 다운로드
2. 다운로드된 JSON을 한 줄로 변환:
   ```bash
   cat your-key.json | tr -d '\n'
   ```
3. GitHub Secret `GOOGLE_SERVICE_ACCOUNT_KEY` 값을 변환된 문자열로 교체

**기존 키 삭제 (노출 시):**
- 서비스 계정 → **키** 탭 → 해당 키의 점 세 개 메뉴 → **삭제**
- 새 키 발급 후 GitHub Secret 교체

---

### GOOGLE_SHEET_ID 확인

스프레드시트 URL에서 추출합니다:
```
https://docs.google.com/spreadsheets/d/[여기가_SHEET_ID]/edit
```

---

## 부록: 초기 세팅 (최초 1회, 인수인계 시 참고)

> 이미 운영 중이라면 이 섹션은 건너뛰어도 됩니다.
> 완전히 새로 구축하거나 재설치할 때만 필요합니다.

### 의존성 설치

```bash
cd scripts/supabase-to-sheets
pnpm install
```

### 로컬 환경변수 설정

```bash
cp .env.example .env
# .env 파일 내용 작성 (각 값은 위 Secrets 설명 참고)
```

### 로컬 실행 (테스트용)

```bash
pnpm run sync          # overwrite 모드
pnpm run sync:append   # append 모드
```

### 파일 구조

```
scripts/supabase-to-sheets/
├── src/
│   ├── config.ts      # 환경변수 로딩 & 유효성 검사
│   ├── supabase.ts    # Supabase 데이터 조회
│   ├── sheets.ts      # Google Sheets 쓰기
│   └── sync.ts        # 진입점
├── .github/workflows/sync.yml   # GitHub Actions 자동화
├── .env.example
├── package.json
└── tsconfig.json
```
