import React, { useRef, useEffect, useState } from "react";
import {
  Box,
  Button,
  Container,
  Stepper,
  Step,
  StepLabel,
  Typography,
  Paper,
} from "@mui/material";
import styled from "@emotion/styled";

const ImageCanvas = styled("canvas")`
  max-width: 50%;
  height: auto;
  margin: 20px;
  border: 1px solid #000;
`;

const HiddenImage = styled("img")`
  display: none;
`;

const steps = [
  "Pick 4 Corners",
  "Set Horizontal Line",
  "Set Vertical Line",
  "Parse",
];

const App: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const imgRef = useRef<HTMLImageElement | null>(null);

  const [activeStep, setActiveStep] = useState(0);

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
        }
      };
    }
  }, []);

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleReset = () => {
    setActiveStep(0);
  };

  return (
    <Container>
      <Typography variant="h4" gutterBottom>
        Image Loader
      </Typography>
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "flex-start",
        }}
      >
        <Paper elevation={3} sx={{ padding: 2, marginRight: 2 }}>
          <Stepper activeStep={activeStep} orientation="vertical">
            {steps.map((label) => (
              <Step key={label}>
                <StepLabel>{label}</StepLabel>
              </Step>
            ))}
          </Stepper>
          <Box sx={{ marginTop: 2 }}>
            <Button
              disabled={activeStep === 0}
              onClick={handleBack}
              sx={{ marginRight: 1 }}
            >
              Back
            </Button>
            <Button
              variant="contained"
              onClick={handleNext}
              sx={{ marginRight: 1 }}
            >
              {activeStep === steps.length - 1 ? "Finish" : "Next"}
            </Button>
            {activeStep === steps.length && (
              <Button onClick={handleReset}>Reset</Button>
            )}
          </Box>
        </Paper>
        <div>
          <HiddenImage ref={imgRef} src="/images/board1.png" alt="Original" />
          <ImageCanvas ref={canvasRef} />
        </div>
      </Box>
    </Container>
  );
};

export default App;
