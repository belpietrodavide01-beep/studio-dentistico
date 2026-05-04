
// Mobile Menu Toggle & General Logic
document.addEventListener('DOMContentLoaded', () => {
    // Selectors
    const toggle = document.querySelector('.mobile-nav-toggle');
    const links = document.querySelector('.nav-links');
    const cta = document.querySelector('.nav-cta');
    const body = document.body;

    // Mobile Menu Toggle Logic
    if (toggle && links) {
        toggle.addEventListener('click', () => {
            const isOpen = links.classList.toggle('active');
            if (cta) cta.classList.remove('active');
            toggle.classList.toggle('active');
            body.classList.toggle('menu-open');
        });
    }

    // Mobile Dropdown Accordion
    document.addEventListener('click', (e) => {
        if (window.innerWidth > 768) return;

        const trigger = e.target.closest('.dropdown-trigger');
        if (trigger) {
            e.preventDefault();
            e.stopPropagation();
            const dropdown = trigger.closest('.dropdown');
            const isOpen = dropdown.classList.contains('expanded');
            
            // Close all other dropdowns (if any)
            document.querySelectorAll('.dropdown').forEach(d => d.classList.remove('expanded'));
            
            // Toggle current
            if (!isOpen) {
                dropdown.classList.add('expanded');
            }
            console.log('Mobile dropdown toggle:', !isOpen);
        }
    });

    // Close menu when clicking on a link OR the overlay background
    document.addEventListener('click', (e) => {
        if (window.innerWidth > 768) return;
        
        const isLink = e.target.closest('.nav-links a:not(.dropdown-trigger)');
        const isOverlay = e.target === links;
        
        if (isLink || isOverlay) {
            if (links) links.classList.remove('active');
            if (toggle) toggle.classList.remove('active');
            document.body.classList.remove('menu-open');
        }
    });

    // Hero Image Slider
    const slides = document.querySelectorAll('.hero-slider .slide, .hero-slider img.slide');
    if (slides.length > 1) {
        let currentSlide = 0;
        setInterval(() => {
            slides[currentSlide].classList.remove('active');
            currentSlide = (currentSlide + 1) % slides.length;
            slides[currentSlide].classList.add('active');
        }, 5000);
    }

    // FAQ Accordion
    document.querySelectorAll('.faq-question').forEach(btn => {
        btn.addEventListener('click', () => {
            const item = btn.parentElement;
            const isOpen = item.classList.contains('active');
            document.querySelectorAll('.faq-item').forEach(i => i.classList.remove('active'));
            if (!isOpen) item.classList.add('active');
        });
    });

    // Process Timeline Logic (Treatment Pages)
    const timeline = document.querySelector('.process-timeline');
    const progressBar = document.querySelector('.process-timeline-progress');
    if(timeline && progressBar) {
        window.addEventListener('scroll', () => {
            const rect = timeline.getBoundingClientRect();
            const start = window.innerHeight / 2;
            let scrolled = start - rect.top;
            if(scrolled < 0) progressBar.style.height = '0%';
            else if(scrolled > rect.height) progressBar.style.height = '100%';
            else progressBar.style.height = (scrolled / rect.height * 100) + '%';
        });
    }

    // Scroll Animations (Intersection Observer)
    const animTargets = document.querySelectorAll('.reveal-up, .reveal-left, .reveal-right, .scale-in');
    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                revealObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1, rootMargin: '0px 0px -30px 0px' });

    animTargets.forEach(el => {
        const rect = el.getBoundingClientRect();
        if (rect.top < window.innerHeight && rect.bottom > 0) {
            el.classList.add('active');
        } else {
            revealObserver.observe(el);
        }
    });

    // Scroll Dots Logic for Carousels (Mobile Only)
    function initScrollDots(containerSelector, dotsContainerId, cardSelector) {
        const container = document.querySelector(containerSelector);
        const dotsContainer = document.getElementById(dotsContainerId);
        
        if (!container || !dotsContainer) return;

        const cards = container.querySelectorAll(cardSelector);
        if (cards.length <= 1) return;

        dotsContainer.innerHTML = '';
        cards.forEach((_, index) => {
            const dot = document.createElement('div');
            dot.classList.add('dot');
            if (index === 0) dot.classList.add('active');
            
            dot.addEventListener('click', () => {
                const scrollPos = cards[index].offsetLeft - container.offsetLeft;
                container.scrollTo({ left: scrollPos, behavior: 'smooth' });
            });
            dotsContainer.appendChild(dot);
        });

        container.addEventListener('scroll', () => {
            if (!container) return;
            const scrollLeft = container.scrollLeft;
            let closestIndex = 0;
            let minDiff = Infinity;
            
            cards.forEach((card, index) => {
                const diff = Math.abs(card.offsetLeft - container.offsetLeft - scrollLeft);
                if (diff < minDiff) {
                    minDiff = diff;
                    closestIndex = index;
                }
            });

            const allDots = dotsContainer.querySelectorAll('.dot');
            allDots.forEach(d => d.classList.remove('active'));
            if (allDots[closestIndex]) allDots[closestIndex].classList.add('active');
        }, { passive: true });
    }

    if (window.innerWidth <= 768) {
        initScrollDots('.treatments-grid', 'treatments-dots', '.treatment-card');
        initScrollDots('.results-grid', 'results-dots', '.result-card');
    }
});

// Contact Form Handler (Globally accessible)
window.handleContactSubmit = function(e) {
    e.preventDefault();
    const btn = e.target.querySelector('button[type="submit"]');
    const originalText = btn.textContent;
    btn.textContent = '✓ Messaggio Inviato!';
    btn.style.backgroundColor = '#2d7a44';
    setTimeout(() => {
        btn.textContent = originalText;
        btn.style.backgroundColor = '';
        e.target.reset();
    }, 3000);
};
