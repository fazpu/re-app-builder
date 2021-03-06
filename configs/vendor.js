/* eslint no-var: 0 */
var webpack = require('webpack');
var _ = require('lodash');
var path = require('path');
var fs = require('fs');
// var HtmlWebpackPlugin = require('html-webpack-plugin');

// if (process.env.DEVSERVER) {
// 	try {
// 		fs.accessSync('.env');
// 	} catch (e) {
// 		console.warn('No .env file found! Please read README.md section Development.');
// 		if (!process.env.API_URL) {
// 			console.error('No API_URL environment set! Development server will not start. Please read README.md section Development.'); // eslint-disable-line
// 			process.exit(1);
// 		}
// 	}
// }

module.exports = function (projectPackage, options, config) {
	// const templatePath = path.resolve(__dirname, 'index-dev.ejs');
	const entry = {
		// devDocument: [
		// 	templatePath,
		// ],
	};

	var vendorLibs = _.keys(projectPackage.dependencies);
	vendorLibs.unshift(path.resolve(__dirname, 'vendorPlaceholder.js'));

	vendorLibs = _.reduce(_.get(options, 'excludedModules', []), function (res, excluded) {
		return _.without(
			res,
			excluded
		);
	}, vendorLibs);
	if (vendorLibs.length) {
		entry.vendor = vendorLibs;
	}

	const outputPath = _.get(config, 'output.path', path.resolve(options.projectDirName, 'public', 'build'));

	const PUBLIC_PATH = '/build/';
	const publicPath = _.get(config, 'output.publicPath', PUBLIC_PATH);

	return {
		entry: entry,
		output: {
			path: outputPath,
			filename: '[name].bundle.js',
			library: '[name]_lib',
			publicPath,
		},
		resolve: _.merge(
			{
				modules: [
					'web_modules',
					'node_modules',
					'./node_modules/re-app-builder/node_modules',
				],
			},
			_.get(config, 'resolve', {})
		),
		resolveLoader: {
			modules: [
				'node_modules',
				'./node_modules/re-app-builder/node_modules',
			]
		},
		module: {
			rules: [
				{
					test: /\.(ejs)$/,
					loaders: [
						'ejs-loader'
					],
				},
				{
					test: /\.json$/,
					loader: 'json-loader',
					include: [
						path.resolve(options.projectDirName),
					]
				},
				{
					test: /\.(js|jsx)$/,
					loaders: ['babel-loader'],
					include: [
						path.join(options.projectDirName, 'node_modules', 'generic-pool'),
					],
				},
			],
		},
		plugins: [
			new webpack.DllPlugin({
				path: path.resolve(options.projectDirName, 'manifest', '[name]-manifest.json'),
				name: '[name]_lib',
			}),
			// new HtmlWebpackPlugin({
			// 	chunks: ['devDocument'],
			// 	title: 'Dev',
			// 	filename: path.resolve(options.projectDirName, 'public/index-dev.html'),
			// 	template: templatePath,
			// 	inject: false,
			// 	hash: true,
			// }),
		],
	};
};
