export interface Cell {
    letter: string;
    number?: number;
    isBlack: boolean;
}

export interface Word {
    word: string;
    hint: string;
    direction: 'across' | 'down';
    startX: number;
    startY: number;
    number: number;
}

export interface CrosswordPuzzle {
    grid: Cell[][];
    words: Word[];
    difficulty: string;
    ageGroup: string;
}

export interface PuzzleConfig {
    difficulty: string;
    ageGroup: string;
    knowledgeLevel: string;
    gridSize: number;
}
