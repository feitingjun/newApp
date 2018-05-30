const webpack = require('webpack');
const path = require("path");
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
module.exports = {    
    target:"node-webkit",
	devtool: "cheap-module-eval-source-map",//cheap-module-eval-source-map source-map Source Maps，提供了一种对应编译文件和源文件的方法，使得编译后的代码可读性更高，也更容易调试。
	entry:__dirname + "/src/index.js",//入口文件
	output: {
	    path: path.resolve(__dirname, './dist'),//打包后的文件存放的地方
        filename: "index.js",//打包后输出文件的文件名
	    publicPath: "/"
 	},
	devServer: {
	    contentBase: "./public",//本地服务器所加载的页面所在的目录
	    historyApiFallback: true,//不跳转
	    inline: true,//实时刷新
	    port:"5000"//端口
	},
	module:{
		rules:[{
			test:/(\.jsx|\.js)$/,//对js或jsx文件使用babel-loader
			use:{
                loader:"babel-loader",
                options: {
                    cacheDirectory: true//缓存
                }
            },
      		exclude: /node_modules/
		},{
			test:/\.css$/,//对css文件使用style-loader和css Modulesy
			exclude: /node_modules|antd\.css/,
            use:ExtractTextPlugin.extract({//分离js和css
		           fallback: "style-loader",
		           use: [{
							loader:"css-loader",
							options:{
								modules:true,//是否使用css Modules
								localIdentName: '[local]_[hash:base64:5]',//编译的css名格式
								minimize:true//压缩css
							}
						},{
			    			loader:"postcss-loader"//css自动添加浏览器前缀
		      			}]
		      	})
		},{
			test:/\.css$/,
            include:/node_modules|antd\.css/,
			use:ExtractTextPlugin.extract({//分离js和css
				fallback: "style-loader",
				use: [{
						 loader:"css-loader"
					 }]
			   })
		},{
            test:/\.scss$/,
            exclude: /node_modules/,
            use:['style-loader','css-loader','sass-loader']
        },{
			test:/\.(png|jpg|jpeg|gif|svg|woff|ttf|wav|mp3|mpeg|mp4|webm|ogv)(\?\S*)?$/,//编译图片、音频、视频等文件，不区分大小写
            exclude: /node_modules/,
            use:{//limit小于指定值转为base64，name：指定打包后的文件路径
				loader:"url-loader?limit=10240&name=./assets/[name]_[hash:8].[ext]",//url-loader时file-loader的封装，url-loader依赖于file-loader
                options:{
                    publicPath:'/'//图片路径，未测试不知道能不能正常显示图片
                }
            }
        }],
        noParse:[__dirname+"node_modules"]
    },
  plugins:[//插件
    new HtmlWebpackPlugin({
        template: __dirname + "/public/index.html", //html摸板插件,需要自动引入打包后的文件可能要将html改为ejs，删除引入的js和css，未测试
        inject:false//不自动引入打包后的js文件
    }),
    new ExtractTextPlugin("index.css"),//分离js和css
    // new webpack.optimize.UglifyJsPlugin(),//压缩js
    // new extraBabelPlugins([
    //     "dva-hmr"
    // ])
  ] 
}

if (process.env.NODE_ENV === 'production') {
    module.exports.plugins = (module.exports.plugins || []).concat([
        new webpack.DefinePlugin({
            'process.env': {
                NODE_ENV: '"production"'
            }
        }),
        new webpack.BannerPlugin('版权所有，翻版必究'),//自动添加版权信息
        new webpack.optimize.OccurrenceOrderPlugin(),//为组件分配id
        new webpack.optimize.UglifyJsPlugin({
            sourceMap: false,
            compress: {
                warnings: false
            }
        }),
        new webpack.LoaderOptionsPlugin({
            minimize: true
        })
    ])
    module.exports.devtool = "cheap-module-source-map";
}