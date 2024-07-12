import { CellCoordinate } from '../types';
import { State } from './State';

export class Cell {
    value: number;
    coordinates: CellCoordinate;
    state: State;
    neighbors: Cell[];

    constructor(value: number, coordinates: CellCoordinate, state: State = State.Closed) {
        this.value = value;
        this.coordinates = coordinates;
        this.state = state;
        this.neighbors = [];
    }

    setNeighbors(neighbors: Cell[]): void {
        this.neighbors = neighbors;
    }

    forEachNeighbor(callback: (neighbor: Cell) => void): void {
        this.neighbors.forEach(callback);
    }
}
