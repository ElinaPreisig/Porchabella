console.log('script.js geladen');
// ===== GLOBAL VARIABLES =====
let audio = null;
let isPlaying = false;
let currentSlide = 0;
let slides = [];
let isScrolling = false;

// Event-Listener für Seitenwechsel
window.addEventListener('beforeunload', function() {
    // Speichere den aktuellen Audio-Status vor dem Seitenwechsel
    if (audio && !audio.paused) {
        localStorage.setItem('audioPlaying', 'true');
    }
});

// ===== AUDIO FUNCTIONS =====
function initializeAudio() {
    // Debug-Ausgabe
    console.log('initializeAudio: ', document.getElementById('bg-audio'));
    // Versuche das Audio-Element zu holen
    audio = document.getElementById('bg-audio');
    if (!audio) {
        // Wenn es noch nicht da ist, versuche es nach kurzer Zeit erneut
        setTimeout(initializeAudio, 100);
        return;
    }
    const audioButton = document.getElementById('audioButton');
    
    if (audio) {
        // Audio-Status beim Laden wiederherstellen
        const wasPlaying = localStorage.getItem('audioPlaying') === 'true';
        const userHasActivatedAudio = localStorage.getItem('userHasActivatedAudio') === 'true';
        
        // Event-Listener für Audio-Status-Synchronisation
        audio.addEventListener('play', function() {
            isPlaying = true;
            updateAudioButton();
        });
        audio.addEventListener('pause', function() {
            isPlaying = false;
            updateAudioButton();
        });
        audio.addEventListener('ended', function() {
            isPlaying = false;
            updateAudioButton();
        });
        // Button-Text aktualisieren (falls Button vorhanden)
        if (audioButton) {
            updateAudioButton();
        }
        // Wenn der Benutzer das Audio bereits aktiviert hat und es abgespielt werden sollte
        if (userHasActivatedAudio && wasPlaying) {
            // Event-Listener für automatische Wiedergabe nach der ersten Benutzerinteraktion
            const startAudioOnInteraction = function() {
                if (!isPlaying) {
                    playAudio();
                }
                // Entferne den Event-Listener nach der ersten Interaktion
                document.removeEventListener('click', startAudioOnInteraction);
                document.removeEventListener('keydown', startAudioOnInteraction);
                document.removeEventListener('touchstart', startAudioOnInteraction);
            };
            // Verschiedene Event-Listener für Benutzerinteraktion
            document.addEventListener('click', startAudioOnInteraction);
            document.addEventListener('keydown', startAudioOnInteraction);
            document.addEventListener('touchstart', startAudioOnInteraction);
        }
    }
}

function toggleAudio() {
    if (!audio) {
        audio = document.getElementById('bg-audio');
        if (!audio) {
            alert('Audio-Element nicht gefunden!');
            return;
        }
    }
    console.log('toggleAudio called, isPlaying:', isPlaying);
    if (isPlaying) {
        pauseAudio();
    } else {
        playAudio();
    }
}

function playAudio() {
    if (audio) {
        audio.play().then(() => {
            isPlaying = true;
            localStorage.setItem('audioPlaying', 'true');
            localStorage.setItem('userHasActivatedAudio', 'true');
            updateAudioButton();
        }).catch(error => {
            alert('Audio konnte nicht automatisch gestartet werden. Bitte klicke erneut!');
            isPlaying = false;
            localStorage.setItem('audioPlaying', 'false');
            updateAudioButton();
        });
    }
}

function pauseAudio() {
    if (audio) {
        audio.pause();
        isPlaying = false;
        localStorage.setItem('audioPlaying', 'false');
        updateAudioButton();
    }
}

function updateAudioButton() {
    const audioButton = document.getElementById('audioButton');
    if (audioButton) {
        if (isPlaying) {
            audioButton.textContent = '🔇 Pause Music';
            audioButton.classList.add('playing');
        } else {
            audioButton.textContent = '🎵 Play Music';
            audioButton.classList.remove('playing');
        }
    }
}

function syncAudioState() {
    if (audio) {
        const actualPlaying = !audio.paused && !audio.ended;
        if (actualPlaying !== isPlaying) {
            isPlaying = actualPlaying;
            updateAudioButton();
        }
    }
}

// ===== INTERACTIVE AUDIO FUNCTIONS =====
function playAudio(audioId, element) {
    // Stoppe alle anderen Audios zuerst
    const allAudios = document.querySelectorAll('audio');
    allAudios.forEach(audio => {
        if (audio.id !== audioId) {
            audio.pause();
            audio.currentTime = 0;
        }
    });

    // Entferne active Klasse von allen audio-items
    const allAudioItems = document.querySelectorAll('.audio-item');
    allAudioItems.forEach(item => {
        item.classList.remove('active');
    });

    // Füge active Klasse zum geklickten Element hinzu
    element.classList.add('active');

    // Spiele das gewählte Audio ab
    const audio = document.getElementById(audioId);
    if (audio) {
        audio.play().then(() => {
            console.log(`Audio ${audioId} wird abgespielt`);
        }).catch(error => {
            console.error('Fehler beim Abspielen des Audios:', error);
            alert('Audio konnte nicht abgespielt werden. Bitte versuchen Sie es erneut.');
        });
    }

    // Event-Listener für das Ende des Audios
    audio.addEventListener('ended', function() {
        element.classList.remove('active');
    });

    // Event-Listener für Pause
    audio.addEventListener('pause', function() {
        element.classList.remove('active');
    });
}


// ===== FULLSCREEN FUNCTIONS =====
function toggleFullscreen() {
    if (!document.fullscreenElement) {
        // Vollbild aktivieren
        if (document.documentElement.requestFullscreen) {
            document.documentElement.requestFullscreen();
        } else if (document.documentElement.webkitRequestFullscreen) {
            document.documentElement.webkitRequestFullscreen();
        } else if (document.documentElement.msRequestFullscreen) {
            document.documentElement.msRequestFullscreen();
        }
    } else {
        // Vollbild beenden
        if (document.exitFullscreen) {
            document.exitFullscreen();
        } else if (document.webkitExitFullscreen) {
            document.webkitExitFullscreen();
        } else if (document.msExitFullscreen) {
            document.msExitFullscreen();
        }
    }
}

function updateFullscreenButton() {
    const fullscreenButton = document.getElementById('fullscreenButton');
    if (fullscreenButton) {
        if (document.fullscreenElement) {
            fullscreenButton.textContent = '⛶ Exit Vollbild';
            fullscreenButton.classList.add('active');
        } else {
            fullscreenButton.textContent = '⛶ Vollbild';
            fullscreenButton.classList.remove('active');
        }
    }
}

// ===== URL PARAMETER FUNCTIONS =====
function getUrlParameter(name) {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(name);
}

function getUserRole() {
    return getUrlParameter('role') || 'default';
}

function saveUserChoice(choice) {
    localStorage.setItem('userRole', choice);
    
    const url = new URL(window.location);
    url.searchParams.set('role', choice);
    window.history.replaceState({}, '', url);
}

function loadUserChoice() {
    const urlRole = getUrlParameter('role');
    const storedRole = localStorage.getItem('userRole');
    
    return urlRole || storedRole || 'default';
}

// ===== PERSONALIZED CONTENT =====
function updateContentBasedOnRole() {
    // Nur auf der Auswahl-Seite personalisierte Titel anzeigen
    if (window.location.pathname.includes('auswahl.html')) {
        const role = loadUserChoice();
        
        const titleElement = document.querySelector('h1');
        if (titleElement) {
            switch(role) {
                case 'mystiker':
                    titleElement.innerHTML = 'Willkommen, <span style="color: var(--accent-color);">Mystiker</span>';
                    break;
                case 'wissenschaftlerin':
                    titleElement.innerHTML = 'Willkommen, <span style="color: var(--accent-color);">Wissenschaftlerin</span>';
                    break;
                case 'abenteurer':
                    titleElement.innerHTML = 'Willkommen, <span style="color: var(--accent-color);">Abenteurer</span>';
                    break;
            }
        }
        
        console.log('Aktuelle Rolle:', role);
    }
}

// ===== SLIDE SYSTEM FUNCTIONS =====
function initSlideSystem() {
    slides = document.querySelectorAll('.slide');
    const dots = document.querySelectorAll('.slide-dot');
    
    if (dots.length > 0) {
        dots.forEach((dot, index) => {
            dot.addEventListener('click', () => {
                goToSlide(index);
            });
        });
        
        const container = document.getElementById('slideContainer');
        if (container) {
            container.addEventListener('scroll', handleScroll);
        }
        
        updateSlideDots();
        animateCurrentSlide();
    }
}

function handleScroll() {
    if (isScrolling) return;
    
    const container = document.getElementById('slideContainer');
    if (!container) return;
    
    const scrollTop = container.scrollTop;
    const slideHeight = window.innerHeight;
    const newSlide = Math.round(scrollTop / slideHeight);
    
    if (newSlide !== currentSlide) {
        currentSlide = newSlide;
        updateSlideDots();
        animateCurrentSlide();
    }
}

function goToSlide(slideIndex) {
    if (slideIndex < 0 || slideIndex >= slides.length) return;
    
    isScrolling = true;
    currentSlide = slideIndex;
    
    const container = document.getElementById('slideContainer');
    if (container) {
        const slideHeight = window.innerHeight;
        
        container.scrollTo({
            top: slideIndex * slideHeight,
            behavior: 'smooth'
        });
    }
    
    updateSlideDots();
    animateCurrentSlide();
    
    setTimeout(() => {
        isScrolling = false;
    }, 1000);
}

function updateSlideDots() {
    const dots = document.querySelectorAll('.slide-dot');
    dots.forEach((dot, index) => {
        if (index === currentSlide) {
            dot.classList.add('active');
        } else {
            dot.classList.remove('active');
        }
    });
}

function animateCurrentSlide() {
    slides.forEach((slide, index) => {
        if (index === currentSlide) {
            slide.classList.add('animate-in');
        } else if (index < currentSlide) {
            slide.classList.add('animate-out');
            slide.classList.remove('animate-in');
        } else {
            slide.classList.remove('animate-in', 'animate-out');
        }
    });
}

// ===== KEYBOARD NAVIGATION =====
function initKeyboardNavigation() {
    document.addEventListener('keydown', function(e) {
        if (slides.length > 0) {
            if (e.key === 'ArrowDown' || e.key === 'PageDown' || e.key === ' ') {
                e.preventDefault();
                goToSlide(currentSlide + 1);
            } else if (e.key === 'ArrowUp' || e.key === 'PageUp') {
                e.preventDefault();
                goToSlide(currentSlide - 1);
            } else if (e.key === 'Home') {
                e.preventDefault();
                goToSlide(0);
            } else if (e.key === 'End') {
                e.preventDefault();
                goToSlide(slides.length - 1);
            }
        }
    });
}

// ===== SNOWFLAKE FUNCTIONALITY =====
function initSnowflake() {
    console.log('Initialisiere Schneeflocke...');
    
    // Canvas und Kontext
    const canvas = document.getElementById('snowflakeCanvas');
    if (!canvas) {
        console.log('Canvas nicht gefunden');
        return;
    }
    
    const ctx = canvas.getContext('2d');
    
    // Variablen
    let isDrawing = false;
    let lastX = 0;
    let lastY = 0;
    const symmetry = 6;
    const angle = 360 / symmetry;
    
    // Canvas Setup
    function setupCanvas() {
        ctx.fillStyle = 'white';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.strokeStyle = 'black';
        ctx.lineWidth = 2;
        ctx.lineCap = 'round';
    }
    
    // Zeichne Schneeflocke-Linie
    function drawSnowflakeLine(x1, y1, x2, y2) {
        const centerX = canvas.width / 2;
        const centerY = canvas.height / 2;
        
        // Relative Koordinaten zum Zentrum
        const mx1 = x1 - centerX;
        const my1 = y1 - centerY;
        const mx2 = x2 - centerX;
        const my2 = y2 - centerY;
        
        // Zeichne für jede Symmetrie
        for (let i = 0; i < symmetry; i++) {
            ctx.save();
            ctx.translate(centerX, centerY);
            ctx.rotate((i * angle * Math.PI) / 180);
            
            // Normale Linie
            ctx.beginPath();
            ctx.moveTo(mx1, my1);
            ctx.lineTo(mx2, my2);
            ctx.stroke();
            
            // Gespiegelte Linie
            ctx.scale(1, -1);
            ctx.beginPath();
            ctx.moveTo(mx1, my1);
            ctx.lineTo(mx2, my2);
            ctx.stroke();
            
            ctx.restore();
        }
    }
    
    // Zeichne Schneeflocke-Punkt
    function drawSnowflakePoint(x, y) {
        const centerX = canvas.width / 2;
        const centerY = canvas.height / 2;
        
        const mx = x - centerX;
        const my = y - centerY;
        
        for (let i = 0; i < symmetry; i++) {
            ctx.save();
            ctx.translate(centerX, centerY);
            ctx.rotate((i * angle * Math.PI) / 180);
            
            // Normaler Punkt
            ctx.beginPath();
            ctx.arc(mx, my, 1, 0, 2 * Math.PI);
            ctx.fill();
            
            // Gespiegelter Punkt
            ctx.scale(1, -1);
            ctx.beginPath();
            ctx.arc(mx, my, 1, 0, 2 * Math.PI);
            ctx.fill();
            
            ctx.restore();
        }
    }
    
    // Event Listeners
    canvas.addEventListener('mousedown', function(e) {
        console.log('Maus gedrückt');
        isDrawing = true;
        const rect = canvas.getBoundingClientRect();
        lastX = e.clientX - rect.left;
        lastY = e.clientY - rect.top;
        drawSnowflakePoint(lastX, lastY);
    });
    
    canvas.addEventListener('mousemove', function(e) {
        if (!isDrawing) return;
        
        const rect = canvas.getBoundingClientRect();
        const currentX = e.clientX - rect.left;
        const currentY = e.clientY - rect.top;
        
        drawSnowflakeLine(lastX, lastY, currentX, currentY);
        
        lastX = currentX;
        lastY = currentY;
    });
    
    canvas.addEventListener('mouseup', function() {
        console.log('Maus losgelassen');
        isDrawing = false;
    });
    
    canvas.addEventListener('mouseleave', function() {
        isDrawing = false;
    });
    
    // Buttons
    const clearBtn = document.getElementById('clear-btn');
    if (clearBtn) {
        clearBtn.addEventListener('click', function() {
            setupCanvas();
        });
    }
    
    const saveBtn = document.getElementById('save-btn');
    if (saveBtn) {
        saveBtn.addEventListener('click', function() {
            const link = document.createElement('a');
            link.download = 'porchabella-schneeflocke.png';
            link.href = canvas.toDataURL();
            link.click();
        });
    }
    
    // Initialisiere Canvas
    setupCanvas();
    console.log('Schneeflocke erfolgreich initialisiert');
}

// ===== INITIALIZATION =====
document.addEventListener('DOMContentLoaded', function() {
    // Audio-Funktionalität
    initializeAudio();
    
    // Vollbild-Event-Listener
    document.addEventListener('fullscreenchange', updateFullscreenButton);
    document.addEventListener('webkitfullscreenchange', updateFullscreenButton);
    document.addEventListener('msfullscreenchange', updateFullscreenButton);
    
    // Rollen-Funktionalität
    updateContentBasedOnRole();
    
    // Slide-System (nur wenn Slides vorhanden)
    initSlideSystem();
    
    // Keyboard-Navigation
    initKeyboardNavigation();
    
    // Event-Listener für Auswahl-Buttons
    const choiceButtons = document.querySelectorAll('.choice-button');
    choiceButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            if (href && href.includes('=')) {
                const role = href.split('=')[1];
                saveUserChoice(role);
            }
        });
    });

    // Schneeflocke-Funktionalität
    initSnowflake();
});

// Am Ende sicherheitshalber nochmal direkt aufrufen:
initializeAudio();
