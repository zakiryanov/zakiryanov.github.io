// Определяем зависимости в переменных
gulp = require('gulp'),
cache = require('gulp-cache'),
clean = require('gulp-clean'),
stream = require('event-stream'),
size = require('gulp-size'),
jshint = require('gulp-jshint'),
concat = require('gulp-concat'),
uglify = require('gulp-uglify'),
minifyCSS = require('gulp-minify-css'),
rename = require('gulp-rename'),
imagemin = require('gulp-imagemin'),
imageminPngquant = require('imagemin-pngquant'),
imageminZopfli = require('imagemin-zopfli'),
imageminMozjpeg = require('imagemin-mozjpeg'), //need to run 'brew install libpng'
imageminGiflossy = require('imagemin-giflossy'),
purgecss = require('gulp-purgecss');

// Проверка ошибок в скриптах
gulp.task('lint', function() {
    return gulp.src(['js/*.js', '!js/*.min.js', '!js/*jquery*', '!js/*bootstrap*'])
    .pipe(jshint())
    .pipe(jshint.reporter('default'));
});

// files
gulp.task('files', function() {
    return gulp.src(['index.html','Anketa.docx'])
    .pipe(gulp.dest('production/'));
});


// Конкатенация и минификация стилей
// При указании исходников в gulp.src учитывается порядок в котором они указаны,
// то есть первыми в итоговом файле будут стили бустрапа, потому что мы должны
// вначале объявить их, чтобы потому переопределить на свои стили 
// То же самое касается скриптов - мы вначале объявляем зависимости и уже потом 
// подключаем наши скрипты (например первым будет всегда jquery, если он используется
// в проекте, а уже следом все остальные скрипты)
gulp.task('styles', function() {
    return gulp.src(['css/bootstrap.min.css','css/font-awesome.css','css/animate.css','css/slick.css','css/slick-theme.css','css/index.css','css/responsive.css',])
    .pipe(concat('styles.min.css'))
    .pipe(purgecss({
        content: ["index.html"]
    }))
    .pipe(minifyCSS({
    }))
    .pipe(gulp.dest('./css'));
});

// Конкатенация и минификация скриптов
// Тут выделяются два контекста - jquery-плагины / наши скрипты и зависимости (то без чего 
// не будет работать хотя бы один наш скрипт, например jquery)
// Так как это просто пример, то лучшим вариантом было бы разделение на основные и 
// вспомогательные скрипты (например основные - jquery/bootstrap и вспомогательные - lightbox/fotorama) 
gulp.task('scripts', function() {
    var js = gulp.src(['js/jquery.min.js','js/bootstrap.min.js','js/slick.min.js','js/wow.min.js','js/main.js'])
    .pipe(concat('scripts.min.js'))
    .pipe(uglify())
    .pipe(size({
       title: 'size of custom js'
   }))
    .pipe(gulp.dest('./js'));
});


// Сжатие изображений (кэшируем, чтобы сжимать только изменившиеся изображения)
// optimizationLevel - это количество проходов, диапазон параметра 0-7 и начиная с 1 включается компрессия
gulp.task('images', function () {
      return gulp.src(['assets/img/*.{gif,png,jpg}'])
        .pipe(cache(imagemin([
            //png
            imageminPngquant({
                speed: 1,
                quality: 90 //lossy settings
            }),
            imageminZopfli({
                more: true
                // iterations: 50 // very slow but more effective
            }),
            //gif very light lossy, use only one of gifsicle or Giflossy
            imageminGiflossy({
                optimizationLevel: 7,
                optimize: 3, //keep-empty: Preserve empty transparent frames
                lossy: 2
            }),
            //svg
            imagemin.svgo({
                plugins: [{
                    removeViewBox: false
                }]
            }),
            //jpg lossless
            imagemin.jpegtran({
                progressive: true
            }),
            //jpg very light lossy, use vs jpegtran
            // imageminMozjpeg({
            //     quality: 80
            // })
        ])))
    .pipe(gulp.dest('assets/img/'));
});

// Чистим директорию назначения и делаем ребилд, чтобы удаленные из проекта файлы не остались
gulp.task('clean', function() {
  return gulp.src(['production/css', 'production/js', 'production/images'], {read: false})
  .pipe(clean());
});

// Наблюдение за изменениями и автосборка
// После первого запуска (команда gulp в консоли) выполняем gulp watch,
// чтобы следитть за изменениями и автоматически пересобирать исходники с учетом 
// последних изменений
gulp.task('watch', function() {
    gulp.watch('js/*.js', ['lint', 'scripts']);
    gulp.watch('css/*.css', ['styles']);
    gulp.watch('images/*', ['images']);
});

// Выполняем по-умолчанию (вначале очистка и ребилд директории назначения, а потом выполнение остальных задач)
gulp.task('default', ['clean'], function() {
    gulp.start('styles', 'scripts', 'images');
});