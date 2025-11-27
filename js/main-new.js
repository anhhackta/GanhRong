document.addEventListener('DOMContentLoaded', () => {
    // Loading Screen
    const loadingScreen = document.getElementById('loading-screen');
    if (loadingScreen) {
        setTimeout(() => {
            loadingScreen.style.opacity = '0';
            setTimeout(() => {
                loadingScreen.style.display = 'none';
            }, 500);
        }, 2000); // Show loading for 2 seconds
    }

    // Header Scroll Effect
    const header = document.querySelector('.header');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });

    // Mobile Menu Toggle
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const navMenu = document.querySelector('.nav-menu');

    if (mobileMenuBtn && navMenu) {
        mobileMenuBtn.addEventListener('click', () => {
            navMenu.classList.toggle('active');
            const icon = mobileMenuBtn.querySelector('i');
            if (navMenu.classList.contains('active')) {
                icon.classList.remove('fa-bars');
                icon.classList.add('fa-times');
            } else {
                icon.classList.remove('fa-times');
                icon.classList.add('fa-bars');
            }
        });

        // Close menu when clicking a link
        document.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', () => {
                navMenu.classList.remove('active');
                const icon = mobileMenuBtn.querySelector('i');
                icon.classList.remove('fa-times');
                icon.classList.add('fa-bars');
            });
        });
    }

    // Character Carousel
    const cards = document.querySelectorAll('.character-card');
    const prevBtn = document.querySelector('.carousel-controls .prev');
    const nextBtn = document.querySelector('.carousel-controls .next');
    let currentIndex = 0;

    function updateCarousel() {
        cards.forEach((card, index) => {
            card.classList.remove('active');
            if (index === currentIndex) {
                card.classList.add('active');
            }
        });
    }

    if (prevBtn && nextBtn && cards.length > 0) {
        prevBtn.addEventListener('click', () => {
            currentIndex = (currentIndex - 1 + cards.length) % cards.length;
            updateCarousel();
        });

        nextBtn.addEventListener('click', () => {
            currentIndex = (currentIndex + 1) % cards.length;
            updateCarousel();
        });
    }

    // Sound Toggle
    const soundToggle = document.getElementById('sound-toggle');
    const bgMusic = document.getElementById('bg-music');
    let isPlaying = false;

    if (soundToggle && bgMusic) {
        // Set initial volume
        bgMusic.volume = 0.3;

        soundToggle.addEventListener('click', () => {
            if (isPlaying) {
                bgMusic.pause();
                soundToggle.innerHTML = '<i class="fas fa-volume-mute"></i>';
                isPlaying = false;
            } else {
                bgMusic.play().then(() => {
                    soundToggle.innerHTML = '<i class="fas fa-volume-up"></i>';
                    isPlaying = true;
                }).catch(err => {
                    console.error("Audio play failed:", err);
                });
            }
        });

        // Try to auto-play (might be blocked by browser)
        document.body.addEventListener('click', () => {
            if (!isPlaying) {
                bgMusic.play().then(() => {
                    soundToggle.innerHTML = '<i class="fas fa-volume-up"></i>';
                    isPlaying = true;
                }).catch(() => { });
            }
        }, { once: true });
    }
    // Video Modal
    const videoModal = document.getElementById('video-modal');
    const videoBtn = document.querySelector('a[href="#video-trailer"]');
    const closeBtn = document.querySelector('.video-modal-close');
    const iframe = document.getElementById('youtube-player');
    // Placeholder video (Ganh Rong trailer or generic)
    const videoUrl = "https://www.youtube.com/embed/dQw4w9WgXcQ";

    if (videoBtn && videoModal && closeBtn) {
        videoBtn.addEventListener('click', (e) => {
            e.preventDefault();
            videoModal.style.display = 'flex';
            if (iframe) iframe.src = videoUrl;
        });

        closeBtn.addEventListener('click', () => {
            videoModal.style.display = 'none';
            if (iframe) iframe.src = ""; // Stop video
        });

        videoModal.addEventListener('click', (e) => {
            if (e.target === videoModal) {
                videoModal.style.display = 'none';
                if (iframe) iframe.src = ""; // Stop video
            }
        });
    }
});
