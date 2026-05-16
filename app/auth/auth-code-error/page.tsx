export default function AuthCodeErrorPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <h1 className="text-noto-subtitle-1 mb-4">로그인 중 오류가 발생했습니다</h1>
      <p className="mb-4">다시 시도해주세요.</p>
      <a href="/" className="text-blue-500 underline">
        홈으로 돌아가기
      </a>
    </div>
  );
}
