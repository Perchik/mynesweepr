import { Position } from "./Position";

export class NeighborLookup {
  private neighborArray: Position[][];

  constructor(private width: number, private height: number) {
    this.neighborArray = new Array(width * height);
    this.createNeighborLookup();
  }

  private createNeighborLookup() {
    // prettier-ignore
    const directions: Position[] = [
      { x: -1, y: -1 }, { x: -1, y: 0 }, { x: -1, y: 1 },
      { x:  0, y: -1 }, /*  current  */  { x:  0, y: 1 },
      { x:  1, y: -1 }, { x:  1, y: 0 }, { x:  1, y: 1 }
    ];

    for (let y = 0; y < this.height; y++) {
      for (let x = 0; x < this.width; x++) {
        const neighbors: Position[] = [];
        for (const direction of directions) {
          const nx = x + direction.x;
          const ny = y + direction.y;
          if (nx >= 0 && ny >= 0 && nx < this.width && ny < this.height) {
            neighbors.push({ x: nx, y: ny });
          }
        }
        this.neighborArray[y * this.width + x] = neighbors;
      }
    }
  }

  getNeighbors(position: Position): Position[] {
    return this.neighborArray[position.y * this.width + position.x] || [];
  }
}
