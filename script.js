(function () {
    'use strict';

    const SELECTORS = {
        navbar: '#navbar',
        sections: 'section[id]',
        desktopNavLinks: '.nav-links a[href^="#"]',
        mobileNavLinks: '.mobile-nav a[href^="#"]',
        fadeInElements: '.fade-in',
        timelineItems: '.timeline-item',
        timelineContainer: '.timeline-container',
        timelineProgress: '.timeline-progress',
        timelineFilters: '.timeline-filter',
        timelineNodes: '.timeline-node',
        sliderItems: '.slider-image-item',
        sliderImages: '.slider-image-item img',
        lightbox: '#imageLightbox',
        lightboxImage: '#lightboxImage',
        lightboxClose: '#lightboxClose',
        lightboxPrev: '#lightboxPrev',
        lightboxNext: '#lightboxNext'
    };

    const IDS = {
        mobileMenuBtn: 'mobileMenuBtn',
        mobileNav: 'mobileNav',
        sliderTrack: 'sliderTrack',
        sliderPrev: 'sliderPrev',
        sliderNext: 'sliderNext',
        sliderDots: 'sliderDots'
    };

    const BREAKPOINTS = {
        mobile: '(max-width: 768px)'
    };

    const rafThrottle = (callback) => {
        let ticking = false;

        return (...args) => {
            if (ticking) {
                return;
            }

            ticking = true;
            requestAnimationFrame(() => {
                callback(...args);
                ticking = false;
            });
        };
    };

    const initMobileMenu = () => {
        const mobileMenuBtn = document.getElementById(IDS.mobileMenuBtn);
        const mobileNav = document.getElementById(IDS.mobileNav);

        if (!mobileMenuBtn || !mobileNav) {
            return;
        }

        const closeMenu = () => {
            mobileMenuBtn.classList.remove('active');
            mobileNav.classList.remove('active');
            mobileMenuBtn.setAttribute('aria-expanded', 'false');
        };

        mobileMenuBtn.setAttribute('aria-expanded', 'false');

        mobileMenuBtn.addEventListener('click', () => {
            const isActive = mobileMenuBtn.classList.toggle('active');
            mobileNav.classList.toggle('active', isActive);
            mobileMenuBtn.setAttribute('aria-expanded', String(isActive));
        });

        document.querySelectorAll(SELECTORS.mobileNavLinks).forEach((link) => {
            link.addEventListener('click', closeMenu);
        });

        document.addEventListener('keydown', (event) => {
            if (event.key === 'Escape') {
                closeMenu();
            }
        });

        const mobileMediaQuery = window.matchMedia(BREAKPOINTS.mobile);
        const handleViewportChange = (event) => {
            if (!event.matches) {
                closeMenu();
            }
        };

        if (typeof mobileMediaQuery.addEventListener === 'function') {
            mobileMediaQuery.addEventListener('change', handleViewportChange);
        } else if (typeof mobileMediaQuery.addListener === 'function') {
            mobileMediaQuery.addListener(handleViewportChange);
        }
    };

    const initSmoothScrolling = () => {
        document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
            anchor.addEventListener('click', (event) => {
                const href = anchor.getAttribute('href');
                if (!href || href === '#') {
                    return;
                }

                const target = document.querySelector(href);
                if (!target) {
                    return;
                }

                event.preventDefault();
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            });
        });
    };

    const initScrollReveal = () => {
        const fadeElements = document.querySelectorAll(SELECTORS.fadeInElements);
        if (!fadeElements.length || !('IntersectionObserver' in window)) {
            fadeElements.forEach((element) => element.classList.add('visible'));
            return;
        }

        const observer = new IntersectionObserver((entries, obs) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    obs.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.1,
            rootMargin: '0px 0px -100px 0px'
        });

        fadeElements.forEach((element) => observer.observe(element));
    };

    const initNavbarState = () => {
        const navbar = document.querySelector(SELECTORS.navbar);
        const sections = Array.from(document.querySelectorAll(SELECTORS.sections));
        const desktopLinks = Array.from(document.querySelectorAll(SELECTORS.desktopNavLinks));
        const mobileLinks = Array.from(document.querySelectorAll(SELECTORS.mobileNavLinks));

        if (!sections.length) {
            return;
        }

        const setActiveLink = (sectionId) => {
            [...desktopLinks, ...mobileLinks].forEach((link) => {
                const isCurrent = link.getAttribute('href') === `#${sectionId}`;
                link.classList.toggle('active', isCurrent);
            });
        };

        const handleScroll = () => {
            if (navbar) {
                navbar.classList.toggle('scrolled', window.scrollY > 100);
            }

            const scrollPosition = window.pageYOffset;
            let activeSectionId = sections[0].id;

            sections.forEach((section) => {
                const sectionTop = section.offsetTop - 100;
                const sectionBottom = sectionTop + section.offsetHeight;
                if (scrollPosition >= sectionTop && scrollPosition < sectionBottom) {
                    activeSectionId = section.id;
                }
            });

            setActiveLink(activeSectionId);
        };

        const throttledScroll = rafThrottle(handleScroll);
        window.addEventListener('scroll', throttledScroll, { passive: true });
        handleScroll();
    };

    const initTimeline = () => {
        const timelineItems = Array.from(document.querySelectorAll(SELECTORS.timelineItems));
        const timelineProgress = document.querySelector(SELECTORS.timelineProgress);
        const timelineContainer = document.querySelector(SELECTORS.timelineContainer);
        const timelineFilters = document.querySelectorAll(SELECTORS.timelineFilters);
        const timelineNodes = document.querySelectorAll(SELECTORS.timelineNodes);

        if (!timelineItems.length || !timelineContainer || !timelineProgress) {
            return;
        }

        const updateTimelineProgress = () => {
            const containerRect = timelineContainer.getBoundingClientRect();
            const windowHeight = window.innerHeight;

            if (containerRect.top < windowHeight && containerRect.bottom > 0) {
                const progress = Math.max(
                    0,
                    Math.min(1, (windowHeight - containerRect.top) / (containerRect.height + windowHeight))
                );
                timelineProgress.style.height = `${progress * 100}%`;
            }
        };

        const updateTimelineItems = () => {
            timelineItems.forEach((item, index) => {
                const rect = item.getBoundingClientRect();
                const isVisible = rect.top < window.innerHeight * 0.8;

                if (isVisible && !item.classList.contains('visible')) {
                    setTimeout(() => {
                        item.classList.add('visible');
                    }, index * 150);
                }
            });
        };

        timelineFilters.forEach((filter) => {
            filter.addEventListener('click', () => {
                const filterValue = filter.getAttribute('data-filter');

                timelineFilters.forEach((btn) => btn.classList.remove('active'));
                filter.classList.add('active');

                timelineItems.forEach((item) => {
                    const category = item.getAttribute('data-category');
                    const shouldShow = filterValue === 'all' || category === filterValue;

                    if (shouldShow) {
                        item.style.display = 'block';
                        requestAnimationFrame(() => {
                            item.style.opacity = '1';
                            item.style.transform = 'translateY(0)';
                        });
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

        timelineNodes.forEach((node) => {
            node.addEventListener('click', () => {
                timelineNodes.forEach((item) => item.classList.remove('active'));
                node.classList.add('active');

                const timelineItem = node.closest('.timeline-item');
                if (timelineItem) {
                    timelineItem.scrollIntoView({ behavior: 'smooth', block: 'center' });
                }
            });
        });

        const onScroll = rafThrottle(() => {
            updateTimelineProgress();
            updateTimelineItems();
        });

        window.addEventListener('scroll', onScroll, { passive: true });
        updateTimelineProgress();
        updateTimelineItems();
    };

    const initImageSlider = () => {
        const sliderTrack = document.getElementById(IDS.sliderTrack);
        const sliderPrev = document.getElementById(IDS.sliderPrev);
        const sliderNext = document.getElementById(IDS.sliderNext);
        const sliderDotsContainer = document.getElementById(IDS.sliderDots);

        if (!sliderTrack || !sliderPrev || !sliderNext || !sliderDotsContainer) {
            return;
        }

        const sliderItems = Array.from(document.querySelectorAll(SELECTORS.sliderItems));
        const itemCount = sliderItems.length;
        if (!itemCount) {
            return;
        }

        let currentIndex = 0;

        const goToSlide = (index) => {
            currentIndex = ((index % itemCount) + itemCount) % itemCount;
            sliderTrack.style.transform = `translateX(${-currentIndex * 100}%)`;

            sliderDotsContainer.querySelectorAll('.slider-dot').forEach((dot, dotIndex) => {
                dot.classList.toggle('active', dotIndex === currentIndex);
            });
        };

        sliderDotsContainer.innerHTML = '';
        sliderItems.forEach((_, index) => {
            const dot = document.createElement('button');
            dot.className = 'slider-dot';
            dot.type = 'button';
            dot.setAttribute('aria-label', `Slide ${index + 1}`);
            dot.classList.toggle('active', index === 0);
            dot.addEventListener('click', () => goToSlide(index));
            sliderDotsContainer.appendChild(dot);
        });

        sliderNext.addEventListener('click', (event) => {
            event.preventDefault();
            goToSlide(currentIndex + 1);
        });

        sliderPrev.addEventListener('click', (event) => {
            event.preventDefault();
            goToSlide(currentIndex - 1);
        });

        document.addEventListener('keydown', (event) => {
            if (event.key === 'ArrowRight') {
                goToSlide(currentIndex + 1);
            } else if (event.key === 'ArrowLeft') {
                goToSlide(currentIndex - 1);
            }
        });

        goToSlide(0);
    };

    const initLightbox = () => {
        const lightbox = document.querySelector(SELECTORS.lightbox);
        const lightboxImage = document.querySelector(SELECTORS.lightboxImage);
        const lightboxClose = document.querySelector(SELECTORS.lightboxClose);
        const lightboxPrev = document.querySelector(SELECTORS.lightboxPrev);
        const lightboxNext = document.querySelector(SELECTORS.lightboxNext);
        const sliderImages = Array.from(document.querySelectorAll(SELECTORS.sliderImages));

        if (!lightbox || !lightboxImage || !lightboxClose || !lightboxPrev || !lightboxNext || !sliderImages.length) {
            return;
        }

        const imageUrls = sliderImages.map((img) => img.src);
        let currentIndex = 0;

        const openLightbox = (index) => {
            currentIndex = index;
            lightboxImage.src = imageUrls[currentIndex];
            lightbox.classList.add('active');
        };

        const closeLightbox = () => {
            lightbox.classList.remove('active');
        };

        const showNext = () => {
            currentIndex = (currentIndex + 1) % imageUrls.length;
            lightboxImage.src = imageUrls[currentIndex];
        };

        const showPrev = () => {
            currentIndex = (currentIndex - 1 + imageUrls.length) % imageUrls.length;
            lightboxImage.src = imageUrls[currentIndex];
        };

        sliderImages.forEach((img, index) => {
            img.style.cursor = 'pointer';
            img.addEventListener('click', () => openLightbox(index));
        });

        lightboxClose.addEventListener('click', closeLightbox);
        lightboxPrev.addEventListener('click', showPrev);
        lightboxNext.addEventListener('click', showNext);

        lightbox.addEventListener('click', (event) => {
            if (event.target === lightbox) {
                closeLightbox();
            }
        });

        document.addEventListener('keydown', (event) => {
            if (!lightbox.classList.contains('active')) {
                return;
            }

            if (event.key === 'Escape') {
                closeLightbox();
            } else if (event.key === 'ArrowLeft') {
                showPrev();
            } else if (event.key === 'ArrowRight') {
                showNext();
            }
        });
    };

    const init = () => {
        initMobileMenu();
        initSmoothScrolling();
        initScrollReveal();
        initNavbarState();
        initTimeline();
        initImageSlider();
        initLightbox();
    };

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
