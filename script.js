/**
 * HOMEPAGE LOADER - OPTIMIZED FOR 100/100 SPEED
 * Features: Image CDN (wsrv.nl), Auto-WebP, Secure Links, Accessibility
 */

// ==========================================
// [CONFIGURATION]
// ==========================================
const FEATURED_SLUGS = [
    "hello-world",
    "blog/live-stream-for-nfl-nba-nhl-mlb-ufc-more",
    "blog/sportsurge-e-strere",
    "blog/ve-sports-streaming-nfl-nba-ufc-wwe-f1", 
    "blog/test-post-new"
];
// ==========================================

const CONFIG = {
    settingsUrl: '_cms/settings.json', 
    listContainer: 'featured-grid'
};

const state = { settings: {} };

// Inline SVGs
const ICONS = {
    burger: `<svg class="icon-svg" viewBox="0 0 24 24" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="18" x2="21" y2="18"></line></svg>`,
    close: `<svg class="icon-svg" viewBox="0 0 24 24" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>`,
    arrowRight: `<svg class="icon-svg" viewBox="0 0 24 24" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>`
};

document.addEventListener('DOMContentLoaded', async () => {
    try {
        await Promise.all([loadSettings(), loadFeaturedContent()]);
    } catch (e) { console.error("Init Error:", e); }
});

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
    } catch (e) { console.warn("Defaults used", e); }
}

function applyGlobalSettings(s) {
    if(s.siteTitle) {
        document.title = s.siteTitle;
        const heroTitle = document.getElementById('hero-title');
        if(heroTitle) heroTitle.innerText = `Welcome to ${s.siteTitle}`;
    }
    if(s.favicon) {
        let link = document.querySelector("link[rel~='icon']");
        if (!link) { link = document.createElement('link'); link.rel = 'icon'; document.head.appendChild(link); }
        link.href = s.favicon;
    }
    // Inject Custom Head JS if exists
    if(s.customHeadJs) {
        const script = document.createElement('script');
        script.textContent = s.customHeadJs; 
        document.head.appendChild(script);
    }
}

function renderHeader(s) {
    const navLinks = (s.headerMenu || []).map(l => 
        `<li><a href="${resolveLink(l.link)}" onclick="toggleMenu()">${l.label}</a></li>`
    ).join('');

    const html = `
        <nav>
            <a href="${s.siteUrl || '/'}" class="logo">${s.siteTitle || 'Home'}</a>
            <ul class="nav-links" id="nav-links-list">
                <li style="list-style:none; position:absolute; top:20px; right:25px;">
                    <button class="nav-close-btn" onclick="toggleMenu()" aria-label="Close Menu">
                        ${ICONS.close}
                    </button>
                </li>
                ${navLinks}
            </ul>
            <button class="burger" onclick="toggleMenu()" aria-label="Open Menu">
                ${ICONS.burger}
            </button>
        </nav>
    `;
    document.getElementById('dynamic-header').innerHTML = html;
}

function toggleMenu() {
    const nav = document.getElementById('nav-links-list');
    if(!nav) return;
    nav.classList.toggle('nav-active');
    if (nav.classList.contains('nav-active')) document.body.classList.add('menu-open');
    else document.body.classList.remove('menu-open');
}

function renderFooter(s) {
    const navLinks = (s.footerMenu || []).map(l => 
        `<a href="${resolveLink(l.link)}">${l.label}</a>`
    ).join('');
    const socials = (s.socialLinks || []).map(l => 
        `<a href="${resolveLink(l.link, true)}" aria-label="${l.label}"><i class="${l.label}"></i></a>`
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

async function loadFeaturedContent() {
    const container = document.getElementById(CONFIG.listContainer);
    // Fetch all cards in parallel
    const promises = FEATURED_SLUGS.map((slug, index) => fetchCardData(slug, index));
    const cards = await Promise.all(promises);
    
    container.innerHTML = ''; 
    let hasContent = false;
    cards.forEach(html => {
        if(html) { container.insertAdjacentHTML('beforeend', html); hasContent = true; }
    });

    if(!hasContent) container.innerHTML = '<p style="text-align:center;color:#666;grid-column:1/-1">No featured content available.</p>';
}

/**
 * OPTIMIZED FETCH
 * 1. Cleans GitHub URLs
 * 2. Proxies images via wsrv.nl for WebP + Compression
 * 3. Applies Correct Fetch Priority
 */
async function fetchCardData(slug, index) {
    let path = slug.replace(/^\/|\/$/g, '');
    try {
        const res = await fetch(`${path}/index.html`);
        if(!res.ok) return null;
        
        const text = await res.text();
        const doc = new DOMParser().parseFromString(text, 'text/html');
        
        const title = doc.querySelector('title')?.innerText.split(' - ')[0] || 'Untitled';
        const imgMeta = doc.querySelector('meta[property="og:image"]');
        let rawImg = imgMeta ? imgMeta.content : '';

        // FIX: Clean GitHub Raw URLs to Custom Domain if needed, or pass as is to proxy
        if(rawImg.includes('raw.githubusercontent.com') || rawImg.includes('github.io')) {
            // No action needed, Proxy handles it, but we prefer HTTPS
            if(rawImg.startsWith('http://')) rawImg = rawImg.replace('http://', 'https://');
        }

        // OPTIMIZATION: Use wsrv.nl for Resize & WebP
        // width=600 is sufficient for grid cards (High DPI supported)
        const optimizedImg = rawImg 
            ? `https://wsrv.nl/?url=${encodeURIComponent(rawImg)}&w=600&output=webp&q=80` 
            : `https://via.placeholder.com/600x314/1e1e1e/333?text=No+Image`;

        // LCP Logic: First image is high priority, others lazy
        const loadingAttr = index === 0 ? 'eager' : 'lazy';
        const priorityAttr = index === 0 ? 'fetchpriority="high"' : '';

        return `
        <article class="home-card fade-in">
            <a href="${path}/" class="card-img-container">
                <img src="${optimizedImg}" alt="${title}" class="card-img" ${priorityAttr} loading="${loadingAttr}" width="600" height="314">
            </a>
            <div class="card-body">
                <a href="${path}/"><h2 class="card-title">${title}</h2></a>
                <div class="card-footer-row">
                    <span class="read-now-text">Read Now</span>
                    <a href="${path}/" class="read-more-link" aria-label="Read more about ${title}">
                        ${ICONS.arrowRight}
                    </a>
                </div>
            </div>
        </article>
        `;
    } catch (e) { console.error(`Failed: ${slug}`, e); return null; }
}

function injectAds(s) {
    const ads = s.ads || [];
    const headAd = ads.find(a => a.placement === 'header_bottom');
    if(headAd && headAd.code) document.getElementById('ad-header-bottom').innerHTML = `<div class="ad-unit">${headAd.code}</div>`;
    
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
    // Lazy load Analytics to boost initial speed
    if (window.scrollY > 0) loadGA();
    else window.addEventListener('scroll', loadGA, { once: true });
    window.addEventListener('mousemove', loadGA, { once: true });
    window.addEventListener('touchstart', loadGA, { once: true });
}

function resolveLink(link, isExternal = false) {
    if(!link) return '#';
    // Clean spaces
    link = link.trim();
    
    // Strict external check
    if(link.match(/^https?:\/\//) || link.startsWith('mailto:') || link.startsWith('tel:') || link.startsWith('#')) return link;
    
    // Loose external check (user typed "google.com")
    if(isExternal || (link.includes('.') && !link.startsWith('/'))) {
        return link.startsWith('http') ? link : 'https://' + link;
    }
    
    // Internal link cleaning
    if(link.startsWith('/')) return link;
    return '/' + link;
}
