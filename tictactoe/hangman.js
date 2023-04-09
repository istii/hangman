const wordList = ['apple', 'banana', 'cherry']; // Replace this with words from your .txt file
const wordDisplay = document.querySelector('.word-display');
const usedLettersDisplay = document.querySelector('.used-letters');
const remainingGuessesDisplay = document.getElementById('remaining-guesses');
const resultDisplay = document.getElementById('result');
const submitButton = document.getElementById('submit-guess');
const restartButton = document.getElementById('restart');
const guessInput = document.getElementById('guess');
let word, guesses, usedLetters;
const backgroundMusic = document.getElementById('background-music');
const playMusicButton = document.getElementById('play-music');
const letterButtonsContainer = document.querySelector('.letter-buttons');
const colorOptions = [
    'hotpink', 'brightgreen', 'dodgerblue', 'gold', 'darkorange', 'mediumorchid',
    'coral', 'lime', 'deepskyblue', 'crimson', 'darkviolet', 'tomato'
  ];
  const newGameButton = document.getElementById('new-game');
  const correctGuessSound = document.getElementById('correct-guess-sound');
  const incorrectGuessSound = document.getElementById('incorrect-guess-sound');
  const winSound = document.getElementById('win-sound');
  const loseSound = document.getElementById('lose-sound');

  let gameEnded = false;


  newGameButton.addEventListener('click', () => {
    startGame();
    changeBackgroundColor();
  });

  function changeBackgroundColor() {
    const newColor = colorOptions[Math.floor(Math.random() * colorOptions.length)];
    document.body.style.backgroundColor = newColor;
  }

  function playNewInstanceOfSound(audioElement) {
    const newAudio = new Audio(audioElement.src);
    newAudio.play();
  }
  
function createLetterButtons() {
    const alphabet = 'abcdefghijklmnopqrstuvwxyz';
    for (const letter of alphabet) {
        const button = document.createElement('button');
        button.textContent = letter;
        button.dataset.letter = letter; // Add a data-letter attribute
        button.classList.add('letter-button');
        button.addEventListener('click', () => handleLetterButtonClick(letter));
        letterButtonsContainer.appendChild(button);
    }
}

function handleLetterButtonClick(letter) {
    guessInput.value = letter;
    checkGuess();
}

createLetterButtons();

function toggleBackgroundMusic() {
    if (backgroundMusic.paused) {
        backgroundMusic.play();
        playMusicButton.textContent = 'Pause Music';
    } else {
        backgroundMusic.pause();
        playMusicButton.textContent = 'Play Music';
    }
}

playMusicButton.addEventListener('click', toggleBackgroundMusic);

function startBackgroundMusic() {
    backgroundMusic.play();
}

window.addEventListener('load', startBackgroundMusic);


async function startGame() {
  const words = await loadWords();
  word = words[Math.floor(Math.random() * words.length)];
  guesses = 6;
  usedLetters = new Set();

  // Add these lines to restart the fade-in animation
  wordDisplay.classList.remove('fade-in');
  void wordDisplay.offsetWidth; // Force a reflow to restart the animation
  wordDisplay.classList.add('fade-in');
  
  updateDisplays();
  restartButton.hidden = true;
  submitButton.disabled = false;
  guessInput.disabled = false;
  gameEnded = false;
  resultDisplay.textContent = '';
  resetLetterButtons();
}

  
  async function loadWords() {
    try {
      const response = await fetch('words.txt');
      const data = await response.text();
      return data.split('\n').map(word => word.trim());
    } catch (error) {
      console.error('Error loading words:', error);
      return ['apple', 'banana', 'cherry']; // Fallback words in case of error
    }
  }
  function resetLetterButtons() {
    const letterButtons = document.querySelectorAll('.letter-button');
    for (const button of letterButtons) {
      button.disabled = false;
      button.classList.remove('correct');
      button.classList.remove('incorrect');
    }
  }

function updateDisplays() {
    wordDisplay.textContent = word.split('').map(letter => usedLetters.has(letter) ? letter : '_').join(' ');
    usedLettersDisplay.textContent = Array.from(usedLetters).join(', ');
    remainingGuessesDisplay.textContent = `Remaining guesses: ${guesses}`;
}

function disableLetterButton(letter, isCorrectGuess) {
    const letterButton = letterButtonsContainer.querySelector(`button.letter-button[data-letter="${letter}"]`);
    if (letterButton) {
      letterButton.disabled = true;
      letterButton.classList.add(isCorrectGuess ? 'correct' : 'incorrect');
    }
  }
function checkGuess() {
  if (gameEnded) {
    return;
  }
    const letter = guessInput.value.toLowerCase();
  if (letter.length === 1 && !usedLetters.has(letter)) {
    usedLetters.add(letter);
    const isCorrectGuess = word.includes(letter);
    disableLetterButton(letter, isCorrectGuess);
    if (isCorrectGuess) {
      playNewInstanceOfSound(correctGuessSound); // Replace the playSoundEffect function call
    } else {
      guesses--;
      playSoundEffect(incorrectGuessSound);
      }
    }
    updateDisplays();

    if (word.split('').every(letter => usedLetters.has(letter))) {
      resultDisplay.textContent = 'You won!';
      endGame();
    } else if (guesses === 0) {
      resultDisplay.textContent = `You lost! The word was "${word}".`;
      endGame();
    }
  }
  
  guessInput.value = '';
function playSoundEffect(soundEffect) {
    if (!soundEffect.paused) {
      soundEffect.pause();
      soundEffect.currentTime = 0;
    }
    soundEffect.play();
  }

function endGame() {
    submitButton.disabled = true;
    guessInput.disabled = true;
    restartButton.hidden = false;
    gameEnded = true; // Set gameEnded flag to true when the game ends
    if (word.split('').every(letter => usedLetters.has(letter))) {
        winSound.play();
      } else if (guesses === 0) {
        loseSound.play();
      }
}

submitButton.addEventListener('click', checkGuess);
guessInput.addEventListener('keyup', event => {
    if (event.key === 'Enter') {
        checkGuess();
    }
});
restartButton.addEventListener('click', () => {
    startGame();
    changeBackgroundColor();
  });
  

startGame();
