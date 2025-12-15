/**
 * BLOG LOADER - INTEGRATED WITH CMS SETTINGS
 * Features:
 * 1. Global Settings (Header/Footer/Ads)
 * 2. Mobile Menu (Open/Close/Scroll Lock)
 * 3. Smart Link Resolution (External vs Internal)
 * 4. Infinite Scroll & Async Post Loading
 */

const CONFIG = {
    settingsUrl: '../_cms/settings.json',
    indexUrl: '../_cms/index.json',
    itemsPerPage: 10,
    listContainer: 'blog-list',
    sentinel: 'sentinel'
};

const state = {
    settings: {},
    posts: [],
    displayed: 0,
    isLoading: false,
    hasMore: true
};

// --- INITIALIZATION ---
document.addEventListener('DOMContentLoaded', async () => {
    try {
        await loadSettings();
        await loadPostsIndex();
        setupInfiniteScroll();
    } catch (e) {
        console.error("Init Error:", e);
    }
});

// --- 1. LOAD SETTINGS & APPLY THEME ---
async function loadSettings() {
    try {
        const res = await fetch(CONFIG.settingsUrl + '?t=' + Date.now());
        if (!res.ok) throw new Error("Settings not found");
        const data = await res.json();
        state.settings = data;
        
        applyGlobalSettings(data);
        renderHeader(data);
        renderFooter(data);
        injectAds(data);
        setupAnalytics(data.gaId);

    } catch (e) {
        console.warn("Using default settings.", e);
    }
}

function applyGlobalSettings(s) {
    // Title & Favicon
    if(s.siteTitle) document.title = `Blog - ${s.siteTitle}`;
    if(s.favicon) {
        let link = document.querySelector("link[rel~='icon']");
        if (!link) {
            link = document.createElement('link');
            link.rel = 'icon';
            document.head.appendChild(link);
        }
        link.href = s.favicon;
    }

    // Global CSS
    if(s.customCss) {
        const style = document.createElement('style');
        style.innerHTML = s.customCss;
        document.head.appendChild(style);
    }

    // Global JS
    if(s.customHeadJs) {
        const script = document.createElement('script');
        script.innerHTML = s.customHeadJs;
        document.head.appendChild(script);
    }
}

// --- HEADER RENDERER WITH MOBILE FIX ---
function renderHeader(s) {
    // Add toggleMenu() to links so menu closes on click
    const navLinks = (s.headerMenu || []).map(l => 
        `<li><a href="${resolveLink(l.link)}" onclick="toggleMenu()">${l.label}</a></li>`
    ).join('');

    const html = `
        <nav>
            <a href="${s.siteUrl || '/'}" class="logo">${s.siteTitle || 'Home'}</a>
            
            <ul class="nav-links" id="nav-links-list">
                <!-- Close Button for Mobile -->
                <button class="nav-close-btn" onclick="toggleMenu()">&times;</button>
                ${navLinks}
            </ul>

            <div class="burger" onclick="toggleMenu()">
                <i class="fa-solid fa-bars" style="color:white;font-size:1.5rem"></i>
            </div>
        </nav>
    `;
    document.getElementById('dynamic-header').innerHTML = html;
}

// TOGGLE MENU FUNCTION (Global scope)
function toggleMenu() {
    const nav = document.getElementById('nav-links-list');
    nav.classList.toggle('nav-active');
    
    // Toggle scroll lock and burger visibility via CSS
    if (nav.classList.contains('nav-active')) {
        document.body.classList.add('menu-open');
    } else {
        document.body.classList.remove('menu-open');
    }
}

function renderFooter(s) {
    const navLinks = (s.footerMenu || []).map(l => 
        `<a href="${resolveLink(l.link)}">${l.label}</a>`
    ).join('');
    
    const socials = (s.socialLinks || []).map(l => 
        `<a href="${resolveLink(l.link)}" aria-label="${l.label}"><i class="${l.label}"></i></a>`
    ).join('');

    const html = `
        <div class="footer-container">
            <nav class="footer-nav">${navLinks}</nav>
            <div class="footer-social">${socials}</div>
        </div>
        <div class="footer-bottom">
            <p>${s.copyright || '© All Rights Reserved'}</p>
        </div>
    `;
    document.getElementById('dynamic-footer').innerHTML = html;
}

// --- 2. ADS & ANALYTICS (Delayed) ---
function injectAds(s) {
    const ads = s.ads || [];
    
    // Header Bottom
    const headAd = ads.find(a => a.placement === 'header_bottom');
    if(headAd && headAd.code) document.getElementById('ad-header-bottom').innerHTML = `<div class="ad-unit">${headAd.code}</div>`;

    // Sticky Footer
    const footAd = ads.find(a => a.placement === 'sticky_footer');
    if(footAd && footAd.code) {
        document.getElementById('ad-sticky-footer').innerHTML = 
        `<button class="ad-close" onclick="this.parentElement.remove()">Close X</button>${footAd.code}`;
    }
}

function setupAnalytics(gaId) {
    if(!gaId) return;
    const loadGA = () => {
        const script = document.createElement('script');
        script.src = `https://www.googletagmanager.com/gtag/js?id=${gaId}`;
        script.async = true;
        document.head.appendChild(script);
        window.dataLayer = window.dataLayer || [];
        function gtag(){dataLayer.push(arguments);}
        gtag('js', new Date());
        gtag('config', gaId);
    };
    // Delayed Load for Speed
    window.addEventListener('scroll', loadGA, { once: true });
    window.addEventListener('mousemove', loadGA, { once: true });
    window.addEventListener('touchstart', loadGA, { once: true });
}

// --- 3. LOAD CONTENT ---
async function loadPostsIndex() {
    try {
        const res = await fetch(CONFIG.indexUrl + '?t=' + Date.now());
        if(!res.ok) throw new Error("Index not found");
        const data = await res.json();
        
        // Filter Posts & Sort by Modified Date DESC
        state.posts = data
            .filter(i => i.type === 'post')
            .sort((a,b) => new Date(b.modified || b.date) - new Date(a.modified || a.date));

        document.getElementById(CONFIG.listContainer).innerHTML = ''; // Clear skeletons
        renderNextBatch();

    } catch (e) {
        console.error(e);
        document.getElementById(CONFIG.listContainer).innerHTML = '<p style="text-align:center;color:#888">No posts found.</p>';
        state.hasMore = false;
        updateSentinel();
    }
}

function renderNextBatch() {
    if(state.isLoading || !state.hasMore) return;
    state.isLoading = true;
    document.querySelector('.spinner').classList.remove('hidden');

    const batch = state.posts.slice(state.displayed, state.displayed + CONFIG.itemsPerPage);
    if(batch.length === 0) {
        state.hasMore = false;
        state.isLoading = false;
        updateSentinel();
        return;
    }

    // Render logic
    const promises = batch.map(post => generateCard(post));
    Promise.all(promises).then(cardsHtml => {
        const container = document.getElementById(CONFIG.listContainer);
        cardsHtml.forEach(html => container.insertAdjacentHTML('beforeend', html));
        
        state.displayed += batch.length;
        state.isLoading = false;
        if(state.displayed >= state.posts.length) state.hasMore = false;
        updateSentinel();
    });
}

// --- CARD GENERATOR ---
async function generateCard(post) {
    const dateStr = new Date(post.modified || post.date).toLocaleDateString('en-US', { year:'numeric', month:'long', day:'numeric'});
    const slug = post.slug;
    
    // Default Fallbacks
    let banner = 'https://via.placeholder.com/1200x628/1e1e1e/333?text=No+Image';
    let desc = 'Click to read more about this topic.';

    // Async Fetch specific post to scrape Meta
    try {
        const res = await fetch(`${slug}/index.html`);
        if(res.ok) {
            const txt = await res.text();
            const doc = new DOMParser().parseFromString(txt, 'text/html');
            
            const ogImg = doc.querySelector('meta[property="og:image"]');
            if(ogImg && ogImg.content) banner = ogImg.content;
            
            const metaDesc = doc.querySelector('meta[name="description"]');
            if(metaDesc && metaDesc.content) desc = metaDesc.content;
        }
    } catch(e) {}

    return `
    <article class="blog-card fade-in">
        <a href="${slug}/" class="card-img-wrap">
            <img src="${banner}" alt="${post.title}" class="card-img" loading="lazy">
        </a>
        <div class="card-content">
            <div class="card-meta">
                <i class="fa-regular fa-calendar-check"></i> <span>${dateStr}</span>
            </div>
            <a href="${slug}/"><h2 class="card-title">${post.title}</h2></a>
            <p class="card-desc">${desc}</p>
            <a href="${slug}/" class="read-more-btn">
                Read Full Article <i class="fa-solid fa-arrow-right-long"></i>
            </a>
        </div>
    </article>
    `;
}

// --- UTILS ---
function setupInfiniteScroll() {
    const obs = new IntersectionObserver(entries => {
        if(entries[0].isIntersecting) renderNextBatch();
    }, { rootMargin: '100px' });
    obs.observe(document.getElementById(CONFIG.sentinel));
}

function updateSentinel() {
    document.querySelector('.spinner').classList.add('hidden');
    if(!state.hasMore) document.querySelector('.end-msg').classList.remove('hidden');
}

// --- LINK RESOLVER (FIXED: No unwanted Site URL) ---
function resolveLink(link) {
    if(!link) return '#';
    
    // 1. Explicit External Protocols
    if(link.match(/^(https?:|mailto:|tel:|\/\/|#)/)) {
        return link;
    }

    // 2. Heuristic External (e.g. "google.com" or "www.test.com")
    // If it has "www." OR (has a dot AND no starting slash)
    if(link.startsWith('www.') || (link.includes('.') && !link.startsWith('/'))) {
        return 'https://' + link;
    }

    // 3. Internal (Root Relative)
    if(link.startsWith('/')) return link;
    return '/' + link;
}
