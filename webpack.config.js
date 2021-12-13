const path = require("path");
const webpack = require("webpack");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const CopyWebpackPlugin = require('copy-webpack-plugin');

const nodeModulesPath = path.join(__dirname, 'node_modules');
const isProduction = process.env.NODE_ENV == "production";
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const autoprefixer = require('autoprefixer');

const staticDir = 'static/assets/';

const config = {
	entry: {
		vendors: [
			'react',
			'react-dom',
			'redux',
			'react-redux',
			'redux-thunk',
			'redux-logger',
			'babel-polyfill',
			path.join(__dirname, 'babel', 'babelhelpers.js')
		],
		app: [
			path.join(__dirname, 'App', 'Index.tsx')
		]
	},

	resolve: {
		modules: ['node_modules', 'App', 'resources'],
		extensions: ['.ts', '.tsx', '.js', '.sass', '.js']
	},

	output: {
		path: path.join(__dirname, '/build'),
		filename: staticDir + '[name]_[chunkhash].js',
		publicPath: '/'
	},

	module: {
		rules: [
			{
				test: /\.tsx?$/,
				enforce: 'pre',
				loader: 'tslint-loader',
				options: { emitErrors: true }
			},
			{
				test: /\.tsx?$/,
				loaders: ["babel-loader?cacheDirectory", "awesome-typescript-loader?tsconfig=tsconfig.webpack.json&useCache=true"]
			},
			{
				test: /\.css$/,
				loaders: ["style-loader", "css-loader?minimize"]
			},
			{
				test: /\.sass/,
				exclude: /\.module\.sass$/,
				use: ExtractTextPlugin.extract({
					fallback: 'style-loader',
					use: [
						{
							loader: 'css-loader',
							options: {
								sourceMap: true,
								minimize: true
							}
						},
						{
							loader: 'postcss-loader',
							options: {
								plugins: [autoprefixer({ browsers: ['last 2 versions', '> 5%'] })],
								sourceMap: true
							}
						},
						{
							loader: 'sass-loader',
							options: {
								sourceMap: true
							}
						}
					]
				})
			},

			{
				test:/\.module\.sass$/,
				use: ExtractTextPlugin.extract({
					fallback: 'style-loader',
					use: [
						{
							loader: 'css-loader',
							options: {
								sourceMap: true,
								localIdentName: '[name]__[local]___[hash:base64:5]',
								modules: true,
								importLoaders: true,
								minimize: true
							}
						},
						{
							loader: 'postcss-loader',
							options: {
								plugins: [autoprefixer({ browsers: ['last 2 versions', '> 5%'] })],
								sourceMap: false
							}
						},
						{
							loader: 'sass-loader',
							options: {
								sourceMap: false
							}
						}
					]
				})
			},
			{
				test: /\.(jpg|png|woff|eot|ttf|svg|gif)$/,
				loader: "file-loader?name=" + staticDir + "[name]_[hash].[ext]"
			}
		]
	},

	plugins: [
		new webpack.optimize.CommonsChunkPlugin({
			name: 'vendors',
			filename: staticDir + '/vendors_[hash].js'
		}),

		new HtmlWebpackPlugin({
			template: 'index.html'
		}),

		new webpack.DefinePlugin({
			'process.env': { NODE_ENV: '"production"' },
			DEBUG: false
		}),

		new ExtractTextPlugin({
			filename: staticDir + 'styles_[hash].css'
		}),

		new webpack.optimize.UglifyJsPlugin({
			compress: {
				warnings: false
			}
		}),

		new CopyWebpackPlugin([
			{
				from: './assets',
				to: './static/assets'
			}
		])
	]
};

module.exports = config;