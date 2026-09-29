(function () {
    'use strict';

    const initMobileMenu = () => {
        const btn = document.getElementById('menuBtn');
        const nav = document.getElementById('mobileNav');
        if (!btn || !nav) return;
        const header = document.getElementById('header');

        const setOpen = (open) => {
            btn.classList.toggle('active', open);
            nav.classList.toggle('active', open);
            document.body.classList.toggle('menu-open', open);
            btn.setAttribute('aria-expanded', String(open));
            btn.setAttribute('aria-label', open ? 'إغلاق القائمة' : 'فتح القائمة');
        };
        const close = () => setOpen(false);

        btn.addEventListener('click', () => setOpen(!nav.classList.contains('active')));
        nav.querySelectorAll('a').forEach((link) => link.addEventListener('click', close));
        document.addEventListener('keydown', (e) => { if (e.key === 'Escape') close(); });
        // tap on the dimmed backdrop closes the menu
        document.addEventListener('click', (e) => {
            if (nav.classList.contains('active') && header && !header.contains(e.target)) close();
        });
        // switching to a wide layout (e.g. tablet rotated) closes it too
        window.matchMedia('(min-width: 1081px)').addEventListener('change', (e) => { if (e.matches) close(); });
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
        const errorBox = document.getElementById('formError');

        const showError = (msg, field) => {
            if (errorBox) { errorBox.textContent = msg; errorBox.hidden = false; }
            if (field) { field.setAttribute('aria-invalid', 'true'); field.focus(); }
        };

        form.addEventListener('input', (e) => {
            if (e.target.hasAttribute('aria-invalid')) e.target.removeAttribute('aria-invalid');
            if (errorBox) errorBox.hidden = true;
        });

        form.addEventListener('submit', (event) => {
            event.preventDefault();

            const nameField = form.elements.name;
            const msgField = form.elements.message;
            const name = nameField.value.trim();
            const type = form.elements.type ? String(form.elements.type.value || '').trim() : '';
            const message = msgField.value.trim();

            if (!name) return showError('اكتب اسمك حتى نعرف بمن نتواصل.', nameField);
            if (message.length < 10) return showError('اكتب بضع كلمات عن المشروع (10 أحرف على الأقل).', msgField);

            const bodyLines = [
                'مرحباً شِبس،',
                `الاسم: ${name}`,
                type ? `نوع المشروع: ${type}` : null,
                '',
                message
            ].filter((line) => line !== null);

            const whatsappNumber = '963988592846';
            const whatsappMessage = encodeURIComponent(bodyLines.join('\n'));
            window.open(`https://wa.me/${whatsappNumber}?text=${whatsappMessage}`, '_blank', 'noopener');
        });
    };

    const reduceMotion = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    /* ---- Homepage: rotating service in the headline ---- */
    const initRotator = () => {
        const el = document.getElementById('rotator');
        if (!el || reduceMotion()) return;
        const words = ['الأنظمة البرمجية', 'برامج سطح المكتب', 'مواقع الويب', 'تطبيقات الجوال', 'الأنظمة الإدارية'];
        let w = 0, i = words[0].length, deleting = true;

        const tick = () => {
            const word = words[w];
            if (deleting) {
                i--;
                el.textContent = word.slice(0, i);
                if (i <= 0) { deleting = false; w = (w + 1) % words.length; }
                setTimeout(tick, 45);
            } else {
                const next = words[w];
                i++;
                el.textContent = next.slice(0, i);
                if (i >= next.length) { deleting = true; setTimeout(tick, 2200); }
                else setTimeout(tick, 85);
            }
        };
        setTimeout(tick, 2600);
    };

    /* ---- Homepage: code bits bursting out of the logo bag ---- */
    const initBurst = () => {
        const stage = document.getElementById('heroStage');
        const burst = document.getElementById('burst');
        if (!stage || !burst || reduceMotion() || !Element.prototype.animate) return;

        const glyphs = ['{ }', '</>', '01', '10', '⚡', '( )', ';', '[ ]', '#', '=>', '1', '0'];
        const colors = ['#f5bb2e', '#ffd966', '#22d9f2', '#8fe22b', '#f39a1e'];
        let visible = true;

        const spawn = () => {
            if (!visible || document.hidden) return;
            const b = document.createElement('span');
            b.className = 'bit';
            b.textContent = glyphs[Math.floor(Math.random() * glyphs.length)];
            b.style.color = colors[Math.floor(Math.random() * colors.length)];
            b.style.fontSize = `${12 + Math.random() * 14}px`;
            burst.appendChild(b);

            // fan out upwards like the chips leaving the bag in the logo
            const angle = (-90 + (Math.random() * 140 - 70)) * Math.PI / 180;
            const size = stage.clientWidth;
            const dist = size * (0.34 + Math.random() * 0.24);
            const dx = Math.cos(angle) * dist;
            const dy = Math.sin(angle) * dist;
            const rot = Math.random() * 60 - 30;

            b.animate([
                { transform: 'translate(-50%,-50%) scale(.3)', opacity: 0 },
                { opacity: 1, offset: .15 },
                { transform: `translate(calc(-50% + ${dx}px), calc(-50% + ${dy}px)) rotate(${rot}deg) scale(1)`, opacity: 0 }
            ], { duration: 2200 + Math.random() * 1400, easing: 'cubic-bezier(.15,.7,.3,1)' })
             .onfinish = () => b.remove();
        };

        setInterval(spawn, 260);

        if ('IntersectionObserver' in window) {
            new IntersectionObserver(([e]) => { visible = e.isIntersecting; }).observe(stage);
        }

        // gentle tilt toward the pointer (desktop only)
        if (window.matchMedia('(hover: hover)').matches) {
            const hero = stage.closest('section');
            hero.addEventListener('pointermove', (e) => {
                const r = stage.getBoundingClientRect();
                const x = (e.clientX - (r.left + r.width / 2)) / r.width;
                const y = (e.clientY - (r.top + r.height / 2)) / r.height;
                stage.style.setProperty('--ry', `${x * 10}deg`);
                stage.style.setProperty('--rx', `${-y * 10}deg`);
            });
            hero.addEventListener('pointerleave', () => {
                stage.style.setProperty('--ry', '0deg');
                stage.style.setProperty('--rx', '0deg');
            });
        }
    };

    /* ---- Homepage: spotlight that follows the cursor on service tiles ---- */
    const initTiles = () => {
        document.querySelectorAll('.tile').forEach((tile) => {
            tile.addEventListener('pointermove', (e) => {
                const r = tile.getBoundingClientRect();
                tile.style.setProperty('--mx', `${e.clientX - r.left}px`);
                tile.style.setProperty('--my', `${e.clientY - r.top}px`);
            });
        });
    };

    /* ---- Homepage: security pipeline — requests, responses, and attacks that get ejected ---- */
    const initPipeline = () => {
        const pipe = document.getElementById('pipe');
        const layer = document.getElementById('packets');
        if (!pipe || !layer) return;

        const cards = [...pipe.querySelectorAll('.layer-card')];
        const nodes = [...pipe.querySelectorAll('.layer-node')];
        const chips = [...pipe.querySelectorAll('.client-chip')];
        const hub = pipe.querySelector('.pipe-hub');
        const log = document.getElementById('secLog');
        const okEl = document.getElementById('statOk');
        const badEl = document.getElementById('statBlocked');
        const flags = cards.map((c) => c.querySelector('.layer-flag'));
        if (reduceMotion() || !Element.prototype.animate || !cards.length) return;

        const DB = nodes.length - 1;
        const ENDPOINTS = [
            ['GET', '/api/invoices', 200], ['POST', '/api/patients', 201], ['GET', '/api/stock/items', 200],
            ['PUT', '/api/appointments/17', 200], ['POST', '/api/auth/refresh', 200], ['GET', '/api/reports/monthly', 200],
            ['DELETE', '/api/cart/items/4', 204], ['POST', '/api/invoices', 201]
        ];
        // layer index = where the attack gets caught
        const ATTACKS = [
            { name: 'اتصال غير مشفّر', at: 0, code: 426 },
            { name: 'توكن مزوّر', at: 1, code: 401 },
            { name: 'جلسة منتهية', at: 1, code: 401 },
            { name: 'وصول لبيانات عميل آخر', at: 2, code: 403 },
            { name: 'حقن SQL', at: 3, code: 400 },
            { name: 'ملف بصيغة مزيّفة', at: 3, code: 400 },
            { name: 'حقن سكربت XSS', at: 4, code: 400 },
            { name: 'فاتورة بمبلغ سالب', at: 5, code: 422 },
            { name: 'تخمين كلمات المرور', at: 6, code: 429 },
            { name: 'طلب CSRF مزوّر', at: 6, code: 403 }
        ];
        const LAYER_EN = cards.map((c) => c.querySelector('.layer-en').textContent.split(' /')[0]);

        const rand = (arr) => arr[Math.floor(Math.random() * arr.length)];
        const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
        const pos = (el) => {
            const p = pipe.getBoundingClientRect();
            const r = el.getBoundingClientRect();
            return { x: r.left - p.left + r.width / 2, y: r.top - p.top + r.height / 2 };
        };

        const pulse = (el, cls, ms = 650) => {
            el.classList.remove(cls);
            void el.offsetWidth; // restart
            el.classList.add(cls);
            clearTimeout(el[`_t_${cls}`]);
            el[`_t_${cls}`] = setTimeout(() => el.classList.remove(cls), ms);
        };

        const ghost = (kind, p) => {
            const g = document.createElement('span');
            g.className = `ghost ${kind}`;
            g.style.transform = `translate(${p.x}px, ${p.y}px)`;
            layer.appendChild(g);
            setTimeout(() => g.remove(), 650);
        };

        const move = (pk, from, to, ms, easing = 'cubic-bezier(.45,0,.3,1)') => {
            const kind = pk.dataset.kind;
            const steps = 3;
            for (let k = 1; k <= steps; k++) {
                setTimeout(() => ghost(kind, {
                    x: from.x + (to.x - from.x) * (k / (steps + 1)),
                    y: from.y + (to.y - from.y) * (k / (steps + 1))
                }), ms * k / (steps + 1));
            }
            return pk.animate(
                [{ transform: `translate(${from.x}px, ${from.y}px)` }, { transform: `translate(${to.x}px, ${to.y}px)` }],
                { duration: ms, easing, fill: 'forwards' }
            ).finished;
        };

        const makePacket = (kind) => {
            const pk = document.createElement('span');
            pk.className = `packet ${kind}`;
            pk.dataset.kind = kind;
            if (kind === 'atk') pk.textContent = '!';
            layer.appendChild(pk);
            return pk;
        };

        const addLog = (html, cls) => {
            if (!log) return;
            const li = document.createElement('li');
            li.className = cls;
            li.innerHTML = html;
            log.prepend(li);
            while (log.children.length > 7) log.lastElementChild.remove();
        };
        const bump = (el) => {
            if (!el) return;
            el.textContent = String(Number(el.textContent) + 1);
            pulse(el, 'bump', 360);
        };

        const HOP = 230;

        const request = async () => {
            const chip = rand(chips);
            const [method, path, code] = rand(ENDPOINTS);
            const started = performance.now();
            const pk = makePacket('req');
            pulse(chip, 'lit', 700);

            let p = pos(chip);
            await move(pk, p, pos(hub), 480);
            p = pos(hub);
            for (let i = 0; i <= DB; i++) {
                const q = pos(nodes[i]);
                await move(pk, p, q, HOP);
                pulse(nodes[i], 'pass-req');
                pulse(cards[i], 'pass-req');
                p = q;
            }

            // the database answers: the packet turns into a response and climbs back
            await sleep(160);
            pk.className = 'packet res';
            pk.dataset.kind = 'res';
            for (let i = DB - 1; i >= 0; i--) {
                const q = pos(nodes[i]);
                await move(pk, p, q, HOP * .7);
                pulse(nodes[i], 'pass-res', 500);
                p = q;
            }
            await move(pk, p, pos(hub), 200);
            await move(pk, pos(hub), pos(chip), 420);
            pulse(chip, 'lit-res', 700);
            pk.remove();

            const ms = Math.round(18 + (performance.now() - started) / 120);
            addLog(`<span class="code">${code}</span><bdi dir="ltr">${method} ${path}</bdi><small>${ms}ms</small>`, 'ok');
            bump(okEl);
        };

        const attack = async () => {
            const a = rand(ATTACKS);
            const pk = makePacket('atk');
            const hubP = pos(hub);
            const fromLeft = Math.random() < .5;
            // attackers come from outside the known clients
            let p = { x: fromLeft ? -20 : pipe.clientWidth + 20, y: hubP.y - 30 };
            await move(pk, p, hubP, 700, 'cubic-bezier(.3,.6,.4,1)');
            p = hubP;

            for (let i = 0; i <= a.at; i++) {
                const q = pos(nodes[i]);
                await move(pk, p, q, HOP * 1.1);
                p = q;
            }

            // caught: flash the layer, show why, and throw the packet out
            const card = cards[a.at];
            const node = nodes[a.at];
            if (flags[a.at]) flags[a.at].textContent = `طُرد: ${a.name}`;
            pulse(node, 'blocked', 900);
            pulse(card, 'blocked', 1400);
            pulse(card, 'flagged', 1800);

            const c = pos(card);
            const dir = c.x > p.x ? -1 : 1; // fly away from the card, out of the pipeline
            await pk.animate([
                { transform: `translate(${p.x}px, ${p.y}px) scale(1.25)`, opacity: 1 },
                { transform: `translate(${p.x + dir * 40}px, ${p.y - 14}px) scale(1.1) rotate(${dir * 90}deg)`, opacity: 1, offset: .25 },
                { transform: `translate(${p.x + dir * (pipe.clientWidth * .55)}px, ${p.y + 30}px) scale(.4) rotate(${dir * 420}deg)`, opacity: 0 }
            ], { duration: 750, easing: 'cubic-bezier(.2,.6,.3,1)', fill: 'forwards' }).finished;
            pk.remove();

            addLog(`<span class="code">${a.code}</span><span>طُرد: ${a.name} <small>عند ${LAYER_EN[a.at]}</small></span>`, 'bad');
            bump(badEl);
        };

        let running = 0;
        let visible = false;
        let spawned = 0;
        const MAX = 3;

        const spawn = () => {
            if (!visible || document.hidden || running >= MAX) return;
            spawned++;
            // roughly one attack in three, and never more than two quiet requests in a row
            const isAttack = spawned % 3 === 0 || Math.random() < .15;
            running++;
            (isAttack ? attack() : request())
                .catch(() => {})
                .finally(() => { running--; });
        };

        setInterval(spawn, 1150);

        if ('IntersectionObserver' in window) {
            new IntersectionObserver(([e]) => { visible = e.isIntersecting; }, { threshold: .15 }).observe(pipe);
        } else {
            visible = true;
        }
    };

    /* ---- Homepage: timeline line fills when it scrolls into view ---- */
    const initTimeline = () => {
        const tl = document.getElementById('timeline');
        if (!tl) return;
        const go = () => { tl.style.setProperty('--p', 1); tl.classList.add('go'); };
        if (!('IntersectionObserver' in window) || reduceMotion()) return go();
        new IntersectionObserver(([e], obs) => {
            if (e.isIntersecting) { go(); obs.disconnect(); }
        }, { threshold: .5 }).observe(tl);
    };

    /* ---- Marquee: repeat the tags until one half is wider than the screen (seamless loop) ---- */
    const initMarquee = () => {
        const track = document.getElementById('marqueeTrack');
        if (!track) return;
        const original = [...track.children];
        let guard = 0;
        while (track.scrollWidth < window.innerWidth * 1.2 && guard++ < 10) {
            original.forEach((n) => track.appendChild(n.cloneNode(true)));
        }
        [...track.children].forEach((n) => track.appendChild(n.cloneNode(true)));
        const secs = Math.max(20, track.scrollWidth / 2 / 45);
        track.style.animationDuration = `${secs}s`;
    };

    /* ---- Homepage: highlight the nav link of the section in view ---- */
    const initScrollSpy = () => {
        const links = [...document.querySelectorAll('.nav-links a[href^="#"]')];
        if (!links.length || !('IntersectionObserver' in window)) return;
        const map = new Map();
        links.forEach((a) => {
            const sec = document.querySelector(a.getAttribute('href'));
            if (sec) map.set(sec, a);
        });
        const obs = new IntersectionObserver((entries) => {
            entries.forEach((e) => {
                if (e.isIntersecting) {
                    links.forEach((l) => l.classList.remove('active'));
                    const link = map.get(e.target);
                    if (link) link.classList.add('active');
                }
            });
        }, { rootMargin: '-45% 0px -50% 0px' });
        map.forEach((_, sec) => obs.observe(sec));
        const hero = document.getElementById('top');
        if (hero) obs.observe(hero); // clears the highlight when back at the top
    };

    const initYear = () => {
        const y = document.getElementById('year');
        if (y) y.textContent = new Date().getFullYear();
    };

    const init = () => {
        initMobileMenu();
        initHeaderShadow();
        initReveal();
        initStatCounters();
        initContactForm();
        initRotator();
        initBurst();
        initTiles();
        initPipeline();
        initTimeline();
        initMarquee();
        initScrollSpy();
        initYear();
    };

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
