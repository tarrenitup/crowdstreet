var path = require('path');
var HtmlWebpackPlugin =  require('html-webpack-plugin');

module.exports = {
    entry : './index.js',
    output : {
        path : path.resolve(__dirname , 'build'),
        filename: 'index_bundle.js'
    },
    module : {
        rules : [
            {test: /.jsx?$/, use:'babel-loader'},
            {test : /\.css$/, use:['style-loader', 'css-loader']}
        ]
    },
    resolve: {
        extensions: ['.js', '.jsx']
    },
    mode:'development',
    plugins : [
        new HtmlWebpackPlugin ({
            template : 'index.html'
        })
    ]
}
