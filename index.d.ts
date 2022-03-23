/**
 * error correction level. One of L, M, Q, H. Default M.
 */
export type ECLevel = 'L' | 'M' | 'Q' | 'H';

export type Bitmap = {
    /**
     * width (and height) of resulting image in pixels
     */
    size: number;
    /**
     * @summary
     * Uint8Array with image data. It's a linear representation
     * of image in format:
     *
     * @example
     * <xx> <xx> <xx> ..        <xx>
     * <xx> <xx> <xx> ..        <xx>
     * ..
     * <xx> <xx> <xx> ..        <xx>
     *
     * @description
     * Each `<xx>` is a pixel of image.
     * Value `0` = black and `1` = white.
     */
    data: Uint8Array;
}

export type Options = {
    // error correction level. One of L, M, Q, H. Default M.
    ec_level?: ECLevel;
}

export type MarginOption = {
    // white space around QR image in modules.
    margin?: number;
} 

export type SizeOption = {
    // size of the QR image
    size?: number;
}

export type BitmapOptions = Options & SizeOption;
export type SVGOptions = Options & SizeOption & MarginOption;
export type PDFOptions = Options & MarginOption;
export type EPSOptions = Options & MarginOption;
 
export function bitmap(text: string, options?: BitmapOptions | number): Bitmap;
export function svg(text: string, options?: SVGOptions | number): string;
export function pdf(text: string, options?: PDFOptions): string;
export function eps(text: string, options?: EPSOptions): string;

export function matrix(text: string, level?: ECLevel): number[][];
 