interface Board {
    cells: string[][];
}

function serializeBoard(board: Board): string[] {
    return board.cells.map(row => row.join(''));
}

function unserializeBoard(serializedBoard: string[]): Board {
    const cells: string[][] = serializedBoard.map(row => row.split(''));
    return { cells };
}

const BoardUtils = {
    serializeBoard,
    unserializeBoard
};

export default BoardUtils;

// Example usage
const exampleBoard: Board = {
    cells: [
        ['1', '□'],
        ['F', '2']
    ]
};

// Serialize the board
const serializedBoard = BoardUtils.serializeBoard(exampleBoard);
console.log('Serialized Board:', serializedBoard);

// Unserialize the board
const unserializedBoard = BoardUtils.unserializeBoard(serializedBoard);
console.log('Unserialized Board:', unserializedBoard);