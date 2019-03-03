const fs = require('fs')

const gulp = require('gulp')
const bump = require('gulp-bump')
const git = require('gulp-git')

const args = require('yargs').argv
const del = require('del')

// Clean

gulp.task('clean', () =>
  del(['build'], { force: true })
)

// Bump

gulp.task('bump:package', () => {
  /// It bumps revisions
  /// Usage:
  /// 1. gulp bump : bumps the package.json and bower.json to the next minor revision.
  ///   i.e. from 0.1.1 to 0.1.2
  /// 2. gulp bump --version 1.1.1 : bumps/sets the package.json and bower.json to the
  ///    specified revision.
  /// 3. gulp bump --type major       : bumps 1.0.0
  ///    gulp bump --type minor       : bumps 0.1.0
  ///    gulp bump --type patch       : bumps 0.0.2
  ///    gulp bump --type prerelease  : bumps 0.0.1-2

  const type = args.type || 'patch'
  const version = args.version
  const options = {}

  if (version) {
    options.version = version
  } else {
    options.type = type
  }

  return gulp
    .src(['package.json'])
    .pipe(bump(options))
    .pipe(gulp.dest('.'))
})

const getBumpMessage = () => {
  const json = fs.readFileSync('./package.json', { encoding: 'utf8' })
  const packageJson = JSON.parse(json)
  return `bump version to v${packageJson.version}`
}

gulp.task('bump:git:commit', () =>
  gulp.src('./package.json')
    .pipe(git.commit(getBumpMessage()))
)

gulp.task('bump', gulp.series('bump:package', 'bump:git:commit'))
