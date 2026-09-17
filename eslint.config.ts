import nextJS from 'eslint-idea2app-next-js';

export default [
  ...nextJS,
  {
    ignores: ['**/node_modules/**', '**/public/**', '**/.next/**', '.github/scripts/**'],
  },
  {
    rules: {
      '@cspell/spellchecker': [
        'warn',
        {
          cspell: {
            words: ['aliyun', 'datav', 'Giscus', 'hackathon', 'Serwist'],
          },
        },
      ],
    },
  },
];
