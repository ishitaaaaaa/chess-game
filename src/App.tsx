import { useState, useEffect } from "react";
import { Chess, type Square } from "chess.js";
import "./App.css";

const boardLetters = ["a", "b", "c", "d", "e", "f", "g", "h"];
const pieceSymbols: Record<string, string> = {
  p: "♟",
  r: "♜",
  n: "♞",
  b: "♝",
  q: "♛",
  k: "♚",
  P: "♙",
  R: "♖",
  N: "♘",
  B: "♗",
  Q: "♕",
  K: "♔",
};

function App() {
  const [chess] = useState(new Chess());
  const [legalMoves, setLegalMoves] = useState<string[]>([]);
  const [game, setGame] = useState<Chess>(new Chess());
  const [board, setBoard] = useState<ReturnType<typeof chess.board>>([]);
  const [selectedSquare, setSelectedSquare] = useState<string | null>(null);
  const [history, setHistory] = useState<string[]>([]);
  const [gameOverMessage, setGameOverMessage] = useState<string | null>(null);

  const updateBoard = () => {
    setBoard(chess.board());
  };

  const handleSquareClick = (square: string) => {
    if (chess.isGameOver()) return;

    const piece = chess.get(square as Square);

    if (!selectedSquare && piece && piece.color === "w") {
      setSelectedSquare(square);
      const moves = chess.moves({ square: square as Square, verbose: true });
      const targets = moves.map((m) => m.to);
      setLegalMoves(targets);
      return;
    }

    if (selectedSquare === square) {
      setSelectedSquare(null);
      setLegalMoves([]);
      return;
    }

    if (piece && piece.color === "w") {
      setSelectedSquare(square);
      const moves = chess.moves({ square: square as Square, verbose: true });
      const targets = moves.map((m) => m.to);
      setLegalMoves(targets);
      return;
    }

    const move = chess.move({
      from: selectedSquare as Square,
      to: square as Square,
      promotion: "q",
    });

    if (move) {
      setSelectedSquare(null);
      setLegalMoves([]);
      const newFen = chess.fen();
      setHistory((prev) => [...prev, chess.fen()]);
      setGame(new Chess(newFen));

      if (chess.isCheckmate()) {
        setGameOverMessage("CONGRATULATIONS! CHECKMATE");
        return;
      } else if (chess.isDraw()) {
        setGameOverMessage("DRAW!");
        return;
      } else if (chess.isStalemate()) {
        setGameOverMessage("Stalemate!");
        return;
      }

      updateBoard();

      setTimeout(() => {
        makeAIMove();
      }, 500);
    } else {
      setSelectedSquare(null);
      setLegalMoves([]);
    }
  };
  // Add inside the App component
  const restartGame = () => {
    const newGame = new Chess();
    chess.reset();
    setGame(newGame);
    setBoard(newGame.board());
    setSelectedSquare(null);
    setLegalMoves([]);
    setHistory([newGame.fen()]);
    setGameOverMessage(null);
  };

  const makeAIMove = () => {
    if (chess.isGameOver()) return;

    const moves = chess.moves();
    if (moves.length > 0) {
      const randomMove = moves[Math.floor(Math.random() * moves.length)];
      chess.move(randomMove);
      setHistory((prev) => [...prev, chess.fen()]);
      updateBoard();

      if (chess.isCheckmate()) {
        setGameOverMessage("Checkmate! You lost.");
      } else if (chess.isDraw()) {
        setGameOverMessage("DRAW!");
      } else if (chess.isStalemate()) {
        setGameOverMessage("Stalemate!");
      }
    }
  };

  const undoMove = () => {
    if (history.length < 3) return;
    const newHistory = [...history];
    newHistory.pop(); // AI move
    newHistory.pop(); // Player move

    const prevFen = newHistory[newHistory.length - 1];
    chess.load(prevFen);
    setGame(new Chess(prevFen));
    setHistory(newHistory);
    updateBoard();
  };

  useEffect(() => {
    updateBoard();
  }, []);

  return (
    <div className="app">
      <h1>Chess Game</h1>
      <div className="board">
        {board.map((row, rowIndex) =>
          row.map((square, colIndex) => {
            const squareColor =
              (rowIndex + colIndex) % 2 === 0 ? "light" : "dark";

            const position = boardLetters[colIndex] + (8 - rowIndex); // ✅ correct mapping
            const piece = square
              ? pieceSymbols[
                  square.color === "w" ? square.type.toUpperCase() : square.type
                ]
              : "";

            const isSelected = selectedSquare === position;
            const isLegalMove = legalMoves.includes(position);

            return (
              <div
                key={position}
                className={`square ${squareColor} ${
                  isSelected ? "selected" : ""
                } ${isLegalMove ? "legal-move" : ""}`}
                onClick={() => handleSquareClick(position)}
              >
                {piece}
              </div>
            );
          })
        )}
      </div>
<div style={{ marginTop: "1rem", display: "flex", gap: "1rem" }}>
  <button
    onClick={undoMove}
    style={{
      padding: "0.6rem 1.2rem",
      background: "#666",
      color: "white",
      border: "none",
      borderRadius: "4px",
      cursor: "pointer",
      fontWeight: "bold",
    }}
  >
    Undo Move
  </button>

  <button
    onClick={restartGame}
    style={{
      padding: "0.6rem 1.2rem",
      background: "#666",
      color: "white",
      border: "none",
      borderRadius: "4px",
      cursor: "pointer",
      fontWeight: "bold",
    }}
  >
    Restart Game
  </button>
</div>

      {gameOverMessage && (
        <div
          style={{
            marginTop: "1rem",
            fontSize: "1.2rem",
            fontWeight: "bold",
            color: "darkred",
          }}
        >
          {gameOverMessage}
        </div>
      )}
    </div>
  );
}

export default App;
