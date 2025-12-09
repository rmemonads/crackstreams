/**
 * ULTIMATE SERVERLESS CMS - FINAL PRODUCTION VERSION
 * Features: Auto-Install Assets, Auto-Draft, Ad Manager, Safe Save, Responsive
 */

// --- EMBEDDED ASSETS (Will be installed to repo on init) ---
// This ensures your article.css and article.js are always on the live site.
const SYSTEM_ASSETS = {
    "assets/css/article.css": `
:root { --primary-color: #00aaff; --background-color: #121212; --surface-color: #1e1e1e; --text-color: #e0e0e0; --text-color-secondary: #a0a0a0; --font-family: 'Poppins', sans-serif; }
* { margin: 0; padding: 0; box-sizing: border-box; }
html { scroll-behavior: smooth; overflow-x: hidden; }
body { font-family: var(--font-family); background-color: var(--background-color); color: var(--text-color); line-height: 1.8; overflow-x: hidden; }
a { color: var(--primary-color); text-decoration: none; transition: color 0.3s ease; }
a:hover { text-decoration: underline; }
.progress-bar { position: fixed; top: 0; left: 0; width: 0%; height: 4px; background: linear-gradient(90deg, var(--primary-color), #0077b6); z-index: 1000; transition: width 0.1s linear; }
.site-header nav { display: flex; justify-content: space-between; align-items: center; padding: 1.5rem 5%; background-color: var(--background-color); border-bottom: 1px solid #2a2a2a; }
.logo { font-weight: 700; font-size: 1.5rem; color: #fff; text-decoration: none; }
.nav-links { display: flex; justify-content: space-around; list-style: none; }
.nav-links li { margin: 0 1rem; }
.nav-links a { color: var(--text-color); text-decoration: none; font-weight: 600; font-size: 1rem; }
.burger { display: none; cursor: pointer; }
.burger div { width: 25px; height: 3px; background-color: var(--text-color); margin: 5px; transition: 0.3s ease; }
.blog-header { max-width: 800px; margin: 6rem auto 2rem; padding: 0 1.5rem; }
.breadcrumbs { font-size: 0.85rem; color: var(--text-color-secondary); margin-bottom: 1rem; text-transform: capitalize; display: flex; gap: 0.5rem; }
.blog-title { font-size: clamp(1.8rem, 5vw, 3rem); font-weight: 700; color: #fff; line-height: 1.3; margin-bottom: 1.5rem; }
.blog-meta { display: flex; flex-wrap: wrap; gap: 0.8rem; font-size: 0.9rem; color: var(--text-color-secondary); margin-bottom: 2rem; border-bottom: 1px solid #2a2a2a; padding-bottom: 2rem; }
.banner-container { max-width: 900px; margin: 0 auto 3rem; padding: 0 1rem; }
.banner-image { width: 100%; height: auto; aspect-ratio: 16/9; object-fit: cover; border-radius: 12px; box-shadow: 0 10px 30px rgba(0,0,0,0.5); border: 1px solid #2a2a2a; background: #1e1e1e; }
.article-content { max-width: 800px; margin: 0 auto 4rem; padding: 0 1.5rem; }
.article-content p { margin-bottom: 1.8rem; font-size: 1.1rem; color: #dcdcdc; }
.article-content h2 { font-size: clamp(1.5rem, 4vw, 2rem); margin-top: 3.5rem; margin-bottom: 1.5rem; color: #fff; padding-left: 1rem; border-left: 4px solid var(--primary-color); }
.article-content h3 { font-size: 1.4rem; margin-top: 2.5rem; margin-bottom: 1rem; color: #fff; }
.article-content img { max-width: 100%; height: auto; border-radius: 8px; margin: 2rem 0; }
.author-bio-box { max-width: 800px; margin: 4rem auto; padding: 2rem; background: var(--surface-color); border-radius: 12px; display: flex; align-items: center; gap: 1.5rem; border: 1px solid #2a2a2a; }
.author-bio-box img { width: 100px; height: 100px; border-radius: 50%; object-fit: cover; border: 2px solid var(--primary-color); }
.site-footer { background: #0c0c0c; color: var(--text-color-secondary); padding: 3rem 5%; margin-top: 4rem; border-top: 1px solid #2a2a2a; }
.footer-container { display: flex; justify-content: space-between; flex-wrap: wrap; gap: 2rem; }
.footer-nav a, .footer-social a { color: var(--text-color-secondary); margin-right: 1.5rem; }
@media(max-width: 768px) {
    .nav-links { position: fixed; right: 0; top: 0; height: 100vh; background: var(--surface-color); flex-direction: column; width: 75%; transform: translateX(100%); transition: 0.5s; z-index: 100; border-left: 1px solid #333; }
    .nav-active { transform: translateX(0%); }
    .burger { display: block; z-index: 101; }
    .blog-header { margin-top: 5rem; }
}
/* AD STYLES */
.ad-unit { margin: 2rem 0; text-align: center; clear: both; }
.ad-header { margin-top: 20px; margin-bottom: 20px; display: flex; justify-content: center; }
.ad-sticky-left { position: fixed; top: 100px; left: 10px; width: 160px; height: 600px; z-index: 90; }
.ad-sticky-right { position: fixed; top: 100px; right: 10px; width: 160px; height: 600px; z-index: 90; }
.ad-sticky-footer { position: fixed; bottom: 0; left: 0; width: 100%; background: #000; z-index: 999; display: flex; justify-content: center; padding: 10px; border-top: 1px solid #333; }
@media(max-width: 1200px) { .ad-sticky-left, .ad-sticky-right { display: none; } }
`,
    "assets/js/article.js": `
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
        const words = content.innerText.trim().split(/\s+/).length;
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
`
};

const state = {
    token: null, owner: null, repo: null,
    currentType: 'post', currentSlug: null, currentSha: null,
    settings: {}, settingsSha: null,
    autosaveInterval: null,
    pagesList: []
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
    }
    
    setupSidebarEvents();
    setupSidebarUpload();
    setupFeaturedImageDrop();
    
    // Auto-save loop
    setInterval(handleAutoSave, 10000); // Check every 10s
});

async function initApp() {
    document.getElementById('login-view').classList.remove('active');
    document.getElementById('app-view').classList.add('active');
    
    showLoader(true, "Checking System Files...");
    await ensureDirectories();
    await ensureSystemFiles(); // Upload CSS/JS if missing
    
    showLoader(true, "Loading Settings...");
    await loadGlobalSettings();
    
    switchPanel('dashboard');
    showLoader(false);
}

// --- SYSTEM CHECKS ---
async function ensureDirectories() {
    // Ensure folders exist by checking or creating a dummy file
    const folders = ['blog', 'assets/css', 'assets/js', 'images', '_cms'];
    for(const f of folders) {
        // We can't strictly "create folder", so we rely on uploads. 
        // But we can check if we can read them.
    }
}

async function ensureSystemFiles() {
    for (const [path, content] of Object.entries(SYSTEM_ASSETS)) {
        const sha = await getLatestFileSha(path);
        // Only upload if it doesn't exist (returns null)
        if (!sha) {
            try {
                await githubReq(`contents/${path}`, 'PUT', {
                    message: `Init System File: ${path}`,
                    content: b64EncodeUnicode(content)
                });
                console.log(`Created ${path}`);
            } catch(e) { console.error(`Failed to create ${path}`, e); }
        }
    }
}

function switchPanel(id) {
    document.querySelectorAll('.panel').forEach(p => p.classList.remove('active'));
    document.getElementById(`panel-${id}`).classList.add('active');
    document.querySelectorAll('.nav-item').forEach(b => b.classList.remove('active'));
    const navId = `nav-btn-${id}`;
    if(document.getElementById(navId)) document.getElementById(navId).classList.add('active');

    if(id === 'dashboard') loadPosts();
    if(id === 'pages') loadPages();
    if(id === 'settings') loadPagesForSelect();
}

function setupSidebarEvents() {
    document.getElementById('sidebar-toggle-btn').addEventListener('click', () => {
        document.getElementById('main-sidebar').classList.toggle('collapsed');
    });
}

// --- AUTH ---
document.getElementById('login-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const t = document.getElementById('gh-token').value.trim();
    const o = document.getElementById('gh-owner').value.trim();
    const r = document.getElementById('gh-repo').value.trim();

    try {
        const res = await fetch(`https://api.github.com/repos/${o}/${r}`, {
            headers: { Authorization: `Bearer ${t}` }
        });
        if (!res.ok) throw new Error('Repo not found or Token invalid');
        localStorage.setItem('gh_token', t); localStorage.setItem('gh_owner', o); localStorage.setItem('gh_repo', r);
        state.token = t; state.owner = o; state.repo = r;
        initApp();
    } catch (err) { showToast(err.message, true); }
});

document.getElementById('nav-logout').addEventListener('click', () => {
    localStorage.clear(); location.reload();
});

// --- API ---
async function githubReq(endpoint, method = 'GET', body = null) {
    const opts = {
        method,
        headers: { Authorization: `Bearer ${state.token}`, Accept: 'application/vnd.github.v3+json', 'Content-Type': 'application/json' }
    };
    if (body) opts.body = JSON.stringify(body);
    const res = await fetch(`https://api.github.com/repos/${state.owner}/${state.repo}/${endpoint}`, opts);
    if (!res.ok && method === 'GET' && res.status === 404) return null;
    if (!res.ok) { const err = await res.json().catch(()=>({})); throw new Error(err.message || res.statusText); }
    return res;
}

async function getLatestFileSha(path) {
    try {
        const res = await githubReq(`contents/${path}`, 'GET');
        return res ? (await res.json()).sha : null;
    } catch (e) { return null; }
}

// --- GLOBAL SETTINGS ---
async function loadGlobalSettings() {
    try {
        const res = await githubReq('contents/_cms/settings.json');
        if(res) {
            const data = await res.json();
            state.settingsSha = data.sha;
            state.settings = JSON.parse(b64DecodeUnicode(data.content));
        }
        populateSettingsForm();
    } catch(e) { console.log('New Settings'); }
}

function populateSettingsForm() {
    const s = state.settings || {};
    document.getElementById('set-site-title').value = s.siteTitle || '';
    document.getElementById('set-site-url').value = s.siteUrl || '';
    document.getElementById('set-favicon').value = s.favicon || '';
    document.getElementById('set-ga-id').value = s.gaId || '';
    document.getElementById('set-adsense-auto').value = s.adsenseAuto || '';
    document.getElementById('set-custom-css').value = s.customCss || '';
    document.getElementById('set-custom-head-js').value = s.customHeadJs || '';
    document.getElementById('set-404-redirect').checked = s.enable404 || false;
    
    // Verifications
    document.getElementById('meta-verify-container').innerHTML = '';
    (s.verifications || []).forEach(v => addMetaVerifyItem(v.name, v.content));

    // Ads
    document.getElementById('ads-repeater-container').innerHTML = '';
    (s.ads || []).forEach(ad => addAdUnit(ad));
}

async function loadPagesForSelect() {
    const sel = document.getElementById('set-homepage-select');
    sel.innerHTML = '<option>Loading...</option>';
    try {
        await loadPages(); // updates state.pagesList
        sel.innerHTML = '<option value="">-- Select a Page --</option>';
        state.pagesList.forEach(p => {
            const opt = document.createElement('option');
            opt.value = p; opt.innerText = p;
            if(state.settings.homepage === p) opt.selected = true;
            sel.appendChild(opt);
        });
    } catch(e) { sel.innerHTML = '<option>Error loading pages</option>'; }
}

async function saveGlobalSettings() {
    showLoader(true, "Saving Settings...");
    
    const ads = [];
    document.querySelectorAll('.ad-unit-block').forEach(b => {
        ads.push({
            code: b.querySelector('.ad-code-input').value,
            placement: b.querySelector('.ad-place-input').value,
            exclude: b.querySelector('.ad-exclude-input').value
        });
    });

    const verifications = [];
    document.querySelectorAll('.meta-item-row').forEach(r => {
        const n = r.querySelector('.meta-name').value;
        const c = r.querySelector('.meta-content').value;
        if(n && c) verifications.push({ name: n, content: c });
    });

    const s = {
        siteTitle: document.getElementById('set-site-title').value,
        siteUrl: document.getElementById('set-site-url').value,
        favicon: document.getElementById('set-favicon').value,
        homepage: document.getElementById('set-homepage-select').value,
        enable404: document.getElementById('set-404-redirect').checked,
        gaId: document.getElementById('set-ga-id').value,
        adsenseAuto: document.getElementById('set-adsense-auto').value,
        customCss: document.getElementById('set-custom-css').value,
        customHeadJs: document.getElementById('set-custom-head-js').value,
        ads: ads,
        verifications: verifications
    };
    state.settings = s;

    try {
        // 1. Save Settings
        const body = { message: 'Update Settings', content: b64EncodeUnicode(JSON.stringify(s, null, 2)) };
        if(state.settingsSha) body.sha = state.settingsSha;
        const res = await githubReq('contents/_cms/settings.json', 'PUT', body);
        state.settingsSha = await res.json().then(d => d.content.sha);

        // 2. Handle Homepage (Copy selected page content to index.html)
        if(s.homepage) {
            const pageRes = await githubReq(`contents/${s.homepage}/index.html`);
            if(pageRes) {
                const pageData = await pageRes.json();
                let indexSha = await getLatestFileSha('contents/index.html');
                await githubReq('contents/index.html', 'PUT', {
                    message: `Set homepage to ${s.homepage}`,
                    content: pageData.content,
                    sha: indexSha
                });
            }
        }
        showToast('Settings Saved!');
    } catch(e) { showToast(e.message, true); }
    finally { showLoader(false); }
}

// --- DATA LISTS ---
async function loadPosts() { renderList('contents/blog', 'posts-list-body', 'post'); }
async function loadPages() { 
    state.pagesList = []; 
    await renderList('contents', 'pages-list-body', 'page'); 
}

async function renderList(endpoint, tbodyId, type) {
    const tbody = document.getElementById(tbodyId);
    tbody.innerHTML = '<tr><td colspan="3">Loading...</td></tr>';
    try {
        const res = await githubReq(endpoint);
        if(!res) { tbody.innerHTML = '<tr><td colspan="3">None found.</td></tr>'; return; }
        const data = await res.json();
        const restricted = ['blog', 'images', 'admin', 'css', 'js', '.git', '_cms', 'assets'];
        const folders = data.filter(item => item.type === 'dir' && !restricted.includes(item.name));
        
        let html = '';
        folders.forEach(f => {
            if(type === 'page') state.pagesList.push(f.name);
            html += `<tr><td><strong>${f.name}</strong></td><td>/${f.name}/</td><td>
                <button class="btn-primary btn-xs" onclick="editContent('${type}', '${f.name}')">Edit</button> 
                <button class="btn-secondary btn-xs" style="background:red" onclick="deleteContent('${type}', '${f.name}')">Del</button>
            </td></tr>`;
        });
        tbody.innerHTML = html || '<tr><td colspan="3">Empty.</td></tr>';
    } catch(e) { tbody.innerHTML = `<tr><td colspan="3">${e.message}</td></tr>`; }
}

function filterTable(tbodyId, query) {
    const rows = document.getElementById(tbodyId).getElementsByTagName('tr');
    for(let r of rows) {
        const txt = r.textContent.toLowerCase();
        r.style.display = txt.includes(query.toLowerCase()) ? '' : 'none';
    }
}

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
    addDefaultArticleSchema(true);

    switchPanel('editor');
    initTinyMCE(() => {
        if(tinymce.activeEditor) tinymce.activeEditor.setContent('');
    });
    
    // Auto-slug
    document.getElementById('meta-title').oninput = function() { 
        if(!state.currentSlug) document.getElementById('meta-slug').value = slugify(this.value); 
    };
    switchSidebarTab('settings');
}

async function editContent(type, slug) {
    showLoader(true, "Loading Editor...");
    state.currentType = type; state.currentSlug = slug;
    
    // Check local draft first
    const draft = localStorage.getItem(`cms_draft_${slug}`);
    
    try {
        const path = type === 'post' ? `blog/${slug}/index.html` : `${slug}/index.html`;
        const res = await githubReq(`contents/${path}`);
        if(!res) throw new Error("File not found");
        const data = await res.json();
        state.currentSha = data.sha;
        
        const doc = new DOMParser().parseFromString(b64DecodeUnicode(data.content), 'text/html');
        
        // Parse Meta
        const titleFull = doc.querySelector('title')?.innerText || '';
        const title = titleFull.split(' - ')[0]; // Basic split attempt
        document.getElementById('meta-title').value = title;
        document.getElementById('meta-slug').value = slug;
        document.getElementById('meta-desc').value = doc.querySelector('meta[name="description"]')?.content || '';
        const img = doc.querySelector('meta[property="og:image"]')?.content || '';
        document.getElementById('meta-banner').value = img;
        if(img) {
            document.getElementById('banner-preview').src = img;
            document.getElementById('banner-preview').classList.remove('hidden');
        }

        switchPanel('editor');
        initTinyMCE(() => {
            // If draft exists and is newer? Hard to tell time, but we can ask user.
            // For now, just load server content.
            const content = doc.querySelector('.article-content')?.innerHTML || '';
            tinymce.activeEditor.setContent(content);
        });

        // Schema
        document.getElementById('schema-container').innerHTML = '';
        const script = doc.querySelector('script[type="application/ld+json"]');
        let hasArticle = false;
        if(script) {
            const json = JSON.parse(script.innerText);
            const graph = json['@graph'] || (Array.isArray(json) ? json : [json]);
            graph.forEach(obj => {
                if(obj['@type'] === 'Article') hasArticle = true;
                else renderSchemaBlock(obj['@type'], obj);
            });
        }
        addDefaultArticleSchema(hasArticle);
        
        // Live Link
        const url = `${state.settings.siteUrl || `https://${state.owner}.github.io/${state.repo}`}/${type==='post'?'blog/':''}${slug}/`;
        document.getElementById('live-link-container').innerHTML = `<a href="${url}" target="_blank" class="btn-secondary btn-xs" style="color:white;text-decoration:none;">View Live</a>`;
        document.getElementById('live-link-container').classList.remove('hidden');

    } catch(e) { showToast(e.message, true); switchPanel('dashboard'); }
    finally { showLoader(false); }
}

function handleAutoSave() {
    if(!tinymce.activeEditor || document.getElementById('panel-editor').style.display === 'none') return;
    if(tinymce.activeEditor.isDirty()) {
        const slug = document.getElementById('meta-slug').value;
        if(slug) {
            const content = tinymce.activeEditor.getContent();
            localStorage.setItem(`cms_draft_${slug}`, content);
            const span = document.getElementById('auto-draft-msg');
            span.innerText = "Draft saved locally...";
            setTimeout(()=>span.innerText='', 2000);
        }
    }
}

// --- SAVING ---
document.getElementById('save-btn').addEventListener('click', async () => {
    const title = document.getElementById('meta-title').value;
    const slug = document.getElementById('meta-slug').value;
    if(!title || !slug) return showToast("Title & Slug Required", true);
    
    showLoader(true, "Publishing...");
    
    const isPost = state.currentType === 'post';
    const folder = isPost ? `blog/${slug}` : `${slug}`;
    const path = `${folder}/index.html`;

    // 1. Generate Content
    let contentHtml = tinymce.activeEditor.getContent();
    contentHtml = injectAds(contentHtml, slug);

    const siteTitle = state.settings.siteTitle || '';
    const siteUrl = state.settings.siteUrl || `https://${state.owner}.github.io/${state.repo}`;
    const fullUrl = `${siteUrl}/${isPost?'blog/':''}${slug}/`;
    
    // Page Title Logic: Posts = "Title", Pages = "Title - SiteName"
    const pageTitleTag = isPost ? title : `${title} - ${siteTitle}`;
    
    // CSS Path: Pages are at root/slug/index.html -> needs ../assets
    // Posts are at root/blog/slug/index.html -> needs ../../assets
    const assetPath = isPost ? '../../assets' : '../assets';

    const verifications = (state.settings.verifications || []).map(v => `<meta name="${v.name}" content="${v.content}">`).join('\n');
    const schemaJson = generateFinalSchema(fullUrl, title, document.getElementById('meta-banner').value);

    const html = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${pageTitleTag}</title>
    <meta name="description" content="${document.getElementById('meta-desc').value}">
    <link rel="icon" href="${state.settings.favicon || ''}">
    <link rel="canonical" href="${fullUrl}">
    <meta property="og:image" content="${document.getElementById('meta-banner').value}">
    ${verifications}
    <link rel="stylesheet" href="${assetPath}/css/article.css">
    <style>${state.settings.customCss || ''}</style>
    ${state.settings.customHeadJs || ''}
    ${state.settings.adsenseAuto || ''}
    ${generateLazyAnalytics()}
    <script type="application/ld+json">${schemaJson}</script>
</head>
<body>
    <div class="progress-bar" id="progressBar"></div>

    <header class="site-header">
        <nav>
            <a href="${siteUrl}" class="logo">${siteTitle}</a>
            <div class="burger">
                <div class="line1"></div><div class="line2"></div><div class="line3"></div>
            </div>
            <ul class="nav-links">
                <li><a href="${siteUrl}">Home</a></li>
                <li><a href="${siteUrl}/blog/">Blog</a></li>
            </ul>
        </nav>
    </header>

    ${getAdCode('header_bottom', slug)}

    <div class="blog-header">
        <div class="breadcrumbs">
            <a href="${siteUrl}">Home</a> <span>/</span> <span id="dynamicBreadcrumbSlug"></span>
        </div>
        <h1 class="blog-title">${title}</h1>
        <div class="blog-meta">
            <span class="author-name">By ${document.getElementById('meta-author').value}</span>
            <span class="meta-separator">•</span>
            <span id="dynamicDate"></span>
            <span class="meta-separator">•</span>
            <span id="dynamicReadingTime"></span>
        </div>
    </div>

    <div class="banner-container">
        <img id="dynamicBannerImage" class="banner-image" alt="${title}" src="${document.getElementById('meta-banner').value}">
    </div>

    <article class="article-content">
        ${contentHtml}
    </article>

    ${getAdCode('end', slug)}

    <div class="author-bio-box">
        <img src="https://ui-avatars.com/api/?name=${document.getElementById('meta-author').value}&background=0D8ABC&color=fff" alt="Author">
        <div class="author-info">
            <h4>${document.getElementById('meta-author').value}</h4>
            <p>Editor and Content Creator.</p>
        </div>
    </div>

    <footer class="site-footer">
        <div class="footer-container">
            <div class="footer-about">
                <h3>${siteTitle}</h3>
                <p>&copy; ${new Date().getFullYear()} All rights reserved.</p>
            </div>
            <div class="footer-nav">
                <a href="${siteUrl}">Home</a>
                <a href="${siteUrl}/contact/">Contact</a>
                <a href="${siteUrl}/privacy/">Privacy</a>
            </div>
        </div>
    </footer>
    
    ${getStickyAds(slug)}

    <script src="${assetPath}/js/article.js" defer></script>
</body></html>`;

    try {
        // Safe Rename/Move Check
        if(state.currentSlug && state.currentSlug !== slug) {
            const oldPath = isPost ? `blog/${state.currentSlug}/index.html` : `${state.currentSlug}/index.html`;
            const oldSha = await getLatestFileSha(oldPath);
            if(oldSha) await githubReq(`contents/${oldPath}`, 'DELETE', { message: 'Move', sha: oldSha });
            state.currentSha = null;
        }

        const freshSha = await getLatestFileSha(path);
        const body = { message: `Update ${slug}`, content: b64EncodeUnicode(html) };
        if(freshSha) body.sha = freshSha;
        else if(state.currentSha && state.currentSlug === slug) body.sha = state.currentSha;

        const res = await githubReq(`contents/${path}`, 'PUT', body);
        state.currentSha = (await res.json()).content.sha;
        state.currentSlug = slug;
        
        // Clear draft
        localStorage.removeItem(`cms_draft_${slug}`);
        
        showToast("Published Successfully!");
        document.getElementById('live-link-container').innerHTML = `<a href="${fullUrl}" target="_blank" class="btn-secondary btn-xs" style="color:white;text-decoration:none;">View Live</a>`;
        document.getElementById('live-link-container').classList.remove('hidden');

    } catch(e) { showToast(e.message, true); }
    finally { showLoader(false); }
});

async function deleteContent(type, slug) {
    if(!confirm("Are you sure? This cannot be undone.")) return;
    showLoader(true, "Deleting...");
    try {
        const path = type === 'post' ? `blog/${slug}/index.html` : `${slug}/index.html`;
        const sha = await getLatestFileSha(path);
        if(sha) {
            await githubReq(`contents/${path}`, 'DELETE', { message: `Delete ${slug}`, sha });
            showToast("Deleted");
            if(type === 'post') loadPosts(); else loadPages();
        } else {
            showToast("File not found to delete.", true);
        }
    } catch(e) { showToast(e.message, true); }
    finally { showLoader(false); }
}

// --- ADS LOGIC ---
function getAdCode(place, slug) {
    const ads = state.settings.ads || [];
    const ad = ads.find(a => a.placement === place && !isExcluded(a, slug));
    if(ad) return `<div class="ad-unit">${ad.code}</div>`;
    return '';
}

function getStickyAds(slug) {
    let html = '';
    const ads = state.settings.ads || [];
    
    const left = ads.find(a => a.placement === 'sticky_left' && !isExcluded(a, slug));
    if(left) html += `<div class="ad-sticky-left">${left.code}</div>`;
    
    const right = ads.find(a => a.placement === 'sticky_right' && !isExcluded(a, slug));
    if(right) html += `<div class="ad-sticky-right">${right.code}</div>`;

    const footer = ads.find(a => a.placement === 'sticky_footer' && !isExcluded(a, slug));
    if(footer) html += `<div class="ad-sticky-footer">${footer.code}</div>`;

    return html;
}

function isExcluded(ad, slug) {
    if(!ad.exclude) return false;
    return ad.exclude.split(',').map(s=>s.trim()).includes(slug);
}

function injectAds(html, slug) {
    const ads = state.settings.ads || [];
    let modified = html;
    
    ads.forEach(ad => {
        if(isExcluded(ad, slug)) return;
        if(ad.placement.startsWith('after_p_')) {
            const pNum = parseInt(ad.placement.split('_')[2]);
            let count = 0;
            modified = modified.replace(/<\/p>/g, (match) => {
                count++;
                return count === pNum ? match + `<div class="ad-unit">${ad.code}</div>` : match;
            });
        }
    });
    return modified;
}

// --- HELPERS ---
function initTinyMCE(cb) {
    if(tinymce.get('tinymce-editor')) tinymce.get('tinymce-editor').remove();
    tinymce.init({
        selector: '#tinymce-editor',
        skin: 'oxide-dark', content_css: 'dark', height: '100%',
        plugins: 'preview searchreplace autolink autosave save directionality code visualblocks visualchars fullscreen image link media template codesample table charmap pagebreak nonbreaking anchor insertdatetime advlist lists wordcount help charmap quickbars emoticons',
        toolbar: 'undo redo | blocks | bold italic | align | bullist numlist | link image media | code',
        setup: (e) => {
            e.on('init', cb);
            e.on('change', () => e.save());
        }
    });
}

function addAdUnit(data = {}) {
    const c = document.getElementById('ads-repeater-container');
    const d = document.createElement('div'); d.className = 'ad-unit-block';
    d.innerHTML = `<button class="ad-remove-btn" onclick="this.parentElement.remove()"><i class="fa-solid fa-trash"></i></button>
    <label class="schema-label">Ad HTML (Script/Img)</label>
    <textarea class="schema-input ad-code-input" rows="2">${data.code || ''}</textarea>
    <div class="ad-meta-row">
        <div>
            <label class="schema-label">Placement</label>
            <select class="schema-input ad-place-input">
                <option value="none">Disabled</option>
                <option value="header_bottom" ${data.placement==='header_bottom'?'selected':''}>Below Header (728x90)</option>
                <option value="sticky_left" ${data.placement==='sticky_left'?'selected':''}>Left Sidebar Sticky (160x600)</option>
                <option value="sticky_right" ${data.placement==='sticky_right'?'selected':''}>Right Sidebar Sticky (160x600)</option>
                <option value="sticky_footer" ${data.placement==='sticky_footer'?'selected':''}>Footer Sticky (Fixed)</option>
                <option value="after_p_1" ${data.placement==='after_p_1'?'selected':''}>After Para 1</option>
                <option value="after_p_2" ${data.placement==='after_p_2'?'selected':''}>After Para 2</option>
                <option value="after_p_3" ${data.placement==='after_p_3'?'selected':''}>After Para 3</option>
                <option value="end" ${data.placement==='end'?'selected':''}>End of Content</option>
            </select>
        </div>
        <div>
            <label class="schema-label">Exclude Slugs (comma sep)</label>
            <input class="schema-input ad-exclude-input" value="${data.exclude || ''}" placeholder="contact, privacy">
        </div>
    </div>`;
    c.appendChild(d);
}

function generateLazyAnalytics() {
    const gaId = state.settings.gaId;
    if(!gaId) return '';
    return `<script>
    (function(){
        const gaId="${gaId}"; let loaded=false;
        function loadGA(){
            if(loaded)return; loaded=true;
            const s=document.createElement('script');s.src='https://www.googletagmanager.com/gtag/js?id='+gaId;s.async=true;
            document.head.appendChild(s);
            window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('config',gaId);
        }
        window.addEventListener('scroll',loadGA,{once:true});window.addEventListener('mousemove',loadGA,{once:true});
        window.addEventListener('touchstart',loadGA,{once:true});setTimeout(loadGA,4000);
    })();
    </script>`;
}

// Media Sidebar
async function loadSidebarMedia(){
    const g=document.getElementById('sidebar-media-grid');
    g.innerHTML='...';
    try{
        const r=await githubReq('contents/images');
        if(!r){g.innerHTML='No media';return}
        const d=await r.json();
        const i=d.filter(x=>x.name.match(/\.(jpg|png|gif|webp)$/i));
        g.innerHTML='';
        i.forEach(x=>{
            const u=`https://${state.owner}.github.io/${state.repo}/images/${x.name}`;
            const d=document.createElement('div');
            d.className='side-media-item';
            d.innerHTML=`<img src="${x.download_url}" loading="lazy"><button class="side-media-delete" onclick="event.stopPropagation();deleteMedia('${x.sha}', '${x.name}')">X</button>`;
            d.onclick=()=>{navigator.clipboard.writeText(u);showToast("Copied Link!")};
            g.appendChild(d);
        });
    } catch(e){g.innerHTML='Err'}
}

async function deleteMedia(sha, name) {
    if(!confirm('Delete this image?')) return;
    try {
        await githubReq(`contents/images/${name}`, 'DELETE', {message: 'Del Img', sha});
        showToast('Image Deleted');
        loadSidebarMedia();
    } catch(e) { showToast('Error deleting', true); }
}

async function handleUpload(f){if(!f.length)return;showToast("Uploading...",0);for(const file of f)await uploadFile(file);showToast("Done!");loadSidebarMedia()}
async function uploadFile(f,cb){const r=new FileReader();r.readAsDataURL(f);await new Promise(res=>{r.onload=async()=>{const b=r.result.split(',')[1],p=`images/${Date.now()}-${f.name.replace(/\s+/g,'-').toLowerCase()}`;await githubReq(`contents/${p}`,'PUT',{message:'Up',content:b});if(cb)cb(`https://${state.owner}.github.io/${state.repo}/${p}`);res()}})}

function setupFeaturedImageDrop() {
    const w=document.getElementById('featured-dropzone'),i=document.getElementById('meta-banner'),p=document.getElementById('banner-preview');
    w.ondragover=e=>{e.preventDefault();w.classList.add('dragover')};w.ondragleave=()=>w.classList.remove('dragover');
    w.ondrop=async e=>{e.preventDefault();w.classList.remove('dragover');if(e.dataTransfer.files.length)await uploadFile(e.dataTransfer.files[0],u=>{i.value=u;p.src=u;p.classList.remove('hidden')})};
    i.oninput=()=>{if(i.value){p.src=i.value;p.classList.remove('hidden')}else p.classList.add('hidden')}
}
function setupSidebarUpload() {
    const d=document.getElementById('sidebar-dropzone'),i=document.getElementById('sidebar-file-input');
    d.onclick=()=>i.click();d.ondragover=e=>{e.preventDefault();d.style.borderColor='#00aaff'};d.ondragleave=()=>d.style.borderColor='#444';
    d.ondrop=e=>{e.preventDefault();d.style.borderColor='#444';handleUpload(e.dataTransfer.files)};i.onchange=()=>handleUpload(i.files);
}

// Utils
function showToast(msg,err){const t=document.getElementById('toast');t.innerText=msg;t.style.borderLeftColor=err?'red':'#00aaff';t.classList.add('show');setTimeout(()=>t.classList.remove('show'),3000)}
function showLoader(v,t){document.getElementById('loading-overlay').classList.toggle('hidden',!v); if(t)document.getElementById('loading-text').innerText=t;}
function slugify(t){return t.toLowerCase().replace(/[^\w-]+/g,'-')}
function b64EncodeUnicode(str){return btoa(encodeURIComponent(str).replace(/%([0-9A-F]{2})/g,(m,p1)=>String.fromCharCode('0x'+p1)))}
function b64DecodeUnicode(str){return decodeURIComponent(atob(str).split('').map(c=>'%'+('00'+c.charCodeAt(0).toString(16)).slice(-2)).join(''))}

// Schema Helpers (Standard)
function addMetaVerifyItem(n='', c='') {
    const ct = document.getElementById('meta-verify-container');
    const d = document.createElement('div'); d.className='repeater-item meta-item-row';
    d.innerHTML = `<button class="repeater-remove" onclick="this.parentElement.remove()">x</button><div style="display:grid; grid-template-columns:1fr 2fr; gap:10px;"><input placeholder="Name" class="schema-input meta-name" value="${n}"><input placeholder="Content" class="schema-input meta-content" value="${c}"></div>`;
    ct.appendChild(d);
}
function addSchemaBlock() { const type = document.getElementById('add-schema-type').value; renderSchemaBlock(type); }
function renderSchemaBlock(type, data={}) {
    const c=document.getElementById('schema-container'); const id='s-'+Date.now(); const div=document.createElement('div'); div.className='schema-block'; div.dataset.type=type;
    let html=`<div class="block-header"><span>${type}</span><button class="remove-schema-btn" onclick="this.closest('.schema-block').remove()">Remove</button></div>`;
    if(type==='FAQPage'){ html+=`<div class="repeater-container" id="${id}-rep"></div><button class="add-repeater-btn" onclick="addFaqItem('${id}-rep')">+ FAQ</button>`; setTimeout(()=>{if(data.mainEntity)data.mainEntity.forEach(q=>addFaqItem(id+'-rep',q.name,q.acceptedAnswer?.text));else addFaqItem(id+'-rep')},0);}
    else if(type==='Review'){ html+=`<div class="schema-row"><div><label class="schema-label">Item</label><input type="text" class="schema-input" data-key="item" value="${data.itemReviewed?.name||''}"></div><div><label class="schema-label">Rating</label><input type="text" class="schema-input" data-key="rating" value="${data.reviewRating?.ratingValue||''}"></div></div><div class="schema-full-row"><label class="schema-label">Body</label><textarea class="schema-input" data-key="body">${data.reviewBody||''}</textarea></div>`; }
    else if(type==='Product'){ html+=`<div class="schema-row"><div><label class="schema-label">Name</label><input type="text" class="schema-input" data-key="name" value="${data.name||''}"></div><div><label class="schema-label">Price</label><input type="text" class="schema-input" data-key="price" value="${data.offers?.price||''}"></div></div>`;}
    div.innerHTML=html; c.appendChild(div);
}
function addFaqItem(cid,q='',a=''){const d=document.createElement('div');d.className='repeater-item';d.innerHTML=`<button class="repeater-remove" onclick="this.parentElement.remove()">x</button><div><label class="schema-label">Q</label><input class="schema-input faq-q" value="${q.replace(/"/g,'&quot;')}"></div><div><label class="schema-label">A</label><textarea class="schema-input faq-a">${a}</textarea></div>`;document.getElementById(cid).appendChild(d);}
function addDefaultArticleSchema(checked) {
    const c = document.getElementById('schema-container');
    const div = document.createElement('div'); div.className='schema-block default-block';
    div.innerHTML=`<div class="block-header"><span>Article Schema</span><label class="switch-label"><input type="checkbox" id="include-article-schema" ${checked?'checked':''}><span class="chk-text">Enable</span></label></div><small style="color:#666">Auto-generated</small>`;
    c.prepend(div);
}
function generateFinalSchema(url, headline, image) {
    const author = document.getElementById('meta-author').value;
    const includeArticle = document.getElementById('include-article-schema').checked;
    const graph = [];
    if(includeArticle) {
        graph.push({
            "@type": "Article", "headline": headline, "image": [image], "author": { "@type": "Person", "name": author }, "datePublished": new Date().toISOString()
        });
    }
    document.querySelectorAll('.schema-block:not(.default-block)').forEach(b => {
        const type = b.dataset.type;
        let obj = { "@type": type };
        if(type === 'FAQPage') {
            const qs=[]; b.querySelectorAll('.repeater-item').forEach(r=>{qs.push({"@type":"Question","name":r.querySelector('.faq-q').value,"acceptedAnswer":{"@type":"Answer","text":r.querySelector('.faq-a').value}})});
            if(qs.length) obj.mainEntity = qs;
        }
        else if(type === 'Review') { obj.itemReviewed={ "@type": "Thing", "name": b.querySelector('[data-key="item"]').value }; obj.reviewRating={ "@type": "Rating", "ratingValue": b.querySelector('[data-key="rating"]').value }; obj.reviewBody=b.querySelector('[data-key="body"]').value; }
        else if(type === 'Product') { obj.name=b.querySelector('[data-key="name"]').value; obj.offers={ "@type": "Offer", "price": b.querySelector('[data-key="price"]').value }; }
        graph.push(obj);
    });
    return JSON.stringify({ "@context": "https://schema.org", "@graph": graph }, null, 4);
}
function exitEditor(){switchPanel(state.currentType==='post'?'dashboard':'pages')}
