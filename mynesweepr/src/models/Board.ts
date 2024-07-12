import { Cell } from './Cell';
import { State } from './State';

export class Board {
    private cells: Cell[][];

    constructor(cells: number[][]) {
        this.cells = cells.map((row, y) =>
            row.map((value, x) => new Cell(value, [x, y]))
        );
        this.initializeNeighbors();
    }

    get mines(): number {
        return this.cells.flat().filter(cell => cell.value === -1).length;
    }

    get flags(): number {
        return this.cells.flat().filter(cell => cell.state === State.Flagged).length;
    }

    private initializeNeighbors(): void {
        for (let y = 0; y < this.cells.length; y++) {
            for (let x = 0; x < this.cells[y].length; x++) {
                const neighbors = this.getNeighbors(x, y);
                this.cells[y][x].setNeighbors(neighbors);
            }
        }
    }

    private getNeighbors(x: number, y: number): Cell[] {
        const directions = [
            [-1, -1], [-1, 0], [-1, 1],
            [0, -1],          [0, 1],
            [1, -1], [1, 0], [1, 1]
        ];

        const neighbors: Cell[] = [];
        for (const [dx, dy] of directions) {
            const nx = x + dx;
            const ny = y + dy;
            if (nx >= 0 && ny >= 0 && nx < this.cells[0].length && ny < this.cells.length) {
                neighbors.push(this.cells[ny][nx]);
            }
        }
        return neighbors;
    }

    private incrementNeighboringCells(x: number, y: number): void {
        const neighbors = this.getNeighbors(x, y);
        neighbors.forEach(neighbor => {
            if (neighbor.value !== -1) {
                neighbor.value++;
            }
        });
    }

    private isMine(x: number, y: number): boolean {
        return this.cells[y][x].value === -1;
    }

    private placeMine(x: number, y: number): void {
        this.cells[y][x].value = -1;
        this.incrementNeighboringCells(x, y);
    }

    public openCell(x: number, y: number): void {
        const cell = this.cells[y][x];
        if (cell.state === State.Closed) {
            cell.state = State.Open;
        }
    }

    public flagCell(x: number, y: number): void {
        const cell = this.cells[y][x];
        if (cell.state === State.Closed) {
            cell.state = State.Flagged;
        } else if (cell.state === State.Flagged) {
            cell.state = State.Closed;
        }
    }

    public toString(): string {
        return this.cells.map(row => row.map(cell => {
            switch (cell.state) {
                case State.Open:
                    return cell.value.toString();
                case State.Flagged:
                    return 'F';
                case State.Closed:
                    return 'c';
                default:
                    return ' ';
            }
        }).join(' ')).join('\n');
    }

    public static fromString(boardString: string): Board {
        const rows = boardString.trim().split('\n').map(row =>
            row.split(' ').map(cell => {
                if (cell === 'c') return -1; // unopened cell
                if (cell === 'F') return 10; // flagged cell
                return parseInt(cell);
            })
        );
        return new Board(rows);
    }

    public static fromRandomSeed(seed: number, width: number, height: number, mines: number): Board {
        const cells = Array.from({ length: height }, () => Array(width).fill(0));
        let placedMines = 0;

        function random() {
            const x = Math.sin(seed++) * 10000;
            return x - Math.floor(x);
        }

        const board = new Board(cells);

        while (placedMines < mines) {
            const x = Math.floor(random() * width);
            const y = Math.floor(random() * height);
            if (!board.isMine(x, y)) {
                board.placeMine(x, y);
                placedMines++;
            }
        }

        return board;
    }
}
