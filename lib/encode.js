"use strict";

function pushBits(arr, n, value) {
    for (let bit = 1 << (n - 1); bit; bit = bit >>> 1) {
        arr.push(bit & value ? 1 : 0);
    }
}

// {{{1 8bit encode
function encode_8bit(data) {
    const len = data.length;
    const bits = [];

    for (let i = 0; i < len; i++) {
        pushBits(bits, 8, data[i]);
    }

    const res = {};

    const d = [0, 1, 0, 0];
    pushBits(d, 16, len);
    res.data10 = res.data27 = d.concat(bits);

    if (len < 256) {
        const d2 = [0, 1, 0, 0];
        pushBits(d2, 8, len);
        res.data1 = d2.concat(bits);
    }

    return res;
}

// {{{1 alphanumeric encode
const ALPHANUM = (function(s) {
    const res = {};
    for (let i = 0; i < s.length; i++) {
        res[s[i]] = i;
    }
    return res;
})('0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ $%*+-./:');

function encode_alphanum(str) {
    const len = str.length;
    const bits = [];

    for (let i = 0; i < len; i += 2) {
        let b = 6;
        let n = ALPHANUM[str[i]];
        if (str[i+1]) {
            b = 11;
            n = n * 45 + ALPHANUM[str[i+1]];
        }
        pushBits(bits, b, n);
    }

    const res = {};

    const d = [0, 0, 1, 0];
    pushBits(d, 13, len);
    res.data27 = d.concat(bits);

    if (len < 2048) {
        const d2 = [0, 0, 1, 0];
        pushBits(d2, 11, len);
        res.data10 = d2.concat(bits);
    }

    if (len < 512) {
        const d3 = [0, 0, 1, 0];
        pushBits(d3, 9, len);
        res.data1 = d3.concat(bits);
    }

    return res;
}

// {{{1 numeric encode
function encode_numeric(str) {
    const len = str.length;
    const bits = [];

    for (let i = 0; i < len; i += 3) {
        const s = str.substr(i, 3);
        const b = Math.ceil(s.length * 10 / 3);
        pushBits(bits, b, parseInt(s, 10));
    }

    const res = {};

    const d = [0, 0, 0, 1];
    pushBits(d, 14, len);
    res.data27 = d.concat(bits);

    if (len < 4096) {
        const d2 = [0, 0, 0, 1];
        pushBits(d2, 12, len);
        res.data10 = d2.concat(bits);
    }

    if (len < 1024) {
        const d3 = [0, 0, 0, 1];
        pushBits(d3, 10, len);
        res.data1 = d3.concat(bits);
    }

    return res;
}

function toUTF8Array(str) {
    const utf8 = [];
    for (let i = 0; i < str.length; i++) {
        let charcode = str.charCodeAt(i);
        if (charcode < 0x80) utf8.push(charcode);
        else if (charcode < 0x800) {
            utf8.push(0xc0 | (charcode >> 6), 
                      0x80 | (charcode & 0x3f));
        }
        else if (charcode < 0xd800 || charcode >= 0xe000) {
            utf8.push(0xe0 | (charcode >> 12), 
                      0x80 | ((charcode>>6) & 0x3f), 
                      0x80 | (charcode & 0x3f));
        }
        // surrogate pair
        else {
            i++;
            // UTF-16 encodes 0x10000-0x10FFFF by
            // subtracting 0x10000 and splitting the
            // 20 bits of 0x0-0xFFFFF into two halves
            charcode = 0x10000 + (((charcode & 0x3ff)<<10)
                      | (str.charCodeAt(i) & 0x3ff));
            utf8.push(0xf0 | (charcode >>18), 
                      0x80 | ((charcode>>12) & 0x3f), 
                      0x80 | ((charcode>>6) & 0x3f), 
                      0x80 | (charcode & 0x3f));
        }
    }
    return utf8;
}

// {{{1 Choose encode mode and generates struct with data for different version
function encode(data) {
    let str;
    const type = typeof data;

    if (type == 'string' || type == 'number') {
        str = '' + data;
        data = toUTF8Array(str);
    } else {
        throw new Error("Bad data");
    }

    if (/^[0-9]+$/.test(str)) {
        if (data.length > 7089) {
            throw new Error("Too much data");
        }
        return encode_numeric(str);
    }

    if (/^[0-9A-Z \$%\*\+\.\/\:\-]+$/.test(str)) {
        if (data.length > 4296) {
            throw new Error("Too much data");
        }
        return encode_alphanum(str);
    }

    if (data.length > 2953) {
        throw new Error("Too much data");
    }
    return encode_8bit(data);
}

// {{{1 export functions
module.exports = encode;
