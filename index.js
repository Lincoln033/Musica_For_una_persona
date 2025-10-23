window.onload = () => {
  const lines = lyricsInput.value.split('\n').filter(l => l.trim() !== '');
  lyrics = lines.map(line => {
    const match = line.match(/^\[(\d{2}):(\d{2})\](.*)$/);
    if (match) {
      const time = parseInt(match[1]) * 60 + parseInt(match[2]);
      return { time, text: match[3].trim() };
    } else {
      return { time: 0, text: line.trim() };
    }
  });

  lyricsContainer.innerHTML = '';
  lyrics.forEach(l => {
    const div = document.createElement('div');
    div.className = 'line';
    div.textContent = l.text;
    lyricsContainer.appendChild(div);
  });

  // Começa o áudio e as legendas
  audio.play();
  requestAnimationFrame(updateLyrics);
};
