const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

// Add support for SVG files
config.resolver.assetExts.push('svg');

// Add support for TypeScript path mapping
config.resolver.alias = {
  '@': './src',
};

module.exports = config;
