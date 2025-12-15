// Game State
const gameState = {
    currentStage: 1,
    maxStages: 4,
    stageAnswers: {},
    bootComplete: false
};

// Stage Definitions
const stages = {
    1: {
        name: "BINARY_DECODER",
        answer: "GATE",
        hint: "Konvertiere den Binärcode in ASCII-Zeichen"
    },
    2: {
        name: "CIPHER_BREACH",
        answer: "THIRTEEN",
        hint: "ROT-Cipher entschlüsseln"
    },
    3: {
        name: "SEQUENCE_ANALYSIS",
        answer: "89",
        hint: "Erkenne das Muster in der Sequenz"
    },
    4: {
        name: "CHECKSUM_VALIDATION",
        answer: "4889",
        hint: "Berechne die Checksumme aus den vorherigen Antworten"
    }
};

// Boot sequence
const bootSequence = [
    "INITIALIZING SYSTEM...",
    "LOADING KERNEL MODULES... OK",
    "MOUNTING FILE SYSTEMS... OK",
    "STARTING NETWORK SERVICES... OK",
    "",
    "████████████████████ 100%",
    "",
    "SYSTEM BOOT COMPLETE",
    "",
    "WARNING: UNAUTHORIZED ACCESS DETECTED",
    "SECURITY PROTOCOL ENGAGED",
    "",
    "TO PROCEED, YOU MUST COMPLETE ALL AUTHENTICATION STAGES",
    "",
    "PRESS ANY KEY TO CONTINUE..."
];

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    startBootSequence();
});

// Boot sequence animation
async function startBootSequence() {
    const bootText = document.getElementById('boot-text');
    const bootCursor = document.getElementById('boot-cursor');

    for (let line of bootSequence) {
        await typeText(bootText, line + '\n', 30);
        await sleep(100);
    }

    bootCursor.style.display = 'none';

    // Wait for any key press
    document.addEventListener('keydown', function initTerminal(e) {
        if (!gameState.bootComplete) {
            gameState.bootComplete = true;
            document.removeEventListener('keydown', initTerminal);
            showTerminal();
        }
    });
}

// Show main terminal
function showTerminal() {
    showScreen('terminal-screen');
    initializeStage(1);
    focusInput();

    // Setup input handler
    const input = document.getElementById('terminal-input');
    input.addEventListener('keydown', handleInput);
}

// Screen management
function showScreen(screenId) {
    document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
    document.getElementById(screenId).classList.add('active');
}

// Terminal output
function addOutput(text, className = '') {
    const output = document.getElementById('terminal-output');
    const line = document.createElement('div');
    line.className = 'output-line ' + className;
    line.textContent = text;
    output.appendChild(line);
    output.scrollTop = output.scrollHeight;
}

function addOutputHTML(html) {
    const output = document.getElementById('terminal-output');
    const wrapper = document.createElement('div');
    wrapper.innerHTML = html;
    output.appendChild(wrapper);
    output.scrollTop = output.scrollHeight;
}

function clearOutput() {
    document.getElementById('terminal-output').innerHTML = '';
}

// Input handling
function handleInput(e) {
    if (e.key === 'Enter') {
        e.preventDefault();
        const input = e.target;
        const command = input.value.trim();

        if (command) {
            addOutput('> ' + command, 'dim');
            processCommand(command);
            input.value = '';
        }
    }
}

function focusInput() {
    document.getElementById('terminal-input').focus();
}

// Command processing
function processCommand(command) {
    const cmd = command.toLowerCase();

    // Global commands
    if (cmd === 'help') {
        showHelp();
        return;
    }

    if (cmd === 'clear') {
        clearOutput();
        return;
    }

    if (cmd === 'status') {
        showStatus();
        return;
    }

    if (cmd === 'hint') {
        showHint();
        return;
    }

    // Check answer for current stage
    checkAnswer(command);
}

// Show help
function showHelp() {
    addOutput('', 'system');
    addOutput('AVAILABLE COMMANDS:', 'success');
    addOutput('  help   - Zeige diese Hilfe', 'dim');
    addOutput('  status - Zeige aktuellen Fortschritt', 'dim');
    addOutput('  hint   - Zeige Hinweis für aktuelles Rätsel', 'dim');
    addOutput('  clear  - Lösche Terminal-Ausgabe', 'dim');
    addOutput('', 'system');
    addOutput('Gib deine Antwort direkt ein, um sie zu prüfen.', 'dim');
    addOutput('', 'system');
}

// Show status
function showStatus() {
    addOutput('', 'system');
    addOutput(`CURRENT STAGE: ${gameState.currentStage}/${gameState.maxStages}`, 'success');
    addOutput(`STAGE NAME: ${stages[gameState.currentStage].name}`, 'dim');
    addOutput('', 'system');
}

// Show hint
function showHint() {
    const hint = stages[gameState.currentStage].hint;
    addOutput('', 'system');
    addOutput('HINT: ' + hint, 'highlight');
    addOutput('', 'system');
}

// Initialize stage
function initializeStage(stageNum) {
    gameState.currentStage = stageNum;
    document.getElementById('current-stage').textContent = stageNum;

    addOutput('', 'system');
    addOutput('═'.repeat(60), 'success');
    addOutput(`STAGE ${stageNum}: ${stages[stageNum].name}`, 'success');
    addOutput('═'.repeat(60), 'success');
    addOutput('', 'system');

    // Load stage-specific content
    switch (stageNum) {
        case 1:
            loadStage1();
            break;
        case 2:
            loadStage2();
            break;
        case 3:
            loadStage3();
            break;
        case 4:
            loadStage4();
            break;
    }
}

// STAGE 1: Binary Decoder
function loadStage1() {
    addOutput('ENCRYPTED DATA INTERCEPTED:', 'dim');
    addOutput('', 'system');
    addOutput('01000111 01000001 01010100 01000101', 'highlight');
    addOutput('', 'system');
    addOutput('TASK: Dekodiere die Binärdaten in Text.', 'dim');
    addOutput('HINWEIS: Jede 8-bit Gruppe ist ein ASCII-Zeichen.', 'dim');
    addOutput('', 'system');
}

// STAGE 2: Cipher Breach
function loadStage2() {
    addOutput('VERSCHLÜSSELTE NACHRICHT GEFUNDEN:', 'dim');
    addOutput('', 'system');
    addOutput('GUVEGRRA', 'highlight');
    addOutput('', 'system');
    addOutput('TASK: Entschlüssele die Nachricht.', 'dim');
    addOutput('HINWEIS: ROT13 - Jeder Buchstabe ist um 13 Positionen verschoben.', 'dim');
    addOutput('ZUSATZ: Gib das englische Wort für die Zahl aus.', 'dim');
    addOutput('', 'system');
}

// STAGE 3: Sequence Analysis
function loadStage3() {
    addOutput('SEQUENZ-ANALYSE ERFORDERLICH:', 'dim');
    addOutput('', 'system');
    addOutput('1, 1, 2, 3, 5, 8, 13, 21, 34, 55, ?', 'highlight');
    addOutput('', 'system');
    addOutput('TASK: Vervollständige die Sequenz.', 'dim');
    addOutput('HINWEIS: Jede Zahl ist die Summe der zwei vorherigen.', 'dim');
    addOutput('', 'system');
}

// STAGE 4: Checksum Validation
function loadStage4() {
    addOutput('FINALE AUTHENTIFIZIERUNG:', 'dim');
    addOutput('', 'system');
    addOutput('BERECHNE DIE CHECKSUMME:', 'highlight');
    addOutput('', 'system');
    addOutput('Nehme die Antworten der vorherigen Stages:', 'dim');
    addOutput(`  Stage 1: ${gameState.stageAnswers[1]}`, 'dim');
    addOutput(`  Stage 2: ${gameState.stageAnswers[2]}`, 'dim');
    addOutput(`  Stage 3: ${gameState.stageAnswers[3]}`, 'dim');
    addOutput('', 'system');
    addOutput('FORMEL:', 'dim');
    addOutput('  1. Anzahl Buchstaben in Stage 1 Antwort', 'dim');
    addOutput('  2. Anzahl Buchstaben in Stage 2 Antwort', 'dim');
    addOutput('  3. Die Zahl aus Stage 3', 'dim');
    addOutput('  4. Kombiniere: [1][2][3] (z.B. 4, 8, 13 = 4813)', 'dim');
    addOutput('', 'system');
    addOutput('TASK: Berechne und gib die 4-stellige Checksumme ein.', 'dim');
    addOutput('', 'system');
}

// Check answer
function checkAnswer(answer) {
    const correctAnswer = stages[gameState.currentStage].answer;

    if (answer.toUpperCase() === correctAnswer.toUpperCase()) {
        // Correct answer
        gameState.stageAnswers[gameState.currentStage] = answer.toUpperCase();

        addOutput('', 'success');
        addOutput('✓ KORREKT! Authentifizierung erfolgreich.', 'success');
        addOutput('', 'success');

        if (gameState.currentStage < gameState.maxStages) {
            setTimeout(() => {
                initializeStage(gameState.currentStage + 1);
            }, 1500);
        } else {
            // All stages completed
            setTimeout(() => {
                showSuccessScreen();
            }, 1500);
        }
    } else {
        // Wrong answer
        addOutput('', 'error');
        addOutput('✗ FALSCH! Zugriff verweigert.', 'error');
        addOutput('Versuche es erneut oder tippe "hint" für einen Hinweis.', 'dim');
        addOutput('', 'error');
    }
}

// Success screen
function showSuccessScreen() {
    showScreen('success-screen');
}

// Copy password
function copyPassword() {
    const password = document.getElementById('final-password').textContent;

    if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(password).then(() => {
            const btn = document.querySelector('.copy-btn');
            const originalText = btn.textContent;
            btn.textContent = '[COPIED]';
            setTimeout(() => {
                btn.textContent = originalText;
            }, 2000);
        }).catch(() => {
            fallbackCopy(password);
        });
    } else {
        fallbackCopy(password);
    }
}

function fallbackCopy(text) {
    const textArea = document.createElement('textarea');
    textArea.value = text;
    textArea.style.position = 'fixed';
    textArea.style.left = '-999999px';
    document.body.appendChild(textArea);
    textArea.select();

    try {
        document.execCommand('copy');
        const btn = document.querySelector('.copy-btn');
        const originalText = btn.textContent;
        btn.textContent = '[COPIED]';
        setTimeout(() => {
            btn.textContent = originalText;
        }, 2000);
    } catch (err) {
        alert('PASSWORD: ' + text);
    }

    document.body.removeChild(textArea);
}

// Utility functions
function typeText(element, text, speed = 50) {
    return new Promise((resolve) => {
        let i = 0;
        const interval = setInterval(() => {
            if (i < text.length) {
                element.textContent += text.charAt(i);
                i++;
            } else {
                clearInterval(interval);
                resolve();
            }
        }, speed);
    });
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

// Auto-focus input when clicking anywhere
document.addEventListener('click', () => {
    if (gameState.bootComplete) {
        focusInput();
    }
});
