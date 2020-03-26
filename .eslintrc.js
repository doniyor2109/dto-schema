'use strict';

module.exports = {
  plugins: ['@superdispatch/eslint-plugin'],

  overrides: [
    {
      files: '*.js',
      extends: 'plugin:@superdispatch/node',
    },
    {
      files: '*.ts',
      extends: 'plugin:@superdispatch/typescript',
    },
    {
      files: '**/{__tests__,__testutils__}/**/*.ts',
      extends: 'plugin:@superdispatch/jest',
      rules: {
        '@typescript-eslint/no-explicit-any': 'off',
      },
    },
  ],
};
