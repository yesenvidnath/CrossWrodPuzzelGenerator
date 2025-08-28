import { useState } from 'react'
import './App.css'
import { CrosswordGenerator } from './components/CrosswordGenerator'
import CrosswordPuzzle from './components/CrosswordPuzzle'
import './components/CrosswordPuzzle.css'

interface CrosswordData {
  grid: {
    letter: string;
    number?: number;
    isBlack?: boolean;
  }[][];
  clues: {
    across: { [key: string]: string };
    down: { [key: string]: string };
  };
}

function App() {
  const [puzzles, setPuzzles] = useState<CrosswordData[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // User settings
  const [gridSize, setGridSize] = useState<number>(5);
  const [difficulty, setDifficulty] = useState<string>('medium');
  const [puzzleCount, setPuzzleCount] = useState<number>(2);

  const handleGeneratePuzzles = async () => {
    const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
    
    if (!apiKey) {
      setError('Please set the VITE_GEMINI_API_KEY environment variable');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const generator = new CrosswordGenerator(apiKey);
      const newPuzzles = await generator.generatePuzzles(gridSize, difficulty, puzzleCount);
      setPuzzles(newPuzzles);
    } catch (err) {
      setError('Failed to generate puzzles. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const getGridClass = () => {
    if (puzzleCount === 1) return 'puzzles-grid-single';
    if (puzzleCount === 2) return 'puzzles-grid-double';
    if (puzzleCount <= 4) return 'puzzles-grid-quad';
    return 'puzzles-grid-multi';
  };

  return (
    <div className="app-container">
      <h1>Crossword Puzzle Generator</h1>
      
      <div className="controls-container">
        <div className="control-group">
          <label htmlFor="gridSize">Grid Size:</label>
          <select 
            id="gridSize" 
            value={gridSize} 
            onChange={(e) => setGridSize(Number(e.target.value))}
            className="control-select"
          >
            <option value={5}>5x5</option>
            <option value={7}>7x7</option>
            <option value={9}>9x9</option>
            <option value={11}>11x11</option>
            <option value={13}>13x13</option>
            <option value={15}>15x15</option>
          </select>
        </div>

        <div className="control-group">
          <label htmlFor="difficulty">Difficulty:</label>
          <select 
            id="difficulty" 
            value={difficulty} 
            onChange={(e) => setDifficulty(e.target.value)}
            className="control-select"
          >
            <option value="easy">Easy</option>
            <option value="medium">Medium</option>
            <option value="hard">Hard</option>
            <option value="expert">Expert</option>
          </select>
        </div>

        <div className="control-group">
          <label htmlFor="puzzleCount">Number of Puzzles:</label>
          <select 
            id="puzzleCount" 
            value={puzzleCount} 
            onChange={(e) => setPuzzleCount(Number(e.target.value))}
            className="control-select"
          >
            <option value={1}>1 Puzzle</option>
            <option value={2}>2 Puzzles</option>
            <option value={3}>3 Puzzles</option>
            <option value={4}>4 Puzzles</option>
            <option value={6}>6 Puzzles</option>
            <option value={8}>8 Puzzles</option>
          </select>
        </div>
      </div>
      
      <div className="button-container">
        <button 
          className="generate-button"
          onClick={handleGeneratePuzzles}
          disabled={loading}
        >
          {loading ? 'Generating...' : `Generate ${puzzleCount} Puzzle${puzzleCount > 1 ? 's' : ''}`}
        </button>
      </div>

      {error && (
        <div className="error-message">
          {error}
        </div>
      )}

      <div className={`puzzles-grid ${getGridClass()}`}>
        {puzzles.map((puzzle, index) => (
          <div key={index} className="puzzle-column">
            <h2>Puzzle {index + 1}</h2>
            <CrosswordPuzzle
              grid={puzzle.grid}
              clues={puzzle.clues}
            />
          </div>
        ))}
      </div>
    </div>
  )
}

export default App