export default {
  extends: ['@commitlint/config-conventional'],
  rules: {
    // 사용 가능한 타입 제한
    'type-enum': [2, 'always', ['feat', 'fix', 'chore', 'refactor', 'docs', 'style']],

    // 타입은 소문자로
    'type-case': [2, 'always', 'lower-case'],

    // 타입 비워두지 않기
    'type-empty': [2, 'never'],

    // subject(메시지 본문) 비워두지 않기
    'subject-empty': [2, 'never'],

    // subject 끝에 마침표 금지
    'subject-full-stop': [2, 'never', '.'],

    // 전체 커밋 메시지 제목(header) 최대 길이
    'header-max-length': [2, 'always', 100],

    // 이슈 번호 필수! (#숫자 형식 강제)
    'references-empty': [2, 'never'],
  },
  parserPreset: {
    parserOpts: {
      // #123 형식을 이슈 참조로 인식
      issuePrefixes: ['#'],
    },
  },
};
