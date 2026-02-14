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
})();
