/**
 * ULTIMATE SERVERLESS CMS - RANKING MACHINE EDITION
 * FIXED & OPTIMIZED VERSION
 */

// --- 1. CONFIG & ASSETS ---
const state = { 
    token: null, owner: null, repo: null, 
    currentType: 'post', currentSlug: null, currentSha: null, 
    settings: {}, settingsSha: null, 
    contentIndex: [], indexSha: null 
};

const SYSTEM_ASSETS = {
    "assets/css/article.css": `
@font-face{font-family:'Poppins Fallback';src:local('Arial');ascent-override:90%;descent-override:22%;line-gap-override:0%;size-adjust:104%}
@font-face{font-family:Poppins;font-style:normal;font-weight:300;font-display:swap;src:url(https://fonts.gstatic.com/s/poppins/v20/pxiByp8kv8JHgFVrLDz8Z1xlFd2JQEk.woff2) format('woff2');unicode-range:U+0000-00FF,U+0131,U+0152-0153,U+02BB-02BC,U+02C6,U+02DA,U+02DC,U+2000-206F,U+2074,U+20AC,U+2122,U+2191,U+2193,U+2212,U+2215,U+FEFF,U+FFFD}
@font-face{font-family:Poppins;font-style:normal;font-weight:400;font-display:swap;src:url(https://fonts.gstatic.com/s/poppins/v20/pxiEyp8kv8JHgFVrJJfecg.woff2) format('woff2');unicode-range:U+0000-00FF,U+0131,U+0152-0153,U+02BB-02BC,U+02C6,U+02DA,U+02DC,U+2000-206F,U+2074,U+20AC,U+2122,U+2191,U+2193,U+2212,U+2215,U+FEFF,U+FFFD}
@font-face{font-family:Poppins;font-style:normal;font-weight:600;font-display:swap;src:url(https://fonts.gstatic.com/s/poppins/v20/pxiByp8kv8JHgFVrLEj6Z1xlFd2JQEk.woff2) format('woff2');unicode-range:U+0000-00FF,U+0131,U+0152-0153,U+02BB-02BC,U+02C6,U+02DA,U+02DC,U+2000-206F,U+2074,U+20AC,U+2122,U+2191,U+2193,U+2212,U+2215,U+FEFF,U+FFFD}
@font-face{font-family:Poppins;font-style:normal;font-weight:700;font-display:swap;src:url(https://fonts.gstatic.com/s/poppins/v20/pxiByp8kv8JHgFVrLCz7Z1xlFd2JQEk.woff2) format('woff2');unicode-range:U+0000-00FF,U+0131,U+0152-0153,U+02BB-02BC,U+02C6,U+02DA,U+02DC,U+2000-206F,U+2074,U+20AC,U+2122,U+2191,U+2193,U+2212,U+2215,U+FEFF,U+FFFD}
:root{--primary-color:#00aaff;--background-color:#121212;--surface-color:#1e1e1e;--text-color:#e0e0e0;--text-color-secondary:#b0b0b0;--font-family:'Poppins','Poppins Fallback',sans-serif;--content-width:800px;}
*{margin:0;padding:0;box-sizing:border-box}
@media screen and (max-width:850px){.page-header-section, .featured-image-container, .article-container { padding-left: 1rem; padding-right: 1rem; width: 100%; }}
html{scroll-behavior:smooth;overflow-x:hidden}body{font-family:sans-serif;font-family:var(--font-family);background-color:var(--background-color);color:var(--text-color);line-height:1.7;overflow-x:hidden}
h1 { font-size: 2.5rem; line-height: 1.2; margin: 0.67em 0; min-height: 1.2em; }
a{color:#ff3e00;text-decoration:none;transition:color .3s ease}a:hover{color:var(--primary-color)}
.progress-bar{position:fixed;top:0;left:0;width:0;height:4px;background:linear-gradient(90deg,var(--primary-color),#0077b6);z-index:1000;transition:width .1s linear}
.site-header nav{display:flex;justify-content:space-between;align-items:center;padding:1.5rem 5%;background-color:var(--background-color);border-bottom:1px solid #2a2a2a;height:80px}
.logo{font-weight:700;font-size:1.5rem;color:#fff;text-decoration:none}
.nav-links{display:flex;justify-content:space-around;list-style:none}
.nav-links li{margin:0 1rem}.nav-links a{color:var(--text-color);font-weight:600;font-size:1rem;position:relative}.nav-links a::after{content:'';position:absolute;width:0;height:2px;background:var(--primary-color);bottom:-5px;left:50%;transform:translateX(-50%);transition:width .3s ease}.nav-links a:hover{color:#fff}.nav-links a:hover::after{width100%}
.burger{display:none;cursor:pointer;transition:opacity 0.3s ease}.burger div{width:25px;height:3px;background-color:var(--text-color);margin:5px;transition:all .3s ease}
body.menu-open .burger { opacity: 0; pointer-events: none; }
.nav-close-btn { display: none; position: absolute; top: 25px; right: 25px; background: transparent; border: none; color: #fff; font-size: 2.5rem; cursor: pointer; line-height: 1; z-index: 2002; }
.page-header-section{text-align:left;padding:3rem 0 1.5rem;max-width:var(--content-width);margin:0 auto; min-height: 200px;}
.breadcrumbs{font-size:.9rem;color:var(--text-color-secondary);margin-bottom:1rem;text-transform:capitalize; min-height: 1.5em; display:block; line-height: 1.5;}
.page-title{font-size:clamp(2rem,5vw,3rem);font-weight:700;margin-bottom:.8rem;line-height:1.2;color:#fff; min-height: 1.2em;}
.page-meta{font-size:.95rem;color:var(--text-color-secondary);margin-bottom:2rem;display:flex;align-items:center;gap:12px;flex-wrap:wrap; min-height: 34px; line-height: 1.5;}
.page-meta img.auth-tiny{width:32px;height:32px;border-radius:50%;object-fit:cover;border:1px solid var(--primary-color); background-color: #333; aspect-ratio: 1/1;}
.featured-image-container { max-width: var(--content-width); margin: 0 auto 2.5rem; position: relative; width: 100%; aspect-ratio: 1200 / 628; overflow: hidden; border-radius: 8px; background: #1a1a1a; display: block; }
@supports not (aspect-ratio: 1200 / 628) { .featured-image-container { height: 0; padding-bottom: 52.3333%; } }
.featured-image { width: 100%; height: 100%; object-fit: cover; display: block; box-shadow: 0 8px 25px rgba(0,0,0,.3); border: 1px solid #333; }
@supports not (aspect-ratio: 1200 / 628) { .featured-image { position: absolute; top: 0; left: 0; } }
.article-container{max-width:var(--content-width);margin:0 auto 4rem;min-height:50vh}
.article-container h2{font-size:1.9rem;font-weight:600;margin-top:2.5rem;margin-bottom:1rem;color:#fff;border-left:4px solid var(--primary-color);padding-left:15px;line-height:1.3}
.article-container h3{font-size:1.5rem;font-weight:600;margin-top:2rem;margin-bottom:1rem;color:#fff}
.article-container p{margin-bottom:1.5rem;font-size:1.15rem;color:#d6d6d6;line-height:1.8}
.article-container ul,.article-container ol{margin-left:2rem;margin-bottom:1.5rem}.article-container li{margin-bottom:.75rem;padding-left:.5rem;color:#d6d6d6;font-size:1.1rem}.article-container strong{color:var(--primary-color);font-weight:600}
.article-container img{max-width:100%;height:auto;border-radius:8px;margin:2rem 0;display:block}
.article-container iframe{max-width:100%}
.article-container blockquote{border-left:4px solid var(--primary-color);background:#1a1a1a;padding:1.5rem;margin:1.5rem 0;font-style:italic;color:#e0e0e0;border-radius:0 8px 8px 0}
.share-buttons{display:flex;gap:10px;margin-top:3rem;padding-top:1.5rem;border-top:1px solid #333;flex-wrap:wrap}
.share-btn{display:flex;align-items:center;gap:8px;padding:8px 16px;border-radius:4px;color:#fff;font-weight:600;font-size:0.9rem;transition:opacity 0.2s;text-decoration:none;}
.share-btn svg{width:18px;height:18px;fill:currentColor}
.share-btn:hover{opacity:0.8;color:#fff;}
.btn-fb{background:#1877f2}.btn-x{background:#000;border:1px solid #333}.btn-in{background:#0a66c2}.btn-wa{background:#25d366}.btn-cp{background:#333}
.cat-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(300px,1fr));gap:2rem;max-width:1200px;margin:0 auto;padding:0 1rem}
.cat-card{background:#1e1e1e;border:1px solid #333;border-radius:8px;overflow:hidden;transition:transform 0.2s}
.cat-card:hover{transform:translateY(-5px);border-color:var(--primary-color)}
.cat-img-box{aspect-ratio:16/9;overflow:hidden;background:#000}
.cat-img-box img{width:100%;height:100%;object-fit:cover}
.cat-content{padding:1.5rem}
.cat-date{font-size:0.8rem;color:var(--text-color-secondary);margin-bottom:0.5rem;display:block}
.cat-title{font-size:1.2rem;margin-bottom:0.8rem;line-height:1.3;color:#fff}
.cat-excerpt{font-size:0.95rem;color:#b0b0b0;margin-bottom:1.5rem;display:-webkit-box;-webkit-line-clamp:3;-webkit-box-orient:vertical;overflow:hidden}
.cat-btn{display:inline-block;padding:6px 12px;background:var(--primary-color);color:#fff;border-radius:4px;font-size:0.9rem;font-weight:600}
.pagination{display:flex;justify-content:center;gap:10px;margin-top:3rem;flex-wrap:wrap}
.page-btn{padding:8px 12px;background:#333;color:#fff;border-radius:4px;cursor:pointer}
.page-btn.active{background:var(--primary-color)}
.author-bio{margin-top:4rem;padding:2rem;background-color:var(--surface-color);border-radius:12px;display:flex;align-items:center;gap:1.5rem;border:1px solid #333}
.author-bio img{width:100px;height:100px;border-radius:50%;object-fit:cover;border:2px solid var(--primary-color); background: #333; aspect-ratio: 1/1;}
.author-bio h3{margin:0 0 .5rem;font-size:1.4rem;color:#fff}.author-bio p{font-size:.95rem;color:var(--text-color-secondary);margin-bottom:1rem}
.author-socials-list a{color:var(--text-color-secondary);font-size:1.2rem;margin-right:10px}
.author-socials-list a:hover{color:var(--primary-color)}
.site-footer{background-color:#0c0c0c;color:var(--text-color-secondary);padding:3rem 5%;margin-top:4rem;border-top:1px solid #2a2a2a}
.footer-container{display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:2rem;margin-bottom:2rem}
.footer-nav a{color:var(--text-color-secondary);margin-right:1.5rem}.footer-nav a:hover{color:var(--primary-color)}
.footer-social a{color:var(--text-color-secondary);font-size:1.4rem;margin-left:1rem}.footer-social a:hover{color:var(--primary-color)}
.footer-bottom{text-align:center;padding-top:2rem;border-top:1px solid #2a2a2a;font-size:.9rem}
[data-animate]{opacity:0;transition:opacity .6s ease-out,transform .6s ease-out}.article-container [data-animate]{transform:translateY(30px)}[data-animate].is-visible{opacity:1;transform:translateY(0)}
@media screen and (max-width:768px){.nav-links{position:fixed;top:0;right:0;width:100%;height:100vh;background:rgba(18,18,18,0.98);backdrop-filter:blur(10px);display:flex;flex-direction:column;align-items:center;justify-content:center;transform:translateX(100%);transition:transform 0.4s cubic-bezier(0.4, 0, 0.2, 1);z-index:2000;will-change:transform;gap: 2rem;}.nav-links.nav-active{transform:translateX(0)}.nav-links li{margin:0;opacity:0;transform:translateY(20px);transition:all 0.4s ease 0.1s}.nav-links.nav-active li{opacity:1;transform:translateY(0)}.nav-links a{font-size:1.5rem;font-weight:700}.burger{display:block;z-index:2001}.nav-close-btn{display:block}.page-title{font-size:2rem}.author-bio{flex-direction:column;text-align:center}.footer-container{flex-direction:column;align-items:flex-start}}
.ad-unit{margin:2rem auto;text-align:center;clear:both;max-width:100%;overflow:hidden;background:transparent;display:flex;align-items:center;justify-content:center}
.ad-sticky-left{position:fixed;top:100px;left:10px;width:160px;height:600px;z-index:90}
.ad-sticky-right{position:fixed;top:100px;right:10px;width:160px;height:600px;z-index:90}
.ad-sticky-footer{position:fixed;bottom:0;left:0;width:100%;background:#000;z-index:999;display:flex;flex-direction:column;align-items:center;padding:10px;border-top:1px solid #333}
.ad-close{align-self:flex-end;background:#333;color:#fff;border:1px solid #555;cursor:pointer;padding:2px 8px;font-size:12px;margin-bottom:5px}
@media(max-width:1200px){.ad-sticky-left,.ad-sticky-right{display:none}}
@media(max-width:768px){.ad-sticky-footer{height:auto;padding:5px}.ad-sticky-footer img{max-width:100%;height:auto}}
`,
    "assets/js/article.js": `
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
`
};

// --- 2. CORE UTILS ---
function showToast(m,e){const t=document.getElementById('toast');t.innerText=m;t.style.borderLeftColor=e?'red':'#00aaff';t.classList.add('show');setTimeout(()=>t.classList.remove('show'),3000)}
function showLoader(v,t){document.getElementById('loading-overlay').classList.toggle('hidden',!v); if(t)document.getElementById('loading-text').innerText=t;}
function slugify(t){return t.toLowerCase().replace(/[^\w-]+/g,'-')}
function b64EncodeUnicode(str){return btoa(encodeURIComponent(str).replace(/%([0-9A-F]{2})/g,(m,p1)=>String.fromCharCode('0x'+p1)))}
function b64DecodeUnicode(str){return decodeURIComponent(atob(str).split('').map(c=>'%'+('00'+c.charCodeAt(0).toString(16)).slice(-2)).join(''))}

function githubReq(endpoint, method = 'GET', body = null) { 
    const url = `https://api.github.com/repos/${state.owner}/${state.repo}/${endpoint}${method === 'GET' ? '?t='+Date.now() : ''}`; 
    const opts = { method, headers: { Authorization: `Bearer ${state.token}`, Accept: 'application/vnd.github.v3+json', 'Content-Type': 'application/json' } }; 
    if (body) opts.body = JSON.stringify(body); 
    return fetch(url, opts).then(async r => {
        if(!r.ok && method==='GET' && r.status===404) return null; 
        if(!r.ok) {
            const err = await r.json().catch(()=>({}));
            throw new Error(err.message || `API Error ${r.status}`);
        }
        return r;
    }); 
}

async function getLatestFileSha(path) { try { const res = await githubReq(`contents/${path}`); return res ? (await res.json()).sha : null; } catch (e) { return null; } }

function setupSidebarEvents() { document.getElementById('sidebar-toggle-btn').addEventListener('click', () => { document.getElementById('main-sidebar').classList.toggle('collapsed'); if(window.innerWidth <= 768) document.getElementById('main-sidebar').classList.toggle('active-mobile'); }); }

function switchPanel(id) { 
    document.querySelectorAll('.panel').forEach(p => p.classList.remove('active')); 
    document.getElementById(`panel-${id}`).classList.add('active'); 
    document.querySelectorAll('.nav-item').forEach(b => b.classList.remove('active')); 
    const navId = `nav-btn-${id}`; 
    if(document.getElementById(navId)) document.getElementById(navId).classList.add('active'); 
    try {
        if(id === 'dashboard') loadList('post'); 
        if(id === 'pages') loadList('page'); 
    } catch(e) { console.error("List load failed:", e); }
}

function switchSidebarTab(tabName) { document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active')); document.querySelectorAll('.sidebar-content').forEach(c => c.classList.remove('active')); document.getElementById(`tab-btn-${tabName}`).classList.add('active'); document.getElementById(`tab-${tabName}`).classList.add('active'); }
function resolveMenuLink(link, siteUrl) { if(!link) return '#'; if(link.match(/^https?:\/\//) || link.startsWith('mailto:') || link.startsWith('tel:') || link.startsWith('#')) return link; if(link.includes('.') && !link.startsWith('/')) return 'https://' + link; const base = siteUrl.endsWith('/') ? siteUrl.slice(0, -1) : siteUrl; let path = link; if(path.startsWith('/')) path = path.substring(1); if(!path.endsWith('/') && !path.includes('.')) path += '/'; return `${base}/${path}`; }
function ensureExternalUrl(link) { if(!link) return ''; if(link.match(/^https?:\/\//) || link.startsWith('mailto:') || link.startsWith('tel:')) return link; return 'https://' + link; }
function exitEditor(){switchPanel(state.currentType==='post'?'dashboard':'pages')}

// --- 3. INITIALIZATION ---
document.addEventListener('DOMContentLoaded', () => {
    const t = localStorage.getItem('gh_token'), o = localStorage.getItem('gh_owner'), r = localStorage.getItem('gh_repo');
    if (t && o && r) { state.token = t; state.owner = o; state.repo = r; initApp(); } 
    else { document.getElementById('login-view').classList.add('active'); document.getElementById('app-view').classList.remove('active'); }
    setupSidebarEvents(); setupSidebarUpload(); setupFeaturedImageDrop(); setInterval(handleAutoSave, 5000); setupUnsavedWarning();
});

document.getElementById('login-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const t = document.getElementById('gh-token').value.trim();
    const o = document.getElementById('gh-owner').value.trim();
    const r = document.getElementById('gh-repo').value.trim();
    showLoader(true, "Verifying...");
    try {
        const res = await fetch(`https://api.github.com/repos/${o}/${r}`, { headers: { Authorization: `Bearer ${t}` } });
        if (!res.ok) throw new Error('Invalid Credentials or Repo Access');
        localStorage.setItem('gh_token', t); localStorage.setItem('gh_owner', o); localStorage.setItem('gh_repo', r);
        state.token = t; state.owner = o; state.repo = r;
        initApp();
    } catch (err) { showToast(err.message, true); }
    finally { showLoader(false); }
});

document.getElementById('nav-logout').addEventListener('click', () => { localStorage.clear(); location.reload(); });
function setupUnsavedWarning() { window.addEventListener('beforeunload', (e) => { if(tinymce.activeEditor && tinymce.activeEditor.isDirty()) { e.preventDefault(); e.returnValue = ''; } }); }

async function initApp() {
    try {
        document.getElementById('login-view').classList.remove('active'); document.getElementById('app-view').classList.add('active');
        showLoader(true, "Initializing..."); await ensureSystemFiles();
        showLoader(true, "Loading Data..."); await Promise.all([loadGlobalSettings(), loadContentIndex()]);
        switchPanel('dashboard');
    } catch (e) {
        showToast("Init Error: " + e.message, true);
        console.error(e);
        document.getElementById('login-view').classList.add('active'); 
        document.getElementById('app-view').classList.remove('active');
    } finally {
        showLoader(false);
    }
}

async function ensureSystemFiles() {
    for (const [path, content] of Object.entries(SYSTEM_ASSETS)) {
        try {
            const res = await githubReq(`contents/${path}`);
            if (res) {
                const data = await res.json();
                const existingContent = b64DecodeUnicode(data.content);
                if (existingContent.trim() !== content.trim()) {
                    await githubReq(`contents/${path}`, 'PUT', { message: `Update ${path}`, content: b64EncodeUnicode(content), sha: data.sha });
                }
            } else {
                await githubReq(`contents/${path}`, 'PUT', { message: `Init ${path}`, content: b64EncodeUnicode(content) });
            }
        } catch (e) { console.warn(`Asset check failed for ${path}:`, e); }
    }
}

// --- 4. DATA LOADING ---
async function loadGlobalSettings() {
    try {
        const res = await githubReq('contents/_cms/settings.json');
        if(res) {
            const data = await res.json();
            state.settingsSha = data.sha;
            state.settings = JSON.parse(b64DecodeUnicode(data.content));
        } else { state.settings = {}; }
        populateSettingsForm();
    } catch(e) { console.error(e); state.settings = {}; }
}

async function loadContentIndex() {
    try {
        const res = await githubReq('contents/_cms/index.json');
        if (res) {
            const data = await res.json();
            state.indexSha = data.sha;
            try {
                state.contentIndex = JSON.parse(b64DecodeUnicode(data.content));
            } catch (err) {
                console.warn("Index JSON corrupted, resetting.");
                state.contentIndex = [];
            }
        } else state.contentIndex = [];
    } catch(e) { console.error(e); state.contentIndex = []; }
}

// --- 5. DATA TABLES ---
function loadList(type) {
    const tbody = document.getElementById(`${type}s-list-body`);
    if(!tbody) return;
    tbody.innerHTML = '';
    
    // Sort by date descending
    const items = state.contentIndex.filter(i => i.type === type).sort((a,b) => new Date(b.date) - new Date(a.date));
    
    if(items.length === 0) {
        tbody.innerHTML = `<tr><td colspan="5" style="text-align:center;color:#666;">No ${type}s found.</td></tr>`;
        return;
    }

    items.forEach(item => {
        const dateStr = new Date(item.modified || item.date).toLocaleDateString();
        let catHtml = '';
        if(type === 'post') {
            const cats = item.cats || [];
            if(cats.length > 0) catHtml = cats.map(c => {
                const n = (state.settings.categories||[]).find(x=>x.slug===c)?.name || c;
                return `<span style="background:#333;padding:2px 6px;border-radius:3px;font-size:0.75rem;margin-right:4px;">${n}</span>`;
            }).join('');
            else catHtml = '<span style="color:#666;font-size:0.8rem;">Uncategorized</span>';
        }

        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td><input type="checkbox" class="chk-${type}" value="${item.slug}" onchange="toggleBulkBtn('${type}')"></td>
            <td><strong>${item.title}</strong><br><small style="color:#666">/${item.slug}</small></td>
            ${type === 'post' ? `<td>${catHtml}</td>` : ''}
            <td>${dateStr}</td>
            <td>
                <button class="btn-primary btn-xs" onclick="editContent('${type}', '${item.slug}')"><i class="fa-solid fa-pen"></i></button>
            </td>
        `;
        tbody.appendChild(tr);
    });
    toggleBulkBtn(type);
}

// --- 6. SETTINGS & REPEATERS ---
function populateSettingsForm() {
    const s = state.settings || {};
    document.getElementById('set-site-title').value = s.siteTitle || '';
    document.getElementById('set-site-url').value = s.siteUrl || '';
    document.getElementById('set-favicon').value = s.favicon || '';
    document.getElementById('set-copyright').value = s.copyright || '';
    document.getElementById('set-ga-id').value = s.gaId || '';
    
    // ANTI-ADBLOCK ID
    if(document.getElementById('set-monetization-auto')) {
        document.getElementById('set-monetization-auto').value = s.adsenseAuto || '';
    }

    document.getElementById('set-custom-css').value = s.customCss || '';
    document.getElementById('set-custom-head-js').value = s.customHeadJs || '';
    document.getElementById('set-404-redirect').checked = s.enable404 || false;
    document.getElementById('set-structure-mode').value = s.structureMode || 'blog';
    document.getElementById('set-robots-txt').value = s.robotsTxt || "User-agent: *\nDisallow:";
    document.getElementById('set-sitemap-exclude').value = s.sitemapExclude || '';
    document.getElementById('set-enable-share').checked = s.enableShare || false;
    document.getElementById('set-share-exclude').value = s.shareExclude || '';
    document.getElementById('set-news-pub-name').value = s.newsPubName || '';
    
    toggleCategorySettings();
    renderCategoriesList();
    renderNewsCatSelect();

    const vContainer = document.getElementById('meta-verify-container'); if(vContainer) { vContainer.innerHTML = ''; (s.verifications || []).forEach(v => addMetaVerifyItem(v)); }
    renderRepeater('header-menu-container', s.headerMenu, 'menu'); 
    renderRepeater('footer-menu-container', s.footerMenu, 'menu'); 
    renderRepeater('social-links-container', s.socialLinks, 'social');
    
    const aContainer = document.getElementById('authors-repeater-container'); if(aContainer) { aContainer.innerHTML = ''; (s.authors || []).forEach(a => addAuthorItem(a)); }
    
    const adContainer = document.getElementById('ads-repeater-container'); 
    if(adContainer) { 
        adContainer.innerHTML = ''; 
        (s.ads || []).forEach(ad => addAdUnit(ad)); 
    }
}

function renderRepeater(containerId, data, type) {
    const c = document.getElementById(containerId);
    c.innerHTML = '';
    (data || []).forEach(item => {
        if(type === 'menu') addMenuItem(containerId, item.label, item.link);
        if(type === 'social') addSocialItem(item.label, item.link); 
    });
}

function addMenuItem(containerId, label='', link='') {
    const html = `
    <div class="repeater-item menu-row">
        <button class="repeater-remove" onclick="this.parentElement.remove()">x</button>
        <input type="text" placeholder="Label" value="${label}" class="menu-label">
        <input type="text" placeholder="Link / Slug" value="${link}" class="menu-link">
    </div>`;
    document.getElementById(containerId).insertAdjacentHTML('beforeend', html);
}

function addSocialItem(icon='fa-brands fa-twitter', link='') {
    const html = `
    <div class="repeater-item social-row">
        <button class="repeater-remove" onclick="this.parentElement.remove()">x</button>
        <input type="text" placeholder="Icon Class (fa-brands...)" value="${icon}" class="social-icon">
        <input type="text" placeholder="Link" value="${link}" class="social-link">
    </div>`;
    document.getElementById('social-links-container').insertAdjacentHTML('beforeend', html);
}

function addAuthorItem(data = {}) {
    const id = data.id || 'auth-' + Date.now();
    const html = `
    <div class="author-card" data-id="${id}">
        <button class="repeater-remove" style="top:5px;right:5px;" onclick="this.closest('.author-card').remove()">x</button>
        <div>
            <img src="${data.image || ''}" class="author-img-preview" id="prev-${id}">
        </div>
        <div class="author-fields">
            <input type="text" class="auth-name" placeholder="Name" value="${data.name || ''}">
            <input type="text" class="auth-img" placeholder="Image URL" value="${data.image || ''}" onchange="document.getElementById('prev-${id}').src=this.value">
            <textarea class="auth-bio" placeholder="Short Bio" rows="2">${data.bio || ''}</textarea>
            <div class="nested-repeater-container" id="nested-socials-${id}">
                ${(data.socials||[]).map(s => `
                    <div class="mini-row">
                        <input type="text" class="mini-icon" placeholder="Icon" value="${s.icon}">
                        <input type="text" class="mini-link" placeholder="Link" value="${s.link}">
                        <button class="mini-btn-remove" onclick="this.parentElement.remove()">x</button>
                    </div>
                `).join('')}
            </div>
            <button class="btn-xs btn-secondary" onclick="addNestedSocial('nested-socials-${id}')">+ Social</button>
        </div>
    </div>`;
    document.getElementById('authors-repeater-container').insertAdjacentHTML('beforeend', html);
}

function addNestedSocial(containerId) {
    document.getElementById(containerId).insertAdjacentHTML('beforeend', `
    <div class="mini-row">
        <input type="text" class="mini-icon" placeholder="Icon (fa-brands...)">
        <input type="text" class="mini-link" placeholder="Link">
        <button class="mini-btn-remove" onclick="this.parentElement.remove()">x</button>
    </div>`);
}

function addAdUnit(data = {}) {
    const html = `
    <div class="sponsor-unit-block">
        <button class="sponsor-remove-btn" onclick="this.parentElement.remove()">x</button>
        <textarea class="code-editor ad-code-input" rows="3" placeholder="Paste Ad Code Here...">${data.code || ''}</textarea>
        <div class="sponsor-meta-row">
            <div>
                <label class="schema-label">Placement</label>
                <select class="ad-place-input">
                    <option value="header_bottom" ${data.placement==='header_bottom'?'selected':''}>Header Bottom</option>
                    <option value="end" ${data.placement==='end'?'selected':''}>End of Content</option>
                    <option value="after_p_1" ${data.placement==='after_p_1'?'selected':''}>After Para 1</option>
                    <option value="after_p_3" ${data.placement==='after_p_3'?'selected':''}>After Para 3</option>
                    <option value="sticky_left" ${data.placement==='sticky_left'?'selected':''}>Sticky Left</option>
                    <option value="sticky_right" ${data.placement==='sticky_right'?'selected':''}>Sticky Right</option>
                    <option value="sticky_footer" ${data.placement==='sticky_footer'?'selected':''}>Sticky Footer</option>
                </select>
            </div>
            <div>
                <label class="schema-label">Exclude Slugs (comma sep)</label>
                <input type="text" class="ad-exclude-input" value="${data.exclude || ''}">
            </div>
        </div>
    </div>`;
    document.getElementById('ads-repeater-container').insertAdjacentHTML('beforeend', html);
}

function addMetaVerifyItem(data = {}) {
    const html = `
    <div class="repeater-item meta-item-row">
        <button class="repeater-remove" onclick="this.parentElement.remove()">x</button>
        <input type="text" style="width:100%" placeholder='<meta name="..." content="...">' value="${data.replace(/"/g, '&quot;')}" class="meta-val">
    </div>`;
    document.getElementById('meta-verify-container').insertAdjacentHTML('beforeend', html);
}

function collectRepeater(containerId, type) {
    const items = [];
    const container = document.getElementById(containerId);
    if (!container) return items;
    
    container.querySelectorAll('.repeater-item').forEach(row => {
        if(type === 'menu') {
            const label = row.querySelector('.menu-label');
            const link = row.querySelector('.menu-link');
            if(label && link) items.push({ label: label.value, link: link.value });
        } else if(type === 'social') {
            const icon = row.querySelector('.social-icon');
            const link = row.querySelector('.social-link');
            if(icon && link) items.push({ label: icon.value, link: link.value });
        } else if(type === 'meta') {
            const val = row.querySelector('.meta-val');
            if(val && val.value) items.push(val.value);
        }
    });
    return items;
}

async function saveGlobalSettings() {
    showLoader(true, "Saving Settings...");
    try {
        let siteUrl = document.getElementById('set-site-url').value.trim();
        if(siteUrl && siteUrl.endsWith('/')) siteUrl = siteUrl.slice(0, -1); 

        const adsenseEl = document.getElementById('set-monetization-auto');
        
        // Construct new settings object strictly from DOM to avoid pollution
        const newSettings = {
            ...state.settings,
            siteTitle: document.getElementById('set-site-title').value,
            siteUrl: siteUrl,
            favicon: document.getElementById('set-favicon').value,
            copyright: document.getElementById('set-copyright').value,
            enable404: document.getElementById('set-404-redirect').checked,
            gaId: document.getElementById('set-ga-id').value,
            adsenseAuto: adsenseEl ? adsenseEl.value : '',
            customCss: document.getElementById('set-custom-css').value,
            customHeadJs: document.getElementById('set-custom-head-js').value,
            structureMode: document.getElementById('set-structure-mode').value,
            newsCategory: document.getElementById('set-news-category').value,
            newsPubName: document.getElementById('set-news-pub-name').value,
            robotsTxt: document.getElementById('set-robots-txt').value,
            sitemapExclude: document.getElementById('set-sitemap-exclude').value,
            enableShare: document.getElementById('set-enable-share').checked,
            shareExclude: document.getElementById('set-share-exclude').value,
            verifications: collectRepeater('meta-verify-container', 'meta'),
            headerMenu: collectRepeater('header-menu-container', 'menu'),
            footerMenu: collectRepeater('footer-menu-container', 'menu'),
            socialLinks: collectRepeater('social-links-container', 'social'),
            authors: [], 
            ads: []
        };
        
        document.querySelectorAll('.author-card').forEach(b => {
            const id = b.dataset.id;
            const socials = [];
            b.querySelectorAll(`#nested-socials-${id} .mini-row`).forEach(row => { 
                socials.push({ icon: row.querySelector('.mini-icon').value, link: row.querySelector('.mini-link').value }); 
            });
            newSettings.authors.push({ 
                id: id, 
                name: b.querySelector('.auth-name').value, 
                image: b.querySelector('.auth-img').value, 
                bio: b.querySelector('.auth-bio').value, 
                socials: socials 
            });
        });
        
        document.querySelectorAll('.sponsor-unit-block').forEach(b => { 
            newSettings.ads.push({ 
                code: b.querySelector('.ad-code-input').value, 
                placement: b.querySelector('.ad-place-input').value, 
                exclude: b.querySelector('.ad-exclude-input').value 
            }); 
        });

        // FETCH LATEST SHA BEFORE SAVING to ensure no conflicts
        // If file doesn't exist, freshSha is null, which is fine for creation.
        const freshSha = await getLatestFileSha('_cms/settings.json');
        
        const body = { message: 'Update Settings', content: b64EncodeUnicode(JSON.stringify(newSettings, null, 2)) };
        if(freshSha) body.sha = freshSha;
        
        const res = await githubReq('contents/_cms/settings.json', 'PUT', body);
        const data = await res.json();
        
        // Only update local state AFTER successful save
        state.settings = newSettings;
        state.settingsSha = data.content.sha;
        
        // Save Robots.txt
        const robSha = await getLatestFileSha('robots.txt');
        await githubReq('robots.txt', 'PUT', { message: 'Up Robots', content: b64EncodeUnicode(newSettings.robotsTxt), sha: robSha || undefined });

        if(newSettings.enable404) {
            const sha404 = await getLatestFileSha('contents/404.html');
            const html404 = `<!DOCTYPE html><html><head><meta http-equiv="refresh" content="0; url=${newSettings.siteUrl}/"></head><body>Redirecting...</body></html>`;
            await githubReq('contents/404.html', 'PUT', { message: 'Up 404', content: b64EncodeUnicode(html404), sha: sha404 || undefined });
        }
        showToast('Settings Saved!');
    } catch(e) { 
        showToast("Save Error: " + e.message, true); 
        console.error(e);
    } finally { 
        showLoader(false); 
    }
}

// --- 7. UI LOGIC (Categories & Editor) ---
function toggleCategorySettings() {
    const mode = document.getElementById('set-structure-mode').value;
    document.getElementById('category-settings-wrapper').classList.toggle('hidden', mode !== 'category');
}
function addCategoryItem() {
    const name = document.getElementById('new-cat-name').value;
    if(!name) return;
    if(!state.settings.categories) state.settings.categories = [];
    state.settings.categories.push({ name: name, slug: slugify(name) });
    document.getElementById('new-cat-name').value = '';
    renderCategoriesList(); renderNewsCatSelect();
}
function removeCategory(idx) {
    if(confirm('Remove Category?')) { state.settings.categories.splice(idx, 1); renderCategoriesList(); renderNewsCatSelect(); }
}
function renderCategoriesList() {
    const c = document.getElementById('categories-list'); c.innerHTML = '';
    (state.settings.categories || []).forEach((cat, i) => {
        c.insertAdjacentHTML('beforeend', `<div class="list-item"><span>${cat.name} <small>(${cat.slug})</small></span><button class="btn-danger btn-xs" onclick="removeCategory(${i})">x</button></div>`);
    });
}
function renderNewsCatSelect() {
    const sel = document.getElementById('set-news-category');
    const curr = state.settings.newsCategory || '';
    sel.innerHTML = '<option value="">-- None --</option>';
    (state.settings.categories || []).forEach(cat => {
        sel.insertAdjacentHTML('beforeend', `<option value="${cat.slug}" ${cat.slug === curr ? 'selected' : ''}>${cat.name}</option>`);
    });
}
function insertRobots(type) {
    const box = document.getElementById('set-robots-txt');
    if(type==='allow') box.value = "User-agent: *\nDisallow:";
    if(type==='sitemap') box.value += `\nSitemap: ${state.settings.siteUrl}/sitemap.xml\nSitemap: ${state.settings.siteUrl}/sitemap-news.xml`;
    if(type==='disallow_admin') box.value += "\nDisallow: /admin/";
}

function createNew(type) {
    state.currentType = type; state.currentSlug = null; state.currentSha = null;
    document.getElementById('meta-title').value = '';
    document.getElementById('meta-slug').value = '';
    document.getElementById('meta-desc').value = '';
    document.getElementById('meta-banner').value = '';
    document.getElementById('meta-canonical').value = '';
    document.getElementById('banner-preview').classList.add('hidden');
    document.getElementById('schema-container').innerHTML = '';
    document.getElementById('live-link-container').classList.add('hidden');
    
    // Logic for Structure Mode
    const mode = state.settings.structureMode || 'blog';
    document.getElementById('editor-category-section').classList.toggle('hidden', mode !== 'category');
    document.getElementById('editor-blog-message').classList.toggle('hidden', mode === 'category');
    
    if(mode === 'category') {
        const box = document.getElementById('editor-categories-box'); box.innerHTML = '';
        (state.settings.categories || []).forEach(cat => {
            box.insertAdjacentHTML('beforeend', `<label><input type="checkbox" class="cat-chk" value="${cat.slug}"> ${cat.name}</label>`);
        });
    }

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
        document.getElementById('meta-title').value = doc.querySelector('title')?.innerText.split(' - ')[0] || '';
        document.getElementById('meta-slug').value = slug;
        document.getElementById('meta-desc').value = doc.querySelector('meta[name="description"]')?.content || '';
        const img = doc.querySelector('meta[property="og:image"]')?.content || '';
        document.getElementById('meta-banner').value = img;
        if(img) { document.getElementById('banner-preview').src = img; document.getElementById('banner-preview').classList.remove('hidden'); }
        
        const canon = doc.querySelector('link[rel="canonical"]')?.href || '';
        const defaultCanon = `${state.settings.siteUrl}/${type==='post'?'blog/':''}${slug}/`;
        document.getElementById('meta-canonical').value = (canon === defaultCanon) ? '' : canon;

        const authSel = document.getElementById('meta-author-select'); authSel.innerHTML = '';
        (state.settings.authors || []).forEach(a => authSel.insertAdjacentHTML('beforeend', `<option value="${a.id}">${a.name}</option>`));
        const currentAuthorName = doc.querySelector('.author-details strong')?.innerText || "Admin";
        const matched = (state.settings.authors||[]).find(a => a.name === currentAuthorName);
        if(matched) authSel.value = matched.id;

        // Categories
        const mode = state.settings.structureMode || 'blog';
        document.getElementById('editor-category-section').classList.toggle('hidden', mode !== 'category');
        document.getElementById('editor-blog-message').classList.toggle('hidden', mode === 'category');
        if(mode === 'category') {
            const box = document.getElementById('editor-categories-box'); box.innerHTML = '';
            // Determine checked cats from index, NOT HTML
            const idxEntry = state.contentIndex.find(i => i.slug === slug && i.type === 'post');
            const savedCats = idxEntry ? (idxEntry.cats || []) : [];
            (state.settings.categories || []).forEach(cat => {
                const checked = savedCats.includes(cat.slug) ? 'checked' : '';
                box.insertAdjacentHTML('beforeend', `<label><input type="checkbox" class="cat-chk" value="${cat.slug}" ${checked}> ${cat.name}</label>`);
            });
        }

        switchPanel('editor');
        let content = doc.querySelector('.article-container')?.innerHTML || '';
        const tempDiv = document.createElement('div'); tempDiv.innerHTML = content;
        tempDiv.querySelectorAll('.ad-unit').forEach(el => el.remove());
        tempDiv.querySelectorAll('.author-bio').forEach(el => el.remove());
        tempDiv.querySelectorAll('.share-buttons').forEach(el => el.remove());
        content = tempDiv.innerHTML;
        
        const savedDraft = localStorage.getItem(`draft_${slug}`);
        if(savedDraft && savedDraft !== content) { if(confirm('Restore draft?')) content = savedDraft; }
        initTinyMCE(() => tinymce.activeEditor.setContent(content));
        
        // Schema logic
        document.getElementById('schema-container').innerHTML = '';
        const script = doc.querySelector('script[type="application/ld+json"]');
        let hasArticle = false;
        if(script) {
            const json = JSON.parse(script.innerText);
            (json['@graph'] || [json]).forEach(obj => { if(obj['@type'] === 'Article') hasArticle = true; else renderSchemaBlock(obj['@type'], obj); });
        }
        addDefaultArticleSchema(hasArticle);
        
        const url = resolveMenuLink((type==='post'?'blog/':'')+slug, state.settings.siteUrl);
        document.getElementById('live-link-container').innerHTML = `<a href="${url}" target="_blank" class="btn-secondary btn-xs" style="color:white;text-decoration:none;">View Live</a>`;
        document.getElementById('live-link-container').classList.remove('hidden');
    } catch(e) { showToast(e.message, true); switchPanel('dashboard'); }
    finally { showLoader(false); }
}

async function updateContentIndex(slug, type, title, action = 'update', cats = []) {
    // Reload index to ensure we have latest before modifying
    await loadContentIndex(); 
    
    const now = new Date().toISOString();
    const idx = state.contentIndex.findIndex(i => i.slug === slug && i.type === type);
    
    // Create copy to modify
    const newIndex = [...state.contentIndex];
    
    if (action === 'delete') {
        if (idx > -1) newIndex.splice(idx, 1);
    } else {
        const originalDate = (idx > -1) ? newIndex[idx].date : now;
        const entry = { slug, type, title, date: originalDate, modified: now, cats: cats, desc: document.getElementById('meta-desc').value };
        if (idx > -1) newIndex[idx] = entry; else newIndex.unshift(entry);
    }
    
    // Get SHA again to be safe
    const freshSha = await getLatestFileSha('_cms/index.json');
    const body = { message: 'Update Index', content: b64EncodeUnicode(JSON.stringify(newIndex, null, 2)) };
    if (freshSha) body.sha = freshSha;
    
    const res = await githubReq('contents/_cms/index.json', 'PUT', body);
    
    // Only update local state on success
    state.contentIndex = newIndex;
    state.indexSha = (await res.json()).content.sha;
}

// --- 8. PUBLISHING ---
document.getElementById('save-btn').addEventListener('click', async () => {
    // 1. VALIDATE EDITOR
    if(!tinymce.activeEditor || tinymce.activeEditor.isHidden()) {
        showToast("Editor error. Please refresh.", true);
        return;
    }

    const title = document.getElementById('meta-title').value;
    const slug = document.getElementById('meta-slug').value;
    if(!title || !slug) return showToast("Title & Slug Required", true);
    
    showLoader(true, "Publishing...");
    
    try {
        const isPost = state.currentType === 'post';
        const folder = isPost ? `blog/${slug}` : `${slug}`;
        const path = `${folder}/index.html`;
        const s = state.settings;
        
        // Get Categories
        let selectedCats = [];
        if(isPost && s.structureMode === 'category') {
            document.querySelectorAll('.cat-chk:checked').forEach(c => selectedCats.push(c.value));
        }

        let contentHtml = tinymce.activeEditor.getContent().replace(/src="http:\/\//g, 'src="https://');
        contentHtml = injectAds(contentHtml, slug);
        
        // Share Buttons Injection
        if(s.enableShare && !s.shareExclude.split(',').map(x=>x.trim()).includes(slug)) {
            const shareSvg = `<div class="share-buttons">
                <a href="https://www.facebook.com/sharer/sharer.php?u=${s.siteUrl}/${folder}/" target="_blank" class="share-btn btn-fb" aria-label="Facebook"><svg viewBox="0 0 24 24"><path d="M12 2.04C6.5 2.04 2 6.53 2 12.06C2 17.06 5.66 21.21 10.44 21.96V14.96H7.9V12.06H10.44V9.85C10.44 7.34 11.93 5.96 14.15 5.96C15.21 5.96 16.12 6.04 16.12 6.04V8.51H15.02C13.78 8.51 13.39 9.28 13.39 10.07V12.06H16.18L15.74 14.96H13.39V21.96C18.16 21.21 21.82 17.06 21.82 12.06C21.82 6.53 17.32 2.04 12 2.04Z"/></svg> Share</a>
                <a href="https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${s.siteUrl}/${folder}/" target="_blank" class="share-btn btn-x" aria-label="X"><svg viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg> Post</a>
                <a href="https://www.linkedin.com/shareArticle?mini=true&url=${s.siteUrl}/${folder}/&title=${encodeURIComponent(title)}" target="_blank" class="share-btn btn-in" aria-label="LinkedIn"><svg viewBox="0 0 24 24"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/></svg> Share</a>
                <button onclick="navigator.clipboard.writeText(window.location.href).then(()=>alert('Link Copied!'))" class="share-btn btn-cp"><i class="fa-solid fa-link"></i> Copy</button>
            </div>`;
            contentHtml += shareSvg;
        }

        const fullUrl = resolveMenuLink((isPost?'blog/':'')+slug, s.siteUrl);
        const customCanon = document.getElementById('meta-canonical').value.trim();
        const finalCanon = customCanon || fullUrl;
        
        let bannerUrl = document.getElementById('meta-banner').value;
        if(bannerUrl.startsWith('http://')) bannerUrl = bannerUrl.replace('http://', 'https://');
        const author = (s.authors || []).find(a => a.id === document.getElementById('meta-author-select').value) || { name: 'Admin', image: '', bio: '', socials: [] };
        
        // Auth Socials
        let authSocialsHtml = (author.socials || []).map(soc => `<a href="${ensureExternalUrl(soc.link)}" aria-label="Social"><i class="${soc.icon}"></i></a>`).join('');

        // Featured Img
        const featuredImgHtml = bannerUrl ? `<div class="featured-image-container"><img src="${bannerUrl}" alt="${title}" width="1200" height="628" class="featured-image" fetchpriority="high" decoding="async"></div>` : '';
        const preloadLink = bannerUrl ? `<link rel="preload" as="image" href="${bannerUrl}" fetchpriority="high">` : '';

        // WRITE-TIME SEO
        const entry = state.contentIndex.find(i => i.slug === slug && i.type === state.currentType);
        const datePublished = entry ? entry.date : new Date().toISOString();
        const dateModified = new Date().toISOString();
        const dateStr = new Date(datePublished).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
        const rawText = tinymce.activeEditor.getBody().textContent || "";
        const readTime = (Math.ceil(rawText.trim().split(/\s+/).length / 225) || 1) + " Min Read";

        // BREADCRUMB
        let crumbHtml = '';
        if(isPost) {
            if(s.structureMode === 'category' && selectedCats.length > 0) {
                const firstCatSlug = selectedCats[0];
                const firstCatName = (s.categories||[]).find(c=>c.slug===firstCatSlug)?.name || firstCatSlug;
                crumbHtml = `<a href="../../" style="color:#b0b0b0">Home</a> <span>/</span> <a href="../../category/${firstCatSlug}/" style="color:#b0b0b0">${firstCatName}</a> <span>/</span> ${title}`;
            } else {
                crumbHtml = `<a href="../../" style="color:#b0b0b0">Home</a> <span>/</span> <a href="../" style="color:#b0b0b0">Blog</a> <span>/</span> ${title}`;
            }
        } else {
            crumbHtml = `<a href="../" style="color:#b0b0b0">Home</a> <span>/</span> ${title}`;
        }

        const headerLinks = (s.headerMenu || []).map(l => `<li><a href="${resolveMenuLink(l.link, s.siteUrl)}">${l.label}</a></li>`).join('');
        const footerLinks = (s.footerMenu || []).map(l => `<a href="${resolveMenuLink(l.link, s.siteUrl)}">${l.label}</a>`).join('');
        const globalSocials = (s.socialLinks || []).map(l => `<a href="${ensureExternalUrl(l.link)}"><i class="${l.label}"></i></a>`).join('');

        const schemaJson = generateFinalSchema(finalCanon, title, bannerUrl, author.name, datePublished, dateModified, s.structureMode==='category' && isPost ? selectedCats : null);
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
    <link rel="canonical" href="${finalCanon}">
    <meta property="og:type" content="article">
    <meta property="og:title" content="${title.replace(/"/g, '&quot;')}">
    <meta property="og:description" content="${document.getElementById('meta-desc').value.replace(/"/g, '&quot;')}">
    <meta property="og:image" content="${bannerUrl}">
    <meta property="og:url" content="${finalCanon}">
    <meta property="og:site_name" content="${s.siteTitle}">
    <meta name="twitter:card" content="summary_large_image">
    <meta name="twitter:image:alt" content="${title.replace(/"/g, '&quot;')}">
    ${preloadLink}
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <style>${criticalCss}${s.customCss || ''}</style>
    ${(s.verifications||[]).join('\n')}
    <link rel="stylesheet" href="${isPost?'../../':'../'}admin/fontello.css" media="print" onload="this.media='all'">
    <noscript><link rel="stylesheet" href="${isPost?'../../':'../'}admin/fontello.css"></noscript>
    ${s.customHeadJs || ''}${s.adsenseAuto || ''}
    <script>
      const loadAnalytics = () => {
        const script = document.createElement('script'); script.src = 'https://www.googletagmanager.com/gtag/js?id=${s.gaId}'; script.async = true;
        document.head.appendChild(script); window.dataLayer = window.dataLayer || []; function gtag(){dataLayer.push(arguments);} gtag('js', new Date()); gtag('config', '${s.gaId}');
      };
      if('${s.gaId}') { window.addEventListener('scroll', loadAnalytics, {once:true}); window.addEventListener('mousemove', loadAnalytics, {once:true}); window.addEventListener('touchstart', loadAnalytics, {once:true}); }
    </script>
    <script type="application/ld+json">${schemaJson}</script>
</head>
<body>
    <div class="progress-bar" id="progressBar"></div>
    <header class="site-header">
        <nav><a href="${s.siteUrl}" class="logo">${s.siteTitle}</a><ul class="nav-links">${headerLinks}</ul><div class="burger"><div class="line1"></div><div class="line2"></div><div class="line3"></div></div></nav>
    </header>
    ${getAdCode('header_bottom', slug)}
    <main>
        <section class="page-header-section">
            <div class="breadcrumbs" ${document.getElementById('include-breadcrumb-schema').checked?'':'style="display:none"'}>${crumbHtml}</div>
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
        <div class="footer-container"><nav class="footer-nav">${footerLinks}</nav><div class="footer-social">${globalSocials}</div></div>
        <div class="footer-bottom"><p>${s.copyright || ''}</p></div>
    </footer>
    ${getStickyAds(slug)}
    <script src="${isPost?'../../':'../'}assets/js/article.js" defer></script>
</body></html>`;

        if(state.currentSlug && state.currentSlug !== slug) {
            const oldPath = isPost ? `blog/${state.currentSlug}/index.html` : `${state.currentSlug}/index.html`;
            const oldSha = await getLatestFileSha(oldPath);
            if(oldSha) {
                await githubReq(`contents/${oldPath}`, 'DELETE', { message: 'Move', sha: oldSha });
                await updateContentIndex(state.currentSlug, state.currentType, null, 'delete');
            }
            state.currentSha = null;
        }
        
        // FETCH LATEST SHA FOR THE HTML FILE
        const freshSha = await getLatestFileSha(path);
        const bodyReq = { message: `Update ${slug}`, content: b64EncodeUnicode(html) };
        if(freshSha) bodyReq.sha = freshSha;
        else if(state.currentSha && state.currentSlug === slug) bodyReq.sha = state.currentSha;
        
        await githubReq(`contents/${path}`, 'PUT', bodyReq);
        
        // Update index with new data
        await updateContentIndex(slug, state.currentType, title, 'update', selectedCats);
        
        if(isPost && s.structureMode === 'category') {
            await generateCategoryPages(s, headerLinks, footerLinks, globalSocials);
        }

        await generateSitemaps(s);

        localStorage.removeItem(`draft_${slug}`);
        if(tinymce.activeEditor) tinymce.activeEditor.setDirty(false);
        state.currentSlug = slug;
        showToast("Published Successfully!");
        document.getElementById('live-link-container').innerHTML = `<a href="${fullUrl}" target="_blank" class="btn-secondary btn-xs" style="color:white;text-decoration:none;">View Live</a>`;
        document.getElementById('live-link-container').classList.remove('hidden');

    } catch(e) {
        console.error(e);
        showToast("Publish Error: " + e.message, true);
    } finally {
        showLoader(false);
    }
});

// GENERATE CATEGORY PAGES
async function generateCategoryPages(s, headerLinks, footerLinks, globalSocials) {
    const categories = s.categories || [];
    const posts = state.contentIndex.filter(i => i.type === 'post').sort((a,b) => new Date(b.date) - new Date(a.date));
    
    for (const cat of categories) {
        const catPosts = posts.filter(p => (p.cats || []).includes(cat.slug));
        const path = `category/${cat.slug}/index.html`;
        
        let gridHtml = '';
        if(catPosts.length === 0) gridHtml = '<p style="text-align:center;padding:50px;">No posts found.</p>';
        else {
            gridHtml = `<div class="cat-grid" id="cat-grid">`;
            catPosts.forEach(p => {
                const date = new Date(p.date).toLocaleDateString();
                gridHtml += `<div class="cat-card"><div class="cat-img-box"><a href="../../blog/${p.slug}/"><img src="${s.favicon}" alt="${p.title}"></a></div><div class="cat-content"><span class="cat-date">${date}</span><a href="../../blog/${p.slug}/" style="text-decoration:none"><h2 class="cat-title">${p.title}</h2></a><p class="cat-excerpt">${p.desc || ''}</p><a href="../../blog/${p.slug}/" class="cat-btn">Read More</a></div></div>`;
            });
            gridHtml += `</div><div id="pagination" class="pagination"></div>`;
        }

        const html = `<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>${cat.name} - ${s.siteTitle}</title><link rel="stylesheet" href="../../assets/css/article.css"><style>${s.customCss||''}</style></head><body>
        <header class="site-header"><nav><a href="${s.siteUrl}" class="logo">${s.siteTitle}</a><ul class="nav-links">${headerLinks.replace(/\.\.\//g, '../../')}</ul><div class="burger"><div></div><div></div><div></div></div></nav></header>
        <main style="min-height:60vh;padding-top:40px;">
            <section class="page-header-section" style="text-align:center"><h1 class="page-title">${cat.name}</h1><div class="breadcrumbs"><a href="../../">Home</a> / Categories / ${cat.name}</div></section>
            ${gridHtml}
        </main>
        <footer class="site-footer"><div class="footer-container"><nav class="footer-nav">${footerLinks.replace(/\.\.\//g, '../../')}</nav><div class="footer-social">${globalSocials}</div></div><div class="footer-bottom"><p>${s.copyright}</p></div></footer>
        <script src="../../assets/js/article.js" defer></script></body></html>`;

        const sha = await getLatestFileSha(path);
        if (sha) {
             await githubReq(`contents/${path}`, 'PUT', { message: `Up Cat ${cat.slug}`, content: b64EncodeUnicode(html), sha: sha });
        } else {
             await githubReq(`contents/${path}`, 'PUT', { message: `Init Cat ${cat.slug}`, content: b64EncodeUnicode(html) });
        }
    }
}

// GENERATE SITEMAPS
async function generateSitemaps(s) {
    const posts = state.contentIndex.filter(i => i.type === 'post');
    const pages = state.contentIndex.filter(i => i.type === 'page');
    const excludes = (s.sitemapExclude || '').split(',').map(x=>x.trim());
    
    let xml = `<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">`;
    [...posts, ...pages].forEach(p => {
        if(excludes.includes(p.slug)) return;
        const url = `${s.siteUrl}/${p.type==='post'?'blog/':''}${p.slug}/`;
        xml += `<url><loc>${url}</loc><lastmod>${p.modified.split('T')[0]}</lastmod></url>`;
    });
    if(s.structureMode === 'category') {
        (s.categories||[]).forEach(c => {
            xml += `<url><loc>${s.siteUrl}/category/${c.slug}/</loc><lastmod>${new Date().toISOString().split('T')[0]}</lastmod></url>`;
        });
    }
    xml += `</urlset>`;
    const smSha = await getLatestFileSha('sitemap.xml');
    await githubReq('contents/sitemap.xml', 'PUT', { message: 'Up Sitemap', content: b64EncodeUnicode(xml), sha: smSha });

    if(s.newsCategory) {
        let newsXml = `<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:news="http://www.google.com/schemas/sitemap-news/0.9">`;
        const cutoff = new Date().getTime() - (48 * 60 * 60 * 1000);
        const newsPosts = posts.filter(p => (p.cats||[]).includes(s.newsCategory) && new Date(p.date).getTime() > cutoff);
        newsPosts.forEach(p => {
            const url = `${s.siteUrl}/blog/${p.slug}/`;
            newsXml += `<url><loc>${url}</loc><news:news><news:publication><news:name>${document.getElementById('set-news-pub-name').value || s.siteTitle}</news:name><news:language>en</news:language></news:publication><news:publication_date>${p.date}</news:publication_date><news:title>${p.title}</news:title></news:news></url>`;
        });
        newsXml += `</urlset>`;
        const nsSha = await getLatestFileSha('sitemap-news.xml');
        await githubReq('contents/sitemap-news.xml', 'PUT', { message: 'Up News Sitemap', content: b64EncodeUnicode(newsXml), sha: nsSha });
    }
}

async function loadSidebarMedia(){
    const g=document.getElementById('sidebar-media-grid'); g.innerHTML='...';
    try {
        const r = await githubReq('contents/images');
        if(!r) { g.innerHTML='Empty'; return; }
        let data = await r.json();
        data.sort((a,b) => b.name.localeCompare(a.name)); 
        const siteUrl = state.settings.siteUrl || `https://${state.owner}.github.io/${state.repo}`;
        g.innerHTML = data.filter(x=>x.name.match(/\.(jpg|png|webp|gif)$/i)).map(x => 
            `<div class="side-media-item" onclick="navigator.clipboard.writeText('${siteUrl}/images/${x.name}');showToast('Link Copied!')">
                <img src="${x.download_url}"><button class="side-media-delete" onclick="event.stopPropagation();deleteMedia('${x.sha}','${x.name}')">X</button>
            </div>`).join('');
    } catch(e) { g.innerHTML='Err'; }
}

async function deleteMedia(sha, name) { if(confirm('Delete?')) await githubReq(`contents/images/${name}`, 'DELETE', {message:'del', sha}); loadSidebarMedia(); }
function setupFeaturedImageDrop() { const w=document.getElementById('featured-dropzone'); w.ondragover=e=>{e.preventDefault();w.classList.add('dragover')}; w.ondragleave=()=>w.classList.remove('dragover'); w.ondrop=e=>{e.preventDefault();w.classList.remove('dragover'); if(e.dataTransfer.files.length) uploadFile(e.dataTransfer.files[0], u=>{document.getElementById('meta-banner').value=u;document.getElementById('banner-preview').src=u;document.getElementById('banner-preview').classList.remove('hidden')}); }; document.getElementById('meta-banner').oninput = function() { const v=this.value; const p=document.getElementById('banner-preview'); p.src=v; p.classList.toggle('hidden', !v); } }
function setupSidebarUpload() { const d=document.getElementById('sidebar-dropzone'), i=document.getElementById('sidebar-file-input'); d.onclick=()=>i.click(); d.ondragover=e=>{e.preventDefault();d.style.borderColor='#00aaff'}; d.ondragleave=()=>d.style.borderColor='#444'; d.ondrop=e=>{e.preventDefault();d.style.borderColor='#444';if(e.dataTransfer.files.length){showToast('Uploading...');Array.from(e.dataTransfer.files).forEach(f=>uploadFile(f));}}; i.onchange=()=>{showToast('Uploading...');Array.from(i.files).forEach(f=>uploadFile(f));}; }
async function uploadFile(f,cb){ const r=new FileReader(); r.readAsDataURL(f); r.onload=async()=>{ const b=r.result.split(',')[1]; const p=`images/${Date.now()}-${f.name.replace(/\s/g,'-')}`; await githubReq(`contents/${p}`,'PUT',{message:'Up',content:b}); loadSidebarMedia(); const siteUrl = state.settings.siteUrl || `https://${state.owner}.github.io/${state.repo}`; if(cb) cb(`${siteUrl}/${p}`); showToast('Done'); }; }
function generateFinalSchema(url, headline, image, authName, datePublished, dateModified, cats) {
    const graph = [];
    if(document.getElementById('include-article-schema').checked) graph.push({"@type": "Article", "headline": headline, "image": [image], "author": { "@type": "Person", "name": authName }, "datePublished": datePublished, "dateModified": dateModified });
    const itemList = [{"@type":"ListItem","position":1,"name":"Home","item":state.settings.siteUrl}];
    if(cats && cats.length > 0) {
        const catName = (state.settings.categories.find(c=>c.slug===cats[0])||{}).name || cats[0];
        itemList.push({"@type":"ListItem","position":2,"name":catName,"item":state.settings.siteUrl+'/category/'+cats[0]+'/'});
        itemList.push({"@type":"ListItem","position":3,"name":headline,"item":url});
    } else {
        itemList.push({"@type":"ListItem","position":2,"name":"Blog","item":state.settings.siteUrl+'/blog/'});
        itemList.push({"@type":"ListItem","position":3,"name":headline,"item":url});
    }
    if(document.getElementById('include-breadcrumb-schema').checked) graph.push({"@type": "BreadcrumbList", "itemListElement": itemList});
    
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
// LIST HELPERS
function toggleAll(tbodyId, master) { document.querySelectorAll(`#${tbodyId} input[type="checkbox"]`).forEach(c => c.checked = master.checked); toggleBulkBtn(tbodyId.includes('post') ? 'post' : 'page'); }
function toggleBulkBtn(type) { document.getElementById(`bulk-del-${type}s`).classList.toggle('hidden', document.querySelectorAll(`.chk-${type}:checked`).length === 0); }
function filterTable(tbodyId, q) { const rows = document.getElementById(tbodyId).getElementsByTagName('tr'); for(let r of rows) r.style.display = r.textContent.toLowerCase().includes(q.toLowerCase()) ? '' : 'none'; }
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
function injectAds(html, slug) {
    const ads = state.settings.ads || [];
    let modified = html;
    function isExcluded(ad, slug) { return ad.exclude && ad.exclude.split(',').map(s=>s.trim()).includes(slug); }
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
function getAdCode(place, slug) {
    const ads = state.settings.ads || [];
    const ad = ads.find(a => a.placement === place && !(a.exclude && a.exclude.split(',').map(s=>s.trim()).includes(slug)));
    if(ad && ad.code && ad.code.trim().length > 0) return `<div class="ad-unit">${ad.code}</div>`;
    return '';
}
function getStickyAds(slug) {
    const ads = state.settings.ads || [];
    let html = '';
    const l = ads.find(a => a.placement === 'sticky_left' && !(a.exclude && a.exclude.split(',').map(s=>s.trim()).includes(slug)));
    if(l && l.code.trim()) html += `<div class="ad-sticky-left">${l.code}</div>`;
    const r = ads.find(a => a.placement === 'sticky_right' && !(a.exclude && a.exclude.split(',').map(s=>s.trim()).includes(slug)));
    if(r && r.code.trim()) html += `<div class="ad-sticky-right">${r.code}</div>`;
    const f = ads.find(a => a.placement === 'sticky_footer' && !(a.exclude && a.exclude.split(',').map(s=>s.trim()).includes(slug)));
    if(f && f.code.trim()) html += `<div class="ad-sticky-footer" id="stky-ftr"><button class="ad-close" onclick="document.getElementById('stky-ftr').remove()">Close X</button>${f.code}</div>`;
    return html;
}
function initTinyMCE(cb) { 
    if(tinymce.get('tinymce-editor')) tinymce.get('tinymce-editor').remove(); 
    tinymce.init({ 
        selector: '#tinymce-editor', 
        skin: 'oxide-dark', 
        content_css: 'dark', 
        height: '100%', 
        auto_focus: 'tinymce-editor',
        plugins: 'preview searchreplace autolink autosave save directionality code visualblocks visualchars fullscreen image link media template codesample table charmap pagebreak nonbreaking anchor insertdatetime advlist lists wordcount help charmap quickbars emoticons', 
        toolbar: 'undo redo | blocks | bold italic | align | bullist numlist | link image media | code', 
        setup: (e) => { 
            e.on('init', () => {
                e.getBody().style.fontSize = '1.1rem';
                if(cb) cb();
            }); 
            e.on('change', () => e.save()); 
        } 
    }); 
}
function handleAutoSave() {
    if(state.currentSlug && tinymce.activeEditor && tinymce.activeEditor.isDirty()) {
        const content = tinymce.activeEditor.getContent();
        localStorage.setItem(`draft_${state.currentSlug}`, content);
        const msg = document.getElementById('auto-draft-msg');
        if(msg) { msg.innerText = "Draft Saved"; setTimeout(()=>msg.innerText="", 2000); }
    }
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
