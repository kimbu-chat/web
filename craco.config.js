const path = require('path');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

module.exports = function ({ env }) {
  const isProductionBuild = process.env.NODE_ENV === 'production';
  const analyzerMode = process.env.REACT_APP_INTERACTIVE_ANALYZE ? 'server' : 'json';

  const plugins = [];

  if (isProductionBuild) {
    plugins.push(new BundleAnalyzerPlugin({ analyzerMode }));
  }

  return {
    babel: {
      loaderOptions: (babelLoaderOptions) => {
        const origBabelPresetCRAIndex = babelLoaderOptions.presets.findIndex((preset) => {
          return preset[0].includes('babel-preset-react-app');
        });

        const origBabelPresetCRA = babelLoaderOptions.presets[origBabelPresetCRAIndex];

        babelLoaderOptions.presets[origBabelPresetCRAIndex] = function overridenPresetCRA(
          api,
          opts,
          env,
        ) {
          const babelPresetCRAResult = require(origBabelPresetCRA[0])(
            api,
            origBabelPresetCRA[1],
            env,
          );

          babelPresetCRAResult.presets.forEach((preset) => {
            // detect @babel/preset-react with {development: true, runtime: 'automatic'}
            const isReactPreset =
              preset &&
              preset.length > 1 &&
              preset[1].runtime === 'automatic' &&
              preset[1].development === true;
            if (isReactPreset) {
              preset[1].importSource = '@welldone-software/why-did-you-render';
            }
          });

          return babelPresetCRAResult;
        };

        return babelLoaderOptions;
      },
    },
    webpack: {
      plugins,
      extensions: ['.ts', '.tsx', '.js', '.jsx'],
      alias: {
        '@store': path.resolve(__dirname, 'src/store'),
        '@localization': path.resolve(__dirname, 'src/localization'),
        '@utils': path.resolve(__dirname, 'src/utils'),
        '@common': path.resolve(__dirname, 'src/common'),
        '@services': path.resolve(__dirname, 'src/services'),
        '@components': path.resolve(__dirname, 'src/components'),
        '@routing': path.resolve(__dirname, 'src/routing'),
        '@contexts': path.resolve(__dirname, 'src/contexts'),
        '@hooks': path.resolve(__dirname, 'src/hooks'),
        '@sounds': path.resolve(__dirname, 'src/assets/sounds'),
        '@icons': path.resolve(__dirname, 'src/assets/icons'),
        '@containers': path.resolve(__dirname, 'src/containers'),
      },
    },
  };
};
