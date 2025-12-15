// bored.chat - Discord Clone JavaScript

// State
const state = {
    currentChannel: 'general',
    currentServer: 'home',
    messages: {
        general: [],
        random: [],
        memes: []
    },
    username: 'BoredUser',
    userTag: '#1337'
};

// Sample messages for demo
const sampleMessages = {
    general: [
        {
            author: 'ChatMod',
            avatar: generateAvatar('CM'),
            timestamp: '12:30',
            text: 'Willkommen bei bored.chat! 👋'
        },
        {
            author: 'DevGuru',
            avatar: generateAvatar('DG'),
            timestamp: '12:32',
            text: 'Hey everyone! This Discord clone looks amazing!'
        },
        {
            author: 'DesignNinja',
            avatar: generateAvatar('DN'),
            timestamp: '12:35',
            text: 'The UI is so clean! Love the dark theme 🎨'
        }
    ],
    random: [
        {
            author: 'RandomUser',
            avatar: generateAvatar('RU'),
            timestamp: '11:20',
            text: 'Anyone up for a game?'
        }
    ],
    memes: [
        {
            author: 'MemeL ord',
            avatar: generateAvatar('ML'),
            timestamp: '10:15',
            text: 'Post your best memes here! 🔥'
        }
    ]
};

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    initializeApp();
    setupEventListeners();
    loadChannel('general');
});

function initializeApp() {
    // Load sample messages
    state.messages = {...sampleMessages};

    // Display initial messages
    displayMessages(state.currentChannel);
}

function setupEventListeners() {
    // Message input
    const messageInput = document.getElementById('message-input');
    messageInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            sendMessage();
        }
    });

    // Channel clicks
    document.querySelectorAll('.channel:not(.voice-channel)').forEach(channel => {
        channel.addEventListener('click', () => {
            const channelName = channel.dataset.channel;
            if (channelName) {
                switchChannel(channelName);
            }
        });
    });

    // Server clicks
    document.querySelectorAll('.server-icon').forEach(server => {
        server.addEventListener('click', () => {
            const serverName = server.dataset.server;
            if (serverName) {
                switchServer(serverName);
            }
        });
    });

    // Category collapse
    document.querySelectorAll('.category-header').forEach(header => {
        header.addEventListener('click', () => {
            const arrow = header.querySelector('.category-arrow');
            const channels = header.parentElement.querySelector('.channels');

            if (channels.style.display === 'none') {
                channels.style.display = 'block';
                arrow.style.transform = 'rotate(0deg)';
            } else {
                channels.style.display = 'none';
                arrow.style.transform = 'rotate(-90deg)';
            }
        });
    });
}

function sendMessage() {
    const input = document.getElementById('message-input');
    const text = input.value.trim();

    if (!text) return;

    const message = {
        author: state.username,
        avatar: generateAvatar('B'),
        timestamp: getCurrentTime(),
        text: text
    };

    // Add message to current channel
    if (!state.messages[state.currentChannel]) {
        state.messages[state.currentChannel] = [];
    }
    state.messages[state.currentChannel].push(message);

    // Clear input
    input.value = '';

    // Display updated messages
    displayMessages(state.currentChannel);
}

function switchChannel(channelName) {
    state.currentChannel = channelName;

    // Update active state
    document.querySelectorAll('.channel').forEach(ch => ch.classList.remove('active'));
    document.querySelector(`.channel[data-channel="${channelName}"]`)?.classList.add('active');

    // Update channel name in header
    document.getElementById('current-channel').textContent = channelName;

    // Update placeholder
    const input = document.getElementById('message-input');
    input.placeholder = `Nachricht an #${channelName}`;

    // Load channel messages
    loadChannel(channelName);
}

function switchServer(serverName) {
    state.currentServer = serverName;

    // Update active server
    document.querySelectorAll('.server-icon').forEach(s => s.classList.remove('active'));
    document.querySelector(`.server-icon[data-server="${serverName}"]`)?.classList.add('active');

    // Update server name
    const serverNames = {
        home: 'bored.chat',
        gaming: 'Gaming Squad',
        music: 'Music Lovers',
        coding: 'Code & Coffee'
    };

    document.getElementById('server-name').textContent = serverNames[serverName] || 'bored.chat';
}

function loadChannel(channelName) {
    displayMessages(channelName);
}

function displayMessages(channelName) {
    const messagesContainer = document.getElementById('messages');
    const messages = state.messages[channelName] || [];

    // Clear existing messages except welcome
    const welcomeMsg = messagesContainer.querySelector('.welcome-message');
    messagesContainer.innerHTML = '';

    if (welcomeMsg) {
        const newWelcome = welcomeMsg.cloneNode(true);
        newWelcome.querySelector('h1').textContent = `Willkommen bei #${channelName}!`;
        newWelcome.querySelector('p').textContent = `Dies ist der Anfang des #${channelName} Channels.`;
        messagesContainer.appendChild(newWelcome);
    }

    // Add messages
    messages.forEach(msg => {
        const messageEl = createMessageElement(msg);
        messagesContainer.appendChild(messageEl);
    });

    // Scroll to bottom
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
}

function createMessageElement(message) {
    const messageDiv = document.createElement('div');
    messageDiv.className = 'message';

    const avatarDiv = document.createElement('div');
    avatarDiv.className = 'message-avatar';
    avatarDiv.innerHTML = `<img src="${message.avatar}" alt="${message.author}">`;

    const contentDiv = document.createElement('div');
    contentDiv.className = 'message-content';

    const headerDiv = document.createElement('div');
    headerDiv.className = 'message-header';
    headerDiv.innerHTML = `
        <span class="message-author">${message.author}</span>
        <span class="message-timestamp">${message.timestamp}</span>
    `;

    const textDiv = document.createElement('div');
    textDiv.className = 'message-text';
    textDiv.textContent = message.text;

    contentDiv.appendChild(headerDiv);
    contentDiv.appendChild(textDiv);

    messageDiv.appendChild(avatarDiv);
    messageDiv.appendChild(contentDiv);

    return messageDiv;
}

function generateAvatar(initials) {
    // Generate random color
    const colors = ['#5865f2', '#3ba55d', '#ed4245', '#faa81a', '#00aff4', '#9146ff'];
    const color = colors[Math.floor(Math.random() * colors.length)];

    return `data:image/svg+xml,%3Csvg width='80' height='80' viewBox='0 0 80 80' xmlns='http://www.w3.org/2000/svg'%3E%3Crect fill='${encodeURIComponent(color)}' width='80' height='80'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' font-family='Arial' font-size='32' fill='white'%3E${initials}%3C/text%3E%3C/svg%3E`;
}

function getCurrentTime() {
    const now = new Date();
    const hours = now.getHours().toString().padStart(2, '0');
    const minutes = now.getMinutes().toString().padStart(2, '0');
    return `${hours}:${minutes}`;
}

// Bot responses (Easter egg)
function addBotResponse(channelName, delay = 2000) {
    setTimeout(() => {
        const responses = [
            'Nice! 👍',
            'Interesting point!',
            'I agree!',
            'Tell me more...',
            'That\'s awesome! 🎉',
            'Cool stuff!',
            'For real? 😮',
            'Makes sense!',
        ];

        const botNames = ['BotHelper', 'AutoMod', 'ChatBot'];
        const botName = botNames[Math.floor(Math.random() * botNames.length)];

        const message = {
            author: botName,
            avatar: generateAvatar('B'),
            timestamp: getCurrentTime(),
            text: responses[Math.floor(Math.random() * responses.length)]
        };

        if (!state.messages[channelName]) {
            state.messages[channelName] = [];
        }
        state.messages[channelName].push(message);

        // Only update if we're still on the same channel
        if (state.currentChannel === channelName) {
            displayMessages(channelName);
        }
    }, delay);
}

// Add bot response occasionally
const originalSendMessage = sendMessage;
sendMessage = function() {
    originalSendMessage();

    // 30% chance of bot response
    if (Math.random() < 0.3) {
        addBotResponse(state.currentChannel);
    }
};

// Keyboard shortcuts
document.addEventListener('keydown', (e) => {
    // Ctrl/Cmd + K for search (just for show)
    if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        document.querySelector('.search-bar input')?.focus();
    }
});

console.log('🎮 bored.chat loaded successfully!');
console.log('💬 Start chatting in the channels!');
