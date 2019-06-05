import * as dotenv from 'dotenv';
import * as path from 'path';

if (process.env.NODE_ENV === 'Development') {
  dotenv.config({
    path: path.resolve('../.env/dev.env'),
  });
}

// In this project,
// the dependency tree is like this
// func -> entity + util -> node_modules
// func is the highest level, we can cite func here to reference everything

export * from '@boilerplate/func';
