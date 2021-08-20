module.exports = {
  presets: [
    // https://github.com/vuejs/vue-cli/tree/master/packages/@vue/babel-preset-app
    '@vue/cli-plugin-babel/preset',
    '@vue/babel-preset-jsx',
    'babel-plugin-syntax-jsx',
    'env'
  ],
  'env': {
    'development': {
      // babel-plugin-dynamic-import-node plugin only does one thing by converting all import() to require().
      // This plugin can significantly increase the speed of hot updates, when you have a large number of pages.
      'plugins': [
        'dynamic-import-node',
        '@babel/plugin-syntax-jsx',
        'transform-vue-jsx'
      ]
    }
  }
}
