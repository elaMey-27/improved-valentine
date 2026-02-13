let musicPlaying = false;
const music = document.getElementById('bg-music');
const enterScreen = document.getElementById('enter-screen');
const musicToggle = document.getElementById('music-toggle');

// Set initial volume
music.volume = 0.3;

// Handle enter screen click/tap
function startCelebration(e) {
    e.preventDefault();

    music.play().then(() => {
        musicPlaying = true;
        musicToggle.textContent = '🔊';
    }).catch(err => {
        console.log('Music autoplay prevented:', err);
    });

    enterScreen.style.pointerEvents = 'none';
    enterScreen.style.opacity = '0';
    setTimeout(() => enterScreen.remove(), 500);

    launchConfetti();
    startCounters();
}

enterScreen.addEventListener('pointerdown', startCelebration, { once: true });

function startCelebration(e) {
    alert("Tapped!");

    // Play music
    music.play().then(() => {
        musicPlaying = true;
        musicToggle.textContent = '🔊';
    }).catch(err => {
        console.log('Music autoplay prevented:', err);
    });
}


if (enterScreen) {
    // Fade out enter screen
    enterScreen.style.transition = 'opacity 0.5s';
    enterScreen.style.opacity = '0';

    // Wait for the transition to finish before removing
    setTimeout(() => {
        enterScreen.remove();

        // Launch confetti after screen removed
        launchConfetti();

        // Start counters after screen removed
        startCounters();
    }, 500);
} else {
    console.error('enterScreen element not found!');
}


// =====================
// CONFETTI
// =====================
function launchConfetti() {
    const colors = [
        "#ff69b4",
        "#ff1493",
        "#ff85a2",
        "#ffb3c1",
        "#ff0000",
        "#ff6347",
        "#fff",
        "#ffdf00",
        "#c8b6ff",
        "#ffc6ff"
    ];

    const duration = 8000;
    const end = Date.now() + duration;

    // Initial burst
    confetti({
        particleCount: 200,
        spread: 120,
        origin: { x: 0.5, y: 0.3 },
        colors,
        startVelocity: 50,
        gravity: 1.2,
        scalar: 1.3
    });

    // Side cannons
    const interval = setInterval(() => {
        if (Date.now() > end) {
            clearInterval(interval);
            return;
        }

        // Left side
        confetti({
            particleCount: 50,
            angle: 60,
            spread: 60,
            origin: { x: 0, y: 0.6 },
            colors,
            startVelocity: 40
        });

        // Right side
        confetti({
            particleCount: 50,
            angle: 120,
            spread: 60,
            origin: { x: 1, y: 0.6 },
            colors,
            startVelocity: 40
        });
    }, 300);
    
    // Extra bursts
    setTimeout(() => {
        confetti({
            particleCount: 150,
            spread: 140,
            origin: { x: 0.5, y: 0.5 },
            colors,
            startVelocity: 45
        });
    }, 2000);
    
    setTimeout(() => {
        confetti({
            particleCount: 100,
            spread: 100,
            origin: { x: Math.random(), y: 0.4 },
            colors
        });
    }, 4000);
}

// =====================
// MUSIC TOGGLE
// =====================
function toggleMusic() {
    if (musicPlaying) {
        music.pause();
        musicPlaying = false;
        musicToggle.textContent = "🔇";
    } else {
        music.play().then(() => {
            musicPlaying = true;
            musicToggle.textContent = "🔊";
        }).catch(err => {
            console.log('Music play failed:', err);
        });
    }
}

// =====================
// COUNTERS & STATS
// =====================
function startCounters() {
    // Calculate days together (customize this date!)
    const startDate = new Date('2024-01-01'); // Change to your actual date
    const today = new Date();
    const daysTogether = Math.floor((today - startDate) / (1000 * 60 * 60 * 24));
    
    animateCounter('days-together', daysTogether, 2000);
    animateCounter('messages-shared', 9999, 2500, '+');
}

function animateCounter(id, target, duration, suffix = '') {
    const element = document.getElementById(id);
    if (!element) return;
    
    const start = 0;
    const increment = target / (duration / 16);
    let current = start;
    
    const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
            element.textContent = target + suffix;
            clearInterval(timer);
        } else {
            element.textContent = Math.floor(current) + suffix;
        }
    }, 16);
}

// =====================
// FLOATING HEARTS
// =====================
function createFloatingHeart() {
    const hearts = ['💕', '💖', '💗', '💓', '💝', '💘'];
    const heart = document.createElement('div');
    heart.textContent = hearts[Math.floor(Math.random() * hearts.length)];
    heart.style.position = 'fixed';
    heart.style.left = Math.random() * 100 + '%';
    heart.style.bottom = '-50px';
    heart.style.fontSize = (Math.random() * 20 + 15) + 'px';
    heart.style.opacity = '0.7';
    heart.style.pointerEvents = 'none';
    heart.style.zIndex = '1';
    heart.style.animation = `floatUp ${3 + Math.random() * 2}s linear`;
    
    document.body.appendChild(heart);
    
    setTimeout(() => {
        heart.remove();
    }, 5500);
}

// Add floating hearts periodically
setInterval(createFloatingHeart, 600);

// Add animation
const style = document.createElement('style');
style.textContent = `
    @keyframes floatUp {
        from {
            transform: translateY(0) rotate(0deg);
            opacity: 0.7;
        }
        to {
            transform: translateY(-110vh) rotate(360deg);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

// =====================
// SPARKLE EFFECTS
// =====================
function createSparkle(x, y) {
    const sparkle = document.createElement('div');
    sparkle.textContent = '✨';
    sparkle.style.position = 'fixed';
    sparkle.style.left = x + 'px';
    sparkle.style.top = y + 'px';
    sparkle.style.fontSize = '1.5rem';
    sparkle.style.pointerEvents = 'none';
    sparkle.style.zIndex = '9999';
    sparkle.style.animation = 'sparkleAnim 1s ease-out forwards';
    
    document.body.appendChild(sparkle);
    
    setTimeout(() => sparkle.remove(), 1000);
}

const sparkleStyle = document.createElement('style');
sparkleStyle.textContent = `
    @keyframes sparkleAnim {
        0% {
            transform: scale(0) rotate(0deg);
            opacity: 1;
        }
        100% {
            transform: scale(2) rotate(180deg);
            opacity: 0;
        }
    }
`;
document.head.appendChild(sparkleStyle);

// Add sparkles on click
document.addEventListener('click', (e) => {
    if (enterScreen && enterScreen.parentNode) return; // Don't add sparkles on enter screen
    
    for (let i = 0; i < 3; i++) {
        setTimeout(() => {
            createSparkle(
                e.clientX + (Math.random() - 0.5) * 50,
                e.clientY + (Math.random() - 0.5) * 50
            );
        }, i * 100);
    }
});

// =====================
// POLAROID INTERACTIONS
// =====================
document.querySelectorAll('.polaroid').forEach((polaroid, index) => {
    polaroid.style.animationDelay = (index * 0.1) + 's';
    polaroid.style.animation = 'fadeIn 0.6s ease both';
});

// =====================
// BADGE INTERACTIONS
// =====================
document.querySelectorAll('.badge').forEach(badge => {
    badge.addEventListener('mouseenter', () => {
        createMiniConfetti(badge);
    });
});

function createMiniConfetti(element) {
    const rect = element.getBoundingClientRect();
    confetti({
        particleCount: 20,
        spread: 40,
        origin: {
            x: (rect.left + rect.width / 2) / window.innerWidth,
            y: (rect.top + rect.height / 2) / window.innerHeight
        },
        colors: ['#ff69b4', '#ffc6ff', '#c8b6ff'],
        startVelocity: 15,
        gravity: 0.8,
        scalar: 0.8
    });
}

// =====================
// RANDOM ENCOURAGEMENTS
// =====================
const encouragements = [
    "You're amazing! 💖",
    "Keep smiling! 😊",
    "You've got this! 💪",
    "Stay awesome! ✨",
    "You're special! 🌟"
];

function showRandomEncouragement() {
    const msg = encouragements[Math.floor(Math.random() * encouragements.length)];
    const toast = document.createElement('div');
    toast.textContent = msg;
    toast.style.position = 'fixed';
    toast.style.bottom = '80px';
    toast.style.left = '50%';
    toast.style.transform = 'translateX(-50%)';
    toast.style.background = 'rgba(255, 105, 180, 0.95)';
    toast.style.color = 'white';
    toast.style.padding = '12px 24px';
    toast.style.borderRadius = '50px';
    toast.style.fontSize = '1rem';
    toast.style.fontWeight = '700';
    toast.style.zIndex = '9999';
    toast.style.boxShadow = '0 4px 15px rgba(255, 105, 180, 0.4)';
    toast.style.animation = 'slideUpFade 3s ease forwards';
    
    document.body.appendChild(toast);
    
    setTimeout(() => toast.remove(), 3000);
}

const toastStyle = document.createElement('style');
toastStyle.textContent = `
    @keyframes slideUpFade {
        0% {
            opacity: 0;
            transform: translateX(-50%) translateY(20px);
        }
        10%, 90% {
            opacity: 1;
            transform: translateX(-50%) translateY(0);
        }
        100% {
            opacity: 0;
            transform: translateX(-50%) translateY(-20px);
        }
    }
`;
document.head.appendChild(toastStyle);

// Show random encouragement every 15 seconds
setInterval(showRandomEncouragement, 15000);

// =====================
// ACHIEVEMENT TRACKING
// =====================
const achievement = localStorage.getItem('valentine-achievement');
if (achievement === 'persistent') {
    setTimeout(() => {
        confetti({
            particleCount: 100,
            spread: 70,
            origin: { y: 0.6 },
            colors: ['#ffd700', '#ffed4e', '#fff44f']
        });
        
        const achieveMsg = document.createElement('div');
        achieveMsg.innerHTML = '🏆 <strong>Achievement Unlocked!</strong><br>Persistent Love';
        achieveMsg.style.position = 'fixed';
        achieveMsg.style.top = '20px';
        achieveMsg.style.left = '50%';
        achieveMsg.style.transform = 'translateX(-50%)';
        achieveMsg.style.background = 'rgba(255, 215, 0, 0.95)';
        achieveMsg.style.color = '#6F4427';
        achieveMsg.style.padding = '16px 28px';
        achieveMsg.style.borderRadius = '16px';
        achieveMsg.style.fontSize = '1rem';
        achieveMsg.style.fontWeight = '700';
        achieveMsg.style.zIndex = '9999';
        achieveMsg.style.textAlign = 'center';
        achieveMsg.style.boxShadow = '0 6px 20px rgba(255, 215, 0, 0.5)';
        achieveMsg.style.animation = 'slideDown 4s ease forwards';
        
        document.body.appendChild(achieveMsg);
        
        setTimeout(() => achieveMsg.remove(), 4000);
    }, 3000);
}

const achieveStyle = document.createElement('style');
achieveStyle.textContent = `
    @keyframes slideDown {
        0% {
            opacity: 0;
            transform: translateX(-50%) translateY(-100px);
        }
        10%, 90% {
            opacity: 1;
            transform: translateX(-50%) translateY(0);
        }
        100% {
            opacity: 0;
            transform: translateX(-50%) translateY(-100px);
        }
    }
`;
document.head.appendChild(achieveStyle);