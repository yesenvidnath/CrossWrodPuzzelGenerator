import type { Word, CrosswordPuzzle, PuzzleConfig, Cell } from '../types/types';
import { wordBank } from './wordList';

const GRID_SIZE = 15;

// Create a symmetrical pattern of black squares
const initializeGrid = (): Cell[][] => {
    const grid: Cell[][] = Array(GRID_SIZE)
        .fill(null)
        .map(() => Array(GRID_SIZE).fill(null).map(() => ({ letter: ' ', isBlack: false })));

    // Add symmetrical black squares pattern
    const blackSquares = [
        [0, 4], [0, 10], [4, 0], [4, 14], [10, 0], [10, 14], [14, 4], [14, 10],
        [2, 6], [2, 8], [6, 2], [6, 12], [8, 2], [8, 12], [12, 6], [12, 8],
    ];

    blackSquares.forEach(([y, x]) => {
        grid[y][x].isBlack = true;
        // Add symmetric black square
        grid[GRID_SIZE - 1 - y][GRID_SIZE - 1 - x].isBlack = true;
    });

    return grid;
};

const canPlaceWord = (
    grid: Cell[][],
    word: string,
    x: number,
    y: number,
    direction: 'across' | 'down'
): boolean => {
    if (!word || word.length === 0) return false;
    if (x < 0 || y < 0) return false;
    if (direction === 'across' && x + word.length > GRID_SIZE) return false;
    if (direction === 'down' && y + word.length > GRID_SIZE) return false;
    
    // Check if the starting position is valid
    if (y >= grid.length || x >= grid[0].length) return false;
    
    // Check if starting position is next to a black square
    if (direction === 'across') {
        if (x > 0 && !grid[y][x-1].isBlack) return false;
        if (x + word.length < GRID_SIZE && !grid[y][x + word.length].isBlack) return false;
    } else {
        if (y > 0 && !grid[y-1][x].isBlack) return false;
        if (y + word.length < GRID_SIZE && !grid[y + word.length][x].isBlack) return false;
    }

    // Check if all cells in the word's path are available or match
    for (let i = 0; i < word.length; i++) {
        const currX = direction === 'across' ? x + i : x;
        const currY = direction === 'down' ? y + i : y;
        
        if (grid[currY][currX].isBlack) return false;
        if (grid[currY][currX].letter !== ' ' && grid[currY][currX].letter !== word[i]) {
            return false;
        }
    }

    return true;
};

const placeWord = (
    grid: Cell[][],
    word: string,
    x: number,
    y: number,
    direction: 'across' | 'down'
): void => {
    for (let i = 0; i < word.length; i++) {
        const currX = direction === 'across' ? x + i : x;
        const currY = direction === 'down' ? y + i : y;
        grid[currY][currX].letter = word[i];
    }
};

const isWordStart = (grid: Cell[][], x: number, y: number, direction: 'across' | 'down'): boolean => {
    // For across words, check if we have a black square or grid edge to the left
    if (direction === 'across') {
        return x === 0 || grid[y][x - 1].isBlack;
    }
    // For down words, check if we have a black square or grid edge above
    return y === 0 || grid[y - 1][x].isBlack;
};

const numberGrid = (grid: Cell[][]): void => {
    let currentNumber = 1;
    
    for (let y = 0; y < GRID_SIZE; y++) {
        for (let x = 0; x < GRID_SIZE; x++) {
            if (!grid[y][x].isBlack) {
                const isAcrossStart = isWordStart(grid, x, y, 'across');
                const isDownStart = isWordStart(grid, x, y, 'down');
                
                if (isAcrossStart || isDownStart) {
                    grid[y][x].number = currentNumber++;
                }
            }
        }
    }
};

export const generateCrossword = (config: PuzzleConfig): CrosswordPuzzle => {
    const grid = initializeGrid();
    const words: Word[] = [];
    const usedWords = new Set<string>();

    // Select words based on difficulty and age group
    const availableWords = wordBank[config.difficulty.toLowerCase()]?.[config.ageGroup.toLowerCase()];
    if (!availableWords || !availableWords.length) {
        return {
            grid,
            words: [],
            difficulty: config.difficulty,
            ageGroup: config.ageGroup,
        };
    }
    
    const shuffledWords = [...availableWords].sort(() => Math.random() - 0.5);
    let wordNumber = 1;

    for (const wordArray of shuffledWords) {
        const [word, hint] = wordArray;
        if (!word || !hint || usedWords.has(word)) continue;

        const directions: ('across' | 'down')[] = Math.random() > 0.5 ? ['across', 'down'] : ['down', 'across'];

        for (const direction of directions) {
            let placed = false;
            for (let y = 0; y < GRID_SIZE && !placed; y++) {
                for (let x = 0; x < GRID_SIZE && !placed; x++) {
                    if (canPlaceWord(grid, word, x, y, direction)) {
                        placeWord(grid, word, x, y, direction);
                        if (isWordStart(grid, x, y, direction)) {
                            words.push({
                                word,
                                hint,
                                direction,
                                startX: x,
                                startY: y,
                                number: wordNumber++
                            });
                            usedWords.add(word);
                            placed = true;
                        }
                    }
                }
            }
            if (placed) break;
        }
    }

    // Number all word starts in the grid
    numberGrid(grid);

    return {
        grid,
        words: words.sort((a, b) => a.number - b.number),
        difficulty: config.difficulty,
        ageGroup: config.ageGroup,
    };
};
