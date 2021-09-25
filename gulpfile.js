// Обьявление переменных ---------------------------------------------------
const {src,dest,series,parallel,watch} = require('gulp'),
    browsersync = require("browser-sync").create(),
    fileinclude = require("gulp-file-include"),
    sass = require('gulp-sass'),
    notify = require('gulp-notify'),
    sourcemaps = require('gulp-sourcemaps'),
    autoprefixer = require('gulp-autoprefixer'),
    rename = require('gulp-rename'),
    cleanCSS = require('gulp-clean-css'),
    groupmedia = require('gulp-group-css-media-queries'),
    spriteSvg = require("gulp-svg-sprite"),
    svgmin = require('gulp-svgmin'),
    cheerio = require('gulp-cheerio'),
    replace = require('gulp-replace'),
    ttf2woff = require('gulp-ttf2woff'),
    ttf2woff2 = require('gulp-ttf2woff2'),
    fs = require('fs'),
    del = require('del'),
    htmlMinify = require('gulp-htmlmin'),
    webpack = require('webpack'),
    webpackStream = require('webpack-stream'),
    uglify = require('gulp-uglify-es').default,
    tinypng = require('gulp-tinypng-compress');


// Конец обьявление переменных ---------------------------------------------------

//  ---------------------------------ФУНКЦИИ------------------------------------------
const html = () => {
    return src(['./src/*.html'])
        .pipe(
            fileinclude({
                prefix: '@',
                basepath: '@file'
            })
        )
        .pipe(dest('./dist'))
        .pipe(browsersync.stream());
};
const htmlMin = () => {
    return src(['./dist/*.html'])
		.pipe(htmlMinify({
		    collapseWhitespace: true
		}))
        .pipe(dest('./dist'))
};
const css = () => {
    return src('./src/scss/style.scss')
        .pipe(sourcemaps.init())
        .pipe(
            sass({
                outputStyle: 'expanded'
            }).on('error', notify.onError()))
        .pipe(
            groupmedia()
        )
        .pipe(
            autoprefixer({
                overrideBrowserslist: ["> 1%"],
                cascade: false
            })
        )
        .pipe(dest('./dist/css/'))
        .pipe(
            rename({
                suffix: '.min'
            })
        )
        .pipe(
            cleanCSS({
                level: 2
            })
        )
        .pipe(
            sourcemaps.write('.')
        )
        .pipe(dest('./dist/css/'))
        .pipe(browsersync.stream());
};
const js = () => {
    return src('./src/js/script.js')
        .pipe(webpackStream({
            mode: 'development',
            output: {
                filename: 'script.js',
            },
            module: {
                rules: [{
                    test: /\.m?js$/,
                    exclude: /(node_modules|bower_components)/,
                    use: {
                        loader: 'babel-loader',
                        options: {
                            presets: ['@babel/preset-env']
                        }
                    }
                }]
            }
        }))
        .pipe(sourcemaps.init())
        .pipe(uglify().on("error", notify.onError()))
        .pipe(sourcemaps.write('.'))
        .pipe(dest('./dist/js'))
        .pipe(browsersync.stream());
};
const fonts = () => {
    // src('./src/fonts/**.ttf')
    //     .pipe(
    //         ttf2woff()
    //     )
    //     .pipe(dest('./dist/fonts/'))
    return src('./src/fonts/**.ttf')
        .pipe(
            ttf2woff2()
        )
        .pipe(dest('./dist/fonts/'))
        .pipe(browsersync.stream());
};
const checkWeight = (fontname) => {
    let weight = 400;
    switch (true) {
        case /Thin/.test(fontname):
            weight = 100;
            break;
        case /ExtraLight/.test(fontname):
            weight = 200;
            break;
        case /Light/.test(fontname):
            weight = 300;
            break;
        case /Regular/.test(fontname):
            weight = 400;
            break;
        case /Medium/.test(fontname):
            weight = 500;
            break;
        case /SemiBold/.test(fontname):
            weight = 600;
            break;
        case /Semi/.test(fontname):
            weight = 600;
            break;
        case /Bold/.test(fontname):
            weight = 700;
            break;
        case /ExtraBold/.test(fontname):
            weight = 800;
            break;
        case /Heavy/.test(fontname):
            weight = 700;
            break;
        case /Black/.test(fontname):
            weight = 900;
            break;
        default:
            weight = 400;
    }
    return weight;
}

const cb = () => {}

let srcFonts = './src/scss/fonts.scss';
let appFonts = './dist/fonts/';

const fontsStyle = (done) => {
    let file_content = fs.readFileSync(srcFonts);

    fs.writeFile(srcFonts, '', cb);
    fs.readdir(appFonts, function (err, items) {
        if (items) {
            let c_fontname;
            for (var i = 0; i < items.length; i++) {
                let fontname = items[i].split('.');
                fontname = fontname[0];
                let font = fontname.split('-')[0];
                let weight = checkWeight(fontname);

                if (c_fontname != fontname) {
                    fs.appendFile(srcFonts, '@include font-face("' + font + '", "' + fontname + '", ' + weight + ');\r\n', cb);
                }
                c_fontname = fontname;
            }
        }
    })

    done();
}

const img = () => {
    return src(['./src/img/**/**.{jpg,jpeg,png,gif,webp,svg}', '!./src/img/svg/**.svg'])
        .pipe(dest('./dist/img'))
        .pipe(browsersync.stream());
};
const svgSprite = () => {
    return src(['./src/img/svg/**.svg'])
        .pipe(svgmin({
                js2svg: {
                    pretty: true
                }
            }))
            .pipe(cheerio({
                run: function ($) {
                    $('[stroke]').removeAttr('stroke');
                    $('[fill]').removeAttr('fill');
                },
                parserOptions: {
                    xmlMode: true
                }
            }))
            .pipe(replace('&gt;', '>'))
            .pipe(spriteSvg({
                mode: {
                    symbol: {
                        sprite: "../svg/sprite.svg"
                    },
                },
            }))
            .pipe(dest('./dist/img/'))
            .pipe(browsersync.stream());
};
const resources = () => {
    return src('./src/resources/**')
        .pipe(dest('./dist'))
        .pipe(browsersync.stream());
}
const clean = () => {
    return del(['dist/*'])
};
const watchFiles = () => {
    browsersync.init({
        server: {
            baseDir: "./dist"
        },
        port: 3000,
        notify: false
    });

    watch(['./src/html/**/*.html'], html);
    watch(['./src/*.html'], html);
    watch('./src/scss/**/*.scss', css);
    watch(['./src/img/**/**.{jpg,jpeg,png,gif,webp,svg}'], img);
    watch('./src/img/svg/**.svg', svgSprite);
    watch('./src/resources/**', resources);
    watch('./src/fonts/**.ttf', fonts);
    watch('./src/fonts/**.ttf', fontsStyle);
    watch('./src/js/**/*.js', js);
};

exports.html = html;
exports.css = css;
exports.js = js;
exports.fonts = fonts;
exports.fontsStyle = fontsStyle;
exports.img = img;
exports.svgSprite = svgSprite;
exports.resources = resources;
exports.watchFiles = watchFiles;
exports.default = series(clean, parallel(html, js, fonts, img, svgSprite, resources), fontsStyle, css, watchFiles);

//  --------------------------------- КОНЕЦ ФУНКЦИЙ------------------------------------------


//  --------------------------------- BUILD ВЕРСИЯ------------------------------------------
const tinyPng = () => {
    return src(['./src/img/**/*.jpg', './src/img/**/*.png', './src/img/**/*.jpeg'])
        .pipe(tinypng({
            key: 'qG9yKQNgMJ1Cbtl53GxCzxjbGt6CfH4S',
            log: true,
            parallel: true,
            parallelMax: 100,
        }))
        .pipe(dest('./dist/img/'))
        .pipe(browsersync.stream());
};

const cssBuild = () => {
    return src("./src/scss/style.scss")
        .pipe(
            sass({
                outputStyle: "expanded",
            }).on("error", notify.onError())
        )
        .pipe(groupmedia())
        .pipe(
            autoprefixer({
                overrideBrowserslist: [">1%", "not ie 11"],
                cascade: false,
            })
        )
        .pipe(dest("./dist/css/"))
        .pipe(
            rename({
                suffix: ".min",
            })
        )
        .pipe(
            cleanCSS({
                level: 2,
            })
        )
        .pipe(dest("./dist/css/"))
        .pipe(browsersync.stream());
};
const jsBuild = () => {
    return src("./src/js/script.js")
        .pipe(
            webpackStream({
                mode: "production",
                output: {
                    filename: "script.js",
                },
                module: {
                    rules: [
                        {
                            test: /\.m?js$/,
                            exclude: /(node_modules|bower_components)/,
                            use: {
                                loader: "babel-loader",
                                options: {
                                    presets: [
                                        [
                                            "@babel/preset-env",
                                            {
                                                targets: [">1%", "not ie 11"],
                                            },
                                        ],
                                    ],
                                },
                            },
                        },
                    ],
                },
            })
        )
        .pipe(uglify().on("error", notify.onError()))
        .pipe(dest("./dist/js"))
        .pipe(browsersync.stream());
};

exports.build = series(clean, parallel(html, jsBuild, fonts, img, svgSprite, resources), fontsStyle, cssBuild, watchFiles);
exports.min = series(clean, parallel(html, jsBuild, fonts, img, svgSprite, resources), htmlMin, fontsStyle, cssBuild, watchFiles);

//  --------------------------------- КОНЕЦ BUILD ВЕРСИЯ------------------------------------------