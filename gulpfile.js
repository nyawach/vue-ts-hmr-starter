'use strict'


// require
const gulp             = require('gulp')
const sass             = require('gulp-sass')
const sassGlob         = require('gulp-sass-glob')
const pleeease         = require('gulp-pleeease')
const pug              = require('gulp-pug')
const readConfig       = require('read-config')
const watch            = require('gulp-watch')
const RevLogger        = require('rev-logger')
const webpack          = require('webpack')
const WebpackDevServer = require('webpack-dev-server')
const imagemin         = require('imagemin')
const del              = require('del')
const pngquant         = require('imagemin-pngquant')
const mozjpeg          = require('imagemin-mozjpeg')
const open             = require('gulp-open')

// config
const config    = require('./config')

const SRC       = `./${config.dev.src}`
const CONFIG    = `./${config.dev.src}/config`
const HTDOCS    = `${config.dev.dist}`
const BASE_PATH = ''
const DEST      = `${HTDOCS}${BASE_PATH}`


// set production mode
const production = process.env.NODE_ENV === 'production'


// init rev logger
const revLogger = new RevLogger({
    'style.css': `${DEST}/css/style.css`,
    'script.js': `${DEST}/js/script.js`
})


// clean
gulp.task('clean', (done) => {
    if(!production) {
        done()
        return
    }
    const paths = [
        `${DEST}/js/**/*`,
        `${DEST}/**/*.html`,
        `${DEST}/css/**/*`,
    ]
    del(paths).then(() => done())
})


// css
gulp.task('sass', () => {
    const config = readConfig(`./pleeease.json`)
    return gulp.src(`${SRC}/scss/style.scss`)
        .pipe(sassGlob())
        .pipe(sass())
        .pipe(pleeease(config))
        .pipe(gulp.dest(`${DEST}/css`))
})

gulp.task('css', gulp.series('sass'))


// js
let webpackConfig = require('./webpack.config')
let bundler = null

gulp.task('js', (done) => {
    bundler = webpack(webpackConfig)
    bundler.run((err, stats) => {
        // setting log
        if (err) {
            console.error(err.stack || err)
            if (err.details) console.error(err.details)
            done()
            return
        }
        const info = stats.toJson()

        if (stats.hasErrors()) console.error(info.errors)

        if (stats.hasWarnings()) console.warn(info.warnings)

        console.log(stats.toString({
            modules: false,
            colors: true,
        }))

        done()
    })
})

gulp.task('hmr', (done) => {
    Object.keys(webpackConfig.entry).forEach(name => {
        webpackConfig.entry[name].unshift(
            `webpack-dev-server/client?http://localhost:${config.dev.port}`,
            'webpack/hot/only-dev-server',
        )
    })
    bundler = webpack(webpackConfig)
    bundler.run(() => done())
})

gulp.task('static', (done) => {
    return gulp.src(`${SRC}/static/**/*`)
        .pipe(gulp.dest(`${DEST}/`))
})


// html
gulp.task('pug', () => {
    const locals = readConfig(`./src/meta.yml`)

    locals.versions = revLogger.versions()
    locals.basePath = BASE_PATH

    const src = [`${SRC}/pug/**/[!_]*.pug`]

    return gulp.src(src)
        .pipe(pug({
            locals: locals,
            pretty: true,
            basedir: `${SRC}/pug`
        }))
        .pipe(gulp.dest(`${DEST}`))
})

gulp.task('html', gulp.series('pug'))


// imgmin
gulp.task('imagemin', () => {
    return gulp.src(`${DEST}/img/**/*.{png,jpg}`)
        .pipe(imagemin([
            pngquant({
                quality: '65-80',
                speed: 1,
                floyd: 0
            }),
            mozjpeg({
                quality: 85,
                progressive: true
            }),
            imagemin.optipng(),
            imagemin.gifsicle()
        ]))
        .pipe(gulp.dest(`${DEST}/img`))
})


// open
gulp.task('open', function () {
    gulp.src('.')
        .pipe(open({ uri: `http://localhost:${config.dev.port}` }))
})


// serve
gulp.task('serve', () => {
    new WebpackDevServer(bundler, {
        publicPath: webpackConfig.output.publicPath,
        contentBase: HTDOCS,
        hot: true,
        noInfo: true,
    }).listen(config.dev.port, config.dev.host, (err) => {
        if (err) return console.log(err)
        console.log(`Listening at http://${config.dev.host}:${config.dev.port}/`)
    })

    watch([`${SRC}/scss/**/*.scss`], gulp.series('sass'))
    watch([`${SRC}/js/**/*.js`], gulp.series('static'))
    watch([`${SRC}/pug/**/*`, `${SRC}/meta.yml`], gulp.series('pug'))
})


// build
gulp.task('build',
    gulp.series(
        'clean',
        gulp.parallel(['css', 'js', 'static', 'html']),
    )
)

// default(for development)
gulp.task('default',
    gulp.series(
        gulp.parallel(['css', 'hmr', 'static', 'html']),
        gulp.parallel(['serve', 'open']),
    )
)
