
document.addEventListener('DOMContentLoaded', () => {
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

    // Mobile Nav Logic (Burger Toggle)
    const burger = document.querySelector('.burger');
    const nav = document.querySelector('.nav-links');
    const body = document.body;
    
    function closeMenu() {
        if(nav) nav.classList.remove('nav-active');
        if(body) body.classList.remove('menu-open');
    }
    
    if(burger && nav) {
        if(!document.querySelector('.nav-close-btn')) {
            const li = document.createElement('li');
            li.style.listStyle = 'none';
            li.style.position = 'absolute';
            li.style.top = '0';
            li.style.right = '0';
            const btn = document.createElement('button');
            btn.className = 'nav-close-btn';
            btn.innerHTML = '&times;';
            btn.setAttribute('aria-label', 'Close Menu');
            btn.onclick = closeMenu;
            li.appendChild(btn);
            nav.appendChild(li);
        }
        
        burger.addEventListener('click', () => {
            nav.classList.toggle('nav-active');
            body.classList.toggle('menu-open');
        });
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
