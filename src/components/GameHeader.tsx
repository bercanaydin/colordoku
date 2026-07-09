import { Eye, EyeOff, Heart, Home } from 'lucide-react-native';
import { Text, TouchableOpacity, View } from 'react-native';
import { styles } from '../styles';

interface GameHeaderProps {
  setScreen: (screen: string) => void;
  mistakes: number;
  timeElapsed: number;
  showConflicts: boolean;
  setShowConflicts: (show: boolean) => void;
}

export default function GameHeader({
  setScreen,
  mistakes,
  timeElapsed,
  showConflicts,
  setShowConflicts,
}: GameHeaderProps) {
  
  // Süreyi MM:SS formatına çeviren yardımcı fonksiyonumuz
  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60).toString().padStart(2, '0');
    const s = (seconds % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  return (
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
        <TouchableOpacity 
          onPress={() => setShowConflicts(!showConflicts)} 
          style={[styles.iconButton, showConflicts && styles.iconButtonActive]}
        >
          {showConflicts ? <Eye color="#60a5fa" size={22} /> : <EyeOff color="#a1a1aa" size={22} />}
        </TouchableOpacity>
      </View>
    </View>
  );
}