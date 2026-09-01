export const saveWorldRecord = async (playerName: string, time: number, difficulty: string) => {
  // Sadece "Zor" seviye rekorlarını filtrele
  if (difficulty !== 'Zor') return;

  try {
    const response = await fetch('http://bercan.blog/save_score.php', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        player: playerName,
        time: time,
      })
    });

    const json = await response.json();
    console.log('Rekor sonucu:', json);
  } catch (error) {
    console.error('Rekor kaydedilemedi: ', error);
  }
};