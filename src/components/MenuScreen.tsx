import React from 'react';
import { View, Text, TouchableOpacity, ActivityIndicator, SafeAreaView, StatusBar } from 'react-native';
import { Play, Settings } from 'lucide-react-native';
import { styles } from '../styles';
import { COLORS } from '../constants/constants';

interface MenuScreenProps {
  generateGame: (diff: string) => void;
  isGenerating: boolean;
  onOpenSettings: () => void;
}

export default function MenuScreen({ generateGame, isGenerating, onOpenSettings }: MenuScreenProps) {
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#09090b" />
      <TouchableOpacity style={styles.settingsIcon} onPress={onOpenSettings} disabled={isGenerating}>
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
              <Play color="#a1a1aa" size={20} />
              <Text style={styles.menuButtonText}>{diff}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    </SafeAreaView>
  );
}