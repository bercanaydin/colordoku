import React, { useState, useMemo, useEffect } from 'react';
import { View, Text, TouchableOpacity, ActivityIndicator, SafeAreaView, StatusBar, Modal } from 'react-native';
import { Eraser, Heart, Sparkles, Eye, EyeOff, Home, PaintBucket, MousePointer2 } from 'lucide-react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as NavigationBar from 'expo-navigation-bar';
// --- BİLEŞEN VE ARAÇ İÇE AKTARIMLARI ---
import MenuScreen from '../components/MenuScreen';
import SettingsScreen from '../components/SettingsScreen';
import CreditsScreen from '../components/CreditsScreen';
import { COLORS, BASE_SOLVED } from '../constants/constants';
import { countSolutions } from '../constants/gameLogic';
import { styles } from '../styles';
import AdBanner from '../components/AdBanner'; // <-- Bunu ekle
import * as SystemUI from 'expo-system-ui';



export const printmes = (mes: string) =>{
    console.log(mes);
  }
export default function Index() {
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

  // Süre State'i
  const [timeElapsed, setTimeElapsed] = useState<number>(0);

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60).toString().padStart(2, '0');
    const s = (seconds % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };
useEffect(() => {
  const loadBestTimes = async () => {
    try {
      const saved = await AsyncStorage.getItem('colordoku_best_times');
      if (saved) {
        setBestTimes(JSON.parse(saved));
      }
    } catch (error) {
      console.error('Rekorlar yüklenemedi:', error);
    }
  };
  loadBestTimes();
}, []);


useEffect(() => {
    // Uygulamanın en alt (root) arka planını koyu tema rengine zorluyoruz
    // Bu sayede alttaki veya üstteki beyaz boşluklar tamamen kapanır
    SystemUI.setBackgroundColorAsync('#18181b'); 
  }, []);

  // Zamanlayıcı (Timer)
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
        if (savedMode !== null) {
          setInputMode(savedMode);
        }
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
      
      // Rekor Kaydetme Mantığı
      setBestTimes(prev => {
        const currentBest = prev[difficulty];
        // Eğer o anki süre mevcut rekordan daha düşükse (daha hızlıysa) veya rekor yoksa kaydet
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
// timeElapsed ve difficulty bağımlılıklarını eklemeyi unutma!

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

  // --- EKRAN YÖNETİMİ ---

 if (screen === 'menu') {
  return (
    <MenuScreen
      generateGame={generateGame}
      isGenerating={isGenerating}
      onOpenSettings={() => setScreen('settings')} // setScreen={setScreen} YERİNE BÖYLE OLMALI
      onOpenCredits={() => setScreen('credits')}
      bestTimes={bestTimes}
    />
  );
}

  if (screen === 'settings') {
    return (
      <SettingsScreen
        inputMode={inputMode}
        onModeChange={handleModeChange}
        onClose={() => setScreen('menu')}
      />
    );
  }

    if (screen === 'credits') {
    return (
      <CreditsScreen
       
        onClose={() => setScreen('menu')}
      />
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#09090b" />

      {isGenerating && (
        <Modal transparent animationType="fade">
          <View style={styles.fullScreenLoader}>
            <ActivityIndicator size="large" color="#3b82f6" />
            <Text style={styles.loadingText}>Loading...</Text>
          </View>
        </Modal>
      )}

      <View style={styles.gameWrapper}>
        <View style={styles.gameHeader}>
          <TouchableOpacity onPress={() => setScreen('menu')} style={styles.iconButton}>
            <Home color="#a1a1aa" size={22} />
          </TouchableOpacity>

          <View style={styles.heartsContainer}>
            {[1, 2, 3].map((life) => (
              <Heart
                key={life}
                size={18}
                color={life <= (3 - mistakes) ? '#ef4444' : '#27272a'}
                fill={life <= (3 - mistakes) ? '#ef4444' : 'transparent'}
              />
            ))}
          </View>

          <View style={styles.timerContainer}>
            <Text style={styles.timerText}>{formatTime(timeElapsed)}</Text>
          </View>

          <View style={styles.rightHeaderControls}>
            <TouchableOpacity onPress={() => setShowConflicts(!showConflicts)} style={[styles.iconButton, showConflicts && styles.iconButtonActive]}>
              {showConflicts ? <Eye color="#60a5fa" size={22} /> : <EyeOff color="#a1a1aa" size={22} />}
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.boardContainer}>
          {Array.from({ length: 9 }).map((_, blockIdx) => (
            <View key={blockIdx} style={styles.block}>
              {Array.from({ length: 9 }).map((_, cellIdx) => {
                const row = Math.floor(blockIdx / 3) * 3 + Math.floor(cellIdx / 3);
                const col = (blockIdx % 3) * 3 + (cellIdx % 3);
                const index = row * 9 + col;

                const isFixed = fixedCells[index];
                const val = board[index];
                const isConflict = conflicts.has(index);
                const isWrong = val !== 0 && !isFixed && val !== solvedBoard[index];
                const isSelected = inputMode === 'cell' && selectedCell === index;

                let borderStyle: any = {};
                if (isWrong || isConflict) {
                  borderStyle = { borderWidth: 2, borderColor: '#ef4444' };
                } else if (isSelected) {
                  borderStyle = { borderWidth: 2, borderColor: '#ffffff' };
                }

                return (
                  <TouchableOpacity
                    key={index}
                    activeOpacity={isFixed ? 1 : 0.6}
                    onPress={() => handleCellClick(index)}
                    style={[
                      styles.cell,
                      { backgroundColor: val !== 0 ? COLORS[val] : '#202024' },
                      borderStyle
                    ]}
                  >
                    {isFixed && <View style={styles.fixedDot} />}
                    {isWrong && (
                      <View style={styles.wrongCrossContainer}>
                        <View style={[styles.wrongCrossLine, { transform: [{ rotate: '45deg' }] }]} />
                        <View style={[styles.wrongCrossLine, { transform: [{ rotate: '-45deg' }] }]} />
                      </View>
                    )}
                  </TouchableOpacity>
                );
              })}
            </View>
          ))}

          {(screen === 'victory' || screen === 'gameover') && (
            <View style={styles.resultOverlay}>
              <View style={[styles.resultIconWrap, screen === 'victory' ? styles.resultIconWin : styles.resultIconLose]}>
                {screen === 'victory' ? <Sparkles color="#fbbf24" size={32} /> : <Heart color="#ef4444" size={32} fill="#ef4444" opacity={0.5} />}
                {screen === 'gameover' && <View style={styles.brokenHeartLine} />}
              </View>

              <Text style={styles.resultTitle}>{screen === 'victory' ? 'Perfect!' : 'Game Over'}</Text>
              <Text style={styles.resultDesc}>
                {screen === 'victory' ? `You completed the ${difficulty} level.` : 'You lost all your lives.'}
              </Text>
              
              <Text style={styles.resultTimeText}>Time: {formatTime(timeElapsed)}</Text>

              <View style={styles.resultButtons}>
                <TouchableOpacity onPress={() => setScreen('menu')} style={styles.resBtnSecondary}>
                  <Text style={styles.resBtnSecondaryText}>Main Menu</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => generateGame(difficulty)} style={styles.resBtnPrimary}>
                  <Text style={styles.resBtnPrimaryText}>Try Again</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
        </View>

        <View style={styles.controlsContainer}>
          <View style={styles.modeBadgeWrap}>
            <View style={styles.modeBadge}>
              {inputMode === 'paint' ? <PaintBucket color="#a1a1aa" size={14}/> : <MousePointer2 color="#a1a1aa" size={14}/>}
              <Text style={styles.modeBadgeText}>{inputMode === 'paint' ? 'Paint Mode Active' : 'Cell Select Mode Active'}</Text>
            </View>
          </View>

          <View style={styles.paletteContainer}>
            {COLORS.slice(1).map((color, i) => {
              const colorIdx = i + 1;
              const isSelected = inputMode === 'paint' ? selectedColor === colorIdx : false;
              const isDisabledLook = inputMode === 'cell' && selectedCell === null;

              return (
                <TouchableOpacity
                  key={colorIdx}
                  activeOpacity={0.7}
                  onPress={() => handleColorClick(colorIdx)}
                  style={[
                    styles.colorCircle,
                    { backgroundColor: color },
                    isSelected && styles.colorCircleSelected,
                    isDisabledLook && styles.colorCircleDisabled
                  ]}
                />
              );
            })}
          </View>

          <View style={styles.eraserContainer}>
            <TouchableOpacity
              activeOpacity={0.7}
              onPress={() => handleColorClick(0)}
              style={[
                styles.eraserButton,
                (inputMode === 'paint' && selectedColor === 0) ? styles.eraserButtonActive : null,
                (inputMode === 'cell' && selectedCell === null) ? styles.eraserButtonDisabled : null
              ]}
            >
              <Eraser color={(inputMode === 'paint' && selectedColor === 0) ? '#ffffff' : '#a1a1aa'} size={20} />
              <Text style={[
                styles.eraserText,
                (inputMode === 'paint' && selectedColor === 0) && styles.eraserTextActive
              ]}>
                {inputMode === 'paint' ? 'Eraser Tool' : 'Erase Selected'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
        <View style={{ alignItems: 'center', width: '100%', marginTop: 10 }}>
          {/*<AdBanner /> */}
          <AdBanner />
        </View>
      </View>
    </SafeAreaView>
  );
}