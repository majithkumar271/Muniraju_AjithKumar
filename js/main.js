(function () {
    const animated = document.querySelectorAll('.animate-on-scroll');
    const navbar = document.querySelector('.navbar');
    const progress = document.querySelector('.scroll-progress');
    const links = document.querySelectorAll('.nav-link');
    const sections = document.querySelectorAll('section[id], header[id]');
    const contactForm = document.getElementById('contactForm');

    if (animated.length) {
        const observer = new IntersectionObserver((entries, obs) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    obs.unobserve(entry.target);
                }
            });
        }, { threshold: 0.14 });

        animated.forEach((item) => observer.observe(item));
    }

    const onScroll = () => {
        const y = window.scrollY;

        if (navbar) {
            navbar.classList.toggle('scrolled', y > 24);
        }

        if (progress) {
            const max = document.documentElement.scrollHeight - window.innerHeight;
            const percent = max > 0 ? (y / max) * 100 : 0;
            progress.style.width = percent + '%';
        }

        let current = 'home';
        sections.forEach((section) => {
            const top = section.offsetTop - 120;
            if (y >= top) {
                current = section.getAttribute('id') || current;
            }
        });

        links.forEach((link) => {
            const target = link.getAttribute('href')?.replace('#', '');
            link.classList.toggle('active', target === current);
        });
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();

    links.forEach((link) => {
        link.addEventListener('click', () => {
            const menu = document.querySelector('.navbar-collapse.show');
            if (menu) {
                bootstrap.Collapse.getOrCreateInstance(menu).hide();
            }
        });
    });

    if (contactForm) {
        contactForm.addEventListener('submit', function (event) {
            event.preventDefault();
            const fields = contactForm.querySelectorAll('input, textarea');
            const [nameField, emailField, projectField, messageField] = fields;
            const subject = encodeURIComponent(`New Portfolio Enquiry - ${projectField?.value || 'General'}`);
            const body = encodeURIComponent(
                `Name: ${nameField?.value || ''}\n` +
                `Email: ${emailField?.value || ''}\n` +
                `Project Type: ${projectField?.value || ''}\n\n` +
                `Message:\n${messageField?.value || ''}`
            );
            window.location.href = `mailto:majith.07@gmail.com?subject=${subject}&body=${body}`;

            const button = contactForm.querySelector('button[type="submit"]');
            if (button) {
                const old = button.innerHTML;
                button.disabled = true;
                button.innerHTML = '<i class="fa-solid fa-circle-check"></i> Message Sent';
                setTimeout(() => {
                    contactForm.reset();
                    button.disabled = false;
                    button.innerHTML = old;
                }, 1800);
            }
        });
    }

    const isEditableElement = (target) => {
        if (!(target instanceof HTMLElement)) {
            return false;
        }
        const tag = target.tagName;
        return tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT' || target.isContentEditable;
    };

    const blockedShortcuts = new Set(['c', 'x', 'u', 's', 'a', 'p']);

    document.body.classList.add('protected-content');

    document.addEventListener('contextmenu', (event) => {
        if (!isEditableElement(event.target)) {
            event.preventDefault();
        }
    });

    document.addEventListener('copy', (event) => {
        if (!isEditableElement(event.target)) {
            event.preventDefault();
        }
    });

    document.addEventListener('cut', (event) => {
        if (!isEditableElement(event.target)) {
            event.preventDefault();
        }
    });

    document.addEventListener('selectstart', (event) => {
        if (!isEditableElement(event.target)) {
            event.preventDefault();
        }
    });

    document.addEventListener('dragstart', (event) => {
        const target = event.target;
        if (target instanceof HTMLElement && target.closest('img, video, canvas')) {
            event.preventDefault();
        }
    });

    document.addEventListener('keydown', (event) => {
        const key = event.key.toLowerCase();
        const blockedDevtools =
            key === 'f12' ||
            (event.ctrlKey && event.shiftKey && (key === 'i' || key === 'j' || key === 'c'));

        const blockedCommon = event.ctrlKey && blockedShortcuts.has(key);

        if (blockedDevtools || blockedCommon) {
            event.preventDefault();
            event.stopPropagation();
        }
    });

    const devtoolsThreshold = 160;
    let devtoolsOpen = false;

    setInterval(() => {
        const widthGap = window.outerWidth - window.innerWidth;
        const heightGap = window.outerHeight - window.innerHeight;
        const looksOpen = widthGap > devtoolsThreshold || heightGap > devtoolsThreshold;

        if (looksOpen !== devtoolsOpen) {
            devtoolsOpen = looksOpen;
            document.body.classList.toggle('devtools-blocked', devtoolsOpen);
        }
    }, 1000);
})();
