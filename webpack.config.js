const path = require('path');

const createSrcPath = (pathname) => path.resolve(__dirname, 'src', pathname);

const stage = JSON.stringify(process.env.NODE_ENV);

const config = {
  entry: {
    config: './src/config/index.js',
    live_config: './src/live_config/index.js',
    viewer: './src/viewer/index.js'
  },

  output: {
    path: path.resolve(__dirname, 'public'),
    filename: '[name].js'
  },

  externals: {
    'Config': JSON.stringify(stage == JSON.stringify("development") ? { ssAPIEndpoint: "https://localhost:4567"} : { ssAPIEndpoint: "https://api.stockstream.live" })
  },

  resolve: {
    alias: {
      components: createSrcPath('components'),
      viewer: createSrcPath('viewer'),
      config: createSrcPath('config'),
      liveconfig: createSrcPath('live_config'),
      reducers: createSrcPath('reducers')
    }
  },

  module: {
    loaders: [
      { test: /\.css$/, loader: 'style-loader!css-loader', exclude: /node_modules/ },
      { test: /\.js$/, loader: 'babel-loader', exclude: /node_modules/ },
      { test: /\.jsx$/, loader: 'babel-loader', exclude: /node_modules/ },
      { test: /\.(woff2?|jpe?g|png|gif|ico)$/, loader: 'file-loader', exclude: /node_modules/ }
    ]
  },

  devServer: {
    contentBase: path.resolve(__dirname, 'public'),
    historyApiFallback: true,
    inline: true,
    open: true,
    port: 8000
  }
};

module.exports = config;
