import React, { useEffect } from 'react';
import { View, Text } from 'react-native';
import { styles } from '../styles';
import { formatTime } from '../constants/gameLogic';

interface GameTimerProps {
  timeElapsed: number;
  setTimeElapsed: React.Dispatch<React.SetStateAction<number>>;
  isPlaying: boolean;
}

export default function GameTimer({ timeElapsed, setTimeElapsed, isPlaying }: GameTimerProps) {
  useEffect(() => {
   let timer: ReturnType<typeof setInterval>;
    if (isPlaying) {
      timer = setInterval(() => {
        setTimeElapsed((prev) => prev + 1);
      }, 1000);
    }
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [isPlaying, setTimeElapsed]);

  return (
    <View style={styles.timerContainer}>
      <Text style={styles.timerText}>{formatTime(timeElapsed)}</Text>
    </View>
  );
}