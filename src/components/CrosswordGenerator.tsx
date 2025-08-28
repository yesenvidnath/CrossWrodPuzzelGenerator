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

  async generatePuzzles(): Promise<CrosswordData[]> {
    const model = this.genAI.getGenerativeModel({
      model: "gemini-1.5-flash" // Updated to use a current model
    });

    const prompt = `Create 2 different crossword puzzles. Each puzzle should be a 5x5 grid.
    Rules:
    - Words must interlock
    - Use common English words
    - Black squares can be used to separate words
    - Number the squares according to crossword conventions
    
    Return ONLY a valid JSON array with exactly 2 puzzle objects. Each puzzle should have this exact format:
    [
      {
        "grid": [
          [{"letter": "A", "number": 1, "isBlack": false}, {"letter": "B", "isBlack": false}, ...],
          [{"letter": "C", "isBlack": false}, {"letter": "D", "number": 2, "isBlack": false}, ...],
          ...
        ],
        "clues": {
          "across": {"1": "clue for 1 across", "3": "clue for 3 across"},
          "down": {"1": "clue for 1 down", "2": "clue for 2 down"}
        }
      },
      {
        "grid": [
          [{"letter": "E", "number": 1, "isBlack": false}, {"letter": "F", "isBlack": false}, ...],
          ...
        ],
        "clues": {
          "across": {"1": "clue for 1 across"},
          "down": {"1": "clue for 1 down"}
        }
      }
    ]
    
    Important: Return ONLY the JSON array, no additional text or markdown formatting.`;

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
      
      // Fallback: return a sample puzzle if API fails
      return this.getSamplePuzzles();
    }
  }

  private getSamplePuzzles(): CrosswordData[] {
    return [
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
      }
    ];
  }
}