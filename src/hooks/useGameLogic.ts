import AsyncStorage from '@react-native-async-storage/async-storage';
import { useEffect, useMemo, useState } from 'react';
import { BASE_SOLVED } from '../constants/constants';
import { countSolutions } from '../constants/gameLogic';

export function useGameLogic() {
  const [bestTimes, setBestTimes] = useState<Record<string, number | null>>({
    Easy: null,
    Medium: null,
    Hard: null
  });
  const [screen, setScreen] = useState<string>('menu');
  const [difficulty, setDifficulty] = useState<string>('Medium');
  const [isGenerating, setIsGenerating] = useState<boolean>(false);

  const [board, setBoard] = useState<number[]>(Array(81).fill(0));
  const [solvedBoard, setSolvedBoard] = useState<number[]>(Array(81).fill(0));
  const [fixedCells, setFixedCells] = useState<boolean[]>(Array(81).fill(false));

  const [mistakes, setMistakes] = useState<number>(0);
  const [showConflicts, setShowConflicts] = useState<boolean>(true);

  const [inputMode, setInputMode] = useState<string>('cell');
  const [selectedColor, setSelectedColor] = useState<number>(1);
  const [selectedCell, setSelectedCell] = useState<number | null>(null);

  const [timeElapsed, setTimeElapsed] = useState<number>(0);

  // Rekorları Yükle
  useEffect(() => {
    const loadBestTimes = async () => {
      try {
        const saved = await AsyncStorage.getItem('colordoku_best_times');
        if (saved) setBestTimes(JSON.parse(saved));
      } catch (error) {
        console.error('Rekorlar yüklenemedi:', error);
      }
    };
    loadBestTimes();
  }, []);

  // Zamanlayıcı
  useEffect(() => {
    let timer: ReturnType<typeof setInterval>;
    if (screen === 'playing') {
      timer = setInterval(() => {
        setTimeElapsed((prev) => prev + 1);
      }, 1000);
    }
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [screen]);

  // Ayarları Yükle
  useEffect(() => {
    const loadSettings = async () => {
      try {
        const savedMode = await AsyncStorage.getItem('@inputMode');
        if (savedMode !== null) setInputMode(savedMode);
      } catch (e) {
        console.log('Error loading settings:', e);
      }
    };
    loadSettings();
  }, []);

  const handleModeChange = async (mode: string) => {
    setInputMode(mode);
    try {
      await AsyncStorage.setItem('@inputMode', mode);
    } catch (e) {
      console.log('Error saving settings:', e);
    }
  };

  const generateGame = (diff: string) => {
    setIsGenerating(true);
    setTimeout(() => {
      const nums = [1, 2, 3, 4, 5, 6, 7, 8, 9].sort(() => Math.random() - 0.5);
      const newSolved = BASE_SOLVED.map(n => nums[n - 1]);
      const newBoard = [...newSolved];

      let targetEmpty = diff === 'Easy' ? 32 : diff === 'Medium' ? 44 : 53;
      let emptyCount = 0;
      const indices = Array.from({ length: 81 }, (_, i) => i).sort(() => Math.random() - 0.5);

      for (let i = 0; i < indices.length; i++) {
        const idx = indices[i];
        const backupValue = newBoard[idx];
        newBoard[idx] = 0;
        if (countSolutions([...newBoard]) !== 1) {
          newBoard[idx] = backupValue;
        } else {
          emptyCount++;
          if (emptyCount >= targetEmpty) break;
        }
      }

      const newFixed = Array(81).fill(false);
      for (let i = 0; i < 81; i++) {
        if (newBoard[i] !== 0) newFixed[i] = true;
      }

      setSolvedBoard(newSolved);
      setBoard(newBoard);
      setFixedCells(newFixed);
      setMistakes(0);
      setTimeElapsed(0);
      setDifficulty(diff);
      setSelectedCell(null);
      setIsGenerating(false);
      setScreen('playing');
    }, 100);
  };

  const conflicts = useMemo(() => {
    const conf = new Set<number>();
    if (!showConflicts) return conf;
    for (let i = 0; i < 81; i++) {
      if (board[i] === 0) continue;
      const row = Math.floor(i / 9);
      const col = i % 9;
      const block = Math.floor(row / 3) * 3 + Math.floor(col / 3);
      for (let j = 0; j < 81; j++) {
        if (i === j || board[j] === 0) continue;
        const jRow = Math.floor(j / 9);
        const jCol = j % 9;
        const jBlock = Math.floor(jRow / 3) * 3 + Math.floor(jCol / 3);
        if ((row === jRow || col === jCol || block === jBlock) && board[i] === board[j]) {
          conf.add(i);
          conf.add(j);
        }
      }
    }
    return conf;
  }, [board, showConflicts]);

  // Kazanma / Kaybetme Mantığı
  useEffect(() => {
    if (screen !== 'playing') return;
    
    if (mistakes >= 3) {
      setTimeout(() => setScreen('gameover'), 500);
      return;
    }
    
    const isComplete = !board.includes(0);
    const hasErrors = board.some((val, i) => val !== 0 && val !== solvedBoard[i]);
    
    if (isComplete && !hasErrors) {
      setTimeout(() => {
        setScreen('victory');
        setBestTimes(prev => {
          const currentBest = prev[difficulty];
          if (currentBest === null || timeElapsed < currentBest) {
            const newBest = { ...prev, [difficulty]: timeElapsed };
            AsyncStorage.setItem('colordoku_best_times', JSON.stringify(newBest));
            return newBest;
          }
          return prev;
        });
      }, 500);
    }
  }, [board, mistakes, solvedBoard, screen, timeElapsed, difficulty]); 

  const handleCellClick = (index: number) => {
    if (fixedCells[index]) return;
    if (board[index] !== 0 && board[index] === solvedBoard[index]) return;

    if (inputMode === 'paint') {
      if (selectedColor === 0) {
        const newBoard = [...board];
        newBoard[index] = 0;
        setBoard(newBoard);
        return;
      }
      if (board[index] === selectedColor) return;
      const newBoard = [...board];
      newBoard[index] = selectedColor;
      setBoard(newBoard);

      if (selectedColor !== solvedBoard[index]) {
        setMistakes(m => m + 1);
      }
    } else {
      setSelectedCell(index);
    }
  };

  const handleColorClick = (colorIdx: number) => {
    if (inputMode === 'paint') {
      setSelectedColor(colorIdx);
    } else {
      if (selectedCell === null) return;
      if (colorIdx === 0) {
        const newBoard = [...board];
        newBoard[selectedCell] = 0;
        setBoard(newBoard);
        return;
      }
      if (board[selectedCell] === colorIdx) return;

      const newBoard = [...board];
      newBoard[selectedCell] = colorIdx;
      setBoard(newBoard);

      if (colorIdx !== solvedBoard[selectedCell]) {
        setMistakes(m => m + 1);
      }
    }
  };

  // Sadece Arayüzün İhtiyacı Olanları Dışarı Aktarıyoruz
  return {
    bestTimes, screen, setScreen, difficulty, isGenerating,
    board, solvedBoard, fixedCells, mistakes,
    showConflicts, setShowConflicts, inputMode, handleModeChange,
    selectedColor, selectedCell, timeElapsed,
    generateGame, conflicts, handleCellClick, handleColorClick
  };
}