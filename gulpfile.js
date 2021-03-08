const gulp = require('gulp')
const gulpSass = require('gulp-sass')
const gulpCleanCss = require('gulp-clean-css')
const gulpHtmlMin = require('gulp-htmlmin')
const gulpUglify = require('gulp-uglify')
const gulpBabel = require('gulp-babel')
const gulpImagemin = require('gulp-imagemin')
const gulpFileInclude = require('gulp-file-include')
const gulpConnect = require('gulp-connect')
const gulpClean = require('gulp-clean')

gulp.task('connect',() => {
	gulpConnect.server({
		root:'./development',
		livereload:true,
		port:8080
	})
})

gulp.task('pages',() => {
	return gulp.src('./development/template/pages/*')
	.pipe(gulpFileInclude({
		prefix:'@@',
		basepath:'@file'
	}))
	.pipe(gulp.dest('development/pages/'))
	.pipe(gulpConnect.reload())
})

gulp.task('css',() => {
	return gulp.src('./development/template/assets/css/*')
	.pipe(gulpSass())
	.pipe(gulp.dest('development/assets/css'))
	.pipe(gulpConnect.reload())
})

gulp.task('js',() => {
	return gulp.src('./development/template/assets/js/*')
	.pipe(gulpBabel({presets:['es2015','es2016','es2017'],plugins:[['transform-runtime',{'polyfill':false,'regenerator':true}]]}))
	.pipe(gulp.dest('development/assets/js'))
	.pipe(gulpConnect.reload())
})

gulp.task('watch',() => {
	gulp.watch('./development/template/pages/*.html',gulp.series('pages'))
	gulp.watch('./development/template/pages/components/*.html',gulp.series('pages'))
	gulp.watch('./development/template/assets/css/*.scss',gulp.series('css'))
	gulp.watch('./development/template/assets/js/*.js',gulp.series('js'))
})

gulp.task('htmlBuild',() => {
	return gulp.src('./development/pages/*.html')
	.pipe(gulpHtmlMin({removeComments:true,collapseWhitespace:true,minfyJS:true,minfyCss:true}))
	.pipe(gulp.dest('production/pages'))
})

gulp.task('cssBuild',() => {
	return gulp.src('./development/assets/css/*.css')
	.pipe(gulpCleanCss())
	.pipe(gulp.dest('production/assets/css'))
})

gulp.task('jsBuild',() => {
	return gulp.src('./development/assets/js/*.js')
	.pipe(gulpUglify())
	.pipe(gulp.dest('production/assets/js'))
})

gulp.task('imageBuild',() => {
	return gulp.src('./development/assets/images/*')
	.pipe(gulpImagemin())
	.pipe(gulp.dest('production/assets/images'))
})

gulp.task('staticBuild',() => {
	return gulp.src('./development/static/**')
	.pipe(gulp.dest('production/static'))
})

gulp.task('clean',() => {
	return gulp.src('production/',{read:false,allowEmpty:true})
	.pipe(gulpClean())
})

gulp.task('server',gulp.series('pages','css','js','connect'))
gulp.task('build',gulp.series('htmlBuild','cssBuild','jsBuild','imageBuild','staticBuild'))