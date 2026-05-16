import Icon from '@/components/Icon';

const SOCIAL = {
  kakaoTalk: 'https://pf.kakao.com/',
  instagram: 'https://www.instagram.com/',
} as const;

export default function Footer() {
  return (
    <footer className=" mt-auto shrink-0 px-page-x py-comp-sm">
      <div className="flex flex-col gap-comp-sm sm:flex-row sm:items-start sm:justify-between">
        <div className="flex flex-col">
          <p className="py-2 uppercase text-cormorant-display-2">PANGEA</p>
          <p className="text-cormorant-footer-tagline">Someone is reading you.</p>
        </div>
        <div className="flex shrink-0 self-end sm:self-start">
          <a
            href={SOCIAL.kakaoTalk}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center"
            aria-label="판게아 카카오톡 채널"
          >
            <Icon name="kakao" width={60} height={60} />
          </a>
          <a
            href={SOCIAL.instagram}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center"
            aria-label="판게아 인스타그램"
          >
            <Icon name="instagram" width={60} height={60} />
          </a>
        </div>
      </div>

      <div className="border-purple3 mt-comp-sm flex flex-col gap-comp-sm border-t pt-comp-sm sm:flex-row sm:items-start sm:justify-between">
        <div className="flex flex-col gap-2">
          <p className="text-pretendard-footer-meta">판게아&nbsp;&nbsp;|&nbsp;&nbsp;권 하 경</p>
          <a href="mailto:khkbt3731@gmail.com" className="text-cormorant-footer-meta">
            khkbt3731@gmail.com
          </a>
        </div>
        <p className="shrink-0 text-cormorant-footer-meta sm:text-right">
          ©&nbsp;Pangea&nbsp;&nbsp;|&nbsp;&nbsp;All Rights reserved.
        </p>
      </div>
    </footer>
  );
}
