const dotenv = require('dotenv');
const path = require('path');

dotenv.config({
  path: path.resolve('.env/test.env'),
});

jest.setTimeout(30000);
