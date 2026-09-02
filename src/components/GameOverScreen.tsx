import { Heart, Sparkles } from 'lucide-react-native';
import { useEffect } from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { saveWorldRecord } from "../hooks/getscores";
import { styles } from '../styles';
// isVictory prop'unu ekledik
interface GameResultScreenProps {
  difficulty: string;
  generateGame: (diff: string) => void;
  setScreen: (screen: string) => void;
  timer: number;
  isVictory: boolean; 
}

const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60).toString().padStart(2, '0');
    const s = (seconds % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
};

export default function GameResultScreen({
  difficulty,
  generateGame,
  setScreen,
  timer,
  isVictory,
}: GameResultScreenProps) {
  
  useEffect(() => {
      console.error('bassssss: ');
  })

  useEffect(() => {
    if (isVictory && difficulty === 'Easy') {
      // Herkes için şimdilik sabit bir isim gönderiyoruz
      saveWorldRecord('Colordoku Oyuncusu', timer, difficulty);
    }
  }, [isVictory, difficulty, timer]);
  return (
    <View style={styles.resultOverlay}>
      {/* Kazanma veya kaybetme durumuna göre arka plan rengi ve ikon değişiyor */}
      <View style={[styles.resultIconWrap, isVictory ? styles.resultIconWin : styles.resultIconLose]}>
        {isVictory ? (
          <Sparkles color="#fbbf24" size={32} />
        ) : (
          <>
            <Heart color="#ef4444" size={32} fill="#ef4444" opacity={0.5} />
            <View style={styles.brokenHeartLine} />
          </>
        )}
      </View>

      {/* Başlık ve açıklama dinamik hale geldi */}
      <Text style={styles.resultTitle}>{isVictory ? 'Perfect!' : 'Game Over'}</Text>
      <Text style={styles.resultDesc}>
        {isVictory ? `You completed the ${difficulty} level.` : 'You ran out of lives.'}
      </Text>
      <Text style={styles.resultDesc}>Duration: {formatTime(timer)}</Text>

      <View style={styles.resultButtons}>
        <TouchableOpacity onPress={() => setScreen('menu')} style={styles.resBtnSecondary}>
          <Text style={styles.resBtnSecondaryText}>Main Menu</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => generateGame(difficulty)} style={styles.resBtnPrimary}>
          <Text style={styles.resBtnPrimaryText}>{isVictory ? 'Next Level' : 'Try Again'}</Text>
        </TouchableOpacity>
      </View>

    </View>
  );
}