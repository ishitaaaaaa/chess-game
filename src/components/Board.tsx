import React from 'react';
import Square from './Square';


const Board: React.FC = () => {
  const boardSquares = [];

  // 8 rows × 8 columns = 64 squares
  for (let row = 7; row >= 0; row--) {
    for (let col = 0; col < 8; col++) {
      const isLight = (row + col) % 2 === 0;
      const squareColor = isLight ? 'light' : 'dark';

      // Chess board is labeled from 'a1' to 'h8'
      const file = String.fromCharCode(97 + col); // 'a' = 97
      const squareId = file + (row + 1); // 'a1', 'b3', etc.

      boardSquares.push(
        <Square key={squareId} color={squareColor} squareId={squareId} />
      );
    }
  }

  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(8, 60px)',
        gridTemplateRows: 'repeat(8, 60px)',
        border: '2px solid black',
      }}
    >
      {boardSquares}
    </div>
  );
};

export default Board;
