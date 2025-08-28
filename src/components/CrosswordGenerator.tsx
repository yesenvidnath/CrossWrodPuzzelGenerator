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

    const prompt = `Create 2 different crossword puzzles. Each puzzle should be a 5x5 grid with proper crossword structure.
    
    Rules:
    - Words must interlock properly
    - Use common English words (3-5 letters)
    - Include black squares (isBlack: true) to separate words
    - Number only the starting squares of words
    - Each word should have at least 3 letters
    - Ensure words intersect correctly
    
    Return ONLY a valid JSON array with exactly 2 puzzle objects. Each puzzle should have this exact format:
    [
      {
        "grid": [
          [{"letter": "C", "number": 1, "isBlack": false}, {"letter": "A", "isBlack": false}, {"letter": "T", "isBlack": false}, {"letter": "", "isBlack": true}, {"letter": "D", "number": 2, "isBlack": false}],
          [{"letter": "A", "isBlack": false}, {"letter": "", "isBlack": true}, {"letter": "O", "isBlack": false}, {"letter": "", "isBlack": true}, {"letter": "O", "isBlack": false}],
          [{"letter": "R", "number": 3, "isBlack": false}, {"letter": "U", "isBlack": false}, {"letter": "N", "isBlack": false}, {"letter": "", "isBlack": true}, {"letter": "G", "isBlack": false}],
          [{"letter": "", "isBlack": true}, {"letter": "N", "isBlack": false}, {"letter": "", "isBlack": true}, {"letter": "", "isBlack": true}, {"letter": "", "isBlack": true}],
          [{"letter": "S", "number": 4, "isBlack": false}, {"letter": "U", "isBlack": false}, {"letter": "N", "isBlack": false}, {"letter": "", "isBlack": true}, {"letter": "", "isBlack": true}]
        ],
        "clues": {
          "across": {"1": "Feline pet", "3": "Move quickly", "4": "Bright star"},
          "down": {"1": "Vehicle", "2": "Canine pet"}
        }
      },
      ...
    ]
    
    Important: 
    - Use empty string "" for letter in black squares
    - Only add numbers to squares that start a word
    - Make sure intersecting letters match
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
  }
}