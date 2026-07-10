import { Info, Settings } from 'lucide-react-native';
import { ActivityIndicator, SafeAreaView, StatusBar, Text, TouchableOpacity, View } from 'react-native';
import { COLORS } from '../constants/constants';
import { formatTime } from '../constants/gameLogic'; // YENİ EKLENDİ
import { styles } from '../styles';

interface MenuScreenProps {
  generateGame: (diff: string) => void;
  isGenerating: boolean;
  onOpenSettings: () => void;
  onOpenCredits: () => void;
  bestTimes: Record<string, number | null>; // YENİ EKLENDİ
}

export default function MenuScreen({ 
  generateGame, 
  isGenerating, 
  onOpenSettings, 
  onOpenCredits,
  bestTimes // YENİ EKLENDİ
}: MenuScreenProps) {


  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#09090b" />
      <View style={{ position: 'absolute', top: 40, right: 20, flexDirection: 'row', gap: 12, zIndex: 10 }}>
        
        {/* Credits İkonu */}
        <TouchableOpacity style={{ padding: 1, backgroundColor: '#18181b', borderRadius: 30 }} onPress={onOpenCredits} disabled={isGenerating}>
          <Info color="#4ade80" size={24} />
        </TouchableOpacity>

        {/* Ayarlar İkonu */}
        <TouchableOpacity style={{ padding: 1, backgroundColor: '#18181b', borderRadius: 30 }} onPress={onOpenSettings} disabled={isGenerating}>
          <Settings color="#f87171" size={24} />
        </TouchableOpacity>
        
      </View>
      <View style={styles.menuContent}>
        <View style={styles.titleContainer}>
          <View style={styles.titleColorsRow}>
            {COLORS.slice(1, 4).map((c, i) => (
              <View key={i} style={[styles.titleColorBox, { backgroundColor: c }]} />
            ))}
          </View>
          <Text style={styles.titleText}>
            Color<Text style={styles.titleTextBold}>doku</Text>
          </Text>
          <Text style={styles.subtitleText}>Logic puzzle with colors</Text>
          
        </View>

        <View style={styles.buttonsContainer}>
          {isGenerating && (
            <View style={styles.loadingOverlay}>
              <ActivityIndicator size="large" color="#3b82f6" />
              <Text style={styles.loadingText}>Calculating...</Text>
            </View>
          )}
          {['Easy', 'Medium', 'Hard'].map((diff) => (
            <TouchableOpacity
              key={diff}
              style={[styles.menuButton, isGenerating && styles.disabledButton]}
              onPress={() => generateGame(diff)}
              disabled={isGenerating}
              activeOpacity={0.7}
            >
              <View style={{ alignItems: 'center', gap: 4 }}>
                <Text style={styles.menuButtonText}>{diff}</Text>
                
                {/* Eğer o zorlukta bir rekor varsa altında göster */}
                {bestTimes[diff] !== null ? (
                <Text style={styles.bestTimeText}>
                  Best Time: {formatTime(bestTimes[diff])}
                </Text>
              ) : (
                <Text style={[styles.bestTimeText, { color: '#71717a' }]}>
                  No record yet
                </Text>
              )}
              </View>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    </SafeAreaView>
  );
}