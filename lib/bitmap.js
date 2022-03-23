"use strict";

function bitmap(matrix, size) {
    const matrixSize = matrix.length;
    const scale = Math.floor(size / matrixSize);
    const rowSize = scale * scale * matrixSize;
    size = scale * matrixSize;

    const data = new Uint8Array(size * size);

    for(let rI = 0; rI < matrixSize; rI++) {
        const row = matrix[rI];

        for(let i = 0; i < rowSize; i++) {
            data[i + rI * rowSize] = row[Math.floor(i / scale) % matrixSize];
        }
    }

    return {
        data: data,
        size: size
    }
}

module.exports = {
    bitmap: bitmap,
}
