# qr-pure-image
Pure javascript QR code image generation.

This package is a copy off the [qr-image](https://www.npmjs.com/package/qr-image) package.
The qr-image package contains some features that requires some NodeJS. In this version all of these features have been removed or updated. So this package does not have ANY external dependencies.

The api itself has also been changed to be a bit more clear.

The TypeScript declarations have also been added to the package itself instead of the `@types` organization.

## Usage
```js
const qr = require('qr-pure-image');
 
const qr_svg = qr.svg('I love QR!');
// Outputs "<svg> .... </svg>"
```

### Methods
- `qr.bitmap(text, [size | options])` - Generate a QR bitmap of the given text;
- `qr.svg(text, [size | options])` - Generate a svg string with a QR code of the given text;
- `qr.pdf(text, [options])` - Generate a pdf string with a QR code of the given text;
- `qr.eps(text, [options])` - Generate an eps string with a QR code of the given text;
- `qr.matrix(text, [ec_level])` - Create a 2D array of number representing the QR code.

### Options
- `text` - Text to encode into a QR code
- `size` - Size of the image
- `options` - Image options object
    - `ec_level` - Error correction level. One of L, M, Q, H. Default M.
    - `size` - Size of the image
    - `margin` - White space around the QR image

### Examples
More examples can be [found here](https://github.com/stijnstroeve/qr-pure-image/blob/HEAD/examples).