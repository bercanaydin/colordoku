import { TouchableOpacity, View } from 'react-native';
import { COLORS } from '../constants/constants';
import { styles } from '../styles';

// Bileşenin beklediği özellikleri (props) tanımlıyoruz
interface GameBoardProps {
  board: number[];
  solvedBoard: number[];
  fixedCells: boolean[];
  conflicts: Set<number>;
  selectedCell: number | null;
  inputMode: string;
  handleCellClick: (index: number) => void;
}

export default function GameBoard({
  board,
  solvedBoard,
  fixedCells,
  conflicts,
  selectedCell,
  inputMode,
  handleCellClick,
}: GameBoardProps) {
  return (
    <>
      {Array.from({ length: 9 }).map((_, blockIdx) => (
        <View key={blockIdx} style={styles.block}>
          {Array.from({ length: 9 }).map((_, cellIdx) => {
            // Hücrenin satır, sütun ve genel indeksini hesaplıyoruz
            const row = Math.floor(blockIdx / 3) * 3 + Math.floor(cellIdx / 3);
            const col = (blockIdx % 3) * 3 + (cellIdx % 3);
            const index = row * 9 + col;

            const isFixed = fixedCells[index];
            const val = board[index];
            const isConflict = conflicts.has(index);
            const isWrong = val !== 0 && !isFixed && val !== solvedBoard[index];
            const isSelected = inputMode === 'cell' && selectedCell === index;

            // Hata, çakışma veya seçim durumuna göre çerçeve stilini belirliyoruz
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
                  borderStyle,
                ]}
              >
                {/* Sabit hücre noktası */}
                {isFixed && <View style={styles.fixedDot} />}
                
                {/* Hatalı hücre çarpı işareti */}
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
    </>
  );
}