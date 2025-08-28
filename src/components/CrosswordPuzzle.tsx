import React from 'react';

interface CrosswordCell {
  letter: string;
  number?: number;
  isBlack?: boolean;
}

interface CrosswordPuzzleProps {
  grid: CrosswordCell[][];
  clues: {
    across: { [key: string]: string };
    down: { [key: string]: string };
  };
}

const CrosswordPuzzle: React.FC<CrosswordPuzzleProps> = ({ grid, clues }) => {
  return (
    <div className="crossword-container">
      <div className="crossword-grid">
        {grid.map((row, rowIndex) => (
          <div key={rowIndex} className="crossword-row">
            {row.map((cell, colIndex) => (
              <div
                key={`${rowIndex}-${colIndex}`}
                className={`crossword-cell ${cell.isBlack ? 'black' : ''}`}
              >
                {cell.number && <span className="cell-number">{cell.number}</span>}
                {!cell.isBlack && <span className="cell-letter">{cell.letter}</span>}
              </div>
            ))}
          </div>
        ))}
      </div>
      <div className="clues-container">
        <div className="across-clues">
          <h3>Across</h3>
          {Object.entries(clues.across).map(([number, clue]) => (
            <div key={`across-${number}`} className="clue">
              <span className="clue-number">{number}.</span> {clue}
            </div>
          ))}
        </div>
        <div className="down-clues">
          <h3>Down</h3>
          {Object.entries(clues.down).map(([number, clue]) => (
            <div key={`down-${number}`} className="clue">
              <span className="clue-number">{number}.</span> {clue}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CrosswordPuzzle;
