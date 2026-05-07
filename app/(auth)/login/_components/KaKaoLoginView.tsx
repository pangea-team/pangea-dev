import KaKaoLoginButton from './KaKaoLoginButton';

export default function KaKaoLoginView() {
  return (
    <div className="flex flex-col items-center">
      <p className="text-cormorant-display-2 tracking-wider pt-hero  ">PANGEA</p>
      <p className="text-noto-subtitle-1 pt-section-md">이 세계에는 당신을 읽는 사람이 있습니다.</p>
      <p className="text-noto-subtitle-1 pt-comp-sm pb-section-md">당신을 읽는 사람이 있습니다.</p>
      <KaKaoLoginButton />
      <p className="text-pretendard-body-2 text-text/90 pt-comp-sm">로그인이 필요합니다.</p>
    </div>
  );
}
