const gulp = require("gulp");
const del = require("del");
const ts = require("gulp-typescript");
const sourcemaps = require("gulp-sourcemaps");
const terser = require("gulp-terser");
const filter = require("gulp-filter");

const isProd = process.env.NODE_ENV === "Development" ? false : true;

function clean() {
  return del(["dist"]);
}

function scripts() {
  const tsProject = ts.createProject("tsconfig.json");

  if (isProd) {
    return gulp
      .src(["src/**/*.ts"])
      .pipe(filter(["src/entity/**/*.ts", "src/util/**/*.ts"]))
      .pipe(tsProject())
      .pipe(terser())
      .pipe(gulp.dest("dist/node_modules/@boilerplate"));
  }

  return gulp
    .src(["src/**/*.ts"])
    .pipe(filter(["src/entity/**/*.ts", "src/util/**/*.ts"]))
    .pipe(sourcemaps.init())
    .pipe(tsProject())
    .pipe(sourcemaps.mapSources(function (sourcePath, file) {
      return "../../../../src/" + sourcePath;
    }))
    .pipe(sourcemaps.write("."))
    .pipe(gulp.dest("dist/node_modules/@boilerplate"));
}

function functions() {
  const tsProject = ts.createProject("tsconfig.json");

  if (isProd) {
    return gulp
      .src(["src/func/**/*.ts"])
      .pipe(tsProject())
      .pipe(terser())
      .pipe(gulp.dest("dist"));
  }

  return gulp
    .src(["src/func/**/*.ts"])
    .pipe(sourcemaps.init())
    .pipe(tsProject())
    .pipe(sourcemaps.mapSources(function (sourcePath, file) {
      return "../../src/" + sourcePath;
    }))
    .pipe(sourcemaps.write("."))
    .pipe(gulp.dest("dist"));
}

function funcDefs() {
  return gulp
    .src("src/func/**/function.json")
    .pipe(gulp.dest("dist"));
}

function hostDefs() {
  return gulp
    .src(["src/host.json", "src/local.settings.json", "src/extensions.csproj"])
    .pipe(gulp.dest("dist"));
}

exports.clean = clean;
exports.scripts = scripts;
exports.functions = functions;
exports.funcDefs = funcDefs;
exports.hostDefs = hostDefs;

const build = gulp.series(clean, gulp.parallel(scripts, functions, funcDefs, hostDefs));

gulp.task("build", build);
gulp.task("default", build);