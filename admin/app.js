/**
 * ULTIMATE SERVERLESS CMS - UPDATED
 * Features: Collapsible Sidebar, Advanced Schema, Drag-Drop, Robust Editor
 */

// --- STATE ---
const state = {
    token: null,
    owner: null,
    repo: null,
    currentType: 'post', 
    currentSlug: null,
    currentSha: null,
    editorInitialized: false,
    schemaData: [] // Stores additional schema objects
};

// --- INIT ---
document.addEventListener('DOMContentLoaded', () => {
    // 1. Check LocalStorage
    const t = localStorage.getItem('gh_token');
    const o = localStorage.getItem('gh_owner');
    const r = localStorage.getItem('gh_repo');

    if (t && o && r) {
        state.token = t;
        state.owner = o;
        state.repo = r;
        initApp();
    } else {
        document.getElementById('login-view').classList.add('active');
    }

    // Sidebar & UI Setup
    setupSidebarEvents();
    setupSidebarUpload(); // Media Gallery
    setupFeaturedImageDrop(); // Featured Image
});

// --- NAVIGATION & UI ---
function initApp() {
    document.getElementById('login-view').classList.remove('active');
    document.getElementById('app-view').classList.add('active');
    switchPanel('dashboard');
}

function switchPanel(id) {
    // Hide all panels
    document.querySelectorAll('.panel').forEach(p => p.classList.remove('active'));
    // Show target
    document.getElementById(`panel-${id}`).classList.add('active');
    
    // Update Nav Highlight
    document.querySelectorAll('.nav-item').forEach(b => b.classList.remove('active'));
    const navId = id === 'dashboard' ? 'nav-btn-dashboard' : (id === 'pages' ? 'nav-btn-pages' : '');
    if(navId) document.getElementById(navId).classList.add('active');

    // Refresh Data
    if(id === 'dashboard') loadPosts();
    if(id === 'pages') loadPages();
}

function setupSidebarEvents() {
    const sidebar = document.getElementById('main-sidebar');
    const toggleBtn = document.getElementById('sidebar-toggle-btn');
    const expandBtn = document.getElementById('sidebar-expand-btn');

    const toggleFn = () => {
        sidebar.classList.toggle('collapsed');
        // Show expand button in editor header if sidebar is collapsed
        if(sidebar.classList.contains('collapsed')) {
            expandBtn.classList.remove('hidden');
        } else {
            expandBtn.classList.add('hidden');
        }
    };

    toggleBtn.addEventListener('click', toggleFn);
    expandBtn.addEventListener('click', toggleFn);
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

        localStorage.setItem('gh_token', t);
        localStorage.setItem('gh_owner', o);
        localStorage.setItem('gh_repo', r);
        state.token = t; state.owner = o; state.repo = r;

        initApp();
    } catch (err) {
        showToast(err.message, true);
    }
});

document.getElementById('nav-logout').addEventListener('click', () => {
    localStorage.clear();
    location.reload();
});

// --- API HELPERS ---
async function githubReq(endpoint, method = 'GET', body = null) {
    const opts = {
        method,
        headers: {
            Authorization: `Bearer ${state.token}`,
            Accept: 'application/vnd.github.v3+json',
            'Content-Type': 'application/json'
        }
    };
    if (body) opts.body = JSON.stringify(body);
    const res = await fetch(`https://api.github.com/repos/${state.owner}/${state.repo}/${endpoint}`, opts);
    
    if (!res.ok && method === 'GET' && res.status === 404) return null; 
    
    if (!res.ok) {
        const err = await res.json().catch(() => ({ message: 'Unknown Error' }));
        throw new Error(err.message || res.statusText);
    }
    return res;
}

// --- DATA LOADING ---
async function loadPosts() {
    const tbody = document.getElementById('posts-list-body');
    tbody.innerHTML = '<tr><td colspan="3">Loading...</td></tr>';
    try {
        const res = await githubReq('contents/blog');
        if (!res) { tbody.innerHTML = '<tr><td colspan="3">No blog folder.</td></tr>'; return; }
        const data = await res.json();
        const folders = data.filter(item => item.type === 'dir');
        
        let html = '';
        for (const f of folders) {
            const liveLink = `https://${state.owner}.github.io/${state.repo}/blog/${f.name}/`;
            html += `<tr><td><strong>${f.name}</strong></td><td>/blog/${f.name}/</td><td><button class="btn-primary" onclick="editContent('post', '${f.name}')">Edit</button> <a href="${liveLink}" target="_blank" class="btn-secondary">View</a> <button class="btn-secondary" style="background:red" onclick="deleteContent('post', '${f.name}')">Del</button></td></tr>`;
        }
        tbody.innerHTML = html || '<tr><td colspan="3">No posts found.</td></tr>';
    } catch (err) { tbody.innerHTML = `<tr><td colspan="3">Error: ${err.message}</td></tr>`; }
}

async function loadPages() {
    const tbody = document.getElementById('pages-list-body');
    tbody.innerHTML = '<tr><td colspan="3">Loading...</td></tr>';
    try {
        const res = await githubReq('contents');
        const data = await res.json();
        const restricted = ['blog', 'images', 'admin', 'css', 'js', '.git'];
        const folders = data.filter(item => item.type === 'dir' && !restricted.includes(item.name));
        
        let html = '';
        for (const f of folders) {
            const liveLink = `https://${state.owner}.github.io/${state.repo}/${f.name}/`;
            html += `<tr><td><strong>${f.name}</strong></td><td>/${f.name}/</td><td><button class="btn-primary" onclick="editContent('page', '${f.name}')">Edit</button> <a href="${liveLink}" target="_blank" class="btn-secondary">View</a> <button class="btn-secondary" style="background:red" onclick="deleteContent('page', '${f.name}')">Del</button></td></tr>`;
        }
        tbody.innerHTML = html || '<tr><td colspan="3">No pages found.</td></tr>';
    } catch (err) { tbody.innerHTML = `<tr><td colspan="3">Error: ${err.message}</td></tr>`; }
}

// --- EDITOR LOGIC ---
function createNew(type) {
    state.currentType = type;
    state.currentSlug = null;
    state.currentSha = null;
    state.schemaData = []; // Reset schema
    
    // UI Resets
    document.getElementById('meta-title').value = '';
    document.getElementById('meta-slug').value = '';
    document.getElementById('meta-desc').value = '';
    document.getElementById('meta-banner').value = '';
    document.getElementById('banner-preview').classList.add('hidden');
    document.getElementById('live-link-container').classList.add('hidden');
    document.getElementById('schema-container').innerHTML = `
        <div class="schema-block default-block">
            <div class="block-header"><span>Article (Default)</span> <small>Auto-generated</small></div>
        </div>`;
    
    switchPanel('editor');
    initTinyMCE();
    if(tinymce.activeEditor) tinymce.activeEditor.setContent('');
    
    // Auto Slug
    document.getElementById('meta-title').oninput = function() {
        if(!state.currentSlug) document.getElementById('meta-slug').value = slugify(this.value);
    };
    switchSidebarTab('settings');
}

async function editContent(type, slug) {
    showLoader(true);
    state.currentType = type;
    state.currentSlug = slug;
    
    try {
        const path = type === 'post' ? `blog/${slug}/index.html` : `${slug}/index.html`;
        const res = await githubReq(`contents/${path}`);
        if(!res) throw new Error("File not found");
        
        const data = await res.json();
        state.currentSha = data.sha;
        
        const content = b64DecodeUnicode(data.content);
        const parser = new DOMParser();
        const doc = parser.parseFromString(content, 'text/html');
        
        // Fill Meta
        document.getElementById('meta-title').value = doc.querySelector('title')?.innerText || slug;
        document.getElementById('meta-title').oninput = null; 
        document.getElementById('meta-slug').value = slug;
        document.getElementById('meta-desc').value = doc.querySelector('meta[name="description"]')?.content || '';
        
        const banner = doc.querySelector('meta[property="og:image"]')?.content || '';
        document.getElementById('meta-banner').value = banner;
        if(banner) {
            document.getElementById('banner-preview').src = banner;
            document.getElementById('banner-preview').classList.remove('hidden');
        }

        // Init Editor
        switchPanel('editor');
        initTinyMCE();
        const body = doc.querySelector('.article-content')?.innerHTML || '';
        setTimeout(() => tinymce.activeEditor.setContent(body), 500);

        // Load Schema
        const script = doc.querySelector('script[type="application/ld+json"]');
        document.getElementById('schema-container').innerHTML = `
        <div class="schema-block default-block">
            <div class="block-header"><span>Article (Default)</span> <small>Auto-generated</small></div>
        </div>`;
        state.schemaData = [];

        if(script) {
            try {
                const json = JSON.parse(script.innerText);
                // Handle Array of Schemas (Graph) or Single Object
                const graph = json['@graph'] || (Array.isArray(json) ? json : [json]);
                
                graph.forEach(obj => {
                    if(obj['@type'] !== 'Article') {
                        renderSchemaBlock(obj['@type'], obj);
                    }
                });
            } catch(e) { console.error("Schema Parse Error", e); }
        }

    } catch(err) {
        showToast("Error loading file: " + err.message, true);
        switchPanel('dashboard');
    } finally {
        showLoader(false);
    }
}

function exitEditor() {
    if(state.currentType === 'post') switchPanel('dashboard');
    else switchPanel('pages');
}

// --- TINYMCE FULL SETUP ---
function initTinyMCE() {
    if(state.editorInitialized) return;
    tinymce.init({
        selector: '#tinymce-editor',
        skin: 'oxide-dark',
        content_css: 'dark',
        height: '100%', // Fills the container
        // FULL PLUGINS LIST
        plugins: 'preview importcss searchreplace autolink autosave save directionality code visualblocks visualchars fullscreen image link media template codesample table charmap pagebreak nonbreaking anchor insertdatetime advlist lists wordcount help charmap quickbars emoticons',
        menubar: 'file edit view insert format tools table help',
        toolbar: 'undo redo | bold italic underline strikethrough | fontfamily fontsize blocks | alignleft aligncenter alignright alignjustify | outdent indent |  numlist bullist | forecolor backcolor removeformat | pagebreak | charmap emoticons | fullscreen  preview save print | insertfile image media template link anchor codesample | ltr rtl | code',
        setup: (editor) => {
            editor.on('change', () => { editor.save(); });
        }
    });
    state.editorInitialized = true;
}

// --- SCHEMA BUILDER (Advanced) ---
function addSchemaBlock() {
    const type = document.getElementById('add-schema-type').value;
    renderSchemaBlock(type);
}

function renderSchemaBlock(type, data = {}) {
    const container = document.getElementById('schema-container');
    const blockId = 'schema-' + Date.now();
    const div = document.createElement('div');
    div.className = 'schema-block';
    div.id = blockId;
    div.dataset.type = type;

    let fieldsHtml = '';
    
    // Schema Logic
    if (type === 'FAQPage') {
        div.dataset.isArray = "true"; // Special flag for array based items
        fieldsHtml = `
            <div class="repeater-container" id="${blockId}-faqs"></div>
            <button class="add-repeater-btn" onclick="addFaqItem('${blockId}-faqs')">+ Add FAQ</button>
        `;
        // If loading data
        setTimeout(() => {
            if(data.mainEntity) {
                data.mainEntity.forEach(q => addFaqItem(`${blockId}-faqs`, q.name, q.acceptedAnswer?.text));
            } else {
                addFaqItem(`${blockId}-faqs`); // Add 1 empty
            }
        }, 0);

    } else if (type === 'Review') {
        fieldsHtml = `
            <div class="schema-row">
                <div><label class="schema-label">Item Name</label><input type="text" class="schema-input" data-key="item" value="${data.itemReviewed?.name || ''}"></div>
                <div><label class="schema-label">Rating (1-5)</label><input type="number" class="schema-input" data-key="rating" step="0.1" value="${data.reviewRating?.ratingValue || ''}"></div>
            </div>
            <div class="schema-full-row">
                <label class="schema-label">Review Body</label><textarea class="schema-input" data-key="body" rows="2">${data.reviewBody || ''}</textarea>
            </div>
        `;

    } else if (type === 'HowTo') {
        fieldsHtml = `
            <div class="schema-full-row">
                <label class="schema-label">HowTo Title</label><input type="text" class="schema-input" data-key="name" value="${data.name || ''}">
            </div>
            <div class="schema-full-row">
                 <label class="schema-label">Description</label><textarea class="schema-input" data-key="desc">${data.description || ''}</textarea>
            </div>
            <label class="schema-label" style="margin-top:10px;">Steps:</label>
            <div class="repeater-container" id="${blockId}-steps"></div>
            <button class="add-repeater-btn" onclick="addStepItem('${blockId}-steps')">+ Add Step</button>
        `;
        setTimeout(() => {
            if(data.step) {
                data.step.forEach(s => addStepItem(`${blockId}-steps`, s.text));
            } else {
                addStepItem(`${blockId}-steps`);
            }
        }, 0);

    } else if (type === 'Product') {
        fieldsHtml = `
             <div class="schema-row">
                <div><label class="schema-label">Product Name</label><input type="text" class="schema-input" data-key="name" value="${data.name || ''}"></div>
                <div><label class="schema-label">Price</label><input type="text" class="schema-input" data-key="price" value="${data.offers?.price || ''}"></div>
            </div>
            <div class="schema-row">
                <div><label class="schema-label">Currency</label><input type="text" class="schema-input" data-key="currency" value="${data.offers?.priceCurrency || 'USD'}"></div>
                <div><label class="schema-label">Availability</label><select class="schema-input" data-key="avail"><option value="InStock">In Stock</option><option value="OutOfStock">Out of Stock</option></select></div>
            </div>
        `;
    }

    div.innerHTML = `
        <div class="block-header">
            <span>${type}</span>
            <button class="remove-schema-btn" onclick="this.closest('.schema-block').remove()">Remove</button>
        </div>
        ${fieldsHtml}
    `;
    container.appendChild(div);
}

// Repeater Logic (FAQ / HowTo)
function addFaqItem(containerId, q = '', a = '') {
    const c = document.getElementById(containerId);
    const div = document.createElement('div');
    div.className = 'repeater-item';
    div.innerHTML = `
        <button class="repeater-remove" onclick="this.parentElement.remove()"><i class="fa-solid fa-times"></i></button>
        <div style="margin-bottom:5px;"><label class="schema-label">Question</label><input type="text" class="schema-input faq-q" value="${q.replace(/"/g, '&quot;')}"></div>
        <div><label class="schema-label">Answer</label><textarea class="schema-input faq-a" rows="2">${a}</textarea></div>
    `;
    c.appendChild(div);
}

function addStepItem(containerId, txt = '') {
    const c = document.getElementById(containerId);
    const div = document.createElement('div');
    div.className = 'repeater-item';
    div.innerHTML = `
        <button class="repeater-remove" onclick="this.parentElement.remove()"><i class="fa-solid fa-times"></i></button>
        <div><label class="schema-label">Step Instruction</label><textarea class="schema-input step-txt" rows="2">${txt}</textarea></div>
    `;
    c.appendChild(div);
}

function generateFinalSchema() {
    const title = document.getElementById('meta-title').value;
    const banner = document.getElementById('meta-banner').value;
    const desc = document.getElementById('meta-desc').value;
    const author = document.getElementById('meta-author').value;

    // 1. Base Article Schema
    const article = {
        "@type": "Article",
        "headline": title,
        "image": banner ? [banner] : [],
        "author": { "@type": "Person", "name": author },
        "description": desc,
        "datePublished": new Date().toISOString()
    };

    const graph = [article];

    // 2. Loop through dynamic blocks
    const blocks = document.querySelectorAll('.schema-block:not(.default-block)');
    blocks.forEach(b => {
        const type = b.dataset.type;
        let schemaObj = { "@type": type };

        if(type === 'FAQPage') {
            const qs = [];
            b.querySelectorAll('.repeater-item').forEach(r => {
                const q = r.querySelector('.faq-q').value;
                const a = r.querySelector('.faq-a').value;
                if(q && a) {
                    qs.push({
                        "@type": "Question",
                        "name": q,
                        "acceptedAnswer": { "@type": "Answer", "text": a }
                    });
                }
            });
            if(qs.length) schemaObj.mainEntity = qs;
        
        } else if(type === 'Review') {
            const item = b.querySelector('[data-key="item"]').value;
            const rating = b.querySelector('[data-key="rating"]').value;
            const body = b.querySelector('[data-key="body"]').value;
            schemaObj.itemReviewed = { "@type": "Thing", "name": item };
            schemaObj.reviewRating = { "@type": "Rating", "ratingValue": rating };
            schemaObj.reviewBody = body;
            schemaObj.author = { "@type": "Person", "name": author };

        } else if(type === 'HowTo') {
            schemaObj.name = b.querySelector('[data-key="name"]').value;
            schemaObj.description = b.querySelector('[data-key="desc"]').value;
            const steps = [];
            b.querySelectorAll('.step-txt').forEach(s => {
                if(s.value) steps.push({ "@type": "HowToStep", "text": s.value });
            });
            schemaObj.step = steps;

        } else if(type === 'Product') {
            schemaObj.name = b.querySelector('[data-key="name"]').value;
            const price = b.querySelector('[data-key="price"]').value;
            const curr = b.querySelector('[data-key="currency"]').value;
            schemaObj.offers = { 
                "@type": "Offer", 
                "price": price, 
                "priceCurrency": curr,
                "availability": "https://schema.org/" + b.querySelector('[data-key="avail"]').value 
            };
        }

        graph.push(schemaObj);
    });

    return JSON.stringify({ "@context": "https://schema.org", "@graph": graph }, null, 4);
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
