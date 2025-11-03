// Game state
const state = {
    player: 0,
    computer: 0,
    round: 1,
    totalRounds: 5,
    active: true,
    trashTalk: "You Suck! Haha.Loser! Suck.Loser!"
};

// DOM elements
const elements = {
    startScreen: document.getElementById('start-screen'),
    gameScreen: document.getElementById('game-screen'),
    playerScore: document.getElementById('player-score'),
    computerScore: document.getElementById('computer-score'),
    currentRound: document.getElementById('current-round'),
    playerChoice: document.getElementById('player-choice'),
    computerChoice: document.getElementById('computer-choice'),
    resultText: document.querySelector('.result-text'),
    lastUsed: document.querySelector('.last-used'),
    modal: document.getElementById('trash-talk-modal')
};

// Initialize game
function init() {
    document.getElementById('start-btn').addEventListener('click', startGame);
    document.getElementById('restart-btn').addEventListener('click', resetGame);
    document.getElementById('home-btn').addEventListener('click', goHome);
    
    document.querySelectorAll('.choice-btn').forEach(btn => {
        btn.addEventListener('click', (e) => handleChoice(e.target.closest('.choice-btn').dataset.choice));
    });
    
    // Trash talk
    document.getElementById('trash-talk-btn').addEventListener('click', () => elements.modal.classList.add('active'));
    document.querySelector('.close-btn').addEventListener('click', closeModal);
    
    document.querySelectorAll('.trash-option').forEach(option => {
        option.addEventListener('click', () => selectTrashTalk(option.textContent));
    });
    
    document.getElementById('send-trash').addEventListener('click', sendCustomTrashTalk);
    window.addEventListener('click', (e) => e.target === elements.modal && closeModal());
    
    updateScores();
}

// Game functions
function startGame() {
    elements.startScreen.classList.remove('active');
    elements.gameScreen.classList.add('active');
    resetGame();
}

function goHome() {
    elements.gameScreen.classList.remove('active');
    elements.startScreen.classList.add('active');
}

function handleChoice(playerChoice) {
    if (!state.active) return;
    
    const computerChoice = getComputerChoice();
    updateChoices(playerChoice, computerChoice);
    
    const winner = getWinner(playerChoice, computerChoice);
    updateGame(winner);
    showResult(winner);
    
    checkGameEnd();
}

function getComputerChoice() {
    return ['rock', 'paper', 'scissors'][Math.floor(Math.random() * 3)];
}

function getWinner(player, computer) {
    if (player === computer) return 'draw';
    if ((player === 'rock' && computer === 'scissors') ||
        (player === 'paper' && computer === 'rock') ||
        (player === 'scissors' && computer === 'paper')) return 'player';
    return 'computer';
}

function updateChoices(player, computer) {
    elements.playerChoice.innerHTML = `<img src="public/icons/${player}.png" alt="${player}">`;
    elements.computerChoice.innerHTML = `<img src="public/icons/${computer}.png" alt="${computer}">`;
    
    elements.playerChoice.style.animation = 'bounceIn 0.5s ease';
    setTimeout(() => elements.playerChoice.style.animation = '', 500);
}

function updateGame(winner) {
    if (winner === 'player') state.player++;
    if (winner === 'computer') state.computer++;
    
    updateScores();
    
    if (winner !== 'draw') {
        state.round++;
        elements.currentRound.textContent = state.round;
    }
}

function updateScores() {
    elements.playerScore.textContent = state.player;
    elements.computerScore.textContent = state.computer;
}

function showResult(winner) {
    const messages = {
        player: 'You Win! 🎉',
        computer: 'You Lose! 💥',
        draw: "It's a Draw! 🤝"
    };
    
    const colors = {
        player: 'win',
        computer: 'lose', 
        draw: 'draw'
    };
    
    elements.resultText.textContent = messages[winner];
    elements.resultText.className = `result-text ${colors[winner]}`;
    
    if (winner === 'computer') showRandomTrashTalk();
}

function showRandomTrashTalk() {
    const messages = ["You Suck!", "Hahaha.Loser.", "Better luck next time!", state.trashTalk];
    const randomMsg = messages[Math.floor(Math.random() * messages.length)];
    
    const popup = document.createElement('div');
    popup.textContent = randomMsg;
    popup.style.cssText = 'position:fixed;top:50%;left:50%;transform:translate(-50%,-50%);background:#EC4899;color:white;padding:20px 30px;border-radius:15px;font-weight:bold;z-index:1000;animation:bounceIn 0.5s ease';
    
    document.body.appendChild(popup);
    setTimeout(() => document.body.removeChild(popup), 3000);
}

function checkGameEnd() {
    const winningScore = Math.ceil(state.totalRounds / 2);
    
    if (state.player >= winningScore || state.computer >= winningScore || state.round > state.totalRounds) {
        state.active = false;
        
        let finalMsg = state.player > state.computer ? 
            'Congratulations! You won the game! 🏆' :
            state.computer > state.player ? 
            'Game Over! Computer won the game. 🤖' : 
            "It's a tie game! ⚖️";
        
        setTimeout(() => {
            elements.resultText.textContent = finalMsg;
            elements.resultText.className = `result-text ${state.player > state.computer ? 'win' : state.computer > state.player ? 'lose' : 'draw'}`;
        }, 1500);
    }
}

// Trash talk functions
function selectTrashTalk(msg) {
    state.trashTalk = msg;
    elements.lastUsed.textContent = msg;
    closeModal();
}

function sendCustomTrashTalk() {
    const msg = document.getElementById('custom-trash').value.trim();
    if (msg) {
        state.trashTalk = msg;
        elements.lastUsed.textContent = msg;
        document.getElementById('custom-trash').value = '';
        closeModal();
    }
}

function closeModal() {
    elements.modal.classList.remove('active');
}

// Reset game
function resetGame() {
    state.player = 0;
    state.computer = 0;
    state.round = 1;
    state.active = true;
    
    updateScores();
    elements.currentRound.textContent = state.round;
    elements.playerChoice.innerHTML = '<div class="choice-placeholder">?</div>';
    elements.computerChoice.innerHTML = '<div class="choice-placeholder">?</div>';
    elements.resultText.textContent = 'Make your move!';
    elements.resultText.className = 'result-text';
}

// Start the game
document.addEventListener('DOMContentLoaded', init);