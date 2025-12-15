// Game State
let gameState = {
    sequence: [],
    playerSequence: [],
    level: 1,
    isPlaying: false,
    isPlayerTurn: false,
    maxLevel: 5
};

const colors = ['red', 'green', 'blue', 'yellow'];
const screens = {
    intro: document.getElementById('intro-screen'),
    game: document.getElementById('game-screen'),
    win: document.getElementById('win-screen')
};

// Audio Context für Sounds (optional)
const soundFrequencies = {
    red: 329.63,
    green: 261.63,
    blue: 293.66,
    yellow: 349.23
};

// Screen Management
function showScreen(screenName) {
    Object.values(screens).forEach(screen => screen.classList.remove('active'));
    screens[screenName].classList.add('active');
}

// Sound-Funktion (Web Audio API)
function playSound(color) {
    try {
        const audioContext = new (window.AudioContext || window.webkitAudioContext)();
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();

        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);

        oscillator.frequency.value = soundFrequencies[color];
        oscillator.type = 'sine';

        gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3);

        oscillator.start(audioContext.currentTime);
        oscillator.stop(audioContext.currentTime + 0.3);
    } catch (e) {
        // Fallback wenn Audio nicht unterstützt wird
        console.log('Audio nicht verfügbar');
    }
}

// Farbe aufleuchten lassen
function flashColor(color) {
    return new Promise(resolve => {
        const pad = document.querySelector(`.color-pad.${color}`);
        playSound(color);
        pad.classList.add('active');

        setTimeout(() => {
            pad.classList.remove('active');
            setTimeout(resolve, 200);
        }, 400);
    });
}

// Sequenz generieren
function generateSequence() {
    const randomColor = colors[Math.floor(Math.random() * colors.length)];
    gameState.sequence.push(randomColor);
}

// Sequenz abspielen
async function playSequence() {
    gameState.isPlayerTurn = false;
    disableColorPads(true);
    showMessage('Merke dir die Sequenz!');

    await new Promise(resolve => setTimeout(resolve, 1000));

    for (const color of gameState.sequence) {
        await flashColor(color);
    }

    gameState.isPlayerTurn = true;
    disableColorPads(false);
    showMessage('Jetzt bist du dran!');
}

// Farbpads aktivieren/deaktivieren
function disableColorPads(disabled) {
    document.querySelectorAll('.color-pad').forEach(pad => {
        if (disabled) {
            pad.classList.add('disabled');
        } else {
            pad.classList.remove('disabled');
        }
    });
}

// Nachricht anzeigen
function showMessage(text) {
    document.getElementById('message').textContent = text;
}

// UI aktualisieren
function updateUI() {
    document.getElementById('level').textContent = gameState.level;
    document.getElementById('sequence-length').textContent = gameState.sequence.length;
}

// Spieler-Klick
async function playerClick(color) {
    if (!gameState.isPlayerTurn || !gameState.isPlaying) return;

    await flashColor(color);
    gameState.playerSequence.push(color);

    const currentIndex = gameState.playerSequence.length - 1;

    // Überprüfen ob die Farbe korrekt ist
    if (gameState.playerSequence[currentIndex] !== gameState.sequence[currentIndex]) {
        // Falsche Eingabe
        gameOver();
        return;
    }

    // Überprüfen ob die komplette Sequenz korrekt ist
    if (gameState.playerSequence.length === gameState.sequence.length) {
        // Runde gewonnen
        gameState.isPlayerTurn = false;
        disableColorPads(true);
        showMessage('Richtig! 🎉');

        await new Promise(resolve => setTimeout(resolve, 1000));

        // Überprüfen ob das Spiel gewonnen wurde
        if (gameState.level >= gameState.maxLevel) {
            winGame();
        } else {
            nextLevel();
        }
    }
}

// Nächstes Level
function nextLevel() {
    gameState.level++;
    gameState.playerSequence = [];
    updateUI();
    showMessage(`Level ${gameState.level}!`);

    setTimeout(() => {
        generateSequence();
        playSequence();
    }, 1500);
}

// Game Over
async function gameOver() {
    gameState.isPlaying = false;
    disableColorPads(true);
    showMessage('❌ Falsch! Versuch es nochmal!');

    // Alle Pads rot blinken lassen
    const pads = document.querySelectorAll('.color-pad');
    for (let i = 0; i < 3; i++) {
        pads.forEach(pad => pad.classList.add('active'));
        await new Promise(resolve => setTimeout(resolve, 150));
        pads.forEach(pad => pad.classList.remove('active'));
        await new Promise(resolve => setTimeout(resolve, 150));
    }

    setTimeout(() => {
        resetGame();
    }, 1500);
}

// Spiel gewonnen
function winGame() {
    gameState.isPlaying = false;
    showScreen('win');
}

// Spiel starten
function startGame() {
    showScreen('game');
    resetGame();
}

// Spiel zurücksetzen
function resetGame() {
    gameState = {
        sequence: [],
        playerSequence: [],
        level: 1,
        isPlaying: true,
        isPlayerTurn: false,
        maxLevel: 5
    };

    updateUI();
    generateSequence();
    playSequence();
}

// Nochmal spielen
function playAgain() {
    showScreen('game');
    resetGame();
}

// Passwort kopieren
function copyPassword() {
    const password = document.getElementById('password').textContent;

    // Clipboard API verwenden
    if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(password).then(() => {
            const btn = document.querySelector('.btn-copy');
            const originalText = btn.textContent;
            btn.textContent = '✅ Kopiert!';
            setTimeout(() => {
                btn.textContent = originalText;
            }, 2000);
        }).catch(() => {
            fallbackCopyPassword(password);
        });
    } else {
        fallbackCopyPassword(password);
    }
}

// Fallback für ältere Browser
function fallbackCopyPassword(password) {
    const textArea = document.createElement('textarea');
    textArea.value = password;
    textArea.style.position = 'fixed';
    textArea.style.left = '-999999px';
    document.body.appendChild(textArea);
    textArea.select();

    try {
        document.execCommand('copy');
        const btn = document.querySelector('.btn-copy');
        const originalText = btn.textContent;
        btn.textContent = '✅ Kopiert!';
        setTimeout(() => {
            btn.textContent = originalText;
        }, 2000);
    } catch (err) {
        alert('Passwort: ' + password);
    }

    document.body.removeChild(textArea);
}

// Initialisierung
document.addEventListener('DOMContentLoaded', () => {
    console.log('🎮 Easter Egg Website geladen!');
    console.log('🔐 Viel Erfolg beim Freischalten des Passworts!');
});
