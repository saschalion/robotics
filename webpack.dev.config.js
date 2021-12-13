// This config is extented from webpack.config.js. We use it for development with webpack-dev-server and autoreload/refresh

const webpack = require('webpack');
const path = require("path");
const autoprefixer = require('autoprefixer');
const HtmlWebpackPlugin = require("html-webpack-plugin");
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');

// const mainConfig = new Config().extend("webpack.config");
// mainConfig.module.rules = [];

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
			// We are using next two entries for hot-reload
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
		modules: ['node_modules', 'App', 'resources'],
		extensions: ['.ts', '.tsx', '.js', '.sass', '.js']
	},

	// more options here: http://webpack.github.io/docs/configuration.html#devtool
	devtool: 'eval-source-map',

	module: {
		rules: [
			// {
			//   test: /\.tsx?$/,
			//   enforce: 'pre',
			//   loader: 'tslint-loader',
			//   options: { emitErrors: true },
			//   include: path.join(__dirname, "App")
			// },
			{
				test: /\.tsx?$/,
				loaders: ["react-hot-loader", "babel-loader?cacheDirectory", "awesome-typescript-loader?tsconfig=tsconfig.webpack.json&useCache=true"]
			},

			{
				test: /\.css$/,
				loaders: ["style-loader", "css-loader"]
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
				test:/\.module\.sass/,
				use: ExtractTextPlugin.extract({
					fallback: 'style-loader',
					use: [
						{
							loader: 'css-loader',
							options: {
								sourceMap: true,
								localIdentName: '[name]__[local]___[hash:base64:5]',
								modules: true,
								importLoaders: true
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

		// Used for hot-reload
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