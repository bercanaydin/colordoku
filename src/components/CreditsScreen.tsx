import { Code, Info, Star, X } from 'lucide-react-native';
import { Linking, SafeAreaView, StatusBar, Text, TouchableOpacity, View } from 'react-native';
import { styles } from '../styles';

interface CreditsScreenProps {
  onClose: (screen: string) => void;
}

export default function CreditsScreen({ onClose }: CreditsScreenProps) {
  // Puanlama Butonu Tıklanınca Çalışacak Fonksiyon
  const handleRateApp = () => {
    // Paket ismini app.json'daki ile aynı yazdık
    const url = 'market://details?id=com.bercanayd.colordoku';
    Linking.canOpenURL(url).then(supported => {
      if (supported) {
        Linking.openURL(url);
      } else {
        // Eğer cihazda Play Store uygulaması bulunamazsa tarayıcıdan açar
        Linking.openURL('https://play.google.com/store/apps/details?id=com.bercanayd.colordoku');
      }
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#09090b" />
      
      <View style={styles.settingsHeader}>
        <Text style={styles.settingsTitle}>About & Credits</Text>
        <TouchableOpacity onPress={() => onClose('menu')} style={styles.closeButton}>
          <X color="#a1a1aa" size={24} />
        </TouchableOpacity>
      </View>

      <View style={styles.settingsCard}>
        <Text style={styles.settingsSectionTitle}>Information</Text>
        
        <View style={styles.settingOption}>
          <View style={[styles.settingIconWrap, styles.settingIconInactive]}>
            <Code color="#71717a" size={24} />
          </View>
          <View style={styles.settingTextWrap}>
            <Text style={styles.settingOptionTitle}>Developer</Text>
            <Text style={styles.settingOptionDesc}>Bercan Aydın</Text>
          </View>
        </View>

        <View style={styles.settingOption}>
          <View style={[styles.settingIconWrap, styles.settingIconInactive]}>
            <Info color="#71717a" size={24} />
          </View>
          <View style={styles.settingTextWrap}>
            <Text style={styles.settingOptionTitle}>Version</Text>
            <Text style={styles.settingOptionDesc}>1.0.0</Text>
          </View>
        </View>

        {/* Puanlama Butonu */}
        <TouchableOpacity 
          style={[styles.menuButton, { marginTop: 12, backgroundColor: '#27272a' }]} 
          onPress={handleRateApp}
          activeOpacity={0.7}
        >
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
            <Star color="#facc15" size={20} fill="#facc15" />
            <Text style={[styles.menuButtonText, { color: '#facc15' }]}>Rate App</Text>
          </View>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}