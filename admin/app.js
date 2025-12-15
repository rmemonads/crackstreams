/**
 * ULTIMATE SERVERLESS CMS - FINAL OPTIMIZED
 * Fixes: Layout Shifts by moving ReadTime/Date logic to WRITE TIME (Publishing).
 * Added: Strict CSS slotting for Titles, Breadcrumbs, and Meta.
 * Google Discover: 1200x628 Aspect Ratio enforcement.
 */
 
const SYSTEM_ASSETS = {
    // 1. PERFORMANCE OPTIMIZED CSS (Zero Layout Shift Version)
    "assets/css/article.css": `
/* 1. FONTS */
/* swap helps text appear, min-heights below prevent shift when it does */
@font-face{font-family:'Poppins Fallback';src:local('Arial');ascent-override:90%;descent-override:22%;line-gap-override:0%;size-adjust:104%}
@font-face{font-family:Poppins;font-style:normal;font-weight:300;font-display:swap;src:url(https://fonts.gstatic.com/s/poppins/v20/pxiByp8kv8JHgFVrLDz8Z1xlFd2JQEk.woff2) format('woff2');unicode-range:U+0000-00FF,U+0131,U+0152-0153,U+02BB-02BC,U+02C6,U+02DA,U+02DC,U+2000-206F,U+2074,U+20AC,U+2122,U+2191,U+2193,U+2212,U+2215,U+FEFF,U+FFFD}
@font-face{font-family:Poppins;font-style:normal;font-weight:400;font-display:swap;src:url(https://fonts.gstatic.com/s/poppins/v20/pxiEyp8kv8JHgFVrJJfecg.woff2) format('woff2');unicode-range:U+0000-00FF,U+0131,U+0152-0153,U+02BB-02BC,U+02C6,U+02DA,U+02DC,U+2000-206F,U+2074,U+20AC,U+2122,U+2191,U+2193,U+2212,U+2215,U+FEFF,U+FFFD}
@font-face{font-family:Poppins;font-style:normal;font-weight:600;font-display:swap;src:url(https://fonts.gstatic.com/s/poppins/v20/pxiByp8kv8JHgFVrLEj6Z1xlFd2JQEk.woff2) format('woff2');unicode-range:U+0000-00FF,U+0131,U+0152-0153,U+02BB-02BC,U+02C6,U+02DA,U+02DC,U+2000-206F,U+2074,U+20AC,U+2122,U+2191,U+2193,U+2212,U+2215,U+FEFF,U+FFFD}
@font-face{font-family:Poppins;font-style:normal;font-weight:700;font-display:swap;src:url(https://fonts.gstatic.com/s/poppins/v20/pxiByp8kv8JHgFVrLCz7Z1xlFd2JQEk.woff2) format('woff2');unicode-range:U+0000-00FF,U+0131,U+0152-0153,U+02BB-02BC,U+02C6,U+02DA,U+02DC,U+2000-206F,U+2074,U+20AC,U+2122,U+2191,U+2193,U+2212,U+2215,U+FEFF,U+FFFD}

/* 2. VARIABLES & RESET */
:root{--primary-color:#00aaff;--background-color:#121212;--surface-color:#1e1e1e;--text-color:#e0e0e0;--text-color-secondary:#b0b0b0;--font-family:'Poppins','Poppins Fallback',sans-serif;--content-width:800px;}
*{margin:0;padding:0;box-sizing:border-box}

/* 3. CRITICAL LAYOUT & CLS FIX */
@media screen and (max-width:850px){
    .page-header-section, .featured-image-container, .article-container {
        padding-left: 1rem;
        padding-right: 1rem;
        width: 100%;
    }
}

/* 4. GENERAL STYLES */
html{scroll-behavior:smooth;overflow-x:hidden}body{font-family:sans-serif;font-family:var(--font-family);background-color:var(--background-color);color:var(--text-color);line-height:1.7;overflow-x:hidden}

/* Title Slotting: Prevent shift when loading font */
h1 { font-size: 2.5rem; line-height: 1.2; margin: 0.67em 0; min-height: 1.2em; }

a{color:#ff3e00;text-decoration:none;transition:color .3s ease}a:hover{color:var(--primary-color)}

/* Progress Bar */
.progress-bar{position:fixed;top:0;left:0;width:0;height:4px;background:linear-gradient(90deg,var(--primary-color),#0077b6);z-index:1000;transition:width .1s linear}

/* Header */
.site-header nav{display:flex;justify-content:space-between;align-items:center;padding:1.5rem 5%;background-color:var(--background-color);border-bottom:1px solid #2a2a2a;height:80px}
.logo{font-weight:700;font-size:1.5rem;color:#fff;text-decoration:none}
.nav-links{display:flex;justify-content:space-around;list-style:none}
.nav-links li{margin:0 1rem}.nav-links a{color:var(--text-color);font-weight:600;font-size:1rem;position:relative}.nav-links a::after{content:'';position:absolute;width:0;height:2px;background:var(--primary-color);bottom:-5px;left:50%;transform:translateX(-50%);transition:width .3s ease}.nav-links a:hover{color:#fff}.nav-links a:hover::after{width100%}
.burger{display:none;cursor:pointer;transition:opacity 0.3s ease}.burger div{width:25px;height:3px;background-color:var(--text-color);margin:5px;transition:all .3s ease}
body.menu-open .burger { opacity: 0; pointer-events: none; }
.nav-close-btn { display: none; position: absolute; top: 25px; right: 25px; background: transparent; border: none; color: #fff; font-size: 2.5rem; cursor: pointer; line-height: 1; z-index: 2002; }

/* Page Header & Meta - Pre-reserved Space */
.page-header-section{text-align:left;padding:3rem 0 1.5rem;max-width:var(--content-width);margin:0 auto; min-height: 200px;}
/* Breadcrumbs height reserved */
.breadcrumbs{font-size:.9rem;color:var(--text-color-secondary);margin-bottom:1rem;text-transform:capitalize; min-height: 1.5em; display:block; line-height: 1.5;}
.page-title{font-size:clamp(2rem,5vw,3rem);font-weight:700;margin-bottom:.8rem;line-height:1.2;color:#fff; min-height: 1.2em;}
/* Meta container reserved */
.page-meta{font-size:.95rem;color:var(--text-color-secondary);margin-bottom:2rem;display:flex;align-items:center;gap:12px;flex-wrap:wrap; min-height: 34px; line-height: 1.5;}
.page-meta img.auth-tiny{width:32px;height:32px;border-radius:50%;object-fit:cover;border:1px solid var(--primary-color); background-color: #333; aspect-ratio: 1/1;}

/* Featured Image - STRICT 1200x628 Aspect Ratio (1.91:1) */
.featured-image-container {
    max-width: var(--content-width);
    margin: 0 auto 2.5rem;
    position: relative;
    width: 100%;
    /* Modern browsers use aspect-ratio to reserve space immediately */
    aspect-ratio: 1200 / 628;
    overflow: hidden;
    border-radius: 8px;
    background: #1a1a1a;
    display: block;
}

/* Fallback for browsers not supporting aspect-ratio - The Padding Hack (628/1200 = 52.33%) */
@supports not (aspect-ratio: 1200 / 628) {
    .featured-image-container {
        height: 0;
        padding-bottom: 52.3333%; 
    }
}

.featured-image {
    width: 100%;
    height: 100%;
    object-fit: cover;
    display: block;
    box-shadow: 0 8px 25px rgba(0,0,0,.3);
    border: 1px solid #333;
}

/* Ensure absolute positioning if padding hack is active */
@supports not (aspect-ratio: 1200 / 628) {
    .featured-image {
        position: absolute;
        top: 0;
        left: 0;
    }
}

/* Content Area */
.article-container{max-width:var(--content-width);margin:0 auto 4rem;min-height:50vh}
.article-container h2{font-size:1.9rem;font-weight:600;margin-top:2.5rem;margin-bottom:1rem;color:#fff;border-left:4px solid var(--primary-color);padding-left:15px;line-height:1.3}
.article-container h3{font-size:1.5rem;font-weight:600;margin-top:2rem;margin-bottom:1rem;color:#fff}
.article-container p{margin-bottom:1.5rem;font-size:1.15rem;color:#d6d6d6;line-height:1.8}
.article-container ul,.article-container ol{margin-left:2rem;margin-bottom:1.5rem}.article-container li{margin-bottom:.75rem;padding-left:.5rem;color:#d6d6d6;font-size:1.1rem}.article-container strong{color:var(--primary-color);font-weight:600}
.article-container img{max-width:100%;height:auto;border-radius:8px;margin:2rem 0;display:block}
.article-container iframe{max-width:100%}
.article-container blockquote{border-left:4px solid var(--primary-color);background:#1a1a1a;padding:1.5rem;margin:1.5rem 0;font-style:italic;color:#e0e0e0;border-radius:0 8px 8px 0}

/* Author Box */
.author-bio{margin-top:4rem;padding:2rem;background-color:var(--surface-color);border-radius:12px;display:flex;align-items:center;gap:1.5rem;border:1px solid #333}
.author-bio img{width:100px;height:100px;border-radius:50%;object-fit:cover;border:2px solid var(--primary-color); background: #333; aspect-ratio: 1/1;}
.author-bio h3{margin:0 0 .5rem;font-size:1.4rem;color:#fff}.author-bio p{font-size:.95rem;color:var(--text-color-secondary);margin-bottom:1rem}
.author-socials-list a{color:var(--text-color-secondary);font-size:1.2rem;margin-right:10px}
.author-socials-list a:hover{color:var(--primary-color)}

/* Footer */
.site-footer{background-color:#0c0c0c;color:var(--text-color-secondary);padding:3rem 5%;margin-top:4rem;border-top:1px solid #2a2a2a}
.footer-container{display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:2rem;margin-bottom:2rem}
.footer-nav a{color:var(--text-color-secondary);margin-right:1.5rem}.footer-nav a:hover{color:var(--primary-color)}
.footer-social a{color:var(--text-color-secondary);font-size:1.4rem;margin-left:1rem}.footer-social a:hover{color:var(--primary-color)}
.footer-bottom{text-align:center;padding-top:2rem;border-top:1px solid #2a2a2a;font-size:.9rem}

/* Animation */
[data-animate]{opacity:0;transition:opacity .6s ease-out,transform .6s ease-out}.article-container [data-animate]{transform:translateY(30px)}[data-animate].is-visible{opacity:1;transform:translateY(0)}

/* Mobile Menu Overlay */
@media screen and (max-width:768px){
    .nav-links{
        position:fixed;top:0;right:0;width:100%;height:100vh;
        background:rgba(18,18,18,0.98);backdrop-filter:blur(10px);
        display:flex;flex-direction:column;align-items:center;justify-content:center;
        transform:translateX(100%);transition:transform 0.4s cubic-bezier(0.4, 0, 0.2, 1);
        z-index:2000;will-change:transform;
        gap: 2rem;
    }
    .nav-links.nav-active{transform:translateX(0)}
    .nav-links li{margin:0;opacity:0;transform:translateY(20px);transition:all 0.4s ease 0.1s}
    .nav-links.nav-active li{opacity:1;transform:translateY(0)}
    .nav-links a{font-size:1.5rem;font-weight:700}
    
    .burger{display:block;z-index:2001}
    .nav-close-btn{display:block}
    .page-title{font-size:2rem}
    .author-bio{flex-direction:column;text-align:center}
    .footer-container{flex-direction:column;align-items:flex-start}
}

/* Ads */
.ad-unit{margin:2rem auto;text-align:center;clear:both;max-width:100%;overflow:hidden;background:transparent;display:flex;align-items:center;justify-content:center}
.ad-sticky-left{position:fixed;top:100px;left:10px;width:160px;height:600px;z-index:90}
.ad-sticky-right{position:fixed;top:100px;right:10px;width:160px;height:600px;z-index:90}
.ad-sticky-footer{position:fixed;bottom:0;left:0;width:100%;background:#000;z-index:999;display:flex;flex-direction:column;align-items:center;padding:10px;border-top:1px solid #333}
.ad-close{align-self:flex-end;background:#333;color:#fff;border:1px solid #555;cursor:pointer;padding:2px 8px;font-size:12px;margin-bottom:5px}
@media(max-width:1200px){.ad-sticky-left,.ad-sticky-right{display:none}}
@media(max-width:768px){.ad-sticky-footer{height:auto;padding:5px}.ad-sticky-footer img{max-width:100%;height:auto}}
`,
    // 2. JS UTILS - CLEANED (Removed CLS-causing logic)
    "assets/js/article.js": `
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
`
};

const state = {
    token: null, owner: null, repo: null,
    currentType: 'post', currentSlug: null, currentSha: null,
    settings: {}, settingsSha: null,
    contentIndex: [], indexSha: null
};

// --- INIT ---
document.addEventListener('DOMContentLoaded', () => {
    const t = localStorage.getItem('gh_token');
    const o = localStorage.getItem('gh_owner');
    const r = localStorage.getItem('gh_repo');

    if (t && o && r) {
        state.token = t; state.owner = o; state.repo = r;
        initApp();
    } else {
        document.getElementById('login-view').classList.add('active');
        document.getElementById('app-view').classList.remove('active');
    }
    
    setupSidebarEvents();
    setupSidebarUpload();
    setupFeaturedImageDrop();
    setInterval(handleAutoSave, 5000);
    setupUnsavedWarning();
});

function setupUnsavedWarning() {
    window.addEventListener('beforeunload', (e) => {
        if(tinymce.activeEditor && tinymce.activeEditor.isDirty()) {
            e.preventDefault();
            e.returnValue = ''; // Chrome requires this
        }
    });
}

async function initApp() {
    document.getElementById('login-view').classList.remove('active');
    document.getElementById('app-view').classList.add('active');
    
    showLoader(true, "Initializing...");
    await ensureSystemFiles();
    
    showLoader(true, "Loading Data...");
    await Promise.all([loadGlobalSettings(), loadContentIndex()]);
    
    switchPanel('dashboard');
    showLoader(false);
}

async function ensureSystemFiles() {
    for (const [path, content] of Object.entries(SYSTEM_ASSETS)) {
        const sha = await getLatestFileSha(path);
        await githubReq(`contents/${path}`, 'PUT', { message: `Update ${path}`, content: b64EncodeUnicode(content), sha: sha });
    }
}

// --- CONTENT INDEX (DB) ---
async function loadContentIndex() {
    try {
        const res = await githubReq('contents/_cms/index.json');
        if (res) {
            const data = await res.json();
            state.indexSha = data.sha;
            state.contentIndex = JSON.parse(b64DecodeUnicode(data.content));
        } else state.contentIndex = [];
    } catch(e) { state.contentIndex = []; }
}

async function updateContentIndex(slug, type, title, action = 'update') {
    const now = new Date().toISOString();
    const idx = state.contentIndex.findIndex(i => i.slug === slug && i.type === type);
    
    if (action === 'delete') {
        if (idx > -1) state.contentIndex.splice(idx, 1);
    } else {
        const originalDate = (idx > -1) ? state.contentIndex[idx].date : now;
        const entry = { slug, type, title, date: originalDate, modified: now };
        if (idx > -1) state.contentIndex[idx] = entry;
        else state.contentIndex.unshift(entry);
    }

    const body = { message: 'Update Index', content: b64EncodeUnicode(JSON.stringify(state.contentIndex, null, 2)) };
    if (state.indexSha) body.sha = state.indexSha;
    const res = await githubReq('contents/_cms/index.json', 'PUT', body);
    state.indexSha = (await res.json()).content.sha;
}

// --- NAV & SIDEBAR ---
function switchPanel(id) {
    document.querySelectorAll('.panel').forEach(p => p.classList.remove('active'));
    document.getElementById(`panel-${id}`).classList.add('active');
    document.querySelectorAll('.nav-item').forEach(b => b.classList.remove('active'));
    const navId = `nav-btn-${id}`;
    if(document.getElementById(navId)) document.getElementById(navId).classList.add('active');

    if(id === 'dashboard') loadList('post');
    if(id === 'pages') loadList('page');
}

function switchSidebarTab(tabName) {
    document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
    document.querySelectorAll('.sidebar-content').forEach(c => c.classList.remove('active'));
    document.getElementById(`tab-btn-${tabName}`).classList.add('active');
    document.getElementById(`tab-${tabName}`).classList.add('active');
}

function setupSidebarEvents() {
    document.getElementById('sidebar-toggle-btn').addEventListener('click', () => {
        document.getElementById('main-sidebar').classList.toggle('collapsed');
        if(window.innerWidth <= 768) {
           document.getElementById('main-sidebar').classList.toggle('active-mobile');
        }
    });
}

// --- API ---
document.getElementById('login-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const t = document.getElementById('gh-token').value.trim();
    const o = document.getElementById('gh-owner').value.trim();
    const r = document.getElementById('gh-repo').value.trim();
    try {
        const res = await fetch(`https://api.github.com/repos/${o}/${r}`, { headers: { Authorization: `Bearer ${t}` } });
        if (!res.ok) throw new Error('Invalid Credentials');
        localStorage.setItem('gh_token', t); localStorage.setItem('gh_owner', o); localStorage.setItem('gh_repo', r);
        state.token = t; state.owner = o; state.repo = r;
        initApp();
    } catch (err) { showToast(err.message, true); }
});

document.getElementById('nav-logout').addEventListener('click', () => { localStorage.clear(); location.reload(); });

async function githubReq(endpoint, method = 'GET', body = null) {
    const url = `https://api.github.com/repos/${state.owner}/${state.repo}/${endpoint}${method === 'GET' ? '?t='+Date.now() : ''}`;
    const opts = { method, headers: { Authorization: `Bearer ${state.token}`, Accept: 'application/vnd.github.v3+json', 'Content-Type': 'application/json' } };
    if (body) opts.body = JSON.stringify(body);
    const res = await fetch(url, opts);
    if (!res.ok && method === 'GET' && res.status === 404) return null;
    if (!res.ok) throw new Error((await res.json()).message || 'API Error');
    return res;
}
async function getLatestFileSha(path) {
    try { const res = await githubReq(`contents/${path}`); return res ? (await res.json()).sha : null; } catch (e) { return null; }
}

// --- SETTINGS ---
async function loadGlobalSettings() {
    try {
        const res = await githubReq('contents/_cms/settings.json');
        if(res) {
            const data = await res.json();
            state.settingsSha = data.sha;
            state.settings = JSON.parse(b64DecodeUnicode(data.content));
        }
        populateSettingsForm();
    } catch(e) {}
}

function populateSettingsForm() {
    const s = state.settings || {};
    document.getElementById('set-site-title').value = s.siteTitle || '';
    document.getElementById('set-site-url').value = s.siteUrl || '';
    document.getElementById('set-favicon').value = s.favicon || '';
    document.getElementById('set-copyright').value = s.copyright || '';
    document.getElementById('set-ga-id').value = s.gaId || '';
    document.getElementById('set-adsense-auto').value = s.adsenseAuto || '';
    document.getElementById('set-custom-css').value = s.customCss || '';
    document.getElementById('set-custom-head-js').value = s.customHeadJs || '';
    document.getElementById('set-404-redirect').checked = s.enable404 || false;
    
    const vContainer = document.getElementById('meta-verify-container'); 
    if(vContainer) {
        vContainer.innerHTML = '';
        (s.verifications || []).forEach(v => addMetaVerifyItem(v));
    }

    renderRepeater('header-menu-container', s.headerMenu, 'menu');
    renderRepeater('footer-menu-container', s.footerMenu, 'menu');
    renderRepeater('social-links-container', s.socialLinks, 'social');
    
    // Authors
    const aContainer = document.getElementById('authors-repeater-container');
    if(aContainer) {
        aContainer.innerHTML = '';
        (s.authors || []).forEach(a => addAuthorItem(a));
    }

    const adContainer = document.getElementById('ads-repeater-container');
    if(adContainer) {
        adContainer.innerHTML = '';
        (s.ads || []).forEach(ad => addAdUnit(ad));
    }
}

async function saveGlobalSettings() {
    showLoader(true, "Saving Settings...");
    let siteUrl = document.getElementById('set-site-url').value.trim();
    if(siteUrl && siteUrl.endsWith('/')) siteUrl = siteUrl.slice(0, -1); 

    const s = {
        siteTitle: document.getElementById('set-site-title').value,
        siteUrl: siteUrl,
        favicon: document.getElementById('set-favicon').value,
        copyright: document.getElementById('set-copyright').value,
        enable404: document.getElementById('set-404-redirect').checked,
        gaId: document.getElementById('set-ga-id').value,
        adsenseAuto: document.getElementById('set-adsense-auto').value,
        customCss: document.getElementById('set-custom-css').value,
        customHeadJs: document.getElementById('set-custom-head-js').value,
        verifications: collectRepeater('meta-verify-container', 'meta'),
        headerMenu: collectRepeater('header-menu-container', 'menu'),
        footerMenu: collectRepeater('footer-menu-container', 'menu'),
        socialLinks: collectRepeater('social-links-container', 'social'),
        authors: [],
        ads: []
    };
    
    // Collect Authors with Dynamic Socials
    document.querySelectorAll('.author-card').forEach(b => {
        const id = b.dataset.id;
        const socials = [];
        b.querySelectorAll(`#nested-socials-${id} .mini-row`).forEach(row => {
            socials.push({
                icon: row.querySelector('.mini-icon').value,
                link: row.querySelector('.mini-link').value
            });
        });

        s.authors.push({
            id: id,
            name: b.querySelector('.auth-name').value,
            image: b.querySelector('.auth-img').value,
            bio: b.querySelector('.auth-bio').value,
            socials: socials 
        });
    });

    document.querySelectorAll('.ad-unit-block').forEach(b => {
        s.ads.push({
            code: b.querySelector('.ad-code-input').value,
            placement: b.querySelector('.ad-place-input').value,
            exclude: b.querySelector('.ad-exclude-input').value
        });
    });

    state.settings = s;

    try {
        const body = { message: 'Update Settings', content: b64EncodeUnicode(JSON.stringify(s, null, 2)) };
        if(state.settingsSha) body.sha = state.settingsSha;
        const res = await githubReq('contents/_cms/settings.json', 'PUT', body);
        state.settingsSha = await res.json().then(d => d.content.sha);

        if(s.enable404) {
            const sha404 = await getLatestFileSha('contents/404.html');
            const html404 = `<!DOCTYPE html><html><head><meta http-equiv="refresh" content="0; url=${s.siteUrl}/"></head><body>Redirecting...</body></html>`;
            await githubReq('contents/404.html', 'PUT', { message: 'Up 404', content: b64EncodeUnicode(html404), sha: sha404 });
        }
        showToast('Settings Saved!');
    } catch(e) { showToast(e.message, true); }
    finally { showLoader(false); }
}

// --- LISTS ---
async function loadList(type) {
    const tbody = document.getElementById(type === 'post' ? 'posts-list-body' : 'pages-list-body');
    tbody.innerHTML = '<tr><td colspan="4">Loading...</td></tr>';
    const items = state.contentIndex.filter(i => i.type === type).sort((a,b) => new Date(b.date) - new Date(a.date));
    if (items.length === 0) { await crawlAndRebuildIndex(type); return; }
    renderTableRows(tbody, items, type);
}

async function crawlAndRebuildIndex(type) {
    try {
        const endpoint = type === 'post' ? 'contents/blog' : 'contents';
        const res = await githubReq(endpoint);
        if(!res) { renderTableRows(document.getElementById(type === 'post' ? 'posts-list-body' : 'pages-list-body'), [], type); return; }
        const data = await res.json();
        const restricted = ['blog', 'images', 'admin', 'css', 'js', '.git', '_cms', 'assets', '404.html', 'index.html'];
        data.filter(item => item.type === 'dir' && !restricted.includes(item.name)).forEach(f => {
            if (!state.contentIndex.find(i => i.slug === f.name)) {
                state.contentIndex.push({ slug: f.name, type: type, title: f.name, date: new Date().toISOString() });
            }
        });
        renderTableRows(document.getElementById(type === 'post' ? 'posts-list-body' : 'pages-list-body'), state.contentIndex.filter(i => i.type === type), type);
    } catch(e) {}
}

function renderTableRows(tbody, items, type) {
    let html = '';
    items.forEach(f => {
        const safeTitle = f.title.replace(/</g, "&lt;").replace(/>/g, "&gt;");
        const liveLink = type === 'post' ? `../blog/${f.slug}/` : `../${f.slug}/`;
        const dateStr = new Date(f.date).toLocaleDateString() + ' ' + new Date(f.date).toLocaleTimeString([], {hour:'2-digit', minute:'2-digit'});
        html += `<tr><td><input type="checkbox" class="chk-${type}" value="${f.slug}" onchange="toggleBulkBtn('${type}')"></td><td><strong>${safeTitle}</strong><br><small style="color:#666">/${f.slug}</small></td><td style="font-size:0.8rem">${dateStr}</td><td><a href="${liveLink}" target="_blank" class="btn-secondary btn-xs"><i class="fa-solid fa-eye"></i></a> <button class="btn-primary btn-xs" onclick="editContent('${type}', '${f.slug}')"><i class="fa-solid fa-pen"></i></button> <button class="btn-danger btn-xs" onclick="deleteContent('${type}', '${f.slug}')"><i class="fa-solid fa-trash"></i></button></td></tr>`;
    });
    tbody.innerHTML = html || '<tr><td colspan="4">Empty.</td></tr>';
}

function toggleAll(tbodyId, master) { document.querySelectorAll(`#${tbodyId} input[type="checkbox"]`).forEach(c => c.checked = master.checked); toggleBulkBtn(tbodyId.includes('post') ? 'post' : 'page'); }
function toggleBulkBtn(type) { document.getElementById(`bulk-del-${type}s`).classList.toggle('hidden', document.querySelectorAll(`.chk-${type}:checked`).length === 0); }
function filterTable(tbodyId, q) { const rows = document.getElementById(tbodyId).getElementsByTagName('tr'); for(let r of rows) r.style.display = r.textContent.toLowerCase().includes(q.toLowerCase()) ? '' : 'none'; }

// --- EDITOR ---
function createNew(type) {
    state.currentType = type; state.currentSlug = null; state.currentSha = null;
    document.getElementById('meta-title').value = '';
    document.getElementById('meta-slug').value = '';
    document.getElementById('meta-desc').value = '';
    document.getElementById('meta-banner').value = '';
    document.getElementById('banner-preview').classList.add('hidden');
    document.getElementById('schema-container').innerHTML = '';
    document.getElementById('live-link-container').classList.add('hidden');
    
    // Populate Authors
    const authSel = document.getElementById('meta-author-select'); authSel.innerHTML = '';
    (state.settings.authors || []).forEach(a => {
        authSel.insertAdjacentHTML('beforeend', `<option value="${a.id}">${a.name}</option>`);
    });

    addDefaultArticleSchema(true);
    switchPanel('editor');
    initTinyMCE(() => { if(tinymce.activeEditor) tinymce.activeEditor.setContent(''); });
    document.getElementById('meta-title').oninput = function() { if(!state.currentSlug) document.getElementById('meta-slug').value = slugify(this.value); };
    switchSidebarTab('settings');
}

async function editContent(type, slug) {
    showLoader(true, "Loading...");
    state.currentType = type; state.currentSlug = slug;
    try {
        const path = type === 'post' ? `blog/${slug}/index.html` : `${slug}/index.html`;
        const res = await githubReq(`contents/${path}`);
        if(!res) throw new Error("Not Found");
        const data = await res.json();
        state.currentSha = data.sha;
        
        const doc = new DOMParser().parseFromString(b64DecodeUnicode(data.content), 'text/html');
        const title = doc.querySelector('title')?.innerText.split(' - ')[0] || '';
        document.getElementById('meta-title').value = title;
        document.getElementById('meta-slug').value = slug;
        document.getElementById('meta-desc').value = doc.querySelector('meta[name="description"]')?.content || '';
        const img = doc.querySelector('meta[property="og:image"]')?.content || '';
        document.getElementById('meta-banner').value = img;
        if(img) { document.getElementById('banner-preview').src = img; document.getElementById('banner-preview').classList.remove('hidden'); }

        const authSel = document.getElementById('meta-author-select'); authSel.innerHTML = '';
        (state.settings.authors || []).forEach(a => {
            authSel.insertAdjacentHTML('beforeend', `<option value="${a.id}">${a.name}</option>`);
        });
        const currentAuthorName = doc.querySelector('.author-details strong')?.innerText || "Admin";
        const matched = (state.settings.authors||[]).find(a => a.name === currentAuthorName);
        if(matched) authSel.value = matched.id;

        switchPanel('editor');
        const savedDraft = localStorage.getItem(`draft_${slug}`);
        let content = doc.querySelector('.article-container')?.innerHTML || '';
        
        const tempDiv = document.createElement('div');
        tempDiv.innerHTML = content;
        tempDiv.querySelectorAll('.ad-unit').forEach(el => el.remove());
        tempDiv.querySelectorAll('.author-bio').forEach(el => el.remove());
        content = tempDiv.innerHTML;

        if(savedDraft && savedDraft !== content) { 
             if(confirm('Restore unsaved draft?')) content = savedDraft; 
        }

        initTinyMCE(() => tinymce.activeEditor.setContent(content));
        
        document.getElementById('schema-container').innerHTML = '';
        const script = doc.querySelector('script[type="application/ld+json"]');
        let hasArticle = false;
        if(script) {
            const json = JSON.parse(script.innerText);
            (json['@graph'] || [json]).forEach(obj => {
                if(obj['@type'] === 'Article') hasArticle = true;
                else renderSchemaBlock(obj['@type'], obj);
            });
        }
        addDefaultArticleSchema(hasArticle);
        
        const url = resolveMenuLink((type==='post'?'blog/':'')+slug, state.settings.siteUrl);
        document.getElementById('live-link-container').innerHTML = `<a href="${url}" target="_blank" class="btn-secondary btn-xs" style="color:white;text-decoration:none;">View Live</a>`;
        document.getElementById('live-link-container').classList.remove('hidden');
    } catch(e) { showToast(e.message, true); switchPanel('dashboard'); }
    finally { showLoader(false); }
}

function handleAutoSave() {
    if(!tinymce.activeEditor || !document.getElementById('panel-editor').classList.contains('active')) return;
    const slug = document.getElementById('meta-slug').value;
    if(slug && tinymce.activeEditor.isDirty()) {
        localStorage.setItem(`draft_${slug}`, tinymce.activeEditor.getContent());
        document.getElementById('auto-draft-msg').innerText = "Draft Saved";
        setTimeout(()=>document.getElementById('auto-draft-msg').innerText='', 2000);
    }
}

// --- LINK HELPERS ---
function resolveMenuLink(link, siteUrl) {
    if(!link) return '#';
    // Strict external/protocol check
    if(link.match(/^https?:\/\//) || link.startsWith('mailto:') || link.startsWith('tel:') || link.startsWith('#')) return link;
    // Loose external check (if user types google.com)
    if(link.includes('.') && !link.startsWith('/')) return 'https://' + link;
    
    // Internal
    const base = siteUrl.endsWith('/') ? siteUrl.slice(0, -1) : siteUrl;
    let path = link;
    if(path.startsWith('/')) path = path.substring(1);
    if(!path.endsWith('/') && !path.includes('.')) path += '/';
    return `${base}/${path}`;
}

// FIX: Separate helper for Social Links to avoid appending site URL
function ensureExternalUrl(link) {
    if(!link) return '';
    if(link.match(/^https?:\/\//) || link.startsWith('mailto:') || link.startsWith('tel:')) return link;
    return 'https://' + link;
}

// --- PUBLISH ---
document.getElementById('save-btn').addEventListener('click', async () => {
    const title = document.getElementById('meta-title').value;
    const slug = document.getElementById('meta-slug').value;
    if(!title || !slug) return showToast("Title & Slug Required", true);
    
    showLoader(true, "Publishing...");
    const isPost = state.currentType === 'post';
    const folder = isPost ? `blog/${slug}` : `${slug}`;
    const path = `${folder}/index.html`;

    let contentHtml = tinymce.activeEditor.getContent();
    contentHtml = contentHtml.replace(/src="http:\/\//g, 'src="https://');
    contentHtml = injectAds(contentHtml, slug);

    const s = state.settings;
    const fullUrl = resolveMenuLink((isPost?'blog/':'')+slug, s.siteUrl);
    
    const assetPath = isPost ? '../../assets' : '../assets';
    const adminPath = isPost ? '../../admin' : '../admin';
    
    let bannerUrl = document.getElementById('meta-banner').value;
    if(bannerUrl.startsWith('http://')) bannerUrl = bannerUrl.replace('http://', 'https://');
    
    // Author Data
    const authId = document.getElementById('meta-author-select').value;
    const author = (s.authors || []).find(a => a.id === authId) || { name: 'Admin', bio: 'Editor', image: 'https://ui-avatars.com/api/?name=Admin', socials: [] };
    
    // Dynamic Author Socials
    let authSocialsHtml = '';
    if(author.socials && author.socials.length > 0) {
        authSocialsHtml = author.socials.map(soc => `<a href="${ensureExternalUrl(soc.link)}" aria-label="Social"><i class="${soc.icon}"></i></a>`).join('');
    } else {
        // Fallback
        if(author.twitter) authSocialsHtml += `<a href="${ensureExternalUrl(author.twitter)}" aria-label="Twitter"><i class="fa-brands fa-twitter"></i></a>`;
        if(author.linkedin) authSocialsHtml += `<a href="${ensureExternalUrl(author.linkedin)}" aria-label="LinkedIn"><i class="fa-brands fa-linkedin"></i></a>`;
        if(author.website) authSocialsHtml += `<a href="${ensureExternalUrl(author.website)}" aria-label="Website"><i class="fa-solid fa-globe"></i></a>`;
    }

    // CLS FIX: Explicit 1200x628 dimensions + fetchpriority for Zero Shift & Google Discover
    const featuredImgHtml = bannerUrl 
        ? `<div class="featured-image-container"><img src="${bannerUrl}" alt="${title}" width="1200" height="628" class="featured-image" fetchpriority="high" decoding="async"></div>` 
        : '';
    const preloadLink = bannerUrl ? `<link rel="preload" as="image" href="${bannerUrl}" fetchpriority="high">` : '';

    const headerLinks = (s.headerMenu || []).map(l => `<li><a href="${resolveMenuLink(l.link, s.siteUrl)}">${l.label}</a></li>`).join('');
    const footerLinks = (s.footerMenu || []).map(l => `<a href="${resolveMenuLink(l.link, s.siteUrl)}">${l.label}</a>`).join('');
    // Use ensureExternalUrl for global socials too
    const globalSocials = (s.socialLinks || []).map(l => `<a href="${ensureExternalUrl(l.link)}" aria-label="${l.label}"><i class="${l.label}"></i></a>`).join('');
    
    const entry = state.contentIndex.find(i => i.slug === slug && i.type === state.currentType);
    const datePublished = entry ? entry.date : new Date().toISOString();
    const dateModified = new Date().toISOString();

    // CLS FIX: CALCULATE READING TIME & DATE NOW (Write Time Strategy)
    const rawText = tinymce.activeEditor.getBody().textContent || "";
    const wpm = 225;
    const words = rawText.trim().split(/\s+/).length;
    const readTime = Math.ceil(words / wpm) + " Min Read";
    
    const dateObj = new Date(datePublished);
    const dateStr = dateObj.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
    
    // CLS FIX: GENERATE BREADCRUMBS NOW
    const breadcrumbHtml = isPost 
        ? `<a href="../" style="color:var(--text-color-secondary)">Blog</a> <span>/</span> ${slug.replace(/-/g, ' ')}` 
        : slug.replace(/-/g, ' ');

    const schemaJson = generateFinalSchema(fullUrl, title, bannerUrl, author.name, datePublished, dateModified);
    const breadCrumbDisplay = document.getElementById('include-breadcrumb-schema').checked ? '' : 'style="display:none"';

    const criticalCss = SYSTEM_ASSETS["assets/css/article.css"];

    const html = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${isPost ? title : title + ' - ' + s.siteTitle}</title>
    <meta name="description" content="${document.getElementById('meta-desc').value.replace(/"/g, '&quot;')}">
    <meta name="robots" content="max-image-preview:large">
    <link rel="icon" href="${s.favicon || ''}">
    <link rel="canonical" href="${fullUrl}">
    <meta property="og:title" content="${title.replace(/"/g, '&quot;')}">
    <meta property="og:image" content="${bannerUrl}">
    
    ${preloadLink}
    
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    
    <style>
      ${criticalCss}
      ${s.customCss || ''}
    </style>

    ${(s.verifications||[]).join('\n')}
    
    <link rel="stylesheet" href="${adminPath}/fontello.css" media="print" onload="this.media='all'">
    <noscript><link rel="stylesheet" href="${adminPath}/fontello.css"></noscript>

    ${s.customHeadJs || ''}
    ${s.adsenseAuto || ''}
    
    <script>
      const loadAnalytics = () => {
        const script = document.createElement('script');
        script.src = 'https://www.googletagmanager.com/gtag/js?id=${s.gaId}';
        script.async = true;
        document.head.appendChild(script);
        window.dataLayer = window.dataLayer || [];
        function gtag(){dataLayer.push(arguments);}
        gtag('js', new Date());
        gtag('config', '${s.gaId}');
      };
      if('${s.gaId}') {
        window.addEventListener('scroll', loadAnalytics, { once: true });
        window.addEventListener('mousemove', loadAnalytics, { once: true });
        window.addEventListener('touchstart', loadAnalytics, { once: true });
      }
    </script>
    <script type="application/ld+json">${schemaJson}</script>
</head>
<body>
    <div class="progress-bar" id="progressBar"></div>
    <header class="site-header">
        <nav>
            <a href="${s.siteUrl}" class="logo">${s.siteTitle}</a>
            <ul class="nav-links">${headerLinks}</ul>
            <div class="burger"><div class="line1"></div><div class="line2"></div><div class="line3"></div></div>
        </nav>
    </header>
    ${getAdCode('header_bottom', slug)}
    
    <main>
        <section class="page-header-section">
            <div class="breadcrumbs" ${breadCrumbDisplay}>
                 ${breadcrumbHtml}
            </div>
            <h1 class="page-title">${title}</h1>
            <div class="page-meta">
               <img src="${author.image}" class="auth-tiny" alt="author" width="32" height="32">
               <span>By ${author.name}</span> <span style="margin:0 5px">•</span> ${dateStr} <span style="margin:0 5px">•</span> ${readTime}
            </div>
        </section>

        ${featuredImgHtml}

        <article class="article-container">
            ${contentHtml}
            ${getAdCode('end', slug)}

            <section class="author-bio" data-animate>
                <img src="${author.image}" alt="${author.name}" width="100" height="100">
                <div class="author-details">
                    <h3>About The Author</h3>
                    <p><strong>${author.name}</strong> ${author.bio}</p>
                    <div class="author-socials-list">${authSocialsHtml}</div>
                </div>
            </section>
        </article>
    </main>

    <footer class="site-footer">
        <div class="footer-container">
            <nav class="footer-nav">${footerLinks}</nav>
            <div class="footer-social">${globalSocials}</div>
        </div>
        <div class="footer-bottom">
            <p>${s.copyright || ''}</p>
        </div>
    </footer>
    ${getStickyAds(slug)}
    <script src="${assetPath}/js/article.js" defer></script>
</body></html>`;

    // Saving process
    try {
        if(state.currentSlug && state.currentSlug !== slug) {
            const oldPath = isPost ? `blog/${state.currentSlug}/index.html` : `${state.currentSlug}/index.html`;
            const oldSha = await getLatestFileSha(oldPath);
            if(oldSha) {
                await githubReq(`contents/${oldPath}`, 'DELETE', { message: 'Move', sha: oldSha });
                await updateContentIndex(state.currentSlug, state.currentType, null, 'delete');
            }
            state.currentSha = null;
        }

        const freshSha = await getLatestFileSha(path);
        const body = { message: `Update ${slug}`, content: b64EncodeUnicode(html) };
        if(freshSha) body.sha = freshSha;
        else if(state.currentSha && state.currentSlug === slug) body.sha = state.currentSha;

        const res = await githubReq(`contents/${path}`, 'PUT', body);
        state.currentSha = (await res.json()).content.sha;
        state.currentSlug = slug;
        
        await updateContentIndex(slug, state.currentType, title, 'update');
        localStorage.removeItem(`draft_${slug}`);
        // Reset dirty state for the warning to work correctly next time
        if(tinymce.activeEditor) tinymce.activeEditor.setDirty(false);
        
        showToast("Published!");
        document.getElementById('live-link-container').innerHTML = `<a href="${fullUrl}" target="_blank" class="btn-secondary btn-xs" style="color:white;text-decoration:none;">View Live</a>`;
        document.getElementById('live-link-container').classList.remove('hidden');
    } catch(e) { showToast(e.message, true); }
    finally { showLoader(false); }
});

async function deleteContent(type, slug) {
    if(!confirm("Delete permanently?")) return;
    showLoader(true, "Deleting...");
    try {
        const path = type === 'post' ? `blog/${slug}/index.html` : `${slug}/index.html`;
        const sha = await getLatestFileSha(path);
        if(sha) {
            await githubReq(`contents/${path}`, 'DELETE', { message: `Delete ${slug}`, sha });
            await updateContentIndex(slug, type, null, 'delete');
            loadList(type);
        }
    } catch(e) { showToast(e.message, true); }
    finally { showLoader(false); }
}

async function bulkDelete(type) {
    const checked = Array.from(document.querySelectorAll(`.chk-${type}:checked`)).map(c => c.value);
    if(!checked.length || !confirm(`Delete ${checked.length} items?`)) return;
    showLoader(true, "Bulk Deleting...");
    for(const slug of checked) {
        const path = type === 'post' ? `blog/${slug}/index.html` : `${slug}/index.html`;
        const sha = await getLatestFileSha(path);
        if(sha) {
            await githubReq(`contents/${path}`, 'DELETE', { message: `Bulk Del ${slug}`, sha });
            await updateContentIndex(slug, type, null, 'delete');
        }
    }
    showLoader(false);
    loadList(type);
}

// --- ADS ---
function getAdCode(place, slug) {
    const ads = state.settings.ads || [];
    const ad = ads.find(a => a.placement === place && !isExcluded(a, slug));
    if(ad && ad.code && ad.code.trim().length > 0) return `<div class="ad-unit">${ad.code}</div>`;
    return '';
}
function getStickyAds(slug) {
    const ads = state.settings.ads || [];
    let html = '';
    const l = ads.find(a => a.placement === 'sticky_left' && !isExcluded(a, slug));
    if(l && l.code.trim()) html += `<div class="ad-sticky-left">${l.code}</div>`;
    const r = ads.find(a => a.placement === 'sticky_right' && !isExcluded(a, slug));
    if(r && r.code.trim()) html += `<div class="ad-sticky-right">${r.code}</div>`;
    const f = ads.find(a => a.placement === 'sticky_footer' && !isExcluded(a, slug));
    if(f && f.code.trim()) html += `<div class="ad-sticky-footer" id="stky-ftr"><button class="ad-close" onclick="document.getElementById('stky-ftr').remove()">Close X</button>${f.code}</div>`;
    return html;
}
function isExcluded(ad, slug) { return ad.exclude && ad.exclude.split(',').map(s=>s.trim()).includes(slug); }
function injectAds(html, slug) {
    const ads = state.settings.ads || [];
    let modified = html;
    ads.forEach(ad => {
        if(isExcluded(ad, slug)) return;
        if(!ad.code || !ad.code.trim()) return; 
        if(ad.placement.startsWith('after_p_')) {
            const pNum = parseInt(ad.placement.split('_')[2]);
            let count = 0;
            modified = modified.replace(/<\/p>/g, (match) => { count++; return count === pNum ? match + `<div class="ad-unit">${ad.code}</div>` : match; });
        }
    });
    return modified;
}

// --- SCHEMA & MEDIA ---
function addSchemaBlock() { renderSchemaBlock(document.getElementById('add-schema-type').value); }
function renderSchemaBlock(type, data={}) {
    const c=document.getElementById('schema-container'); const id='s-'+Date.now();
    let html=`<div class="schema-block" data-type="${type}"><div class="block-header"><span>${type}</span><button class="remove-schema-btn" onclick="this.closest('.schema-block').remove()">Remove</button></div>`;
    if(type==='HowTo') html+=`<div class="schema-row"><div><label>Name</label><input class="schema-input" data-key="name" value="${data.name||''}"></div><div><label>Time (PTxMx)</label><input class="schema-input" data-key="time" value="${data.totalTime||'PT10M'}"></div></div><div class="schema-full-row"><label>Supplies (comma sep)</label><input class="schema-input" data-key="supplies" value="${(data.supply||[]).join(', ')||''}"></div><div class="schema-full-row"><label>Tools (comma sep)</label><input class="schema-input" data-key="tools" value="${(data.tool||[]).join(', ')||''}"></div><div class="repeater-container" id="${id}-steps"></div><button class="add-repeater-btn" onclick="addStepItem('${id}-steps')">+ Step</button>`;
    else if(type==='Review') html+=`<div class="schema-row"><div><label>Item Name</label><input class="schema-input" data-key="item" value="${data.itemReviewed?.name||''}"></div><div><label>Rating (1-5)</label><input class="schema-input" data-key="rating" value="${data.reviewRating?.ratingValue||''}"></div></div><div class="schema-full-row"><label>Review Body</label><textarea class="schema-input" data-key="body">${data.reviewBody||''}</textarea></div>`;
    else if(type==='Product') html+=`<div class="schema-row"><div><label>Name</label><input class="schema-input" data-key="name" value="${data.name||''}"></div><div><label>Brand</label><input class="schema-input" data-key="brand" value="${data.brand?.name||''}"></div></div><div class="schema-row"><div><label>Price</label><input class="schema-input" data-key="price" value="${data.offers?.price||''}"></div><div><label>Currency</label><input class="schema-input" data-key="currency" value="${data.offers?.priceCurrency||'USD'}"></div></div>`;
    else if(type==='FAQPage') html+=`<div class="repeater-container" id="${id}"></div><button class="add-repeater-btn" onclick="addFaqItem('${id}')">+ FAQ</button>`;
    html+='</div>'; c.insertAdjacentHTML('beforeend', html);
    if(type==='FAQPage' && data.mainEntity) data.mainEntity.forEach(q=>addFaqItem(id,q.name,q.acceptedAnswer?.text));
    if(type==='HowTo' && data.step) data.step.forEach(s=>addStepItem(`${id}-steps`,s.text));
}
function addFaqItem(id,q='',a='') { document.getElementById(id).insertAdjacentHTML('beforeend', `<div class="repeater-item"><button class="repeater-remove" onclick="this.parentElement.remove()">x</button><div><label class="schema-label">Q</label><input class="schema-input faq-q" value="${q.replace(/"/g,'&quot;')}"></div><div><label class="schema-label">A</label><textarea class="schema-input faq-a">${a}</textarea></div></div>`); }
function addStepItem(id, t='') { document.getElementById(id).insertAdjacentHTML('beforeend', `<div class="repeater-item"><button class="repeater-remove" onclick="this.parentElement.remove()">x</button><div><label class="schema-label">Step</label><textarea class="schema-input step-text">${t}</textarea></div></div>`); }
function addDefaultArticleSchema(checked) { document.getElementById('schema-container').insertAdjacentHTML('afterbegin', `<div class="schema-block default-block"><div class="block-header"><span>Article Schema</span><label class="switch-label"><input type="checkbox" id="include-article-schema" ${checked?'checked':''}><span class="chk-text">Enable</span></label></div></div>`); }

function generateFinalSchema(url, headline, image, authName, datePublished, dateModified) {
    const graph = [];
    if(document.getElementById('include-article-schema').checked) graph.push({"@type": "Article", "headline": headline, "image": [image], "author": { "@type": "Person", "name": authName }, "datePublished": datePublished, "dateModified": dateModified });
    if(document.getElementById('include-breadcrumb-schema').checked) graph.push({"@type": "BreadcrumbList", "itemListElement": [{"@type":"ListItem","position":1,"name":"Home","item":state.settings.siteUrl},{"@type":"ListItem","position":2,"name":"Blog","item":state.settings.siteUrl+"/blog/"},{"@type":"ListItem","position":3,"name":headline,"item":url}]});
    
    document.querySelectorAll('.schema-block:not(.default-block)').forEach(b => {
        const type = b.dataset.type;
        let obj = { "@type": type };
        if(type === 'FAQPage') obj.mainEntity = Array.from(b.querySelectorAll('.repeater-item')).map(r=>({"@type":"Question","name":r.querySelector('.faq-q').value,"acceptedAnswer":{"@type":"Answer","text":r.querySelector('.faq-a').value}}));
        else if(type === 'Review') { obj.itemReviewed={ "@type": "Thing", "name": b.querySelector('[data-key="item"]').value }; obj.reviewRating={ "@type": "Rating", "ratingValue": b.querySelector('[data-key="rating"]').value }; obj.reviewBody=b.querySelector('[data-key="body"]').value; }
        else if(type === 'Product') { obj.name=b.querySelector('[data-key="name"]').value; obj.brand={ "@type": "Brand", "name": b.querySelector('[data-key="brand"]').value }; obj.offers={ "@type": "Offer", "price": b.querySelector('[data-key="price"]').value, "priceCurrency": b.querySelector('[data-key="currency"]').value }; }
        else if(type === 'HowTo') { obj.name=b.querySelector('[data-key="name"]').value; obj.totalTime=b.querySelector('[data-key="time"]').value; obj.supply=b.querySelector('[data-key="supplies"]').value.split(',').map(s=>({"@type":"HowToSupply","name":s.trim()})); obj.tool=b.querySelector('[data-key="tools"]').value.split(',').map(s=>({"@type":"HowToTool","name":s.trim()})); obj.step=Array.from(b.querySelectorAll('.step-text')).map(s=>({"@type":"HowToStep","text":s.value})); }
        graph.push(obj);
    });
    return JSON.stringify({ "@context": "https://schema.org", "@graph": graph }, null, 4);
}

// --- UTILS ---
function initTinyMCE(cb) { 
    if(tinymce.get('tinymce-editor')) tinymce.get('tinymce-editor').remove(); 
    tinymce.init({ 
        selector: '#tinymce-editor', 
        skin: 'oxide-dark', 
        content_css: 'dark', 
        height: '100%', 
        plugins: 'preview searchreplace autolink autosave save directionality code visualblocks visualchars fullscreen image link media template codesample table charmap pagebreak nonbreaking anchor insertdatetime advlist lists wordcount help charmap quickbars emoticons', 
        toolbar: 'undo redo | blocks | bold italic | align | bullist numlist | link image media | code', 
        setup: (e) => { e.on('init', cb); e.on('change', () => e.save()); } 
    }); 
}
function showToast(m,e){const t=document.getElementById('toast');t.innerText=m;t.style.borderLeftColor=e?'red':'#00aaff';t.classList.add('show');setTimeout(()=>t.classList.remove('show'),3000)}
function showLoader(v,t){document.getElementById('loading-overlay').classList.toggle('hidden',!v); if(t)document.getElementById('loading-text').innerText=t;}
function slugify(t){return t.toLowerCase().replace(/[^\w-]+/g,'-')}
function b64EncodeUnicode(str){return btoa(encodeURIComponent(str).replace(/%([0-9A-F]{2})/g,(m,p1)=>String.fromCharCode('0x'+p1)))}
function b64DecodeUnicode(str){return decodeURIComponent(atob(str).split('').map(c=>'%'+('00'+c.charCodeAt(0).toString(16)).slice(-2)).join(''))}
function exitEditor(){switchPanel(state.currentType==='post'?'dashboard':'pages')}

// UI Repeaters
function renderRepeater(id, data, type) {
    const c = document.getElementById(id); 
    if(!c) return; 
    c.innerHTML = '';
    (data || []).forEach(item => {
        if(type === 'menu') addMenuItem(id, item.label, item.link);
        else if(type === 'social') addSocialItem(item.label, item.link);
    });
}
function collectRepeater(id, type) {
    const items = [];
    const container = document.getElementById(id);
    if(!container) return []; 
    if(type === 'meta') { container.querySelectorAll('.meta-tag-input').forEach(i => { if(i.value) items.push(i.value); }); return items; }
    container.querySelectorAll('.repeater-item').forEach(d => {
        if(type === 'menu' || type === 'social') items.push({ label: d.querySelector('.item-label').value, link: d.querySelector('.item-link').value });
    });
    return items;
}
function addMetaVerifyItem(val='') { 
    const c = document.getElementById('meta-verify-container');
    if(c) c.insertAdjacentHTML('beforeend', `<div class="repeater-item meta-item-row"><button class="repeater-remove" onclick="this.parentElement.remove()">x</button><input class="schema-input meta-tag-input" value='${val}' placeholder='<meta name="..." content="...">'></div>`); 
}
function addMenuItem(id, l='', u='') { 
    const c = document.getElementById(id);
    if(c) c.insertAdjacentHTML('beforeend', `<div class="repeater-item"><button class="repeater-remove" onclick="this.parentElement.remove()">x</button><div class="menu-row"><input class="schema-input item-label" value="${l}" placeholder="Label"><input class="schema-input item-link" value="${u}" placeholder="Slug or https://..."></div></div>`); 
}
function addSocialItem(l='', u='') { 
    const c = document.getElementById('social-links-container');
    if(c) c.insertAdjacentHTML('beforeend', `<div class="repeater-item"><button class="repeater-remove" onclick="this.parentElement.remove()">x</button><div class="social-row"><input class="schema-input item-label" value="${l}" placeholder="icon class (fa-brands fa-twitter)"><input class="schema-input item-link" value="${u}" placeholder="URL"></div></div>`); 
}
function addAdUnit(d={}) { 
    const c = document.getElementById('ads-repeater-container');
    if(c) c.insertAdjacentHTML('beforeend', `<div class="ad-unit-block"><button class="ad-remove-btn" onclick="this.parentElement.remove()"><i class="fa-solid fa-trash"></i></button><label class="schema-label">Ad Code</label><textarea class="schema-input ad-code-input" rows="2">${d.code||''}</textarea><div class="ad-meta-row"><div><select class="schema-input ad-place-input"><option value="header_bottom" ${d.placement==='header_bottom'?'selected':''}>Below Header (728x90)</option><option value="sticky_footer" ${d.placement==='sticky_footer'?'selected':''}>Sticky Footer (728x90)</option><option value="end" ${d.placement==='end'?'selected':''}>End Post (300x250)</option><option value="sticky_left" ${d.placement==='sticky_left'?'selected':''}>Left Sticky (160x600)</option><option value="sticky_right" ${d.placement==='sticky_right'?'selected':''}>Right Sticky (160x600)</option><option value="after_p_1" ${d.placement==='after_p_1'?'selected':''}>After Para 1</option><option value="after_p_2" ${d.placement==='after_p_2'?'selected':''}>After Para 2</option><option value="after_p_3" ${d.placement==='after_p_3'?'selected':''}>After Para 3</option></select></div><div><input class="schema-input ad-exclude-input" value="${d.exclude||''}" placeholder="Excl. slugs"></div></div></div>`); 
}

// NEW: Add Author Item with Nested Socials
function addAuthorItem(a={}) {
    const c = document.getElementById('authors-repeater-container');
    const id = a.id || Date.now();
    let socialRows = '';
    
    // Convert old format to new format if needed
    let socials = a.socials || [];
    if(socials.length === 0) {
        if(a.twitter) socials.push({icon: 'fa-brands fa-twitter', link: a.twitter});
        if(a.linkedin) socials.push({icon: 'fa-brands fa-linkedin', link: a.linkedin});
        if(a.website) socials.push({icon: 'fa-solid fa-globe', link: a.website});
    }

    socials.forEach(s => {
        socialRows += `<div class="mini-row"><input class="mini-icon" value="${s.icon}" placeholder="Icon (fa-brands...)"><input class="mini-link" value="${s.link}" placeholder="URL"><button class="mini-btn-remove" onclick="this.parentElement.remove()">x</button></div>`;
    });

    if(c) c.insertAdjacentHTML('beforeend', 
    `<div class="author-card" data-id="${id}">
        <button class="repeater-remove" onclick="this.parentElement.remove()">x</button>
        <img src="${a.image||''}" class="author-img-preview" id="prev-${id}">
        <div class="author-fields">
            <input class="schema-input auth-name" value="${a.name||''}" placeholder="Name">
            <input class="schema-input auth-img" value="${a.image||''}" placeholder="Image URL" oninput="document.getElementById('prev-${id}').src=this.value">
            <textarea class="schema-input auth-bio" placeholder="Short Bio">${a.bio||''}</textarea>
            
            <div class="nested-repeater-container" id="nested-socials-${id}">
                <label class="schema-label">Author Socials</label>
                ${socialRows}
            </div>
            <button class="btn-xs btn-secondary" onclick="addAuthorSocialRow('${id}')">+ Social Link</button>
        </div>
    </div>`);
}

function addAuthorSocialRow(id) {
    const c = document.getElementById(`nested-socials-${id}`);
    if(c) c.insertAdjacentHTML('beforeend', `<div class="mini-row"><input class="mini-icon" placeholder="Icon (fa-brands...)"><input class="mini-link" placeholder="URL"><button class="mini-btn-remove" onclick="this.parentElement.remove()">x</button></div>`);
}

// Sidebar Media
async function loadSidebarMedia(){
    const g=document.getElementById('sidebar-media-grid'); g.innerHTML='...';
    try {
        const r = await githubReq('contents/images');
        if(!r) { g.innerHTML='Empty'; return; }
        const data = await r.json();
        const siteUrl = state.settings.siteUrl || `https://${state.owner}.github.io/${state.repo}`;
        
        g.innerHTML = data.filter(x=>x.name.match(/\.(jpg|png|webp|gif)$/i)).map(x => 
            `<div class="side-media-item" onclick="navigator.clipboard.writeText('${siteUrl}/images/${x.name}');showToast('Link Copied!')">
                <img src="${x.download_url}"><button class="side-media-delete" onclick="event.stopPropagation();deleteMedia('${x.sha}','${x.name}')">X</button>
            </div>`).join('');
    } catch(e) { g.innerHTML='Err'; }
}
async function deleteMedia(sha, name) { if(confirm('Delete?')) await githubReq(`contents/images/${name}`, 'DELETE', {message:'del', sha}); loadSidebarMedia(); }

function setupFeaturedImageDrop() {
    const w=document.getElementById('featured-dropzone');
    w.ondragover=e=>{e.preventDefault();w.classList.add('dragover')}; w.ondragleave=()=>w.classList.remove('dragover');
    w.ondrop=e=>{e.preventDefault();w.classList.remove('dragover'); if(e.dataTransfer.files.length) uploadFile(e.dataTransfer.files[0], u=>{document.getElementById('meta-banner').value=u;document.getElementById('banner-preview').src=u;document.getElementById('banner-preview').classList.remove('hidden')}); };
    document.getElementById('meta-banner').oninput = function() { const v=this.value; const p=document.getElementById('banner-preview'); p.src=v; p.classList.toggle('hidden', !v); }
}
function setupSidebarUpload() {
    const d=document.getElementById('sidebar-dropzone'), i=document.getElementById('sidebar-file-input');
    d.onclick=()=>i.click(); d.ondragover=e=>{e.preventDefault();d.style.borderColor='#00aaff'}; d.ondragleave=()=>d.style.borderColor='#444';
    d.ondrop=e=>{e.preventDefault();d.style.borderColor='#444';if(e.dataTransfer.files.length){showToast('Uploading...');Array.from(e.dataTransfer.files).forEach(f=>uploadFile(f));}}; 
    i.onchange=()=>{showToast('Uploading...');Array.from(i.files).forEach(f=>uploadFile(f));};
}
async function uploadFile(f,cb){
    const r=new FileReader();
    r.readAsDataURL(f);
    r.onload=async()=>{
        const b=r.result.split(',')[1];
        const p=`images/${Date.now()}-${f.name.replace(/\s/g,'-')}`;
        await githubReq(`contents/${p}`,'PUT',{message:'Up',content:b});
        loadSidebarMedia();
        const siteUrl = state.settings.siteUrl || `https://${state.owner}.github.io/${state.repo}`;
        if(cb) cb(`${siteUrl}/${p}`);
        showToast('Done');
    };
}
