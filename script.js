/**
 * HOMEPAGE LOADER - CURATED CONTENT
 * Updates: Removed Date/Tags, Added "Read Now", Fixed Syntax
 */

// ==========================================
// [CONFIGURATION AREA] - ADD YOUR SLUGS HERE
// Important: Separate items with commas!
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
    settingsUrl: '_cms/settings.json', // Path relative to root
    listContainer: 'featured-grid'
};

const state = {
    settings: {}
};

// --- INITIALIZATION ---
document.addEventListener('DOMContentLoaded', async () => {
    try {
        await loadSettings();
        await loadFeaturedContent();
    } catch (e) {
        console.error("Init Error:", e);
    }
});

// --- 1. LOAD GLOBAL SETTINGS ---
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
    if(s.siteTitle) document.title = s.siteTitle; 
    if(s.siteTitle) document.getElementById('hero-title').innerText = `Welcome to ${s.siteTitle}`;
    
    if(s.favicon) {
        let link = document.querySelector("link[rel~='icon']");
        if (!link) {
            link = document.createElement('link');
            link.rel = 'icon';
            document.head.appendChild(link);
        }
        link.href = s.favicon;
    }
    if(s.customCss) {
        const style = document.createElement('style');
        style.innerHTML = s.customCss;
        document.head.appendChild(style);
    }
    if(s.customHeadJs) {
        const script = document.createElement('script');
        script.innerHTML = s.customHeadJs;
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

function toggleMenu() {
    const nav = document.getElementById('nav-links-list');
    nav.classList.toggle('nav-active');
    
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

// --- 2. LOAD & RENDER FEATURED CARDS ---
async function loadFeaturedContent() {
    const container = document.getElementById(CONFIG.listContainer);
    
    const promises = FEATURED_SLUGS.map(slug => fetchCardData(slug));
    const cards = await Promise.all(promises);
    
    container.innerHTML = ''; // Clear skeletons
    
    let hasContent = false;
    cards.forEach(html => {
        if(html) {
            container.insertAdjacentHTML('beforeend', html);
            hasContent = true;
        }
    });

    if(!hasContent) {
        container.innerHTML = '<p style="text-align:center;color:#666;grid-column:1/-1">No featured content available.</p>';
    }
}

async function fetchCardData(slug) {
    let path = slug.replace(/^\/|\/$/g, '');
    
    try {
        const res = await fetch(`${path}/index.html`);
        if(!res.ok) return null;
        
        const text = await res.text();
        const doc = new DOMParser().parseFromString(text, 'text/html');
        
        // Scrape Metadata
        const title = doc.querySelector('title')?.innerText.split(' - ')[0] || 'Untitled';
        const imgMeta = doc.querySelector('meta[property="og:image"]');
        const img = imgMeta ? imgMeta.content : 'https://via.placeholder.com/1200x628/1e1e1e/333?text=No+Image';
        
        return `
        <article class="home-card fade-in">
            <a href="${path}/" class="card-img-container">
                <img src="${img}" alt="${title}" class="card-img" loading="lazy">
            </a>
            <div class="card-body">
                <a href="${path}/"><h2 class="card-title">${title}</h2></a>
                <div class="card-footer-row">
                    <span class="read-now-text">Read Now</span>
                    <a href="${path}/" class="read-more-link"><i class="fa-solid fa-arrow-right"></i></a>
                </div>
            </div>
        </article>
        `;
    } catch (e) {
        console.error(`Failed to load ${slug}`, e);
        return null;
    }
}

// --- ADS & ANALYTICS ---
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
    window.addEventListener('scroll', loadGA, { once: true });
    window.addEventListener('mousemove', loadGA, { once: true });
    window.addEventListener('touchstart', loadGA, { once: true });
}

// --- LINK RESOLVER ---
function resolveLink(link) {
    if(!link) return '#';
    if(link.match(/^(https?:|mailto:|tel:|\/\/|#)/)) return link;
    if(link.startsWith('www.') || (link.includes('.') && !link.startsWith('/'))) return 'https://' + link;
    if(link.startsWith('/')) return link;
    return '/' + link;
}
