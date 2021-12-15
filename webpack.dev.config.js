const webpack = require('webpack');
const path = require("path");
const autoprefixer = require('autoprefixer');
const HtmlWebpackPlugin = require("html-webpack-plugin");
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');

const devConfigExtension = {
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
			'webpack-dev-server/client?http://localhost:3333',
			'webpack/hot/only-dev-server',
			path.join(__dirname, 'App', 'Index.tsx')
		]
	},

	output: {
		filename: '[name].js',
		publicPath: "http://localhost:3333/"
	},

	resolve: {
		modules: ['node_modules', 'App'],
		extensions: ['.ts', '.tsx', '.js']
	},

	devtool: 'source-map',

	module: {
		rules: [
			{
				test: /\.tsx?$/,
				loaders: [
					"react-hot-loader/webpack",
					"babel-loader?cacheDirectory",
					"ts-loader"
				]
			},

			{
				test: /\.sass/,
				exclude: /\.module\.sass/,
				use: ExtractTextPlugin.extract({
					fallback: 'style-loader',
					use: [
						{
							loader: 'css-loader',
							options: {
								sourceMap: true
							}
						},
						{
							loader: 'postcss-loader',
							options: {
								plugins: [autoprefixer()],
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
				test:/\.module\.sass/,
				use: ExtractTextPlugin.extract({
					fallback: 'style-loader',
					use: [
						{
							loader: 'css-loader',
							options: {
								sourceMap: true,
								localIdentName: '[local]___[hash:base64:5]',
								modules: true,
								importLoaders: true
							}
						},
						{
							loader: 'postcss-loader',
							options: {
								plugins: [autoprefixer()],
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
				test: /\.(jpg|png|woff|eot|ttf|svg|gif)$/,
				loader: "file-loader?name=[name]_[hash].[ext]"
			}
		]
	},

	plugins: [
		new webpack.optimize.CommonsChunkPlugin({
			name: 'vendors',
			filename: 'vendors.js'
		}),

		new webpack.HotModuleReplacementPlugin(),

		new webpack.DefinePlugin({
			DEBUG: true
		}),

		new HtmlWebpackPlugin({
			template: 'index.html'
		}),

		new ExtractTextPlugin({
			filename: 'styles.css'
		}),

		new CopyWebpackPlugin([
			{
				from: './assets',
				to: './static/assets'
			}
		])
	]
};

module.exports = devConfigExtension;