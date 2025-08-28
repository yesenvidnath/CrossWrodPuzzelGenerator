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
      const newPuzzles = await generator.generatePuzzles();
      setPuzzles(newPuzzles);
    } catch (err) {
      setError('Failed to generate puzzles. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="app-container">
      <h1>Crossword Puzzle Generator</h1>
      
      <div className="button-container">
        <button 
          className="generate-button"
          onClick={handleGeneratePuzzles}
          disabled={loading}
        >
          {loading ? 'Generating...' : 'Generate Puzzles'}
        </button>
      </div>

      {error && (
        <div className="error-message">
          {error}
        </div>
      )}

      <div className="puzzles-grid">
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