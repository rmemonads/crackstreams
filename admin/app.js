/**
 * ULTIMATE SERVERLESS CMS
 * Supports: Posts, Pages, Media Library, Dynamic Schema, Sidebar Toggle
 */

// --- STATE ---
const state = {
    token: localStorage.getItem('gh_token'),
    owner: localStorage.getItem('gh_owner'),
    repo: localStorage.getItem('gh_repo'),
    currentType: 'post', // 'post' or 'page'
    currentSlug: null,
    currentSha: null,
    editorInitialized: false
};

const DOM = {
    login: document.getElementById('login-view'),
    app: document.getElementById('app-view'),
    sidebar: document.getElementById('sidebar'),
    panels: {
        dashboard: document.getElementById('panel-dashboard'),
        pages: document.getElementById('panel-pages'),
        media: document.getElementById('panel-media'),
        editor: document.getElementById('panel-editor')
    },
    tables: {
        posts: document.getElementById('posts-list-body'),
        pages: document.getElementById('pages-list-body')
    }
};

// --- INIT ---
document.addEventListener('DOMContentLoaded', () => {
    if (state.token) {
        initApp();
    } else {
        DOM.login.classList.add('active');
    }
    
    // Schema Change Listener
    document.getElementById('schema-selector').addEventListener('change', (e) => {
        renderSchemaInputs(e.target.value);
    });

    // Media Drag & Drop
    setupMediaUploader();
});

// --- SIDEBAR TOGGLE ---
document.getElementById('sidebar-toggle').addEventListener('click', () => {
    DOM.sidebar.classList.toggle('collapsed');
});

// --- AUTH ---
document.getElementById('login-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const t = document.getElementById('gh-token').value.trim();
    const o = document.getElementById('gh-owner').value.trim();
    const r = document.getElementById('gh-repo').value.trim();

    try {
        const res = await fetch(`https://api.github.com/repos/${o}/${r}`, {
            headers: { Authorization: `token ${t}` }
        });
        if(!res.ok) throw new Error('Invalid Credentials');

        localStorage.setItem('gh_token', t);
        localStorage.setItem('gh_owner', o);
        localStorage.setItem('gh_repo', r);
        state.token = t; state.owner = o; state.repo = r;
        
        DOM.login.classList.remove('active');
        initApp();
    } catch(err) {
        showToast(err.message, true);
    }
});

document.getElementById('nav-logout').addEventListener('click', () => {
    localStorage.clear();
    location.reload();
});

// --- NAVIGATION ---
function initApp() {
    DOM.app.classList.add('active');
    switchPanel('dashboard');
}

function switchPanel(name) {
    // Hide all panels
    Object.values(DOM.panels).forEach(p => p.classList.remove('active'));
    // Show target
    DOM.panels[name].classList.add('active');
    
    // Update Sidebar Active State
    document.querySelectorAll('.nav-item').forEach(b => b.classList.remove('active'));
    // Simple matching for nav items
    const navMap = { 'dashboard': 0, 'pages': 1, 'media': 2 };
    if(navMap[name] !== undefined) {
        document.querySelectorAll('.nav-item')[navMap[name]].classList.add('active');
    }

    if(name === 'dashboard') loadPosts();
    if(name === 'pages') loadPages();
    if(name === 'media') loadMediaLibrary();
}

function createNew(type) {
    state.currentType = type;
    state.currentSlug = null;
    state.currentSha = null;
    
    // Clear Editor
    document.getElementById('meta-title').value = '';
    document.getElementById('meta-slug').value = '';
    document.getElementById('meta-desc').value = '';
    document.getElementById('meta-banner').value = '';
    document.getElementById('banner-preview').style.display = 'none';
    document.getElementById('live-link-container').classList.add('hidden');
    
    // Reset Schema
    document.getElementById('schema-selector').value = 'Article';
    renderSchemaInputs('Article');

    document.getElementById('editor-heading').innerText = type === 'post' ? 'New Blog Post' : 'New Page';
    
    switchPanel('editor');
    initTinyMCE();
    if(tinymce.activeEditor) tinymce.activeEditor.setContent('');
    
    // Auto-slug
    document.getElementById('meta-title').oninput = (e) => {
        if(!state.currentSlug) {
            document.getElementById('meta-slug').value = slugify(e.target.value);
        }
    };
}

function cancelEdit() {
    if(state.currentType === 'post') switchPanel('dashboard');
    else switchPanel('pages');
}

// --- DATA LOADING (WordPress Style) ---
async function loadPosts() {
    DOM.tables.posts.innerHTML = '<tr><td colspan="4">Loading...</td></tr>';
    try {
        const data = await githubReq('contents/blog');
        const folders = data.filter(i => i.type === 'dir');
        
        let html = '';
        for(const f of folders) {
            // We construct the live link based on conventions
            const liveLink = `https://theinfluencerreport.org/blog/${f.name}/`;
            html += `
            <tr>
                <td><strong>${f.name}</strong></td>
                <td><small>Unknown (API limitation)</small></td>
                <td><span class="status-badge">Published</span></td>
                <td>
                    <a href="#" class="action-btn btn-edit" onclick="editContent('post', '${f.name}')">Edit</a>
                    <a href="${liveLink}" target="_blank" class="action-btn btn-view">View</a>
                    <a href="#" class="action-btn btn-delete" onclick="deleteContent('post', '${f.name}')">Delete</a>
                </td>
            </tr>`;
        }
        DOM.tables.posts.innerHTML = html || '<tr><td colspan="4">No posts found.</td></tr>';
    } catch(e) {
        DOM.tables.posts.innerHTML = '<tr><td colspan="4">Error loading posts.</td></tr>';
    }
}

async function loadPages() {
    DOM.tables.pages.innerHTML = '<tr><td colspan="3">Loading...</td></tr>';
    try {
        // Fetch root files, filter for HTML files that are NOT index.html of the main site (optional check)
        // Note: Managing root pages in a flat repo is tricky. 
        // Better convention: check for folders in root that have index.html, OR specific html files.
        // For this CMS, let's assume "Pages" are folders in the root or a 'pages' folder. 
        // Let's stick to: Pages are folders in the ROOT, excluding 'blog', 'admin', 'images'.
        
        const data = await githubReq('contents');
        const exclude = ['blog', 'admin', 'images', 'css', 'js', '.git'];
        const folders = data.filter(i => i.type === 'dir' && !exclude.includes(i.name));

        let html = '';
        for(const f of folders) {
             const liveLink = `https://theinfluencerreport.org/${f.name}/`;
             html += `
            <tr>
                <td><strong>${f.name}</strong></td>
                <td>/${f.name}/</td>
                <td>
                    <a href="#" class="action-btn btn-edit" onclick="editContent('page', '${f.name}')">Edit</a>
                    <a href="${liveLink}" target="_blank" class="action-btn btn-view">View</a>
                    <a href="#" class="action-btn btn-delete" onclick="deleteContent('page', '${f.name}')">Delete</a>
                </td>
            </tr>`;
        }
        DOM.tables.pages.innerHTML = html || '<tr><td colspan="3">No pages found.</td></tr>';
    } catch(e) {
        DOM.tables.pages.innerHTML = '<tr><td colspan="3">Error loading pages.</td></tr>';
    }
}

async function editContent(type, slug) {
    showLoader(true);
    state.currentType = type;
    state.currentSlug = slug;
    document.getElementById('meta-title').oninput = null; // Disable auto-slug

    const path = type === 'post' ? `blog/${slug}/index.html` : `${slug}/index.html`;

    try {
        const res = await githubReq(`contents/${path}`);
        const data = await res.json();
        state.currentSha = data.sha;
        
        const content = b64DecodeUnicode(data.content);
        const doc = new DOMParser().parseFromString(content, 'text/html');

        // Fill Form
        document.getElementById('meta-title').value = doc.querySelector('title')?.innerText || slug;
        document.getElementById('meta-slug').value = slug;
        document.getElementById('meta-desc').value = doc.querySelector('meta[name="description"]')?.content || '';
        document.getElementById('meta-author').value = doc.querySelector('meta[name="author"]')?.content || '';
        
        const banner = doc.querySelector('meta[property="og:image"]')?.content || '';
        document.getElementById('meta-banner').value = banner;
        if(banner) {
            document.getElementById('banner-preview').src = banner;
            document.getElementById('banner-preview').style.display = 'block';
        }

        // Schema Parse
        const script = doc.querySelector('script[type="application/ld+json"]');
        if(script) {
            const json = JSON.parse(script.innerText);
            document.getElementById('schema-selector').value = json['@type'] || 'Article';
            renderSchemaInputs(json['@type'], json);
        } else {
            renderSchemaInputs('Article');
        }

        // Editor
        switchPanel('editor');
        initTinyMCE();
        const body = doc.querySelector('.article-content')?.innerHTML || '';
        setTimeout(() => tinymce.activeEditor.setContent(body), 500);

        // Show Live Link
        const link = type === 'post' ? `https://theinfluencerreport.org/blog/${slug}/` : `https://theinfluencerreport.org/${slug}/`;
        const linkContainer = document.getElementById('live-link-container');
        linkContainer.innerHTML = `<a href="${link}" target="_blank" class="btn-small">View Live <i class="fa-solid fa-external-link"></i></a>`;
        linkContainer.classList.remove('hidden');

    } catch(e) {
        showToast("Error loading content", true);
    } finally {
        showLoader(false);
    }
}

// --- DYNAMIC SCHEMA SYSTEM ---
function renderSchemaInputs(type, existingData = {}) {
    const container = document.getElementById('dynamic-schema-fields');
    container.innerHTML = ''; // Clear

    let fields = [];

    // Define Inputs per Schema Type
    if(type === 'Review') {
        fields = [
            { id: 'reviewItem', label: 'Item Name', val: existingData.itemReviewed?.name },
            { id: 'reviewRating', label: 'Rating (1-5)', val: existingData.reviewRating?.ratingValue }
        ];
    } else if (type === 'FAQPage') {
        // Simplified FAQ: Just a helper text for now, or dynamic add row logic
        container.innerHTML = '<p style="font-size:0.8rem; color:#888;">FAQ Schema will be auto-generated from headers in your content.</p>';
        return; 
    } else if (type === 'HowTo') {
         fields = [{ id: 'howtoSteps', label: 'Total Steps', val: existingData.totalTime }];
    } else if (type === 'Product') {
        fields = [
            { id: 'prodPrice', label: 'Price', val: existingData.offers?.price },
            { id: 'prodCurrency', label: 'Currency', val: existingData.offers?.priceCurrency || 'USD' }
        ];
    }

    // Generate HTML
    fields.forEach(f => {
        const div = document.createElement('div');
        div.className = 'schema-field';
        div.innerHTML = `
            <label>${f.label}</label>
            <input type="text" class="schema-input" data-key="${f.id}" value="${f.val || ''}">
        `;
        container.appendChild(div);
    });
}

function buildSchemaJSON() {
    const type = document.getElementById('schema-selector').value;
    const title = document.getElementById('meta-title').value;
    const img = document.getElementById('meta-banner').value;
    const date = new Date().toISOString();

    let json = {
        "@context": "https://schema.org",
        "@type": type,
        "headline": title,
        "image": [img],
        "datePublished": date,
        "dateModified": date
    };

    // Grab dynamic inputs
    const inputs = document.querySelectorAll('.schema-input');
    inputs.forEach(inp => {
        if(inp.dataset.key === 'reviewItem') json.itemReviewed = { "@type": "Thing", "name": inp.value };
        if(inp.dataset.key === 'reviewRating') json.reviewRating = { "@type": "Rating", "ratingValue": inp.value };
        if(inp.dataset.key === 'prodPrice') json.offers = { "@type": "Offer", "price": inp.value };
    });

    return JSON.stringify(json, null, 4);
}

// --- MEDIA LIBRARY (CANVA STYLE) ---
async function loadMediaLibrary() {
    const grid = document.getElementById('media-gallery');
    grid.innerHTML = '<p>Loading media...</p>';
    
    try {
        const res = await githubReq('contents/images');
        const data = await res.json();
        
        // Filter images
        const images = data.filter(f => f.name.match(/\.(jpg|jpeg|png|gif|webp)$/i));
        
        grid.innerHTML = '';
        images.forEach(img => {
            const url = img.download_url; // Use CDN or raw
            // Construct cleaner URL if possible, e.g. https://<user>.github.io/<repo>/images/name
            const publicUrl = `https://${state.owner.toLowerCase()}.github.io/${state.repo}/images/${img.name}`;
            
            const div = document.createElement('div');
            div.className = 'media-item';
            div.onclick = () => {
                navigator.clipboard.writeText(publicUrl);
                showToast("URL Copied to Clipboard!");
            };
            div.innerHTML = `
                <img src="${url}" loading="lazy">
                <div class="media-overlay"><i class="fa-solid fa-copy"></i> Copy URL</div>
            `;
            grid.appendChild(div);
        });

    } catch(e) {
        grid.innerHTML = '<p>No images found or error loading.</p>';
    }
}

function setupMediaUploader() {
    const dz = document.getElementById('media-dropzone');
    const inp = document.getElementById('media-upload-input');

    dz.addEventListener('click', () => inp.click());
    dz.addEventListener('dragover', e => { e.preventDefault(); dz.style.borderColor = '#00aaff'; });
    dz.addEventListener('dragleave', () => dz.style.borderColor = '#333');
    dz.addEventListener('drop', async e => {
        e.preventDefault();
        dz.style.borderColor = '#333';
        handleFiles(e.dataTransfer.files);
    });
    inp.addEventListener('change', () => handleFiles(inp.files));
}

async function handleFiles(files) {
    if(!files.length) return;
    showLoader(true);
    let count = 0;
    
    for(const file of files) {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        await new Promise(resolve => {
            reader.onload = async () => {
                const b64 = reader.result.split(',')[1];
                const name = `images/${Date.now()}_${file.name.replace(/\s/g,'_')}`;
                await githubReq(`contents/${name}`, 'PUT', {
                    message: `Upload ${name}`,
                    content: b64
                });
                count++;
                resolve();
            }
        });
    }
    showLoader(false);
    showToast(`Uploaded ${count} files.`);
    loadMediaLibrary();
}

// --- SAVING ---
document.getElementById('save-btn').addEventListener('click', async () => {
    const title = document.getElementById('meta-title').value;
    const slug = document.getElementById('meta-slug').value;
    if(!title || !slug) return showToast("Title/Slug required", true);

    showLoader(true);
    
    // Determine path
    const folder = state.currentType === 'post' ? `blog/${slug}` : `${slug}`;
    const path = `${folder}/index.html`;

    // Template Injection
    const html = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${title}</title>
    <meta name="description" content="${document.getElementById('meta-desc').value}">
    <meta name="author" content="${document.getElementById('meta-author').value}">
    <link rel="canonical" href="https://theinfluencerreport.org/${state.currentType === 'post' ? 'blog/' : ''}${slug}/">
    <meta property="og:image" content="${document.getElementById('meta-banner').value}">
    
    <!-- Schema -->
    <script type="application/ld+json">${buildSchemaJSON()}</script>

    <!-- Styles (Adjust paths based on depth) -->
    <link rel="stylesheet" href="${state.currentType === 'post' ? '../' : ''}article.css">
    <style>body{font-family:sans-serif;line-height:1.6;color:#333;max-width:800px;margin:0 auto;padding:20px;}</style>
</head>
<body>
    <header>
        <a href="/">Home</a> ${state.currentType === 'post' ? '/ <a href="/blog/">Blog</a>' : ''} / <span>${slug}</span>
    </header>
    <main>
        <h1>${title}</h1>
        <img src="${document.getElementById('meta-banner').value}" style="max-width:100%;height:auto;">
        <div class="article-content">
            ${tinymce.activeEditor.getContent()}
        </div>
    </main>
</body>
</html>`;

    try {
        // Rename check
        if(state.currentSlug && state.currentSlug !== slug) {
            const oldPath = state.currentType === 'post' ? `blog/${state.currentSlug}/index.html` : `${state.currentSlug}/index.html`;
            await githubReq(oldPath, 'DELETE', { message: 'Rename delete', sha: state.currentSha });
            state.currentSha = null;
        }

        const body = {
            message: `Save ${state.currentType} ${slug}`,
            content: b64EncodeUnicode(html)
        };
        if(state.currentSha && state.currentSlug === slug) body.sha = state.currentSha;

        await githubReq(`contents/${path}`, 'PUT', body);
        showToast("Published Successfully!");
        
        // Show Live Link immediately
        const link = `https://theinfluencerreport.org/${state.currentType === 'post' ? 'blog/' : ''}${slug}/`;
        document.getElementById('live-link-container').innerHTML = `<a href="${link}" target="_blank" class="btn-small">View Live</a>`;
        document.getElementById('live-link-container').classList.remove('hidden');

    } catch(e) {
        showToast("Error saving: " + e.message, true);
    } finally {
        showLoader(false);
    }
});

async function deleteContent(type, slug) {
    if(!confirm('Delete this?')) return;
    const path = type === 'post' ? `blog/${slug}/index.html` : `${slug}/index.html`;
    
    // We need SHA to delete. Fetch it first.
    try {
        const res = await githubReq(`contents/${path}`);
        const data = await res.json();
        await githubReq(`contents/${path}`, 'DELETE', { message: 'Delete', sha: data.sha });
        showToast("Deleted.");
        if(type === 'post') loadPosts(); else loadPages();
    } catch(e) { console.error(e); }
}


// --- UTILS ---
function initTinyMCE() {
    if(state.editorInitialized) return;
    tinymce.init({
        selector: '#tinymce-editor',
        height: '100%',
        skin: 'oxide-dark',
        content_css: 'dark',
        plugins: 'image link media table codesample lists wordcount accordion',
        toolbar: 'undo redo | blocks | bold italic | align | bullist numlist | link image',
    });
    state.editorInitialized = true;
}

function showLoader(show) { document.getElementById('loading-overlay').classList.toggle('hidden', !show); }
function showToast(msg, err=false) {
    const t = document.getElementById('toast');
    t.innerText = msg;
    t.style.borderLeftColor = err ? 'red' : '#00aaff';
    t.classList.add('show');
    setTimeout(()=>t.classList.remove('show'), 3000);
}
function slugify(t) { return t.toLowerCase().replace(/[^\w-]+/g,'-'); }

// Helpers
async function githubReq(end, method='GET', body=null) {
    const opts = { method, headers: { Authorization: `token ${state.token}`, Accept: 'application/vnd.github.v3+json', 'Content-Type': 'application/json' } };
    if(body) opts.body = JSON.stringify(body);
    const r = await fetch(`https://api.github.com/repos/${state.owner}/${state.repo}/${end}`, opts);
    if(!r.ok && method !== 'GET') throw await r.json();
    return r;
}
function b64EncodeUnicode(str) { return btoa(encodeURIComponent(str).replace(/%([0-9A-F]{2})/g, (m, p1) => String.fromCharCode('0x' + p1))); }
function b64DecodeUnicode(str) { return decodeURIComponent(atob(str).split('').map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2)).join('')); }
