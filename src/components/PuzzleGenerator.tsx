import { useState } from 'react';
import { TextField, Button, MenuItem, Paper, Typography, Box, Stack } from '@mui/material';
import { type CrosswordPuzzle, type PuzzleConfig } from '../types/types';
import { generateCrossword } from '../utils/crosswordGenerator';
import { PDFDownloadLink } from '@react-pdf/renderer';
import CrosswordPDF from './CrosswordPDF';

interface CrosswordGridProps {
    puzzle: CrosswordPuzzle;
}

const CrosswordGrid: React.FC<CrosswordGridProps> = ({ puzzle }) => {
    return (
        <Paper elevation={3} sx={{ p: 2, mb: 3 }}>
            <Typography variant="h6" gutterBottom>
                Puzzle ({puzzle.difficulty} - {puzzle.ageGroup})
            </Typography>
            <Box sx={{ 
                display: 'grid',
                gridTemplateColumns: `repeat(${puzzle.grid[0]?.length || 0}, minmax(25px, 35px))`,
                gridTemplateRows: `repeat(${puzzle.grid.length}, minmax(25px, 35px))`,
                gap: 0,
                width: 'fit-content',
                mb: 2,
                border: '2px solid #333',
                overflow: 'hidden',
                maxWidth: '100%'
            }}>
                {puzzle.grid.map((row, i) =>
                    row.map((cell, j) => (
                        <Box
                            key={`${i}-${j}`}
                            sx={{
                                width: 'auto',
                                height: 'auto',
                                aspectRatio: '1/1',
                                border: '1px solid #666',
                                display: 'flex',
                                justifyContent: 'center',
                                alignItems: 'center',
                                backgroundColor: cell.isBlack ? '#333' : 'white',
                                fontSize: '14px',
                                fontWeight: 'bold',
                                position: 'relative',
                            }}
                        >
                            {cell.number && (
                                <Typography
                                    variant="caption"
                                    sx={{
                                        position: 'absolute',
                                        top: '1px',
                                        left: '1px',
                                        fontSize: '10px',
                                    }}
                                >
                                    {cell.number}
                                </Typography>
                            )}
                            {!cell.isBlack && cell.letter !== ' ' && (
                                <Typography variant="caption">{cell.letter}</Typography>
                            )}
                        </Box>
                    ))
                )}
            </Box>
            <Stack direction="row" spacing={2}>
                <Box flex={1}>
                    <Typography variant="subtitle1" gutterBottom>
                        Across:
                    </Typography>
                    {puzzle.words
                        .filter((word) => word.direction === 'across')
                        .map((word) => (
                            <Typography key={`${word.startX}-${word.startY}`} variant="body2">
                                {word.number}. {word.hint}
                            </Typography>
                        ))}
                </Box>
                <Box flex={1}>
                    <Typography variant="subtitle1" gutterBottom>
                        Down:
                    </Typography>
                    {puzzle.words
                        .filter((word) => word.direction === 'down')
                        .map((word) => (
                            <Typography key={`${word.startX}-${word.startY}`} variant="body2">
                                {word.number}. {word.hint}
                            </Typography>
                        ))}
                </Box>
            </Stack>
        </Paper>
    );
};

const PuzzleGenerator: React.FC = () => {
    const [config, setConfig] = useState<PuzzleConfig>({
        difficulty: 'beginner',
        ageGroup: 'children',
        knowledgeLevel: 'basic',
        gridSize: 15,
    });

    const [puzzles, setPuzzles] = useState<CrosswordPuzzle[]>([]);
    const [numPuzzles, setNumPuzzles] = useState<number>(12);

    const handleGenerate = () => {
        const newPuzzles = Array(numPuzzles)
            .fill(null)
            .map(() => generateCrossword(config));
        setPuzzles(newPuzzles);
    };

    return (
        <Stack spacing={3}>
            <Paper elevation={3} sx={{ p: 3, backgroundColor: '#f5f5f5' }}>
                <Typography variant="h6" gutterBottom color="primary">
                    Instructions
                </Typography>
                <Typography variant="body2" paragraph>
                    1. Select the difficulty level, age group, and knowledge level for your puzzles.
                </Typography>
                <Typography variant="body2" paragraph>
                    2. Choose your preferred grid size - larger grids allow for more and longer words.
                </Typography>
                <Typography variant="body2" paragraph>
                    3. Specify how many puzzles you want to generate (1-24).
                </Typography>
                <Typography variant="body2" paragraph>
                    4. Click "Generate" to create your puzzles. Each puzzle will have unique words and layout.
                </Typography>
                <Typography variant="body2">
                    5. Use the "Download PDF" button to save your puzzles for printing or sharing.
                </Typography>
            </Paper>
            <Box>
                <Paper elevation={3} sx={{ p: 3 }}>
                    <Stack spacing={2}>
                        <Stack spacing={2}>
                            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                                <TextField
                                    select
                                    fullWidth
                                    label="Difficulty"
                                    value={config.difficulty}
                                    onChange={(e) =>
                                        setConfig({ ...config, difficulty: e.target.value })
                                    }
                                >
                                    <MenuItem value="beginner">Beginner</MenuItem>
                                    <MenuItem value="intermediate">Intermediate</MenuItem>
                                    <MenuItem value="advanced">Advanced</MenuItem>
                                </TextField>
                                <TextField
                                    select
                                    fullWidth
                                    label="Age Group"
                                    value={config.ageGroup}
                                    onChange={(e) =>
                                        setConfig({ ...config, ageGroup: e.target.value })
                                    }
                                >
                                    <MenuItem value="children">Children</MenuItem>
                                    <MenuItem value="teen">Teen</MenuItem>
                                </TextField>
                                <TextField
                                    select
                                    fullWidth
                                    label="Knowledge Level"
                                    value={config.knowledgeLevel}
                                    onChange={(e) =>
                                        setConfig({ ...config, knowledgeLevel: e.target.value })
                                    }
                                >
                                    <MenuItem value="basic">Basic</MenuItem>
                                    <MenuItem value="intermediate">Intermediate</MenuItem>
                                    <MenuItem value="advanced">Advanced</MenuItem>
                                </TextField>
                            </Stack>
                            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                                <TextField
                                    select
                                    fullWidth
                                    label="Grid Size"
                                    value={config.gridSize}
                                    onChange={(e) =>
                                        setConfig({ ...config, gridSize: Number(e.target.value) })
                                    }
                                >
                                    <MenuItem value={10}>10 x 10</MenuItem>
                                    <MenuItem value={12}>12 x 12</MenuItem>
                                    <MenuItem value={15}>15 x 15</MenuItem>
                                    <MenuItem value={20}>20 x 20</MenuItem>
                                </TextField>
                                <TextField
                                    type="number"
                                    fullWidth
                                    label="Number of Puzzles"
                                    value={numPuzzles}
                                    onChange={(e) => setNumPuzzles(Math.max(1, Math.min(24, Number(e.target.value))))}
                                    inputProps={{ min: 1, max: 24 }}
                                />
                            </Stack>
                        </Stack>
                        <Button
                            variant="contained"
                            color="primary"
                            onClick={handleGenerate}
                            fullWidth
                        >
                            Generate {numPuzzles} Puzzles
                        </Button>
                        {puzzles.length > 0 && (
                            <PDFDownloadLink
                                document={<CrosswordPDF puzzles={puzzles} />}
                                fileName="crossword-puzzles.pdf"
                            >
                                {({ loading }) => (
                                    <Button
                                        variant="contained"
                                        color="secondary"
                                        fullWidth
                                        disabled={loading}
                                    >
                                        {loading ? 'Preparing PDF...' : 'Download PDF'}
                                    </Button>
                                )}
                            </PDFDownloadLink>
                        )}
                    </Stack>
                </Paper>
            </Box>
            <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr', lg: '1fr 1fr 1fr' }, gap: 2 }}>
                {puzzles.map((puzzle, index) => (
                    <CrosswordGrid key={index} puzzle={puzzle} />
                ))}
            </Box>
        </Stack>
    );
};

export default PuzzleGenerator;