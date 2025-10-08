// =================================================================================
// WATCH.JS - Watch Page Logic (Hash-based URL Final Version)
// =================================================================================

// ---------------------------
// GLOBAL CACHE & HELPERS
// ---------------------------
let allMatchesCache = [];
let searchDataFetched = false;

function createMatchCard(match) {
    // ... (This function is identical to your previous version, included for search functionality)
    const card = document.createElement("div");
    card.className = "search-result-item";
    const poster = document.createElement("img");
    poster.className = "match-poster";
    poster.src = (match.teams?.home?.badge && match.teams?.away?.badge) ? `https://streamed.pk/api/images/poster/${match.teams.home.badge}/${match.teams.away.badge}.webp` : "https://methstreams.world/mysite.jpg";
    poster.alt = match.title || "Match Poster";
    poster.onerror = () => { poster.onerror = null; poster.src = "https://methstreams.world/mysite.jpg"; };
    const { badge, badgeType, meta } = formatDateTime(match.date);
    const statusBadge = document.createElement("div");
    statusBadge.classList.add("status-badge", badgeType);
    statusBadge.textContent = badge;
    const info = document.createElement("div");
    info.classList.add("match-info");
    const title = document.createElement("div");
    title.classList.add("match-title");
    title.textContent = match.title || "Untitled Match";
    const metaRow = document.createElement("div");
    metaRow.classList.add("match-meta-row");
    const category = document.createElement("span");
    category.classList.add("match-category");
    category.textContent = match.category ? match.category.charAt(0).toUpperCase() + match.category.slice(1) : "Unknown";
    const timeOrDate = document.createElement("span");
    timeOrDate.textContent = meta;
    metaRow.append(category, timeOrDate);
    info.append(title, metaRow);
    card.append(poster, statusBadge, info);
    card.addEventListener("click", () => { window.location.href = `../Matchinformation/?id=${match.id}`; });
    return card;
}
function formatDateTime(timestamp) {
    const date = new Date(timestamp), now = new Date();
    const isToday = date.toDateString() === now.toDateString();
    const timeFormat = { hour: "numeric", minute: "2-digit" };
    if (timestamp <= now.getTime()) return { badge: "LIVE", badgeType: "live", meta: date.toLocaleTimeString("en-US", timeFormat) };
    if (isToday) return { badge: date.toLocaleTimeString("en-US", timeFormat), badgeType: "date", meta: "Today" };
    return { badge: date.toLocaleDateString("en-US", { month: "short", day: "numeric" }), badgeType: "date", meta: date.toLocaleTimeString("en-US", timeFormat) };
}
async function fetchSearchData() {
    if (searchDataFetched) return;
    try {
        const res = await fetch("https://streamed.pk/api/matches/all");
        if (!res.ok) throw new Error("Failed to fetch search data");
        const allMatches = await res.json();
        const map = new Map();
        allMatches.forEach(m => map.set(m.id, m));
        allMatchesCache = Array.from(map.values());
        searchDataFetched = true;
    } catch (err) { console.error("Error fetching search data:", err); }
}
function setupSearch() {
    const searchInput = document.getElementById("search-input");
    const searchOverlay = document.getElementById("search-overlay");
    const overlayInput = document.getElementById("overlay-search-input");
    const overlayResults = document.getElementById("overlay-search-results");
    const searchClose = document.getElementById("search-close");
    const openSearch = () => { fetchSearchData(); searchOverlay.style.display = "flex"; overlayInput.value = searchInput.value; overlayInput.focus(); };
    searchInput.addEventListener("focus", openSearch);
    searchClose.addEventListener("click", () => { searchOverlay.style.display = "none"; });
    searchOverlay.addEventListener("click", (e) => { if (!e.target.closest(".search-overlay-content")) searchOverlay.style.display = "none"; });
    overlayInput.addEventListener("input", function() {
        const q = this.value.trim().toLowerCase();
        overlayResults.innerHTML = "";
        if (!q || !searchDataFetched) return;
        const filtered = allMatchesCache.filter(m => (m.title || "").toLowerCase().includes(q) || (m.teams?.home?.name || "").toLowerCase().includes(q) || (m.teams?.away?.name || "").toLowerCase().includes(q));
        filtered.slice(0, 12).forEach(match => { overlayResults.appendChild(createMatchCard(match)); });
    });
    overlayInput.addEventListener("keydown", (e) => {
        if (e.key === "Enter") {
            const q = overlayInput.value.trim();
            if (q) window.location.href = `../SearchResult/?q=${encodeURIComponent(q)}`;
        }
    });
}

// ---------------------------
// PAGE-SPECIFIC LOGIC
// ---------------------------

function parseUrlFromHash() {
    const hash = window.location.hash.substring(1); // Remove '#'
    if (!hash) return null;

    const pathParts = hash.replace(/^\//, '').split('/'); // Remove leading '/' and split
    if (pathParts.length < 3) return null;

    const [matchId, sourceName, streamIdentifier] = pathParts;
    const quality = streamIdentifier.substring(0, 2);
    const streamNumber = parseInt(streamIdentifier.substring(2), 10);

    if (!matchId || !sourceName || !['hd', 'sd'].includes(quality) || isNaN(streamNumber)) {
        return null;
    }
    return { matchId, sourceName, quality, streamNumber };
}

function renderStreamRow(stream, index, match, activeStream) {
    const isActive = stream.id === activeStream.id;
    const row = isActive ? document.createElement("div") : document.createElement("a");
    
    row.className = "stream-row";
    if (isActive) {
        row.classList.add("active");
    } else {
        const quality = stream.hd ? 'hd' : 'sd';
        // Link to a new hash, which will trigger the 'hashchange' event listener
        row.href = `#/${match.id}/${stream.source}/${quality}${stream.streamNo}`;
    }

    const qualityTagClass = stream.hd ? "hd" : "sd";
    const qualityText = stream.hd ? "HD" : "SD";
    const viewersHTML = stream.viewers > 0 ? `<div class="viewers-count"><svg ...></svg>${stream.viewers}</div>` : '';
    const languageHTML = `<div class="stream-lang"><svg ...></svg>${stream.language || "English"}</div>`;
    const statusIcon = isActive ? `<span class="status-running">Running</span>` : `<span class="open-arrow"><svg ...></svg></span>`;

    row.innerHTML = `
        <div class="stream-label">
            <span class="quality-tag ${qualityTagClass}">${qualityText}</span>
            <span>Stream ${index + 1}</span>
            ${statusIcon}
        </div>
        <div class="stream-meta">
            ${viewersHTML}
            ${languageHTML}
        </div>`;
    return row;
}

async function renderStreamSource(source, match, activeStream) {
    const sourceMeta = { alpha: "Most reliable...", /* etc */ };
    const description = sourceMeta[source.source.toLowerCase()] || "Reliable streams";
    try {
        const res = await fetch(`https://streamed.pk/api/stream/${source.source}/${source.id}`);
        if (!res.ok) return null;
        let streams = await res.json();
        if (!streams || streams.length === 0) return null;
        
        streams.sort((a, b) => (b.hd - a.hd) || ((b.viewers || 0) - (a.viewers || 0)));
        
        const sourceContainer = document.createElement("div");
        sourceContainer.className = "stream-source";
        if (streams.some(s => s.id === activeStream.id)) {
            sourceContainer.dataset.containsActive = "true";
        }
        sourceContainer.innerHTML = `<div class="source-header">...</div><small>...</small>`;
        
        const fragment = document.createDocumentFragment();
        streams.forEach((stream, i) => fragment.appendChild(renderStreamRow(stream, i, match, activeStream)));
        sourceContainer.appendChild(fragment);
        
        return sourceContainer;
    } catch (err) { return null; }
}

async function initializeWatchPage() {
    const urlData = parseUrlFromHash();

    const titleEl = document.getElementById("watch-title");
    const descEl = document.getElementById("watch-description");
    const playerEl = document.getElementById("stream-player");
    const playerContainerEl = document.getElementById("stream-player-container");
    const streamsContainer = document.getElementById("streams-container");
    const sourcesSummaryEl = document.getElementById('sources-summary');
    const showAllBtn = document.getElementById("show-all-sources-btn");
    
    if (!urlData) {
        titleEl.textContent = "Error: Invalid Stream Link";
        descEl.textContent = "Please select a stream from a match page.";
        document.querySelectorAll('.skeleton').forEach(el => el.classList.remove('skeleton'));
        playerContainerEl.innerHTML = `<div class="error-message">Invalid stream URL hash.</div>`;
        return;
    }

    const { matchId, sourceName, quality, streamNumber } = urlData;
    
    document.getElementById("back-button").addEventListener("click", () => {
        window.location.href = `../Matchinformation/?id=${matchId}`;
    });

    // Reset UI to loading state for hash changes
    titleEl.classList.add('skeleton');
    descEl.classList.add('skeleton');
    playerContainerEl.classList.add('skeleton');
    playerEl.src = 'about:blank';
    streamsContainer.innerHTML = '<div class="stream-source is-loading">...</div>';

    try {
        const res = await fetch("https://streamed.pk/api/matches/all");
        if (!res.ok) throw new Error("Could not fetch match list");
        const allMatches = await res.json();
        const match = allMatches.find(m => String(m.id) === String(matchId));
        if (!match) throw new Error("Match not found");

        const sourceForStream = match.sources.find(s => s.source === sourceName);
        if (!sourceForStream) throw new Error("Source not found for this match");

        const streamRes = await fetch(`https://streamed.pk/api/stream/${sourceForStream.source}/${sourceForStream.id}`);
        if (!streamRes.ok) throw new Error(`Could not fetch streams from source: ${sourceName}`);
        
        const streams = await streamRes.json();
        const activeStream = streams.find(s => (s.hd ? 'hd' : 'sd') === quality && s.streamNo === streamNumber);
        if (!activeStream) throw new Error("Stream not found.");

        document.querySelectorAll('.skeleton').forEach(el => el.classList.remove('skeleton'));
        
        const pageTitle = `Live ${match.title} Stream Link (...)`;
        document.title = pageTitle;
        titleEl.textContent = pageTitle;
        descEl.textContent = `${match.title} live on Methstreams.world...`;
        playerEl.src = activeStream.embedUrl;

        streamsContainer.innerHTML = "";

        // ... (The rest of the rendering logic for sources, same as before)
        const sourcePromises = match.sources.map(source => renderStreamSource(source, match, activeStream));
        const sourceElements = (await Promise.all(sourcePromises)).filter(Boolean);
        // ... and the show all button logic
        
    } catch (err) {
        // ... (Error handling, same as before)
    }
}

document.addEventListener("DOMContentLoaded", () => {
    initializeWatchPage(); // Run on initial load
    setupSearch(); 
});

// Listen for clicks on other streams and re-run the logic without a page reload
window.addEventListener('hashchange', initializeWatchPage);
