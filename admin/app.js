/**
 * ULTIMATE SERVERLESS CMS - FIXES & UPGRADES
 * Fixed: SHA Error, Multiple Ads, Verification Meta, Homepage, 404
 */

const state = {
    token: null, owner: null, repo: null,
    currentType: 'post', currentSlug: null, currentSha: null,
    editorInitialized: false,
    settings: {}, 
    settingsSha: null,
    pagesList: [] // Cache for homepage selector
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

function initApp() {
    document.getElementById('login-view').classList.remove('active');
    document.getElementById('app-view').classList.add('active');
    loadGlobalSettings();
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
    
    // Verification Meta
    const metaContainer = document.getElementById('meta-verify-container');
    metaContainer.innerHTML = '';
    (s.verifications || []).forEach(v => addMetaVerifyItem(v.name, v.content));

    // Custom Ads
    const adContainer = document.getElementById('ads-repeater-container');
    adContainer.innerHTML = '';
    (s.ads || []).forEach(ad => addAdUnit(ad));

    // Update Homepage Select
    updateHomepageSelect(s.homepage);
}

function updateHomepageSelect(selectedVal) {
    const sel = document.getElementById('set-homepage-select');
    sel.innerHTML = '<option value="">-- Select a Page --</option>';
    state.pagesList.forEach(p => {
        const opt = document.createElement('option');
        opt.value = p;
        opt.innerText = p;
        if(p === selectedVal) opt.selected = true;
        sel.appendChild(opt);
    });
}

async function saveGlobalSettings() {
    showLoader(true);
    
    // Ads Collection
    const ads = [];
    document.querySelectorAll('.ad-unit-block').forEach(b => {
        ads.push({
            code: b.querySelector('.ad-code-input').value,
            placement: b.querySelector('.ad-place-input').value,
            exclude: b.querySelector('.ad-exclude-input').value
        });
    });

    // Verification Collection
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
        // 1. Save Settings JSON
        const body = { message: 'Update Settings', content: b64EncodeUnicode(JSON.stringify(s, null, 2)) };
        if(state.settingsSha) body.sha = state.settingsSha;
        const res = await githubReq('contents/_cms/settings.json', 'PUT', body);
        state.settingsSha = await res.json().then(d => d.content.sha);

        // 2. Handle Homepage (Copy selected page to index.html)
        if(s.homepage) {
            const pageRes = await githubReq(`contents/${s.homepage}/index.html`);
            if(pageRes) {
                const pageData = await pageRes.json();
                let indexSha = null;
                const indexRes = await githubReq('contents/index.html');
                if(indexRes) indexSha = await indexRes.json().then(d => d.sha);
                
                await githubReq('contents/index.html', 'PUT', {
                    message: `Set homepage to ${s.homepage}`,
                    content: pageData.content,
                    sha: indexSha
                });
            }
        }

        // 3. Handle 404
        if(s.enable404) {
            let sha404 = null;
            const res404 = await githubReq('contents/404.html');
            if(res404) sha404 = await res404.json().then(d => d.sha);
            
            const html404 = `<!DOCTYPE html><html><head><meta http-equiv="refresh" content="0; url=/${state.repo}/"></head><body>Redirecting...</body></html>`;
            await githubReq('contents/404.html', 'PUT', { message: 'Update 404', content: b64EncodeUnicode(html404), sha: sha404 });
        }

        showToast('Settings Saved!');
    } catch(e) { showToast(e.message, true); }
    finally { showLoader(false); }
}

// --- DATA LISTS ---
async function loadPosts() { renderList('contents/blog', 'posts-list-body', 'post'); }
async function loadPages() { 
    state.pagesList = []; // Reset
    renderList('contents', 'pages-list-body', 'page'); 
}

async function renderList(endpoint, tbodyId, type) {
    const tbody = document.getElementById(tbodyId);
    tbody.innerHTML = '<tr><td colspan="3">Loading...</td></tr>';
    try {
        const res = await githubReq(endpoint);
        if(!res) { tbody.innerHTML = '<tr><td colspan="3">None found.</td></tr>'; return; }
        const data = await res.json();
        const restricted = ['blog', 'images', 'admin', 'css', 'js', '.git', '_cms'];
        const folders = data.filter(item => item.type === 'dir' && !restricted.includes(item.name));
        
        let html = '';
        folders.forEach(f => {
            if(type === 'page') state.pagesList.push(f.name); // Cache for selector
            html += `<tr><td><strong>${f.name}</strong></td><td>/${f.name}/</td><td><button class="btn-primary" onclick="editContent('${type}', '${f.name}')">Edit</button> <button class="btn-secondary" style="background:red" onclick="deleteContent('${type}', '${f.name}')">Del</button></td></tr>`;
        });
        tbody.innerHTML = html || '<tr><td colspan="3">Empty.</td></tr>';
    } catch(e) { tbody.innerHTML = `<tr><td colspan="3">${e.message}</td></tr>`; }
}

// --- EDITOR ---
function createNew(type) {
    state.currentType = type; state.currentSlug = null; state.currentSha = null;
    document.getElementById('meta-title').value = '';
    document.getElementById('meta-slug').value = '';
    document.getElementById('meta-desc').value = '';
    document.getElementById('meta-banner').value = '';
    document.getElementById('banner-preview').classList.add('hidden');
    document.getElementById('include-article-schema').checked = true;
    document.getElementById('schema-container').innerHTML = '';
    addDefaultArticleSchema(true);

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
        state.currentSha = data.sha; // Capture initial SHA
        
        const doc = new DOMParser().parseFromString(b64DecodeUnicode(data.content), 'text/html');
        document.getElementById('meta-title').value = doc.querySelector('title')?.innerText.split(' - ')[0] || slug;
        document.getElementById('meta-slug').value = slug;
        document.getElementById('meta-desc').value = doc.querySelector('meta[name="description"]')?.content || '';
        document.getElementById('meta-banner').value = doc.querySelector('meta[property="og:image"]')?.content || '';
        
        switchPanel('editor');
        initTinyMCE();
        const content = doc.querySelector('.article-content')?.innerHTML || '';
        setTimeout(() => tinymce.activeEditor.setContent(content), 500);

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

    } catch(e) { showToast(e.message, true); switchPanel('dashboard'); }
    finally { showLoader(false); }
}

// CRITICAL FIX: FETCH LATEST SHA BEFORE SAVE
async function getLatestFileSha(path) {
    try {
        const res = await githubReq(`contents/${path}`, 'GET');
        if (res) {
            const data = await res.json();
            return data.sha;
        }
    } catch (e) { return null; }
    return null;
}

document.getElementById('save-btn').addEventListener('click', async () => {
    const title = document.getElementById('meta-title').value;
    const slug = document.getElementById('meta-slug').value;
    if(!title || !slug) return showToast("Title & Slug Required", true);
    
    showLoader(true);
    const folder = state.currentType === 'post' ? `blog/${slug}` : `${slug}`;
    const path = `${folder}/index.html`;

    // 1. Inject Ads
    let contentHtml = tinymce.activeEditor.getContent();
    contentHtml = injectAds(contentHtml, slug);

    // 2. Build Head
    const siteTitle = state.settings.siteTitle || '';
    const siteUrl = state.settings.siteUrl || `https://${state.owner}.github.io/${state.repo}`;
    const fullUrl = `${siteUrl}/${state.currentType==='post'?'blog/':''}${slug}/`;
    
    const verifications = (state.settings.verifications || []).map(v => `<meta name="${v.name}" content="${v.content}">`).join('\n');
    const lazyAnalytics = generateLazyAnalytics();
    const schemaJson = generateFinalSchema(siteUrl, fullUrl, title, document.getElementById('meta-banner').value);

    const html = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${title} - ${siteTitle}</title>
    <meta name="description" content="${document.getElementById('meta-desc').value}">
    <link rel="icon" href="${state.settings.favicon || ''}">
    <link rel="canonical" href="${fullUrl}">
    <meta property="og:image" content="${document.getElementById('meta-banner').value}">
    ${verifications}
    <style>${state.settings.customCss || ''}</style>
    ${state.settings.customHeadJs || ''}
    ${state.settings.adsenseAuto || ''}
    ${lazyAnalytics}
    <script type="application/ld+json">${schemaJson}</script>
    <link rel="stylesheet" href="${state.currentType==='post'?'../':'./'}article.css">
</head>
<body>
    <article class="article-content">${contentHtml}</article>
    <script src="${state.currentType==='post'?'../':'./'}article.js" defer></script>
</body></html>`;

    try {
        // Rename Logic
        if(state.currentSlug && state.currentSlug !== slug) {
            const oldPath = state.currentType === 'post' ? `blog/${state.currentSlug}/index.html` : `${state.currentSlug}/index.html`;
            // Must get latest SHA of OLD file to delete it
            const oldSha = await getLatestFileSha(oldPath);
            if(oldSha) await githubReq(`contents/${oldPath}`, 'DELETE', { message: 'Move', sha: oldSha });
            state.currentSha = null; // Reset because we are making a new file technically
        }

        // CRITICAL FIX: Get Fresh SHA for the target path
        const freshSha = await getLatestFileSha(path);
        
        const body = { message: `Update ${slug}`, content: b64EncodeUnicode(html) };
        if(freshSha) body.sha = freshSha;
        else if(state.currentSha && state.currentSlug === slug) body.sha = state.currentSha;

        const res = await githubReq(`contents/${path}`, 'PUT', body);
        const resData = await res.json();
        state.currentSha = resData.content.sha; // Update state with new SHA
        state.currentSlug = slug;

        showToast("Published!");
        document.getElementById('live-link-container').innerHTML = `<a href="${fullUrl}" target="_blank" class="btn-secondary" style="color:white;text-decoration:none;">View Live</a>`;
        document.getElementById('live-link-container').classList.remove('hidden');
    } catch(e) { showToast(e.message, true); }
    finally { showLoader(false); }
});

// --- INJECTION LOGIC ---
function injectAds(html, slug) {
    const ads = state.settings.ads || [];
    if(!ads.length) return html;

    let modifiedHtml = html;
    
    ads.forEach(ad => {
        if(!ad.code || ad.placement === 'none') return;
        // Check Exclude
        if(ad.exclude && ad.exclude.split(',').map(s=>s.trim()).includes(slug)) return;

        const adCode = `<div class="ad-unit">${ad.code}</div>`;
        
        if(ad.placement === 'below_feature') {
            modifiedHtml = adCode + modifiedHtml;
        } else if(ad.placement === 'end') {
            modifiedHtml = modifiedHtml + adCode;
        } else if(ad.placement.startsWith('after_p_')) {
            const pNum = parseInt(ad.placement.split('_')[2]);
            let count = 0;
            modifiedHtml = modifiedHtml.replace(/<\/p>/g, (match) => {
                count++;
                return count === pNum ? match + adCode : match;
            });
        }
    });
    return modifiedHtml;
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

function generateFinalSchema(siteUrl, url, headline, image) {
    const author = document.getElementById('meta-author').value;
    const includeArticle = document.getElementById('include-article-schema').checked;
    const graph = [];

    if(includeArticle) {
        graph.push({
            "@type": "Article",
            "headline": headline,
            "image": [image],
            "author": { "@type": "Person", "name": author },
            "datePublished": new Date().toISOString()
        });
    }

    document.querySelectorAll('.schema-block:not(.default-block)').forEach(b => {
        const type = b.dataset.type;
        let obj = { "@type": type };
        if(type === 'FAQPage') {
            const qs=[]; b.querySelectorAll('.repeater-item').forEach(r=>{qs.push({"@type":"Question","name":r.querySelector('.faq-q').value,"acceptedAnswer":{"@type":"Answer","text":r.querySelector('.faq-a').value}})});
            if(qs.length) obj.mainEntity = qs;
        }
        // ... (Keep existing Review/Product logic) ...
        graph.push(obj);
    });
    return JSON.stringify({ "@context": "https://schema.org", "@graph": graph }, null, 4);
}

// --- REPEATERS UI ---
function addMetaVerifyItem(name='', content='') {
    const c = document.getElementById('meta-verify-container');
    const d = document.createElement('div'); d.className='repeater-item meta-item-row';
    d.innerHTML = `<button class="repeater-remove" onclick="this.parentElement.remove()">x</button>
    <div style="display:grid; grid-template-columns:1fr 2fr; gap:10px;">
        <input placeholder="Name (e.g. google-site-verification)" class="schema-input meta-name" value="${name}">
        <input placeholder="Content Code" class="schema-input meta-content" value="${content}">
    </div>`;
    c.appendChild(d);
}

function addAdUnit(data = {}) {
    const c = document.getElementById('ads-repeater-container');
    const d = document.createElement('div'); d.className = 'ad-unit-block';
    d.innerHTML = `<button class="ad-remove-btn" onclick="this.parentElement.remove()"><i class="fa-solid fa-trash"></i></button>
    <label class="schema-label">Ad HTML</label>
    <textarea class="schema-input ad-code-input" rows="2">${data.code || ''}</textarea>
    <div class="ad-meta-row">
        <div>
            <label class="schema-label">Placement</label>
            <select class="schema-input ad-place-input">
                <option value="none">Disabled</option>
                <option value="below_feature" ${data.placement==='below_feature'?'selected':''}>Below Feature Image</option>
                <option value="after_p_1" ${data.placement==='after_p_1'?'selected':''}>After Para 1</option>
                <option value="after_p_2" ${data.placement==='after_p_2'?'selected':''}>After Para 2</option>
                <option value="after_p_3" ${data.placement==='after_p_3'?'selected':''}>After Para 3</option>
                <option value="after_p_4" ${data.placement==='after_p_4'?'selected':''}>After Para 4</option>
                <option value="end" ${data.placement==='end'?'selected':''}>End of Content</option>
            </select>
        </div>
        <div>
            <label class="schema-label">Exclude Slugs (comma sep)</label>
            <input class="schema-input ad-exclude-input" value="${data.exclude || ''}" placeholder="e.g. contact, about">
        </div>
    </div>`;
    c.appendChild(d);
}

function addDefaultArticleSchema(checked) {
    const c = document.getElementById('schema-container');
    const div = document.createElement('div'); div.className='schema-block default-block';
    div.innerHTML=`<div class="block-header"><span>Article Schema</span><label class="switch-label"><input type="checkbox" id="include-article-schema" ${checked?'checked':''}><span class="chk-text">Enable</span></label></div><small style="color:#666">Auto-generated</small>`;
    c.prepend(div);
}

// ... (Keep existing loadSidebarMedia, uploadFile, setupFeaturedImageDrop, initTinyMCE, showToast, showLoader, slugify, b64 utils from previous response)
// Ensure you include the initTinyMCE function from the previous response here.
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

// Utils (Standard)
function showToast(msg,err){const t=document.getElementById('toast');t.innerText=msg;t.style.borderLeftColor=err?'red':'#00aaff';t.classList.add('show');setTimeout(()=>t.classList.remove('show'),3000)}
function showLoader(v){document.getElementById('loading-overlay').classList.toggle('hidden',!v)}
function slugify(t){return t.toLowerCase().replace(/[^\w-]+/g,'-')}
function b64EncodeUnicode(str){return btoa(encodeURIComponent(str).replace(/%([0-9A-F]{2})/g,(m,p1)=>String.fromCharCode('0x'+p1)))}
function b64DecodeUnicode(str){return decodeURIComponent(atob(str).split('').map(c=>'%'+('00'+c.charCodeAt(0).toString(16)).slice(-2)).join(''))}
function addSchemaBlock() { const type = document.getElementById('add-schema-type').value; renderSchemaBlock(type); }
function renderSchemaBlock(type, data={}) {
    const c=document.getElementById('schema-container'); const id='s-'+Date.now(); const div=document.createElement('div'); div.className='schema-block'; div.dataset.type=type;
    let html=`<div class="block-header"><span>${type}</span><button class="remove-schema-btn" onclick="this.closest('.schema-block').remove()">Remove</button></div>`;
    if(type==='FAQPage'){ html+=`<div class="repeater-container" id="${id}-rep"></div><button class="add-repeater-btn" onclick="addFaqItem('${id}-rep')">+ FAQ</button>`; setTimeout(()=>{if(data.mainEntity)data.mainEntity.forEach(q=>addFaqItem(id+'-rep',q.name,q.acceptedAnswer?.text));else addFaqItem(id+'-rep')},0);}
    else if(type==='Review'){ html+=`<div class="schema-row"><div><label class="schema-label">Item</label><input type="text" class="schema-input" data-key="item" value="${data.itemReviewed?.name||''}"></div><div><label class="schema-label">Rating</label><input type="text" class="schema-input" data-key="rating" value="${data.reviewRating?.ratingValue||''}"></div></div><div class="schema-full-row"><label class="schema-label">Body</label><textarea class="schema-input" data-key="body">${data.reviewBody||''}</textarea></div>`; }
    else if(type==='Product'){ html+=`<div class="schema-row"><div><label class="schema-label">Name</label><input type="text" class="schema-input" data-key="name" value="${data.name||''}"></div><div><label class="schema-label">Price</label><input type="text" class="schema-input" data-key="price" value="${data.offers?.price||''}"></div></div><div class="schema-row"><div><label class="schema-label">Currency</label><input type="text" class="schema-input" data-key="currency" value="${data.offers?.priceCurrency||'USD'}"></div><div><label class="schema-label">Avail</label><select class="schema-input" data-key="avail"><option value="InStock">In Stock</option><option value="OutOfStock">Out</option></select></div></div>`;}
    div.innerHTML=html; c.appendChild(div);
}
function addFaqItem(cid,q='',a=''){const d=document.createElement('div');d.className='repeater-item';d.innerHTML=`<button class="repeater-remove" onclick="this.parentElement.remove()">x</button><div><label class="schema-label">Q</label><input class="schema-input faq-q" value="${q.replace(/"/g,'&quot;')}"></div><div><label class="schema-label">A</label><textarea class="schema-input faq-a">${a}</textarea></div>`;document.getElementById(cid).appendChild(d);}
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
async function handleUpload(f){if(!f.length)return;showToast("Uploading...",0);for(const file of f)await uploadFile(file);showToast("Done!");loadSidebarMedia()}
async function uploadFile(f,cb){const r=new FileReader();r.readAsDataURL(f);await new Promise(res=>{r.onload=async()=>{const b=r.result.split(',')[1],p=`images/${Date.now()}-${f.name.replace(/\s+/g,'-').toLowerCase()}`;await githubReq(`contents/${p}`,'PUT',{message:'Up',content:b});if(cb)cb(`https://${state.owner}.github.io/${state.repo}/${p}`);res()}})}
async function loadSidebarMedia(){const g=document.getElementById('sidebar-media-grid');g.innerHTML='...';try{const r=await githubReq('contents/images');if(!r){g.innerHTML='No media';return}const d=await r.json(),i=d.filter(x=>x.name.match(/\.(jpg|png|gif|webp)$/i));g.innerHTML='';i.forEach(x=>{const u=`https://${state.owner}.github.io/${state.repo}/images/${x.name}`,d=document.createElement('div');d.className='side-media-item';d.innerHTML=`<img src="${x.download_url}" loading="lazy">`;d.onclick=()=>{navigator.clipboard.writeText(u);showToast("Copied!")};g.appendChild(d)})}catch(e){g.innerHTML='Err'}}
function exitEditor(){switchPanel(state.currentType==='post'?'dashboard':'pages')}
