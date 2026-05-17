// ==================== TWIMOJIS - Floating Emoji Reactions ====================

// Available Twimojis
const twimojisList = [
    { emoji: "🔥", name: "Fire" },
    { emoji: "✨", name: "Sparkle" },
    { emoji: "❤️", name: "Love" },
    { emoji: "😂", name: "Laugh" },
    { emoji: "🎉", name: "Party" },
    { emoji: "💀", name: "Skull" },
    { emoji: "👀", name: "Eyes" },
    { emoji: "😍", name: "Heart Eyes" },
    { emoji: "🤯", name: "Mind Blown" },
    { emoji: "💯", name: "Hundred" }
];

// Create floating emoji element
function createFloatingEmoji(emoji, x, y) {
    const floating = document.createElement('div');
    floating.className = 'floating-emoji';
    floating.textContent = emoji;
    floating.style.left = x + 'px';
    floating.style.top = y + 'px';
    document.body.appendChild(floating);
    
    // Remove after animation completes
    setTimeout(() => floating.remove(), 1000);
}

// Spawn multiple emojis from a click position
function spawnEmojiBurst(emoji, centerX, centerY) {
    // Main emoji at click position
    createFloatingEmoji(emoji, centerX - 15, centerY - 10);
    
    // 2-3 additional emojis with random offsets
    const count = Math.floor(Math.random() * 2) + 2;
    for (let i = 0; i < count; i++) {
        setTimeout(() => {
            const offsetX = (Math.random() - 0.5) * 40;
            const offsetY = (Math.random() - 0.5) * 30 - 10;
            createFloatingEmoji(emoji, centerX + offsetX, centerY + offsetY);
        }, i * 60);
    }
}

// Render the Twimojis panel
function renderTwimojis() {
    const container = document.getElementById('twimojisContainer');
    if (!container) return;
    
    container.innerHTML = '';
    twimojisList.forEach(t => {
        const twimoji = document.createElement('div');
        twimoji.className = 'twimoji';
        twimoji.setAttribute('data-emoji', t.emoji);
        twimoji.setAttribute('data-name', t.name);
        twimoji.textContent = t.emoji;
        twimoji.title = t.name;
        container.appendChild(twimoji);
    });
    
    // Attach click handlers
    attachTwimojiHandlers();
}

// Attach click handlers to Twimojis
function attachTwimojiHandlers() {
    const twimojis = document.querySelectorAll('.twimoji');
    
    twimojis.forEach(twimoji => {
        twimoji.removeEventListener('click', twimojiClickHandler);
        twimoji.addEventListener('click', twimojiClickHandler);
    });
}

// Handler for Twimoji clicks
function twimojiClickHandler(e) {
    e.stopPropagation();
    
    const emoji = this.getAttribute('data-emoji');
    const rect = this.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top - 5;
    
    // Spawn floating emojis
    spawnEmojiBurst(emoji, centerX, centerY);
    
    // Haptic feedback
    if (navigator.vibrate) navigator.vibrate(12);
    
    // Send to chat if chat module exists
    if (window.ChatModule && window.ChatModule.addReaction) {
        window.ChatModule.addReaction(emoji);
    }
    
    // Show quick feedback
    showTwimojiFeedback(emoji);
}

// Show subtle feedback toast
function showTwimojiFeedback(emoji) {
    const toast = document.createElement('div');
    toast.className = 'toast-notification';
    toast.style.bottom = '130px';
    toast.innerHTML = `${emoji} sent!`;
    document.body.appendChild(toast);
    setTimeout(() => toast.remove(), 1500);
}

// Handle random emoji on feed tap
function setupFeedTapForEmojis() {
    document.addEventListener('click', (e) => {
        // Check if clicking on feed item (not on buttons)
        const isFeedItem = e.target.closest('.feed-item');
        const isInteractive = e.target.closest('.action-icon') || 
                              e.target.closest('.twimoji') || 
                              e.target.closest('.chat-button') || 
                              e.target.closest('.upload-fab') ||
                              e.target.closest('.story-item');
        
        if (isFeedItem && !isInteractive) {
            const randomEmoji = twimojisList[Math.floor(Math.random() * twimojisList.length)].emoji;
            const x = e.clientX;
            const y = e.clientY;
            spawnEmojiBurst(randomEmoji, x - 15, y - 20);
            if (navigator.vibrate) navigator.vibrate(8);
        }
    });
}

// Initialize Twimojis
function initTwimojis() {
    renderTwimojis();
    setupFeedTapForEmojis();
}

// Export for use in other files
window.TwimojisModule = {
    initTwimojis,
    spawnEmojiBurst,
    createFloatingEmoji
};
