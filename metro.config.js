const { getDefaultConfig } = require('expo/metro-config');
const { resolve } = require('metro-resolver');

const config = getDefaultConfig(__dirname);

config.resolver.extraNodeModules = {
  ...config.resolver.extraNodeModules,
  crypto: require.resolve('crypto-browserify'),
};

config.resolver.resolveRequest = (context, moduleName, platform) => {
  if (platform === 'web') {
    if (moduleName === 'react-native') {
      return {
        filePath: require.resolve('react-native-web'),
        type: 'sourceFile',
      };
    }
    if (moduleName === 'react-native-maps') {
      return {
        filePath: require.resolve('@teovilla/react-native-web-maps'),
        type: 'sourceFile',
      };
    }
  }
  return resolve(context, moduleName, platform);
};

module.exports = config;
