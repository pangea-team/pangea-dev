import Icon from '@/components/Icon';

const SOCIAL = {
  kakaoTalk: 'https://pf.kakao.com/',
  instagram: 'https://www.instagram.com/',
} as const;

export default function Footer() {
  return (
    <footer className="mt-8 shrink-0 overflow-hidden bg-background px-4 py-4 sm:mt-section-sm sm:px-page-x sm:py-comp-sm">
      <div className="flex flex-row items-center justify-between gap-4 sm:gap-6">
        <div className="flex flex-col">
          <p className="py-1 uppercase text-cormorant-logo sm:py-2 sm:text-cormorant-display-2">
            PANGEA
          </p>
          <p className="italic text-cormorant-footer-meta sm:text-cormorant-footer-tagline">
            Someone is reading you.
          </p>
        </div>
        <div className="flex shrink-0 items-center gap-2 sm:gap-3">
          <a
            href={SOCIAL.kakaoTalk}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center"
            aria-label="판게아 카카오톡 채널"
          >
            <Icon name="kakao" className="h-8 w-8 sm:h-10 sm:w-10 lg:h-12 lg:w-12" />
          </a>
          <a
            href={SOCIAL.instagram}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center"
            aria-label="판게아 인스타그램"
          >
            <Icon name="instagram" className="h-8 w-8 sm:h-10 sm:w-10 lg:h-12 lg:w-12" />
          </a>
        </div>
      </div>

      <div className="border-purple3 mt-4 flex flex-col gap-3 border-t pt-4 sm:mt-comp-sm sm:flex-row sm:items-start sm:justify-between sm:gap-6 sm:pt-comp-sm">
        <div className="flex flex-col gap-2">
          <p className="text-pretendard-body-3 sm:text-pretendard-footer-meta">
            판게아&nbsp;&nbsp;|&nbsp;&nbsp;권 하 경
          </p>
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
