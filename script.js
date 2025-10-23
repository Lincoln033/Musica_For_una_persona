const audio = document.getElementById('audio');
const lyricsContainer = document.getElementById('lyricsContainer');
const testMessage = document.getElementById('testMessage');

const rawLyrics = `
[00:00] (Sem letra, violão dedilhado suave, build-up emocional)
[00:10] Del gran sueño no me quiero despertar
[00:15] Y me falla un poco más mi realidad
[00:20] Aún los llevo pasando por la yugular
[00:25] Y el recuerdo se convierte temporal
[00:30] En esta casa no existem fantasmas
[00:35] Son puros recuerdos
[00:38] De tiempos ajenos
[00:41] De buenos momentos
[00:44] En el cielo volaban los buitres
[00:49] Que auguran deceso
[00:54] El fin de los tiempos
[00:59] Nos hacemos eternos
[01:04] (Guitarra melódica, arpejos suaves)
[01:24] Tantas fotos llenando los marcos
[01:29] Mi propio museo
[01:34] No hay muchos trofeos
[01:39] Con ustedes, tengo
[01:44] Y aunque te lleve en la sangre
[01:49] Me duele sentirte tan lejos
[01:54] Destellas el cielo
[01:59] Y ahora te celebro
[02:04] Lo sigo intentando
[02:09] Tan cerca el impacto
[02:14] Hay que ser bien fuertes
[02:19] Pa' ver a la muerte
[02:24] Derecho y honrado
[02:29] Cansa'o de pensarlo, oh
[02:34] No puedo evitarlo
[02:39] Quiero estar juntitos
[02:44] Tomarme contigo un último trago
[02:49] Oh-oh, oh-oh-oh (un último trago)
[02:54] Ya viví lo que pude vivir
[02:59] Perdón que me tenga que ir
[03:04] En la noche, conquisto el silencio
[03:09] Y la ausencia del ruido genera un vacío
[03:14] Perdón que me tenga que ir
[03:19] Perdón que me tenga que ir
[03:24] Oh, oh, oh, oh-oh-oh-oh
[03:29] En esta casa no existen fantasmas
[03:34] Son puros recuerdos
[03:37] Son mil sentimientos
[03:40] De lo que vivimos
[03:43] Cuando tú estabas aqui
[03:48] (Instrumental, eco vocal suave)
[03:58] En esta casa no existen fantasmas
[04:03] Son puros recuerdos
[04:08] Son mil sentimientos
[04:13] De lo que vivimos
[04:18] Cuando tú estabas aqui
[04:23] (Fade-out instrumental)
[04:33] (Silêncio com eco suave)
[04:47] (Fim da música)
`;

let lyrics = [];

function loadLyrics() {
  if (!lyricsContainer) {
    document.body.innerHTML = '<div class="error-message">Erro: lyricsContainer não encontrado</div>';
    console.error('Erro: lyricsContainer não encontrado');
    return;
  }

  const lines = rawLyrics.trim().split('\n').filter(l => l.trim() !== '');
  lyrics = lines.map(line => {
    const match = line.match(/^\[(\d{2}):(\d{2})\](.*)$/);
    if (match) {
      const time = parseInt(match[1]) * 60 + parseInt(match[2]);
      console.log(`Linha: ${line}, Tempo: ${time}s`);
      return { time, text: match[3].trim() };
    } else {
      console.warn(`Linha sem timestamp: ${line}`);
      return { time: 0, text: line.trim() };
    }
  });

  lyricsContainer.innerHTML = '';
  if (lyrics.length === 0) {
    const errorMsg = document.createElement('div');
    errorMsg.className = 'error-message';
    errorMsg.textContent = 'Erro: Letras não carregadas';
    lyricsContainer.appendChild(errorMsg);
    console.error('Erro: Nenhuma letra carregada');
    return;
  }

  lyrics.forEach(l => {
    const div = document.createElement('div');
    div.className = 'line';
    div.textContent = l.text;
    lyricsContainer.appendChild(div);
  });

  // Exibir a primeira linha imediatamente
  if (lyricsContainer.children[0]) {
    lyricsContainer.children[0].classList.add('visible');
    console.log('Primeira linha exibida: ', lyricsContainer.children[0].textContent);
    testMessage.textContent = 'Teste: Letras carregadas com sucesso';
  } else {
    const errorMsg = document.createElement('div');
    errorMsg.className = 'error-message';
    errorMsg.textContent = 'Erro: Nenhuma linha renderizada';
    lyricsContainer.appendChild(errorMsg);
    console.error('Erro: Nenhuma linha no lyricsContainer');
  }
}

function updateLyrics() {
  const currentTime = audio.currentTime;
  console.log(`Tempo atual: ${currentTime}s`);
  for (let i = 0; i < lyrics.length; i++) {
    const nextTime = lyrics[i + 1] ? lyrics[i + 1].time : Infinity;
    const lineEl = lyricsContainer.children[i];
    if (lineEl && currentTime >= lyrics[i].time && currentTime < nextTime) {
      lineEl.classList.add('visible');
      console.log(`Linha visível: ${lineEl.textContent}`);
    } else if (lineEl) {
      lineEl.classList.remove('visible');
    }
  }
  requestAnimationFrame(updateLyrics);
}

audio.onerror = () => {
  const errorMsg = document.createElement('div');
  errorMsg.className = 'error-message';
  errorMsg.textContent = 'Erro ao carregar o áudio. Verifique o arquivo.';
  lyricsContainer.appendChild(errorMsg);
  console.error('Erro no áudio: arquivo não carregado');
  testMessage.textContent = 'Teste: Erro no áudio';
};

window.onload = () => {
  console.log('Página carregada');
  if (!lyricsContainer) {
    document.body.innerHTML = '<div class="error-message">Erro: lyricsContainer não encontrado</div>';
    console.error('Erro: lyricsContainer não encontrado');
    return;
  }

  if (!audio) {
    const errorMsg = document.createElement('div');
    errorMsg.className = 'error-message';
    errorMsg.textContent = 'Erro: Elemento de áudio não encontrado';
    lyricsContainer.appendChild(errorMsg);
    console.error('Erro: Elemento de áudio não encontrado');
    return;
  }

  loadLyrics();
  if (!lyricsContainer.children.length) {
    const errorMsg = document.createElement('div');
    errorMsg.className = 'error-message';
    errorMsg.textContent = 'Erro: Nenhuma letra carregada no container';
    lyricsContainer.appendChild(errorMsg);
    console.error('Erro: lyricsContainer vazio');
    return;
  }

  const msg = document.createElement('div');
  msg.className = 'start-message';
  msg.textContent = 'Clique na tela para começar 🎵';
  lyricsContainer.appendChild(msg);

  document.body.addEventListener('click', () => {
    console.log('Clique detectado, iniciando áudio');
    audio.play().catch(e => {
      console.error('Erro ao reproduzir áudio:', e);
      const errorMsg = document.createElement('div');
      errorMsg.className = 'error-message';
      errorMsg.textContent = 'Erro ao iniciar o áudio';
      lyricsContainer.appendChild(errorMsg);
      testMessage.textContent = 'Teste: Erro ao iniciar o áudio';
    });
    msg.classList.remove('visible');
    requestAnimationFrame(updateLyrics);
  }, { once: true });
};