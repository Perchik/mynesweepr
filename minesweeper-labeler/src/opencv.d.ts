declare namespace cv {
  class Mat {
    cols: number;
    rows: number;
    data: Uint8Array;
    data32S: Int32Array;
    delete(): void;
  }

  function imread(imageSource: HTMLImageElement | HTMLCanvasElement): Mat;
  function imshow(canvasSource: HTMLCanvasElement, mat: Mat): void;
  function cvtColor(src: Mat, dst: Mat, code: number, dstCn?: number): void;
  function Canny(
    image: Mat,
    edges: Mat,
    threshold1: number,
    threshold2: number,
    apertureSize?: number,
    L2gradient?: boolean
  ): void;
  function HoughLinesP(
    image: Mat,
    lines: Mat,
    rho: number,
    theta: number,
    threshold: number,
    minLineLength?: number,
    maxLineGap?: number
  ): void;

  const COLOR_RGBA2GRAY: number;
}
