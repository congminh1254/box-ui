// config-overrides.js
const webpack = require('webpack');

module.exports = function override(config, env) {
    if (!config.resolve) {
        config.resolve = {};
    }
    if (!config.resolve.fallback) {
        config.resolve.fallback = {};
    }
    config.resolve.fallback['crypto'] = require.resolve('crypto-browserify')
    config.resolve.fallback['stream'] = require.resolve('stream-browserify')
    config.resolve.fallback['buffer'] = require.resolve('buffer')
    config.plugins.push(new webpack.ProvidePlugin({
        process: 'process/browser',
      }))
    return config
}