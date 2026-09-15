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

  // Time Machine Logic
  const tmBtn = document.getElementById('time-machine-btn');
  const tmResult = document.getElementById('time-machine-result');
  const tmYearVal = document.getElementById('tm-year-val');
  const tmQuoteText = document.getElementById('tm-quote-text');

  const czechDarkQuotes = [
    "Konec je počátek a počátek je konec.",
    "Otázkou není kde, ale KDY.",
    "To, co víme, je kapka. To, co nevíme, je oceán.",
    "Nejsme svobodní v tom, co děláme, protože nejsme svobodní v tom, co chceme.",
    "Co když všechno, co pochází z minulosti, má svůj původ v budoucnosti?",
    "Čas je vždycky s námi. Kamkoliv jdeme, nosíme si ho s sebou.",
    "Věřit v osud znamená věřit, že všechno má svůj důvod a že nic se neděje náhodou.",
    "Minulost nezmizí. Ovlivňuje každý náš přítomný okamžik.",
    "Některé věci se stávají jen proto, že se musí stát.",
    "Jsme vězni času, který se pohybuje pouze v kruhu."
  ];

  if (tmBtn && tmResult && tmYearVal && tmQuoteText) {
    tmBtn.addEventListener('click', () => {
      // Trigger animation state
      tmBtn.classList.add('active');
      tmResult.classList.add('hidden');

      setTimeout(() => {
        // Generate random year between 1800 and 2100 inclusive
        const randomYear = Math.floor(Math.random() * (2100 - 1800 + 1)) + 1800;
        // Select random quote from array
        const randomQuote = czechDarkQuotes[Math.floor(Math.random() * czechDarkQuotes.length)];

        tmYearVal.textContent = randomYear;
        tmQuoteText.textContent = `„${randomQuote}“`;

        tmBtn.classList.remove('active');
        tmResult.classList.remove('hidden');
      }, 700);
    });
  }

  // Send Message Slider and Submission Logic
  const yearSlider = document.getElementById('msg-year-slider');
  const sliderDisplay = document.getElementById('slider-year-display');
  const messageForm = document.getElementById('message-form');
  const commentsList = document.getElementById('comments-list');

  if (yearSlider && sliderDisplay) {
    yearSlider.addEventListener('input', (e) => {
      sliderDisplay.textContent = e.target.value;
    });
  }

  if (messageForm && commentsList) {
    messageForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const senderInput = document.getElementById('msg-sender');
      const textInput = document.getElementById('msg-text');

      const sender = senderInput ? senderInput.value.trim() : '';
      const year = yearSlider ? yearSlider.value : '2019';
      const text = textInput ? textInput.value.trim() : '';

      if (!sender || !text) return;

      // Format current date time string (DD.MM.YYYY HH:MM)
      const now = new Date();
      const dateStr = `${String(now.getDate()).padStart(2, '0')}.${String(now.getMonth() + 1).padStart(2, '0')}.${now.getFullYear()} ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;

      // Create new comment element
      const newComment = document.createElement('div');
      newComment.className = 'comment-item';
      newComment.innerHTML = `
        <div class="comment-author">
          <strong>${escapeHtml(sender)} <span class="comment-year-badge">(rok ${escapeHtml(year)})</span></strong>
          <span class="comment-date">${dateStr}</span>
        </div>
        <p>${escapeHtml(text)}</p>
      `;

      // Prepend or Append new message to comments list
      commentsList.appendChild(newComment);

      // Reset form
      senderInput.value = '';
      textInput.value = '';
      if (yearSlider && sliderDisplay) {
        yearSlider.value = '2019';
        sliderDisplay.textContent = '2019';
      }

      // Smooth scroll to newly added message
      newComment.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    });
  }

  function escapeHtml(str) {
    return str.replace(/[&<>"']/g, (m) => {
      return {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#039;'
      }[m];
    });
  }
});
