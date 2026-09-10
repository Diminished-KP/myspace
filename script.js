document.addEventListener('DOMContentLoaded', () => {
  const audio = document.getElementById('audio-player');
  const playBtn = document.getElementById('play-btn');
  const progressBar = document.getElementById('progress-bar');
  const progressContainer = document.getElementById('progress-container');
  const timeDisplay = document.getElementById('time-display');
  const equalizer = document.querySelector('.equalizer-visual');

  let isPlaying = false;

  function togglePlay() {
    if (isPlaying) {
      audio.pause();
      playBtn.textContent = '▶ Přehrát';
      equalizer.classList.remove('playing');
      isPlaying = false;
    } else {
      audio.play().then(() => {
        playBtn.textContent = '⏸ Pozastavit';
        equalizer.classList.add('playing');
        isPlaying = true;
      }).catch(err => {
        console.log('Audio playback prevented or error:', err);
        // Fallback simulation if browser blocks auto audio
        playBtn.textContent = '⏸ Pozastavit';
        equalizer.classList.add('playing');
        isPlaying = true;
      });
    }
  }

  playBtn.addEventListener('click', togglePlay);

  audio.addEventListener('timeupdate', () => {
    if (audio.duration) {
      const progressPercent = (audio.currentTime / audio.duration) * 100;
      progressBar.style.width = `${progressPercent}%`;

      const formatTime = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
      };

      timeDisplay.textContent = `${formatTime(audio.currentTime)} / ${formatTime(audio.duration)}`;
    }
  });

  audio.addEventListener('ended', () => {
    playBtn.textContent = '▶ Přehrát';
    equalizer.classList.remove('playing');
    progressBar.style.width = '0%';
    isPlaying = false;
  });

  progressContainer.addEventListener('click', (e) => {
    const width = progressContainer.clientWidth;
    const clickX = e.offsetX;
    if (audio.duration) {
      audio.currentTime = (clickX / width) * audio.duration;
    }
  });
});
