import React, { useState, useMemo, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ActivityIndicator, Dimensions, SafeAreaView, StatusBar, Modal } from 'react-native';
import { Eraser, Heart, RotateCcw, Sparkles, Eye, EyeOff, Play, Home, Settings, X, PaintBucket, MousePointer2 } from 'lucide-react-native';

const COLORS: string[] = [
  'transparent',
  '#f87171', // 1: Kırmızı
  '#60a5fa', // 2: Mavi
  '#4ade80', // 3: Yeşil
  '#facc15', // 4: Sarı
  '#c084fc', // 5: Mor
  '#fb923c', // 6: Turuncu
  '#2dd4bf', // 7: Turkuaz
  '#f472b6', // 8: Pembe
  '#e5e7eb'  // 9: Gri
];

const BASE_SOLVED: number[] = [
  4,3,5,2,6,9,7,8,1,
  6,8,2,5,7,1,4,9,3,
  1,9,7,8,3,4,5,6,2,
  8,2,6,1,9,5,3,4,7,
  3,7,4,6,8,2,9,1,5,
  9,5,1,7,4,3,6,2,8,
  5,1,9,3,2,6,8,7,4,
  2,4,8,9,5,7,1,3,6,
  7,6,3,4,1,8,2,5,9
];

const isValidPlacement = (board: number[], index: number, val: number): boolean => {
  const row = Math.floor(index / 9);
  const col = index % 9;
  const block = Math.floor(row / 3) * 3 + Math.floor(col / 3);

  for (let i = 0; i < 81; i++) {
    if (i === index) continue;
    if (board[i] === val) {
      const iRow = Math.floor(i / 9);
      const iCol = i % 9;
      const iBlock = Math.floor(iRow / 3) * 3 + Math.floor(iCol / 3);
      if (row === iRow || col === iCol || block === iBlock) return false;
    }
  }
  return true;
};

const countSolutions = (board: number[]): number => {
  let count = 0;
  const solve = () => {
    if (count > 1) return;
    let emptyIndex = -1;
    for (let i = 0; i < 81; i++) {
      if (board[i] === 0) {
        emptyIndex = i;
        break;
      }
    }
    if (emptyIndex === -1) {
      count++;
      return;
    }
    for (let val = 1; val <= 9; val++) {
      if (isValidPlacement(board, emptyIndex, val)) {
        board[emptyIndex] = val;
        solve();
        board[emptyIndex] = 0;
      }
    }
  };
  solve();
  return count;
};

const { width } = Dimensions.get('window');
const BOARD_PADDING = 16;
const BOARD_SIZE = width - (BOARD_PADDING * 2);

export default function App() {
  const [screen, setScreen] = useState<string>('menu'); 
  const [difficulty, setDifficulty] = useState<string>('Orta');
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  
  const [board, setBoard] = useState<number[]>(Array(81).fill(0));
  const [solvedBoard, setSolvedBoard] = useState<number[]>(Array(81).fill(0));
  const [fixedCells, setFixedCells] = useState<boolean[]>(Array(81).fill(false));
  
  const [mistakes, setMistakes] = useState<number>(0);
  const [showConflicts, setShowConflicts] = useState<boolean>(true);
  
  const [inputMode, setInputMode] = useState<string>('paint'); 
  const [selectedColor, setSelectedColor] = useState<number>(1); 
  const [selectedCell, setSelectedCell] = useState<number | null>(null); 

  const generateGame = (diff: string) => {
    setIsGenerating(true);
    setTimeout(() => {
      const nums = [1,2,3,4,5,6,7,8,9].sort(() => Math.random() - 0.5);
      const newSolved = BASE_SOLVED.map(n => nums[n - 1]);
      const newBoard = [...newSolved];
      
      let targetEmpty = diff === 'Kolay' ? 32 : diff === 'Orta' ? 44 : 53; 
      let emptyCount = 0;
      const indices = Array.from({length: 81}, (_, i) => i).sort(() => Math.random() - 0.5);

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
      for(let i = 0; i < 81; i++) {
        if(newBoard[i] !== 0) newFixed[i] = true;
      }

      setSolvedBoard(newSolved);
      setBoard(newBoard);
      setFixedCells(newFixed);
      setMistakes(0);
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
      setTimeout(() => setScreen('victory'), 500);
    }
  }, [board, mistakes, solvedBoard, screen]);

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

  // --- EKRAN: MENÜ ---
  if (screen === 'menu') {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="light-content" backgroundColor="#09090b" />
        <TouchableOpacity style={styles.settingsIcon} onPress={() => setScreen('settings')} disabled={isGenerating}>
          <Settings color="#71717a" size={24} />
        </TouchableOpacity>

        <View style={styles.menuContent}>
          <View style={styles.titleContainer}>
            <View style={styles.titleColorsRow}>
              {COLORS.slice(1, 4).map((c, i) => (
                <View key={i} style={[styles.titleColorBox, { backgroundColor: c }]} />
              ))}
            </View>
            <Text style={styles.titleText}>
              renk<Text style={styles.titleTextBold}>doku</Text>
            </Text>
            <Text style={styles.subtitleText}>Mantıkla çözülen renk bulmacası.</Text>
          </View>

          <View style={styles.buttonsContainer}>
            {isGenerating && (
              <View style={styles.loadingOverlay}>
                <ActivityIndicator size="large" color="#3b82f6" />
                <Text style={styles.loadingText}>Tekil çözüm hesaplanıyor...</Text>
              </View>
            )}
            
            {['Kolay', 'Orta', 'Zor'].map((diff) => (
              <TouchableOpacity
                key={diff}
                style={[styles.menuButton, isGenerating && styles.disabledButton]}
                onPress={() => generateGame(diff)}
                disabled={isGenerating}
                activeOpacity={0.7}
              >
                <Play color="#a1a1aa" size={20} />
                <Text style={styles.menuButtonText}>{diff} Seviye</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </SafeAreaView>
    );
  }

  // --- EKRAN: AYARLAR ---
  if (screen === 'settings') {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.settingsHeader}>
          <Text style={styles.settingsTitle}>Ayarlar</Text>
          <TouchableOpacity onPress={() => setScreen('menu')} style={styles.closeButton}>
            <X color="#a1a1aa" size={24} />
          </TouchableOpacity>
        </View>

        <View style={styles.settingsCard}>
          <Text style={styles.settingsSectionTitle}>Girdi Modu</Text>
          
          <TouchableOpacity 
            style={[styles.settingOption, inputMode === 'paint' && styles.settingOptionActive]}
            onPress={() => setInputMode('paint')}
            activeOpacity={0.7}
          >
            <View style={[styles.settingIconWrap, inputMode === 'paint' ? styles.settingIconActivePaint : styles.settingIconInactive]}>
              <PaintBucket color={inputMode === 'paint' ? '#60a5fa' : '#71717a'} size={24} />
            </View>
            <View style={styles.settingTextWrap}>
              <Text style={styles.settingOptionTitle}>Boyama Modu</Text>
              <Text style={styles.settingOptionDesc}>Önce rengi seç, sonra kareleri boya (Fırça gibi).</Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity 
            style={[styles.settingOption, inputMode === 'cell' && styles.settingOptionActive]}
            onPress={() => setInputMode('cell')}
            activeOpacity={0.7}
          >
            <View style={[styles.settingIconWrap, inputMode === 'cell' ? styles.settingIconActiveCell : styles.settingIconInactive]}>
              <MousePointer2 color={inputMode === 'cell' ? '#4ade80' : '#71717a'} size={24} />
            </View>
            <View style={styles.settingTextWrap}>
              <Text style={styles.settingOptionTitle}>Hücre Seçimi</Text>
              <Text style={styles.settingOptionDesc}>Önce boş kareyi seç, sonra o kareye renk ata.</Text>
            </View>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  // --- EKRAN: OYUN ---
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#09090b" />
      
      {isGenerating && (
        <Modal transparent animationType="fade">
          <View style={styles.fullScreenLoader}>
            <ActivityIndicator size="large" color="#3b82f6" />
            <Text style={styles.loadingText}>Yeni bulmaca oluşturuluyor...</Text>
          </View>
        </Modal>
      )}

      <View style={styles.gameWrapper}>
        {/* Header */}
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

          <View style={styles.rightHeaderControls}>
            <TouchableOpacity onPress={() => setShowConflicts(!showConflicts)} style={[styles.iconButton, showConflicts && styles.iconButtonActive]}>
              {showConflicts ? <Eye color="#60a5fa" size={22} /> : <EyeOff color="#a1a1aa" size={22} />}
            </TouchableOpacity>
          </View>
        </View>

        {/* Board */}
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

          {/* Modal Overlay for Game Over / Victory */}
          {(screen === 'victory' || screen === 'gameover') && (
            <View style={styles.resultOverlay}>
              <View style={[styles.resultIconWrap, screen === 'victory' ? styles.resultIconWin : styles.resultIconLose]}>
                {screen === 'victory' ? <Sparkles color="#fbbf24" size={32} /> : <Heart color="#ef4444" size={32} fill="#ef4444" opacity={0.5} />}
                {screen === 'gameover' && <View style={styles.brokenHeartLine} />}
              </View>
              
              <Text style={styles.resultTitle}>{screen === 'victory' ? 'Mükemmel!' : 'Oyun Bitti'}</Text>
              <Text style={styles.resultDesc}>
                {screen === 'victory' ? `${difficulty} seviyeyi tamamladın.` : 'Tüm haklarını tükettin.'}
              </Text>

              <View style={styles.resultButtons}>
                <TouchableOpacity onPress={() => setScreen('menu')} style={styles.resBtnSecondary}>
                  <Text style={styles.resBtnSecondaryText}>Menü</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => generateGame(difficulty)} style={styles.resBtnPrimary}>
                  <Text style={styles.resBtnPrimaryText}>Tekrar Oyna</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
        </View>

        {/* Controls Panel */}
        <View style={styles.controlsContainer}>
          <View style={styles.modeBadgeWrap}>
            <View style={styles.modeBadge}>
              {inputMode === 'paint' ? <PaintBucket color="#a1a1aa" size={14}/> : <MousePointer2 color="#a1a1aa" size={14}/>}
              <Text style={styles.modeBadgeText}>{inputMode === 'paint' ? 'Boyama Modu Aktif' : 'Hücre Seçim Modu Aktif'}</Text>
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
                {inputMode === 'paint' ? 'Silgi Aracı' : 'Seçili Hücreyi Sil'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#09090b', alignItems: 'center', justifyContent: 'center' },
  
  // --- MENU ---
  settingsIcon: { position: 'absolute', top: 40, right: 20, padding: 12, backgroundColor: '#18181b', borderRadius: 30 },
  menuContent: { width: '100%', maxWidth: 340, alignItems: 'center', gap: 40 },
  titleContainer: { alignItems: 'center' },
  titleColorsRow: { flexDirection: 'row', gap: 8, marginBottom: 16 },
  titleColorBox: { width: 32, height: 32, borderRadius: 8, elevation: 5 },
  titleText: { fontSize: 48, fontWeight: '300', color: '#f4f4f5', marginBottom: 8 },
  titleTextBold: { fontWeight: 'bold', color: '#71717a' },
  subtitleText: { color: '#a1a1aa', fontSize: 16 },
  buttonsContainer: { width: '100%', gap: 16, position: 'relative' },
  menuButton: { width: '100%', paddingVertical: 16, backgroundColor: '#18181b', borderWidth: 1, borderColor: '#27272a', borderRadius: 16, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 12 },
  menuButtonText: { fontSize: 18, fontWeight: '500', color: '#e4e4e7' },
  disabledButton: { opacity: 0.5 },
  loadingOverlay: { ...StyleSheet.absoluteFill, backgroundColor: 'rgba(9, 9, 11, 0.8)', zIndex: 10, justifyContent: 'center', alignItems: 'center', borderRadius: 16, gap: 12 },
  loadingText: { color: '#d4d4d8', fontSize: 14, fontWeight: '500' },
  fullScreenLoader: { flex: 1, backgroundColor: 'rgba(9, 9, 11, 0.85)', justifyContent: 'center', alignItems: 'center', gap: 16 },

  // --- SETTINGS ---
  settingsHeader: { width: '100%', maxWidth: 340, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 30 },
  settingsTitle: { fontSize: 28, fontWeight: '500', color: '#f4f4f5' },
  closeButton: { padding: 8, backgroundColor: '#18181b', borderRadius: 20 },
  settingsCard: { width: '100%', maxWidth: 340, backgroundColor: '#18181b', padding: 20, borderRadius: 16, borderWidth: 1, borderColor: '#27272a' },
  settingsSectionTitle: { fontSize: 16, color: '#a1a1aa', fontWeight: '500', borderBottomWidth: 1, borderBottomColor: '#27272a', paddingBottom: 10, marginBottom: 16 },
  settingOption: { flexDirection: 'row', alignItems: 'center', padding: 16, borderRadius: 12, borderWidth: 1, borderColor: '#27272a', marginBottom: 12, gap: 16 },
  settingOptionActive: { backgroundColor: '#27272a', borderColor: '#3f3f46' },
  settingIconWrap: { padding: 8, borderRadius: 8 },
  settingIconActivePaint: { backgroundColor: 'rgba(59, 130, 246, 0.2)' },
  settingIconActiveCell: { backgroundColor: 'rgba(74, 222, 128, 0.2)' },
  settingIconInactive: { backgroundColor: '#27272a' },
  settingTextWrap: { flex: 1 },
  settingOptionTitle: { fontWeight: '500', color: '#f4f4f5', fontSize: 16 },
  settingOptionDesc: { color: '#a1a1aa', fontSize: 13, marginTop: 4 },

  // --- GAME UI ---
  gameWrapper: { width: '100%', maxWidth: 400, padding: 16, gap: 24 },
  gameHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  iconButton: { padding: 10, backgroundColor: '#18181b', borderRadius: 20 },
  iconButtonActive: { backgroundColor: 'rgba(59, 130, 246, 0.15)' },
  heartsContainer: { flexDirection: 'row', gap: 6, backgroundColor: '#18181b', paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20, borderWidth: 1, borderColor: '#27272a' },
  rightHeaderControls: { flexDirection: 'row', gap: 8 },

  // --- BOARD ---
  boardContainer: { width: BOARD_SIZE, height: BOARD_SIZE, backgroundColor: '#18181b', padding: 10, borderRadius: 16, flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', alignContent: 'space-between', borderWidth: 1, borderColor: '#27272a' },
  block: { width: '32%', height: '32%', backgroundColor: '#27272a', borderRadius: 8, flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-evenly', alignContent: 'space-evenly', overflow: 'hidden' },
  cell: { width: '31%', height: '31%', borderRadius: 4, justifyContent: 'center', alignItems: 'center' },
  fixedDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: 'rgba(0,0,0,0.4)' },
  wrongCrossContainer: { ...StyleSheet.absoluteFill, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.2)' },
  wrongCrossLine: { position: 'absolute', width: 16, height: 3, backgroundColor: '#ef4444', borderRadius: 2 },

  // --- MODALS (WIN/LOSE) ---
  resultOverlay: { ...StyleSheet.absoluteFill, backgroundColor: 'rgba(9, 9, 11, 0.95)', borderRadius: 16, justifyContent: 'center', alignItems: 'center', zIndex: 20, padding: 20 },
  resultIconWrap: { width: 64, height: 64, borderRadius: 32, justifyContent: 'center', alignItems: 'center', marginBottom: 20 },
  resultIconWin: { backgroundColor: '#27272a', borderWidth: 1, borderColor: 'rgba(251, 191, 36, 0.2)' },
  resultIconLose: { backgroundColor: 'rgba(239, 68, 68, 0.1)', borderWidth: 1, borderColor: 'rgba(239, 68, 68, 0.2)' },
  brokenHeartLine: { position: 'absolute', width: 32, height: 4, backgroundColor: '#09090b', transform: [{ rotate: '45deg' }] },
  resultTitle: { fontSize: 28, fontWeight: '600', color: '#fff', marginBottom: 8 },
  resultDesc: { color: '#a1a1aa', fontSize: 16, marginBottom: 24 },
  resultButtons: { flexDirection: 'row', gap: 12 },
  resBtnSecondary: { paddingVertical: 12, paddingHorizontal: 24, backgroundColor: '#27272a', borderRadius: 24 },
  resBtnSecondaryText: { color: '#d4d4d8', fontWeight: '500', fontSize: 16 },
  resBtnPrimary: { paddingVertical: 12, paddingHorizontal: 24, backgroundColor: '#f4f4f5', borderRadius: 24 },
  resBtnPrimaryText: { color: '#09090b', fontWeight: '600', fontSize: 16 },

  // --- CONTROLS ---
  controlsContainer: { gap: 20, marginTop: 4 },
  modeBadgeWrap: { alignItems: 'center' },
  modeBadge: { flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: '#18181b', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 16, borderWidth: 1, borderColor: '#27272a' },
  modeBadgeText: { fontSize: 12, color: '#a1a1aa', fontWeight: '500' },
  paletteContainer: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center', gap: 14 },
  colorCircle: { width: 40, height: 40, borderRadius: 20, elevation: 3 },
  colorCircleSelected: { borderWidth: 4, borderColor: '#09090b', transform: [{ scale: 1.15 }] },
  colorCircleDisabled: { opacity: 0.3 },
  eraserContainer: { alignItems: 'center' },
  eraserButton: { flexDirection: 'row', alignItems: 'center', gap: 8, paddingHorizontal: 32, paddingVertical: 14, backgroundColor: '#18181b', borderRadius: 24 },
  eraserButtonActive: { backgroundColor: '#3f3f46', borderWidth: 2, borderColor: '#71717a' },
  eraserButtonDisabled: { opacity: 0.3 },
  eraserText: { color: '#a1a1aa', fontWeight: '500', fontSize: 16 },
  eraserTextActive: { color: '#ffffff' },
});