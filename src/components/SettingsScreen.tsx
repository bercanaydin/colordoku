import React from 'react';
import { View, Text, TouchableOpacity, SafeAreaView } from 'react-native';
import { X, PaintBucket, MousePointer2 } from 'lucide-react-native';
import { styles } from '../styles'; // Stillerinin olduğu dosya yolu

interface SettingsScreenProps {
  inputMode: string;
  onModeChange: (mode: string) => void;
  onClose: () => void;
}

export default function SettingsScreen({ inputMode, onModeChange, onClose }: SettingsScreenProps) {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.settingsHeader}>
        <Text style={styles.settingsTitle}>Settings</Text>
        <TouchableOpacity onPress={onClose} style={styles.closeButton}>
          <X color="#a1a1aa" size={24} />
        </TouchableOpacity>
      </View>

      <View style={styles.settingsCard}>
        <Text style={styles.settingsSectionTitle}>Input mode</Text>
        
        <TouchableOpacity 
          style={[styles.settingOption, inputMode === 'paint' && styles.settingOptionActive]}
          onPress={() => onModeChange('paint')}
          activeOpacity={0.7}
        >
          <View style={[styles.settingIconWrap, inputMode === 'paint' ? styles.settingIconActivePaint : styles.settingIconInactive]}>
            <PaintBucket color={inputMode === 'paint' ? '#60a5fa' : '#71717a'} size={24} />
          </View>
          <View style={styles.settingTextWrap}>
            <Text style={styles.settingOptionTitle}>Paint Mode</Text>
            <Text style={styles.settingOptionDesc}>Choose color and select(like painting).</Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity 
          style={[styles.settingOption, inputMode === 'cell' && styles.settingOptionActive]}
          onPress={() => onModeChange('cell')}
          activeOpacity={0.7}
        >
          <View style={[styles.settingIconWrap, inputMode === 'cell' ? styles.settingIconActiveCell : styles.settingIconInactive]}>
            <MousePointer2 color={inputMode === 'cell' ? '#4ade80' : '#71717a'} size={24} />
          </View>
          <View style={styles.settingTextWrap}>
            <Text style={styles.settingOptionTitle}>Cell Select</Text>
            <Text style={styles.settingOptionDesc}>Choose cell first.</Text>
          </View>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}