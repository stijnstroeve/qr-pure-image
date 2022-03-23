// This example requires NodeJS and cannot be ran in the browser.
const fs = require('fs');
const qr = require('../lib/qr');

const epsString = qr.eps('Hello world!');
fs.writeFileSync('test.eps', epsString);