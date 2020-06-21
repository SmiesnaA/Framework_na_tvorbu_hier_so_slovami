const path = require('path');
var webpack = require('webpack');

module.exports = {
    performance: {
        maxAssetSize: 1000000,
        maxEntrypointSize: 1000000,
        hints: "warning"
    },
    mode: 'production',
    entry: {
        main: path.join(__dirname, '/client/js/ts_main/main.ts'),
		pokracuj: path.join(__dirname, '/client/js/ts_main/pokracuj.ts'),
		osemsmerovka: path.join(__dirname, '/client/js/ts_main/osemsmerovka.ts'),
        slova: path.join(__dirname, '/client/js/ts_main/slova.ts'),
        mapa: path.join(__dirname, '/client/js/ts_main/mapa.ts'),
        hladajSlova: path.join(__dirname, '/client/js/ts_main/hladajSlova.ts')
	},
	output: {
		path: __dirname,
		filename: "[name].js"
	},
    node: { fs: 'empty' },
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                exclude: /node_modules/,
                type: "javascript/auto",
                loader: 'ts-loader'
            },
        ]
    },
    plugins: [
        new webpack.optimize.OccurrenceOrderPlugin(),
        new webpack.HotModuleReplacementPlugin(),
        new webpack.NoEmitOnErrorsPlugin(),
     ],
    resolve: {
        extensions: [".tsx", ".ts", ".js"]
    }
};

