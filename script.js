const state = { 
    player: 0, 
    computer: 0, 
    round: 1, 
    totalRounds: 5, 
    active: true, 
    trashTalk: "You Suck! Haha.Loser! Suck.Loser!" 
};

const el = {};

function init() {
    // Cache DOM elements
    ['start-screen','game-screen','player-score','computer-score','current-round',
     'player-choice','computer-choice','start-btn','restart-btn','home-btn',
     'trash-talk-btn','trash-talk-modal','custom-trash','send-trash','total-rounds',
     'mode-5','mode-7'].forEach(id => 
        el[id] = document.getElementById(id));
    
    el.resultText = document.querySelector('.result-text');
    el.lastUsed = document.querySelector('.last-used');
    
    // Event listeners
    el['start-btn'].addEventListener('click', startGame);
    el['restart-btn'].addEventListener('click', resetGame);
    el['home-btn'].addEventListener('click', goHome);
    
    // Mode selection
    el['mode-5'].addEventListener('click', () => setGameMode(5));
    el['mode-7'].addEventListener('click', () => setGameMode(7));
    
    document.querySelectorAll('.choice-btn').forEach(btn => 
        btn.addEventListener('click', (e) => {
            if (!state.active) return;
            const choice = e.target.closest('.choice-btn').dataset.choice;
            handleChoice(choice);
        }));
    
    // Trash talk
    el['trash-talk-btn'].addEventListener('click', () => el['trash-talk-modal'].classList.add('active'));
    document.querySelector('.close-btn').addEventListener('click', closeModal);
    document.querySelectorAll('.trash-option').forEach(opt => 
        opt.addEventListener('click', () => updateTrashTalk(opt.textContent)));
    el['send-trash'].addEventListener('click', sendCustomTrashTalk);
    window.addEventListener('click', (e) => e.target === el['trash-talk-modal'] && closeModal());
    
    updateScores();
    setGameMode(5); // Default to 5 rounds
}

function startGame() {
    el['start-screen'].classList.remove('active');
    el['game-screen'].classList.add('active');
    resetGame();
}

function goHome() {
    el['game-screen'].classList.remove('active');
    el['start-screen'].classList.add('active');
}

function setGameMode(rounds) {
    state.totalRounds = rounds;
    el['total-rounds'].textContent = rounds;
    
    // Update active mode button
    el['mode-5'].classList.toggle('active', rounds === 5);
    el['mode-7'].classList.toggle('active', rounds === 7);
    
    resetGame();
}

function handleChoice(playerChoice) {
    if (!state.active) return;
    
    const computerChoice = getComputerChoice();
    updateChoices(playerChoice, computerChoice);
    
    const winner = determineWinner(playerChoice, computerChoice);
    updateGame(winner);
    showResult(winner);
    
    checkGameEnd();
}

function getComputerChoice() {
    const choices = ['rock', 'paper', 'scissors'];
    const randomIndex = Math.floor(Math.random() * choices.length);
    return choices[randomIndex];
}

function determineWinner(player, computer) {
    if (player === computer) return 'draw';
    
    if (
        (player === 'rock' && computer === 'scissors') ||
        (player === 'paper' && computer === 'rock') ||
        (player === 'scissors' && computer === 'paper')
    ) {
        return 'player';
    }
    
    return 'computer';
}

function updateChoices(player, computer) {
    el.playerChoice.innerHTML = `<img src="public/icons/${player}.png" alt="${player}">`;
    el.computerChoice.innerHTML = `<img src="public/icons/${computer}.png" alt="${computer}">`;
    
    el.playerChoice.style.animation = 'bounceIn 0.5s ease';
    setTimeout(() => el.playerChoice.style.animation = '', 500);
}

function updateGame(winner) {
    if (winner === 'player') {
        state.player++;
        // Add score animation
        el.playerScore.style.transform = 'scale(1.2)';
        setTimeout(() => el.playerScore.style.transform = 'scale(1)', 300);
    } else if (winner === 'computer') {
        state.computer++;
        // Add score animation
        el.computerScore.style.transform = 'scale(1.2)';
        setTimeout(() => el.computerScore.style.transform = 'scale(1)', 300);
    }
    
    updateScores();
    
    // Move to next round if not a draw
    if (winner !== 'draw') {
        state.round++;
        el.currentRound.textContent = state.round;
    }
}

function updateScores() {
    el.playerScore.textContent = state.player;
    el.computerScore.textContent = state.computer;
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
    
    el.resultText.textContent = messages[winner];
    el.resultText.className = `result-text ${colors[winner]}`;
    
    if (winner === 'computer') {
        showRandomTrashTalk();
    }
}

function showRandomTrashTalk() {
    const messages = ["You Suck!", "Hahaha.Loser.", "Better luck next time!", state.trashTalk];
    const randomMsg = messages[Math.floor(Math.random() * messages.length)];
    
    const popup = document.createElement('div');
    popup.textContent = randomMsg;
    popup.style.cssText = `
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background: #EC4899;
        color: white;
        padding: 20px 30px;
        border-radius: 15px;
        font-weight: bold;
        z-index: 1000;
        animation: bounceIn 0.5s ease;
    `;
    
    document.body.appendChild(popup);
    setTimeout(() => document.body.removeChild(popup), 3000);
}

function checkGameEnd() {
    const maxRounds = state.totalRounds;
    const playerScore = state.player;
    const computerScore = state.computer;
    
    // Check if any player has reached the winning score
    const winningScore = Math.ceil(maxRounds / 2);
    
    if (playerScore >= winningScore || computerScore >= winningScore || state.round > maxRounds) {
        state.active = false;
        
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
            el.resultText.textContent = finalMessage;
            el.resultText.className = `result-text ${playerScore > computerScore ? 'win' : computerScore > playerScore ? 'lose' : 'draw'}`;
        }, 1500);
    }
}

function updateTrashTalk(msg) {
    state.trashTalk = msg;
    el.lastUsed.textContent = msg;
    closeModal();
}

function sendCustomTrashTalk() {
    const msg = el['custom-trash'].value.trim();
    if (msg) {
        state.trashTalk = msg;
        el.lastUsed.textContent = msg;
        el['custom-trash'].value = '';
        closeModal();
    }
}

function closeModal() {
    el['trash-talk-modal'].classList.remove('active');
}

function resetGame() {
    state.player = 0;
    state.computer = 0;
    state.round = 1;
    state.active = true;
    
    updateScores();
    el.currentRound.textContent = state.round;
    el.playerChoice.innerHTML = '<div class="choice-placeholder">?</div>';
    el.computerChoice.innerHTML = '<div class="choice-placeholder">?</div>';
    el.resultText.textContent = 'Make your move!';
    el.resultText.className = 'result-text';
}

document.addEventListener('DOMContentLoaded', init);