// Menu mobile toggle
const menuToggle = document.getElementById('menuToggle');
const navMenu = document.getElementById('navMenu');

menuToggle.addEventListener('click', () => {
    navMenu.classList.toggle('active');
});

// Fermer le menu quand un lien est cliqué
const navLinks = document.querySelectorAll('.nav-menu a');
navLinks.forEach(link => {
    link.addEventListener('click', () => {
        navMenu.classList.remove('active');
    });
});

// Smooth scroll pour les ancres
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Formulaire de contact
const contactForm = document.getElementById('contactForm');

// Initialisation EmailJS
emailjs.init('HCDOTC8fmqPSLwGof');

contactForm.addEventListener('submit', function(e) {
    e.preventDefault();

    // Récupérer les données du formulaire
    const formData = new FormData(this);
    const data = Object.fromEntries(formData);

    // Validation
    if (!data.From_name || !data.email || !data.message) {
        alert('Veuillez remplir tous les champs obligatoires');
        return;
    }

    // Validation email
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(data.email)) {
        alert('Veuillez entrer une adresse email valide');
        return;
    }

    // Envoi via EmailJS
    emailjs.send('service_vegi2hi', 'template_ot8e26r', {
        email: data.email,
        phone: data.phone || '',
        message: data.message,
        From_name: data.From_name || ''
    })
    .then(function(response) {
        alert('Merci pour votre message! Nous vous répondrons bientôt.');
        contactForm.reset();
    }, function(error) {
        alert('Une erreur est survenue lors de l\'envoi. Veuillez réessayer plus tard.');
    });
});

// Animation au scroll
// Flip automatique des cartes de tarifs sur mobile
function isMobile() {
    return window.innerWidth <= 900 || /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
}

function isFullyVisible(el) {
    const rect = el.getBoundingClientRect();
    return (
        rect.top >= 0 &&
        rect.left >= 0 &&
        rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
        rect.right <= (window.innerWidth || document.documentElement.clientWidth)
    );
}

function autoFlipTarifCards() {
    if (!isMobile()) return;
    document.querySelectorAll('.tarifs-card-inner').forEach(card => {
        if (isFullyVisible(card)) {
            card.classList.add('flipped');
        } else {
            card.classList.remove('flipped');
        }
    });
}

window.addEventListener('scroll', autoFlipTarifCards);
window.addEventListener('resize', autoFlipTarifCards);
document.addEventListener('DOMContentLoaded', autoFlipTarifCards);
// Modal Notice légale
const openLegalModal = document.getElementById('openLegalModal');
const legalModal = document.getElementById('legalModal');
const closeLegalModal = document.getElementById('closeLegalModal');

if (openLegalModal && legalModal && closeLegalModal) {
    openLegalModal.addEventListener('click', function(e) {
        e.preventDefault();
        legalModal.style.display = 'flex';
    });
    closeLegalModal.addEventListener('click', function() {
        legalModal.style.display = 'none';
    });
    legalModal.addEventListener('click', function(e) {
        if (e.target === legalModal) {
            legalModal.style.display = 'none';
        }
    });
}
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -100px 0px'
};

const observer = new IntersectionObserver(function(entries) {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Observer les éléments de service
document.querySelectorAll('.service-card').forEach(card => {
    card.style.opacity = '0';
    card.style.transform = 'translateY(20px)';
    card.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    observer.observe(card);
});
