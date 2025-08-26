import PuzzleGenerator from './components/PuzzleGenerator';
import { ThemeProvider, createTheme } from '@mui/material';

const theme = createTheme();

function App() {
  return (
    <ThemeProvider theme={theme}>
      <div style={{ padding: '2rem' }}>
        <PuzzleGenerator />
      </div>
    </ThemeProvider>
  );
}

export default App;
