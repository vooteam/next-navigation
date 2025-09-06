import baseConfig from '../../eslint.config.mjs';

export default [
  ...baseConfig,
  {
    files: ['**/*.json'],
    rules: {
      '@nx/dependency-checks': [
        'error',
        {
          ignoredFiles: [
            '{projectRoot}/eslint.config.{js,cjs,mjs,ts,cts,mts}',
            '{projectRoot}/vite.config.{js,ts,mjs,mts}',
            '{projectRoot}/vitest.config.{js,ts,mjs,mts}',
            '{projectRoot}/**/*.spec.{js,ts,tsx}',
            '{projectRoot}/**/*.test.{js,ts,tsx}',
            '{projectRoot}/src/**/*.spec.{js,ts,tsx}',
            '{projectRoot}/src/**/*.test.{js,ts,tsx}',
          ],
          ignoredDependencies: ['vitest', '@vitest/*'],
        },
      ],
    },
    languageOptions: {
      parser: await import('jsonc-eslint-parser'),
    },
  },
];
