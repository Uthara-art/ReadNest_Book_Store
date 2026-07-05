// ==========================================
// BookVerse - Main JavaScript
// ==========================================

document.addEventListener('DOMContentLoaded', () => {
    
    // --- 1. Responsive Hamburger Menu ---
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');

    if (hamburger) {
        hamburger.addEventListener('click', () => {
            navLinks.classList.toggle('active');
            // Animate hamburger lines (optional CSS toggle)
            hamburger.classList.toggle('toggle');
        });
    }

    // --- 2. Dark/Light Mode Toggle ---
    const themeToggle = document.getElementById('theme-toggle');
    const body = document.documentElement;
    const themeIcon = themeToggle ? themeToggle.querySelector('i') : null;

    // Check local storage for saved theme
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
        body.setAttribute('data-theme', 'dark');
        if (themeIcon) {
            themeIcon.classList.replace('fa-moon', 'fa-sun');
        }
    }

    if (themeToggle) {
        themeToggle.addEventListener('click', () => {
            if (body.getAttribute('data-theme') === 'dark') {
                body.removeAttribute('data-theme');
                localStorage.setItem('theme', 'light');
                if (themeIcon) themeIcon.classList.replace('fa-sun', 'fa-moon');
            } else {
                body.setAttribute('data-theme', 'dark');
                localStorage.setItem('theme', 'dark');
                if (themeIcon) themeIcon.classList.replace('fa-moon', 'fa-sun');
            }
        });
    }

    // --- 3. Featured Books Image Slider (Home Page) ---
    const sliderImages = document.querySelector('.slider-images');
    if (sliderImages) {
        let currentIndex = 0;
        const images = sliderImages.querySelectorAll('img');
        const totalImages = images.length;
        
        if (totalImages > 1) {
            setInterval(() => {
                currentIndex = (currentIndex + 1) % totalImages;
                sliderImages.style.transform = `translateX(-${currentIndex * 100}%)`;
            }, 3000); // Change image every 3 seconds
        }
    }

    // --- 4. Back to Top Button & Smooth Scrolling ---
    const backToTopBtn = document.getElementById('back-to-top');
    
    if (backToTopBtn) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 300) {
                backToTopBtn.classList.add('show');
            } else {
                backToTopBtn.classList.remove('show');
            }
        });

        backToTopBtn.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }

    // --- 5. Animated Counters (Home Page) ---
    const counters = document.querySelectorAll('.counter');
    const statsSection = document.querySelector('.stats');
    let hasAnimated = false;

    if (counters.length > 0 && statsSection) {
        // Use Intersection Observer to animate only when scrolled into view
        const observer = new IntersectionObserver((entries) => {
            if (entries[0].isIntersecting && !hasAnimated) {
                hasAnimated = true;
                counters.forEach(counter => {
                    const target = +counter.getAttribute('data-target');
                    const duration = 2000; // 2 seconds
                    const increment = target / (duration / 16); // ~60fps
                    let current = 0;

                    const updateCounter = () => {
                        current += increment;
                        if (current < target) {
                            counter.innerText = Math.ceil(current);
                            requestAnimationFrame(updateCounter);
                        } else {
                            counter.innerText = target;
                        }
                    };
                    updateCounter();
                });
            }
        }, { threshold: 0.5 });

        observer.observe(statsSection);
    }

    // --- 6. Search Filter (Books Page) ---
    const searchInput = document.getElementById('book-search');
    const bookCards = document.querySelectorAll('.all-books .book-card');

    if (searchInput) {
        searchInput.addEventListener('keyup', (e) => {
            const searchTerm = e.target.value.toLowerCase();
            let hasResults = false;

            bookCards.forEach(card => {
                const title = card.querySelector('.book-title').innerText.toLowerCase();
                const author = card.querySelector('.book-author').innerText.toLowerCase();
                
                if (title.includes(searchTerm) || author.includes(searchTerm)) {
                    card.style.display = 'flex';
                    hasResults = true;
                } else {
                    card.style.display = 'none';
                }
            });

            // Handle no results state
            const noResultsMsg = document.getElementById('no-results');
            if (noResultsMsg) {
                noResultsMsg.style.display = hasResults ? 'none' : 'block';
            }
        });
    }

    // --- 7. Contact Form Validation (Contact Page) ---
    const contactForm = document.getElementById('contact-form');
    
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            let isValid = true;
            
            const name = document.getElementById('name');
            const email = document.getElementById('email');
            const message = document.getElementById('message');
            
            // Name validation
            if (name.value.trim() === '') {
                showError(name, 'Name is required');
                isValid = false;
            } else {
                hideError(name);
            }
            
            // Email validation
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(email.value.trim())) {
                showError(email, 'Please enter a valid email address');
                isValid = false;
            } else {
                hideError(email);
            }
            
            // Message validation
            if (message.value.trim() === '') {
                showError(message, 'Message is required');
                isValid = false;
            } else {
                hideError(message);
            }
            
            if (isValid) {
                // Form is valid, simulate successful submission
                alert('Thank you for contacting us! Your message has been sent successfully.');
                contactForm.reset();
            }
        });
    }

    // Helper functions for form validation
    function showError(inputElement, message) {
        const errorElement = document.getElementById(`${inputElement.id}-error`);
        if (errorElement) {
            errorElement.innerText = message;
            errorElement.style.display = 'block';
            inputElement.style.borderColor = '#ef4444';
        }
    }

    function hideError(inputElement) {
        const errorElement = document.getElementById(`${inputElement.id}-error`);
        if (errorElement) {
            errorElement.style.display = 'none';
            inputElement.style.borderColor = 'var(--color-border)';
        }
    }
    
    // --- 8. Book Details Modal ---
    const modalOverlay = document.getElementById('book-modal');
    if (modalOverlay) {
        const modalClose = document.getElementById('modal-close');
        const modalTitle = document.getElementById('modal-title');
        const modalAuthor = document.getElementById('modal-author');
        const modalDesc = document.getElementById('modal-desc');
        const modalImg = document.getElementById('modal-img');

        // Open modal
        document.querySelectorAll('.book-card .btn-primary').forEach(button => {
            button.addEventListener('click', (e) => {
                e.preventDefault(); // Prevent navigating
                const card = e.target.closest('.book-card');
                
                const title = card.querySelector('.book-title').innerText;
                const author = card.querySelector('.book-author').innerText;
                const imgSrc = card.querySelector('.book-cover img').src;
                const desc = e.target.getAttribute('data-desc') || 'A fascinating read that dives deep into its subject. Highly recommended for enthusiasts and beginners alike.';

                modalTitle.innerText = title;
                modalAuthor.innerText = author;
                modalImg.src = imgSrc;
                modalDesc.innerText = desc;

                modalOverlay.classList.add('show');
            });
        });

        // Close modal logic
        const closeModal = () => {
            modalOverlay.classList.remove('show');
        };

        modalClose.addEventListener('click', closeModal);
        modalOverlay.addEventListener('click', (e) => {
            if (e.target === modalOverlay) closeModal();
        });
    }

});
