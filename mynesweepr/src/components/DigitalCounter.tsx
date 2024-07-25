import React from "react";
import styled from "styled-components";
import { useGameContext } from "../context/GameContext";

const CounterContainer = styled.div`
  display: flex;
  margin: 6px;
  padding: 2px;
  background-color: #000;
  gap: 3px;
  border: 2px solid #000;
  border-color: #808080 #fff #fff #808080;
`;

const Digit = styled.img`
  height: 36px;
`;
interface DigitalCounterProps {
  value: number;
}

const getDigitImage = (digit: number, viewMode: string = "normal"): string => {
  const color = viewMode === "reduced" ? "blue" : "red";
  switch (digit) {
    case 0:
      return `icons/digits/${color}/d0.svg`;
    case 1:
      return `icons/digits/${color}/d1.svg`;
    case 2:
      return `icons/digits/${color}/d2.svg`;
    case 3:
      return `icons/digits/${color}/d3.svg`;
    case 4:
      return `icons/digits/${color}/d4.svg`;
    case 5:
      return `icons/digits/${color}/d5.svg`;
    case 6:
      return `icons/digits/${color}/d6.svg`;
    case 7:
      return `icons/digits/${color}/d7.svg`;
    case 8:
      return `icons/digits/${color}/d8.svg`;
    case 9:
      return `icons/digits/${color}/d9.svg`;
    default:
      return `icons/digits/${color}/dOff.svg`;
  }
};

const DigitalCounter: React.FC<DigitalCounterProps> = ({ value }) => {
  const { viewMode } = useGameContext();
  const digits = value
    .toString()
    .padStart(3, " ")
    .split("")
    .map((char) => (char === " " ? -1 : parseInt(char)));

  return (
    <CounterContainer>
      {digits.map((digit, index) => (
        <Digit
          key={index}
          src={getDigitImage(digit, viewMode)}
          alt={`${digit}`}
        />
      ))}
    </CounterContainer>
  );
};

export default DigitalCounter;
