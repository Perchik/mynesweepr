import d0Red from "./assets/red/d0.svg";
import d1Red from "./assets/red/d1.svg";
import d2Red from "./assets/red/d2.svg";
import d3Red from "./assets/red/d3.svg";
import d4Red from "./assets/red/d4.svg";
import d5Red from "./assets/red/d5.svg";
import d6Red from "./assets/red/d6.svg";
import d7Red from "./assets/red/d7.svg";
import d8Red from "./assets/red/d8.svg";
import d9Red from "./assets/red/d9.svg";
import dOffRed from "./assets/red/dOff.svg";

import d0Blue from "./assets/blue/d0.svg";
import d1Blue from "./assets/blue/d1.svg";
import d2Blue from "./assets/blue/d2.svg";
import d3Blue from "./assets/blue/d3.svg";
import d4Blue from "./assets/blue/d4.svg";
import d5Blue from "./assets/blue/d5.svg";
import d6Blue from "./assets/blue/d6.svg";
import d7Blue from "./assets/blue/d7.svg";
import d8Blue from "./assets/blue/d8.svg";
import d9Blue from "./assets/blue/d9.svg";
import dOffBlue from "./assets/blue/dOff.svg";

type Digit = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | "off";
type Color = "red" | "blue";

const digitImages: Record<Color, Record<Digit, string>> = {
  red: {
    0: d0Red,
    1: d1Red,
    2: d2Red,
    3: d3Red,
    4: d4Red,
    5: d5Red,
    6: d6Red,
    7: d7Red,
    8: d8Red,
    9: d9Red,
    off: dOffRed,
  },
  blue: {
    0: d0Blue,
    1: d1Blue,
    2: d2Blue,
    3: d3Blue,
    4: d4Blue,
    5: d5Blue,
    6: d6Blue,
    7: d7Blue,
    8: d8Blue,
    9: d9Blue,
    off: dOffBlue,
  },
};

export const getDigitImage = (
  digit: number,
  viewMode: string = "normal"
): string => {
  const color: Color = viewMode === "reduced" ? "blue" : "red";
  const safeDigit: Digit = digit >= 0 && digit <= 9 ? (digit as Digit) : "off";
  return digitImages[color][safeDigit];
};
