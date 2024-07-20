import React, { useRef, useEffect } from "react";
import "./App.css";
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
  max-width: 100%;
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
            cv.imshow(canvas, gray);
            src.delete();
            gray.delete();
          }
        }
      };
    }
  }, []);

  return (
    <AppContainer>
      <HiddenImage ref={imgRef} src="/images/board1.png" alt="Original" />
      <ImageCanvas ref={canvasRef} className="image-canvas" />
    </AppContainer>
  );
};

export default App;
