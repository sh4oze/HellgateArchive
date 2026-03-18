// Scroll reveal
const revealEls = document.querySelectorAll('.reveal');
const observer = new IntersectionObserver((entries) => {
  entries.forEach((e) => {
    if (e.isIntersecting) {
      e.target.classList.add('visible');
    }
  });
}, { threshold: 0.12 });
revealEls.forEach((el) => observer.observe(el));

// HUD health bar updates as you scroll
window.addEventListener('scroll', () => {
  const max = document.body.scrollHeight - window.innerHeight;
  const pct = Math.round((1 - window.scrollY / max) * 100);
  document.getElementById('hud-hp').textContent = Math.max(1, pct) + '%';
});

// Random flicker on title
setInterval(() => {
  const t = document.querySelector('.hero-title');
  if (t && Math.random() < 0.05) {
    t.style.textShadow = '0 0 2px rgba(192,57,43,0.4)';
    setTimeout(() => {
      t.style.textShadow = '';
    }, 80);
  }
}, 300);

// Music player
const player = document.getElementById('doom-player');
const nowPlaying = document.getElementById('now-playing');
const nowPlayingOrigin = document.getElementById('now-playing-origin');
const musicStatus = document.getElementById('music-status');
const trackItems = document.querySelectorAll('.track-item[data-audio]');

function setActiveTrack(activeTrack) {
  trackItems.forEach((track) => track.classList.remove('is-active'));
  if (activeTrack) {
    activeTrack.classList.add('is-active');
  }
}

function playTrack(track) {
  const audioFile = track.dataset.audio;
  const trackTitle = track.dataset.title || 'Faixa sem nome';
  const trackOrigin = track.dataset.origin || 'Faixa selecionada';

  if (!audioFile || !player) return;

  if (player.getAttribute('src') !== audioFile) {
    player.src = audioFile;
  }

  player.play().then(() => {
    nowPlaying.textContent = trackTitle;
    nowPlayingOrigin.textContent = trackOrigin;
    musicStatus.textContent = 'REPRODUZINDO';
    setActiveTrack(track);
  }).catch(() => {
    nowPlaying.textContent = trackTitle;
    nowPlayingOrigin.textContent = 'Não foi possível iniciar. Verifique se o arquivo existe na pasta musicas/.';
    musicStatus.textContent = 'ARQUIVO AUSENTE';
    setActiveTrack(track);
  });
}

trackItems.forEach((track) => {
  track.addEventListener('click', () => playTrack(track));
});

if (player) {
  player.addEventListener('play', () => {
    if (musicStatus) musicStatus.textContent = 'REPRODUZINDO';
  });

  player.addEventListener('pause', () => {
    if (!player.ended && musicStatus) musicStatus.textContent = 'PAUSADO';
  });

  player.addEventListener('ended', () => {
    if (musicStatus) musicStatus.textContent = 'FINALIZADA';
  });

  player.addEventListener('error', () => {
    if (musicStatus) musicStatus.textContent = 'ERRO DE ÁUDIO';
    if (nowPlayingOrigin) {
      nowPlayingOrigin.textContent = 'O navegador não encontrou o arquivo configurado. Confira a pasta musicas/ e os nomes dos arquivos.';
    }
  });
}
