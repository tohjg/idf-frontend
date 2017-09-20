import gulp from 'gulp'
import gulputil from 'gulp-util'
import browserSync from 'browser-sync'

gulp.task('serve', () => {
  browserSync.init({
    server: './src'
  })

  gulp.watch('./src/*').on('change', browserSync.reload);
})

gulp.task('default', ['serve'])
