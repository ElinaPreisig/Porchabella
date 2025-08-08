// Einfache SPA-Logik: lädt Teil-HTML-Dateien in #app
function setAudioButtonHandler() {
    const audio = document.getElementById('bg-audio');
    const audioButton = document.getElementById('audioButton');
    if (audio && audioButton && !audioButton._handlerSet) {
        function updateAudioBtn() {
            audioButton.textContent = audio.paused ? '🔇 Musik an' : '🔊 Musik aus';
        }
        audioButton.addEventListener('click', function(e) {
            e.preventDefault();
            if (audio.paused) {
                audio.play();
            } else {
                audio.pause();
            }
            updateAudioBtn();
        });
        audio.addEventListener('play', updateAudioBtn);
        audio.addEventListener('pause', updateAudioBtn);
        updateAudioBtn();
        audioButton._handlerSet = true;
    }
}

// Globale Funktion für Button-Logik basierend auf Rolle
function showButtonsBasedOnRole() {
    console.log('SPA: showButtonsBasedOnRole() aufgerufen');
    
    // URL-Parameter aus der aktuellen URL lesen
    const currentUrl = window.location.href;
    console.log('SPA: Aktuelle URL:', currentUrl);
    
    // Rolle aus URL-Parameter oder localStorage lesen
    let role = 'default';
    if (currentUrl.includes('?role=')) {
        role = currentUrl.split('?role=')[1].split('&')[0];
        console.log('SPA: Rolle aus URL gelesen:', role);
    } else {
        role = localStorage.getItem('userRole') || 'default';
        console.log('SPA: Rolle aus localStorage gelesen:', role);
    }
    
    console.log('SPA: Finale Benutzerrolle:', role);
    
    const adventurerButtons = document.getElementById('adventurerButtons');
    const mystikerButtons = document.getElementById('mystikerButtons');
    const wissenschaftlerinButtons = document.getElementById('wissenschaftlerinButtons');
    const defaultButtons = document.getElementById('defaultButtons');
    
    console.log('SPA: adventurerButtons gefunden:', adventurerButtons);
    console.log('SPA: mystikerButtons gefunden:', mystikerButtons);
    console.log('SPA: wissenschaftlerinButtons gefunden:', wissenschaftlerinButtons);
    console.log('SPA: defaultButtons gefunden:', defaultButtons);
    
    // Alle Buttons zunächst verstecken
    if (adventurerButtons) {
        adventurerButtons.style.display = 'none';
        console.log('SPA: Abenteurer-Buttons versteckt');
    }
    if (mystikerButtons) {
        mystikerButtons.style.display = 'none';
        console.log('SPA: Mystiker-Buttons versteckt');
    }
    if (wissenschaftlerinButtons) {
        wissenschaftlerinButtons.style.display = 'none';
        console.log('SPA: Wissenschaftlerin-Buttons versteckt');
    }
    if (defaultButtons) {
        defaultButtons.style.display = 'none';
        console.log('SPA: Default-Buttons versteckt');
    }
    
    // Buttons basierend auf Rolle anzeigen
    if (role === 'abenteurer' && adventurerButtons) {
        adventurerButtons.style.display = 'block';
        // Spezielle Klasse für vertikale Anordnung bei Abenteurer-Pfad
        adventurerButtons.classList.add('adventurer-layout');
        console.log('SPA: Abenteurer-Buttons angezeigt (vertikal)');
    } else if (role === 'mystiker' && mystikerButtons) {
        mystikerButtons.style.display = 'flex';
        console.log('SPA: Mystiker-Buttons angezeigt (nebeneinander)');
    } else if (role === 'wissenschaftlerin' && wissenschaftlerinButtons) {
        wissenschaftlerinButtons.style.display = 'flex';
        console.log('SPA: Wissenschaftlerin-Buttons angezeigt (nebeneinander)');
    } else {
        if (defaultButtons) {
            defaultButtons.style.display = 'block';
            console.log('SPA: Default-Buttons angezeigt');
        }
        console.log('SPA: Keine passende Rolle gefunden oder Buttons nicht verfügbar');
        console.log('SPA: Rolle war:', role);
    }
}

// Intro-Slide-System
function initIntroSlides() {
    console.log('SPA: Initialisiere Intro-Slides...');
    
    const slides = document.querySelectorAll('.slide');
    const dots = document.querySelectorAll('.slide-dot');
    const container = document.getElementById('slideContainer');
    
    console.log('SPA: Gefundene Slides:', slides.length);
    console.log('SPA: Gefundene Dots:', dots.length);
    console.log('SPA: Container:', container);
    
    if (!container || slides.length === 0) {
        console.log('SPA: Container oder Slides nicht gefunden!');
        return;
    }
    
    // Stelle sicher, dass alle Slides sichtbar sind
    slides.forEach((slide, index) => {
        slide.style.opacity = '1';
        slide.style.transform = 'translateY(0)';
        slide.style.display = 'flex';
        console.log(`SPA: Slide ${index} sichtbar gemacht`);
    });
    
    // Stelle sicher, dass alle h1/h2 Elemente sichtbar sind
    const h1Elements = document.querySelectorAll('.slide h1, .slide h2');
    h1Elements.forEach((h1, index) => {
        h1.style.opacity = '1';
        h1.style.transform = 'translateY(0)';
        console.log(`SPA: H1/H2 ${index} sichtbar gemacht`);
    });
    
    // Stelle sicher, dass alle slide-actions sichtbar sind
    const slideActions = document.querySelectorAll('.slide-actions');
    slideActions.forEach((action, index) => {
        action.style.opacity = '1';
        action.style.transform = 'translateY(0)';
        action.style.display = 'block';
        action.style.visibility = 'visible';
        console.log(`SPA: Slide-Actions ${index} sichtbar gemacht`);
    });
    
    // Einfache Dot-Navigation
    dots.forEach((dot, index) => {
        dot.addEventListener('click', () => {
            console.log(`SPA: Dot ${index} geklickt`);
            goToSlide(index);
        });
    });
    
    // Einfache Keyboard-Navigation
    document.addEventListener('keydown', function(e) {
        const currentSlide = Math.round(container.scrollTop / window.innerHeight);
        
        if (e.key === 'ArrowDown' || e.key === 'PageDown' || e.key === ' ') {
            e.preventDefault();
            goToSlide(currentSlide + 1);
        } else if (e.key === 'ArrowUp' || e.key === 'PageUp') {
            e.preventDefault();
            goToSlide(currentSlide - 1);
        }
    });
    
    function goToSlide(slideIndex) {
        if (slideIndex < 0 || slideIndex >= slides.length) return;
        
        console.log(`SPA: Gehe zu Slide ${slideIndex}`);
        const slideHeight = window.innerHeight;
        
        container.scrollTo({
            top: slideIndex * slideHeight,
            behavior: 'smooth'
        });
        
        // Update dots
        updateDots(slideIndex);
    }
    
    function updateDots(activeIndex) {
        dots.forEach((dot, index) => {
            if (index === activeIndex) {
                dot.classList.add('active');
            } else {
                dot.classList.remove('active');
            }
        });
    }
    
    // Verbessertes Scroll-Event für automatische Dot-Updates
    let scrollTimeout;
    container.addEventListener('scroll', function() {
        // Debounce für bessere Performance
        clearTimeout(scrollTimeout);
        scrollTimeout = setTimeout(() => {
            const currentSlide = Math.round(container.scrollTop / window.innerHeight);
            console.log(`SPA: Scroll-Update: Slide ${currentSlide}`);
            updateDots(currentSlide);
        }, 50);
    });
    
    // Initial dots setzen
    updateDots(0);
    
    // Automatisches Scrollen nach 3 Sekunden zum ersten Slide (Slide 1)
    setTimeout(() => {
        console.log('SPA: Automatisches Scrollen zu Slide 1 nach 3 Sekunden');
        goToSlide(1);
    }, 3000);
    
    console.log('SPA: Intro-Slides erfolgreich initialisiert!');
}

function loadPage() {
  const hash = location.hash.replace('#', '') || 'home';
  const pageName = hash.split('?')[0];
  const pageUrl = `pages/${pageName}.html`;
  
  fetch(pageUrl)
    .then(res => res.ok ? res.text() : Promise.reject('Seite nicht gefunden'))
    .then(html => {
      document.getElementById('app').innerHTML = html;
      setAudioButtonHandler();
      
      // Apply body classes based on page type
      const body = document.body;
      body.classList.remove('mystic-path', 'scientific-path');
      
      // Mystic path pages
      const mysticPages = ['sage-porchabella', 'gletscherwanderung', 'gletscherrueckgang', 'mythos-porchabella'];
      if (mysticPages.includes(pageName)) {
        body.classList.add('mystic-path');
      }
      
      // Scientific path pages
      const scientificPages = ['gletscher-entstehung', 'auswirkungen-landschaft', 'gletschermessung', 'leichenfund'];
      if (scientificPages.includes(pageName)) {
        body.classList.add('scientific-path');
      }
      
      // Intro-Slides initialisieren, wenn wir auf der Intro-Seite sind
      if (pageName === 'intro') {
        console.log('SPA: Intro-Seite geladen, initialisiere Slides...');
        setTimeout(initIntroSlides, 100);
      }
      // Button-Logik für Video-Seiten
      if (pageName === 'sage-porchabella') {
        console.log('SPA: Video-Seite geladen, initialisiere Button-Logik...');
        setTimeout(stopBackgroundAudio, 100);
      }
      // Quiz-Logik für Gletscher-Entstehung
      if (pageName === 'gletscher-entstehung') {
        console.log('SPA: Gletscher-Entstehung Seite geladen, initialisiere Quiz...');
        setTimeout(setupGlacierQuiz, 100);
        setTimeout(setupGlacierButtons, 100);
        setTimeout(initGlacierSlides, 100);
      }
      
      // Timeline-Logik für Gletscherrückgang
      if (pageName === 'gletscherrueckgang') {
        console.log('SPA: Gletscherrückgang Seite geladen, initialisiere Timeline...');
        setTimeout(initializeTimeline, 100);
      }
      
      // Schneeflocke-Logik für eisflocke
      if (pageName === 'eisflocke') {
        console.log('SPA: Schneeflocke-Seite geladen, initialisiere Schneeflocke...');
        setTimeout(initSnowflake, 100);
      }
      
      // Button-Logik für alle anderen Seiten
      showButtonsBasedOnRole();
      setTimeout(showButtonsBasedOnRole, 100);
      setTimeout(showButtonsBasedOnRole, 500);
      setTimeout(showButtonsBasedOnRole, 1000);
    })
    .catch(() => {
      document.getElementById('app').innerHTML = '<h2>Seite nicht gefunden</h2>';
    });
}

// Funktion zum Stoppen des Hintergrundaudios für Video-Seiten
function stopBackgroundAudio() {
    console.log('SPA: stopBackgroundAudio() aufgerufen');
    
    // Button-Logik für sage-porchabella.html
    showButtonsBasedOnRole();
    
    console.log('SPA: Button-Logik für Video-Seite eingerichtet');
}

// Gletscher-Geschwindigkeits-Quiz Funktion
function checkGlacierSpeed() {
    console.log('=== GLACIER SPEED QUIZ DEBUG ===');
    
    const input = document.getElementById('glacierSpeed');
    const result = document.getElementById('result');
    
    console.log('Input Element gefunden:', input);
    console.log('Result Element gefunden:', result);
    
    if (!input) {
        console.error('FEHLER: Input Element nicht gefunden!');
        return;
    }
    
    if (!result) {
        console.error('FEHLER: Result Element nicht gefunden!');
        return;
    }
    
    const inputValue = input.value;
    console.log('Eingegebener Wert:', inputValue);
    
    const speed = parseInt(inputValue);
    console.log('Parsed Speed:', speed);
    console.log('isNaN(speed):', isNaN(speed));
    
    // Eingabe validieren
    if (isNaN(speed) || speed < 1 || speed > 1000000) {
        console.log('Ungültige Eingabe - zeige Fehlermeldung');
        result.textContent = 'Bitte geben Sie eine Zahl zwischen 1 und 1.000.000 ein.';
        result.style.color = '#e74c3c';
        result.style.display = 'block';
        console.log('Fehlermeldung angezeigt');
        return;
    }
    
    console.log('Eingabe ist gültig, prüfe Lösung...');
    console.log('Speed:', speed, 'Bereich: 20-200');
    
    // Lösung überprüfen (20-200 Meter)
    if (speed >= 20 && speed <= 200) {
        console.log('Korrekte Antwort!');
        result.textContent = 'Gut geschätzt! Ein Gletscher fliesst zwischen 20 bis 200 Metern pro Jahr talabwärts.';
        result.style.color = '#27ae60';
    } else {
        console.log('Falsche Antwort!');
        result.textContent = 'Fast richtig! Ein Gletscher fliesst zwischen 20 bis 200 Metern pro Jahr talabwärts.';
        result.style.color = '#f39c12';
    }
    
    result.style.display = 'block';
    console.log('Ergebnis angezeigt:', result.textContent);
    console.log('Result display style:', result.style.display);
    console.log('=== ENDE DEBUG ===');
}

// Enter-Taste Event Listener für Quiz
function setupGlacierQuiz() {
    const input = document.getElementById('glacierSpeed');
    if (input) {
        input.addEventListener('keypress', function(event) {
            if (event.key === 'Enter') {
                checkGlacierSpeed();
            }
        });
        console.log('SPA: Glacier Quiz Event Listener eingerichtet');
    }
}

// Gletscher-Slide-System
function initGlacierSlides() {
    console.log('SPA: Initialisiere Gletscher-Slides...');
    
    const slides = document.querySelectorAll('.slide');
    const dots = document.querySelectorAll('.slide-dot');
    const container = document.getElementById('slideContainer');
    
    console.log('SPA: Gefundene Slides:', slides.length);
    console.log('SPA: Gefundene Dots:', dots.length);
    console.log('SPA: Container:', container);
    
    if (!container || slides.length === 0) {
        console.log('SPA: Container oder Slides nicht gefunden!');
        return;
    }
    
    // Stelle sicher, dass alle Slides sichtbar sind
    slides.forEach((slide, index) => {
        slide.style.opacity = '1';
        slide.style.transform = 'translateY(0)';
        slide.style.display = 'flex';
        slide.style.backgroundColor = 'rgba(173, 216, 230, 0.2)'; // 20% Transparenz hellblau
        console.log(`SPA: Slide ${index} sichtbar gemacht`);
    });
    
    // Stelle sicher, dass alle h1/h2 Elemente sichtbar sind
    const h1Elements = document.querySelectorAll('.slide h1, .slide h2');
    h1Elements.forEach((h1, index) => {
        h1.style.opacity = '1';
        h1.style.transform = 'translateY(0)';
        console.log(`SPA: H1/H2 ${index} sichtbar gemacht`);
    });
    
    // Stelle sicher, dass alle slide-actions sichtbar sind
    const slideActions = document.querySelectorAll('.slide-actions');
    slideActions.forEach((action, index) => {
        action.style.opacity = '1';
        action.style.transform = 'translateY(0)';
        action.style.display = 'block';
        action.style.visibility = 'visible';
        console.log(`SPA: Slide-Actions ${index} sichtbar gemacht`);
    });
    
    // Einfache Dot-Navigation
    dots.forEach((dot, index) => {
        dot.addEventListener('click', () => {
            console.log(`SPA: Dot ${index} geklickt`);
            goToSlide(index);
        });
    });
    
    // Einfache Keyboard-Navigation
    document.addEventListener('keydown', function(e) {
        const currentSlide = Math.round(container.scrollTop / window.innerHeight);
        
        if (e.key === 'ArrowDown' || e.key === 'PageDown' || e.key === ' ') {
            e.preventDefault();
            goToSlide(currentSlide + 1);
        } else if (e.key === 'ArrowUp' || e.key === 'PageUp') {
            e.preventDefault();
            goToSlide(currentSlide - 1);
        }
    });
    
    function goToSlide(slideIndex) {
        if (slideIndex < 0 || slideIndex >= slides.length) return;
        
        console.log(`SPA: Gehe zu Slide ${slideIndex}`);
        const slideHeight = window.innerHeight;
        
        container.scrollTo({
            top: slideIndex * slideHeight,
            behavior: 'smooth'
        });
        
        // Update dots
        updateDots(slideIndex);
    }
    
    function updateDots(activeIndex) {
        dots.forEach((dot, index) => {
            if (index === activeIndex) {
                dot.classList.add('active');
            } else {
                dot.classList.remove('active');
            }
        });
    }
    
    // Verbessertes Scroll-Event für automatische Dot-Updates
    let scrollTimeout;
    container.addEventListener('scroll', function() {
        // Debounce für bessere Performance
        clearTimeout(scrollTimeout);
        scrollTimeout = setTimeout(() => {
            const currentSlide = Math.round(container.scrollTop / window.innerHeight);
            console.log(`SPA: Scroll-Update: Slide ${currentSlide}`);
            updateDots(currentSlide);
        }, 50);
    });
    
    // Initial dots setzen
    updateDots(0);
    
    console.log('SPA: Gletscher-Slides erfolgreich initialisiert!');
}

// Button-Logik für Gletscher-Entstehung
function setupGlacierButtons() {
    console.log('SPA: setupGlacierButtons() aufgerufen');
    
    // URL-Parameter aus der aktuellen URL lesen
    const currentUrl = window.location.href;
    console.log('SPA: Aktuelle URL:', currentUrl);
    
    // Rolle aus URL-Parameter oder localStorage lesen
    let role = 'default';
    if (currentUrl.includes('?role=')) {
        role = currentUrl.split('?role=')[1].split('&')[0];
        console.log('SPA: Rolle aus URL gelesen:', role);
    } else {
        role = localStorage.getItem('userRole') || 'default';
        console.log('SPA: Rolle aus localStorage gelesen:', role);
    }
    
    console.log('SPA: Finale Benutzerrolle für Gletscher-Entstehung:', role);
    
    const wissenschaftlerinButtons = document.getElementById('wissenschaftlerinButtons');
    const abenteurerButtons = document.getElementById('abenteurerButtons');
    const defaultButtons = document.getElementById('defaultButtons');
    
    console.log('SPA: wissenschaftlerinButtons gefunden:', wissenschaftlerinButtons);
    console.log('SPA: abenteurerButtons gefunden:', abenteurerButtons);
    console.log('SPA: defaultButtons gefunden:', defaultButtons);
    
    // Alle Buttons zunächst verstecken
    if (wissenschaftlerinButtons) {
        wissenschaftlerinButtons.style.display = 'none';
        console.log('SPA: Wissenschaftlerin-Buttons versteckt');
    }
    if (abenteurerButtons) {
        abenteurerButtons.style.display = 'none';
        console.log('SPA: Abenteurer-Buttons versteckt');
    }
    if (defaultButtons) {
        defaultButtons.style.display = 'none';
        console.log('SPA: Default-Buttons versteckt');
    }
    
    // Buttons basierend auf Rolle anzeigen
    if (role === 'wissenschaftlerin' && wissenschaftlerinButtons) {
        wissenschaftlerinButtons.style.display = 'flex';
        console.log('SPA: Wissenschaftlerin-Buttons angezeigt (nebeneinander)');
    } else if (role === 'abenteurer' && abenteurerButtons) {
        abenteurerButtons.style.display = 'block';
        // Spezielle Klasse für vertikale Anordnung bei Abenteurer-Pfad
        abenteurerButtons.classList.add('adventurer-layout');
        console.log('SPA: Abenteurer-Buttons angezeigt (vertikal)');
    } else {
        if (defaultButtons) {
            defaultButtons.style.display = 'block';
            console.log('SPA: Default-Buttons angezeigt');
        }
        console.log('SPA: Keine passende Rolle gefunden oder Buttons nicht verfügbar');
        console.log('SPA: Rolle war:', role);
    }
}

// ===== TIMELINE FUNCTIONALITY =====
function initializeTimeline() {
    const timelineContainer = document.querySelector('.timeline-images-container');
    const yearMarkers = document.querySelectorAll('.year-marker');
    const progressBar = document.querySelector('.timeline-progress');
    const imageItems = document.querySelectorAll('.timeline-image-item');
    
    if (!timelineContainer) return;
    
    const years = Array.from(yearMarkers).map(marker => marker.dataset.year);
    const totalYears = years.length;
    let currentIndex = years.length - 1; // Start with last year
    let isScrolling = false;
    
    // Set initial active year
    updateActiveYear(years[currentIndex]);
    updateProgressBar(1);
    
    // Scroll event handler
    timelineContainer.addEventListener('scroll', () => {
        if (isScrolling) return; // Prevent conflicts during programmatic scrolling
        
        const scrollLeft = timelineContainer.scrollLeft;
        const containerWidth = timelineContainer.clientWidth;
        const scrollWidth = timelineContainer.scrollWidth;
        
        // Calculate progress
        const progress = scrollLeft / (scrollWidth - containerWidth);
        updateProgressBar(progress);
        
        // Find which year is most visible
        const itemWidth = containerWidth;
        const scrollIndex = Math.round(scrollLeft / itemWidth);
        const currentYear = years[scrollIndex] || years[years.length - 1];
        
        if (scrollIndex !== currentIndex) {
            currentIndex = scrollIndex;
            updateActiveYear(currentYear);
        }
    });
    
    // Year marker click handlers
    yearMarkers.forEach((marker, index) => {
        marker.addEventListener('click', () => {
            const targetYear = marker.dataset.year;
            const targetIndex = years.indexOf(targetYear);
            
            if (targetIndex !== -1) {
                currentIndex = targetIndex;
                const scrollPercentage = targetIndex / (totalYears - 1);
                
                // Programmatic scroll
                isScrolling = true;
                const scrollPosition = targetIndex * timelineContainer.clientWidth;
                timelineContainer.scrollTo({
                    left: scrollPosition,
                    behavior: 'smooth'
                });
                
                // Reset scrolling flag after animation
                setTimeout(() => {
                    isScrolling = false;
                }, 1000);
                
                updateActiveYear(targetYear);
                updateProgressBar(scrollPercentage);
            }
        });
    });
    
    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
            e.preventDefault();
            if (currentIndex > 0) {
                currentIndex--;
                const year = years[currentIndex];
                const scrollPercentage = currentIndex / (totalYears - 1);
                
                // Programmatic scroll
                isScrolling = true;
                const scrollPosition = currentIndex * timelineContainer.clientWidth;
                timelineContainer.scrollTo({
                    left: scrollPosition,
                    behavior: 'smooth'
                });
                
                // Reset scrolling flag after animation
                setTimeout(() => {
                    isScrolling = false;
                }, 1000);
                
                updateActiveYear(year);
                updateProgressBar(scrollPercentage);
            }
        } else if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
            e.preventDefault();
            if (currentIndex < totalYears - 1) {
                currentIndex++;
                const year = years[currentIndex];
                const scrollPercentage = currentIndex / (totalYears - 1);
                
                // Programmatic scroll
                isScrolling = true;
                const scrollPosition = currentIndex * timelineContainer.clientWidth;
                timelineContainer.scrollTo({
                    left: scrollPosition,
                    behavior: 'smooth'
                });
                
                // Reset scrolling flag after animation
                setTimeout(() => {
                    isScrolling = false;
                }, 1000);
                
                updateActiveYear(year);
                updateProgressBar(scrollPercentage);
            }
        }
    });
    
    function updateActiveYear(year) {
        // Update year markers
        yearMarkers.forEach(marker => {
            marker.classList.toggle('active', marker.dataset.year === year);
        });
        
        // Update image items with smooth transition (same for scroll and click)
        imageItems.forEach(item => {
            if (item.dataset.year === year) {
                // Fade in the target image with smooth transition
                item.classList.add('active');
                // Use CSS transition instead of setTimeout for smoother animation
                requestAnimationFrame(() => {
                    item.style.opacity = '1';
                });
            } else {
                // Fade out other images with smooth transition
                item.style.opacity = '0';
                setTimeout(() => {
                    item.classList.remove('active');
                }, 800); // Match transition duration
            }
        });
    }
    
    function updateProgressBar(percentage) {
        if (progressBar) {
            progressBar.style.width = `${percentage * 100}%`;
        }
    }
}

window.addEventListener('hashchange', loadPage);
window.addEventListener('DOMContentLoaded', function() {
    // Audio-Button sofort initialisieren
    setAudioButtonHandler();
    // Dann Seite laden
    loadPage();
});
// Beim ersten Laden und bei Hash-Wechsel Seite laden 