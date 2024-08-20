import React from "react";
import styled from "styled-components";
import { useGameContext } from "../context/GameContext";
import { getDigitImage } from "./getDigitImage";

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

const DigitalCounter: React.FC<DigitalCounterProps> = ({ value }) => {
  const { viewMode } = useGameContext();
  const digits = value
    .toString()
    .padStart(3, " ")
    .split("")
    .map((char) => (char === " " ? -1 : parseInt(char, 10)));

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
