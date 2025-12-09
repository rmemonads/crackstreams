/**
 * ULTIMATE SERVERLESS CMS - GLOBAL SETTINGS EDITION
 */

// --- STATE ---
const state = {
    token: null, owner: null, repo: null,
    currentType: 'post', currentSlug: null, currentSha: null,
    editorInitialized: false,
    settings: {}, // Holds site-wide settings
    settingsSha: null // For updating settings.json
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
});

// --- NAVIGATION ---
function initApp() {
    document.getElementById('login-view').classList.remove('active');
    document.getElementById('app-view').classList.add('active');
    loadGlobalSettings(); // Fetch site settings
    switchPanel('dashboard');
}

function switchPanel(id) {
    document.querySelectorAll('.panel').forEach(p => p.classList.remove('active'));
    document.getElementById(`panel-${id}`).classList.add('active');
    
    document.querySelectorAll('.nav-item').forEach(b => b.classList.remove('active'));
    const navId = `nav-btn-${id}`;
    if(document.getElementById(navId)) document.getElementById(navId).classList.add('active');

    if(id === 'dashboard') loadPosts();
    if(id === 'pages') loadPages();
}

function setupSidebarEvents() {
    const sidebar = document.getElementById('main-sidebar');
    document.getElementById('sidebar-toggle-btn').addEventListener('click', () => {
        sidebar.classList.toggle('collapsed');
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

// --- API HELPERS ---
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

// --- GLOBAL SETTINGS LOGIC ---
async function loadGlobalSettings() {
    try {
        const res = await githubReq('contents/_cms/settings.json');
        if(res) {
            const data = await res.json();
            state.settingsSha = data.sha;
            state.settings = JSON.parse(b64DecodeUnicode(data.content));
        } else {
            state.settings = {}; // New repo
        }
        populateSettingsForm();
    } catch(e) { console.log('Settings load error (likely new setup):', e); }
}

function populateSettingsForm() {
    const s = state.settings;
    document.getElementById('set-site-title').value = s.siteTitle || '';
    document.getElementById('set-favicon').value = s.favicon || '';
    document.getElementById('set-ga-id').value = s.gaId || '';
    document.getElementById('set-adsense-auto').value = s.adsenseAuto || '';
    document.getElementById('set-custom-ad-code').value = s.customAd?.code || '';
    document.getElementById('set-ad-placement').value = s.customAd?.placement || 'none';
    document.getElementById('set-ad-exclude').value = s.customAd?.exclude || '';
    document.getElementById('set-custom-css').value = s.customCss || '';
    document.getElementById('set-custom-head-js').value = s.customHeadJs || '';
}

async function saveGlobalSettings() {
    showLoader(true);
    const s = {
        siteTitle: document.getElementById('set-site-title').value,
        favicon: document.getElementById('set-favicon').value,
        gaId: document.getElementById('set-ga-id').value,
        adsenseAuto: document.getElementById('set-adsense-auto').value,
        customAd: {
            code: document.getElementById('set-custom-ad-code').value,
            placement: document.getElementById('set-ad-placement').value,
            exclude: document.getElementById('set-ad-exclude').value
        },
        customCss: document.getElementById('set-custom-css').value,
        customHeadJs: document.getElementById('set-custom-head-js').value
    };
    state.settings = s;

    try {
        const body = { message: 'Update Global Settings', content: b64EncodeUnicode(JSON.stringify(s, null, 2)) };
        if(state.settingsSha) body.sha = state.settingsSha;
        
        const res = await githubReq('contents/_cms/settings.json', 'PUT', body);
        const data = await res.json();
        state.settingsSha = data.content.sha;
        showToast('Settings Saved!');
    } catch(e) { showToast('Error saving settings: ' + e.message, true); }
    finally { showLoader(false); }
}

// --- DATA LISTS ---
async function loadPosts() {
    renderList('contents/blog', 'posts-list-body', 'post');
}
async function loadPages() {
    const tbody = document.getElementById('pages-list-body');
    tbody.innerHTML = '<tr><td colspan="3">Loading...</td></tr>';
    try {
        const res = await githubReq('contents');
        const data = await res.json();
        const restricted = ['blog', 'images', 'admin', 'css', 'js', '.git', '_cms'];
        const folders = data.filter(item => item.type === 'dir' && !restricted.includes(item.name));
        let html = '';
        folders.forEach(f => {
             html += `<tr><td><strong>${f.name}</strong></td><td>/${f.name}/</td><td><button class="btn-primary" onclick="editContent('page', '${f.name}')">Edit</button> <button class="btn-secondary" style="background:red" onclick="deleteContent('page', '${f.name}')">Del</button></td></tr>`;
        });
        tbody.innerHTML = html || '<tr><td colspan="3">No pages found.</td></tr>';
    } catch(e) { tbody.innerHTML = `<tr><td colspan="3">Error: ${e.message}</td></tr>`; }
}
async function renderList(endpoint, tbodyId, type) {
    const tbody = document.getElementById(tbodyId);
    tbody.innerHTML = '<tr><td colspan="3">Loading...</td></tr>';
    try {
        const res = await githubReq(endpoint);
        if(!res) { tbody.innerHTML = '<tr><td colspan="3">None found.</td></tr>'; return; }
        const data = await res.json();
        const folders = data.filter(item => item.type === 'dir');
        let html = '';
        folders.forEach(f => {
            html += `<tr><td><strong>${f.name}</strong></td><td>/${f.name}/</td><td><button class="btn-primary" onclick="editContent('${type}', '${f.name}')">Edit</button> <button class="btn-secondary" style="background:red" onclick="deleteContent('${type}', '${f.name}')">Del</button></td></tr>`;
        });
        tbody.innerHTML = html;
    } catch(e) { tbody.innerHTML = `<tr><td colspan="3">${e.message}</td></tr>`; }
}

// --- EDITOR & SCHEMA ---
function createNew(type) {
    state.currentType = type; state.currentSlug = null; state.currentSha = null;
    document.getElementById('meta-title').value = '';
    document.getElementById('meta-slug').value = '';
    document.getElementById('meta-desc').value = '';
    document.getElementById('meta-banner').value = '';
    document.getElementById('banner-preview').classList.add('hidden');
    document.getElementById('include-article-schema').checked = true;
    document.getElementById('schema-container').innerHTML = `
        <div class="schema-block default-block">
            <div class="block-header"><span>Article Schema</span><label class="switch-label"><input type="checkbox" id="include-article-schema" checked><span class="chk-text">Enable</span></label></div>
            <small style="color:#666;">Auto-generated</small>
        </div>`;
    
    switchPanel('editor');
    initTinyMCE();
    if(tinymce.activeEditor) tinymce.activeEditor.setContent('');
    document.getElementById('meta-title').oninput = function() { if(!state.currentSlug) document.getElementById('meta-slug').value = slugify(this.value); };
    switchSidebarTab('settings');
}

async function editContent(type, slug) {
    showLoader(true);
    state.currentType = type; state.currentSlug = slug;
    try {
        const path = type === 'post' ? `blog/${slug}/index.html` : `${slug}/index.html`;
        const res = await githubReq(`contents/${path}`);
        if(!res) throw new Error("File not found");
        const data = await res.json();
        state.currentSha = data.sha;
        
        const doc = new DOMParser().parseFromString(b64DecodeUnicode(data.content), 'text/html');
        document.getElementById('meta-title').value = doc.querySelector('title')?.innerText || slug;
        document.getElementById('meta-slug').value = slug;
        document.getElementById('meta-desc').value = doc.querySelector('meta[name="description"]')?.content || '';
        document.getElementById('meta-banner').value = doc.querySelector('meta[property="og:image"]')?.content || '';
        
        switchPanel('editor');
        initTinyMCE();
        const content = doc.querySelector('.article-content')?.innerHTML || '';
        setTimeout(() => tinymce.activeEditor.setContent(content), 500);

        // Schema Load
        const script = doc.querySelector('script[type="application/ld+json"]');
        document.getElementById('schema-container').innerHTML = ''; // Clear
        let hasArticle = false;
        
        if(script) {
            const json = JSON.parse(script.innerText);
            const graph = json['@graph'] || (Array.isArray(json) ? json : [json]);
            graph.forEach(obj => {
                if(obj['@type'] === 'Article') hasArticle = true;
                else renderSchemaBlock(obj['@type'], obj);
            });
        }
        
        // Always prepend Article block logic
        const container = document.getElementById('schema-container');
        const artDiv = document.createElement('div');
        artDiv.className = 'schema-block default-block';
        artDiv.innerHTML = `<div class="block-header"><span>Article Schema</span><label class="switch-label"><input type="checkbox" id="include-article-schema" ${hasArticle?'checked':''}><span class="chk-text">Enable</span></label></div><small style="color:#666;">Auto-generated</small>`;
        container.prepend(artDiv);

    } catch(e) { showToast(e.message, true); switchPanel('dashboard'); }
    finally { showLoader(false); }
}

function exitEditor() { switchPanel(state.currentType === 'post' ? 'dashboard' : 'pages'); }

// --- SAVING WITH INJECTION ---
document.getElementById('save-btn').addEventListener('click', async () => {
    const title = document.getElementById('meta-title').value;
    const slug = document.getElementById('meta-slug').value;
    if(!title || !slug) return showToast("Title & Slug Required", true);
    
    showLoader(true);
    const folder = state.currentType === 'post' ? `blog/${slug}` : `${slug}`;
    const path = `${folder}/index.html`;

    // 1. Process Content & Inject Ads
    let contentHtml = tinymce.activeEditor.getContent();
    contentHtml = injectAds(contentHtml, slug); // Inject custom ads

    // 2. Generate Lazy Analytics
    const lazyAnalytics = generateLazyAnalytics();

    // 3. Generate Schema
    const schemaJson = generateFinalSchema();

    // 4. Build Final HTML
    const html = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${title} - ${state.settings.siteTitle || ''}</title>
    <meta name="description" content="${document.getElementById('meta-desc').value}">
    <link rel="icon" href="${state.settings.favicon || ''}">
    <link rel="canonical" href="https://${state.settings.siteTitle ? '...' : ''}/${slug}/">
    <meta property="og:image" content="${document.getElementById('meta-banner').value}">
    
    <style>${state.settings.customCss || ''}</style>
    ${state.settings.customHeadJs || ''}
    ${state.settings.adsenseAuto || ''}
    ${lazyAnalytics}
    
    <script type="application/ld+json">${schemaJson}</script>
    <link rel="stylesheet" href="${state.currentType==='post'?'../':'./'}article.css">
</head>
<body>
    <article class="article-content">
        ${contentHtml}
    </article>
    <script src="${state.currentType==='post'?'../':'./'}article.js" defer></script>
</body>
</html>`;

    try {
        // Rename check
        if(state.currentSlug && state.currentSlug !== slug) {
            const oldPath = state.currentType === 'post' ? `blog/${state.currentSlug}/index.html` : `${state.currentSlug}/index.html`;
            await githubReq(`contents/${oldPath}`, 'DELETE', { message: 'Renamed slug', sha: state.currentSha });
            state.currentSha = null;
        }

        const body = { message: `Update ${slug}`, content: b64EncodeUnicode(html) };
        if(state.currentSha && state.currentSlug === slug) body.sha = state.currentSha;
        await githubReq(`contents/${path}`, 'PUT', body);
        showToast("Published!");
    } catch(e) { showToast(e.message, true); }
    finally { showLoader(false); }
});

// --- HELPER LOGIC ---

function injectAds(html, slug) {
    const s = state.settings.customAd;
    if(!s || s.placement === 'none' || !s.code) return html;

    // Exclusion Check
    if(s.exclude) {
        const excludes = s.exclude.split(',').map(x => x.trim());
        if(excludes.includes(slug)) return html;
    }

    const adDiv = `<div class="custom-ad-unit" style="margin:20px 0;">${s.code}</div>`;

    if(s.placement === 'below_feature') {
        return adDiv + html;
    } else if(s.placement === 'end') {
        return html + adDiv;
    } else if(s.placement.startsWith('after_p_')) {
        const pIndex = parseInt(s.placement.split('_')[2]);
        let count = 0;
        return html.replace(/<\/p>/g, (match) => {
            count++;
            return count === pIndex ? match + adDiv : match;
        });
    }
    return html;
}

function generateLazyAnalytics() {
    const gaId = state.settings.gaId;
    if(!gaId) return '';
    
    return `
    <script>
    (function() {
        const gaId = "${gaId}";
        let loaded = false;
        function loadGA() {
            if(loaded) return;
            loaded = true;
            const s = document.createElement('script');
            s.src = 'https://www.googletagmanager.com/gtag/js?id='+gaId;
            s.async = true;
            document.head.appendChild(s);
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', gaId);
        }
        window.addEventListener('scroll', loadGA, {once:true});
        window.addEventListener('mousemove', loadGA, {once:true});
        window.addEventListener('touchstart', loadGA, {once:true});
        setTimeout(loadGA, 4000);
    })();
    </script>`;
}

function generateFinalSchema() {
    const title = document.getElementById('meta-title').value;
    const banner = document.getElementById('meta-banner').value;
    const desc = document.getElementById('meta-desc').value;
    const author = document.getElementById('meta-author').value;
    const includeArticle = document.getElementById('include-article-schema').checked;

    const graph = [];

    if(includeArticle) {
        graph.push({
            "@type": "Article",
            "headline": title,
            "image": [banner],
            "author": { "@type": "Person", "name": author },
            "description": desc,
            "datePublished": new Date().toISOString()
        });
    }

    document.querySelectorAll('.schema-block:not(.default-block)').forEach(b => {
        const type = b.dataset.type;
        let obj = { "@type": type };
        
        if(type === 'FAQPage') {
            const qs = [];
            b.querySelectorAll('.repeater-item').forEach(r => {
                qs.push({ "@type": "Question", "name": r.querySelector('.faq-q').value, "acceptedAnswer": { "@type": "Answer", "text": r.querySelector('.faq-a').value } });
            });
            if(qs.length) obj.mainEntity = qs;
        } 
        // ... (Other schema types mapping same as previous code) ...
        else if(type === 'Review') {
             obj.itemReviewed = { "@type": "Thing", "name": b.querySelector('[data-key="item"]').value };
             obj.reviewRating = { "@type": "Rating", "ratingValue": b.querySelector('[data-key="rating"]').value };
             obj.reviewBody = b.querySelector('[data-key="body"]').value;
        }
        else if(type === 'Product') {
            obj.name = b.querySelector('[data-key="name"]').value;
            obj.offers = { "@type": "Offer", "price": b.querySelector('[data-key="price"]').value, "priceCurrency": b.querySelector('[data-key="currency"]').value, "availability": "https://schema.org/"+b.querySelector('[data-key="avail"]').value };
        }
        graph.push(obj);
    });

    return JSON.stringify({ "@context": "https://schema.org", "@graph": graph }, null, 4);
}

// --- TINYMCE & OTHERS ---
function initTinyMCE() {
    if(state.editorInitialized) return;
    tinymce.init({
        selector: '#tinymce-editor',
        skin: 'oxide-dark', content_css: 'dark', height: '100%',
        plugins: 'preview searchreplace autolink autosave save directionality code visualblocks visualchars fullscreen image link media template codesample table charmap pagebreak nonbreaking anchor insertdatetime advlist lists wordcount help charmap quickbars emoticons',
        toolbar: 'undo redo | blocks | bold italic | align | bullist numlist | link image media | code',
        setup: (e) => e.on('change', () => e.save())
    });
    state.editorInitialized = true;
}

// Standard Utils (Toast, Loader, Slugify, B64)... 
// (Keep the same util functions from previous version)
function showToast(msg, err) { const t=document.getElementById('toast'); t.innerText=msg; t.style.borderLeftColor=err?'red':'#00aaff'; t.classList.add('show'); setTimeout(()=>t.classList.remove('show'),3000); }
function showLoader(v) { document.getElementById('loading-overlay').classList.toggle('hidden', !v); }
function slugify(text) { return text.toLowerCase().replace(/[^\w-]+/g, '-'); }
function b64EncodeUnicode(str) { return btoa(encodeURIComponent(str).replace(/%([0-9A-F]{2})/g, (m, p1) => String.fromCharCode('0x' + p1))); }
function b64DecodeUnicode(str) { return decodeURIComponent(atob(str).split('').map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2)).join('')); }

// Add Schema Logic (UI Helpers)
function addSchemaBlock() {
    const type = document.getElementById('add-schema-type').value;
    renderSchemaBlock(type);
}
function renderSchemaBlock(type, data={}) {
    const c = document.getElementById('schema-container');
    const id = 's-'+Date.now();
    const div = document.createElement('div');
    div.className = 'schema-block'; div.dataset.type=type;
    
    // Header
    let html = `<div class="block-header"><span>${type}</span><button class="remove-schema-btn" onclick="this.closest('.schema-block').remove()">Remove</button></div>`;
    
    // Body logic (Keep same field logic as previous version)
    if(type === 'FAQPage') {
        html += `<div class="repeater-container" id="${id}-rep"></div><button class="add-repeater-btn" onclick="addFaqItem('${id}-rep')">+ FAQ</button>`;
        setTimeout(() => { if(data.mainEntity) data.mainEntity.forEach(q=>addFaqItem(id+'-rep',q.name,q.acceptedAnswer?.text)); else addFaqItem(id+'-rep'); },0);
    } 
    else if (type === 'Review') {
        html += `<div class="schema-row"><div><label class="schema-label">Item</label><input type="text" class="schema-input" data-key="item" value="${data.itemReviewed?.name||''}"></div><div><label class="schema-label">Rating</label><input type="text" class="schema-input" data-key="rating" value="${data.reviewRating?.ratingValue||''}"></div></div><div class="schema-full-row"><label class="schema-label">Body</label><textarea class="schema-input" data-key="body">${data.reviewBody||''}</textarea></div>`;
    }
    // ... Add HowTo/Product logic here same as before ...
    div.innerHTML = html;
    c.appendChild(div);
}
function addFaqItem(cid, q='', a='') {
    const d = document.createElement('div'); d.className='repeater-item';
    d.innerHTML=`<button class="repeater-remove" onclick="this.parentElement.remove()">x</button><div><label class="schema-label">Q</label><input class="schema-input faq-q" value="${q.replace(/"/g,'&quot;')}"></div><div><label class="schema-label">A</label><textarea class="schema-input faq-a">${a}</textarea></div>`;
    document.getElementById(cid).appendChild(d);
}

// --- FEATURED IMAGE DRAG & DROP ---
function setupFeaturedImageDrop() {
    const wrap = document.getElementById('featured-dropzone');
    const input = document.getElementById('meta-banner');
    const img = document.getElementById('banner-preview');

    wrap.ondragover = (e) => { e.preventDefault(); wrap.classList.add('dragover'); };
    wrap.ondragleave = () => wrap.classList.remove('dragover');
    wrap.ondrop = async (e) => {
        e.preventDefault();
        wrap.classList.remove('dragover');
        if(e.dataTransfer.files.length > 0) {
            const file = e.dataTransfer.files[0];
            await uploadFile(file, (url) => {
                input.value = url;
                img.src = url;
                img.classList.remove('hidden');
            });
        }
    };
    
    // Preview on text change
    input.oninput = () => {
        if(input.value) { img.src = input.value; img.classList.remove('hidden'); }
        else img.classList.add('hidden');
    }
}

// --- MEDIA GALLERY (COPY ONLY) ---
function switchSidebarTab(tabName) {
    document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
    document.querySelectorAll('.sidebar-content').forEach(c => c.classList.remove('active'));
    
    const index = tabName === 'settings' ? 0 : 1;
    document.querySelectorAll('.tab-btn')[index].classList.add('active');
    document.getElementById(`tab-${tabName}`).classList.add('active');

    if(tabName === 'media') loadSidebarMedia();
}

async function loadSidebarMedia() {
    const grid = document.getElementById('sidebar-media-grid');
    grid.innerHTML = '<p style="color:#888; font-size:0.8rem;">Loading...</p>';
    
    try {
        const res = await githubReq('contents/images');
        if(!res) { grid.innerHTML = '<p>No images.</p>'; return; }
        const data = await res.json();
        const images = data.filter(f => f.name.match(/\.(jpg|jpeg|png|gif|webp)$/i));
        
        grid.innerHTML = '';
        images.forEach(img => {
            const url = `https://${state.owner}.github.io/${state.repo}/images/${img.name}`;
            const div = document.createElement('div');
            div.className = 'side-media-item';
            div.innerHTML = `<img src="${img.download_url}" loading="lazy">`;
            
            // CLICK TO COPY
            div.onclick = () => {
                navigator.clipboard.writeText(url);
                showToast("Link Copied!");
            };
            grid.appendChild(div);
        });
    } catch(err) { grid.innerHTML = '<p>Error loading media.</p>'; }
}

function setupSidebarUpload() {
    const dz = document.getElementById('sidebar-dropzone');
    const inp = document.getElementById('sidebar-file-input');
    
    dz.onclick = () => inp.click();
    dz.ondragover = (e) => { e.preventDefault(); dz.style.borderColor = '#00aaff'; };
    dz.ondragleave = () => dz.style.borderColor = '#444';
    dz.ondrop = (e) => { e.preventDefault(); dz.style.borderColor = '#444'; handleUpload(e.dataTransfer.files); };
    inp.onchange = () => handleUpload(inp.files);
}

async function handleUpload(files) {
    if(files.length === 0) return;
    showToast("Uploading...", false);
    for(const file of files) {
        await uploadFile(file);
    }
    showToast("Upload Complete!");
    loadSidebarMedia();
}

async function uploadFile(file, cb) {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    await new Promise(resolve => {
        reader.onload = async () => {
            const b64 = reader.result.split(',')[1];
            const cleanName = file.name.replace(/\s+/g, '-').toLowerCase();
            const path = `images/${Date.now()}-${cleanName}`;
            
            await githubReq(`contents/${path}`, 'PUT', { message: `Upload ${cleanName}`, content: b64 });
            if(cb) cb(`https://${state.owner}.github.io/${state.repo}/${path}`);
            resolve();
        }
    });
}

// --- SAVING ---
document.getElementById('save-btn').addEventListener('click', async () => {
    const title = document.getElementById('meta-title').value;
    const slug = document.getElementById('meta-slug').value;
    if(!title || !slug) return showToast("Title & Slug Required", true);
    
    showLoader(true);
    
    const folder = state.currentType === 'post' ? `blog/${slug}` : `${slug}`;
    const path = `${folder}/index.html`;
    
    // Generate Final JSON-LD
    const schemaJson = generateFinalSchema();

    const html = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>${title}</title>
    <meta name="description" content="${document.getElementById('meta-desc').value}">
    <link rel="canonical" href="https://${state.owner}.github.io/${state.repo}/${state.currentType==='post'?'blog/':''}${slug}/">
    <meta property="og:image" content="${document.getElementById('meta-banner').value}">
    <script type="application/ld+json">${schemaJson}</script>
    <link rel="stylesheet" href="${state.currentType==='post'?'../':'./'}article.css">
</head>
<body>
    <article class="article-content">
        ${tinymce.activeEditor.getContent()}
    </article>
    <script src="${state.currentType==='post'?'../':'./'}article.js" defer></script>
</body>
</html>`;

    try {
        if(state.currentSlug && state.currentSlug !== slug) {
            const oldFolder = state.currentType === 'post' ? `blog/${state.currentSlug}` : `${state.currentSlug}`;
            await githubReq(`contents/${oldFolder}/index.html`, 'DELETE', { message: 'Delete old slug', sha: state.currentSha });
            state.currentSha = null; 
        }
        
        const body = { message: `Update ${slug}`, content: b64EncodeUnicode(html) };
        if(state.currentSha && state.currentSlug === slug) body.sha = state.currentSha;
        
        await githubReq(`contents/${path}`, 'PUT', body);
        showToast("Published Successfully!");
        
        const link = `https://${state.owner}.github.io/${state.repo}/${state.currentType==='post'?'blog/':''}${slug}/`;
        document.getElementById('live-link-container').innerHTML = `<a href="${link}" target="_blank" class="btn-secondary" style="color:white; text-decoration:none;">View Live</a>`;
        document.getElementById('live-link-container').classList.remove('hidden');

    } catch(err) { showToast("Error saving: " + err.message, true); } 
    finally { showLoader(false); }
});

async function deleteContent(type, slug) {
    if(!confirm("Are you sure?")) return;
    const path = type === 'post' ? `blog/${slug}/index.html` : `${slug}/index.html`;
    try {
        const res = await githubReq(`contents/${path}`);
        const data = await res.json();
        await githubReq(`contents/${path}`, 'DELETE', { message: 'Delete', sha: data.sha });
        showToast("Deleted");
        type === 'post' ? loadPosts() : loadPages();
    } catch(e) { console.log(e); }
}

// --- UTILS ---
function showToast(msg, err) {
    const t = document.getElementById('toast');
    t.innerText = msg;
    t.style.borderLeftColor = err ? 'red' : '#00aaff';
    t.classList.add('show');
    setTimeout(() => t.classList.remove('show'), 3000);
}
function showLoader(v) { document.getElementById('loading-overlay').classList.toggle('hidden', !v); }
function slugify(text) { return text.toLowerCase().replace(/[^\w-]+/g, '-'); }
function b64EncodeUnicode(str) { return btoa(encodeURIComponent(str).replace(/%([0-9A-F]{2})/g, (m, p1) => String.fromCharCode('0x' + p1))); }
function b64DecodeUnicode(str) { return decodeURIComponent(atob(str).split('').map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2)).join('')); }
