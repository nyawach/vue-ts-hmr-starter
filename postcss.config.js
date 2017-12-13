const config = require('./config')

module.exports = [
  require('autoprefixer')({
    browsers: [
      "ie >= 10",
      "ie_mob >= 10",
      "ff >= 30",
      "chrome >= 40",
      "safari >= 8",
      "opera >= 23",
      "ios >= 8",
      "android >= 4.3",
      "bb >= 10"
    ]
  }),
  require('css-mqpacker')(),
  require('postcss-assets')({
    basePath: `./${config.dev.dist}/`,
    loadPaths: [ `img/` ],
  }),
]
