const { withProjectBuildGradle } = require('@expo/config-plugins');

module.exports = function withFixAdsVersion(config) {
  return withProjectBuildGradle(config, (config) => {
    // kotlinVersion tanımlı değilse ekle
    if (!config.modResults.contents.includes('kotlinVersion')) {
      config.modResults.contents = config.modResults.contents.replace(
        'allprojects {',
        `ext {
    kotlinVersion = "2.3.0"
}

allprojects {`
      );
    }
    return config;
  });
};