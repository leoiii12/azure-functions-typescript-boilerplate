const del = require("del");
const fs = require("fs");

const gulp = require("gulp");
const ts = require("gulp-typescript");
const sourcemaps = require("gulp-sourcemaps");
const filter = require("gulp-filter");
const parcelBundler = require("parcel-bundler");
const glob = require("glob-promise");

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
      .pipe(gulp.dest("node_modules/@boilerplate"));
  }

  return gulp
    .src(["src/**/*.ts"])
    .pipe(filter(["src/entity/**/*.ts", "src/util/**/*.ts"]))
    .pipe(sourcemaps.init())
    .pipe(tsProject())
    .pipe(sourcemaps.mapSources(function (sourcePath, file) {
      return "../../../src/" + sourcePath;
    }))
    .pipe(sourcemaps.write("."))
    .pipe(gulp.dest("node_modules/@boilerplate"));
}

function functions() {
  const tsProject = ts.createProject("tsconfig.json");

  if (isProd) {
    return gulp
      .src(["src/func/**/*.ts"])
      .pipe(tsProject())
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
  let src = ["src/host.json", "src/extensions.csproj", "ormconfig.json"];

  if (isProd) {
    src = src.concat(["src/package.json"]);
  } else {
    src = src.concat(["src/local.settings.json"]);
  }

  return gulp
    .src(src)
    .pipe(gulp.dest("dist"));
}

async function funcPacks() {
  let entries = await glob("dist/*/index.js");

  if (isProd) {
    for (let entry of entries) {
      const outDir = entry.replace("/index.js", "");
      const options = {
        outDir: outDir,
        outFile: "index.js",
        watch: false,
        cache: true,
        cacheDir: ".cache",
        contentHash: false,
        minify: true,
        scopeHoist: false,
        target: "node",
        bundleNodeModules: true,
        sourceMaps: false,
        detailedReport: false,
        logLevel: 2
      };

      const bundler = new parcelBundler(entry, options);

      const bundle = await bundler.bundle();

      fs.writeFileSync(outDir + "/index.js.bundle", Array.from(bundle.assets).map(a => `${a.name},${a.bundledSize}`).join('\n'));
    }
  }
}

exports.clean = clean;
exports.scripts = scripts;
exports.functions = functions;
exports.funcDefs = funcDefs;
exports.hostDefs = hostDefs;

const build = gulp.series(
  clean,
  gulp.parallel(
    scripts,
    functions,
    funcDefs,
    hostDefs
  ),
  funcPacks
);

gulp.task("build", build);
gulp.task("default", build);