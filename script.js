(function () {
    'use strict';

    const initMobileMenu = () => {
        const btn = document.getElementById('menuBtn');
        const nav = document.getElementById('mobileNav');
        if (!btn || !nav) return;

        const close = () => {
            btn.classList.remove('active');
            nav.classList.remove('active');
            btn.setAttribute('aria-expanded', 'false');
        };

        btn.addEventListener('click', () => {
            const active = btn.classList.toggle('active');
            nav.classList.toggle('active', active);
            btn.setAttribute('aria-expanded', String(active));
        });

        nav.querySelectorAll('a').forEach((link) => link.addEventListener('click', close));
        document.addEventListener('keydown', (e) => { if (e.key === 'Escape') close(); });
    };

    const initHeaderShadow = () => {
        const header = document.getElementById('header');
        if (!header) return;
        const onScroll = () => header.classList.toggle('scrolled', window.scrollY > 8);
        window.addEventListener('scroll', onScroll, { passive: true });
        onScroll();
    };

    const initReveal = () => {
        const items = document.querySelectorAll('.reveal');
        if (!items.length) return;

        if (!('IntersectionObserver' in window)) {
            items.forEach((el) => el.classList.add('visible'));
            return;
        }

        const observer = new IntersectionObserver((entries, obs) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    obs.unobserve(entry.target);
                }
            });
        }, { threshold: 0.15, rootMargin: '0px 0px -60px 0px' });

        items.forEach((el) => observer.observe(el));
    };

    const initStatCounters = () => {
        const counters = document.querySelectorAll('.stat-num[data-target]');
        if (!counters.length) return;

        const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

        const animateCounter = (el) => {
            const target = parseInt(el.getAttribute('data-target'), 10);
            const prefix = el.getAttribute('data-prefix') || '';

            if (reduceMotion || Number.isNaN(target)) {
                el.textContent = `${prefix}${target}`;
                return;
            }

            const duration = 1100;
            const start = performance.now();

            const step = (now) => {
                const progress = Math.min((now - start) / duration, 1);
                const eased = 1 - Math.pow(1 - progress, 3);
                el.textContent = `${prefix}${Math.round(eased * target)}`;
                if (progress < 1) {
                    requestAnimationFrame(step);
                }
            };

            requestAnimationFrame(step);
        };

        if (!('IntersectionObserver' in window)) {
            counters.forEach(animateCounter);
            return;
        }

        const observer = new IntersectionObserver((entries, obs) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    animateCounter(entry.target);
                    obs.unobserve(entry.target);
                }
            });
        }, { threshold: 0.6 });

        counters.forEach((el) => observer.observe(el));
    };

    const initContactForm = () => {
        const form = document.getElementById('contactForm');
        if (!form) return;

        form.addEventListener('submit', (event) => {
            event.preventDefault();

            const name = form.elements.name.value.trim();
            const type = form.elements.type.value.trim();
            const message = form.elements.message.value.trim();

            const bodyLines = [
                `الاسم: ${name}`,
                type ? `نوع المشروع: ${type}` : null,
                '',
                message
            ].filter((line) => line !== null);

            // const subject = encodeURIComponent('طلب مشروع جديد عبر موقع شِبس');
            // const body = encodeURIComponent(bodyLines.join('\n'));

            // window.location.href = `mailto:info@shibs.de?subject=${subject}&body=${body}`;
            const whatsappNumber = '963988592846';
            const whatsappMessage = encodeURIComponent(bodyLines.join('\n'));

            window.location.href = `https://wa.me/${whatsappNumber}?text=${whatsappMessage}`;
        });
    };

    const init = () => {
        initMobileMenu();
        initHeaderShadow();
        initReveal();
        initStatCounters();
        initContactForm();
    };

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
