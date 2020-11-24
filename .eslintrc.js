module.exports = {
	root: true,
	extends: ['@react-native-community', 'airbnb', 'airbnb/hooks', 'prettier', 'prettier/@typescript-eslint'],
	parser: '@typescript-eslint/parser',
	plugins: ['@typescript-eslint'],
	rules: {
		'import/no-extraneous-dependencies': [
			'error',
			{
				devDependencies: true,
				optionalDependencies: false,
				peerDependencies: false,
				packageDir: __dirname,
			},
		],
		'react/jsx-filename-extension': ['error', { extensions: ['.tsx'] }],
		'import/extensions': [
			'error',
			'ignorePackages',
			{
				ts: 'never',
				tsx: 'never',
			},
		],
		'import/prefer-default-export': 'off',
		'@typescript-eslint/explicit-function-return-type': [
			'error',
			{ allowExpressions: true, allowTypedFunctionExpressions: true },
		], // force to define function return type
		'class-methods-use-this': [
			'error',
			{ exceptMethods: ['componentDidCatch', 'componentDidAppear', 'componentDidDisappear', 'handle'] },
		],
		'import/no-unresolved': [
			'error',
			{
				ignore: [
					'@app',
					'@icons',
					'@store',
					'@sounds',
					'@utils',
					'@shared_components',
					'@messenger_components',
					'@login_components',
				],
			},
		], // ignore import with @app & .
		'max-len': ['error', 140], // change max length for a line to 120
		'no-console': 'error', // don't allow console
		'no-param-reassign': 0,
		'no-unused-expressions': ['error', { allowShortCircuit: true }], // don't use unused expressions except short circuit
		'no-unused-vars': ['error', { argsIgnorePattern: '^_' }], // don't use unused var except with _ prefix
		'@typescript-eslint/no-explicit-any': ['error'], // forbid to use 'any' type
		'react/jsx-props-no-spreading': 0,
		'react/jsx-indent': [2, 'tab'],
		'react/jsx-indent-props': [2, 'tab'],
	},
	settings: {
		'import/resolver': {
			'babel-module': {},
			node: {
				extensions: ['.js', '.jsx', '.ts', '.tsx'],
			},
		},
	},
};
