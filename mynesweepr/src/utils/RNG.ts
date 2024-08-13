import seedrandom from "seedrandom";
import { Position } from "./Position";

export class RNG {
  private rng: seedrandom.PRNG;
  private seed: string;

  constructor(seed?: string) {
    this.seed = seed ?? Math.random.toString();
    this.rng = seedrandom(this.seed);
  }

  setSeed(seed: string) {
    this.rng = seedrandom(seed);
    this.seed = seed;
  }

  getSeed(): string {
    return this.seed;
  }

  random(): number {
    return this.rng();
  }
}

export function generateCoordinates(
  width: number,
  height: number,
  count: number,
  seed?: string
): Position[] {
  const rng = new RNG(seed);
  const coordinates: Set<string> = new Set<string>();

  while (coordinates.size < count) {
    const x = Math.floor(rng.random() * width);
    const y = Math.floor(rng.random() * height);
    coordinates.add(`${x},${y}`);
  }

  return Array.from(coordinates).map((coord) => {
    const [x, y] = coord.split(",").map(Number);
    return { x, y };
  });
}
