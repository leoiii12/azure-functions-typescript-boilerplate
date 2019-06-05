const del = require('del');
const fs = require('fs');
const parcelBundler = require('parcel-bundler');

const gulp = require('gulp');
const ts = require('gulp-typescript');
const sourcemaps = require('gulp-sourcemaps');
const filter = require('gulp-filter');
const change = require('gulp-change');
const rename = require('gulp-rename');

const doc = require('./doc/index.ts'); fs.writeFileSync('doc/versions/staging.json', JSON.stringify(doc.swaggerFileObj, null, 2), 'utf8');

const isProd = process.env.NODE_ENV === 'Development' ? false : true;

function clean() {
  return del(['dist', 'node_modules/@boilerplate', '.cache']);
}

function modules() {
  const tsProject = ts.createProject('tsconfig.json');
  const scope = ['src/entity/**/*.ts', 'src/util/**/*.ts', 'src/func/**/*.ts'];
  const outDir = 'node_modules/@boilerplate';
  const swaggerFileObj = doc.swaggerFileObj;

  if (isProd) {
    return gulp
      .src('src/**/*.ts')
      .pipe(filter(scope))
      .pipe(change((content) => {
        if (content.includes('\\${specJson}')) {
          return content.replace('\\${specJson}', JSON.stringify(swaggerFileObj));
        }

        return content;
      }))
      .pipe(tsProject())
      .pipe(gulp.dest(outDir));
  }

  return gulp
    .src('src/**/*.ts')
    .pipe(filter(scope))
    .pipe(sourcemaps.init())
    .pipe(tsProject())
    .pipe(change((content) => {
      if (content.includes('\\${specJson}')) {
        return content.replace('\\${specJson}', JSON.stringify(swaggerFileObj));
      }

      return content;
    }))
    .pipe(sourcemaps.mapSources((sourcePath, file) => {
      return sourcePath.includes('func') ? '../../../../src/' + sourcePath : '../../../src/' + sourcePath;
    }))
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest(outDir));
}

function libs() {
  const tsProject = ts.createProject('tsconfig.json');

  if (isProd) {
    return gulp
      .src('src/index.ts')
      .pipe(tsProject())
      .pipe(gulp.dest('dist'));
  }

  return gulp
    .src('src/index.ts')
    .pipe(sourcemaps.init())
    .pipe(tsProject())
    .pipe(sourcemaps.mapSources(function (sourcePath, file) {
      return '../src/' + sourcePath;
    }))
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest('dist'));
}

function funcBootstraps() {
  const tsProject = ts.createProject('tsconfig.json');
  const template = `
    import { \${funcName} } from '../index';

    export async function run(context: any) {
      return \${funcName}(context);
    }
  `;

  return gulp
    .src('src/func/*/index.ts')

    // 1. Rename to bootstrap.ts
    // 2. Modify content with the template
    // 3. Transpile
    // 4. Rename to index.js
    .pipe(rename({ basename: 'bootstrap' }))
    .pipe(change((content) => {
      const regex = /function\ (\S+)\(context/;
      const matches = content.match(regex);

      return template.split('${funcName}').join(matches[1]);
    }))
    .pipe(tsProject())
    .pipe(rename({ basename: 'index' }))

    .pipe(gulp.dest('dist'));
}

function funcDefs() {
  return gulp
    .src('src/func/**/function.json')
    .pipe(gulp.dest('dist'));
}

function hostDefs() {
  let src = ['src/host.json', 'src/extensions.csproj', 'ormconfig.json'];

  if (isProd) {
    src = src.concat(['src/package.json']);
  } else {
    src = src.concat(['src/local.settings.json']);
  }

  return gulp
    .src(src)
    .pipe(gulp.dest('dist'));
}

async function libsPacks() {
  if (isProd) {
    const outDir = 'dist';
    const options = {
      outDir: outDir,
      outFile: 'index.js',
      watch: false,
      cache: true,
      cacheDir: '.cache',
      contentHash: false,
      minify: true,
      scopeHoist: false,
      target: 'node',
      bundleNodeModules: true,
      sourceMaps: false,
      detailedReport: false,
      logLevel: 3
    };

    const bundler = new parcelBundler('dist/index.js', options);

    const bundle = await bundler.bundle();

    fs.writeFileSync(outDir + '/index.js.bundle', Array.from(bundle.assets).map(a => `${a.name},${a.bundledSize}`).join('\n'));
  }
}

function watch() {
  gulp.watch(['src/entity/**/*.ts', 'src/util/**/*.ts', 'src/func/**/*.ts'], gulp.series(modules));
}

exports.clean = clean;
exports.modules = modules;
exports.libs = libs;
exports.funcBootstraps = funcBootstraps;
exports.funcDefs = funcDefs;
exports.hostDefs = hostDefs;

const build = gulp.series(
  gulp.parallel(
    funcDefs,
    hostDefs
  ),
  gulp.parallel(
    modules,
    libs,
    funcBootstraps,
  ),
  libsPacks
);

gulp.task('watch', watch);
gulp.task('build', build);
gulp.task('default', build);