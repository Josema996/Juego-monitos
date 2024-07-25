const gameBoard = document.getElementById('game-board');
const scoreDisplay = document.getElementById('score');
const timerDisplay = document.getElementById('timer');
const bellSound = document.getElementById('bell-sound');
const applauseSound = document.getElementById('applause-sound');

let cards = [];
let firstCard, secondCard;
let hasFlippedCard = false;
let lockBoard = false;
let score = 0;
let timeLeft = 90; // 1:30 in seconds
let timer;

const monkeyImages = [
    'monitos1.jpg',
    'monitos2.jpg',
    'monitos3.jpg',
    'monitos4.jpg',
    'monitos5.jpg'
];

function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

function createBoard() {
    const cardValues = Array.from({ length: 8 }, (_, i) => i % 5).concat(Array.from({ length: 8 }, (_, i) => i % 5));
    shuffle(cardValues);
    cardValues.forEach(value => {
        const card = document.createElement('div');
        card.classList.add('card');
        card.dataset.value = value;
        card.innerHTML = `
            <div class="front"><img src="${monkeyImages[value]}" alt="Monkey"></div>
            <div class="back"></div>
        `;
        card.addEventListener('click', flipCard);
        gameBoard.appendChild(card);
        cards.push(card);
    });
}

function flipCard() {
    if (lockBoard) return;
    if (this === firstCard) return;

    this.classList.add('flipped');

    if (!hasFlippedCard) {
        hasFlippedCard = true;
        firstCard = this;
        return;
    }

    secondCard = this;
    checkForMatch();
}

function checkForMatch() {
    let isMatch = firstCard.dataset.value === secondCard.dataset.value;

    if (isMatch) {
        disableCards();
        score++;
        scoreDisplay.textContent = `Puntos: ${score}`;
        if (score === 8) {
            gameWon();
        }
    } else {
        unflipCards();
    }
}

function disableCards() {
    firstCard.removeEventListener('click', flipCard);
    secondCard.removeEventListener('click', flipCard);
    resetBoard();
}

function unflipCards() {
    lockBoard = true;
    setTimeout(() => {
        firstCard.classList.remove('flipped');
        secondCard.classList.remove('flipped');
        resetBoard();
    }, 1000);
}

function resetBoard() {
    [hasFlippedCard, lockBoard] = [false, false];
    [firstCard, secondCard] = [null, null];
}

function startTimer() {
    timer = setInterval(() => {
        timeLeft--;
        const minutes = Math.floor(timeLeft / 60);
        const seconds = timeLeft % 60;
        timerDisplay.textContent = `Tiempo: ${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
        if (timeLeft === 0) {
            clearInterval(timer);
            bellSound.play();
            setTimeout(() => {
                shuffleBoard();
                timeLeft = 90;
                startTimer();
            }, 2000); // 2 seconds to enjoy the bell sound
        }
    }, 1000);
}

function shuffleBoard() {
    cards.forEach(card => {
        card.classList.remove('flipped');
        card.addEventListener('click', flipCard);
    });
    shuffle(cards);
    cards.forEach(card => gameBoard.appendChild(card));
}

function gameWon() {
    clearInterval(timer);
    applauseSound.play();
    showConfetti();
}

function showConfetti() {
    const confettiContainer = document.createElement('div');
    confettiContainer.classList.add('confetti');
    document.body.appendChild(confettiContainer);
    for (let i = 0; i < 100; i++) {
        const confetti = document.createElement('div');
        confetti.classList.add('confetti-piece');
        confetti.style.left = `${Math.random() * 100}%`;
        confetti.style.animationDuration = `${Math.random() * 3 + 2}s`;
        confettiContainer.appendChild(confetti);
    }
    setTimeout(() => {
        document.body.removeChild(confettiContainer);
    }, 5000);
}

createBoard();
startTimer();
