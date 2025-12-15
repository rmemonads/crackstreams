/**
 * HOMEPAGE LOADER - INSTANT LCP & CUSTOM DOMAIN FIX
 */

// [CONFIGURATION]
const FEATURED_SLUGS = [
    "hello-world",
    "blog/live-stream-for-nfl-nba-nhl-mlb-ufc-more",
    "blog/sportsurge-e-strere",
    "blog/ve-sports-streaming-nfl-nba-ufc-wwe-f1", 
    "blog/test-post-new"
];

const CONFIG = { settingsUrl: '_cms/settings.json', listContainer: 'featured-grid' };
const state = { settings: {} };

// [IMMEDIATE EXECUTION] Start fetching LCP (First Card) immediately
const lcpPromise = fetchCardData(FEATURED_SLUGS[0], 0);

document.addEventListener('DOMContentLoaded', async () => {
    // 1. Render LCP Card AS SOON AS READY (Don't wait for others)
    renderLCP();
    
    // 2. Load Settings & Rest of Cards in background
    loadSettings();
    loadRemainingCards();
});

async function renderLCP() {
    const lcpHtml = await lcpPromise;
    if (lcpHtml) {
        const skeleton = document.getElementById('lcp-skeleton');
        if (skeleton) skeleton.outerHTML = lcpHtml;
    }
}

async function loadRemainingCards() {
    const container = document.getElementById(CONFIG.listContainer);
    // Skip index 0 (LCP), fetch the rest
    const promises = FEATURED_SLUGS.slice(1).map((slug, i) => fetchCardData(slug, i + 1));
    const cards = await Promise.all(promises);
    
    // Remove remaining skeletons and append cards
    const skeletons = container.querySelectorAll('.skeleton-card');
    skeletons.forEach(s => s.remove());
    
    cards.forEach(html => {
        if(html) container.insertAdjacentHTML('beforeend', html);
    });
}

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

        // [DOMAIN SANITIZATION] Force Custom Domain
        if (rawImg.includes('github.io')) {
            const splitPoint = rawImg.indexOf('/images/');
            if(splitPoint > -1) rawImg = window.location.origin + rawImg.substring(splitPoint);
        } else if (rawImg.startsWith('http://')) {
            rawImg = rawImg.replace('http://', 'https://');
        } else if (rawImg.startsWith('/')) {
            rawImg = window.location.origin + rawImg;
        } else if (rawImg && !rawImg.startsWith('http')) {
             rawImg = window.location.origin + '/' + rawImg;
        }

        // [OPTIMIZATION] wsrv.nl (WebP + Resize)
        const optimizedImg = rawImg 
            ? `https://wsrv.nl/?url=${encodeURIComponent(rawImg)}&w=600&output=webp&q=80` 
            : `https://via.placeholder.com/600x314/1e1e1e/333?text=No+Image`;

        const loadingAttr = index === 0 ? 'eager' : 'lazy';
        const priorityAttr = index === 0 ? 'fetchpriority="high"' : '';

        return `
        <article class="home-card">
            <a href="${path}/" class="card-img-container">
                <img 
                    src="${optimizedImg}" 
                    alt="${title}" 
                    class="card-img" 
                    ${priorityAttr} 
                    loading="${loadingAttr}" 
                    width="600" 
                    height="314"
                    onerror="this.onerror=null;this.src='${rawImg}'" 
                >
            </a>
            <div class="card-body">
                <a href="${path}/"><h2 class="card-title">${title}</h2></a>
                <div class="card-footer-row">
                    <span class="read-now-text">Read Now</span>
                    <a href="${path}/" class="read-more-link" aria-label="Read more">
                        <i class="fa-solid fa-arrow-right"></i>
                    </a>
                </div>
            </div>
        </article>`;
    } catch (e) { return null; }
}

async function loadSettings() {
    try {
        const res = await fetch(CONFIG.settingsUrl + '?t=' + Date.now());
        if (res.ok) {
            const data = await res.json();
            state.settings = data;
            applyGlobalSettings(data);
            renderHeader(data);
            renderFooter(data);
            injectAds(data);
            setupAnalytics(data.gaId);
        }
    } catch (e) {}
}

function applyGlobalSettings(s) {
    if(s.siteTitle) {
        document.title = s.siteTitle;
        const ht = document.getElementById('hero-title'); if(ht) ht.innerText = `Welcome to ${s.siteTitle}`;
    }
    if(s.favicon) {
        let l = document.querySelector("link[rel~='icon']");
        if (!l) { l = document.createElement('link'); l.rel = 'icon'; document.head.appendChild(l); }
        l.href = s.favicon;
    }
    if(s.customHeadJs) {
        const sc = document.createElement('script'); sc.textContent = s.customHeadJs; document.head.appendChild(sc);
    }
}

function renderHeader(s) {
    const navLinks = (s.headerMenu || []).map(l => `<li><a href="${resolveLink(l.link)}" onclick="toggleMenu()">${l.label}</a></li>`).join('');
    document.getElementById('dynamic-header').innerHTML = `
        <nav>
            <a href="${s.siteUrl || '/'}" class="logo">${s.siteTitle || 'Home'}</a>
            <ul class="nav-links" id="nav-links-list">
                <li style="list-style:none; position:absolute; top:20px; right:25px;">
                    <button class="nav-close-btn" onclick="toggleMenu()">&times;</button>
                </li>
                ${navLinks}
            </ul>
            <button class="burger" onclick="toggleMenu()"><i class="fa-solid fa-bars"></i></button>
        </nav>`;
}

function toggleMenu() {
    const nav = document.getElementById('nav-links-list');
    if(nav) {
        nav.classList.toggle('nav-active');
        document.body.classList.toggle('menu-open', nav.classList.contains('nav-active'));
    }
}

function renderFooter(s) {
    const nav = (s.footerMenu || []).map(l => `<a href="${resolveLink(l.link)}">${l.label}</a>`).join('');
    const soc = (s.socialLinks || []).map(l => `<a href="${resolveLink(l.link, true)}" aria-label="${l.label}"><i class="${l.label}"></i></a>`).join('');
    document.getElementById('dynamic-footer').innerHTML = `
        <div class="footer-container"><nav class="footer-nav">${nav}</nav><div class="footer-social">${soc}</div></div>
        <div class="footer-bottom"><p>${s.copyright || '© All Rights Reserved'}</p></div>`;
}

function resolveLink(link, isExternal = false) {
    if(!link) return '#';
    link = link.trim();
    if(link.match(/^https?:\/\//) || link.startsWith('mailto:') || link.startsWith('tel:') || link.startsWith('#')) return link;
    if(isExternal || (link.includes('.') && !link.startsWith('/'))) return link.startsWith('http') ? link : 'https://' + link;
    return link.startsWith('/') ? link : '/' + link;
}

function injectAds(s) {
    const ads = s.ads || [];
    const h = ads.find(a => a.placement === 'header_bottom');
    if(h && h.code) document.getElementById('ad-header-bottom').innerHTML = `<div class="ad-unit">${h.code}</div>`;
    const f = ads.find(a => a.placement === 'sticky_footer');
    if(f && f.code) document.getElementById('ad-sticky-footer').innerHTML = `<button class="ad-close" onclick="this.parentElement.remove()">Close X</button>${f.code}`;
}

function setupAnalytics(gaId) {
    if(!gaId) return;
    const loadGA = () => {
        const sc = document.createElement('script'); sc.src = `https://www.googletagmanager.com/gtag/js?id=${gaId}`; sc.async = true;
        document.head.appendChild(sc);
        window.dataLayer = window.dataLayer || [];
        function gtag(){dataLayer.push(arguments);}
        gtag('js', new Date()); gtag('config', gaId);
    };
    if (window.scrollY > 0) loadGA(); else window.addEventListener('scroll', loadGA, { once: true });
    window.addEventListener('mousemove', loadGA, { once: true });
}
