import { useEffect } from 'react';
import { ActivityIndicator, Modal, SafeAreaView, StatusBar, Text, View } from 'react-native';
// --- BİLEŞEN VE ARAÇ İÇE AKTARIMLARI ---
import * as SystemUI from 'expo-system-ui';
import AdBanner from "../components/AdBanner";
import CreditsScreen from '../components/CreditsScreen';
import GameBoard from '../components/GameBoard';
import GameControls from '../components/GameControls';
import GameHeader from '../components/GameHeader';
import GameResultScreen from '../components/GameOverScreen';
import MenuScreen from '../components/MenuScreen';
import SettingsScreen from '../components/SettingsScreen';
import { useGameLogic } from '../hooks/useGameLogic';
import { styles } from '../styles';
export const printmes = (mes: string) =>{
    console.log(mes);
  }
export default function Index() {
 
  const {
    bestTimes, screen, setScreen, difficulty, isGenerating,
    board, solvedBoard, fixedCells, mistakes,
    showConflicts, setShowConflicts, inputMode, handleModeChange,
    selectedColor, selectedCell, timeElapsed,
    generateGame, conflicts, handleCellClick, handleColorClick
  } = useGameLogic();


useEffect(() => {
    // Uygulamanın en alt (root) arka planını koyu tema rengine zorluyoruz
    // Bu sayede alttaki veya üstteki beyaz boşluklar tamamen kapanır
    SystemUI.setBackgroundColorAsync('#18181b'); 
  }, []);



const rewardedAdUnitId =  'ca-app-pub-7345089833984227/9971050865'; // <-- XXXXXX YAZAN YERE ADMOB'DAN ALDIĞIN ÖDÜLLÜ REKLAM BİRİMİ ID'Sİ GELECEK


  // Ayarları Yükle
 

  
  

  


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
    
      
    }, 500);
  }
}, [board, mistakes, solvedBoard, screen, timeElapsed, difficulty]); 
// timeElapsed ve difficulty bağımlılıklarını eklemeyi unutma!

 

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
        <GameHeader
          setScreen={setScreen}
          mistakes={mistakes}
          timeElapsed={timeElapsed}
          showConflicts={showConflicts}
          setShowConflicts={setShowConflicts}
        />

      <View style={styles.boardContainer}>
          {/* O karmaşık döngülerin tamamı artık tek bir satırda! */}
          <GameBoard
            board={board}
            solvedBoard={solvedBoard}
            fixedCells={fixedCells}
            conflicts={conflicts}
            selectedCell={selectedCell}
            inputMode={inputMode}
            handleCellClick={handleCellClick}
          />

       {/* Tek Bir Bileşen İki Ekranı da Yönetiyor */}
          {(screen === 'gameover' || screen === 'victory') && (
             <GameResultScreen
                difficulty={difficulty}
                generateGame={generateGame}
                setScreen={setScreen}
                timer={timeElapsed}
                isVictory={screen === 'victory'} // Eğer state 'victory' ise true gönderir, arayüz parlar!
             />
          )}
        </View>

      

        {/* Yeni Alt Kontrol Paneli Bileşenimiz */}
        <GameControls
          inputMode={inputMode}
          selectedColor={selectedColor}
          selectedCell={selectedCell}
          handleColorClick={handleColorClick}
        />

        <View style={{ alignItems: 'center', width: '100%', marginTop: 10 }}>
          {/*<AdBanner /> */}
          <AdBanner /> 
        </View>
      
      </View>
    </SafeAreaView>
  );
}