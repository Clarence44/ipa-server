const { override, addLessLoader, overrideDevServer } = require('customize-cra');
const ModuleScopePlugin = require('react-dev-utils/ModuleScopePlugin');

const proxy_config = {
  target: 'http://10.0.0.80:8080',
  changeOrigin: true,
  pathRewrite: {
    '^/api': '/api',
  },
};

// 跨域配置
const devServerConfig = () => (config) => {
  return {
    ...config,
    // 服务开启gzip
    compress: true,
    proxy: {
      '/api': proxy_config,
      '/**/**/*.(png|jpg|plist|ipa|apk)': proxy_config,
    },
  };
};

module.exports = {
  webpack: override(
    addLessLoader({
      javascriptEnabled: true,
      modifyVars: { '@primary-color': '#1DA57A' },
    }),
    // 解除限制/src内引用
    function override(config, env) {
      config.resolve.plugins = config.resolve.plugins.filter(
        (plugin) => !(plugin instanceof ModuleScopePlugin)
      );

      if (process.env.NODE_ENV !== 'development') {
        // 修改path目录
        const path = require('path');
        const paths = require('react-scripts/config/paths');
        paths.appBuild = path.join(path.dirname(paths.appBuild), 'dist');
        config.output.path = path.join(
          path.dirname(config.output.path),
          'dist'
        );
      }

      return config;
    }
  ),
  devServer: overrideDevServer(devServerConfig()),
};
