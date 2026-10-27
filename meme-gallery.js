(() => {
  const owner = "Strongblade05";
  const repo = "bublo-website";
  const branch = "main";
  const folder = "assets/memes";
  const grid = document.getElementById("meme-gallery");
  if (!grid) return;

  const titleFromFilename = (name) => name.replace(/\.[^.]+$/, "")
    .replace(/^meme[-_]?/i, "").replace(/[-_]+/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase());
  const idFromFilename = (name) => name.replace(/\.[^.]+$/, "")
    .toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
  const escapeHtml = (value) => String(value).replace(/[&<>"']/g, (c) => ({
    "&":"&amp;", "<":"&lt;", ">":"&gt;", "\"":"&quot;", "'":"&#39;"
  })[c]);

  async function loadGallery() {
    try {
      const url = `https://api.github.com/repos/${owner}/${repo}/contents/${folder}?ref=${branch}`;
      const response = await fetch(url, { headers: { Accept: "application/vnd.github+json" } });
      if (!response.ok) throw new Error(`GitHub returned ${response.status}`);
      const files = await response.json();
      const images = files.filter((file) => file.type === "file" && /\.(png|jpe?g|webp|gif)$/i.test(file.name))
        .sort((a,b) => a.name.localeCompare(b.name));
      if (!images.length) { grid.innerHTML = '<p class="gallery-loading">No memes yet. Check back soon!</p>'; return; }
      grid.innerHTML = images.map((file) => {
        const id = idFromFilename(file.name);
        const title = titleFromFilename(file.name);
        const image = `/assets/memes/${encodeURIComponent(file.name)}`;
        const safeTitle = escapeHtml(title);
        const safeImage = escapeHtml(image);
        const safeId = escapeHtml(id);
        const downloadName = escapeHtml(`BUBLO-${file.name}`);
        return `<article class="meme-card">
          <button class="meme-preview" type="button" data-full="${safeImage}" aria-label="Open ${safeTitle} meme">
            <img src="${safeImage}" alt="${safeTitle} — BUBLO community meme" loading="lazy">
            <span class="preview-hint">VIEW IMAGE ↗</span>
          </button>
          <div class="meme-info">
            <div><h2>${safeTitle}</h2><p>A little BUBLO chaos.</p></div>
            <a class="download-button" href="${safeImage}" download="${downloadName}" data-meme-id="${safeId}">DOWNLOAD ↓</a>
            <span class="download-count" data-count-for="${safeId}" aria-live="polite"><span class="count-number">—</span> downloads</span>
          </div>
        </article>`;
      }).join("");
      document.dispatchEvent(new CustomEvent("bublo:gallery-ready"));
    } catch (error) {
      console.error("BUBLO gallery error:", error);
      grid.innerHTML = '<p class="gallery-loading">The meme gallery could not load right now. Please refresh in a moment.</p>';
    }
  }
  loadGallery();
})();
