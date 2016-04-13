var gulp = require('gulp');
//var uglify = require('gulp-uglify');
var rename = require('gulp-rename');

var sass = require('gulp-sass');
var autoprefixer = require('gulp-autoprefixer');
var cssmin = require('gulp-csso');
var htmlmin = require('gulp-htmlmin');
var imgmin = require('gulp-imagemin');
var jsmin = require('gulp-uglify');
var concat = require('gulp-useref');

/**
 Convert SASS files into CSS files (gulp-sass)
 Auto-prefix CSS styles (gulp-autoprefixer)
 Minify CSS files (gulp-csso)
 Minify HTML files (gulp-htmlmin)
 Minify image files (gulp-imagemin)
 Minify JS files (gulp-uglify)
 Concatenated CSS and JS files. (gulp-useref)
 **/

//convert sass to css
gulp.task('sasstocss',function(){
    return gulp.src('./src/sass/**/*.scss')
        .pipe(changed('./dist'))
        .pipe(sass().on('error', sass.logError))
        .pipe(gulp.dest('./dist'))
});
gulp.task('sasstocss:watch', function(){
    gulp.watch('./sass/**/*.scss', ['sasstocss'])
});

//auto-prefix css styles
gulp.task('autoprefixer', function(){
    return gulp.src('./src/app.css')
        .pipe(changed('dist'))
        .pipe(autoprefixer({
            browsers: ['last 2 versions'],
            cascade: false
        }))
        .pipe(gulp.dest('./dist'));
});

//minify css
gulp.task('mincss',function(){
    return gulp.src('./src/css/main.css')
        .pipe(changed('./dist'))
        .pipe(csso())
        .pipe(gulp.dest('./out'));
});

//minify html
gulp.task('minhtml',function(){
    return gulp.src('./src/*.html')
        .pipe(changed('./dist'))
        .pipe(htmlmin({collapseWhitespace: true}))
        .pipe(gulp.dest('dist'))
});

//minify image
gulp.task('minimage',function(){
    return gulp.src('./src/images/*')
        .pipe(changed('./dist'))
        .pipe(imagemin({
            progressive:true,
            svgoPlugins:[{removeViewBox:false}],
            use:[pngquant()]
        }))
        .pipe(gulp.dest('./dist/images'));
});

//minify js
gulp.task('minjs',function(){
    return gulp.src('./src/js/*.js')
        .pipe(changed('./dist'))
        .pipe(uglify())
        .pipe(gulp.dest('./dist'));
});

//unminify
gulp.task('unmini',['compress'],function(){
    return gulp.src('./src/*.html')
        .pipe(changed('./dist'))
        .pipe(useref())
        .pipe(gulp.dest('./dist'));
});

gulp.task('default',['sasstocss','autoprefixer','mincss','minhtml','minimage','minjs','unmini']);

