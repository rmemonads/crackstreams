
document.addEventListener('DOMContentLoaded', () => {
    // Breadcrumbs
    const path = window.location.pathname;
    const isPost = path.includes('/blog/');
    const slug = path.split('/').filter(Boolean).pop() || 'Home';
    const crumbSpan = document.getElementById('dynamicBreadcrumbSlug');
    if(crumbSpan) {
        if(isPost) crumbSpan.innerHTML = '<a href="../" style="color:var(--text-color-secondary)">Blog</a> <span>/</span> ' + slug.replace(/-/g, ' ');
        else crumbSpan.textContent = slug.replace(/-/g, ' ');
    }
    // Meta
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
    window.addEventListener('scroll', () => {
        if (!ticking) {
            window.requestAnimationFrame(() => {
                const scrollPercent = (document.documentElement.scrollTop / (document.documentElement.scrollHeight - window.innerHeight)) * 100;
                if(progressBar) progressBar.style.width = scrollPercent + "%";
                ticking = false;
            });
            ticking = true;
        }
    });
    // Mobile Nav
    const burger = document.querySelector('.burger');
    const nav = document.querySelector('.nav-links');
    if(burger && nav) {
        burger.addEventListener('click', () => {
            nav.classList.toggle('nav-active');
            burger.classList.toggle('toggle');
        });
    }
    // Animations
    document.fonts.ready.then(() => {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('is-visible');
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.1 });
        document.querySelectorAll('[data-animate]').forEach(el => observer.observe(el));
    });
});
