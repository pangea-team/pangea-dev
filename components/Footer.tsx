import Icon from '@/components/Icon';

const SOCIAL = {
  kakaoTalk: 'https://pf.kakao.com/',
  instagram: 'https://www.instagram.com/',
} as const;

type Props = {
  className?: string;
};

export default function Footer({ className }: Props) {
  return (
    <footer className={`mt-auto shrink-0 px-page-x pt-10 pb-10 ${className ?? ''}`}>
      <div className="flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex flex-col">
          <p className="text-cormorant-display-2 py-2 uppercase tracking-[8.4px] text-primary">
            PANGEA
          </p>
          <p className="text-cormorant-footer-tagline tracking-[2.2px] text-primary">
            Someone is reading you.
          </p>
        </div>
        <div className="flex shrink-0 self-end sm:self-start">
          <a
            href={SOCIAL.kakaoTalk}
            target="_blank"
            rel="noopener noreferrer"
            className="flex size-[60px] items-center justify-center"
            aria-label="판게아 카카오톡 채널"
          >
            <Icon name="kakao" width={60} height={60} />
          </a>
          <a
            href={SOCIAL.instagram}
            target="_blank"
            rel="noopener noreferrer"
            className="flex size-[60px] items-center justify-center"
            aria-label="판게아 인스타그램"
          >
            <Icon name="instagram" width={60} height={60} />
          </a>
        </div>
      </div>

      <div className="border-purple3 mt-10 flex flex-col gap-6 border-t pt-8 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex flex-col gap-2">
          <p className="text-pretendard-footer-meta tracking-[1.6px] text-primary">
            판게아&nbsp;&nbsp;|&nbsp;&nbsp;권 하 경
          </p>
          <a
            href="mailto:khkbt3731@gmail.com"
            className="text-cormorant-footer-meta tracking-[1.6px] text-primary"
          >
            khkbt3731@gmail.com
          </a>
        </div>
        <p className="text-cormorant-footer-meta shrink-0 tracking-[1.6px] text-primary sm:text-right">
          ©&nbsp;Pangea&nbsp;&nbsp;|&nbsp;&nbsp;All Rights reserved.
        </p>
      </div>
    </footer>
  );
}
