import { GoogleGenerativeAI } from '@google/generative-ai';

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

export class CrosswordGenerator {
  private genAI: GoogleGenerativeAI;

  constructor(apiKey: string) {
    this.genAI = new GoogleGenerativeAI(apiKey);
  }

  async generatePuzzles(gridSize: number = 5, difficulty: string = 'medium', puzzleCount: number = 2): Promise<CrosswordData[]> {
    const model = this.genAI.getGenerativeModel({
      model: "gemini-1.5-flash" // Updated to use a current model
    });

    const difficultyInstructions = {
      easy: "Use simple, common words (3-5 letters). Basic vocabulary that everyone knows.",
      medium: "Use moderately challenging words (4-7 letters). Mix of common and slightly advanced vocabulary.",
      hard: "Use challenging words (5-9 letters). Include some advanced vocabulary and proper nouns.",
      expert: "Use very challenging words (6-12 letters). Advanced vocabulary, technical terms, and obscure words."
    };

    const prompt = `Create ${puzzleCount} different crossword puzzles. Each puzzle should be a ${gridSize}x${gridSize} grid with proper crossword structure.
    
    Difficulty Level: ${difficulty.toUpperCase()}
    ${difficultyInstructions[difficulty as keyof typeof difficultyInstructions]}
    
    Rules:
    - Words must interlock properly at intersecting letters
    - Use black squares (isBlack: true) to separate words strategically
    - Number only the starting squares of words (both across and down)
    - Each word should have at least 3 letters
    - Ensure intersecting letters match exactly
    - Create a balanced, solvable puzzle
    - For larger grids, include more interconnected words
    
    Return ONLY a valid JSON array with exactly ${puzzleCount} puzzle objects. Each puzzle should have this exact format:
    [
      {
        "grid": [
          [{"letter": "C", "number": 1, "isBlack": false}, {"letter": "A", "isBlack": false}, {"letter": "T", "isBlack": false}, {"letter": "", "isBlack": true}, {"letter": "D", "number": 2, "isBlack": false}],
          [{"letter": "A", "isBlack": false}, {"letter": "", "isBlack": true}, {"letter": "O", "isBlack": false}, {"letter": "", "isBlack": true}, {"letter": "O", "isBlack": false}],
          ...
        ],
        "clues": {
          "across": {"1": "clue for 1 across", "3": "clue for 3 across"},
          "down": {"1": "clue for 1 down", "2": "clue for 2 down"}
        }
      },
      ...
    ]
    
    Important: 
    - Grid must be exactly ${gridSize}x${gridSize}
    - Use empty string "" for letter in black squares
    - Only add numbers to squares that start a word
    - Make sure intersecting letters match perfectly
    - Clues should match the difficulty level
    - Return ONLY the JSON array, no additional text or markdown formatting.`;

    try {
      const result = await model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();
      
      // Clean up the response text to ensure it's valid JSON
      const cleanText = text.trim().replace(/```json\n?/g, '').replace(/```\n?/g, '');
      
      console.log('Raw response:', cleanText); // For debugging
      
      const puzzles = JSON.parse(cleanText);
      return Array.isArray(puzzles) ? puzzles : [puzzles];
    } catch (error) {
      console.error('Error generating crossword puzzles:', error);
      
      // Fallback: return sample puzzles if API fails
      return this.getSamplePuzzles(gridSize, puzzleCount);
    }
  }

  private getSamplePuzzles(gridSize: number = 5, puzzleCount: number = 2): CrosswordData[] {
    const samplePuzzles: CrosswordData[] = [
      {
        grid: [
          [
            { letter: "C", number: 1, isBlack: false },
            { letter: "A", isBlack: false },
            { letter: "T", isBlack: false },
            { letter: "", isBlack: true },
            { letter: "D", number: 2, isBlack: false }
          ],
          [
            { letter: "A", isBlack: false },
            { letter: "", isBlack: true },
            { letter: "O", isBlack: false },
            { letter: "", isBlack: true },
            { letter: "O", isBlack: false }
          ],
          [
            { letter: "R", number: 3, isBlack: false },
            { letter: "U", isBlack: false },
            { letter: "N", isBlack: false },
            { letter: "", isBlack: true },
            { letter: "G", isBlack: false }
          ],
          [
            { letter: "", isBlack: true },
            { letter: "N", isBlack: false },
            { letter: "", isBlack: true },
            { letter: "", isBlack: true },
            { letter: "", isBlack: true }
          ],
          [
            { letter: "S", number: 4, isBlack: false },
            { letter: "U", isBlack: false },
            { letter: "N", isBlack: false },
            { letter: "", isBlack: true },
            { letter: "", isBlack: true }
          ]
        ],
        clues: {
          across: {
            "1": "Feline pet",
            "3": "Move quickly on foot",
            "4": "Bright star in our solar system"
          },
          down: {
            "1": "Vehicle for transportation",
            "2": "Canine pet"
          }
        }
      },
      {
        grid: [
          [
            { letter: "B", number: 1, isBlack: false },
            { letter: "A", isBlack: false },
            { letter: "T", isBlack: false },
            { letter: "", isBlack: true },
            { letter: "E", number: 2, isBlack: false }
          ],
          [
            { letter: "I", isBlack: false },
            { letter: "", isBlack: true },
            { letter: "R", isBlack: false },
            { letter: "", isBlack: true },
            { letter: "A", isBlack: false }
          ],
          [
            { letter: "G", number: 3, isBlack: false },
            { letter: "O", isBlack: false },
            { letter: "T", isBlack: false },
            { letter: "", isBlack: true },
            { letter: "T", isBlack: false }
          ],
          [
            { letter: "", isBlack: true },
            { letter: "W", isBlack: false },
            { letter: "", isBlack: true },
            { letter: "", isBlack: true },
            { letter: "", isBlack: true }
          ],
          [
            { letter: "N", number: 4, isBlack: false },
            { letter: "E", isBlack: false },
            { letter: "T", isBlack: false },
            { letter: "", isBlack: true },
            { letter: "", isBlack: true }
          ]
        ],
        clues: {
          across: {
            "1": "Flying mammal",
            "3": "Past tense of get",
            "4": "Fishing equipment"
          },
          down: {
            "1": "Large in size",
            "2": "To consume food"
          }
        }
      }
    ];

    // Return the requested number of puzzles (cycling through if needed)
    const result = [];
    for (let i = 0; i < puzzleCount; i++) {
      result.push(samplePuzzles[i % samplePuzzles.length]);
    }
    
    return result;
  }
}