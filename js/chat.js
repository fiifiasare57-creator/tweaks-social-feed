// ==================== CHAT MODULE ====================

// Chat state
let chatMessages = [];
let isChatOpen = false;

// DOM elements (populated after DOM ready)
let chatPanel, chatBackdrop, messagesArea, chatInput, sendBtn, closeChatBtn, chatButton;

// Initialize chat module
function initChat() {
    // Get DOM elements
    chatButton = document.getElementById('chatButton');
    chatPanel = document.getElementById('chatPanel');
    chatBackdrop = document.getElementById('chatBackdrop');
    closeChatBtn = document.getElementById('closeChatBtn');
    messagesArea = document.getElementById('messagesArea');
    chatInput = document.getElementById('chatInput');
    sendBtn = document.getElementById('sendMsgBtn');
    
    if (!chatButton) return;
    
    // Set up event listeners
    chatButton.addEventListener('click', openChat);
    if (closeChatBtn) closeChatBtn.addEventListener('click', closeChat);
    if (chatBackdrop) chatBackdrop.addEventListener('click', closeChat);
    if (sendBtn) sendBtn.addEventListener('click', sendMessage);
    if (chatInput) chatInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') sendMessage();
    });
}

// Open chat panel
function openChat() {
    if (!chatPanel || !chatBackdrop) return;
    chatPanel.classList.add('open');
    chatBackdrop.style.display = 'block';
    isChatOpen = true;
    if (chatInput) chatInput.focus();
}

// Close chat panel
function closeChat() {
    if (!chatPanel || !chatBackdrop) return;
    chatPanel.classList.remove('open');
    chatBackdrop.style.display = 'none';
    isChatOpen = false;
}

// Send a message
function sendMessage() {
    if (!chatInput || !messagesArea) return;
    
    const text = chatInput.value.trim();
    if (!text) return;
    
    // Add user message
    addMessage(text, 'user');
    chatInput.value = '';
    
    // Auto-reply after delay
    setTimeout(() => {
        const replies = [
            "Love that vibe! 🔥",
            "So true! ✨",
            "Keep the energy! 💯",
            "Facts! 😂",
            "This is the moment 🎉"
        ];
        const randomReply = replies[Math.floor(Math.random() * replies.length)];
        addMessage(randomReply, 'other', 'Bot');
    }, 600);
    
    // Haptic feedback
    if (navigator.vibrate) navigator.vibrate(20);
}

// Add reaction from Twimoji
function addReaction(emoji) {
    if (!messagesArea) return;
    addMessage(`sent ${emoji}`, 'user');
    scrollToBottom();
    
    // Auto-reply to reaction
    setTimeout(() => {
        const reactions = [
            `Nice ${emoji}! ✨`,
            `${emoji} That's fire! 🔥`,
            `Best reaction! ${emoji}`,
            `Keep them coming ${emoji}`
        ];
        const randomReply = reactions[Math.floor(Math.random() * reactions.length)];
        addMessage(randomReply, 'other', 'Bot');
    }, 500);
}

// Add a message to the chat
function addMessage(content, type, sender = null) {
    if (!messagesArea) return;
    
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${type}`;
    
    if (type === 'other' && sender) {
        messageDiv.innerHTML = `<strong>${sender}</strong><br>${content}`;
    } else {
        messageDiv.textContent = content;
    }
    
    messagesArea.appendChild(messageDiv);
    scrollToBottom();
    
    // Store message (optional)
    chatMessages.push({ content, type, sender, timestamp: Date.now() });
}

// Scroll chat to bottom
function scrollToBottom() {
    if (!messagesArea) return;
    messagesArea.scrollTop = messagesArea.scrollHeight;
}

// Export chat functions
window.ChatModule = {
    initChat,
    openChat,
    closeChat,
    sendMessage,
    addReaction,
    addMessage
};
