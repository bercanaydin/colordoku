import { Eraser, MousePointer2, PaintBucket } from 'lucide-react-native';
import { Text, TouchableOpacity, View } from 'react-native';
import { COLORS } from '../constants/constants';
import { styles } from '../styles';

interface GameControlsProps {
  inputMode: string;
  selectedColor: number;
  selectedCell: number | null;
  handleColorClick: (colorIdx: number) => void;
}

export default function GameControls({
  inputMode,
  selectedColor,
  selectedCell,
  handleColorClick,
}: GameControlsProps) {
  return (
    <View style={styles.controlsContainer}>
      <View style={styles.modeBadgeWrap}>
        <View style={styles.modeBadge}>
          {inputMode === 'paint' ? (
            <PaintBucket color="#a1a1aa" size={14} />
          ) : (
            <MousePointer2 color="#a1a1aa" size={14} />
          )}
          <Text style={styles.modeBadgeText}>
            {inputMode === 'paint' ? 'Paint Mode Active' : 'Cell Select Mode Active'}
          </Text>
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
                isDisabledLook && styles.colorCircleDisabled,
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
            inputMode === 'paint' && selectedColor === 0 ? styles.eraserButtonActive : null,
            inputMode === 'cell' && selectedCell === null ? styles.eraserButtonDisabled : null,
          ]}
        >
          <Eraser
            color={inputMode === 'paint' && selectedColor === 0 ? '#ffffff' : '#a1a1aa'}
            size={20}
          />
          <Text
            style={[
              styles.eraserText,
              inputMode === 'paint' && selectedColor === 0 && styles.eraserTextActive,
            ]}
          >
            {inputMode === 'paint' ? 'Eraser Tool' : 'Erase Selected'}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}