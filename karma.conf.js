// Karma configuration
var path = require('path');

const webpackConfig = {
  mode: 'development',
  module: {
    rules: [
      {
        test: /\.js$/,
        loader: require.resolve('istanbul-instrumenter-loader'),
        enforce: 'post',
        include: path.resolve('./'),
        exclude: /node_modules|assets|\.(spec|test|style)\.js$/,
        options: {
          esModules: true,
        },
      },
      {
        test: /\.js$|\.ts$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            plugins: [
              require.resolve('@babel/plugin-syntax-dynamic-import'),
              require.resolve('@babel/plugin-syntax-import-meta'),
              // webpack does not support import.meta.url yet, so we rewrite them in babel
              [require.resolve('babel-plugin-bundled-import-meta'), { importStyle: 'baseURI' }],
            ].filter(_ => !!_),
          },
        },
      },
    ]
  },
};

module.exports = function(config) {
  config.set({
    // base path that will be used to resolve all patterns (eg. files, exclude)
    basePath: '',

    // frameworks to use
    // available frameworks: https://npmjs.org/browse/keyword/karma-adapter
    
    frameworks: ['mocha', 'source-map-support'],

    // list of files / patterns to load in the browser
    files: [
        { 
          pattern: require.resolve('@babel/polyfill/dist/polyfill.min.js'),
          watched: false
        },
        {
          pattern: require.resolve('@webcomponents/webcomponentsjs/custom-elements-es5-adapter'),
          watched: false,
        },
        {
          pattern: require.resolve('@webcomponents/webcomponentsjs/webcomponents-bundle'),
          watched: false,
        },
        'packages/*/test/*.test.js',
    ],

    // list of files / patterns to exclude
    exclude: [],

    // preprocess matching files before serving them to the browser
    // available preprocessors: https://npmjs.org/browse/keyword/karma-preprocessor
    preprocessors: {
      '**/*.test.js': ['webpack', 'sourcemap']
    },

    webpack: webpackConfig,

    // test results reporter to use
    // possible values: 'dots', 'progress'
    // available reporters: https://npmjs.org/browse/keyword/karma-reporter
    reporters: ['mocha', 'coverage-istanbul'],

    mochaReporter: {
      showDiff: true,
    },

    client: {
      mocha: {
        timeout: 2000,
      },
    },

    // ## code coverage config
    coverageIstanbulReporter: {
      reports: ['html', 'lcovonly', 'text-summary'],
      dir: 'coverage',
      combineBrowserReports: true,
      skipFilesWithNoCoverage: false,
      thresholds: {
        global: {
          branches: 70,
          statements: 70,
          functions: 70,
          lines: 70,
        },
      },
    },

    // web server port
    port: 9876,

    // enable / disable colors in the output (reporters and logs)
    colors: true,

    // level of logging
    // possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
    logLevel: config.LOG_INFO,

    // enable / disable watching file and executing tests whenever any file changes
    autoWatch: false,

    // start these browsers
    // available browser launchers: https://npmjs.org/browse/keyword/karma-launcher
    browsers: ['ChromeHeadlessNoSandbox'],

    customLaunchers: {
      ChromeHeadlessNoSandbox: {
        base: 'ChromeHeadless',
        flags: ['--no-sandbox', '--disable-setuid-sandbox'],
      },
    },

    // Continuous Integration mode
    // if true, Karma captures browsers, runs the tests and exits
    singleRun: true,

    // Concurrency level
    // how many browser should be started simultaneous
    concurrency: Infinity
  })
}
