// Wait for the DOM to be fully loaded
document.addEventListener('DOMContentLoaded', () => {
    // Mobile menu toggle
    const mobileMenuToggle = document.createElement('button');
    mobileMenuToggle.className = 'mobile-menu-toggle';
    mobileMenuToggle.innerHTML = '☰';
    document.querySelector('.nav-container').prepend(mobileMenuToggle);

    mobileMenuToggle.addEventListener('click', () => {
        document.querySelector('.nav-menu').classList.toggle('active');
    });

    // Close mobile menu when clicking outside
    document.addEventListener('click', (e) => {
        if (!e.target.closest('.nav-container')) {
            document.querySelector('.nav-menu').classList.remove('active');
        }
    });

    // Get the main heading
    const mainHeading = document.querySelector('h1');
    
    // Add a click event listener to the heading
    mainHeading.addEventListener('click', () => {
        mainHeading.style.color = mainHeading.style.color === 'white' ? '#3498db' : 'white';
    });

    // Add a simple console message
    console.log('Website loaded successfully!');

    // Scrollytelling functionality
    const steps = document.querySelectorAll('.step');
    const sections = document.querySelectorAll('.scrolly-section');
    
    function handleScroll() {
        const scrollPosition = window.scrollY + window.innerHeight / 2;
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            
            if (scrollPosition >= sectionTop && scrollPosition <= sectionTop + sectionHeight) {
                // Update active section in subnav
                const sectionId = section.id;
                document.querySelectorAll('.subnav-menu a').forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${sectionId}`) {
                        link.classList.add('active');
                    }
                });
                
                // Update step visibility
                const stepsInSection = section.querySelectorAll('.step');
                stepsInSection.forEach((step, index) => {
                    const stepTop = step.offsetTop;
                    const stepHeight = step.offsetHeight;
                    const stepPosition = stepTop + stepHeight / 2;
                    
                    if (scrollPosition >= stepTop && scrollPosition <= stepTop + stepHeight) {
                        stepsInSection.forEach(s => s.classList.remove('active'));
                        step.classList.add('active');
                    }
                });
            }
        });
    }

    // Initialize scrollytelling
    if (steps.length > 0) {
        window.addEventListener('scroll', handleScroll);
        handleScroll(); // Initial check
    }
});

// Popup functions
function openPopup(popupId) {
    document.getElementById(popupId).style.display = 'block';
    document.body.style.overflow = 'hidden'; // Prevent scrolling when popup is open
}

function closePopup(popupId) {
    document.getElementById(popupId).style.display = 'none';
    document.body.style.overflow = ''; // Restore scrolling
}

// Close popup when clicking outside
window.onclick = function(event) {
    if (event.target.classList.contains('popup')) {
        event.target.style.display = 'none';
        document.body.style.overflow = '';
    }
} 