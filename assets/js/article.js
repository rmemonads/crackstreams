
document.addEventListener('DOMContentLoaded', () => {
    // Breadcrumb Logic
    const path = window.location.pathname;
    const isPost = path.includes('/blog/');
    const slug = path.split('/').filter(Boolean).pop() || 'Home';
    const crumbSpan = document.getElementById('dynamicBreadcrumbSlug');
    if(crumbSpan) {
        if(isPost) crumbSpan.innerHTML = '<a href="../" style="color:var(--text-color-secondary)">Blog</a> <span>/</span> ' + slug.replace(/-/g, ' ');
        else crumbSpan.textContent = slug.replace(/-/g, ' ');
    }

    // Dynamic Dates & Reading Time
    const lastMod = new Date(document.lastModified);
    if(document.getElementById('dynamicDate')) document.getElementById('dynamicDate').textContent = lastMod.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
    const content = document.querySelector('.article-container');
    if(content && document.getElementById('dynamicReadingTime')) {
        const words = content.innerText.trim().split(/s+/).length;
        document.getElementById('dynamicReadingTime').textContent = Math.ceil(words / 225) + " Min Read";
    }

    // Progress Bar
    const progressBar = document.getElementById('progressBar');
    let ticking = false;
    const updateProgressBar = () => {
        const { scrollTop, scrollHeight } = document.documentElement;
        const scrollPercent = (scrollTop / (scrollHeight - window.innerHeight)) * 100;
        if(progressBar) progressBar.style.width = scrollPercent + "%";
        ticking = false;
    };
    window.addEventListener('scroll', () => { if (!ticking) { window.requestAnimationFrame(updateProgressBar); ticking = true; } });

    // Mobile Nav
    const burger = document.querySelector('.burger');
    const nav = document.querySelector('.nav-links');
    const navLinks = document.querySelectorAll('.nav-links li');
    if(burger && nav) {
        burger.addEventListener('click', () => {
            nav.classList.toggle('nav-active');
            const isActive = nav.classList.contains('nav-active');
            navLinks.forEach((link, index) => {
                if (link.style.animation) link.style.animation = '';
                else link.style.animation = 'navLinkFade 0.5s ease forwards ' + (index / 7 + 0.3) + 's';
            });
            burger.classList.toggle('toggle');
            burger.setAttribute('aria-expanded', isActive);
        });
    }

    // Scroll Animations (Wait for fonts)
    document.fonts.ready.then(() => {
        const animatedElements = document.querySelectorAll('[data-animate]');
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('is-visible');
                    observer.unobserve(entry.target);
                }
            });
        }, { root: null, threshold: 0.1 });
        animatedElements.forEach(element => observer.observe(element));
    });

    // GLOW EFFECT LOGIC
    document.querySelectorAll('.next-step-card').forEach(card => {
        card.addEventListener('mousemove', e => {
            const rect = card.getBoundingClientRect();
            card.style.setProperty('--x', (e.clientX - rect.left) + 'px');
            card.style.setProperty('--y', (e.clientY - rect.top) + 'px');
        });
    });
});
