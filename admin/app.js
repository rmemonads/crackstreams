/**
 * SERVERLESS CMS LOGIC
 */

// --- State Management ---
const state = {
    token: localStorage.getItem('gh_token'),
    owner: localStorage.getItem('gh_owner'),
    repo: localStorage.getItem('gh_repo'),
    currentSlug: null,
    currentSha: null // Required for updating existing files
};

// --- DOM Elements ---
const views = {
    login: document.getElementById('login-view'),
    app: document.getElementById('app-view')
};

const panels = {
    dashboard: document.getElementById('dashboard-panel'),
    editor: document.getElementById('editor-panel')
};

// --- Initialization ---
document.addEventListener('DOMContentLoaded', () => {
    if (state.token && state.owner && state.repo) {
        initApp();
    } else {
        switchView('login');
    }

    // Initialize TinyMCE
    tinymce.init({
        selector: '#tinymce-editor',
        height: '100%',
        skin: 'oxide-dark',
        content_css: 'dark',
        plugins: 'anchor autolink charmap codesample emoticons image link lists media searchreplace table visualblocks wordcount',
        toolbar: 'undo redo | blocks fontfamily fontsize | bold italic underline strikethrough | link image media table | align lineheight | numlist bullist indent outdent | emoticons charmap | removeformat',
        body_class: 'article-content' // Matches the site CSS class
    });
});

// --- Authentication ---
document.getElementById('login-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const token = document.getElementById('gh-token').value.trim();
    const owner = document.getElementById('gh-owner').value.trim();
    const repo = document.getElementById('gh-repo').value.trim();

    // Verify Creds
    try {
        const response = await fetch(`https://api.github.com/repos/${owner}/${repo}`, {
            headers: { 'Authorization': `token ${token}` }
        });
        
        if (!response.ok) throw new Error('Repository not found or access denied');

        localStorage.setItem('gh_token', token);
        localStorage.setItem('gh_owner', owner);
        localStorage.setItem('gh_repo', repo);

        state.token = token;
        state.owner = owner;
        state.repo = repo;

        initApp();
    } catch (err) {
        showToast(err.message, true);
    }
});

document.getElementById('nav-logout').addEventListener('click', () => {
    localStorage.clear();
    location.reload();
});

// --- Navigation Logic ---
function switchView(viewName) {
    Object.values(views).forEach(el => el.classList.remove('active'));
    views[viewName].classList.add('active');
}

function showDashboard() {
    panels.editor.classList.remove('active');
    panels.dashboard.classList.add('active');
    document.getElementById('nav-dashboard').classList.add('active');
    document.getElementById('nav-create').classList.remove('active');
    loadArticles();
}

function showEditor(isNew = true) {
    panels.dashboard.classList.remove('active');
    panels.editor.classList.add('active');
    document.getElementById('nav-create').classList.toggle('active', isNew);
    document.getElementById('nav-dashboard').classList.remove('active');

    if (isNew) {
        resetEditor();
    }
}

function initApp() {
    switchView('app');
    showDashboard();
    setupDragDrop();
}

// --- GitHub API Helpers ---
// Fix for Unicode/Emoji in Base64
function b64EncodeUnicode(str) {
    return btoa(encodeURIComponent(str).replace(/%([0-9A-F]{2})/g,
        function toSolidBytes(match, p1) {
            return String.fromCharCode('0x' + p1);
    }));
}

function b64DecodeUnicode(str) {
    return decodeURIComponent(atob(str).split('').map(function(c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));
}

async function githubReq(endpoint, method = 'GET', body = null) {
    const options = {
        method,
        headers: {
            'Authorization': `token ${state.token}`,
            'Accept': 'application/vnd.github.v3+json',
            'Content-Type': 'application/json'
        }
    };
    if (body) options.body = JSON.stringify(body);
    
    const res = await fetch(`https://api.github.com/repos/${state.owner}/${state.repo}/${endpoint}`, options);
    return res;
}

// --- Dashboard Functions ---
async function loadArticles() {
    const listEl = document.getElementById('article-list');
    const spinner = document.getElementById('loading-spinner');
    
    listEl.innerHTML = '';
    spinner.classList.remove('hidden');

    try {
        // Fetch contents of blog/ folder
        const res = await githubReq('contents/blog');
        if (res.status === 404) {
            listEl.innerHTML = '<p>No blog folder found. Create your first article!</p>';
            spinner.classList.add('hidden');
            return;
        }
        
        const data = await res.json();
        // Filter only directories
        const folders = data.filter(item => item.type === 'dir');

        if (folders.length === 0) {
            listEl.innerHTML = '<p>No articles found.</p>';
            spinner.classList.add('hidden');
            return;
        }

        // For each folder, we need to fetch index.html to get the title
        // Note: Doing this in a loop is not efficient for hundreds of posts, 
        // but acceptable for a simple CMS.
        for (const folder of folders) {
            try {
                const fileRes = await githubReq(`contents/blog/${folder.name}/index.html`);
                if (!fileRes.ok) continue;

                const fileData = await fileRes.json();
                const content = b64DecodeUnicode(fileData.content);
                const parser = new DOMParser();
                const doc = parser.parseFromString(content, 'text/html');
                
                const title = doc.querySelector('title')?.innerText || folder.name;
                // Try to find our injected date meta tag, or fallback to something else
                const dateMeta = doc.querySelector('meta[name="date"]');
                const dateText = dateMeta ? dateMeta.content : 'Unknown Date';

                const card = document.createElement('div');
                card.className = 'article-card';
                card.innerHTML = `
                    <h3>${title}</h3>
                    <span class="article-date"><i class="fa-regular fa-calendar"></i> ${dateText}</span>
                    <div class="card-actions">
                        <button class="btn-secondary" onclick="editArticle('${folder.name}')">Edit</button>
                        <button class="btn-danger" onclick="deleteArticle('${folder.name}', '${fileData.sha}')">Delete</button>
                    </div>
                `;
                listEl.appendChild(card);
            } catch (e) {
                console.error(`Error loading ${folder.name}`, e);
            }
        }

    } catch (err) {
        showToast('Failed to load articles', true);
        console.error(err);
    } finally {
        spinner.classList.add('hidden');
    }
}

// --- Editor Functions ---

function resetEditor() {
    document.getElementById('editor-title').innerText = "Create New Article";
    document.getElementById('post-title').value = "";
    document.getElementById('post-slug').value = "";
    document.getElementById('post-desc').value = "";
    document.getElementById('post-banner').value = "";
    document.getElementById('post-author').value = "Md Ashikuzzaman"; // Default
    document.querySelector('input[name="canonical"][value="self"]').checked = true;
    document.getElementById('post-canonical-custom').classList.add('hidden');
    document.getElementById('post-canonical-custom').value = "";
    
    // Auto-slug listener
    document.getElementById('post-title').oninput = (e) => {
        if (!state.currentSlug) { // Only auto-gen if creating new
            document.getElementById('post-slug').value = slugify(e.target.value);
        }
    };

    if(tinymce.activeEditor) tinymce.activeEditor.setContent('');
    
    state.currentSlug = null;
    state.currentSha = null;
}

function slugify(text) {
    return text.toString().toLowerCase()
        .replace(/\s+/g, '-')
        .replace(/[^\w\-]+/g, '')
        .replace(/\-\-+/g, '-')
        .replace(/^-+/, '')
        .replace(/-+$/, '');
}

// Handle Canonical Toggle visibility
document.querySelectorAll('input[name="canonical"]').forEach(radio => {
    radio.addEventListener('change', (e) => {
        const customInput = document.getElementById('post-canonical-custom');
        if (e.target.value === 'custom') {
            customInput.classList.remove('hidden');
        } else {
            customInput.classList.add('hidden');
        }
    });
});

async function editArticle(slug) {
    showToast("Loading article...");
    showEditor(false);
    document.getElementById('editor-title').innerText = "Edit Article";
    state.currentSlug = slug;

    // Remove auto-slug listener
    document.getElementById('post-title').oninput = null;

    try {
        const res = await githubReq(`contents/blog/${slug}/index.html`);
        const data = await res.json();
        state.currentSha = data.sha;

        const content = b64DecodeUnicode(data.content);
        const parser = new DOMParser();
        const doc = parser.parseFromString(content, 'text/html');

        // Extract Data
        document.getElementById('post-title').value = doc.querySelector('title').innerText;
        document.getElementById('post-slug').value = slug;
        
        const descMeta = doc.querySelector('meta[name="description"]');
        if(descMeta) document.getElementById('post-desc').value = descMeta.content;

        const bannerMeta = doc.querySelector('meta[property="og:image"]');
        if(bannerMeta) document.getElementById('post-banner').value = bannerMeta.content;

        const authorMeta = doc.querySelector('meta[name="author"]');
        if(authorMeta) document.getElementById('post-author').value = authorMeta.content;

        const canonicalLink = doc.querySelector('link[rel="canonical"]');
        if (canonicalLink) {
            const href = canonicalLink.href;
            if (href.includes(slug)) {
                document.querySelector('input[name="canonical"][value="self"]').checked = true;
                document.getElementById('post-canonical-custom').classList.add('hidden');
            } else {
                document.querySelector('input[name="canonical"][value="custom"]').checked = true;
                document.getElementById('post-canonical-custom').classList.remove('hidden');
                document.getElementById('post-canonical-custom').value = href;
            }
        }

        // Schema Type extraction (basic regex to find @type inside JSON-LD)
        const scriptTags = doc.querySelectorAll('script[type="application/ld+json"]');
        scriptTags.forEach(script => {
            try {
                const json = JSON.parse(script.innerText);
                if (json['@type']) {
                    document.getElementById('post-schema').value = json['@type'];
                }
            } catch(e) {}
        });

        // Content
        const articleBody = doc.querySelector('.article-content');
        if (articleBody) {
            tinymce.activeEditor.setContent(articleBody.innerHTML);
        }

    } catch (err) {
        showToast("Error fetching article details", true);
        console.error(err);
    }
}

// --- Image Upload (Drag & Drop) ---
function setupDragDrop() {
    const dropZone = document.getElementById('drop-zone');
    const fileInput = document.getElementById('file-input');

    dropZone.addEventListener('click', () => fileInput.click());

    dropZone.addEventListener('dragover', (e) => {
        e.preventDefault();
        dropZone.classList.add('dragover');
    });

    dropZone.addEventListener('dragleave', () => dropZone.classList.remove('dragover'));

    dropZone.addEventListener('drop', async (e) => {
        e.preventDefault();
        dropZone.classList.remove('dragover');
        const file = e.dataTransfer.files[0];
        if (file) handleImageUpload(file);
    });

    fileInput.addEventListener('change', (e) => {
        if(fileInput.files[0]) handleImageUpload(fileInput.files[0]);
    });
}

async function handleImageUpload(file) {
    const status = document.getElementById('upload-status');
    status.innerText = "Uploading...";
    
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = async () => {
        const base64Content = reader.result.split(',')[1];
        const filename = `images/${Date.now()}-${file.name.replace(/\s/g, '_')}`; // Upload to root images/ folder

        try {
            const res = await githubReq(`contents/${filename}`, 'PUT', {
                message: `Upload image ${filename}`,
                content: base64Content
            });

            if (res.ok) {
                const data = await res.json();
                // GitHub Pages URL (Assumed structure)
                // Or use raw githubusercontent, but usually pages serves from root
                // We will construct relative path or absolute path based on Repo
                const absUrl = `https://${state.owner.toLowerCase()}.github.io/${state.repo}/${filename}`;
                document.getElementById('post-banner').value = absUrl;
                status.innerText = "Upload Complete!";
                setTimeout(() => status.innerText = "", 2000);
            } else {
                throw new Error('Upload failed');
            }
        } catch (err) {
            status.innerText = "Error uploading image.";
            console.error(err);
        }
    };
}

// --- Save & Publish Logic ---
document.getElementById('save-btn').addEventListener('click', async () => {
    const title = document.getElementById('post-title').value;
    const newSlug = document.getElementById('post-slug').value;
    const description = document.getElementById('post-desc').value;
    const authorName = document.getElementById('post-author').value;
    const bannerUrl = document.getElementById('post-banner').value;
    const schemaType = document.getElementById('post-schema').value;
    const bodyContent = tinymce.activeEditor.getContent();
    
    // Canonical Logic
    const isCustomCanonical = document.querySelector('input[name="canonical"]:checked').value === 'custom';
    let canonicalUrl = `https://theinfluencerreport.org/blog/${newSlug}/`;
    if (isCustomCanonical) {
        canonicalUrl = document.getElementById('post-canonical-custom').value;
    }

    if (!title || !newSlug) {
        showToast("Title and Slug are required", true);
        return;
    }

    // Build Schema JSON
    const dateNow = new Date().toISOString();
    const datePretty = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
    
    const schemaJson = JSON.stringify({
        "@context": "https://schema.org",
        "@type": schemaType,
        "headline": title,
        "image": [bannerUrl],
        "datePublished": dateNow,
        "dateModified": dateNow,
        "author": [{
            "@type": "Person",
            "name": authorName,
            "url": "https://theinfluencerreport.org/"
        }]
    }, null, 4);

    // --- HTML TEMPLATE INJECTION ---
    const htmlContent = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <!-- DYNAMIC: Title -->
    <title>${title}</title>
    <!-- DYNAMIC: Description -->
    <meta name="description" content="${description}">
    <!-- META: Date for CMS Parsing -->
    <meta name="date" content="${datePretty}">
    <!-- DYNAMIC: Canonical -->
    <link rel="canonical" href="${canonicalUrl}">
    <link rel="icon" href="/theinfluencerreporticon.png" type="image/x-icon">
    <meta name="author" content="${authorName}"> 

    <!-- DYNAMIC: Banner Image -->
    <meta property="og:image" content="${bannerUrl}">
    <meta property="og:type" content="article">
    <meta property="og:url" content="https://theinfluencerreport.org/blog/${newSlug}/">
    
    <!-- DYNAMIC: Schema JSON-LD -->
    <script type="application/ld+json">
        ${schemaJson}
    </script>

    <!-- Preloads -->
    <link rel="preload" as="image" href="${bannerUrl}" fetchpriority="high">
    <link rel="preload" href="https://fonts.gstatic.com/s/poppins/v20/pxiEyp8kv8JHgFVrJJfecg.woff2" as="font" type="font/woff2" crossorigin>

    <!-- Critical CSS -->
    <style>
      @font-face{font-family:'Poppins Fallback';src:local('Arial');ascent-override:90%;descent-override:22%;line-gap-override:0%;size-adjust:104%}
      @font-face{font-family:Poppins;font-style:normal;font-weight:400;font-display:swap;src:url(https://fonts.gstatic.com/s/poppins/v20/pxiEyp8kv8JHgFVrJJfecg.woff2) format('woff2');unicode-range:U+0000-00FF,U+0131,U+0152-0153,U+02BB-02BC,U+02C6,U+02DA,U+02DC,U+2000-206F,U+2074,U+20AC,U+2122,U+2191,U+2193,U+2212,U+2215,U+FEFF,U+FFFD}
      @font-face{font-family:Poppins;font-style:normal;font-weight:600;font-display:swap;src:url(https://fonts.gstatic.com/s/poppins/v20/pxiByp8kv8JHgFVrLEj6Z1xlFd2JQEk.woff2) format('woff2');unicode-range:U+0000-00FF,U+0131,U+0152-0153,U+02BB-02BC,U+02C6,U+02DA,U+02DC,U+2000-206F,U+2074,U+20AC,U+2122,U+2191,U+2193,U+2212,U+2215,U+FEFF,U+FFFD}
      @font-face{font-family:Poppins;font-style:normal;font-weight:700;font-display:swap;src:url(https://fonts.gstatic.com/s/poppins/v20/pxiByp8kv8JHgFVrLCz7Z1xlFd2JQEk.woff2) format('woff2');unicode-range:U+0000-00FF,U+0131,U+0152-0153,U+02BB-02BC,U+02C6,U+02DA,U+02DC,U+2000-206F,U+2074,U+20AC,U+2122,U+2191,U+2193,U+2212,U+2215,U+FEFF,U+FFFD}
    </style>

    <link rel="stylesheet" href="../article.css">
    <link rel="stylesheet" href="../../fontello.css">
</head>
<body>
    <div class="progress-bar" id="progressBar"></div>

    <header class="site-header">
        <nav>
            <a href="/" class="logo">The Influencer Report</a>
            <ul class="nav-links">
                <li><a href="/">Home</a></li>
                <li><a href="/blog/">Blog</a></li>
                <li><a href="/about/">About</a></li>
                <li><a href="/contact/">Contact</a></li>
            </ul>
            <div class="burger" role="button" aria-label="Open navigation menu">
                <div class="line1"></div><div class="line2"></div><div class="line3"></div>
            </div>
        </nav>
    </header>

    <main>
        <section class="blog-header">
            <div class="breadcrumbs">
                <a href="/">Home</a> &nbsp;/&nbsp; <a href="/blog/">Blog</a> &nbsp;/&nbsp; 
                <span id="dynamicBreadcrumbSlug" style="color: var(--primary-color);">${title}</span>
            </div>
            
            <h1 class="blog-title">${title}</h1>
            
            <div class="blog-meta">
                <span>By <span class="author-name">${authorName}</span></span>
                <span class="meta-separator">•</span>
                <span id="dynamicDate">${datePretty}</span>
                <span class="meta-separator">•</span>
                <span id="dynamicReadingTime">Calculating...</span>
            </div>
        </section>

        <div class="banner-container">
            <img id="dynamicBannerImage" src="${bannerUrl}" alt="${title}" class="banner-image" width="1280" height="720" fetchpriority="high">
        </div>

        <article class="article-content">
            ${bodyContent}
        </article>
    </main>

    <footer class="site-footer">
        <div class="footer-container">
            <nav class="footer-nav">
                <a href="/disclaimer/">Disclaimer</a>
                <a href="/terms-and-conditions/">Terms & Conditions</a>
                <a href="/privacy-policy/">Privacy Policy</a>
            </nav>
            <div class="footer-social">
                <a href="https://x.com/theinfluencer64" target="_blank"><i class="icon-twitter"></i></a>
                <a href="https://www.instagram.com/the.influencerreport/" target="_blank"><i class="icon-instagram"></i></a>
                <a href="https://t.me/theinfluencerreport" target="_blank"><i class="icon-telegram"></i></a>
            </div>
        </div>
        <div class="footer-bottom">
            <p>&copy; 2025 The Influencer Report.</p>
        </div>
    </footer>

    <script src="../article.js" defer></script>
</body>
</html>`;

    // --- API COMMIT ---
    try {
        showToast("Saving...", false);
        const encodedContent = b64EncodeUnicode(htmlContent);
        
        // 1. Check if slug changed (Renaming)
        if (state.currentSlug && state.currentSlug !== newSlug) {
            // Delete old folder (technically delete the file inside it)
            // GitHub API doesn't allow deleting folders directly, you delete the file
            await githubReq(`contents/blog/${state.currentSlug}/index.html`, 'DELETE', {
                message: `Delete old article ${state.currentSlug}`,
                sha: state.currentSha
            });
            // Reset SHA so the create below acts as new
            state.currentSha = null; 
        }

        // 2. Create/Update new file
        const body = {
            message: `Update article: ${title}`,
            content: encodedContent
        };
        if (state.currentSha && state.currentSlug === newSlug) {
            body.sha = state.currentSha;
        }

        const res = await githubReq(`contents/blog/${newSlug}/index.html`, 'PUT', body);
        
        if (res.ok) {
            showToast("Published Successfully!");
            setTimeout(showDashboard, 1500);
        } else {
            const err = await res.json();
            throw new Error(err.message);
        }

    } catch (err) {
        showToast(`Error: ${err.message}`, true);
    }
});

async function deleteArticle(slug, sha) {
    if(!confirm(`Are you sure you want to delete "${slug}"?`)) return;

    try {
        const res = await githubReq(`contents/blog/${slug}/index.html`, 'DELETE', {
            message: `Delete article ${slug}`,
            sha: sha
        });
        if(res.ok) {
            showToast("Article deleted.");
            loadArticles();
        } else {
            showToast("Failed to delete.", true);
        }
    } catch(err) {
        console.error(err);
    }
}

// --- Toast Utilities ---
function showToast(msg, isError = false) {
    const toast = document.getElementById('toast');
    toast.innerText = msg;
    toast.className = `toast show ${isError ? 'error' : ''}`;
    setTimeout(() => toast.classList.remove('show'), 3000);
}
