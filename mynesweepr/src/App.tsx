import React from "react";
import "./App.css";
import MinesweeperGame from "./game/MinesweeperGame";
import Footer from "./components/Footer";
import GlobalStyle from "./globalStyles";

const App: React.FC = () => {
  return (
    <>
      <GlobalStyle />
      <div className="App">
        <h1>Minesweeper Game</h1>
        <MinesweeperGame />
        <Footer />
      </div>
    </>
  );
};

export default App;
