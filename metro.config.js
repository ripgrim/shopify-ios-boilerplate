const { getDefaultConfig } = require('expo/metro-config');
const { withNativeWind } = require('nativewind/metro');

const config = getDefaultConfig(__dirname);

// Ensure proper resolver configuration for React Native modules
config.resolver.sourceExts = [
  ...config.resolver.sourceExts,
  'mjs',
  'cjs'
];

config.resolver.assetExts = [
  ...config.resolver.assetExts,
  'scss',
  'sass'
];

// Add platforms to support web and native
config.resolver.platforms = ['native', 'ios', 'android', 'web'];

// Configure alias to use react-native-web for web/server contexts
config.resolver.alias = {
  ...config.resolver.alias,
  'react-native': 'react-native-web',
};

const configWithNativeWind = withNativeWind(config, { input: './global.css' });

module.exports = configWithNativeWind;