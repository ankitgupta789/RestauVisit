const webpack = require('webpack');

module.exports = {
  webpack: function (config) {
    console.log(config);  // Add this line to check the final Webpack config
    config.resolve.fallback = {
      ...config.resolve.fallback,
      crypto: require.resolve('crypto-browserify'),
      stream: require.resolve('stream-browserify'),
      process: require.resolve('process/browser.js'),
      vm: require.resolve('vm-browserify'),
    };
    config.resolve.extensions = [
        ...config.resolve.extensions,
        '.mjs', // Ensure .mjs is resolved
      ];
    config.plugins = [
      ...config.plugins,
      new webpack.ProvidePlugin({
        process: 'process/browser.js',
      }),
    ];

    return config;
  },
};
