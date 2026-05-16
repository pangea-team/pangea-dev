// 카카오(다음) 우편번호 서비스: https://postcode.map.kakao.com/guide
// daum.Postcode 전역은 next/script로 로드된 후 window.daum 에 주입된다.

export type DaumPostcodeData = {
  zonecode: string;
  address: string;
  roadAddress: string;
  jibunAddress: string;
  buildingName?: string;
  apartment?: 'Y' | 'N';
  userSelectedType?: 'R' | 'J';
};

export type DaumPostcodeOptions = {
  oncomplete: (data: DaumPostcodeData) => void;
  onclose?: () => void;
};

export type DaumPostcodeInstance = {
  open: () => void;
};

declare global {
  interface Window {
    daum?: {
      Postcode: new (options: DaumPostcodeOptions) => DaumPostcodeInstance;
    };
  }
}
