import { Dimensions, StyleSheet } from 'react-native';

const { width } = Dimensions.get('window');
const BOARD_PADDING = 16;
const BOARD_SIZE = width - (BOARD_PADDING * 2);

export const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#18181b', alignItems: 'center', justifyContent: 'center' },
  timerContainer: {
    backgroundColor: '#18181b',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#27272a',
    justifyContent: 'center',
    alignItems: 'center',
  },
  timerText: {
    color: '#d4d4d8',
    fontSize: 16,
    fontWeight: '600',
    fontVariant: ['tabular-nums'], 
  },
  resultTimeText: {
    color: '#71717a',
    fontSize: 14,
    marginBottom: 24,
    fontWeight: '500',
  },
  bestTimeText: {
  fontSize: 12,
  color: '#4ade80', // Başarı hissi vermesi için yumuşak bir yeşil
  fontWeight: '500',
  marginTop: -2,
},
  // --- MENU ---
  settingsIcon: { position: 'absolute', top: 40, right: 20, padding: 12, backgroundColor: '#18181b', borderRadius: 30 },
  menuContent: { width: '100%', maxWidth: 340, alignItems: 'center', gap: 40 },
  titleContainer: { alignItems: 'center' },
  titleColorsRow: { flexDirection: 'row', gap: 8, marginBottom: 16 },
  titleColorBox: { width:48, height: 48, borderRadius: 8, elevation: 5 },
  titleText: { fontSize:60, fontWeight: '300', color: '#f4f4f5', marginBottom: 8 },
  titleTextBold: { fontWeight: 'bold', color: '#71717a' },
  subtitleText: { color: '#a1a1aa', fontSize: 16 },
  buttonsContainer: { width: '100%', gap: 16, position: 'relative' },
  menuButton: { width: '100%', paddingVertical: 16, backgroundColor: '#26262b', borderWidth: 2, borderColor: '#27272a', borderRadius: 10, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 12 },
  menuButtonText: { fontSize: 20, fontWeight: '500', color: '#e4e4e7' },
  disabledButton: { opacity: 0.5 },
  loadingOverlay: { ...StyleSheet.absoluteFill, backgroundColor: 'rgba(9, 9, 11, 0.3)', zIndex: 10, justifyContent: 'center', alignItems: 'center', borderRadius: 16, gap: 12 },
  loadingText: { color: '#d4d4d8', fontSize: 14, fontWeight: '500' },
  fullScreenLoader: { flex: 1, backgroundColor: 'rgba(9, 9, 11, 0.85)', justifyContent: 'center', alignItems: 'center', gap: 16 },

  // --- SETTINGS ---
  settingsHeader: { width: '100%', maxWidth: 340, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 30 },
  settingsTitle: { fontSize: 28, fontWeight: '500', color: '#f4f4f5' },
  closeButton: { padding: 8, backgroundColor: '#18181b', borderRadius: 20 },
  settingsCard: { width: '100%', maxWidth: 340, backgroundColor: '#18181b', padding: 20, borderRadius: 16, borderWidth: 1, borderColor: '#27272a' },
  settingsSectionTitle: { fontSize: 16, color: '#a1a1aa', fontWeight: '500', borderBottomWidth: 1, borderBottomColor: '#27272a', paddingBottom: 10, marginBottom: 16 },
  settingOption: { flexDirection: 'row', alignItems: 'center', padding: 16, borderRadius: 12, borderWidth: 1, borderColor: '#27272a', marginBottom: 12, gap: 16 },
  settingOptionActive: { backgroundColor: '#27272a', borderColor: '#3f3f46' },
  settingIconWrap: { padding: 8, borderRadius: 8 },
  settingIconActivePaint: { backgroundColor: 'rgba(59, 130, 246, 0.2)' },
  settingIconActiveCell: { backgroundColor: 'rgba(74, 222, 128, 0.2)' },
  settingIconInactive: { backgroundColor: '#27272a' },
  settingTextWrap: { flex: 1 },
  settingOptionTitle: { fontWeight: '500', color: '#f4f4f5', fontSize: 16 },
  settingOptionDesc: { color: '#a1a1aa', fontSize: 13, marginTop: 4 },

  // --- GAME UI ---
  gameWrapper: { width: '100%', maxWidth: 400, padding: 16, gap: 24 },
  gameHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  iconButton: { padding: 10, backgroundColor: '#18181b', borderRadius: 20 },
  iconButtonActive: { backgroundColor: 'rgba(59, 130, 246, 0.15)' },
  heartsContainer: { flexDirection: 'row', gap: 6, backgroundColor: '#18181b', paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20, borderWidth: 1, borderColor: '#27272a' },
  rightHeaderControls: { flexDirection: 'row', gap: 8 },

  // --- BOARD ---
  boardContainer: { width: BOARD_SIZE, height: BOARD_SIZE, backgroundColor: '#18181b', padding: 5, borderRadius: 16, flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', alignContent: 'space-between', borderWidth: 2, borderColor: '#27272a' },
  block: { width: '32%', height: '32%', backgroundColor: '#27272a', borderRadius: 8, flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-evenly', alignContent: 'space-evenly', overflow: 'hidden' },
  cell: { width: '31%', height: '31%', borderRadius: 4, justifyContent: 'center', alignItems: 'center' },
  fixedDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: 'rgba(0,0,0,0.4)' },
  wrongCrossContainer: { ...StyleSheet.absoluteFill, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.2)' },
  wrongCrossLine: { position: 'absolute', width: 16, height: 3, backgroundColor: '#ef4444', borderRadius: 2 },

  // --- MODALS (WIN/LOSE) ---
  resultOverlay: { ...StyleSheet.absoluteFill, backgroundColor: 'rgba(9, 9, 11, 0.95)', borderRadius: 16, justifyContent: 'center', alignItems: 'center', zIndex: 20, padding: 20 },
  resultIconWrap: { width: 64, height: 64, borderRadius: 32, justifyContent: 'center', alignItems: 'center', marginBottom: 20 },
  resultIconWin: { backgroundColor: '#27272a', borderWidth: 1, borderColor: 'rgba(251, 191, 36, 0.2)' },
  resultIconLose: { backgroundColor: 'rgba(239, 68, 68, 0.1)', borderWidth: 1, borderColor: 'rgba(239, 68, 68, 0.2)' },
  brokenHeartLine: { position: 'absolute', width: 32, height: 4, backgroundColor: '#09090b', transform: [{ rotate: '45deg' }] },
  resultTitle: { fontSize: 28, fontWeight: '600', color: '#fff', marginBottom: 8 },
  resultDesc: { color: '#a1a1aa', fontSize: 16, marginBottom: 24 },
  resultButtons: { flexDirection: 'row', gap: 12 },
  resBtnSecondary: { paddingVertical: 12, paddingHorizontal: 24, backgroundColor: '#27272a', borderRadius: 24 },
  resBtnSecondaryText: { color: '#d4d4d8', fontWeight: '500', fontSize: 16 },
  resBtnPrimary: { paddingVertical: 12, paddingHorizontal: 24, backgroundColor: '#f4f4f5', borderRadius: 24 },
  resBtnPrimaryText: { color: '#09090b', fontWeight: '600', fontSize: 16 },

  // --- CONTROLS ---
  controlsContainer: { gap: 20, marginTop: 4 },
  modeBadgeWrap: { alignItems: 'center' },
  modeBadge: { flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: '#18181b', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 16, borderWidth: 1, borderColor: '#27272a' },
  modeBadgeText: { fontSize: 12, color: '#a1a1aa', fontWeight: '500' },
  paletteContainer: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center', gap: 14 },
  colorCircle: { width: 40, height: 40, borderRadius: 20, elevation: 3 },
  colorCircleSelected: { borderWidth: 4, borderColor: '#09090b', transform: [{ scale: 1.15 }] },
  colorCircleDisabled: { opacity: 0.3 },
  eraserContainer: { alignItems: 'center' },
  eraserButton: { flexDirection: 'row', alignItems: 'center', gap: 8, paddingHorizontal: 32, paddingVertical: 14, backgroundColor: '#18181b', borderRadius: 24 },
  eraserButtonActive: { backgroundColor: '#3f3f46', borderWidth: 2, borderColor: '#71717a' },
  eraserButtonDisabled: { opacity: 0.3 },
  eraserText: { color: '#a1a1aa', fontWeight: '500', fontSize: 16 },
  eraserTextActive: { color: '#ffffff' },
});