import React from 'react';
import './App.css';
import MinesweeperGame from './components/MinesweeperGame';

const App: React.FC = () => {
    return (
        <div className="App">
            <h1>Minesweeper Game</h1>
            <MinesweeperGame />
        </div>
    );
};

export default App;
