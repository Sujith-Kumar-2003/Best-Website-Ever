const playButtons = document.querySelectorAll('.play-button');
const seekBars = document.querySelectorAll('.seek-bar');

let audio = new Audio();
let currentPlaying = null;
let currentSeekBar = null;
let currentButton = null;

// Reusable function to reset previous track
function resetPrevious() {
  if (currentSeekBar) currentSeekBar.value = 0;
  if (currentButton) currentButton.textContent = 'Play ▶';
  currentPlaying = null;
  currentSeekBar = null;
  currentButton = null;
}

// Timeupdate listener (only one)
audio.addEventListener('timeupdate', () => {
  if (currentSeekBar && !isNaN(audio.duration)) {
    currentSeekBar.value = (audio.currentTime / audio.duration) * 100;
  }
});

// On audio end
audio.addEventListener('ended', () => {
  resetPrevious();
});

// Add event listeners
playButtons.forEach((button) => {
  const musicItem = button.closest('.music-item');
  const audioSrc = musicItem.getAttribute('data-src');
  const seekBar = musicItem.querySelector('.seek-bar');

  // Add seekBar change listener ONCE
  if (!seekBar.hasAttribute('data-listener-attached')) {
    seekBar.addEventListener('input', () => {
      if (!isNaN(audio.duration)) {
        audio.currentTime = (seekBar.value / 100) * audio.duration;
      }
    });
    seekBar.setAttribute('data-listener-attached', 'true');
  }

  button.addEventListener('click', () => {
    // Play new audio
    if (currentPlaying !== audioSrc) {
      resetPrevious();
      audio.src = audioSrc;
      audio.play();

      button.textContent = 'Pause ⏸';
      currentPlaying = audioSrc;
      currentSeekBar = seekBar;
      currentButton = button;
    } else {
      // Toggle pause/resume
      if (audio.paused) {
        audio.play();
        button.textContent = 'Pause ⏸';
      } else {
        audio.pause();
        button.textContent = 'Play ▶';
      }
    }
  });
});
