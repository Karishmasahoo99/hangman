const wordEl = document.getElementById("word");
const wrongLettersEl = document.getElementById("wrong-letters");
const playAgainBtn = document.getElementById("play-button");
const popup = document.getElementById("popup-container");
const notification = document.getElementById("notification-container");
const finalMessage = document.getElementById("final-message");
const figureHidden = document.querySelectorAll(".figure-hidden");


const correctLetters = [];
const wrongLetters = [];
let word;
// Function to fetch new word from the API

function fetchNewWord() {
  fetch('https://random-word-api.vercel.app/api?words=1')
    .then(response => response.json())
    .then(data => {
      word = data[0];
      console.log(data[0]);
      
      // Call necessary functions to initialize the game with the new word
      displayWord();
      updateWrongLettersEl();
    })
    .catch(error => console.error('Error fetching data:', error));
}

// Function to display the word
function displayWord() {
  wordEl.innerHTML = `${word.split('').map(letter => `
      <span class="letter">
        ${correctLetters.includes(letter) ? letter : ''}
      </span>
    `)
    .join('')
  }`;

  const innerWord = wordEl.innerText.replace(/\n/g, '');
 // console.log(innerWord)
  if (innerWord === word) {
    finalMessage.innerText = "Congratulations! You won😁";
    popup.style.display = 'flex';
  }
}

// Function to update wrong letters
function updateWrongLettersEl() {
  wrongLettersEl.innerHTML = `
    ${wrongLetters.length > 0 ? '<p>Wrong</p>' : ''}
    ${wrongLetters.map(letter => `<span>${letter}</span>`)}
  `;

  figureHidden.forEach((part, index) => {
    const errors = wrongLetters.length;

    if (index < errors) {
      part.style.display = 'block';
    } else {
      part.style.display = "";
    }
  });

  if (wrongLetters.length === figureHidden.length) {
    finalMessage.innerText = "Unfortunately you lost, 😢";
    popup.style.display = "flex";
  }
}

// Function to show notification
function showNotification() {
  notification.classList.add('show');
  setTimeout(() => {
    notification.classList.remove('show');
  }, 2000)
}

// Keydown event listener for letter press
window.addEventListener("keydown", e => {
  if (e.keyCode >= 65 && e.keyCode <= 90) {
    const letter = e.key;

    if (word.includes(letter)) {
      if (!correctLetters.includes(letter)) {
        correctLetters.push(letter);
        displayWord();
      } else {
        showNotification();
      }
    } else {
      if (!wrongLetters.includes(letter)) {
        wrongLetters.push(letter);
        updateWrongLettersEl();
      } else {
        showNotification();
      }
    }
  }
});

// Click event listener for "Play Again" button
playAgainBtn.addEventListener("click", () => {
  // Clear correct and wrong letters arrays
  correctLetters.splice(0);
  wrongLetters.splice(0);

  // Fetch new word and initialize the game
  fetchNewWord();

  // Hide the popup
  popup.style.display = "none";
});

// Initial fetch and game initialization
fetchNewWord();
