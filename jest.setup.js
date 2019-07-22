/*jshint esversion: 8 */
const dotenv = require('dotenv');
const path = require('path');

if (process.env.NODE_ENV === 'WERCKER') {
  dotenv.config({
    path: path.resolve('.env/wercker.env'),
  });
} else {
  dotenv.config({
    path: path.resolve('.env/test.env'),
  });
}

jest.setTimeout(30000);