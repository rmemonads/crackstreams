/**
 * ULTIMATE SERVERLESS CMS - FINAL FIX
 * Fixed: Media Click, Drag&Drop, Homepage Select, 404, Auto-Draft, Broken Img, Mobile Sticky Ads
 */

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
.ad-sticky-footer { position: fixed; bottom: 0; left: 0; width: 100%; background: #000; z-index: 999; display: flex; flex-direction:column; align-items:center; padding: 10px; border-top: 1px solid #333; }
.ad-close { align-self: flex-end; background: #333; color: #fff; border: 1px solid #555; cursor: pointer; padding: 2px 8px; font-size: 12px; margin-bottom: 5px; }
@media(max-width: 1200px) { .ad-sticky-left, .ad-sticky-right { display: none; } }
@media(max-width: 768px) { .ad-sticky-footer { height: auto; padding: 5px; } .ad-sticky-footer img { max-width: 100%; height: auto; } }
`,
    "assets/js/article.js": `
document.addEventListener('DOMContentLoaded', () => {
    // 1. DYNAMIC DATE
    const lastMod = new Date(document.lastModified);
    if(document.getElementById('dynamicDate')) document.getElementById('dynamicDate').textContent = lastMod.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
    
    // 2. BREADCRUMBS
    const path = window.location.pathname;
    const isPost = path.includes('/blog/');
    const slug = path.split('/').filter(Boolean).pop() || 'Home';
    const crumbSpan = document.getElementById('dynamicBreadcrumbSlug');
    if(crumbSpan) {
        if(isPost) {
            crumbSpan.innerHTML = '<a href="../blog/" style="color:var(--text-color-secondary)">Blog</a> <span>/</span> ' + slug.replace(/-/g, ' ');
        } else {
            crumbSpan.textContent = slug.replace(/-/g, ' ');
        }
    }

    // 3. READING TIME
    const content = document.querySelector('.article-content');
    if(content && document.getElementById('dynamicReadingTime')) {
        const words = content.innerText.trim().split(/\s+/).length;
        document.getElementById('dynamicReadingTime').textContent = Math.ceil(words / 225) + " Min Read";
    }

    // 4. PROGRESS BAR & MOBILE MENU
    const bar = document.getElementById('progressBar');
    if(bar) window.addEventListener('scroll', () => {
        const st = document.documentElement.scrollTop;
        const sh = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        bar.style.width = (st / sh) * 100 + "%";
    });

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
    
    // Auto-Save Loop (Every 5 seconds)
    setInterval(handleAutoSave, 5000);
});

async function initApp() {
    document.getElementById('login-view').classList.remove('active');
    document.getElementById('app-view').classList.add('active');
    
    showLoader(true, "System Check...");
    await ensureDirectories();
    await ensureSystemFiles();
    
    showLoader(true, "Loading...");
    await loadGlobalSettings();
    
    switchPanel('dashboard');
    showLoader(false);
}

// --- SYSTEM & DIRS ---
async function ensureDirectories() {
    // Folders check logic essentially handled by uploads
}

async function ensureSystemFiles() {
    for (const [path, content] of Object.entries(SYSTEM_ASSETS)) {
        const sha = await getLatestFileSha(path);
        if (!sha) {
            try {
                await githubReq(`contents/${path}`, 'PUT', {
                    message: `Init ${path}`,
                    content: b64EncodeUnicode(content)
                });
            } catch(e) {}
        }
    }
}

// --- SIDEBAR & NAVIGATION ---
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

function switchSidebarTab(tabName) {
    document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
    document.querySelectorAll('.sidebar-content').forEach(c => c.classList.remove('active'));
    
    document.getElementById(`tab-btn-${tabName}`).classList.add('active');
    document.getElementById(`tab-${tabName}`).classList.add('active');
}

function setupSidebarEvents() {
    document.getElementById('sidebar-toggle-btn').addEventListener('click', () => {
        document.getElementById('main-sidebar').classList.toggle('collapsed');
    });
}

// --- API & AUTH ---
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
    const opts = { method, headers: { Authorization: `Bearer ${state.token}`, Accept: 'application/vnd.github.v3+json', 'Content-Type': 'application/json' } };
    if (body) opts.body = JSON.stringify(body);
    const res = await fetch(`https://api.github.com/repos/${state.owner}/${state.repo}/${endpoint}`, opts);
    if (!res.ok && method === 'GET' && res.status === 404) return null;
    if (!res.ok) throw new Error((await res.json()).message || 'API Error');
    return res;
}

async function getLatestFileSha(path) {
    try { const res = await githubReq(`contents/${path}`); return res ? (await res.json()).sha : null; } catch (e) { return null; }
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
    
    // Repeaters
    renderRepeater('meta-verify-container', s.verifications, 'meta');
    renderRepeater('header-menu-container', s.headerMenu, 'menu');
    renderRepeater('footer-menu-container', s.footerMenu, 'menu');
    renderRepeater('social-links-container', s.socialLinks, 'social');
    
    document.getElementById('ads-repeater-container').innerHTML = '';
    (s.ads || []).forEach(ad => addAdUnit(ad));
}

async function loadPagesForSelect() {
    const sel = document.getElementById('set-homepage-select');
    sel.innerHTML = '<option>Loading...</option>';
    await loadPages();
    sel.innerHTML = '<option value="">-- Select a Page --</option>';
    state.pagesList.forEach(p => {
        const opt = document.createElement('option');
        opt.value = p; opt.innerText = p;
        if(state.settings.homepage === p) opt.selected = true;
        sel.appendChild(opt);
    });
}

async function saveGlobalSettings() {
    showLoader(true, "Saving Settings...");
    
    // Collect Data
    const s = {
        siteTitle: document.getElementById('set-site-title').value,
        siteUrl: document.getElementById('set-site-url').value,
        favicon: document.getElementById('set-favicon').value,
        copyright: document.getElementById('set-copyright').value,
        homepage: document.getElementById('set-homepage-select').value,
        enable404: document.getElementById('set-404-redirect').checked,
        gaId: document.getElementById('set-ga-id').value,
        adsenseAuto: document.getElementById('set-adsense-auto').value,
        customCss: document.getElementById('set-custom-css').value,
        customHeadJs: document.getElementById('set-custom-head-js').value,
        verifications: collectRepeater('meta-verify-container', 'meta'),
        headerMenu: collectRepeater('header-menu-container', 'menu'),
        footerMenu: collectRepeater('footer-menu-container', 'menu'),
        socialLinks: collectRepeater('social-links-container', 'social'),
        ads: []
    };
    
    document.querySelectorAll('.ad-unit-block').forEach(b => {
        s.ads.push({
            code: b.querySelector('.ad-code-input').value,
            placement: b.querySelector('.ad-place-input').value,
            exclude: b.querySelector('.ad-exclude-input').value
        });
    });

    state.settings = s;

    try {
        // 1. Save JSON
        const body = { message: 'Update Settings', content: b64EncodeUnicode(JSON.stringify(s, null, 2)) };
        if(state.settingsSha) body.sha = state.settingsSha;
        const res = await githubReq('contents/_cms/settings.json', 'PUT', body);
        state.settingsSha = await res.json().then(d => d.content.sha);

        // 2. Homepage Copy
        if(s.homepage) {
            const pageRes = await githubReq(`contents/${s.homepage}/index.html`);
            if(pageRes) {
                const pageData = await pageRes.json();
                let indexSha = await getLatestFileSha('contents/index.html');
                await githubReq('contents/index.html', 'PUT', { message: `Set home ${s.homepage}`, content: pageData.content, sha: indexSha });
            }
        }

        // 3. 404 Generation
        if(s.enable404) {
            const sha404 = await getLatestFileSha('contents/404.html');
            const html404 = `<!DOCTYPE html><html><head><meta http-equiv="refresh" content="0; url=${s.siteUrl}/"></head><body>Redirecting...</body></html>`;
            await githubReq('contents/404.html', 'PUT', { message: 'Up 404', content: b64EncodeUnicode(html404), sha: sha404 });
        }

        showToast('Settings Saved!');
    } catch(e) { showToast(e.message, true); }
    finally { showLoader(false); }
}

// --- POSTS / PAGES LISTS ---
async function loadPosts() { renderList('contents/blog', 'posts-list-body', 'post'); }
async function loadPages() { state.pagesList = []; await renderList('contents', 'pages-list-body', 'page'); }

async function renderList(endpoint, tbodyId, type) {
    const tbody = document.getElementById(tbodyId);
    tbody.innerHTML = '<tr><td colspan="3">Loading...</td></tr>';
    try {
        const res = await githubReq(endpoint);
        if(!res) { tbody.innerHTML = '<tr><td colspan="3">None found.</td></tr>'; return; }
        const data = await res.json();
        const restricted = ['blog', 'images', 'admin', 'css', 'js', '.git', '_cms', 'assets', '404.html', 'index.html'];
        const items = data.filter(item => item.type === 'dir' && !restricted.includes(item.name));
        
        let html = '';
        items.forEach(f => {
            if(type === 'page') state.pagesList.push(f.name);
            const liveLink = type === 'post' ? `../blog/${f.name}/` : `../${f.name}/`;
            html += `<tr>
                <td><input type="checkbox" class="chk-${type}" value="${f.name}" onchange="toggleBulkBtn('${type}')"></td>
                <td><strong>${f.name}</strong></td>
                <td>
                    <a href="${liveLink}" target="_blank" class="btn-secondary btn-xs"><i class="fa-solid fa-eye"></i></a>
                    <button class="btn-primary btn-xs" onclick="editContent('${type}', '${f.name}')"><i class="fa-solid fa-pen"></i></button> 
                    <button class="btn-danger btn-xs" onclick="deleteContent('${type}', '${f.name}')"><i class="fa-solid fa-trash"></i></button>
                </td>
            </tr>`;
        });
        tbody.innerHTML = html || '<tr><td colspan="3">Empty.</td></tr>';
    } catch(e) { tbody.innerHTML = `<tr><td colspan="3">${e.message}</td></tr>`; }
}

function toggleAll(tbodyId, master) {
    document.querySelectorAll(`#${tbodyId} input[type="checkbox"]`).forEach(c => c.checked = master.checked);
    toggleBulkBtn(tbodyId.includes('post') ? 'post' : 'page');
}
function toggleBulkBtn(type) {
    const checked = document.querySelectorAll(`.chk-${type}:checked`).length;
    document.getElementById(`bulk-del-${type}s`).classList.toggle('hidden', checked === 0);
}
function filterTable(tbodyId, q) {
    const rows = document.getElementById(tbodyId).getElementsByTagName('tr');
    for(let r of rows) r.style.display = r.textContent.toLowerCase().includes(q.toLowerCase()) ? '' : 'none';
}

// --- EDITOR & DRAFTS ---
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

        switchPanel('editor');

        // Check Auto-Draft
        const savedDraft = localStorage.getItem(`draft_${slug}`);
        let content = doc.querySelector('.article-content')?.innerHTML || '';
        
        if(savedDraft && savedDraft !== content) {
            if(confirm('Unsaved draft found. Restore it?')) content = savedDraft;
        }

        initTinyMCE(() => tinymce.activeEditor.setContent(content));
        
        // Schema
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
        
        const url = `${state.settings.siteUrl}/${type==='post'?'blog/':''}${slug}/`;
        document.getElementById('live-link-container').innerHTML = `<a href="${url}" target="_blank" class="btn-secondary btn-xs" style="color:white;text-decoration:none;">View Live</a>`;
        document.getElementById('live-link-container').classList.remove('hidden');

    } catch(e) { showToast(e.message, true); switchPanel('dashboard'); }
    finally { showLoader(false); }
}

function handleAutoSave() {
    if(!tinymce.activeEditor || document.getElementById('panel-editor').style.display === 'none') return;
    const slug = document.getElementById('meta-slug').value;
    if(slug && tinymce.activeEditor.isDirty()) {
        localStorage.setItem(`draft_${slug}`, tinymce.activeEditor.getContent());
        document.getElementById('auto-draft-msg').innerText = "Draft Saved...";
        setTimeout(()=>document.getElementById('auto-draft-msg').innerText='', 2000);
    }
}

// --- SAVE / PUBLISH ---
document.getElementById('save-btn').addEventListener('click', async () => {
    const title = document.getElementById('meta-title').value;
    const slug = document.getElementById('meta-slug').value;
    if(!title || !slug) return showToast("Title & Slug Required", true);
    
    showLoader(true, "Publishing...");
    const isPost = state.currentType === 'post';
    const folder = isPost ? `blog/${slug}` : `${slug}`;
    const path = `${folder}/index.html`;

    let contentHtml = tinymce.activeEditor.getContent();
    contentHtml = injectAds(contentHtml, slug);

    const s = state.settings;
    const siteTitle = s.siteTitle || '';
    const fullUrl = `${s.siteUrl}/${isPost?'blog/':''}${slug}/`;
    const assetPath = isPost ? '../../assets' : '../assets';

    // Banner Logic
    const bannerUrl = document.getElementById('meta-banner').value;
    const bannerHtml = bannerUrl ? `<div class="banner-container"><img id="dynamicBannerImage" class="banner-image" alt="${title}" src="${bannerUrl}"></div>` : '';

    // Menu Logic
    const headerLinks = (s.headerMenu || []).map(l => `<li><a href="${l.link}">${l.label}</a></li>`).join('');
    const footerLinks = (s.footerMenu || []).map(l => `<a href="${l.link}">${l.label}</a>`).join('');
    const socialIcons = (s.socialLinks || []).map(l => `<a href="${l.link}"><i class="${l.label}"></i></a>`).join('');

    // Schema
    const schemaJson = generateFinalSchema(fullUrl, title, bannerUrl);

    // Meta Display
    const metaDisplay = isPost ? '' : 'style="display:none"';
    const breadCrumbDisplay = document.getElementById('include-breadcrumb-schema').checked ? '' : 'style="display:none"';

    const html = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${isPost ? title : title + ' - ' + siteTitle}</title>
    <meta name="description" content="${document.getElementById('meta-desc').value}">
    <link rel="icon" href="${s.favicon || ''}">
    <link rel="canonical" href="${fullUrl}">
    <meta property="og:image" content="${bannerUrl}">
    ${(s.verifications||[]).map(v=>`<meta name="${v.name}" content="${v.content}">`).join('\n')}
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
    <link rel="stylesheet" href="${assetPath}/css/article.css">
    <style>${s.customCss || ''}</style>
    ${s.customHeadJs || ''}
    ${s.adsenseAuto || ''}
    ${generateLazyAnalytics()}
    <script type="application/ld+json">${schemaJson}</script>
</head>
<body>
    <div class="progress-bar" id="progressBar"></div>
    <header class="site-header">
        <nav>
            <a href="${s.siteUrl}" class="logo">${siteTitle}</a>
            <div class="burger"><div class="line1"></div><div class="line2"></div><div class="line3"></div></div>
            <ul class="nav-links">${headerLinks}</ul>
        </nav>
    </header>

    ${getAdCode('header_bottom', slug)}

    <div class="blog-header">
        <div class="breadcrumbs" ${breadCrumbDisplay}>
            <a href="${s.siteUrl}">Home</a> <span>/</span> <span id="dynamicBreadcrumbSlug"></span>
        </div>
        <h1 class="blog-title">${title}</h1>
        <div class="blog-meta" ${metaDisplay}>
            <span class="author-name">By ${document.getElementById('meta-author').value}</span>
            <span>•</span> <span id="dynamicDate"></span>
            <span>•</span> <span id="dynamicReadingTime"></span>
        </div>
    </div>

    ${bannerHtml}

    <article class="article-content">${contentHtml}</article>

    ${getAdCode('end', slug)}

    <div class="author-bio-box" ${metaDisplay}>
        <img src="https://ui-avatars.com/api/?name=${document.getElementById('meta-author').value}&background=0D8ABC&color=fff" alt="Author">
        <div class="author-info"><h4>${document.getElementById('meta-author').value}</h4><p>Author</p></div>
    </div>

    <footer class="site-footer">
        <div class="footer-container">
            <div class="footer-about">
                <h3>${siteTitle}</h3>
                <p>${s.copyright || ''}</p>
                <div class="footer-social">${socialIcons}</div>
            </div>
            <div class="footer-nav">${footerLinks}</div>
        </div>
    </footer>
    
    ${getStickyAds(slug)}
    <script src="${assetPath}/js/article.js" defer></script>
</body></html>`;

    try {
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
        
        localStorage.removeItem(`draft_${slug}`);
        showToast("Published Successfully!");
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
            if(type==='post') loadPosts(); else loadPages();
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
        if(sha) await githubReq(`contents/${path}`, 'DELETE', { message: `Bulk Del ${slug}`, sha });
    }
    showLoader(false);
    if(type==='post') loadPosts(); else loadPages();
}

// --- ADS & HELPERS ---
function getAdCode(place, slug) {
    const ads = state.settings.ads || [];
    const ad = ads.find(a => a.placement === place && !isExcluded(a, slug));
    return ad ? `<div class="ad-unit">${ad.code}</div>` : '';
}

function getStickyAds(slug) {
    let html = '';
    const ads = state.settings.ads || [];
    const left = ads.find(a => a.placement === 'sticky_left' && !isExcluded(a, slug));
    if(left) html += `<div class="ad-sticky-left">${left.code}</div>`;
    
    const right = ads.find(a => a.placement === 'sticky_right' && !isExcluded(a, slug));
    if(right) html += `<div class="ad-sticky-right">${right.code}</div>`;

    const footer = ads.find(a => a.placement === 'sticky_footer' && !isExcluded(a, slug));
    if(footer) html += `<div class="ad-sticky-footer" id="stky-ftr"><button class="ad-close" onclick="document.getElementById('stky-ftr').remove()">Close X</button>${footer.code}</div>`;
    return html;
}

function isExcluded(ad, slug) { return ad.exclude && ad.exclude.split(',').map(s=>s.trim()).includes(slug); }

function injectAds(html, slug) {
    const ads = state.settings.ads || [];
    let modified = html;
    ads.forEach(ad => {
        if(isExcluded(ad, slug)) return;
        if(ad.placement.startsWith('after_p_')) {
            const pNum = parseInt(ad.placement.split('_')[2]);
            let count = 0;
            modified = modified.replace(/<\/p>/g, (match) => { count++; return count === pNum ? match + `<div class="ad-unit">${ad.code}</div>` : match; });
        }
    });
    return modified;
}

function initTinyMCE(cb) {
    if(tinymce.get('tinymce-editor')) tinymce.get('tinymce-editor').remove();
    tinymce.init({
        selector: '#tinymce-editor',
        skin: 'oxide-dark', content_css: 'dark', height: '100%',
        plugins: 'preview searchreplace autolink autosave save directionality code visualblocks visualchars fullscreen image link media template codesample table charmap pagebreak nonbreaking anchor insertdatetime advlist lists wordcount help charmap quickbars emoticons',
        toolbar: 'undo redo | blocks | bold italic | align | bullist numlist | link image media | code',
        setup: (e) => { e.on('init', cb); e.on('change', () => e.save()); }
    });
}

function renderRepeater(id, data, type) {
    const c = document.getElementById(id); c.innerHTML = '';
    (data || []).forEach(item => {
        if(type === 'meta') addMetaVerifyItem(item.name, item.content);
        else if(type === 'menu') addMenuItem(id, item.label, item.link);
        else if(type === 'social') addSocialItem(item.label, item.link);
    });
}
function collectRepeater(id, type) {
    const items = [];
    document.getElementById(id).querySelectorAll('.repeater-item').forEach(d => {
        if(type === 'meta') items.push({ name: d.querySelector('.meta-name').value, content: d.querySelector('.meta-content').value });
        else if(type === 'menu' || type === 'social') items.push({ label: d.querySelector('.item-label').value, link: d.querySelector('.item-link').value });
    });
    return items;
}

// UI Builders
function addMetaVerifyItem(n='', c='') { document.getElementById('meta-verify-container').insertAdjacentHTML('beforeend', `<div class="repeater-item meta-item-row"><button class="repeater-remove" onclick="this.parentElement.remove()">x</button><div class="menu-row"><input class="schema-input meta-name" value="${n}" placeholder="Name"><input class="schema-input meta-content" value="${c}" placeholder="Content"></div></div>`); }
function addMenuItem(id, l='', u='') { document.getElementById(id).insertAdjacentHTML('beforeend', `<div class="repeater-item"><button class="repeater-remove" onclick="this.parentElement.remove()">x</button><div class="menu-row"><input class="schema-input item-label" value="${l}" placeholder="Label"><input class="schema-input item-link" value="${u}" placeholder="Link /"></div></div>`); }
function addSocialItem(l='', u='') { document.getElementById('social-links-container').insertAdjacentHTML('beforeend', `<div class="repeater-item"><button class="repeater-remove" onclick="this.parentElement.remove()">x</button><div class="social-row"><input class="schema-input item-label" value="${l}" placeholder="fa-brands fa-facebook"><input class="schema-input item-link" value="${u}" placeholder="URL"></div></div>`); }
function addAdUnit(d={}) { document.getElementById('ads-repeater-container').insertAdjacentHTML('beforeend', `<div class="ad-unit-block"><button class="ad-remove-btn" onclick="this.parentElement.remove()"><i class="fa-solid fa-trash"></i></button><label class="schema-label">Ad Code</label><textarea class="schema-input ad-code-input" rows="2">${d.code||''}</textarea><div class="ad-meta-row"><div><select class="schema-input ad-place-input"><option value="header_bottom" ${d.placement==='header_bottom'?'selected':''}>Below Header</option><option value="sticky_footer" ${d.placement==='sticky_footer'?'selected':''}>Sticky Footer</option><option value="end" ${d.placement==='end'?'selected':''}>End Post</option><option value="sticky_left" ${d.placement==='sticky_left'?'selected':''}>Left Sticky</option><option value="sticky_right" ${d.placement==='sticky_right'?'selected':''}>Right Sticky</option></select></div><div><input class="schema-input ad-exclude-input" value="${d.exclude||''}" placeholder="Excl. slugs"></div></div></div>`); }

// Media & Schema
async function loadSidebarMedia(){
    const g=document.getElementById('sidebar-media-grid'); g.innerHTML='...';
    try {
        const r = await githubReq('contents/images');
        if(!r) { g.innerHTML='Empty'; return; }
        const data = await r.json();
        g.innerHTML = data.filter(x=>x.name.match(/\.(jpg|png|webp)$/i)).map(x => 
            `<div class="side-media-item" onclick="navigator.clipboard.writeText('https://${state.owner}.github.io/${state.repo}/images/${x.name}');showToast('Link Copied!')">
                <img src="${x.download_url}"><button class="side-media-delete" onclick="event.stopPropagation();deleteMedia('${x.sha}','${x.name}')">X</button>
            </div>`).join('');
    } catch(e) { g.innerHTML='Err'; }
}
async function deleteMedia(sha, name) { if(confirm('Delete?')) await githubReq(`contents/images/${name}`, 'DELETE', {message:'del', sha}); loadSidebarMedia(); }
function setupFeaturedImageDrop() {
    const w=document.getElementById('featured-dropzone');
    w.ondragover=e=>{e.preventDefault();w.classList.add('dragover')}; w.ondragleave=()=>w.classList.remove('dragover');
    w.ondrop=e=>{e.preventDefault();w.classList.remove('dragover'); if(e.dataTransfer.files.length) uploadFile(e.dataTransfer.files[0], u=>{document.getElementById('meta-banner').value=u;document.getElementById('banner-preview').src=u;document.getElementById('banner-preview').classList.remove('hidden')}); };
}
function setupSidebarUpload() {
    const d=document.getElementById('sidebar-dropzone'), i=document.getElementById('sidebar-file-input');
    d.onclick=()=>i.click(); d.ondragover=e=>{e.preventDefault();d.style.borderColor='#00aaff'}; d.ondragleave=()=>d.style.borderColor='#444';
    d.ondrop=e=>{e.preventDefault();d.style.borderColor='#444';if(e.dataTransfer.files.length){showToast('Uploading...');Array.from(e.dataTransfer.files).forEach(f=>uploadFile(f));}}; 
    i.onchange=()=>{showToast('Uploading...');Array.from(i.files).forEach(f=>uploadFile(f));};
}
async function uploadFile(f,cb){const r=new FileReader();r.readAsDataURL(f);r.onload=async()=>{const b=r.result.split(',')[1],p=`images/${Date.now()}-${f.name.replace(/\s/g,'-')}`;await githubReq(`contents/${p}`,'PUT',{message:'Up',content:b});loadSidebarMedia();if(cb)cb(`https://${state.owner}.github.io/${state.repo}/${p}`);showToast('Done')};}

function addSchemaBlock() { renderSchemaBlock(document.getElementById('add-schema-type').value); }
function renderSchemaBlock(type, data={}) {
    const c=document.getElementById('schema-container'); const id='s-'+Date.now();
    let html=`<div class="schema-block" data-type="${type}"><div class="block-header"><span>${type}</span><button class="remove-schema-btn" onclick="this.closest('.schema-block').remove()">Remove</button></div>`;
    if(type==='WebSite') html+=`<div class="schema-row"><div><label>Name</label><input class="schema-input" data-key="name" value="${data.name||''}"></div><div><label>URL</label><input class="schema-input" data-key="url" value="${data.url||''}"></div></div>`;
    else if(type==='FAQPage') html+=`<div class="repeater-container" id="${id}"></div><button class="add-repeater-btn" onclick="addFaqItem('${id}')">+ FAQ</button>`;
    html+='</div>'; c.insertAdjacentHTML('beforeend', html);
    if(type==='FAQPage' && data.mainEntity) data.mainEntity.forEach(q=>addFaqItem(id,q.name,q.acceptedAnswer?.text));
}
function addFaqItem(id,q='',a='') { document.getElementById(id).insertAdjacentHTML('beforeend', `<div class="repeater-item"><button class="repeater-remove" onclick="this.parentElement.remove()">x</button><div><label class="schema-label">Q</label><input class="schema-input faq-q" value="${q.replace(/"/g,'&quot;')}"></div><div><label class="schema-label">A</label><textarea class="schema-input faq-a">${a}</textarea></div></div>`); }
function addDefaultArticleSchema(checked) { document.getElementById('schema-container').insertAdjacentHTML('afterbegin', `<div class="schema-block default-block"><div class="block-header"><span>Article Schema</span><label class="switch-label"><input type="checkbox" id="include-article-schema" ${checked?'checked':''}><span class="chk-text">Enable</span></label></div></div>`); }

function generateFinalSchema(url, headline, image) {
    const graph = [];
    if(document.getElementById('include-article-schema').checked) graph.push({"@type": "Article", "headline": headline, "image": [image], "author": { "@type": "Person", "name": document.getElementById('meta-author').value }, "datePublished": new Date().toISOString()});
    if(document.getElementById('include-breadcrumb-schema').checked) graph.push({"@type": "BreadcrumbList", "itemListElement": [{"@type":"ListItem","position":1,"name":"Home","item":state.settings.siteUrl},{"@type":"ListItem","position":2,"name":headline,"item":url}]});
    
    document.querySelectorAll('.schema-block:not(.default-block)').forEach(b => {
        const type = b.dataset.type;
        let obj = { "@type": type };
        if(type === 'WebSite') { obj.name = b.querySelector('[data-key="name"]').value; obj.url = b.querySelector('[data-key="url"]').value; }
        else if(type === 'FAQPage') { obj.mainEntity = Array.from(b.querySelectorAll('.repeater-item')).map(r=>({"@type":"Question","name":r.querySelector('.faq-q').value,"acceptedAnswer":{"@type":"Answer","text":r.querySelector('.faq-a').value}})); }
        graph.push(obj);
    });
    return JSON.stringify({ "@context": "https://schema.org", "@graph": graph }, null, 4);
}

// Utils
function showToast(m,e){const t=document.getElementById('toast');t.innerText=m;t.style.borderLeftColor=e?'red':'#00aaff';t.classList.add('show');setTimeout(()=>t.classList.remove('show'),3000)}
function showLoader(v,t){document.getElementById('loading-overlay').classList.toggle('hidden',!v); if(t)document.getElementById('loading-text').innerText=t;}
function slugify(t){return t.toLowerCase().replace(/[^\w-]+/g,'-')}
function b64EncodeUnicode(str){return btoa(encodeURIComponent(str).replace(/%([0-9A-F]{2})/g,(m,p1)=>String.fromCharCode('0x'+p1)))}
function b64DecodeUnicode(str){return decodeURIComponent(atob(str).split('').map(c=>'%'+('00'+c.charCodeAt(0).toString(16)).slice(-2)).join(''))}
function generateLazyAnalytics() { return state.settings.gaId ? `<script>(function(){const g="${state.settings.gaId}";function l(){const s=document.createElement('script');s.src='https://www.googletagmanager.com/gtag/js?id='+g;s.async=true;document.head.appendChild(s);window.dataLayer=window.dataLayer||[];function G(){dataLayer.push(arguments)}G('js',new Date());G('config',g)}window.addEventListener('scroll',l,{once:true});setTimeout(l,4000)})();</script>` : ''; }
function exitEditor(){switchPanel(state.currentType==='post'?'dashboard':'pages')}
