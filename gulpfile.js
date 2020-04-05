/**
 * A simple Gulp 4 Starter Kit for modern web development.
 *
 * @package @jr-cologne/create-gulp-starter-kit
 * @author JR Cologne <kontakt@jr-cologne.de>
 * @copyright 2020 JR Cologne
 * @license https://github.com/jr-cologne/gulp-starter-kit/blob/master/LICENSE MIT
 * @version v0.10.12-beta
 * @link https://github.com/jr-cologne/gulp-starter-kit GitHub Repository
 * @link https://www.npmjs.com/package/@jr-cologne/create-gulp-starter-kit npm package site
 *
 * ________________________________________________________________________________
 *
 * gulpfile.js
 *
 * The gulp configuration file.
 *
 */

const gulp = require('gulp'),
  del = require('del'),
  sourcemaps = require('gulp-sourcemaps'),
  plumber = require('gulp-plumber'),
  sass = require('gulp-sass'),
  postcss = require('gulp-postcss'),
  pxtorem = require('postcss-pxtorem'),
  less = require('gulp-less'),
  stylus = require('gulp-stylus'),
  autoprefixer = require('gulp-autoprefixer'),
  minifyCss = require('gulp-clean-css'),
  babel = require('gulp-babel'),
  webpack = require('webpack-stream'),
  uglify = require('gulp-uglify'),
  concat = require('gulp-concat'),
  imagemin = require('gulp-imagemin'),
  browserSync = require('browser-sync').create(),
  pug = require('gulp-pug'),
  dependents = require('gulp-dependents'),
  svgSprite = require('gulp-svg-sprite'),
  svgmin = require('gulp-svgmin'),
  cheerio = require('gulp-cheerio'),
  replace = require('gulp-replace'),
  src_folder = './src/',
  src_assets_folder = src_folder + 'assets/',
  dist_folder = './dist/',
  dist_assets_folder = dist_folder + 'assets/',
  node_modules_folder = './node_modules/',
  dist_node_modules_folder = dist_folder + 'node_modules/',
  node_dependencies = Object.keys(require('./package.json').dependencies || {});

gulp.task('svgClean', function () {
  return gulp
    .src([src_assets_folder + 'images/icons/*.svg'])
    .pipe(plumber())
    .pipe(
      cheerio({
        run: function ($) {
          $('[fill]').removeAttr('fill');
          $('[stroke]').removeAttr('stroke');
          $('[style]').removeAttr('style');
        },
        parserOptions: { xmlMode: true },
      }),
    )
    .pipe(replace('&gt;', '>'))
    .pipe(
      imagemin([
        imagemin.svgo({
          js2svg: {
            pretty: true,
          },
        }),
      ]),
    )
    .pipe(gulp.dest(src_assets_folder + 'images/svg-clean'));
});

gulp.task('svgStyled', function () {
  return (
    gulp
      .src(src_assets_folder + 'images/svg-styled/*.svg')
      .pipe(
        svgmin({
          js2svg: {
            pretty: true,
          },
        }),
      )
      .pipe(
        imagemin([
          imagemin.svgo({
            js2svg: {
              pretty: true,
            },
          }),
        ]),
      )
  
      // .pipe(
      //   svgSprite({
      //     mode: {
      //       symbol: {
      //         sprite: '../sprite-styled.svg',
      //         render: {
      //           // scss: {
      //           // 	dest:'../../../sass/_sprite.scss',
      //           // 	template: src_assets_folder + "sass/templates/_sprite_template.scss"
      //           // }
      //         },
      //       },
      //     },
      //   }),
      // )
      .pipe(gulp.dest(dist_assets_folder + 'images'))
  );
});

gulp.task('svgSprite', function () {
  return (
    gulp
      .src(src_assets_folder + 'images/icons-to-sprite/*.svg')
      // minify svg
      .pipe(
        svgmin({
          js2svg: {
            pretty: true,
          },
        }),
      )
      // remove all fill, style and stroke declarations in out shapes
      .pipe(
        cheerio({
          run: function ($) {
            $('[fill]').removeAttr('fill');
            $('[stroke]').removeAttr('stroke');
            $('[style]').removeAttr('style');
            $('[opacity=-1]').removeAttr('opacity');
          },
          parserOptions: { xmlMode: true },
        }),
      )
      // cheerio plugin create unnecessary string '&gt;', so replace it.
      .pipe(replace('&gt;', '>'))
      // build svg sprite
      .pipe(
        svgSprite({
          mode: {
            symbol: {
              sprite: '../sprite.svg',
              render: {
                // scss: {
                // 	dest:'../../../sass/_sprite.scss',
                // 	template: src_assets_folder + "sass/templates/_sprite_template.scss"
                // }
              },
            },
          },
        }),
      )
      .pipe(gulp.dest(dist_assets_folder + 'images'))
  );
});

gulp.task('clear', () => del([dist_folder]));

gulp.task('html', () => {
  return gulp
    .src([src_folder + '**/*.html'], {
      base: src_folder,
      since: gulp.lastRun('html'),
    })
    .pipe(gulp.dest(dist_folder))
    .pipe(browserSync.stream());
});

gulp.task('pug', () => {
  return gulp
    .src([src_folder + 'pug/**/!(_)*.pug'], {
      base: src_folder + 'pug',
      since: gulp.lastRun('pug'),
    })
    .pipe(plumber())
    .pipe(pug())
    .pipe(gulp.dest(dist_folder))
    .pipe(browserSync.stream());
});

gulp.task('sass', () => {
  return gulp
    .src([src_assets_folder + 'sass/**/*.sass', src_assets_folder + 'scss/**/*.scss'], {
      since: gulp.lastRun('sass'),
    })
    .pipe(dependents())
    .pipe(sass())
    .pipe(gulp.dest(dist_assets_folder + 'css'))
    .pipe(browserSync.stream());
});

gulp.task('sassBuild', () => {
  var propList = [
    'font',
    'font-size',
    'line-height',
    'letter-spacing',
    'margin',
    'margin-top',
    'margin-right',
    'margin-bottom',
    'margin-left',
    'padding',
    'padding-top',
    'padding-right',
    'padding-bottom',
    'padding-left',
  ];

  var processors = [
    pxtorem({
      // replace: false,
      propList,
    }),
  ];

  return gulp
    .src([src_assets_folder + 'sass/**/*.sass', src_assets_folder + 'scss/**/*.scss'])
    .pipe(plumber())
    .pipe(sass())
    .pipe(autoprefixer())
    .pipe(postcss(processors))
    .pipe(minifyCss())
    .pipe(gulp.dest(dist_assets_folder + 'css'));
});

gulp.task('less', () => {
  return gulp
    .src([src_assets_folder + 'less/**/!(_)*.less'], { since: gulp.lastRun('less') })
    .pipe(sourcemaps.init())
    .pipe(plumber())
    .pipe(less())
    .pipe(autoprefixer())
    .pipe(minifyCss())
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest(dist_assets_folder + 'css'))
    .pipe(browserSync.stream());
});

gulp.task('stylus', () => {
  return gulp
    .src([src_assets_folder + 'stylus/**/!(_)*.styl'], { since: gulp.lastRun('stylus') })
    .pipe(sourcemaps.init())
    .pipe(plumber())
    .pipe(stylus())
    .pipe(autoprefixer())
    .pipe(minifyCss())
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest(dist_assets_folder + 'css'))
    .pipe(browserSync.stream());
});

gulp.task('js', () => {
  return gulp
    .src([src_assets_folder + 'js/**/*.js'], { since: gulp.lastRun('js') })
    .pipe(
      webpack({
        mode: 'development',
      }),
    )
    .pipe(
      babel({
        presets: ['@babel/env'],
      }),
    )
    .pipe(concat('all.js'))
    .pipe(gulp.dest(dist_assets_folder + 'js'))
    .pipe(browserSync.stream());
});

gulp.task('jsBuild', () => {
  return gulp
    .src([src_assets_folder + 'js/**/*.js'])
    .pipe(plumber())
    .pipe(
      webpack({
        mode: 'production',
      }),
    )
    .pipe(
      babel({
        presets: ['@babel/env'],
      }),
    )
    .pipe(concat('all.js'))
    .pipe(uglify())
    .pipe(gulp.dest(dist_assets_folder + 'js'));
});

gulp.task('svg', () => {
  return gulp
    .src(
      [
        src_assets_folder + 'images/icons/**/*.svg',
      ],
      {
        since: gulp.lastRun('images'),
      },
    )
    .pipe(plumber())
    .pipe(imagemin([imagemin.mozjpeg(), imagemin.optipng()]))
    .pipe(gulp.dest(dist_assets_folder + 'images/icons'))
    .pipe(browserSync.stream());
});

gulp.task('photo', () => {
  return gulp
    .src([src_assets_folder + 'images/**/*.+(png|jpg|jpeg|gif|ico)'], {
      since: gulp.lastRun('images'),
    })
    .pipe(plumber())
    .pipe(imagemin([imagemin.mozjpeg(), imagemin.optipng()]))
    .pipe(gulp.dest(dist_assets_folder + 'images'))
    .pipe(browserSync.stream());
});

gulp.task('images', gulp.series('photo', 'svg'));

gulp.task('vendor', () => {
  if (node_dependencies.length === 0) {
    return new Promise((resolve) => {
      console.log('No dependencies specified');
      resolve();
    });
  }

  return gulp
    .src(
      node_dependencies.map((dependency) => node_modules_folder + dependency + '/**/*.*'),
      {
        base: node_modules_folder,
        since: gulp.lastRun('vendor'),
      },
    )
    .pipe(gulp.dest(dist_node_modules_folder))
    .pipe(browserSync.stream());
});

gulp.task(
  'build',
  gulp.series(
    'clear',
    'html',
    'sass',
    'svgSprite',
    'js',
    'images',
    'vendor',
    // 'pug',
  ),
);

gulp.task(
  'buildProd',
  gulp.series(
    'clear',
    'html',
    'sassBuild',
    'jsBuild',
    'images',
    'vendor',
    // 'pug',
  ),
);

gulp.task('dev', gulp.series('html', 'sass', 'js'));

gulp.task('serve', () => {
  return browserSync.init({
    server: {
      baseDir: ['dist'],
    },
    port: 3000,
    open: false,
  });
});

gulp.task('watch', () => {
  const watchImages = [src_assets_folder + 'images/**/*.+(png|jpg|jpeg|gif|ico)'];

  const watchVendor = [];

  node_dependencies.forEach((dependency) => {
    watchVendor.push(node_modules_folder + dependency + '/**/*.*');
  });

  const watch = [
    src_folder + '**/*.html',
    // src_folder + 'pug/**/*.pug',
    // src_assets_folder + 'sass/**/*.sass',
    src_assets_folder + 'scss/**/*.scss',
    // src_assets_folder + 'less/**/*.less',
    // src_assets_folder + 'stylus/**/*.styl',
    src_assets_folder + 'js/**/*.js',
  ];

  gulp.watch(watch, gulp.series('dev')).on('change', browserSync.reload);
  // gulp.watch(watchImages, gulp.series('images')).on('change', browserSync.reload);
  // gulp.watch(watchVendor, gulp.series('vendor')).on('change', browserSync.reload);
});

gulp.task('default', gulp.series('build', gulp.parallel('serve', 'watch')));
