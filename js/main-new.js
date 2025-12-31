document.addEventListener('DOMContentLoaded', () => {
    // Loading Screen - Tối ưu thời gian chờ
    const loadingScreen = document.getElementById('loading-screen');
    if (loadingScreen) {
        // Giảm thời gian loading từ 2s xuống 1.2s
        setTimeout(() => {
            loadingScreen.style.opacity = '0';
            setTimeout(() => {
                loadingScreen.style.display = 'none';
            }, 400);
        }, 1200);
    }

    // Download Dropdown Toggle
    const downloadToggle = document.getElementById('download-toggle');
    const downloadMenu = document.getElementById('download-menu');

    if (downloadToggle && downloadMenu) {
        downloadToggle.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            downloadToggle.classList.toggle('active');
            downloadMenu.classList.toggle('active');
        });

        // Close dropdown when clicking outside
        document.addEventListener('click', (e) => {
            if (!downloadToggle.contains(e.target) && !downloadMenu.contains(e.target)) {
                downloadToggle.classList.remove('active');
                downloadMenu.classList.remove('active');
            }
        });

        // Prevent dropdown from closing when clicking inside menu
        downloadMenu.addEventListener('click', (e) => {
            e.stopPropagation();
        });
    }

    // ===== Utility: Generic Slider Controller =====
    // Giảm trùng lặp code bằng cách tạo slider controller chung
    function createSliderController(config) {
        const {
            slides,
            dots = null,
            prevBtn,
            nextBtn,
            container,
            autoDelay = 4000,
            onSlideChange = null
        } = config;

        let currentIndex = 0;
        let autoInterval = null;

        function showSlide(index) {
            if (index >= slides.length) currentIndex = 0;
            else if (index < 0) currentIndex = slides.length - 1;
            else currentIndex = index;

            slides.forEach((slide, i) => {
                slide.classList.toggle('active', i === currentIndex);
            });

            if (dots) {
                dots.forEach((dot, i) => {
                    dot.classList.toggle('active', i === currentIndex);
                });
            }

            if (onSlideChange) onSlideChange(currentIndex);
        }

        function next() { showSlide(currentIndex + 1); }
        function prev() { showSlide(currentIndex - 1); }

        function startAuto() {
            if (autoInterval) clearInterval(autoInterval);
            autoInterval = setInterval(next, autoDelay);
        }

        function stopAuto() {
            if (autoInterval) clearInterval(autoInterval);
        }

        function resetAuto() {
            stopAuto();
            startAuto();
        }

        // Setup event listeners
        if (prevBtn) prevBtn.addEventListener('click', () => { prev(); resetAuto(); });
        if (nextBtn) nextBtn.addEventListener('click', () => { next(); resetAuto(); });

        if (dots) {
            dots.forEach((dot, i) => {
                dot.addEventListener('click', () => { showSlide(i); resetAuto(); });
            });
        }

        if (container) {
            container.addEventListener('mouseenter', stopAuto);
            container.addEventListener('mouseleave', startAuto);

            // Touch support
            let touchStartX = 0;
            container.addEventListener('touchstart', (e) => {
                touchStartX = e.changedTouches[0].screenX;
                stopAuto();
            }, { passive: true });

            container.addEventListener('touchend', (e) => {
                const touchEndX = e.changedTouches[0].screenX;
                const diff = touchStartX - touchEndX;
                if (Math.abs(diff) > 50) {
                    diff > 0 ? next() : prev();
                }
                startAuto();
            }, { passive: true });
        }

        startAuto();
        return { showSlide, next, prev, stopAuto, startAuto };
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
        const prevCharBtn = document.querySelector('.prev-char');
        const nextCharBtn = document.querySelector('.next-char');
        const charNameEl = document.getElementById('char-name');
        const charQuoteEl = document.getElementById('char-quote');
        const charRoleEl = document.getElementById('char-role');
        const charDescEl = document.getElementById('char-description');
        
        let currentCharIndex = 0;
        
        // Character Data
        // To add a new character, simply add a new object to this array with the following properties:
        // - name: Character's name
        // - quote: Character's quote
        // - role: Character's role/title
        // - description: Character's description
        // - thumbnail: Path to thumbnail image (displayed in the selector)
        // - image: Path to full character image (displayed in the main panel)
        const charactersData = [
            {
                name: 'Hoàng SRO',
                quote: '"Tuyển Sinh đê , học vtc nào!"',
                role: 'VTC Academy Đà Nẵng',
                description: 'Nhanh nhẹn, hoạt bát và biết tuốt mọi chuyện trong xóm. An là nguồn thông tin quý giá cho mọi người chơi. Cậu bé có thể đưa bạn những tin tức mới nhất về các sự kiện trong game.',
                thumbnail: 'images/avatar.png',
                image: 'images/Artboard4.png'
            },
            {
                name: 'Bảo Vệ',
                quote: '"Chào em, thẻ học viên đâu nhỉ?"',
                role: 'Cổng VTC Academy',
                description: 'Chú bảo vệ thân thiện, luôn đứng gác trước cổng trường. Chú nhớ mặt tất cả học viên và thường hỏi thăm việc học tập của các em. Đôi khi chú còn giúp học viên trông xe và chỉ đường cho người lạ.',
                thumbnail: 'images/emoji/11.png',
                image: 'images/Artboard7.png'
            },
            {
                name: 'Học Sinh',
                quote: '"Hôm nay học Design, vui quá!"',
                role: 'Học Viên VTC Academy',
                description: 'Một học viên năng động và đam mê học hỏi tại VTC Academy. Bạn ấy thường xuyên chia sẻ kinh nghiệm học tập và giúp đỡ các bạn khác trong lớp. Sau giờ học, bạn hay ghé Chợ Cồn ăn vặt cùng bạn bè.',
                thumbnail: 'images/emoji/10.png',
                image: 'images/Artboard6.png'
            }
        ];
        
        // Initialize character elements dynamically
        function initializeCharacters() {
            const thumbnailsWrapper = document.querySelector('.thumbnails-wrapper');
            const imageContainer = document.querySelector('.char-image-container');
            
            if (thumbnailsWrapper && imageContainer) {
                // Clear existing content
                thumbnailsWrapper.innerHTML = '';
                imageContainer.innerHTML = '';
                
                // Generate thumbnails and images from data
                charactersData.forEach((char, index) => {
                    // Create thumbnail
                    const thumb = document.createElement('div');
                    thumb.className = 'char-thumb' + (index === 0 ? ' active' : '');
                    thumb.setAttribute('data-char', index);
                    thumb.innerHTML = `
                        <img src="${char.thumbnail}" alt="${char.name}">
                        <span class="thumb-name">${char.name}</span>
                    `;
                    thumbnailsWrapper.appendChild(thumb);
                    
                    // Create full image
                    const imageDiv = document.createElement('div');
                    imageDiv.className = 'char-image' + (index === 0 ? ' active' : '');
                    imageDiv.setAttribute('data-char', index);
                    imageDiv.innerHTML = `<img src="${char.image}" alt="${char.name}">`;
                    imageContainer.appendChild(imageDiv);
                });
            }
        }
        
        // Initialize characters before setting up interactions
        initializeCharacters();
        
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
            
            // Re-query elements after initialization
            const charThumbs = document.querySelectorAll('.char-thumb');
            const charImages = document.querySelectorAll('.char-image');
            
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
        
        // Click on thumbnails (delegated event)
        const thumbnailsWrapper = document.querySelector('.thumbnails-wrapper');
        if (thumbnailsWrapper) {
            thumbnailsWrapper.addEventListener('click', (e) => {
                const thumb = e.target.closest('.char-thumb');
                if (thumb) {
                    const index = parseInt(thumb.getAttribute('data-char'));
                    updateCharacter(index);
                }
            });
        }
        
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

    // ===== Image Slider - Sử dụng utility function =====
    const imageSlider = document.querySelector('.image-slider');
    if (imageSlider) {
        createSliderController({
            slides: imageSlider.querySelectorAll('.slide'),
            dots: imageSlider.querySelectorAll('.dot'),
            prevBtn: imageSlider.querySelector('.prev-arrow'),
            nextBtn: imageSlider.querySelector('.next-arrow'),
            container: imageSlider,
            autoDelay: 4000
        });
    }

    // ===== Gallery Album Slider - Sử dụng utility function =====
    const gallerySection = document.querySelector('.gallery-section');
    if (gallerySection) {
        const galleryCurrentNum = document.getElementById('gallery-current');
        
        createSliderController({
            slides: document.querySelectorAll('.gallery-slide'),
            prevBtn: document.querySelector('.prev-gallery'),
            nextBtn: document.querySelector('.next-gallery'),
            container: document.querySelector('.gallery-frame'),
            autoDelay: 5000,
            onSlideChange: (index) => {
                if (galleryCurrentNum) {
                    galleryCurrentNum.textContent = String(index + 1).padStart(2, '0');
                }
            }
        });
    }
});
