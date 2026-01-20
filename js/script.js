// Langue par défaut
console.log('Script chargé. Détection de la langue...');
let currentLang = localStorage.getItem('site_lang') || 'fr';
console.log('Langue actuelle:', currentLang);

// Fonction de mise à jour de la langue
function updateLanguage(lang) {
    console.log('Mise à jour de la langue vers:', lang);
    currentLang = lang;
    localStorage.setItem('site_lang', lang);
    document.documentElement.lang = lang;

    // Mettre à jour le bouton de langue en premier
    const langBtn = document.getElementById('langToggle');
    if (langBtn) {
        langBtn.textContent = lang === 'fr' ? 'EN' : 'FR';
    } else {
        console.warn('Bouton langToggle introuvable');
    }

    // Vérifier si les traductions sont chargées
    if (!window.translations) {
        console.error('Erreur: window.translations est indéfini');
        return;
    }

    if (!window.translations[lang]) {
        console.error('Erreur: Aucune traduction trouvée pour la langue', lang);
        return;
    }

    // Mettre à jour les textes
    const elements = document.querySelectorAll('[data-i18n]');
    elements.forEach(element => {
        try {
            const key = element.getAttribute('data-i18n');
            if (window.translations[lang][key]) {
                element.innerHTML = window.translations[lang][key];
            }
        } catch (err) {
            console.error('Erreur traduction élément:', err);
        }
    });

    // Mettre à jour les placeholders
    document.querySelectorAll('[data-i18n-placeholder]').forEach(element => {
        try {
            const key = element.getAttribute('data-i18n-placeholder');
            if (window.translations[lang][key]) {
                element.placeholder = window.translations[lang][key];
            }
        } catch (err) {
            console.error('Erreur traduction placeholder:', err);
        }
    });
}

// Initialisation au chargement
document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM Ready. Initialisation langue...');
    // Délai court pour s'assurer que translations.js est bien pris en compte si chargement async
    setTimeout(() => updateLanguage(currentLang), 10);

    const langBtn = document.getElementById('langToggle');
    if (langBtn) {
        langBtn.addEventListener('click', (e) => {
            console.log('Clic bouton langue');
            e.preventDefault(); // Sécurité supplémentaire
            const newLang = currentLang === 'fr' ? 'en' : 'fr';
            updateLanguage(newLang);

            // Fermer le menu mobile si ouvert
            const navMenu = document.getElementById('navMenu');
            if (navMenu && navMenu.classList.contains('active')) {
                navMenu.classList.remove('active');
            }
        });
    } else {
        console.error('Impossible d\'attacher l\'événement clic: #langToggle introuvable');
    }
});

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

// Notification system
function showNotification(message, type = 'success') {
    const container = document.getElementById('notification-container');
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;

    const icon = type === 'success' ? '<i class="fas fa-check"></i>' : '<i class="fas fa-exclamation"></i>';
    // Titres statiques pour l'instant ou traduits si nécessaire, ici on simplifie
    const title = type === 'success' ? (currentLang === 'fr' ? 'Succès' : 'Success') : (currentLang === 'fr' ? 'Erreur' : 'Error');

    notification.innerHTML = `
        <div class="notification-icon">${icon}</div>
        <div class="notification-content">
            <span class="notification-title">${title}</span>
            <span class="notification-message">${message}</span>
        </div>
    `;

    container.appendChild(notification);

    // Trigger animation
    requestAnimationFrame(() => {
        notification.classList.add('show');
    });

    // Auto remove
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => {
            notification.remove();
        }, 400);
    }, 5000);
}

// Fonction de validation email
function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

// Gestion du formulaire avec validation
if (contactForm) {
    const inputs = contactForm.querySelectorAll('input, textarea');
    const submitButton = contactForm.querySelector('button[type="submit"]');

    // Validation en temps réel
    inputs.forEach(input => {
        // Créer l'élément de feedback s'il n'existe pas
        let feedback = input.nextElementSibling;
        if (!feedback || !feedback.classList.contains('input-feedback')) {
            feedback = document.createElement('div');
            feedback.className = 'input-feedback';
            input.parentNode.insertBefore(feedback, input.nextSibling);
        }

        input.addEventListener('input', validateInput);
        input.addEventListener('blur', validateInput);

        function validateInput() {
            let isValid = true;
            let message = '';

            // Reset classes
            input.classList.remove('valid', 'invalid');
            feedback.className = 'input-feedback';
            feedback.textContent = '';

            if (input.hasAttribute('required') && !input.value.trim()) {
                isValid = false;
                // On n'affiche pas d'erreur immédiate si le champ est vide au focus, 
                // seulement au blur ou si on a commencé à taper
                if (input.value.length > 0) message = translations[currentLang].msg_required;
            } else if (input.type === 'email' && input.value.trim()) {
                if (!isValidEmail(input.value)) {
                    isValid = false;
                    message = translations[currentLang].msg_invalid_email;
                }
            }

            if (input.value.trim()) {
                if (isValid) {
                    input.classList.add('valid');
                } else {
                    input.classList.add('invalid');
                    feedback.textContent = message;
                    feedback.classList.add('error');
                }
            }

            updateSubmitButton();
        }
    });

    function updateSubmitButton() {
        const requiredInputs = Array.from(inputs).filter(i => i.hasAttribute('required'));
        const allValid = requiredInputs.every(input => {
            if (input.type === 'email') return isValidEmail(input.value);
            return input.value.trim().length > 0;
        });

        submitButton.disabled = !allValid;
    }

    contactForm.addEventListener('submit', function (e) {
        e.preventDefault();

        // Récupérer les données
        const formData = new FormData(this);
        const data = Object.fromEntries(formData);

        // Validation finale
        if (!data.from_name || !data.email || !data.message) {
            showNotification(translations[currentLang].msg_required_fields, 'error');
            return;
        }

        if (!isValidEmail(data.email)) {
            showNotification(translations[currentLang].msg_invalid_email, 'error');
            return;
        }

        // État chargement
        const originalText = submitButton.textContent;
        submitButton.disabled = true;
        submitButton.textContent = translations[currentLang].contact_btn_sending;

        // Envoi EmailJS
        emailjs.send('service_vegi2hi', 'template_ot8e26r', {
            from_name: data.from_name,
            email: data.email,
            phone: data.phone || 'Non fourni',
            message: data.message
        })
            .then(function () {
                showNotification(translations[currentLang].msg_success, 'success');
                contactForm.reset();
                // Reset validation states
                inputs.forEach(input => {
                    input.classList.remove('valid', 'invalid');
                });
                updateSubmitButton();
            }, function (error) {
                console.error('FAILED...', error);
                showNotification(translations[currentLang].msg_error, 'error');
            })
            .finally(function () {
                submitButton.disabled = false;
                submitButton.textContent = translations[currentLang].contact_btn_send;
                updateSubmitButton(); // Re-vérifier l'état (sera désactivé car form reset)
            });
    });

    // État initial du bouton
    updateSubmitButton();
}

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

        const cardBack = card.querySelector('.tarifs-card-back');

        if (cardBack) {
            cardBack.addEventListener('touchstart', function (e) {
                // Ne pas empêcher la propagation pour permettre la détection du scroll
            }, { passive: true });

            cardBack.addEventListener('click', function (e) {
                // Empêcher le flip quand on clique sur le contenu
                e.stopPropagation();
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
