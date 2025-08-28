import React, { useState, useEffect } from 'react';

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
  const [userGrid, setUserGrid] = useState<string[][]>([]);
  
  // Initialize empty user grid
  useEffect(() => {
    const emptyGrid = grid.map(row => 
      row.map(cell => cell.isBlack ? '' : '')
    );
    setUserGrid(emptyGrid);
  }, [grid]);

  const handleCellChange = (rowIndex: number, colIndex: number, value: string) => {
    if (grid[rowIndex][colIndex].isBlack) return;
    
    const newGrid = [...userGrid];
    newGrid[rowIndex] = [...newGrid[rowIndex]];
    newGrid[rowIndex][colIndex] = value.toUpperCase().slice(-1); // Only last character, uppercase
    setUserGrid(newGrid);
  };

  return (
    <div className="crossword-container">
      <div className="crossword-grid">
        {grid.map((row, rowIndex) => (
          <div key={rowIndex} className="crossword-row">
            {row.map((cell, colIndex) => (
              <div
                key={`${rowIndex}-${colIndex}`}
                className={`crossword-cell ${cell.isBlack ? 'black' : 'white'}`}
              >
                {cell.number && (
                  <span className="cell-number">{cell.number}</span>
                )}
                {!cell.isBlack && (
                  <input
                    type="text"
                    className="cell-input"
                    value={userGrid[rowIndex]?.[colIndex] || ''}
                    onChange={(e) => handleCellChange(rowIndex, colIndex, e.target.value)}
                    maxLength={1}
                  />
                )}
              </div>
            ))}
          </div>
        ))}
      </div>
      
      <div className="clues-container">
        <div className="clues-section">
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
    </div>
  );
};

export default CrosswordPuzzle;