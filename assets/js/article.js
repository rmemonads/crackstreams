
document.addEventListener('DOMContentLoaded', () => {
    // 1. DYNAMIC DATA
    const lastMod = new Date(document.lastModified);
    if(document.getElementById('dynamicDate')) document.getElementById('dynamicDate').textContent = lastMod.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
    
    const path = window.location.pathname.split('/').filter(Boolean);
    const slug = path[path.length - 1] || 'Home';
    if(document.getElementById('dynamicBreadcrumbSlug')) document.getElementById('dynamicBreadcrumbSlug').textContent = slug.replace(/-/g, ' ');

    const ogImage = document.querySelector('meta[property="og:image"]');
    if(ogImage && document.getElementById('dynamicBannerImage')) document.getElementById('dynamicBannerImage').src = ogImage.content;

    const content = document.querySelector('.article-content');
    if(content && document.getElementById('dynamicReadingTime')) {
        const words = content.innerText.trim().split(/s+/).length;
        document.getElementById('dynamicReadingTime').textContent = Math.ceil(words / 225) + " Min Read";
    }

    // 2. PROGRESS BAR
    const bar = document.getElementById('progressBar');
    if(bar) {
        window.addEventListener('scroll', () => {
            const st = document.documentElement.scrollTop;
            const sh = document.documentElement.scrollHeight - document.documentElement.clientHeight;
            bar.style.width = (st / sh) * 100 + "%";
        });
    }

    // 3. MOBILE MENU
    const burger = document.querySelector('.burger');
    const nav = document.querySelector('.nav-links');
    if(burger && nav) {
        burger.addEventListener('click', () => {
            nav.classList.toggle('nav-active');
            burger.classList.toggle('toggle');
        });
    }
});
