import React, { useRef, useEffect } from "react";
import styled from "styled-components";

declare global {
  interface Window {
    cv: typeof cv;
  }
}

const AppContainer = styled.div`
  text-align: center;
`;

const ImageCanvas = styled.canvas`
  max-width: 50%;
  height: auto;
  margin: 20px auto;
  border: 1px solid #000;
`;

const HiddenImage = styled.img`
  display: none;
`;

const App: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const imgRef = useRef<HTMLImageElement | null>(null);

  useEffect(() => {
    const img = imgRef.current;
    const canvas = canvasRef.current;
    if (img && canvas) {
      img.onload = () => {
        const ctx = canvas.getContext("2d");
        if (ctx) {
          // Set canvas dimensions to match image
          canvas.width = img.width;
          canvas.height = img.height;

          // Draw image on canvas
          ctx.drawImage(img, 0, 0, img.width, img.height);

          // Perform OpenCV operation once OpenCV is ready
          if (window.cv) {
            const cv = window.cv;
            const src = cv.imread(img);
            const gray = new cv.Mat();
            cv.cvtColor(src, gray, cv.COLOR_RGBA2GRAY, 0);

            // Detect edges using Canny
            const edges = new cv.Mat();
            cv.Canny(gray, edges, 50, 150);

            // Display the edges on the canvas
            cv.imshow(canvas, edges);

            // Clean up
            src.delete();
            gray.delete();
            edges.delete();
          }
        }
      };
    }
  }, []);

  return (
    <AppContainer>
      <HiddenImage ref={imgRef} src="/images/board1.png" alt="Original" />
      <ImageCanvas ref={canvasRef} />
    </AppContainer>
  );
};

export default App;
