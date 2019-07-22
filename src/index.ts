import * as dotenv from 'dotenv';
import * as path from 'path';

if (process.env.NODE_ENV === 'Development') {
  dotenv.config({
    path: path.resolve('../.env/dev.env'),
  });
} else if (process.env.NODE_ENV === 'Test') {
  dotenv.config({
    path: path.resolve('../.env/test.env'),
  });
} else {
  dotenv.config({
    path: path.resolve('../.env/prod.env'),
  });
  process.env.NODE_ENV = 'Production';
  process.env.DB_PROFILE = 'default-dis';
}

// In this project,
// the dependency tree is like this
// func -> entity + util -> node_modules
// func is the highest level, we can cite func here to reference everything

export * from '@boilerplate/func';
