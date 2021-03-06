"use strict";

function matrix2path(matrix) {
    const N = matrix.length;
    const filled = [];
    for (let row = -1; row <= N; row++) {
        filled[row] = [];
    }

    const path = [];
    for (let row = 0; row < N; row++) {
        for (let col = 0; col < N; col++) {
            if (filled[row][col]) continue;
            filled[row][col] = 1;
            if (isDark(row, col)) {
                if (!isDark(row - 1, col)) {
                    path.push(plot(row, col, 'right'));
                }
            } else {
                if (isDark(row, col - 1)) {
                    path.push(plot(row, col, 'down'));
                }
            }
        }
    }
    return path;

    function isDark(row, col) {
        if (row < 0 || col < 0 || row >= N || col >= N) return false;
        return !!matrix[row][col];
    }

    function plot(row0, col0, dir) {
        filled[row0][col0] = 1;
        const res = [];
        res.push(['M',  col0, row0 ]);
        let row = row0;
        let col = col0;
        let len = 0;
        do {
            switch (dir) {
            case 'right':
                filled[row][col] = 1;
                if (isDark(row, col)) {
                    filled[row - 1][col] = 1;
                    if (isDark(row - 1, col)) {
                        res.push(['h', len]);
                        len = 0;
                        dir = 'up';
                    } else {
                        len++;
                        col++;
                    }
                } else {
                    res.push(['h', len]);
                    len = 0;
                    dir = 'down';
                }
                break;
            case 'left':
                filled[row - 1][col - 1] = 1;
                if (isDark(row - 1, col - 1)) {
                    filled[row][col - 1] = 1;
                    if (isDark(row, col - 1)) {
                        res.push(['h', -len]);
                        len = 0;
                        dir = 'down';
                    } else {
                        len++;
                        col--;
                    }
                } else {
                    res.push(['h', -len]);
                    len = 0;
                    dir = 'up';
                }
                break;
            case 'down':
                filled[row][col - 1] = 1;
                if (isDark(row, col - 1)) {
                    filled[row][col] = 1;
                    if (isDark(row, col)) {
                        res.push(['v', len]);
                        len = 0;
                        dir = 'right';
                    } else {
                        len++;
                        row++;
                    }
                } else {
                    res.push(['v', len]);
                    len = 0;
                    dir = 'left';
                }
                break;
            case 'up':
                filled[row - 1][col] = 1;
                if (isDark(row - 1, col)) {
                    filled[row - 1][col - 1] = 1;
                    if (isDark(row - 1, col - 1)) {
                        res.push(['v', -len]);
                        len = 0;
                        dir = 'left';
                    } else {
                        len++;
                        row--;
                    }
                } else {
                    res.push(['v', -len]);
                    len = 0;
                    dir = 'right';
                }
                break;
            }
        } while (row != row0 || col != col0);
        return res;
    }
}

function pushSVGPath(matrix, stream, margin) {
    matrix2path(matrix).forEach(function(subpath) {
        let res = '';
        for (let k = 0; k < subpath.length; k++) {
            const item = subpath[k];
            switch (item[0]) {
            case 'M':
                res += 'M' + (item[1] + margin) + ' ' + (item[2] + margin);
                break;
            default:
                res += item.join('');
            }
        }
        res += 'z';
        stream.push(res);
    });
}

function SVG(matrix, stream, margin, size) {
    const X = matrix.length + 2 * margin;
    stream.push('<svg xmlns="http://www.w3.org/2000/svg" ');
    if (size > 0) {
        const XY = X * size;
        stream.push('width="' + XY + '" height="' + XY + '" ');
    }
    stream.push('viewBox="0 0 ' + X + ' ' + X + '">');
    stream.push('<path d="');
    pushSVGPath(matrix, stream, margin);
    stream.push('"/></svg>');
}

function EPS(matrix, stream, margin) {
    const N = matrix.length;
    const scale = 9;
    const X = (N + 2 * margin) * scale;
    stream.push([
        '%!PS-Adobe-3.0 EPSF-3.0',
        '%%BoundingBox: 0 0 ' + X + ' ' + X,
        '/h { 0 rlineto } bind def',
        '/v { 0 exch neg rlineto } bind def',
        '/M { neg ' + (N + margin) + ' add moveto } bind def',
        '/z { closepath } bind def',
        scale + ' ' + scale + ' scale',
        ''
    ].join('\n'));

    matrix2path(matrix).forEach(function(subpath) {
        let res = '';
        for (let k = 0; k < subpath.length; k++) {
            const item = subpath[k];
            switch (item[0]) {
            case 'M':
                res += (item[1] + margin) + ' ' + item[2] + ' M ';
                break;
            default:
                res += item[1] + ' ' + item[0] + ' ';
            }
        }
        res += 'z\n';
        stream.push(res);
    });

    stream.push('fill\n%%EOF\n');
}

function PDF(matrix, stream, margin) {
    const N = matrix.length;
    const scale = 9;
    const X = (N + 2 * margin) * scale;
    const data = [
        '%PDF-1.0\n\n',
        '1 0 obj << /Type /Catalog /Pages 2 0 R >> endobj\n',
        '2 0 obj << /Type /Pages /Count 1 /Kids [ 3 0 R ] >> endobj\n',
    ];
    data.push('3 0 obj << /Type /Page /Parent 2 0 R /Resources <<>> ' +
        '/Contents 4 0 R /MediaBox [ 0 0 ' + X + ' ' + X + ' ] >> endobj\n');

    let path = scale + ' 0 0 ' + scale + ' 0 0 cm\n';
    path += matrix2path(matrix).map(function(subpath) {
        let res = '';
        let x, y;
        for (let k = 0; k < subpath.length; k++) {
            const item = subpath[k];
            switch (item[0]) {
            case 'M':
                x = item[1] + margin;
                y = N - item[2] + margin;
                res += x + ' ' + y + ' m ';
                break;
            case 'h':
                x += item[1];
                res += x + ' ' + y + ' l ';
                break;
            case 'v':
                y -= item[1];
                res += x + ' ' + y + ' l ';
                break;
            }
        }
        res += 'h';
        return res;
    }).join('\n');
    path += '\nf\n';
    data.push('4 0 obj << /Length ' + path.length + ' >> stream\n' +
        path + 'endstream\nendobj\n');

    let xref = 'xref\n0 5\n0000000000 65535 f \n';
    let l = data[0].length;
    for (let i = 1; i < 5; i++) {
        xref += ('0000000000' + l).substr(-10) + ' 00000 n \n';
        l += data[i].length;
    }
    data.push(
        xref,
        'trailer << /Root 1 0 R /Size 5 >>\n',
        'startxref\n' + l + '\n%%EOF\n'
    );
    stream.push(data.join(''));
}

module.exports = {
    svg: SVG,
    eps: EPS,
    pdf: PDF,
}
