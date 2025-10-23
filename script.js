console.log('Script iniciado');

const audio = document.getElementById('audio');
const lyricsContainer = document.getElementById('lyricsContainer');
const shareButton = document.getElementById('shareButton');

if (!lyricsContainer) {
  document.body.innerHTML = '<div style="color: red; font-size: 2em; text-align: center;">Erro: lyricsContainer não encontrado</div>';
  console.error('Erro: lyricsContainer não encontrado');
}

const rawLyrics = `
[00:00] Del gran sueño no me quiero despertar
[00:10] Y me falla un poco más mi realidad
[00:19] Aún los llevo pasando por la yugular
[00:28] Y el recuerdo se convierte atemporal
[00:36] En esta casa no existen fantasmas
[00:40] Son puros recuerdos
[00:45] De tiempos ajenos
[00:49] De buenos momentos
[00:54] En el cielo volaban los buitres
[00:57] Que auguran deceso
[01:02] El fin de los tiempos
[01:06] Nos hacemos eternos
[01:50] Tantas fotos llenando los marcos
[01:52] Mi propio museo
[01:57] No hay muchos trofeos
[02:01] Con ustedes tengo
[02:05] Y aunque te lleve en la sangre
[02:09] Me duele sentirte tan lejos
[02:14] Destellas el cielo
[02:19] Y ahora te celebro
[02:23] Lo sigo intentando
[02:27] Tan cerca el impacto
[02:32] Hay que ser bien fuertes
[02:34] Pa' ver a la muerte
[02:36] Derecho y honrado
[02:41] Cansado de pensarlo
[02:45] No puedo evitarlo
[02:49] Quiero estar juntitos
[02:52] Tomarme contigo un último trago
[02:58] Oh-oh, oh-oh-oh (un último trago)
[02:51] Ya viví lo que pude vivir
[03:14] Perdón que me tenga que ir
[03:19] En la noche conquisto el silencio
[03:23] Y la ausencia del ruido genera un vacío
[03:32] Perdón que me tenga que ir
[03:41] Perdón que me tenga que ir
[03:48] Oh, oh, oh, oh-oh-oh-oh
[04:09] En esta casa no existen fantasmas
[04:13] Son puros recuerdos
[04:17] Son mil sentimientos
[04:22] De lo que vivimos
[04:24] Quando tú estabas aqui
[04:46] (Fim da música)
`;

let lyrics = [];

function loadLyrics() {
  console.log('loadLyrics chamado');
  lyricsContainer.innerHTML = '';

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

  if (lyrics.length === 0) {
    lyricsContainer.innerHTML = '<div class="error-message">Erro: Letras não carregadas</div>';
    console.error('Erro: Nenhuma letra carregada');
    return;
  }

  lyricsContainer.innerHTML = `<div class="line visible">${lyrics[0].text}</div>`;
  console.log('Primeira linha exibida: ', lyrics[0].text);
}

function updateLyrics() {
  const currentTime = audio.currentTime;
  console.log(`Tempo atual: ${currentTime}s`);
  let currentLyric = null;

  for (let i = 0; i < lyrics.length; i++) {
    const nextTime = lyrics[i + 1] ? lyrics[i + 1].time : Infinity;
    if (currentTime >= lyrics[i].time && currentTime < nextTime) {
      currentLyric = lyrics[i];
      break;
    }
  }

  if (currentLyric) {
    lyricsContainer.innerHTML = `<div class="line visible">${currentLyric.text}</div>`;
    console.log(`Linha visível: ${currentLyric.text}`);
  } else {
    lyricsContainer.innerHTML = '<div class="line"></div>';
  }

  requestAnimationFrame(updateLyrics);
}

audio.onerror = () => {
  lyricsContainer.innerHTML = '<div class="error-message">Erro ao carregar o áudio. Verifique o arquivo.</div>';
  console.error('Erro no áudio: arquivo não carregado');
};

// Função de compartilhamento
if (shareButton) {
  shareButton.addEventListener('click', async () => {
    const shareData = {
      title: 'Letra com Música - Fantasmas (Humbe)',
      text: 'Confira a letra sincronizada com a música Fantasmas de Humbe!',
      url: window.location.href
    };

    try {
      if (navigator.share) {
        await navigator.share(shareData);
        console.log('Link compartilhado com sucesso');
      } else {
        navigator.clipboard.writeText(shareData.url);
        alert('Link copiado para a área de transferência!');
        console.log('Link copiado para a área de transferência');
      }
    } catch (err) {
      console.error('Erro ao compartilhar:', err);
      alert('Erro ao compartilhar. O link foi copiado para a área de transferência.');
      navigator.clipboard.writeText(shareData.url);
    }
  });
}

document.addEventListener('DOMContentLoaded', () => {
  console.log('DOM carregado');
  if (!audio) {
    lyricsContainer.innerHTML = '<div class="error-message">Erro: Elemento de áudio não encontrado</div>';
    console.error('Erro: Elemento de áudio não encontrado');
    return;
  }

  loadLyrics();

  // Adiciona overlay para interação
  const startOverlay = document.createElement('div');
  startOverlay.id = 'startOverlay';
  startOverlay.className = 'start-overlay';
  startOverlay.textContent = 'Toque na tela para iniciar a música';
  document.body.appendChild(startOverlay);

  // Evento de toque/clique para iniciar
  startOverlay.addEventListener('click', () => {
    console.log('Toque detectado, iniciando áudio');
    startOverlay.style.display = 'none';
    audio.play().catch(e => {
      console.error('Erro ao reproduzir áudio:', e);
      lyricsContainer.innerHTML = '<div class="error-message">Erro ao iniciar o áudio</div>';
    });
    requestAnimationFrame(updateLyrics);
  }, { once: true });
});