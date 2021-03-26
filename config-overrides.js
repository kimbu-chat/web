const path = require('path');

module.exports = function override(config, env) {
  config.module.rules.push({
    test: /\.(gif|jpg|png|mp3|aac|ogg)$/,
    loader: 'file-loader',
  });

  config.resolve = {
    ...config.resolve,
    extensions: ['.ts', '.tsx', '.js', '.jsx'],
    alias: {
      ...config.alias,
      '@store': path.resolve(__dirname, 'src/store'),
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
  };

  return config;
};
