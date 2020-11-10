var webpack = require('webpack');
var path = require('path');
var package = require('./package.json');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
const CopyPlugin = require('copy-webpack-plugin');

// variables
var isProduction =
	process.argv.indexOf('-p') >= 0 ||
	process.env.NODE_ENV === 'production' ||
	process.env.NODE_ENV === 'productionAnalyze';
var isProductionAnalyze = process.env.NODE_ENV === 'productionAnalyze';
var sourcePath = path.join(__dirname, './src');
var outPath = path.join(__dirname, './build');

// plugins
var HtmlWebpackPlugin = require('html-webpack-plugin');
var MiniCssExtractPlugin = require('mini-css-extract-plugin');
var { CleanWebpackPlugin } = require('clean-webpack-plugin');

module.exports = {
	context: sourcePath,
	entry: {
		app: './main.tsx',
	},
	output: {
		path: outPath,
		filename: isProduction ? '[contenthash].js' : '[hash].js',
		chunkFilename: isProduction ? '[name].[contenthash].js' : '[name].[hash].js',
	},
	target: 'web',
	resolve: {
		extensions: ['.js', '.ts', '.tsx'],
		// Fix webpack's default behavior to not load packages with jsnext:main module
		// (jsnext:main directs not usually distributable es6 format, but es6 sources)
		mainFields: ['module', 'browser', 'main'],
		alias: {
			app: path.resolve(__dirname, 'src/app/'),
		},
	},
	module: {
		rules: [
			// .ts, .tsx
			{
				test: /\.tsx?$/,
				use: [
					!isProduction && {
						loader: 'babel-loader',
						options: {
							plugins: [
								'react-hot-loader/babel',
								[
									'transform-imports',
									{
										'react-bootstrap': {
											transform: 'react-bootstrap/lib/${member}',
											preventFullImport: true,
										},
										lodash: {
											transform: 'lodash/${member}',
											preventFullImport: true,
										},
									},
								],
								['import', { libraryName: '@material-ui/core', camel2DashComponentName: false }],
							],
						},
					},
					'ts-loader',
				].filter(Boolean),
			},
			// css
			{
				test: /\.s(c|a)ss$/,
				use: [
					isProduction ? MiniCssExtractPlugin.loader : 'style-loader',
					{
						loader: 'css-loader',
						query: {
							sourceMap: !isProduction,
							importLoaders: 1,
						},
					},
					{
						loader: 'postcss-loader',
						options: {
							postcssOptions: {
								plugins: [
									require('postcss-import')({ addDependencyTo: webpack }),
									require('postcss-url')(),
									require('postcss-preset-env')({
										/* use stage 2 features (defaults) */
										stage: 2,
									}),
									require('postcss-reporter')(),
									require('postcss-browser-reporter')({
										disabled: isProduction,
									}),
								],
							},
						},
					},
					'sass-loader',
				],
			},
			{
				test: /\.svg$/,
				use: [
					{
						loader: '@svgr/webpack',
						options: { ref: true, memo: true },
					},
				],
			},
			{
				test: /\.css$/,
				use: [
					isProduction ? MiniCssExtractPlugin.loader : 'style-loader',
					{
						loader: 'css-loader',
						query: {
							sourceMap: !isProduction,
							importLoaders: 1,
						},
					},
					{
						loader: 'postcss-loader',
						options: {
							postcssOptions: {
								plugins: [
									require('postcss-import')({ addDependencyTo: webpack }),
									require('postcss-url')(),
									require('postcss-preset-env')({
										/* use stage 2 features (defaults) */
										stage: 2,
									}),
									require('postcss-reporter')(),
									require('postcss-browser-reporter')({
										disabled: isProduction,
									}),
								],
							},
						},
					},
				],
			},
			// static assets
			{ test: /\.html$/, use: 'html-loader' },
			{ test: /\.(a?png)$/, use: 'url-loader?limit=10000' },
			{
				test: /\.(jpe?g|gif|bmp|mp3|mp4|ogg|wav|eot|ttf|woff|woff2)$/,
				use: 'file-loader',
			},
		],
	},
	optimization: {
		splitChunks: {
			name: true,
			cacheGroups: {
				commons: {
					chunks: 'initial',
					minChunks: 2,
				},
				vendors: {
					test: /[\\/]node_modules[\\/]/,
					chunks: 'all',
					priority: -10,
				},
			},
		},
		runtimeChunk: true,
	},
	plugins: [
		new webpack.ContextReplacementPlugin(/moment[/\\]locale$/, /ru|en-gb/),
		new CopyPlugin({
			patterns: [{ from: 'assets/', to: outPath }],
			options: {
				concurrency: 100,
			},
		}),
		new webpack.EnvironmentPlugin({
			NODE_ENV: 'development', // use 'development' unless process.env.NODE_ENV is defined
			DEBUG: false,
		}),
		new CleanWebpackPlugin(),
		new MiniCssExtractPlugin({
			filename: '[hash].css',
			disable: !isProduction,
		}),
		new HtmlWebpackPlugin({
			template: 'assets/index.html',
			minify: {
				minifyJS: true,
				minifyCSS: true,
				removeComments: true,
				useShortDoctype: true,
				collapseWhitespace: true,
				collapseInlineTagWhitespace: true,
			},
			append: {
				head: `<script src="//cdn.polyfill.io/v3/polyfill.min.js"></script>`,
			},
			meta: {
				title: package.name,
				description: package.description,
				keywords: Array.isArray(package.keywords) ? package.keywords.join(',') : undefined,
			},
		}),
		...(isProductionAnalyze ? [new BundleAnalyzerPlugin()] : []),
	],

	devServer: {
		port: 3000,
		host: 'localhost',
		contentBase: sourcePath,
		open: true,
		hot: true,
		inline: true,
		historyApiFallback: {
			disableDotRule: true,
		},
		stats: 'minimal',
		clientLogLevel: 'warning',
		https: true,
	},
	// https://webpack.js.org/configuration/devtool/
	devtool: isProduction ? 'source-map' : 'cheap-module-eval-source-map',
	node: {
		// workaround for webpack-dev-server issue
		// https://github.com/webpack/webpack-dev-server/issues/60#issuecomment-103411179
		fs: 'empty',
		net: 'empty',
	},
};
