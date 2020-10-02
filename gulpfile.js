const gulp = require('gulp');
// Utils
const browserSync = require('browser-sync');
const del = require('del');
const fs = require('fs');
const include = require('gulp-file-include');
const rename = require('gulp-rename');
// CSS
const autoprefixer = require('gulp-autoprefixer');
const cleanCss = require('gulp-clean-css');
const groupMedia = require('gulp-group-css-media-queries');
const scss = require('gulp-sass');
const webpCss = require('gulp-webp-css');
// JS
const uglify = require('gulp-uglify');
const babel = require('gulp-babel');
// IMG
const imagemin = require('gulp-imagemin');
const webp = require('gulp-webp');
const svgSprite = require('gulp-svg-sprite');
// HTML
const webpHtml = require('gulp-webp-html');
// Fonts
const ttf2woff = require('gulp-ttf2woff');
const ttf2woff2 = require('gulp-ttf2woff2');

const {src, dest} = gulp;
const projectFolder = 'build';
const sourceFolder = 'src';

const path = {
  build: {
    html: `${projectFolder}/`,
    css: `${projectFolder}/css`,
    js: `${projectFolder}/js`,
    img: `${projectFolder}/img`,
    fonts: `${projectFolder}/fonts`
  },
  src: {
    html: `${sourceFolder}/*.html`,
    css: `${sourceFolder}/scss/style.scss`,
    js: `${sourceFolder}/js/script.js`,
    fonts: `${sourceFolder}/fonts/*.ttf`
  },
  watch: {
    html: `${sourceFolder}/**/*.html`,
    css: `${sourceFolder}/scss/**/*.scss`,
    js: `${sourceFolder}/js/**/*.js`
  },
  clean: `./${projectFolder}/`
};

const sync = () => {
  browserSync.init({
    server: {
      baseDir: `./${projectFolder}/`
    },
    port: 3000,
    notify: false
  });
};

const clean = () => {
  return del(path.clean);
};

const html = () => {
  return src(path.src.html)
    .pipe(include())
    .pipe(webpHtml())
    .pipe(dest(path.build.html))
    .pipe(browserSync.stream());
};

const css = () => {
  return src(path.src.css)
    .pipe(include())
    .pipe(scss({outputStyle: 'expanded'}))
    .pipe(groupMedia())
    .pipe(autoprefixer({
      cascade: true
    }))
    .pipe(webpCss({webpClass: '.webp', noWebpClass: '.no-webp'}))
    .pipe(dest(path.build.css))
    .pipe(cleanCss())
    .pipe(
      rename({
        extname: '.min.css'
      })
    )
    .pipe(dest(path.build.css))
    .pipe(browserSync.stream());
};

const js = () => {
  return src(path.src.js)
    .pipe(include())
    .pipe(babel({presets: ['@babel/env']}))
    .pipe(dest(path.build.js))
    .pipe(uglify())
    .pipe(rename({
      extname: '.min.js'
    }))
    .pipe(dest(path.build.js))
    .pipe(browserSync.stream());
};

const fonts = () => {
  src(path.src.fonts)
    .pipe(ttf2woff())
    .pipe(dest(path.build.fonts));
  return src(path.src.fonts)
    .pipe(ttf2woff2())
    .pipe(dest(path.build.fonts));
};

gulp.task('img', () => {
  return src(path.src.img)
    .pipe(webp(
      {quality: 75}
    ))
    .pipe(dest(path.build.img))
    .pipe(
      imagemin.mozjpeg({quality: 75, progressive: true}),
      imagemin.optipng({optimizationLevel: 4}),
      imagemin.svgo({
        plugins: [
          {removeViewBox: true},
          {cleanupIDs: false}
        ]
      }))
    .pipe(dest(path.build.img));
});

gulp.task('sprite', () => {
  return src(`${sourceFolder}/sprite/**/*.svg`)
    .pipe(svgSprite({
      mode: {
        stack: {
          sprite: '../sprite/sprite.svg'
        }
      }
    }))
    .pipe(dest(path.build.img));
});

const fontsStyle = () => {
  const content = fs.readFileSync(`${sourceFolder}/scss/fonts.scss`);

  if (!content.length) {
    fs.writeFile(`${sourceFolder}/scss/fonts.scss`, '', () => {
    });
    return fs.readdir(path.build.fonts, function (err, items) {
      if (items) {
        let font;
        items.forEach((item) => {
          let fontname = item.split('.')[0];
          if (font !== fontname) {
            fs.appendFile(
              `${sourceFolder}/scss/fonts.scss`,
              `@include font("${fontname}", "${fontname}", "400", "normal");\r\n`,
              () => {
              }
            );
          }
          font = fontname;
        });
      }
    });
  }
};


const watchFiles = () => {
  gulp.watch([path.watch.html], html);
  gulp.watch([path.watch.css], css);
  gulp.watch([path.watch.js], js);
};

const build = gulp.series(clean, gulp.parallel(fonts, html, css, js), fontsStyle);
const watch = gulp.parallel(build, watchFiles, sync);

exports.fontStyle = fontsStyle;
exports.fonts = fonts;
exports.js = js;
exports.css = css;
exports.build = build;
exports.html = html;
exports.watch = watch;
exports.default = watch;
