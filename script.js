const gifStages = [
    "https://media.tenor.com/EBV7OT7ACfwAAAAj/u-u-qua-qua-u-quaa.gif",
    "https://media1.tenor.com/m/uDugCXK4vI4AAAAd/chiikawa-hachiware.gif",
    "https://media.tenor.com/f_rkpJbH1s8AAAAj/somsom1012.gif",
    "https://media.tenor.com/OGY9zdREsVAAAAAj/somsom1012.gif",
    "https://media1.tenor.com/m/WGfra-Y_Ke0AAAAd/chiikawa-sad.gif",
    "https://media.tenor.com/CivArbX7NzQAAAAj/somsom1012.gif",
    "https://media.tenor.com/5_tv1HquZlcAAAAj/chiikawa.gif",
    "https://media1.tenor.com/m/uDugCXK4vI4AAAAC/chiikawa-hachiware.gif"
];

const noMessages = [
    "No",
    "Are you sure? 🤔",
    "Pretty please... 🥺",
    "If you say no, ge lang...",
    "Iyak nalang ako boss... 😢",
    "Please??? 💔",
    "Come on...",
    "Last chance! 😭",
    "You can't catch me anyway 😜"
];

const yesTeasePokes = [
    "try saying no first... I bet you want to know what happens 😏",
    "go on, hit no... just once hehe 👀",
    "you're missing out 😈",
    "click no, I dare you 😏"
];

// Game state
let yesTeasedCount = 0;
let noClickCount = 0;
let runawayEnabled = false;
let musicPlaying = false;
let secretClickCount = 0;
let loveCalcShown = false;

// Elements
const catGif = document.getElementById('cat-gif');
const yesBtn = document.getElementById('yes-btn');
const noBtn = document.getElementById('no-btn');
const music = document.getElementById('bg-music');
const musicToggle = document.getElementById('music-toggle');
const emotionFill = document.getElementById('emotion-fill');
const happinessLevel = document.getElementById('happiness-level');
const clickSound = document.getElementById('click-sound');

// Initialize
music.volume = 0.3;
let hasInteracted = false;

// Play sound effect
function playSound() {
    if (clickSound) {
        clickSound.currentTime = 0;
        clickSound.volume = 0.3;
        clickSound.play().catch(() => {});
    }
}

// Auto-play music
function tryPlayMusic() {
    if (!hasInteracted) {
        hasInteracted = true;
        music.play().then(() => {
            musicPlaying = true;
            musicToggle.textContent = '🔊';
        }).catch(err => {
            console.log('Autoplay prevented:', err);
        });
    }
}

document.addEventListener('touchstart', tryPlayMusic, { once: true });

// Music toggle
function toggleMusic() {
    playSound();
    if (musicPlaying) {
        music.pause();
        musicPlaying = false;
        musicToggle.textContent = '🔇';
    } else {
        music.play().then(() => {
            musicPlaying = true;
            musicToggle.textContent = '🔊';
        }).catch(err => {
            console.log('Music play failed:', err);
        });
    }
}

// Update emotion meter
function updateEmotionMeter() {
    const happiness = Math.max(0, 100 - (noClickCount * 12));
    happinessLevel.textContent = happiness + '%';
    emotionFill.style.width = happiness + '%';
    
    if (happiness < 50) {
        emotionFill.style.background = 'linear-gradient(90deg, #ff6b6b, #ff8787)';
    } else if (happiness < 75) {
        emotionFill.style.background = 'linear-gradient(90deg, #ffd93d, #ffed99)';
    } else {
        emotionFill.style.background = 'linear-gradient(90deg, #ff6b9d, #c8b6ff, #ffc6ff)';
    }
}

// YES button handler
function handleYesClick() {
    playSound();
    
    if (!runawayEnabled) {
        const msg = yesTeasePokes[Math.min(yesTeasedCount, yesTeasePokes.length - 1)];
        yesTeasedCount++;
        showTeaseMessage(msg);
        
        yesBtn.style.animation = 'shake 0.5s';
        setTimeout(() => {
            yesBtn.style.animation = '';
        }, 500);
        
        // Show love calculator after 3 teases
        if (yesTeasedCount === 3 && !loveCalcShown) {
            setTimeout(() => {
                showLoveCalculator();
            }, 1000);
        }
        
        return;
    }
    
    // Unlock achievement before redirecting
    if (noClickCount >= 7) {
        localStorage.setItem('valentine-achievement', 'persistent');
    }
    
    window.location.href = 'message-reveal.html';
}

// Show tease message
function showTeaseMessage(msg) {
    const toast = document.getElementById('tease-toast');
    toast.textContent = msg;
    toast.classList.add('show');
    clearTimeout(toast._timer);
    toast._timer = setTimeout(() => toast.classList.remove('show'), 2500);
}

// NO button handler
function handleNoClick() {
    playSound();
    noClickCount++;
    
    // Hide game hint after first click
    if (noClickCount === 1) {
        const hint = document.getElementById('game-hint');
        hint.style.animation = 'fadeOut 0.5s forwards';
        setTimeout(() => hint.style.display = 'none', 500);
    }

    const msgIndex = Math.min(noClickCount, noMessages.length - 1);
    noBtn.textContent = noMessages[msgIndex];

    // Grow Yes button
    const currentSize = parseFloat(window.getComputedStyle(yesBtn).fontSize);
    const newSize = currentSize * 1.35;
    yesBtn.style.fontSize = `${newSize}px`;
    
    const padY = Math.min(18 + noClickCount * 5, 60);
    const padX = Math.min(45 + noClickCount * 10, 120);
    yesBtn.style.padding = `${padY}px ${padX}px`;

    // Shrink No button
    if (noClickCount >= 2) {
        const noSize = parseFloat(window.getComputedStyle(noBtn).fontSize);
        noBtn.style.fontSize = `${Math.max(noSize * 0.85, 10)}px`;
    }

    // Update emotion meter
    updateEmotionMeter();

    // Swap GIF
    const gifIndex = Math.min(noClickCount, gifStages.length - 1);
    swapGif(gifStages[gifIndex]);

    // Make GIF sad animation
    catGif.style.transform = 'scale(0.95)';
    setTimeout(() => {
        catGif.style.transform = 'scale(1)';
    }, 300);

    // Enable runaway at click 5
    if (noClickCount >= 5 && !runawayEnabled) {
        enableRunaway();
        runawayEnabled = true;
    }
    
    // Show love calculator at click 3 if not shown yet
    if (noClickCount === 3 && !loveCalcShown) {
        setTimeout(() => {
            showLoveCalculator();
        }, 1000);
    }
}

// Swap GIF
function swapGif(src) {
    catGif.style.opacity = '0';
    setTimeout(() => {
        catGif.src = src;
        catGif.style.opacity = '1';
    }, 200);
}

// Enable runaway
function enableRunaway() {
    noBtn.addEventListener('touchstart', (e) => {
        e.preventDefault();
        runAway();
    }, { passive: false });
    
    noBtn.addEventListener('mouseover', runAway);
    noBtn.style.cursor = 'not-allowed';
}

// Make button run away
function runAway() {
    playSound();
    const margin = 20;
    const btnW = noBtn.offsetWidth;
    const btnH = noBtn.offsetHeight;
    const maxX = window.innerWidth - btnW - margin * 2;
    const maxY = window.innerHeight - btnH - margin * 2;

    const randomX = Math.random() * maxX + margin;
    const randomY = Math.random() * maxY + margin;

    noBtn.style.position = 'fixed';
    noBtn.style.left = `${randomX}px`;
    noBtn.style.top = `${randomY}px`;
    noBtn.style.zIndex = '50';
    
    noBtn.style.animation = 'bounce 0.3s';
    setTimeout(() => {
        noBtn.style.animation = '';
    }, 300);
}

// Secret Easter Egg
function handleSecretClick() {
    playSound();
    secretClickCount++;
    
    const secretHeart = document.querySelector('.secret-heart');
    secretHeart.style.animation = 'none';
    setTimeout(() => {
        secretHeart.style.animation = 'heartbeat 1.5s ease-in-out infinite';
    }, 10);
    
    if (secretClickCount >= 5) {
        showSecretMessages();
        secretClickCount = 0;
    }
}

// Love Calculator
function showLoveCalculator() {
    loveCalcShown = true;
    const popup = document.getElementById('love-calculator');
    popup.classList.add('active');
    
    // Simulate calculation
    setTimeout(() => {
        document.querySelector('.calc-animation').style.display = 'none';
        document.getElementById('calc-result').style.display = 'block';
    }, 3500);
}

function closeLoveCalculator() {
    playSound();
    const popup = document.getElementById('love-calculator');
    popup.classList.remove('active');
}

// Secret Messages
function showSecretMessages() {
    const popup = document.getElementById('secret-messages');
    popup.classList.add('active');
    
    // Confetti effect
    if (typeof confetti !== 'undefined') {
        confetti({
            particleCount: 100,
            spread: 70,
            origin: { y: 0.6 }
        });
    }
}

function closeSecretMessages() {
    playSound();
    const popup = document.getElementById('secret-messages');
    popup.classList.remove('active');
}

// Close popups on overlay click
document.querySelectorAll('.popup-overlay').forEach(overlay => {
    overlay.addEventListener('click', (e) => {
        if (e.target === overlay) {
            overlay.classList.remove('active');
        }
    });
});

// Add animations
const style = document.createElement('style');
style.textContent = `
    @keyframes shake {
        0%, 100% { transform: translateX(0); }
        25% { transform: translateX(-10px); }
        75% { transform: translateX(10px); }
    }
    
    @keyframes bounce {
        0%, 100% { transform: scale(1); }
        50% { transform: scale(1.1); }
    }
    
    @keyframes fadeOut {
        to { opacity: 0; transform: translateY(-10px); }
    }
`;
document.head.appendChild(style);

// Handle orientation change
window.addEventListener('orientationchange', () => {
    if (runawayEnabled && noBtn.style.position === 'fixed') {
        setTimeout(() => {
            runAway();
        }, 100);
    }
});

// Preload images
function preloadImages() {
    gifStages.forEach(src => {
        const img = new Image();
        img.src = src;
    });
}

window.addEventListener('load', preloadImages);

// Add sparkle particles around Yes button
function createSparkle() {
    if (!runawayEnabled) return;
    
    const sparkle = document.createElement('div');
    sparkle.textContent = '✨';
    sparkle.style.position = 'fixed';
    sparkle.style.left = yesBtn.offsetLeft + Math.random() * yesBtn.offsetWidth + 'px';
    sparkle.style.top = yesBtn.offsetTop + Math.random() * yesBtn.offsetHeight + 'px';
    sparkle.style.fontSize = '1rem';
    sparkle.style.pointerEvents = 'none';
    sparkle.style.zIndex = '999';
    sparkle.style.animation = 'sparkleFloat 1s ease-out forwards';
    
    document.body.appendChild(sparkle);
    
    setTimeout(() => sparkle.remove(), 1000);
}

// Add sparkle animation
const sparkleStyle = document.createElement('style');
sparkleStyle.textContent = `
    @keyframes sparkleFloat {
        from {
            transform: translateY(0) scale(1);
            opacity: 1;
        }
        to {
            transform: translateY(-50px) scale(0);
            opacity: 0;
        }
    }
`;
document.head.appendChild(sparkleStyle);

// Create sparkles periodically when runaway is enabled
setInterval(() => {
    if (runawayEnabled) {
        createSparkle();
    }
}, 500);

// Show message reveal hint after exploring
let hintShown = false;
function showMessageRevealHint() {
    if (hintShown || !runawayEnabled || noClickCount < 6) return;
    hintShown = true;
    
    const hint = document.createElement('div');
    hint.innerHTML = '💡 <strong>Psst!</strong> There are hidden messages waiting for you... <a href="message-reveal-themed.html" style="color: #ffd700; text-decoration: underline; font-weight: 800;">Unlock them here!</a>';
    hint.style.position = 'fixed';
    hint.style.bottom = '80px';
    hint.style.left = '50%';
    hint.style.transform = 'translateX(-50%)';
    hint.style.background = 'rgba(200, 155, 109, 0.95)';
    hint.style.color = 'white';
    hint.style.padding = '14px 24px';
    hint.style.borderRadius = '12px';
    hint.style.fontSize = '0.95rem';
    hint.style.fontWeight = '700';
    hint.style.zIndex = '9999';
    hint.style.boxShadow = '0 6px 20px rgba(139, 94, 60, 0.5)';
    hint.style.animation = 'slideUpFade 10s ease forwards';
    hint.style.maxWidth = '90%';
    hint.style.textAlign = 'center';
    hint.style.lineHeight = '1.5';
    
    document.body.appendChild(hint);
    
    setTimeout(() => hint.remove(), 10000);
}

// Check periodically to show hint
setInterval(showMessageRevealHint, 3000);

// Achievement system
function checkAchievements() {
    const persistent = localStorage.getItem('valentine-achievement');
    if (persistent === 'persistent') {
        console.log('🏆 Achievement Unlocked: Persistent Love!');
    }
}

window.addEventListener('load', checkAchievements);

// Add random floating hearts
function createRandomHeart() {
    const heart = document.createElement('div');
    heart.textContent = ['💕', '💖', '💗', '💓'][Math.floor(Math.random() * 4)];
    heart.style.position = 'fixed';
    heart.style.left = Math.random() * window.innerWidth + 'px';
    heart.style.top = window.innerHeight + 'px';
    heart.style.fontSize = (Math.random() * 20 + 15) + 'px';
    heart.style.opacity = '0.6';
    heart.style.pointerEvents = 'none';
    heart.style.zIndex = '0';
    heart.style.animation = `floatHeartUp ${3 + Math.random() * 2}s linear forwards`;
    
    document.body.appendChild(heart);
    
    setTimeout(() => heart.remove(), 5000);
}

// Add heart animation
const heartStyle = document.createElement('style');
heartStyle.textContent = `
    @keyframes floatHeartUp {
        from {
            transform: translateY(0) rotate(0deg);
            opacity: 0.6;
        }
        to {
            transform: translateY(-110vh) rotate(360deg);
            opacity: 0;
        }
    }
`;
document.head.appendChild(heartStyle);

// Create hearts periodically
setInterval(createRandomHeart, 2000);

// Easter egg: Konami code
let konamiCode = [];
const konamiSequence = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'];

document.addEventListener('keydown', (e) => {
    konamiCode.push(e.key);
    konamiCode = konamiCode.slice(-10);
    
    if (konamiCode.join(',') === konamiSequence.join(',')) {
        showSecretMessages();
        konamiCode = [];
    }
});

const enterScreen = document.getElementById('enter-screen');
const message = document.getElementById('message'); // the element you want to reveal

if (enterScreen && message) {
    // Hide message initially
    message.style.opacity = '0';
    message.style.transition = 'opacity 0.5s';

    // Tap anywhere on the enter screen
    enterScreen.addEventListener('click', () => {
        // Fade out enter screen
        enterScreen.style.transition = 'opacity 0.5s';
        enterScreen.style.opacity = '0';

        setTimeout(() => {
            // Remove enter screen
            enterScreen.remove();

            // Reveal message
            message.style.opacity = '1';

            // Launch confetti
            launchConfetti();

            // Start counters
            startCounters();
        }, 500);
    });
} else {
    console.error('enterScreen or message element not found!');
}
