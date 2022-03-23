// This example requires NodeJS and cannot be ran in the browser.
const fs = require('fs');
const qr = require('../lib/qr');

const pdfString = qr.pdf('Hello world!');
fs.writeFileSync('test.pdf', pdfString);