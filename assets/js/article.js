
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
    // Meta (Date)
    const lastMod = new Date(document.lastModified);
    if(document.getElementById('dynamicDate')) document.getElementById('dynamicDate').textContent = lastMod.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
    
    // Accurate Reading Time
    const content = document.querySelector('.article-container');
    if(content && document.getElementById('dynamicReadingTime')) {
        const text = content.innerText || "";
        const wpm = 225;
        const words = text.trim().split(/\s+/).length;
        const time = Math.ceil(words / wpm);
        document.getElementById('dynamicReadingTime').textContent = time + " Min Read";
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
    // Mobile Nav Logic (Refined)
    const burger = document.querySelector('.burger');
    const nav = document.querySelector('.nav-links');
    const closeBtn = document.querySelector('.nav-close-btn');
    
    function closeMenu() {
        if(nav) nav.classList.remove('nav-active');
    }
    
    if(burger && nav) {
        // Add close button to nav if not present (for redundancy)
        if(!document.querySelector('.nav-close-btn')) {
            const btn = document.createElement('button');
            btn.className = 'nav-close-btn';
            btn.innerHTML = '&times;';
            btn.onclick = closeMenu;
            nav.appendChild(btn);
        }
        
        burger.addEventListener('click', () => {
            nav.classList.toggle('nav-active');
        });
        
        // Close on link click
        nav.querySelectorAll('a').forEach(l => l.addEventListener('click', closeMenu));
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
