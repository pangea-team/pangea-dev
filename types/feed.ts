/**
 * 피드 카드·목록 도메인 타입. 백엔드 스펙이 정해지면 응답 DTO → 이 형태로 매핑한다.
 */
export type FeedImageSlide = {
  id: string;
  src: string;
};

export type FeedItem = {
  id: string;
  type: string;
  images: FeedImageSlide[];
  date: string;
  status: string;
  question: string;
  answer: string;
  /** true면 노란 오더 버튼 + 구매 확인 팝업 */
  orderPurchasable: boolean;
  /** 상단 타입 줄 배경 — 목업이면 책 표지 톤 4색 중 하나 */
  headerBarBackgroundColor?: string;
};

export type MyFeedProfile = {
  nickname: string;
  /** 프로필 링(원형 배경) 이미지 URL */
  profileRingSrc: string;
  /** 링 안에 보이는 아바타(예: 돌맹이) 이미지 URL */
  avatarSrc: string;
};

export type MyFeedPageData = {
  profile: MyFeedProfile;
  feeds: FeedItem[];
};
