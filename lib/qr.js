"use strict";

const QR = require('./qr-base').QR;
const bmp = require('./bitmap');
const vector = require('./vector');

const BITMAP_OPTIONS = {
    ec_level: 'M',
    size: 200,
    margin: 0
};

const VECTOR_OPTIONS = {
    ec_level: 'M',
    size: 0,
    margin: 0
};

function get_options(options, defaults) {
    if (typeof options === 'number') {
        options = { 'size': options }
    } else {
        options = options || {};
    }
    const _options = {};

    for (const k in defaults) {
        _options[k] = k in options ? options[k] : defaults[k];
    }

    return _options;
}

function qr_image(text, options) {
    options = get_options(options);

    const matrix = QR(text, options.ec_level, options.parse_url);
    const stream = [];
    let result;

    switch (options.type) {
    case 'svg':
    case 'pdf':
    case 'eps':
        vector[options.type](matrix, stream, options.margin, options.size);
        result = stream.filter(Boolean).join('');
        break;
    case 'bmp':
    default:
        const bitmap = bmp.bitmap(matrix, options.size, options.margin);
        result = bitmap;
    }

    return result;
}

function qr_bitmap(text, options) {
    options = get_options(options, BITMAP_OPTIONS);
    const matrix = QR(text, options.ec_level);

    return bmp.bitmap(matrix, options.size);
}

function qr_svg(text, options) {
    options = get_options(options, VECTOR_OPTIONS);
    const matrix = QR(text, options.ec_level);

    const result = [];
    vector.svg(matrix, result, options.margin, options.size);
    return result.filter(Boolean).join('');
}

function qr_pdf(text, options) {
    options = get_options(options, VECTOR_OPTIONS);
    const matrix = QR(text, options.ec_level);

    const result = [];
    vector.pdf(matrix, result, options.margin, options.size);
    return result.filter(Boolean).join('');
}

function qr_eps(text, options) {
    options = get_options(options, VECTOR_OPTIONS);
    const matrix = QR(text, options.ec_level);

    const result = [];
    vector.pdf(matrix, result, options.margin, options.size);
    return result.filter(Boolean).join('');
}

module.exports = {
    matrix: QR,

    bitmap: qr_bitmap,
    svg: qr_svg,
    pdf: qr_pdf,
    eps: qr_eps,
};
