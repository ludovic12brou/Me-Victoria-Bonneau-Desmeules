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
(function () {
    emailjs.init({
        publicKey: 'HCDOTC8fmqPSLwGof'
    });
})();

contactForm.addEventListener('submit', function (e) {
    e.preventDefault();

    // Récupérer les données du formulaire
    const formData = new FormData(this);
    const data = Object.fromEntries(formData);

    // Validation
    if (!data.from_name || !data.email || !data.message) {
        alert('Veuillez remplir tous les champs obligatoires');
        return;
    }

    // Validation email
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(data.email)) {
        alert('Veuillez entrer une adresse email valide');
        return;
    }

    // Désactiver le bouton pendant l'envoi
    const submitButton = this.querySelector('button[type="submit"]');
    const originalText = submitButton.textContent;
    submitButton.disabled = true;
    submitButton.textContent = 'Envoi en cours...';

    // Envoi via EmailJS
    emailjs.send('service_vegi2hi', 'template_ot8e26r', {
        from_name: data.from_name,
        email: data.email,
        phone: data.phone || 'Non fourni',
        message: data.message
    })
        .then(function (response) {
            console.log('SUCCESS!', response.status, response.text);
            alert('Merci pour votre message! Nous vous répondrons bientôt.');
            contactForm.reset();
            submitButton.disabled = false;
            submitButton.textContent = originalText;
        }, function (error) {
            console.error('FAILED...', error);
            alert('Une erreur est survenue lors de l\'envoi. Veuillez réessayer plus tard.');
            submitButton.disabled = false;
            submitButton.textContent = originalText;
        });
});

// Animation au scroll
// Flip des cartes de tarifs au clic sur mobile et au hover sur desktop
function isMobile() {
    return window.innerWidth <= 900 || /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
}

// Gestion du flip des cartes de tarifs au clic sur mobile
document.addEventListener('DOMContentLoaded', function () {
    const tarifCards = document.querySelectorAll('.tarifs-card');

    tarifCards.forEach(card => {
        let touchStartY = 0;
        let touchEndY = 0;
        let isScrolling = false;

        // Ajouter un bouton de fermeture sur la carte retournée pour mobile
        const cardBack = card.querySelector('.tarifs-card-back');

        if (cardBack && isMobile()) {
            // Créer le bouton de fermeture
            const closeButton = document.createElement('button');
            closeButton.innerHTML = '×';
            closeButton.className = 'card-close-btn';
            closeButton.setAttribute('aria-label', 'Fermer');

            // Ajouter le bouton au début de la carte retournée
            cardBack.insertBefore(closeButton, cardBack.firstChild);

            // Gérer le clic sur le bouton de fermeture
            closeButton.addEventListener('click', function (e) {
                e.stopPropagation();
                e.preventDefault();
                const cardInner = card.querySelector('.tarifs-card-inner');
                cardInner.classList.remove('flipped');
            });
        }

        if (cardBack) {
            cardBack.addEventListener('touchstart', function (e) {
                // Ne pas empêcher la propagation pour permettre la détection du scroll
                const target = e.target;
                if (target.classList.contains('card-close-btn')) {
                    return; // Laisser le bouton gérer son propre événement
                }
            }, { passive: true });

            cardBack.addEventListener('click', function (e) {
                // Empêcher le flip seulement si ce n'est pas le bouton de fermeture
                if (!e.target.classList.contains('card-close-btn')) {
                    e.stopPropagation();
                }
            });
        }

        // Détecter si c'est un scroll ou un tap
        card.addEventListener('touchstart', function (e) {
            if (isMobile()) {
                touchStartY = e.touches[0].clientY;
                isScrolling = false;
            }
        }, { passive: true });

        card.addEventListener('touchmove', function (e) {
            if (isMobile()) {
                touchEndY = e.touches[0].clientY;
                // Si le mouvement vertical est supérieur à 10px, c'est un scroll
                if (Math.abs(touchEndY - touchStartY) > 10) {
                    isScrolling = true;
                }
            }
        }, { passive: true });

        // Sur mobile, on ajoute un événement de clic pour retourner la carte
        card.addEventListener('click', function (e) {
            if (isMobile() && !isScrolling) {
                // Ne flip que si on ne scrolle pas et qu'on ne clique pas sur le contenu de la carte retournée
                const cardInner = this.querySelector('.tarifs-card-inner');
                const clickedOnBack = e.target.closest('.tarifs-card-back');

                if (!clickedOnBack) {
                    e.preventDefault();
                    cardInner.classList.toggle('flipped');
                }
            }
        });
    });
});
// Modal Notice légale
const openLegalModal = document.getElementById('openLegalModal');
const legalModal = document.getElementById('legalModal');
const closeLegalModal = document.getElementById('closeLegalModal');

if (openLegalModal && legalModal && closeLegalModal) {
    openLegalModal.addEventListener('click', function (e) {
        e.preventDefault();
        legalModal.style.display = 'flex';
    });
    closeLegalModal.addEventListener('click', function () {
        legalModal.style.display = 'none';
    });
    legalModal.addEventListener('click', function (e) {
        if (e.target === legalModal) {
            legalModal.style.display = 'none';
        }
    });
}
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -100px 0px'
};

const observer = new IntersectionObserver(function (entries) {
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
