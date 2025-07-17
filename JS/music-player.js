const playButtons = document.querySelectorAll('.play-button');
const seekBars = document.querySelectorAll('.seek-bar');

let audio = new Audio();
let currentPlaying = null;
let currentSeekBar = null;
let currentButton = null;

// Clear previous timeupdate listeners
audio.addEventListener('timeupdate', () => {
  if (currentSeekBar && !isNaN(audio.duration)) {
    currentSeekBar.value = (audio.currentTime / audio.duration) * 100;
  }
});

// Reset on audio end
audio.addEventListener('ended', () => {
  if (currentSeekBar) currentSeekBar.value = 0;
  if (currentButton) currentButton.textContent = 'Play ▶️';
  currentPlaying = null;
});

playButtons.forEach((button) => {
  const musicItem = button.closest('.music-item');
  const audioSrc = musicItem.getAttribute('data-src');
  const seekBar = musicItem.querySelector('.seek-bar');

  button.addEventListener('click', () => {
    if (currentPlaying !== audioSrc) {
      // Switch to new audio
      audio.src = audioSrc;
      audio.play();

      // Reset all buttons
      playButtons.forEach(btn => btn.textContent = 'Play ▶️');
      button.textContent = 'Pause ⏸️';

      currentPlaying = audioSrc;
      currentSeekBar = seekBar;
      currentButton = button;

    } else {
      // Toggle play/pause
      if (audio.paused) {
        audio.play();
        button.textContent = 'Pause ⏸️';
      } else {
        audio.pause();
        button.textContent = 'Play ▶️';
      }
    }

    // Sync seekBar input
    seekBar.addEventListener('input', () => {
      audio.currentTime = (seekBar.value / 100) * audio.duration;
    });
  });
});
