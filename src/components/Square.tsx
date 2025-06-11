import React from 'react';

interface SquareProps {
  color: 'light' | 'dark';
  squareId: string;
}

const Square: React.FC<SquareProps> = ({ color, squareId }) => {
  const bgColor = color === 'light' ? '#f0d9b5' : '#b58863';

  return (
    <div
      style={{
        backgroundColor: bgColor,
        width: '60px',
        height: '60px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '18px',
        fontFamily: 'monospace',
      }}
    >
      {/* Just for testing: show square id like a1, b3 */}
      <span style={{ opacity: 0.3 }}>{squareId}</span>
    </div>
  );
};

export default Square;
