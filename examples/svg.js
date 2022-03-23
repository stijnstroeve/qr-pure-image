// This example requires NodeJS and cannot be ran in the browser.
const fs = require('fs');
const qr = require('../lib/qr');

const svgString = qr.svg('Hello world!');
fs.writeFileSync('test.svg', svgString);