import React from "react";
import "./App.css";
import MinesweeperGame from "./components/MinesweeperGame";
import Footer from "./components/Footer";

const App: React.FC = () => {
  return (
    <div className="App">
      <h1>Minesweeper Game</h1>
      <MinesweeperGame />
      <Footer />
    </div>
  );
};

export default App;
