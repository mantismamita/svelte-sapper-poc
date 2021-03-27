const webpack = require('webpack');
const WebpackModules = require('webpack-modules');
const path = require('path');
const config = require('sapper/config/webpack.js');
const pkg = require('./package.json');
const sveltePreprocess = require('svelte-preprocess');
const postcssPresetEnv = require('postcss-preset-env');

const mode = process.env.NODE_ENV;
const dev = mode === 'development';
const prod = mode === 'production';

const alias = { svelte: path.resolve('node_modules', 'svelte') };
const extensions = ['.mjs', '.js', '.json', '.svelte', '.html'];
const mainFields = ['svelte', 'module', 'browser', 'main'];
const fileLoaderRule = {
	test: /\.(png|jpe?g|gif)$/i,
	use: [
		'file-loader',
	]
};

module.exports = {
	client: {
		entry: config.client.entry(),
		output: config.client.output(),
		resolve: { alias, extensions, mainFields },
		module: {
			rules: [
				{
					test: /\.(svelte|html)$/,
					use: {
						loader: 'svelte-loader',
						options: {
							preprocess: sveltePreprocess({
								// https://github.com/kaisermann/svelte-preprocess/#user-content-options
								sourceMap: !prod,
								postcss: {
									plugins: [
										require('postcss-import')(),
										require('postcss-mixins'),
										require('autoprefixer'),
										require('postcss-custom-media'),
										require('postcss-custom-properties'),
										postcssPresetEnv({
											stage: 3,
											features: {
												'custom-media-queries': true,
												'nesting-rules': true,
											},
											importFrom: [
												'./src/assets/styles/__customMedia.css',
												'./src/assets/styles/__customProperties.css'
											],
											exportTo: (customProperties, fileContent) => {
												console.log(customProperties)
											}
										}),
										require('postcss-global-nested')(),
										require('cssnano')({
											preset: 'default',
										}),
									],
								},
							}),
							dev,
							hydratable: true,
							hotReload: false // pending https://github.com/sveltejs/svelte/issues/2377
						}
					}
				},
				fileLoaderRule
			]
		},
		mode,
		plugins: [
			// pending https://github.com/sveltejs/svelte/issues/2377
			// dev && new webpack.HotModuleReplacementPlugin(),
			new webpack.DefinePlugin({
				'process.browser': true,
				'process.env.NODE_ENV': JSON.stringify(mode)
			}),
		].filter(Boolean),
		devtool: dev && 'inline-source-map'
	},

	server: {
		entry: config.server.entry(),
		output: config.server.output(),
		target: 'node',
		resolve: { alias, extensions, mainFields },
		externals: Object.keys(pkg.dependencies).concat('encoding'),
		module: {
			rules: [
				{
					test: /\.(svelte|html)$/,
					use: {
						loader: 'svelte-loader',
						options: {
							css: false,
							generate: 'ssr',
							hydratable: true,
							dev
						}
					}
				},
				fileLoaderRule
			]
		},
		mode,
		plugins: [
			new WebpackModules()
		],
		performance: {
			hints: false // it doesn't matter if server.js is large
		}
	},

	serviceworker: {
		entry: config.serviceworker.entry(),
		output: config.serviceworker.output(),
		mode
	}
};
