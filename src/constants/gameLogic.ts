export const isValidPlacement = (board: number[], index: number, val: number): boolean => {
  const row = Math.floor(index / 9);
  const col = index % 9;
  const block = Math.floor(row / 3) * 3 + Math.floor(col / 3);

  for (let i = 0; i < 81; i++) {
    if (i === index) continue;
    if (board[i] === val) {
      const iRow = Math.floor(i / 9);
      const iCol = i % 9;
      const iBlock = Math.floor(iRow / 3) * 3 + Math.floor(iCol / 3);
      if (row === iRow || col === iCol || block === iBlock) return false;
    }
  }
  return true;
};

export const countSolutions = (board: number[]): number => {
  let count = 0;
  const solve = () => {
    if (count > 1) return;
    let emptyIndex = -1;
    for (let i = 0; i < 81; i++) {
      if (board[i] === 0) {
        emptyIndex = i;
        break;
      }
    }
    if (emptyIndex === -1) {
      count++;
      return;
    }
    for (let val = 1; val <= 9; val++) {
      if (isValidPlacement(board, emptyIndex, val)) {
        board[emptyIndex] = val;
        solve();
        board[emptyIndex] = 0;
      }
    }
  };
  solve();
  return count;
};


export const formatTime = (seconds: number) => {
  const m = Math.floor(seconds / 60).toString().padStart(2, '0');
  const s = (seconds % 60).toString().padStart(2, '0');
  return `${m}:${s}`;
};