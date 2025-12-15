/**
 * Modern Blog Loader with Infinite Scroll
 * Fetches data from CMS index, sorts by date, and renders.
 */

const CONFIG = {
    indexUrl: '../_cms/index.json',
    itemsPerPage: 10,
    listContainerId: 'blog-list',
    sentinelId: 'sentinel'
};

const state = {
    allPosts: [],
    displayedCount: 0,
    isLoading: false,
    hasMore: true
};

document.addEventListener('DOMContentLoaded', initBlog);

async function initBlog() {
    try {
        // 1. Fetch CMS Index
        const response = await fetch(CONFIG.indexUrl + '?t=' + Date.now()); // bust cache
        if (!response.ok) throw new Error('Failed to load content index');
        
        const data = await response.json();
        
        // 2. Filter & Sort (Latest Modified Date First)
        state.allPosts = data
            .filter(item => item.type === 'post') // Only get posts
            .sort((a, b) => new Date(b.date) - new Date(a.date)); // Sort DESC
            
        // 3. Clear Skeletons
        const container = document.getElementById(CONFIG.listContainerId);
        container.innerHTML = '';
        
        // 4. Initial Load
        loadMorePosts();
        
        // 5. Setup Infinite Scroll Observer
        setupIntersectionObserver();

    } catch (error) {
        console.error('Blog Error:', error);
        document.getElementById(CONFIG.listContainerId).innerHTML = 
            `<div style="text-align:center; padding:40px; color:#888;">
                <i class="fa-solid fa-triangle-exclamation"></i> Unable to load posts.
             </div>`;
    }
}

function loadMorePosts() {
    if (state.isLoading || !state.hasMore) return;
    
    state.isLoading = true;
    document.querySelector('.spinner').classList.remove('hidden');
    
    // Simulate slight network delay for smooth UI feel (optional, remove setTimeout for raw speed)
    setTimeout(async () => {
        const nextBatch = state.allPosts.slice(state.displayedCount, state.displayedCount + CONFIG.itemsPerPage);
        
        if (nextBatch.length === 0) {
            state.hasMore = false;
            document.querySelector('.spinner').classList.add('hidden');
            document.querySelector('.end-msg').classList.remove('hidden');
            return;
        }

        const container = document.getElementById(CONFIG.listContainerId);
        
        // Render cards
        for (const post of nextBatch) {
            const html = await generateCardHtml(post);
            container.insertAdjacentHTML('beforeend', html);
        }

        state.displayedCount += nextBatch.length;
        state.isLoading = false;
        
        // Check if we reached the absolute end
        if (state.displayedCount >= state.allPosts.length) {
            state.hasMore = false;
            document.querySelector('.spinner').classList.add('hidden');
            document.querySelector('.end-msg').classList.remove('hidden');
        }
        
    }, 300); // Small 300ms buffer for smooth animation
}

async function generateCardHtml(post) {
    // Format Date
    const dateObj = new Date(post.date);
    const dateStr = dateObj.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
    
    // Fetch individual post content to get Banner/Desc
    // Note: In a high-traffic production site, you might want to store banner/desc in index.json 
    // to avoid N+1 requests. For GitHub Pages, this fetch is acceptable for lazy loading.
    let banner = '';
    let description = '';
    
    try {
        const res = await fetch(`${post.slug}/index.html`);
        if (res.ok) {
            const text = await res.text();
            const doc = new DOMParser().parseFromString(text, 'text/html');
            
            // Extract Meta Description
            const metaDesc = doc.querySelector('meta[name="description"]');
            description = metaDesc ? metaDesc.content : getExcerpt(doc);
            
            // Extract Banner (OG Image or First Image)
            const metaImg = doc.querySelector('meta[property="og:image"]');
            banner = metaImg ? metaImg.content : '';
            
            // Fallback Banner
            if(!banner || banner.length < 5) banner = 'https://via.placeholder.com/800x450/1e1e1e/333?text=No+Image';
        }
    } catch (e) {
        description = "Click to read this article.";
        banner = 'https://via.placeholder.com/800x450/1e1e1e/333?text=Error';
    }

    // Clean up spaces in slug for URL
    const safeSlug = post.slug; 

    return `
    <article class="blog-card fade-in">
        <a href="${safeSlug}/" class="card-img-link">
            <img src="${banner}" alt="${post.title}" class="card-img" loading="lazy">
        </a>
        <div class="card-content">
            <div class="card-meta">
                <i class="fa-regular fa-calendar"></i> ${dateStr}
            </div>
            <a href="${safeSlug}/">
                <h2 class="card-title">${post.title}</h2>
            </a>
            <p class="card-desc">${description}</p>
            <a href="${safeSlug}/" class="read-more">Read Article <i class="fa-solid fa-arrow-right"></i></a>
        </div>
    </article>
    `;
}

function getExcerpt(doc) {
    // Helper: Grab first paragraph text if no meta description
    const p = doc.querySelector('.article-container p');
    if (p) return p.innerText.substring(0, 140) + '...';
    return "Read full article to learn more.";
}

function setupIntersectionObserver() {
    const sentinel = document.getElementById(CONFIG.sentinelId);
    const observer = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting) {
            loadMorePosts();
        }
    }, { rootMargin: '100px' }); // Load 100px before reaching bottom
    
    observer.observe(sentinel);
}
