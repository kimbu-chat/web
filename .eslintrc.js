const a11yOff = Object.keys(require('eslint-plugin-jsx-a11y').rules).reduce((acc, rule) => {
  acc[`jsx-a11y/${rule}`] = 'off';
  return acc;
}, {});

module.exports = {
  env: {
    browser: true,
    es2021: true,
  },
  extends: [
    'plugin:react/recommended',
    'plugin:import/typescript',
    'airbnb',
    'plugin:@typescript-eslint/recommended',
    'plugin:import/errors',
    'plugin:import/warnings',
    'prettier',
  ],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    tsconfigRootDir: './',
    project: 'tsconfig.json',
    sourceType: 'module',
    ecmaFeatures: {
      jsx: true,
    },
    ecmaVersion: 12,
  },
  plugins: ['react', '@typescript-eslint', 'react-hooks', 'import'],
  rules: {
    ...a11yOff,
    'react/jsx-props-no-spreading': 'off',
    'react-hooks/rules-of-hooks': 'error',
    'react-hooks/exhaustive-deps': 'warn',
    '@typescript-eslint/no-explicit-any': 'off',
    'react/jsx-filename-extension': [
      1,
      {
        extensions: ['.tsx'],
      },
    ],
    'import/order': [
      'error',
      {
        groups: ['builtin', 'external', ['internal', 'unknown'], 'parent', 'sibling', 'index'],
        'newlines-between': 'always',
      },
    ],
    'import/prefer-default-export': 'off',
    'import/extensions': [
      'error',
      'ignorePackages',
      {
        ts: 'never',
        tsx: 'never',
      },
    ],
    '@typescript-eslint/explicit-module-boundary-types': 'off',
    'react/jsx-one-expression-per-line': 'off',
    'no-use-before-define': 'off',
    'no-shadow': 'off',
    'object-curly-newline': 'off',
    'implicit-arrow-linebreak': 'off',
    '@typescript-eslint/no-shadow': ['error'],
    'no-param-reassign': ['error', { props: true, ignorePropertyModificationsFor: ['draft'] }],
    '@typescript-eslint/no-undef': 'off',
    'no-bitwise': ['error', { allow: ['|'] }],
    'react/require-default-props': 'off',
    'no-underscore-dangle': [
      'error',
      { allow: ['__config', '__REDUX_DEVTOOLS_EXTENSION_COMPOSE__'] },
    ],
  },
  settings: {
    'import/resolver': {
      typescript: {
        alwaysTryTypes: true,
        project: './tsconfig.json',
      },
      node: {
        extensions: ['.js', '.jsx', '.ts', '.tsx'],
      },
    },
  },
  overrides: [
    {
      files: ['**/*.tsx'],
      rules: {
        'react/prop-types': 'off',
      },
    },
  ],
};
