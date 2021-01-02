module.exports = {
  env: {
    browser: true,
  },
  extends: ['plugin:react/recommended', 'airbnb-typescript', 'prettier', 'prettier/react'],
  parser: '@typescript-eslint/parser',
  ignorePatterns: ['.eslintrc.js'],
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
    ecmaVersion: 12,
    sourceType: 'module',
    project: ['./tsconfig.json'],
  },
  plugins: ['react', '@typescript-eslint', 'prettier'],
  rules: {
    curly: ['error', 'all'],
    'react/jsx-filename-extension': [1, { extensions: ['.jsx', '.tsx'] }],
    'react/jsx-props-no-spreading': 0,
    'react/prop-types': 0,
    'react/destructuring-assignment': 0,
    '@typescript-eslint/indent': 0,
    '@typescript-eslint/no-shadow': 0,
    'prettier/prettier': ['warn'],
    'import/prefer-default-export': 0,
    'import/extensions': 0,
    'import/no-unresolved': ['error', { ignore: ['app', 'icons', 'store', 'sounds', 'utils', 'components'] }],
    'import/no-mutable-exports': 0,
    'no-param-reassign': 0,
    'no-plusplus': 0,
    'no-return-await': 0,
    'no-nested-ternary': 0,
    'require-yield': 0,
    'func-names': 0,
    'max-classes-per-file': 0,
    'class-methods-use-this': 0,
    'jsx-a11y/no-noninteractive-element-interactions': 0,
    'jsx-a11y/click-events-have-key-events': 0,
    'jsx-a11y/no-static-element-interactions': 0,
    'jsx-a11y/media-has-caption': 0,
    'jsx-a11y/label-has-associated-control': 0,
    'no-console': 0,
    'no-alert': 0,
    '@typescript-eslint/naming-convention': [
      2,
      {
        selector: 'interface',
        prefix: ['I'],
        format: ['PascalCase'],
      },
      { selector: 'variableLike', format: ['camelCase', 'PascalCase', 'UPPER_CASE'] },
      {
        selector: 'parameter',
        format: ['camelCase', 'PascalCase'],
        leadingUnderscore: 'allow',
      },
      {
        selector: 'property',
        format: ['camelCase'],
      },
      {
        selector: ['enumMember', 'enum'],
        format: ['PascalCase'],
      },
      {
        selector: 'class',
        format: ['PascalCase'],
      },
    ],
  },
  settings: {
    'import/resolver': {
      node: {
        extensions: ['.js', '.jsx', '.ts', '.tsx'],
      },
    },
  },
};
