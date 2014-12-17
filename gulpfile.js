var gulp = require('gulp'),
    clean = require('gulp-clean'),
    watchify = require('watchify'),
    browserify = require('browserify'),
    reactify = require('reactify'),
    less = require('gulp-less'),
    source = require('vinyl-source-stream');

var paths = {
    js: {
        src: './todomvc/js/app.js',
        dest: './dist/',
        destFile: 'bundle.js'
    },
    css: {
        src: './*.less',
        dest: './dist/'
    }
};

gulp.task('browserify', function () {
    return browserify(paths.js.src)
        .bundle()
        .pipe(source(paths.js.destFile))
        .pipe(gulp.dest(paths.js.dest))
});

gulp.task('watchify', ['browserify'], function () {
    var bundler = browserify(paths.js.src, {cache: {}, packageCache: {}, fullPaths: true, debug: true});
    bundler = watchify(bundler);
    bundler.on('update', rebundle);

    function rebundle() {
        return bundler.bundle()
            .pipe(source(paths.js.destFile))
            .pipe(gulp.dest(paths.js.dest));
    }

    return rebundle();
});

gulp.task('less', function () {
    return gulp.src(paths.css.src)
        .pipe(less())
        .pipe(gulp.dest(paths.css.dest))
});

gulp.task('watch-less', ['less'], function() {
    gulp.watch(paths.css.src, ['less']);
});

gulp.task('default', ['watchify', 'watch-less']);