
document.addEventListener('DOMContentLoaded', () => {
    const burger = document.querySelector('.burger'), nav = document.querySelector('.nav-links'), body = document.body;
    function closeMenu() { if(nav) nav.classList.remove('nav-active'); if(body) body.classList.remove('menu-open'); }
    if(burger && nav) {
        if(!document.querySelector('.nav-close-btn')) {
            const li = document.createElement('li'); li.style.listStyle='none'; li.style.position='absolute'; li.style.top='0'; li.style.right='0';
            const btn = document.createElement('button'); btn.className='nav-close-btn'; btn.innerHTML='&times;'; btn.onclick=closeMenu;
            li.appendChild(btn); nav.appendChild(li);
        }
        burger.addEventListener('click', () => { nav.classList.toggle('nav-active'); body.classList.toggle('menu-open'); });
        nav.querySelectorAll('a').forEach(l => l.addEventListener('click', closeMenu));
    }
    const pb = document.getElementById('progressBar');
    if(pb) window.addEventListener('scroll', () => { requestAnimationFrame(() => pb.style.width = (document.documentElement.scrollTop / (document.documentElement.scrollHeight - window.innerHeight)) * 100 + "%"); });
    const observer = new IntersectionObserver(e => e.forEach(x => { if(x.isIntersecting) { x.target.classList.add('is-visible'); observer.unobserve(x.target); } }), {threshold:0.1});
    document.querySelectorAll('[data-animate]').forEach(el => observer.observe(el));
    const cards = document.querySelectorAll('.cat-card');
    if(cards.length > 0) {
        const perPage = 9, pagination = document.getElementById('pagination');
        if(pagination) {
            const total = Math.ceil(cards.length/perPage);
            let curr = 1;
            function showPage(p) {
                curr = p;
                cards.forEach((c, i) => c.style.display = (i >= (p-1)*perPage && i < p*perPage) ? 'block' : 'none');
                pagination.innerHTML = '';
                for(let i=1; i<=total; i++) {
                    const btn = document.createElement('div'); btn.className = 'page-btn ' + (i===curr?'active':''); btn.innerText = i;
                    btn.onclick = () => { showPage(i); window.scrollTo(0,0); }; pagination.appendChild(btn);
                }
            }
            showPage(1);
        }
    }
});
