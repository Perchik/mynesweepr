declare namespace cv {
  class Mat {
    cols: number;
    rows: number;
    data: Uint8Array;
    delete(): void;
  }

  function imread(imageSource: HTMLImageElement | HTMLCanvasElement): Mat;
  function imshow(canvasSource: HTMLCanvasElement, mat: Mat): void;
  function cvtColor(src: Mat, dst: Mat, code: number, dstCn?: number): void;

  const COLOR_RGBA2GRAY: number;
}
