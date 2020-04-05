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

gulp.task('svgSprite', function () {
  return gulp
    .src(src_assets_folder + 'images/icons/*.svg')
    .pipe(
      svgmin({
        js2svg: {
          pretty: true,
        },
      }),
    )
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
    .pipe(replace('&gt;', '>'))
    .pipe(
      svgSprite({
        mode: {
          symbol: {
            sprite: '../sprite.svg',
          },
        },
      }),
    )
    .pipe(gulp.dest(dist_assets_folder + 'images'));
});

gulp.task('svg-styled', function () {
  return gulp
    .src(src_assets_folder + 'images/icons-styled/*.svg')
    .pipe(imagemin([imagemin.svgo()]))
    .pipe(
      svgSprite({
        mode: {
          symbol: {
            sprite: '../sprite.svg',
          },
        },
      }),
    )
    .pipe(gulp.dest(src_assets_folder + 'images/sprite-styled'));
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

gulp.task('sass-development', () => {
  return gulp
    .src([src_assets_folder + 'sass/**/*.sass', src_assets_folder + 'scss/**/*.scss'], {
      since: gulp.lastRun('sass-development'),
    })
    .pipe(dependents())
    .pipe(sass())
    .pipe(gulp.dest(dist_assets_folder + 'css'))
    .pipe(browserSync.stream());
});

gulp.task('sass-production', () => {
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
      propList,
    }),
  ];

  return (
    gulp
      .src([src_assets_folder + 'sass/**/*.sass', src_assets_folder + 'scss/**/*.scss'])
      .pipe(plumber())
      .pipe(sass())
      .pipe(autoprefixer())
      // .pipe(postcss(processors))
      .pipe(minifyCss())
      .pipe(gulp.dest(dist_assets_folder + 'css'))
  );
});

gulp.task('js-development', () => {
  return gulp
    .src([src_assets_folder + 'js/**/*.js'], { since: gulp.lastRun('js-development') })
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

gulp.task('js-production', () => {
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

gulp.task('images-development', () => {
  return gulp
    .src([src_assets_folder + 'images/**/*.+(png|jpg|jpeg|gif|ico)'], {
      since: gulp.lastRun('images-development'),
    })
    .pipe(plumber())
    .pipe(imagemin([imagemin.mozjpeg(), imagemin.optipng()]))
    .pipe(gulp.dest(dist_assets_folder + 'images'))
    .pipe(browserSync.stream());
});

gulp.task('images-production', () => {
  return gulp
    .src([src_assets_folder + 'images/**/*.+(png|jpg|jpeg|gif|ico)'])
    .pipe(plumber())
    .pipe(
      imagemin([
        imagemin.mozjpeg({ quality: 75, progressive: true }),
        imagemin.optipng({ optimizationLevel: 5 }),
      ]),
    )
    .pipe(gulp.dest(dist_assets_folder + 'images'))
    .pipe(browserSync.stream());
});

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
  'build-development',
  gulp.series(
    'clear',
    'html',
    'sass-development',
    'js-development',
    'images-development',
    'vendor',
    'svgSprite',
  ),
);

gulp.task(
  'build-production',
  gulp.series(
    'clear',
    'html',
    'sass-production',
    'js-production',
    'images-production',
    'vendor',
    'svgSprite',
  ),
);

gulp.task('dev', gulp.series('html', 'sass-development', 'js-development'));

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
    src_assets_folder + 'scss/**/*.scss',
    src_assets_folder + 'js/**/*.js',
  ];

  gulp.watch(watch, gulp.series('dev')).on('change', browserSync.reload);
});

gulp.task('default', gulp.series('build-development', gulp.parallel('serve', 'watch')));
