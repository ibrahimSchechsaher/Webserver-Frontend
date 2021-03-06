const CopyWebpackPlugin = require('copy-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const MiniCSSExtractPlugin = require('mini-css-extract-plugin')
const path = require('path')

module.exports = {
    entry: {
        app : path.resolve(__dirname, '../src/script.js'),
        main : path.resolve(__dirname, '../src/style.css')
     //   index: path.resolve(__dirname, '../src/index.js')
    },
    output:
    {
        filename: 'bundle.[contenthash].js',
        path: path.resolve(__dirname, '../dist')
    },
    devtool: 'source-map',
    plugins:
    [
        new CopyWebpackPlugin({
            patterns: [
                { from: path.resolve(__dirname, '../static') }
            ]
        }),

        new HtmlWebpackPlugin({
            template: path.resolve(__dirname, '../src/index.html'),
            minify: true,
            chunks: ['main']

        }),
        new HtmlWebpackPlugin({
        filename: 'visualisieren.html',
        template: './src/visualisieren.html',
            chunks:['app']

        }),

        new MiniCSSExtractPlugin()
    ],
    module:
    {
        rules:
        [
            // HTML
            {
                test: /\.(html)$/,
                use: ['html-loader']
            },

            // JS
            {
                test: /\.js$/,
                exclude: /node_modules/,
                use:
                [
                    'babel-loader'
                ]
            },

            // CSS
            {
                test: /\.css$/,
                use:
                [
                    MiniCSSExtractPlugin.loader,
                    'css-loader'
                ]
            },

// Images
{
    test: /\.(jpg|png|gif|svg)$/,
        use:
    [
        {
            loader: 'file-loader',
            options:
                {
                    outputPath: 'assets/images/'
                }
        }
    ]
},

// Fonts
{
    test: /\.(ttf|eot|woff|woff2)$/,
        use:
    [
        {
            loader: 'file-loader',
            options:
                {
                    outputPath: 'assets/fonts/'
                }
        }
    ]
}
]
}
}
