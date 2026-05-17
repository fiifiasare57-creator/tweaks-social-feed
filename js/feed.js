// ==================== FEED DATA & RENDERING ====================

// Feed content - easily customizable
const feedData = [
    { 
        id: 1, 
        type: "image", 
        url: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&w=1000&q=80", 
        username: "@midnight_visions", 
        caption: "Neon reverie, city lights dance 🌃", 
        music: "Midnight Drive - Lofi", 
        likes: 12400, 
        comments: 342 
    },
    { 
        id: 2, 
        type: "video", 
        url: "https://assets.mixkit.co/videos/preview/mixkit-forest-stream-in-sunlight-529-large.mp4", 
        username: "@kai_world", 
        caption: "Find peace in nature 🌿", 
        music: "Ambient Waves", 
        likes: 8700, 
        comments: 215 
    },
    { 
        id: 3, 
        type: "image", 
        url: "https://images.unsplash.com/photo-1529333166437-7750a6dd5a70?auto=format&fit=crop&w=1000&q=80", 
        username: "@maya.art", 
        caption: "Abstract soul, digital dreams 🎨", 
        music: "Neural Paint", 
        likes: 15300, 
        comments: 589 
    },
    { 
        id: 4, 
        type: "video", 
        url: "https://assets.mixkit.co/videos/preview/mixkit-waves-in-the-water-1164-large.mp4", 
        username: "@leo.exe", 
        caption: "Ocean therapy 🌊 infinity", 
        music: "Coastal Breeze", 
        likes: 9600, 
        comments: 302 
    }
];

// State management
let currentLikeStates = {};
let likesCount = {};

// Initialize like states
feedData.forEach((item, idx) => {
    currentLikeStates[idx] = false;
    likesCount[idx] = item.likes;
});

// Helper: format numbers (1.2k, 15.3k)
function formatNumber(n) {
    if (n >= 1000000) return (n/1000000).toFixed(1) + 'M';
    if (n >= 1000) return (n/1000).toFixed(1) + 'k';
    return n.toString();
}

// Handle like click
function handleLike(index, btnElement) {
    const icon = btnElement.querySelector('i');
    
    if (!currentLikeStates[index]) {
        // Like the post
        currentLikeStates[index] = true;
        likesCount[index]++;
        icon.classList.remove('far');
        icon.classList.add('fas', 'text-fuchsia-500');
        
        // Heart burst animation
        const heart = document.createElement('div');
        heart.innerHTML = '❤️';
        heart.className = 'floating-heart';
        btnElement.style.position = 'relative';
        btnElement.appendChild(heart);
        setTimeout(() => heart.remove(), 600);
        
        // Haptic feedback
        if (navigator.vibrate) navigator.vibrate(30);
        
        // Update counter
        const counterSpan = document.querySelector(`.like-counter-${index}`);
        if (counterSpan) counterSpan.innerText = formatNumber(likesCount[index]);
    } else {
        // Unlike the post
        currentLikeStates[index] = false;
        likesCount[index]--;
        icon.classList.remove('fas', 'text-fuchsia-500');
        icon.classList.add('far');
        
        // Haptic feedback
        if (navigator.vibrate) navigator.vibrate(15);
        
        // Update counter
        const counterSpan = document.querySelector(`.like-counter-${index}`);
        if (counterSpan) counterSpan.innerText = formatNumber(likesCount[index]);
    }
}

// Setup video autoplay with Intersection Observer
function setupVideoAutoplay() {
    const observer = new IntersectionObserver(
        (entries) => {
            entries.forEach(entry => {
                const video = entry.target;
                if (entry.isIntersecting) {
                    video.play().catch(e => console.log('Autoplay prevented:', e));
                } else {
                    video.pause();
                }
            });
        },
        { threshold: 0.5 }
    );
    
    document.querySelectorAll('.feed-item video').forEach(video => {
        observer.observe(video);
    });
}

// Render the entire feed
function renderFeed() {
    const feedContainer = document.getElementById('feedContainer');
    if (!feedContainer) return;
    
    feedContainer.innerHTML = '';
    
    feedData.forEach((item, index) => {
        const feedItem = document.createElement('div');
        feedItem.className = 'feed-item';
        feedItem.setAttribute('data-id', item.id);
        
        // Media element (image or video)
        const media = item.type === 'video' ? document.createElement('video') : document.createElement('img');
        if (item.type === 'video') {
            media.src = item.url;
            media.loop = true;
            media.muted = true;
            media.playsInline = true;
        } else {
            media.src = item.url;
        }
        media.className = 'media-element';
        
        // Gradient overlay
        const gradient = document.createElement('div');
        gradient.className = 'gradient-overlay';
        
        // Action buttons
        const actionBar = document.createElement('div');
        actionBar.className = 'action-bar';
        actionBar.innerHTML = `
            <div class="action-icon like-icon" data-idx="${index}">
                <i class="far fa-heart"></i>
            </div>
            <div class="action-icon">
                <i class="far fa-comment"></i>
            </div>
            <div class="action-icon">
                <i class="far fa-bookmark"></i>
            </div>
            <div class="action-icon">
                <i class="fas fa-share-alt"></i>
            </div>
        `;
        
        // Caption and info
        const captionDiv = document.createElement('div');
        captionDiv.className = 'caption-area';
        captionDiv.innerHTML = `
            <div class="username">
                <span>${item.username}</span>
                <i class="fas fa-check-circle text-blue-400 text-xs"></i>
            </div>
            <div class="caption-text">${item.caption}</div>
            <div class="music-tag">
                <i class="fas fa-music"></i>
                <span>${item.music}</span>
            </div>
            <div class="stats">
                <span><i class="far fa-heart"></i> <span class="like-counter-${index}">${formatNumber(likesCount[index])}</span></span>
                <span><i class="far fa-comment"></i> ${item.comments}</span>
            </div>
        `;
        
        feedItem.appendChild(media);
        feedItem.appendChild(gradient);
        feedItem.appendChild(actionBar);
        feedItem.appendChild(captionDiv);
        feedContainer.appendChild(feedItem);
    });
    
    // Attach like event listeners
    document.querySelectorAll('.like-icon').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            const idx = parseInt(btn.getAttribute('data-idx'));
            handleLike(idx, btn);
        });
    });
    
    // Setup video autoplay
    setupVideoAutoplay();
}

// Add new post to feed (for upload functionality)
function addNewPost(post) {
    feedData.unshift(post);
    const newIndex = 0;
    currentLikeStates = {};
    likesCount = {};
    feedData.forEach((item, idx) => {
        currentLikeStates[idx] = false;
        likesCount[idx] = item.likes || 0;
    });
    renderFeed();
    // Scroll to top
    const feedContainer = document.getElementById('feedContainer');
    if (feedContainer) feedContainer.scrollTo({ top: 0, behavior: 'smooth' });
}

// Export functions for use in other files
window.FeedModule = {
    renderFeed,
    addNewPost,
    feedData,
    formatNumber
};
