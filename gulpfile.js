// Обьявление переменных ---------------------------------------------------
const { src, dest, series, parallel, watch } = require("gulp"),
    browsersync = require("browser-sync").create(),
    fileinclude = require("gulp-file-include"),
    sass = require("gulp-sass")(require("node-sass")),
    notify = require("gulp-notify"),
    sourcemaps = require("gulp-sourcemaps"),
    autoprefixer = require("gulp-autoprefixer"),
    rename = require("gulp-rename"),
    cleanCSS = require("gulp-clean-css"),
    groupmedia = require("gulp-group-css-media-queries"),
    spriteSvg = require("gulp-svg-sprite"),
    svgmin = require("gulp-svgmin"),
    webp = require("gulp-webp"),
    cheerio = require("gulp-cheerio"),
    replace = require("gulp-replace"),
    ttf2woff = require("gulp-ttf2woff"),
    ttf2woff2 = require("gulp-ttf2woff2"),
    fs = require("fs"),
    del = require("del"),
    htmlMinify = require("gulp-htmlmin"),
    webpack = require("webpack"),
    webpackStream = require("webpack-stream"),
    uglify = require("gulp-uglify-es").default,
    tinypng = require("gulp-tinypng-compress");

// Конец обьявление переменных ---------------------------------------------------

//  ---------------------------------ФУНКЦИИ------------------------------------------

//  Функция работающая с HTML (fileinclude  и перенос в dist)
const html = () => {
    return src(["./src/*.html"])
        .pipe(
            fileinclude({
                prefix: "@",
                basepath: "@file",
            })
        )
        .pipe(dest("./dist"))
        .pipe(browsersync.stream());
};

//  Функция минификации HTML
const htmlMin = () => {
    return src(["./dist/*.html"])
        .pipe(
            htmlMinify({
                collapseWhitespace: true,
            })
        )
        .pipe(dest("./dist"));
};

// Функция работающая с CSS
const css = () => {
    return src("./src/scss/style.scss")
        .pipe(sourcemaps.init())
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
        .pipe(sourcemaps.write("."))
        .pipe(dest("./dist/css/"))
        .pipe(browsersync.stream());
};

// Функция работающая с JS
const js = () => {
    return src("./src/js/script.js")
        .pipe(
            webpackStream({
                mode: "development",
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
                                    presets: ["@babel/preset-env"],
                                },
                            },
                        },
                    ],
                },
            })
        )
        .pipe(sourcemaps.init())
        .pipe(uglify().on("error", notify.onError()))
        .pipe(sourcemaps.write("."))
        .pipe(dest("./dist/js"))
        .pipe(browsersync.stream());
};

// Функция работающая со шрифтами (перевод в woff2, можно в woff)
const fonts = () => {
    // src('./src/fonts/**.ttf')
    //     .pipe(
    //         ttf2woff()
    //     )
    //     .pipe(dest('./dist/fonts/'))
    return src("./src/fonts/**.ttf")
        .pipe(ttf2woff2())
        .pipe(dest("./dist/fonts/"))
        .pipe(browsersync.stream());
};

// Функция, которая проверяет жирность шрифта
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
};

const cb = () => {};

let srcFonts = "./src/scss/settings/fonts.scss";
let appFonts = "./dist/fonts/";


// Функция подключающая шрифт в файл fonts.scss
const fontsStyle = (done) => {
    let file_content = fs.readFileSync(srcFonts);

    fs.writeFile(srcFonts, "", cb);
    fs.readdir(appFonts, function (err, items) {
        if (items) {
            let c_fontname;
            for (var i = 0; i < items.length; i++) {
                let fontname = items[i].split(".");
                fontname = fontname[0];
                let font = fontname.split("-")[0];
                let weight = checkWeight(fontname);

                if (c_fontname != fontname) {
                    fs.appendFile(
                        srcFonts,
                        '@include font-face("' +
                            font +
                            '", "' +
                            fontname +
                            '", ' +
                            weight +
                            ");\r\n",
                        cb
                    );
                }
                c_fontname = fontname;
            }
        }
    });

    done();
};

// Функция переносящяя картинки из src в dist
const img = () => {
    return src([
        "./src/img/**/**.{jpg,jpeg,png,gif,avif,webp,svg}",
        "!./src/img/svg/**.svg",
    ])
        .pipe(dest("./dist/img"))
        .pipe(browsersync.stream());
};

// Функция конвертации картинок в Webp
const webpImg = () => {
    return src([
        "./dist/img/**/**.{jpg,jpeg,png}",
        "!./dist/img/svg/**.svg",
    ])
        .pipe(webp())
        .pipe(dest("./dist/img"))
        .pipe(browsersync.stream());
};

// Функция делающая спрайт из svg картинок
const svgSprite = () => {
    return src(["./src/img/svg/**.svg"])
        .pipe(
            svgmin({
                js2svg: {
                    pretty: true,
                },
            })
        )
        .pipe(
            cheerio({
                run: function ($) {
                    $("[fill]").removeAttr("fill");
                    $("[stroke]").removeAttr("stroke");
                },
                parserOptions: {
                    xmlMode: true,
                },
            })
        )
        .pipe(replace("&gt;", ">"))
        .pipe(
            spriteSvg({
                mode: {
                    symbol: {
                        sprite: "../svg/sprite.svg",
                    },
                },
            })
        )
        .pipe(dest("./dist/img/"))
        .pipe(browsersync.stream());
};

// Функция для переноса отдельных файлов в корень папки dist
const resources = () => {
    return src("./src/resources/**")
        .pipe(dest("./dist"))
        .pipe(browsersync.stream());
};

// Функция удаления папки dist
const clean = () => {
    return del(["dist/*"]);
};


// Функция слежения за обновлением файлов
const watchFiles = () => {
    browsersync.init({
        server: {
            baseDir: "./dist",
        },
        port: 3000,
        notify: false,
    });

    watch(["./src/html/**/*.html"], html);
    watch(["./src/*.html"], html);
    watch("./src/scss/**/*.scss", css);
    watch(["./src/img/**/**.{jpg,jpeg,png,gif,avif,webp,svg}"], img);
    watch(["./dist/img/**/**.{jpg,jpeg,png}"], webpImg);
    watch("./src/img/svg/**.svg", svgSprite);
    watch("./src/resources/**", resources);
    watch("./src/fonts/**.ttf", fonts);
    watch("./src/fonts/**.ttf", fontsStyle);
    watch("./src/js/**/*.js", js);
};

exports.html = html;
exports.css = css;
exports.js = js;
exports.fonts = fonts;
exports.fontsStyle = fontsStyle;
exports.img = img;
exports.webpImg = webpImg;
exports.svgSprite = svgSprite;
exports.resources = resources;
exports.watchFiles = watchFiles;
exports.default = series(
    clean,
    parallel(html, js, fonts, img, svgSprite, resources),
    webpImg,
    fontsStyle,
    css,
    watchFiles
);

//  --------------------------------- КОНЕЦ ФУНКЦИЙ------------------------------------------

//  --------------------------------- BUILD ВЕРСИЯ------------------------------------------

// Функция сжатия картинок
const tinyPng = () => {
    return src([
        "./src/img/**/*.jpg",
        "./src/img/**/*.png",
        "./src/img/**/*.jpeg",
    ])
        .pipe(
            tinypng({
                key: "K99Bky6hJVWSyZlKxDfSvYzXxy709yf3",
                log: true,
                parallel: true,
                parallelMax: 100,
            })
        )
        .pipe(dest("./dist/img/"))
        .pipe(browsersync.stream());
};

// Функция работающая с CSS и минифицируящяя её
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

// Функция работающая с JS и минифицируящяя его
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


// Команда gulp build (Сжимает картинки, JS, CSS)
exports.build = series(
    clean,
    parallel(html, jsBuild, fonts, img, svgSprite, resources),
    fontsStyle,
    cssBuild,
    webpImg,
    watchFiles
);

// Команда gulp min (Сжимает картинки, JS, CSS + HTML)
exports.min = series(
    clean,
    parallel(html, jsBuild, fonts, img, svgSprite, resources),
    htmlMin,
    fontsStyle,
    cssBuild,
    webpImg,
    watchFiles
);

//  --------------------------------- КОНЕЦ BUILD ВЕРСИЯ------------------------------------------
