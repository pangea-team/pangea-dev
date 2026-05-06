import KaKaoLoginButton from './KaKaoLoginButton';

export default function KaKaoLoginView() {
  return (
    <div className="flex flex-col items-center">
      <p className="text-cormorant-display-2 tracking-wider pt-63  ">PANGEA</p>
      <p className="text-noto-subtitle-1 pt-31">이 세계에는 당신을 읽는 사람이 있습니다.</p>
      <p className="text-noto-subtitle-1 pt-10 pb-31">당신을 읽는 사람이 있습니다.</p>
      <KaKaoLoginButton />
      <p className="text-pretendard-body-2 text-text/90 pt-7">로그인이 필요합니다.</p>
    </div>
  );
}
