const HtmlWebPackPlugin = require('html-webpack-plugin');
const path = require('path');
const htmlPlugin = new HtmlWebPackPlugin({
    template: './src/index.html',
    filename: './index.html',
});

const CSS_RULE = {
    test: /\.(sa|sc|c)ss$/,
    use: [
        // 'style-loader',
        'css-loader',
        'sass-loader',
    ],
};

const JS_RULES = {
    test: /\.js$/,
    exclude: /node_modules/,
    use: [
        'babel-loader',
    ],
};

const RULES = [
    JS_RULES,
    CSS_RULE,
];

module.exports = {
    mode: 'development',
    entry: './src/index.js',
    output: {
        filename: 'main.js',
        path: path.resolve(__dirname, 'dist'),
    },
    module: {
        rules: RULES,
    },
    plugins: [htmlPlugin],
};
