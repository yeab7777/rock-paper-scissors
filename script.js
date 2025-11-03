// Game state
const state = {
    playerScore: 0,
    computerScore: 0,
    currentRound: 1,
    totalRounds: 5,
    gameActive: true,
    currentTrashTalk: "You Suck! Haha.Loser! Suck.Loser!"
};

// DOM Elements
const startScreen = document.getElementById('start-screen');
const gameScreen = document.getElementById('game-screen');
const startBtn = document.getElementById('start-btn');
const playerScoreElement = document.getElementById('player-score');
const computerScoreElement = document.getElementById('computer-score');
const currentRoundElement = document.getElementById('current-round');
const totalRoundsElement = document.getElementById('total-rounds');
const playerChoiceDisplay = document.getElementById('player-choice');
const computerChoiceDisplay = document.getElementById('computer-choice');
const resultMessage = document.querySelector('.result-text');
const restartButton = document.getElementById('restart-btn');
const homeButton = document.getElementById('home-btn');
const choiceButtons = document.querySelectorAll('.choice-btn');
const mode5Button = document.getElementById('mode-5');
const mode7Button = document.getElementById('mode-7');

// Trash talk elements
const trashTalkBtn = document.getElementById('trash-talk-btn');
const trashTalkModal = document.getElementById('trash-talk-modal');
const closeModalBtn = document.querySelector('.close-btn');
const trashOptions = document.querySelectorAll('.trash-option');
const customTrashInput = document.getElementById('custom-trash');
const sendTrashBtn = document.getElementById('send-trash');
const lastUsedMessage = document.getElementById('last-used-message');

// Initialize the game
function initGame() {
    // Set up event listeners
    startBtn.addEventListener('click', startGame);
    restartButton.addEventListener('click', resetGame);
    homeButton.addEventListener('click', goHome);
    
    choiceButtons.forEach(button => {
        button.addEventListener('click', handlePlayerChoice);
    });
    
    mode5Button.addEventListener('click', () => setGameMode(5));
    mode7Button.addEventListener('click', () => setGameMode(7));
    
    // Trash talk functionality
    trashTalkBtn.addEventListener('click', openTrashTalkModal);
    closeModalBtn.addEventListener('click', closeTrashTalkModal);
    
    trashOptions.forEach(option => {
        option.addEventListener('click', () => selectTrashTalk(option.textContent));
    });
    
    sendTrashBtn.addEventListener('click', sendCustomTrashTalk);
    
    // Close modal when clicking outside
    window.addEventListener('click', (e) => {
        if (e.target === trashTalkModal) {
            closeTrashTalkModal();
        }
    });
    
    // Initialize UI
    updateScoreboard();
    setGameMode(5);
    updateTrashTalkDisplay();
}

// Start the game
function startGame() {
    startScreen.classList.remove('active');
    gameScreen.classList.add('active');
    resetGame();
}

// Go back to home screen
function goHome() {
    gameScreen.classList.remove('active');
    startScreen.classList.add('active');
}

// Set game mode
function setGameMode(rounds) {
    state.totalRounds = rounds;
    totalRoundsElement.textContent = rounds;
    
    // Update active mode button
    mode5Button.classList.toggle('active', rounds === 5);
    mode7Button.classList.toggle('active', rounds === 7);
    
    resetGame();
}

// Handle player's choice
function handlePlayerChoice(event) {
    if (!state.gameActive) return;
    
    const playerChoice = event.currentTarget.getAttribute('data-choice');
    const computerChoice = getComputerChoice();
    
    // Update displays
    updateChoiceDisplays(playerChoice, computerChoice);
    
    // Determine winner
    const winner = determineWinner(playerChoice, computerChoice);
    
    // Update scores and UI
    updateScores(winner);
    displayResult(winner);
    
    // Show trash talk when computer wins
    if (winner === 'computer') {
        showRandomTrashTalk();
    }
    
    // Check if game is over
    checkGameOver();
}

// Get computer's random choice
function getComputerChoice() {
    const choices = ['rock', 'paper', 'scissors'];
    const randomIndex = Math.floor(Math.random() * choices.length);
    return choices[randomIndex];
}

// Determine the winner of a round
function determineWinner(playerChoice, computerChoice) {
    if (playerChoice === computerChoice) {
        return 'draw';
    }
    
    if (
        (playerChoice === 'rock' && computerChoice === 'scissors') ||
        (playerChoice === 'paper' && computerChoice === 'rock') ||
        (playerChoice === 'scissors' && computerChoice === 'paper')
    ) {
        return 'player';
    }
    
    return 'computer';
}

// Update choice displays
function updateChoiceDisplays(playerChoice, computerChoice) {
    // Clear displays
    playerChoiceDisplay.innerHTML = '';
    computerChoiceDisplay.innerHTML = '';
    
    // Create player choice element
    const playerImg = document.createElement('img');
    playerImg.src = `public/icons/${playerChoice}.png`;
    playerImg.alt = playerChoice;
    playerImg.className = 'choice-icon';
    playerChoiceDisplay.appendChild(playerImg);
    
    // Add animation
    playerChoiceDisplay.style.animation = 'bounceIn 0.5s ease';
    
    // Update computer choice with a delay
    setTimeout(() => {
        const computerImg = document.createElement('img');
        computerImg.src = `public/icons/${computerChoice}.png`;
        computerImg.alt = computerChoice;
        computerImg.className = 'choice-icon';
        computerChoiceDisplay.appendChild(computerImg);
        
        // Add animation
        computerChoiceDisplay.style.animation = 'bounceIn 0.5s ease';
        
        // Remove animation after it completes
        setTimeout(() => {
            playerChoiceDisplay.style.animation = '';
            computerChoiceDisplay.style.animation = '';
        }, 500);
    }, 500);
}

// Update scores based on winner
function updateScores(winner) {
    if (winner === 'player') {
        state.playerScore++;
    } else if (winner === 'computer') {
        state.computerScore++;
    }
    
    updateScoreboard();
    
    // Move to next round if not a draw
    if (winner !== 'draw') {
        state.currentRound++;
        currentRoundElement.textContent = state.currentRound;
    }
}

// Update the scoreboard display
function updateScoreboard() {
    playerScoreElement.textContent = state.playerScore;
    computerScoreElement.textContent = state.computerScore;
}

// Display the result with animation
function displayResult(winner) {
    // Clear previous result classes
    resultMessage.className = 'result-text';
    
    let message = '';
    
    switch (winner) {
        case 'player':
            message = 'You Win! 🎉';
            resultMessage.classList.add('win');
            break;
        case 'computer':
            message = 'You Lose! 💥';
            resultMessage.classList.add('lose');
            break;
        case 'draw':
            message = "It's a Draw! 🤝";
            resultMessage.classList.add('draw');
            break;
    }
    
    resultMessage.textContent = message;
}

// Show random trash talk when computer wins
function showRandomTrashTalk() {
    const messages = [
        "You Suck!",
        "Hahaha.Loser.",
        "Better luck next time!",
        "Too easy!",
        "You're no match for me!",
        state.currentTrashTalk
    ];
    
    const randomMessage = messages[Math.floor(Math.random() * messages.length)];
    
    // Create a temporary trash talk display
    const tempTrash = document.createElement('div');
    tempTrash.textContent = randomMessage;
    tempTrash.style.cssText = `
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background: #EC4899;
        color: white;
        padding: 20px 30px;
        border-radius: 15px;
        font-weight: bold;
        font-size: 1.2rem;
        z-index: 1000;
        animation: bounceIn 0.5s ease;
    `;
    
    document.body.appendChild(tempTrash);
    
    // Remove after 3 seconds
    setTimeout(() => {
        document.body.removeChild(tempTrash);
    }, 3000);
}

// Check if the game is over
function checkGameOver() {
    const maxRounds = state.totalRounds;
    const playerScore = state.playerScore;
    const computerScore = state.computerScore;
    
    // Check if any player has reached the winning score
    const winningScore = Math.ceil(maxRounds / 2);
    
    if (playerScore >= winningScore || computerScore >= winningScore || state.currentRound > maxRounds) {
        state.gameActive = false;
        
        let finalMessage = '';
        if (playerScore > computerScore) {
            finalMessage = 'Congratulations! You won the game! 🏆';
        } else if (computerScore > playerScore) {
            finalMessage = 'Game Over! Computer won the game. 🤖';
        } else {
            finalMessage = "It's a tie game! ⚖️";
        }
        
        // Show final result after a delay
        setTimeout(() => {
            resultMessage.textContent = finalMessage;
            resultMessage.className = 'result-text';
            if (playerScore > computerScore) {
                resultMessage.classList.add('win');
            } else if (computerScore > playerScore) {
                resultMessage.classList.add('lose');
            } else {
                resultMessage.classList.add('draw');
            }
        }, 1500);
    }
}

// Trash talk functionality
function openTrashTalkModal() {
    trashTalkModal.classList.add('active');
}

function closeTrashTalkModal() {
    trashTalkModal.classList.remove('active');
}

function selectTrashTalk(message) {
    state.currentTrashTalk = message;
    updateTrashTalkDisplay();
    closeTrashTalkModal();
}

function sendCustomTrashTalk() {
    const message = customTrashInput.value.trim();
    if (message) {
        state.currentTrashTalk = message;
        updateTrashTalkDisplay();
        customTrashInput.value = '';
        closeTrashTalkModal();
    }
}

function updateTrashTalkDisplay() {
    lastUsedMessage.textContent = state.currentTrashTalk;
}

// Reset the game
function resetGame() {
    state.playerScore = 0;
    state.computerScore = 0;
    state.currentRound = 1;
    state.gameActive = true;
    
    // Reset UI
    updateScoreboard();
    currentRoundElement.textContent = state.currentRound;
    playerChoiceDisplay.innerHTML = '<div class="choice-placeholder">?</div>';
    computerChoiceDisplay.innerHTML = '<div class="choice-placeholder">?</div>';
    resultMessage.textContent = 'Make your move!';
    resultMessage.className = 'result-text';
}

// Initialize the game when the page loads
document.addEventListener('DOMContentLoaded', initGame);