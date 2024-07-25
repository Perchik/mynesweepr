import React from "react";
import styled from "styled-components";

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

const getDigitImage = (digit: number): string => {
  switch (digit) {
    case 0:
      return "icons/digits/red/d0.svg";
    case 1:
      return "icons/digits/red/d1.svg";
    case 2:
      return "icons/digits/red/d2.svg";
    case 3:
      return "icons/digits/red/d3.svg";
    case 4:
      return "icons/digits/red/d4.svg";
    case 5:
      return "icons/digits/red/d5.svg";
    case 6:
      return "icons/digits/red/d6.svg";
    case 7:
      return "icons/digits/red/d7.svg";
    case 8:
      return "icons/digits/red/d8.svg";
    case 9:
      return "icons/digits/red/d9.svg";
    default:
      return "icons/digits/red/dOff.svg";
  }
};

const DigitalCounter: React.FC<DigitalCounterProps> = ({ value }) => {
  const digits = value
    .toString()
    .padStart(3, " ")
    .split("")
    .map((char) => (char === " " ? -1 : parseInt(char)));

  return (
    <CounterContainer>
      {digits.map((digit, index) => (
        <Digit key={index} src={getDigitImage(digit)} alt={`${digit}`} />
      ))}
    </CounterContainer>
  );
};

export default DigitalCounter;
