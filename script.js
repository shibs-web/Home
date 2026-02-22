
// Mobile menu functionality
const mobileMenuBtn = document.getElementById('mobileMenuBtn');
const mobileNav = document.getElementById('mobileNav');

mobileMenuBtn.addEventListener('click', function() {
    mobileMenuBtn.classList.toggle('active');
    mobileNav.classList.toggle('active');
});

// Close mobile menu when clicking on links
document.querySelectorAll('.mobile-nav a').forEach(function(link) {
    link.addEventListener('click', function() {
        mobileMenuBtn.classList.remove('active');
        mobileNav.classList.remove('active');
    });
});

// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(function(anchor) {
    anchor.addEventListener('click', function(e) {
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

// Navbar scroll effect
window.addEventListener('scroll', function() {
    const navbar = document.getElementById('navbar');
    if (window.scrollY > 100) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
});

// Scroll animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -100px 0px'
};

const observer = new IntersectionObserver(function(entries) {
    entries.forEach(function(entry) {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
        }
    });
}, observerOptions);

document.querySelectorAll('.fade-in').forEach(function(el) {
    observer.observe(el);
});

// Update active menu item based on scroll
function updateActiveMenuItem() {
    const sections = document.querySelectorAll('section[id]');
    const scrollY = window.pageYOffset;

    sections.forEach(section => {
        const sectionHeight = section.offsetHeight;
        const sectionTop = section.offsetTop - 100;
        const sectionId = section.getAttribute('id');
        const menuItem = document.querySelector(`.nav-links a[href="#${sectionId}"]`);
        const mobileMenuItem = document.querySelector(`.mobile-nav a[href="#${sectionId}"]`);

        if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
            // Remove active class from all menu items
            document.querySelectorAll('.nav-links a').forEach(item => item.classList.remove('active'));
            document.querySelectorAll('.mobile-nav a').forEach(item => item.classList.remove('active'));
            
            // Add active class to current menu item
            if (menuItem) menuItem.classList.add('active');
            if (mobileMenuItem) mobileMenuItem.classList.add('active');
        }
    });
}

// Listen for scroll events
window.addEventListener('scroll', updateActiveMenuItem);

// Set initial active state
updateActiveMenuItem();

// Timeline functionality
function initTimeline() {
    const timelineItems = document.querySelectorAll('.timeline-item');
    const timelineProgress = document.querySelector('.timeline-progress');
    const timelineFilters = document.querySelectorAll('.timeline-filter');
    
    // Timeline scroll progress
    function updateTimelineProgress() {
        const timelineContainer = document.querySelector('.timeline-container');
        const containerRect = timelineContainer.getBoundingClientRect();
        const windowHeight = window.innerHeight;
        
        if (containerRect.top < windowHeight && containerRect.bottom > 0) {
            const progress = Math.max(0, Math.min(1, 
                (windowHeight - containerRect.top) / (containerRect.height + windowHeight)
            ));
            timelineProgress.style.height = `${progress * 100}%`;
        }
    }
    
    // Timeline item visibility
    function updateTimelineItems() {
        timelineItems.forEach((item, index) => {
            const rect = item.getBoundingClientRect();
            const isVisible = rect.top < window.innerHeight * 0.8;
            
            if (isVisible && !item.classList.contains('visible')) {
                setTimeout(() => {
                    item.classList.add('visible');
                }, index * 200);
            }
        });
    }
    
    // Timeline filtering
    timelineFilters.forEach(filter => {
        filter.addEventListener('click', function() {
            const filterValue = this.getAttribute('data-filter');
            
            // Update active filter
            timelineFilters.forEach(f => f.classList.remove('active'));
            this.classList.add('active');
            
            // Filter timeline items
            timelineItems.forEach(item => {
                const category = item.getAttribute('data-category');
                if (filterValue === 'all' || category === filterValue) {
                    item.style.display = 'block';
                    setTimeout(() => {
                        item.style.opacity = '1';
                        item.style.transform = 'translateY(0)';
                    }, 100);
                } else {
                    item.style.opacity = '0';
                    item.style.transform = 'translateY(30px)';
                    setTimeout(() => {
                        item.style.display = 'none';
                    }, 300);
                }
            });
        });
    });
    
    // Timeline node interactions
    document.querySelectorAll('.timeline-node').forEach(node => {
        node.addEventListener('click', function() {
            // Remove active class from all nodes
            document.querySelectorAll('.timeline-node').forEach(n => n.classList.remove('active'));
            // Add active class to clicked node
            this.classList.add('active');
            
            // Smooth scroll to the timeline item
            const timelineItem = this.closest('.timeline-item');
            timelineItem.scrollIntoView({
                behavior: 'smooth',
                block: 'center'
            });
        });
    });
    
    // Listen for scroll events
    window.addEventListener('scroll', () => {
        updateTimelineProgress();
        updateTimelineItems();
    });
    
    // Initial calls
    updateTimelineProgress();
    updateTimelineItems();
}

// Initialize timeline when DOM is ready

document.addEventListener('DOMContentLoaded', initTimeline);

// Image Slider Functionality
function initImageSlider() {
    const sliderTrack = document.getElementById('sliderTrack');
    const sliderPrev = document.getElementById('sliderPrev');
    const sliderNext = document.getElementById('sliderNext');
    const sliderDotsContainer = document.getElementById('sliderDots');
    
    if (!sliderTrack || !sliderPrev || !sliderNext) {
        console.log('Slider elements not found');
        return;
    }
    
    const sliderItems = document.querySelectorAll('.slider-image-item');
    const itemCount = sliderItems.length;
    let currentIndex = 0;
    
    console.log('Initializing slider with', itemCount, 'items');
    
    // Create dots
    for (let i = 0; i < itemCount; i++) {
        const dot = document.createElement('div');
        dot.classList.add('slider-dot');
        if (i === 0) dot.classList.add('active');
        dot.addEventListener('click', () => goToSlide(i));
        sliderDotsContainer.appendChild(dot);
    }
    
    const dots = document.querySelectorAll('.slider-dot');
    
    function updateSlider() {
        console.log('Updating slider to index:', currentIndex);
        // Update track position
        const offset = -currentIndex * 100;
        sliderTrack.style.transform = `translateX(${offset}%)`;
        
        // Update dots
        dots.forEach((dot, index) => {
            dot.classList.toggle('active', index === currentIndex);
        });
    }
    
    function goToSlide(index) {
        currentIndex = ((index % itemCount) + itemCount) % itemCount;
        updateSlider();
    }
    
    function nextSlide() {
        goToSlide(currentIndex + 1);
    }
    
    function prevSlide() {
        goToSlide(currentIndex - 1);
    }
    
    // Add event listeners
    sliderNext.addEventListener('click', function(e) {
        e.preventDefault();
        console.log('Next button clicked');
        nextSlide();
    });
    
    sliderPrev.addEventListener('click', function(e) {
        e.preventDefault();
        console.log('Prev button clicked');
        prevSlide();
    });
    
    // Optional: Auto-advance slider every 5 seconds
    // setInterval(nextSlide, 5000);
    
    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowRight') {
            nextSlide();
        }
        if (e.key === 'ArrowLeft') {
            prevSlide();
        }
    });
    
    updateSlider();
}

// Initialize slider
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initImageSlider);
} else {
    initImageSlider();
}

// Image Lightbox Functionality
function initLightbox() {
    const lightbox = document.getElementById('imageLightbox');
    const lightboxImage = document.getElementById('lightboxImage');
    const lightboxClose = document.getElementById('lightboxClose');
    const lightboxPrev = document.getElementById('lightboxPrev');
    const lightboxNext = document.getElementById('lightboxNext');
    const sliderImages = document.querySelectorAll('.slider-image-item img');
    
    if (!lightbox || !sliderImages.length) return;
    
    const imageUrls = Array.from(sliderImages).map(img => img.src);
    let currentLightboxIndex = 0;
    
    // Open lightbox when image is clicked
    sliderImages.forEach((img, index) => {
        img.style.cursor = 'pointer';
        img.addEventListener('click', function() {
            currentLightboxIndex = index;
            openLightbox(imageUrls[index]);
        });
    });
    
    function openLightbox(imageSrc) {
        lightboxImage.src = imageSrc;
        lightbox.classList.add('active');
    }
    
    function closeLightbox() {
        lightbox.classList.remove('active');
    }
    
    function showPrevImage() {
        currentLightboxIndex = (currentLightboxIndex - 1 + imageUrls.length) % imageUrls.length;
        lightboxImage.src = imageUrls[currentLightboxIndex];
    }
    
    function showNextImage() {
        currentLightboxIndex = (currentLightboxIndex + 1) % imageUrls.length;
        lightboxImage.src = imageUrls[currentLightboxIndex];
    }
    
    // Event listeners
    lightboxClose.addEventListener('click', closeLightbox);
    lightboxPrev.addEventListener('click', showPrevImage);
    lightboxNext.addEventListener('click', showNextImage);
    
    // Close on background click
    lightbox.addEventListener('click', function(e) {
        if (e.target === lightbox) {
            closeLightbox();
        }
    });
    
    // Keyboard navigation
    document.addEventListener('keydown', function(e) {
        if (!lightbox.classList.contains('active')) return;
        
        if (e.key === 'Escape') closeLightbox();
        if (e.key === 'ArrowLeft') showPrevImage();
        if (e.key === 'ArrowRight') showNextImage();
    });
}

// Initialize lightbox
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initLightbox);
} else {
    initLightbox();
}
