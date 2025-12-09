/**
 * ULTIMATE SERVERLESS CMS - FINAL FIX
 * Features: Persistent Login, Robust Error Handling, Canva-style Media Sidebar
 */

// --- STATE ---
const state = {
    token: null,
    owner: null,
    repo: null,
    currentType: 'post', // 'post' or 'page'
    currentSlug: null,
    currentSha: null,
    editorInitialized: false
};

// --- INIT ---
document.addEventListener('DOMContentLoaded', () => {
    // 1. Check LocalStorage IMMEDIATELY
    const t = localStorage.getItem('gh_token');
    const o = localStorage.getItem('gh_owner');
    const r = localStorage.getItem('gh_repo');

    if (t && o && r) {
        state.token = t;
        state.owner = o;
        state.repo = r;
        initApp(); // Auto-login
    } else {
        document.getElementById('login-view').classList.add('active'); // Show login
    }

    // Media Sidebar Drag/Drop Setup
    setupSidebarUpload();
});

// --- NAVIGATION ---
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
    
    // Refresh Data
    if(id === 'dashboard') loadPosts();
    if(id === 'pages') loadPages();
}

// --- AUTH ---
document.getElementById('login-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const t = document.getElementById('gh-token').value.trim();
    const o = document.getElementById('gh-owner').value.trim();
    const r = document.getElementById('gh-repo').value.trim();

    try {
        // Test Credentials - FIX: Use Bearer for compatibility
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

// --- API HELPERS (Strict Error Handling) ---
async function githubReq(endpoint, method = 'GET', body = null) {
    const opts = {
        method,
        headers: {
            Authorization: `Bearer ${state.token}`, // FIX: Updated to Bearer
            Accept: 'application/vnd.github.v3+json',
            'Content-Type': 'application/json'
        }
    };
    if (body) opts.body = JSON.stringify(body);
    const res = await fetch(`https://api.github.com/repos/${state.owner}/${state.repo}/${endpoint}`, opts);
    
    // Handle 404 cleanly for Lists
    if (!res.ok && method === 'GET' && res.status === 404) return null; 
    
    // Handle other errors
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
        if (!res) {
            tbody.innerHTML = '<tr><td colspan="3">No "blog" folder found.</td></tr>';
            return;
        }
        const data = await res.json();
        // Strict Filter: Must be Directory
        const folders = data.filter(item => item.type === 'dir');

        if (folders.length === 0) {
            tbody.innerHTML = '<tr><td colspan="3">No posts found.</td></tr>';
            return;
        }

        let html = '';
        for (const f of folders) {
            const liveLink = `https://${state.owner}.github.io/${state.repo}/blog/${f.name}/`;
            html += `
            <tr>
                <td><strong>${f.name}</strong></td>
                <td>/blog/${f.name}/</td>
                <td>
                    <button class="btn-primary" onclick="editContent('post', '${f.name}')">Edit</button>
                    <a href="${liveLink}" target="_blank" class="btn-secondary">View</a>
                    <button class="btn-secondary" style="background:red" onclick="deleteContent('post', '${f.name}')">Del</button>
                </td>
            </tr>`;
        }
        tbody.innerHTML = html;

    } catch (err) {
        console.error(err);
        tbody.innerHTML = `<tr><td colspan="3">Error: ${err.message}</td></tr>`;
    }
}

async function loadPages() {
    const tbody = document.getElementById('pages-list-body');
    tbody.innerHTML = '<tr><td colspan="3">Loading...</td></tr>';
    
    try {
        const res = await githubReq('contents');
        const data = await res.json();
        
        // Filter: Dirs that are NOT restricted
        const restricted = ['blog', 'images', 'admin', 'css', 'js', '.git'];
        const folders = data.filter(item => item.type === 'dir' && !restricted.includes(item.name));

        let html = '';
        for (const f of folders) {
            const liveLink = `https://${state.owner}.github.io/${state.repo}/${f.name}/`;
            html += `
            <tr>
                <td><strong>${f.name}</strong></td>
                <td>/${f.name}/</td>
                <td>
                    <button class="btn-primary" onclick="editContent('page', '${f.name}')">Edit</button>
                    <a href="${liveLink}" target="_blank" class="btn-secondary">View</a>
                    <button class="btn-secondary" style="background:red" onclick="deleteContent('page', '${f.name}')">Del</button>
                </td>
            </tr>`;
        }
        tbody.innerHTML = html || '<tr><td colspan="3">No pages found.</td></tr>';

    } catch (err) {
        tbody.innerHTML = `<tr><td colspan="3">Error: ${err.message}</td></tr>`;
    }
}

// --- EDITOR LOGIC ---
function createNew(type) {
    state.currentType = type;
    state.currentSlug = null;
    state.currentSha = null;
    
    // Reset UI
    document.getElementById('meta-title').value = '';
    document.getElementById('meta-slug').value = '';
    document.getElementById('meta-desc').value = '';
    document.getElementById('meta-banner').value = '';
    document.getElementById('banner-preview').classList.add('hidden');
    document.getElementById('live-link-container').classList.add('hidden');
    
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
        
        // Fill Form
        document.getElementById('meta-title').value = doc.querySelector('title')?.innerText || slug;
        document.getElementById('meta-title').oninput = null; // Disable auto slug
        document.getElementById('meta-slug').value = slug;
        
        const desc = doc.querySelector('meta[name="description"]')?.content || '';
        document.getElementById('meta-desc').value = desc;
        
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
        // TinyMCE needs a moment to load
        setTimeout(() => tinymce.activeEditor.setContent(body), 500);

        // Load Schema Data if present
        const script = doc.querySelector('script[type="application/ld+json"]');
        if(script) {
            try {
                const json = JSON.parse(script.innerText);
                document.getElementById('schema-selector').value = json['@type'] || 'Article';
                renderSchemaFields(json['@type'], json);
            } catch(e) {}
        } else {
            renderSchemaFields('Article');
        }

    } catch(err) {
        showToast("Error loading file: " + err.message, true);
        switchPanel('dashboard');
    } finally {
        showLoader(false);
    }
}

function exitEditor() {
    switchPanel(state.currentType === 'post' ? 'dashboard' : 'pages');
}

// --- MEDIA SIDEBAR (CANVA STYLE) ---
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
        if(!res) {
            grid.innerHTML = '<p>No images folder.</p>';
            return;
        }
        const data = await res.json();
        // Filter Images
        const images = data.filter(f => f.name.match(/\.(jpg|jpeg|png|gif|webp)$/i));
        
        grid.innerHTML = '';
        images.forEach(img => {
            const url = `https://${state.owner}.github.io/${state.repo}/images/${img.name}`;
            
            const div = document.createElement('div');
            div.className = 'side-media-item';
            div.title = "Click to Insert";
            div.innerHTML = `<img src="${img.download_url}" loading="lazy">`;
            
            // CLICK TO INSERT INTO EDITOR
            div.onclick = () => {
                if(tinymce.activeEditor) {
                    tinymce.activeEditor.insertContent(`<img src="${url}" alt="${img.name}" style="max-width:100%; height:auto;">`);
                    showToast("Image Inserted!");
                }
            };
            grid.appendChild(div);
        });
    } catch(err) {
        grid.innerHTML = '<p>Error loading media.</p>';
    }
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
        const reader = new FileReader();
        reader.readAsDataURL(file);
        await new Promise(resolve => {
            reader.onload = async () => {
                const b64 = reader.result.split(',')[1];
                const cleanName = file.name.replace(/\s+/g, '-').toLowerCase();
                const path = `images/${Date.now()}-${cleanName}`;
                
                await githubReq(`contents/${path}`, 'PUT', {
                    message: `Upload ${cleanName}`,
                    content: b64
                });
                resolve();
            }
        });
    }
    showToast("Upload Complete!");
    loadSidebarMedia(); // Refresh grid
}

// --- DYNAMIC SCHEMA ---
document.getElementById('schema-selector').addEventListener('change', (e) => {
    renderSchemaFields(e.target.value);
});

function renderSchemaFields(type, existingData = {}) {
    const container = document.getElementById('dynamic-schema-fields');
    container.innerHTML = '';
    
    let fields = [];
    
    // Define inputs based on type
    if (type === 'Review') {
        fields = [
            { id: 'reviewItem', label: 'Item Name', val: existingData.itemReviewed?.name },
            { id: 'reviewRating', label: 'Rating (1-5)', val: existingData.reviewRating?.ratingValue }
        ];
    } else if (type === 'Product') {
        fields = [
            { id: 'prodPrice', label: 'Price', val: existingData.offers?.price },
            { id: 'prodCurrency', label: 'Currency', val: existingData.offers?.priceCurrency || 'USD' }
        ];
    } else if (type === 'HowTo') {
        container.innerHTML = '<p style="font-size:0.8rem; color:#888">HowTo Schema will assume headers are steps.</p>';
    }

    fields.forEach(f => {
        const div = document.createElement('div');
        div.style.marginBottom = '8px';
        div.innerHTML = `
            <label style="display:block; font-size:0.75rem; color:#888">${f.label}</label>
            <input type="text" class="schema-input" data-key="${f.id}" value="${f.val || ''}" style="width:100%; padding:6px; background:#333; border:1px solid #444; color:white;">
        `;
        container.appendChild(div);
    });
}

function buildSchemaJSON() {
    const type = document.getElementById('schema-selector').value;
    const title = document.getElementById('meta-title').value;
    const banner = document.getElementById('meta-banner').value;
    
    let json = {
        "@context": "https://schema.org",
        "@type": type,
        "headline": title,
        "image": [banner],
        "datePublished": new Date().toISOString()
    };
    
    const inputs = document.querySelectorAll('.schema-input');
    inputs.forEach(i => {
        if(i.dataset.key === 'reviewItem') json.itemReviewed = { "@type": "Thing", "name": i.value };
        if(i.dataset.key === 'reviewRating') json.reviewRating = { "@type": "Rating", "ratingValue": i.value };
        if(i.dataset.key === 'prodPrice') json.offers = { "@type": "Offer", "price": i.value };
    });
    
    return JSON.stringify(json, null, 4);
}

// --- SAVING ---
document.getElementById('save-btn').addEventListener('click', async () => {
    const title = document.getElementById('meta-title').value;
    const slug = document.getElementById('meta-slug').value;
    if(!title || !slug) return showToast("Title & Slug Required", true);
    
    showLoader(true);
    
    const folder = state.currentType === 'post' ? `blog/${slug}` : `${slug}`;
    const path = `${folder}/index.html`;
    
    // Generate HTML
    const html = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>${title}</title>
    <meta name="description" content="${document.getElementById('meta-desc').value}">
    <link rel="canonical" href="https://${state.owner}.github.io/${state.repo}/${state.currentType==='post'?'blog/':''}${slug}/">
    <meta property="og:image" content="${document.getElementById('meta-banner').value}">
    <script type="application/ld+json">${buildSchemaJSON()}</script>
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
        // Rename Logic
        if(state.currentSlug && state.currentSlug !== slug) {
            const oldFolder = state.currentType === 'post' ? `blog/${state.currentSlug}` : `${state.currentSlug}`;
            // Delete old file
            await githubReq(`contents/${oldFolder}/index.html`, 'DELETE', {
                message: 'Delete old slug',
                sha: state.currentSha
            });
            state.currentSha = null; 
        }
        
        const body = {
            message: `Update ${slug}`,
            content: b64EncodeUnicode(html)
        };
        if(state.currentSha && state.currentSlug === slug) body.sha = state.currentSha;
        
        await githubReq(`contents/${path}`, 'PUT', body);
        showToast("Published Successfully!");
        
        // Update Live Link
        const link = `https://${state.owner}.github.io/${state.repo}/${state.currentType==='post'?'blog/':''}${slug}/`;
        document.getElementById('live-link-container').innerHTML = `<a href="${link}" target="_blank" class="btn-secondary" style="color:white; text-decoration:none;">View Live</a>`;
        document.getElementById('live-link-container').classList.remove('hidden');

    } catch(err) {
        showToast("Error saving: " + err.message, true);
    } finally {
        showLoader(false);
    }
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
function initTinyMCE() {
    if(state.editorInitialized) return;
    tinymce.init({
        selector: '#tinymce-editor',
        skin: 'oxide-dark',
        content_css: 'dark',
        height: '100%',
        plugins: 'image link media lists table code',
        toolbar: 'undo redo | blocks | bold italic | align | bullist numlist | link image',
        setup: (editor) => {
            editor.on('change', () => { editor.save(); });
        }
    });
    state.editorInitialized = true;
}

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
