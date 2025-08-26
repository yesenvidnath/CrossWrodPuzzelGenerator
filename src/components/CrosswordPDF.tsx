import { Document, Page, View, Text, StyleSheet } from '@react-pdf/renderer';
import { type CrosswordPuzzle } from '../types/types';

const styles = StyleSheet.create({
    page: {
        padding: 30,
    },
    puzzleContainer: {
        marginBottom: 30,
    },
    title: {
        fontSize: 16,
        marginBottom: 10,
        textAlign: 'center',
    },
    grid: {
        display: 'flex',
        flexDirection: 'row',
        flexWrap: 'wrap',
        marginBottom: 20,
    },
    cell: {
        width: 20,
        height: 20,
        border: '1px solid black',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        position: 'relative',
    },
    blackCell: {
        backgroundColor: 'black',
    },
    cellNumber: {
        position: 'absolute',
        top: 1,
        left: 1,
        fontSize: 6,
    },
    clueList: {
        marginBottom: 10,
    },
    clueSection: {
        marginBottom: 10,
    },
    clueTitle: {
        fontSize: 12,
        fontWeight: 'bold',
        marginBottom: 5,
    },
    clue: {
        fontSize: 10,
        marginBottom: 3,
    },
});

const CrosswordPDF = ({ puzzles }: { puzzles: CrosswordPuzzle[] }) => (
    <Document>
        <Page size="A4" style={styles.page}>
            {puzzles.map((puzzle, index) => (
                <View key={index} style={styles.puzzleContainer}>
                    <Text style={styles.title}>
                        Crossword Puzzle #{index + 1} ({puzzle.difficulty} - {puzzle.ageGroup})
                    </Text>
                    
                    <View style={styles.grid}>
                        {puzzle.grid.map((row, i) =>
                            row.map((cell, j) => (
                                <View key={`${i}-${j}`} style={cell.isBlack ? {...styles.cell, ...styles.blackCell} : styles.cell}>
                                    {cell.number && <Text style={styles.cellNumber}>{cell.number}</Text>}
                                    <Text>{!cell.isBlack ? cell.letter !== ' ' ? cell.letter : '' : ''}</Text>
                                </View>
                            ))
                        )}
                    </View>

                    <View style={styles.clueList}>
                        <View style={styles.clueSection}>
                            <Text style={styles.clueTitle}>Across:</Text>
                            {puzzle.words
                                .filter((word) => word.direction === 'across')
                                .map((word) => (
                                    <Text key={`${word.startX}-${word.startY}`} style={styles.clue}>
                                        {word.number}. {word.hint}
                                    </Text>
                                ))}
                        </View>

                        <View style={styles.clueSection}>
                            <Text style={styles.clueTitle}>Down:</Text>
                            {puzzle.words
                                .filter((word) => word.direction === 'down')
                                .map((word) => (
                                    <Text key={`${word.startX}-${word.startY}`} style={styles.clue}>
                                        {word.number}. {word.hint}
                                    </Text>
                                ))}
                        </View>
                    </View>
                </View>
            ))}
        </Page>
    </Document>
);

export default CrosswordPDF;
