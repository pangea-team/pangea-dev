import Icon from './Icon';

export default function Header() {
  return (
    <header className="flex justify-between h-15 shrink-0 items-center px-4 py-2">
      <div className="flex items-center gap-2">
        <Icon name="logo" width={60} height={60} />
        <span className="text-cormorant-logo tracking-[6px] whitespace-nowrap">PANGEA</span>
      </div>
      <div className="flex items-center">
        <p className="text-pretendard-body-1">Login</p>
        <button
          type="button"
          aria-label="메뉴 열기"
          // onClick={() => {
          //   // TODO: 메뉴 열기 동작 구현
          // }}
        >
          <Icon name="menubar" width={90} height={60} />
        </button>
      </div>
    </header>
  );
}
