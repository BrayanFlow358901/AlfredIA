const path = require('path');
const createExpoWebpackConfigAsync = require('@expo/webpack-config');

module.exports = async function (env, argv) {
  const config = await createExpoWebpackConfigAsync(
    { ...env, projectRoot: __dirname },
    argv,
  );

  config.resolve = config.resolve || {};
  const reactNativeWebPath = path.resolve(
    __dirname,
    'node_modules',
    'react-native-web',
  );
  config.resolve.alias = {
    ...(config.resolve.alias || {}),
    'react-native$': reactNativeWebPath,
    'react-native': reactNativeWebPath,
  };
  config.resolve.fallback = {
    ...(config.resolve.fallback || {}),
    crypto: require.resolve('crypto-browserify'),
  };

  // Useful during debugging to confirm the custom config is applied.
  console.log('[Custom Expo Webpack] resolve.alias =', config.resolve.alias);

  return config;
};