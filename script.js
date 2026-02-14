document.addEventListener('DOMContentLoaded', function() {
    const navLinks = document.querySelectorAll('.nav-link');
    const pages = document.querySelectorAll('.page');
    const menuToggle = document.getElementById('menuToggle');
    const navMenu = document.getElementById('navMenu');

    if (menuToggle) {
        menuToggle.addEventListener('click', function() {
            navMenu.classList.toggle('active');
            menuToggle.classList.toggle('active');
        });
    }
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href').substring(1);
            
            if (navMenu.classList.contains('active')) {
                navMenu.classList.remove('active');
                menuToggle.classList.remove('active');
            }

            pages.forEach(page => {
                page.classList.remove('active');
            });

            const targetPage = document.getElementById(targetId);
            if (targetPage) {
                targetPage.classList.add('active');
                
                window.scrollTo({
                    top: 0,
                    behavior: 'smooth'
                });
            }
            navLinks.forEach(navLink => {
                navLink.classList.remove('active');
            });
            this.classList.add('active');
        });
    });

    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const formData = new FormData(this);
            const name = formData.get('name');
            const email = formData.get('email');
            const subject = formData.get('subject');
            const message = formData.get('message');

            if (!name || !email || !subject || !message) {
                alert('Veuillez remplir tous les champs obligatoires.');
                return;
            }

            const submitButton = this.querySelector('button[type="submit"]');
            const originalText = submitButton.textContent;
            submitButton.textContent = 'Envoi en cours...';
            submitButton.disabled = true;

            fetch('https://formspree.io/f/mnjbdvdk', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    name: name,
                    email: email,
                    subject: subject,
                    message: message
                })
            })
            .then(response => {
                if (response.ok) {
                    alert('Message envoyé avec succès ! Je vous répondrai dans les plus brefs délais.');
                    this.reset();
                } else {
                    throw new Error('Erreur lors de l\'envoi');
                }
            })
            .catch(error => {
                alert('Une erreur est survenue. Veuillez réessayer ou me contacter directement par email.');
            })
            .finally(() => {
                submitButton.textContent = originalText;
                submitButton.disabled = false;
            });
        });
    }

    // Animation des barres de compétences au scroll
    const observerOptions = {
        threshold: 0.5,
        rootMargin: '0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const progressBars = entry.target.querySelectorAll('.skill-progress');
                progressBars.forEach(bar => {
                    const width = bar.style.width;
                    bar.style.width = '0';
                    setTimeout(() => {
                        bar.style.width = width;
                    }, 100);
                });
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Observer les sections avec des barres de compétences
    const skillSections = document.querySelectorAll('.skills-grid, .competence-items');
    skillSections.forEach(section => {
        observer.observe(section);
    });

    // Animation au scroll pour les cartes
    const cardObserver = new IntersectionObserver(function(entries) {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                setTimeout(() => {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }, index * 100);
                cardObserver.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1
    });

    // Observer les cartes
    const cards = document.querySelectorAll('.card-square, .blog-card, .competence-category, .contact-card');
    cards.forEach(card => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(20px)';
        card.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
        cardObserver.observe(card);
    });

    // Gestion de la navigation au chargement de la page
    const hash = window.location.hash.substring(1);
    if (hash) {
        const targetPage = document.getElementById(hash);
        if (targetPage) {
            pages.forEach(page => page.classList.remove('active'));
            targetPage.classList.add('active');
            
            navLinks.forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('href') === `#${hash}`) {
                    link.classList.add('active');
                }
            });
        }
    }

    document.addEventListener('click', function(e) {
        if (!navMenu.contains(e.target) && !menuToggle.contains(e.target)) {
            navMenu.classList.remove('active');
            menuToggle.classList.remove('active');
        }
    });
});
