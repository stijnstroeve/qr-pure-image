const qr = require('../lib/qr');

// Create a bitmap of 1024 x 1024 pixels
const bitmap = qr.bitmap('Hello world!', 1024);
console.log('Expected bitmap size:', bitmap.size * bitmap.size);
console.log('Actual bitmap size:', bitmap.data.length);