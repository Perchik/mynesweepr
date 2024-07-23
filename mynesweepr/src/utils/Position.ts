export interface Position {
  x: number;
  y: number;
}
export const positionKey = (position: Position): string =>
  `${position.x},${position.y}`;
