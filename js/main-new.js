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

    // ===== Character Showcase (New Design) =====
    const characterShowcase = document.querySelector('.character-showcase');
    if (characterShowcase) {
        const charThumbs = document.querySelectorAll('.char-thumb');
        const charImages = document.querySelectorAll('.char-image');
        const prevCharBtn = document.querySelector('.prev-char');
        const nextCharBtn = document.querySelector('.next-char');
        const charNameEl = document.getElementById('char-name');
        const charQuoteEl = document.getElementById('char-quote');
        const charRoleEl = document.getElementById('char-role');
        const charDescEl = document.getElementById('char-description');
        
        let currentCharIndex = 0;
        
        // Character Data
        const charactersData = [
            {
                name: 'Bé An',
                quote: '"Báo mới đây, tin nóng hổi!"',
                role: 'Người Bán Báo',
                description: 'Nhanh nhẹn, hoạt bát và biết tuốt mọi chuyện trong xóm. An là nguồn thông tin quý giá cho mọi người chơi. Cậu bé có thể đưa bạn những tin tức mới nhất về các sự kiện trong game.'
            },
            {
                name: 'Chú Ba',
                quote: '"Xe hỏng đưa đây, tui sửa cho!"',
                role: 'Thợ Sửa Xe',
                description: 'Trầm tính nhưng tốt bụng. Chú Ba luôn sẵn sàng giúp đỡ mọi người sửa chữa đồ đạc hỏng hóc. Chú có thể nâng cấp xe gánh của bạn để di chuyển nhanh hơn.'
            },
            {
                name: 'Cô Tư',
                quote: '"Chè ngon lắm nè, ăn đi con!"',
                role: 'Bán Chè',
                description: 'Gánh chè của cô Tư là nơi tụ tập của lũ trẻ trong xóm. Cô luôn có những câu chuyện ma mị để kể. Ghé thăm cô để học công thức chè bí truyền.'
            }
        ];
        
        function updateCharacter(index) {
            // Wrap around
            if (index >= charactersData.length) {
                currentCharIndex = 0;
            } else if (index < 0) {
                currentCharIndex = charactersData.length - 1;
            } else {
                currentCharIndex = index;
            }
            
            const charData = charactersData[currentCharIndex];
            
            // Update info with animation
            if (charNameEl) charNameEl.textContent = charData.name;
            if (charQuoteEl) charQuoteEl.textContent = charData.quote;
            if (charRoleEl) charRoleEl.textContent = charData.role;
            if (charDescEl) charDescEl.textContent = charData.description;
            
            // Update thumbnails
            charThumbs.forEach((thumb, i) => {
                thumb.classList.remove('active');
                if (i === currentCharIndex) {
                    thumb.classList.add('active');
                }
            });
            
            // Update images
            charImages.forEach((img, i) => {
                img.classList.remove('active');
                if (i === currentCharIndex) {
                    img.classList.add('active');
                }
            });
        }
        
        // Click on thumbnails
        charThumbs.forEach((thumb, index) => {
            thumb.addEventListener('click', () => {
                updateCharacter(index);
            });
        });
        
        // Navigation buttons
        if (prevCharBtn) {
            prevCharBtn.addEventListener('click', () => {
                updateCharacter(currentCharIndex - 1);
            });
        }
        
        if (nextCharBtn) {
            nextCharBtn.addEventListener('click', () => {
                updateCharacter(currentCharIndex + 1);
            });
        }
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
    const videoUrl = "https://www.youtube.com/embed/apskSb6WuAA";

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

    // ===== Image Slider =====
    const imageSlider = document.querySelector('.image-slider');
    if (imageSlider) {
        const slides = imageSlider.querySelectorAll('.slide');
        const dots = imageSlider.querySelectorAll('.dot');
        const prevArrow = imageSlider.querySelector('.prev-arrow');
        const nextArrow = imageSlider.querySelector('.next-arrow');
        let currentSlide = 0;
        let slideInterval;
        const autoSlideDelay = 4000; // 4 seconds

        // Function to show specific slide
        function showSlide(index) {
            // Wrap around
            if (index >= slides.length) {
                currentSlide = 0;
            } else if (index < 0) {
                currentSlide = slides.length - 1;
            } else {
                currentSlide = index;
            }

            // Update slides
            slides.forEach((slide, i) => {
                slide.classList.remove('active');
                if (i === currentSlide) {
                    slide.classList.add('active');
                }
            });

            // Update dots
            dots.forEach((dot, i) => {
                dot.classList.remove('active');
                if (i === currentSlide) {
                    dot.classList.add('active');
                }
            });
        }

        // Next slide
        function nextSlide() {
            showSlide(currentSlide + 1);
        }

        // Previous slide
        function prevSlide() {
            showSlide(currentSlide - 1);
        }

        // Start auto-slide
        function startAutoSlide() {
            slideInterval = setInterval(nextSlide, autoSlideDelay);
        }

        // Stop auto-slide
        function stopAutoSlide() {
            clearInterval(slideInterval);
        }

        // Reset auto-slide (restart timer)
        function resetAutoSlide() {
            stopAutoSlide();
            startAutoSlide();
        }

        // Event listeners for arrows
        if (prevArrow) {
            prevArrow.addEventListener('click', () => {
                prevSlide();
                resetAutoSlide();
            });
        }

        if (nextArrow) {
            nextArrow.addEventListener('click', () => {
                nextSlide();
                resetAutoSlide();
            });
        }

        // Event listeners for dots
        dots.forEach((dot, index) => {
            dot.addEventListener('click', () => {
                showSlide(index);
                resetAutoSlide();
            });
        });

        // Pause auto-slide on hover
        imageSlider.addEventListener('mouseenter', stopAutoSlide);
        imageSlider.addEventListener('mouseleave', startAutoSlide);

        // Touch/Swipe support for mobile
        let touchStartX = 0;
        let touchEndX = 0;

        imageSlider.addEventListener('touchstart', (e) => {
            touchStartX = e.changedTouches[0].screenX;
            stopAutoSlide();
        }, { passive: true });

        imageSlider.addEventListener('touchend', (e) => {
            touchEndX = e.changedTouches[0].screenX;
            handleSwipe();
            startAutoSlide();
        }, { passive: true });

        function handleSwipe() {
            const swipeThreshold = 50;
            const diff = touchStartX - touchEndX;
            if (diff > swipeThreshold) {
                nextSlide(); // Swipe left
            } else if (diff < -swipeThreshold) {
                prevSlide(); // Swipe right
            }
        }

        // Keyboard navigation
        document.addEventListener('keydown', (e) => {
            // Only if slider is in viewport
            const rect = imageSlider.getBoundingClientRect();
            const isInViewport = rect.top < window.innerHeight && rect.bottom > 0;
            
            if (isInViewport) {
                if (e.key === 'ArrowLeft') {
                    prevSlide();
                    resetAutoSlide();
                } else if (e.key === 'ArrowRight') {
                    nextSlide();
                    resetAutoSlide();
                }
            }
        });

        // Start auto-slide
        startAutoSlide();
    }
});
