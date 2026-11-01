const address = "De9eGikY19zWcWARX9heY2rnKjinQAAPxPx3uiJpump";

const copyAddressButton = document.getElementById("copy-address");

if (copyAddressButton) {
  copyAddressButton.addEventListener("click", async () => {
    const status = document.getElementById("copy-status");

    try {
      await navigator.clipboard.writeText(address);
      if (status) status.textContent = "Address copied!";
    } catch {
      if (status) status.textContent = "Please select and copy the address above.";
    }
  });
}

// Gallery image preview and direct original-file downloads.
const lightbox = document.getElementById("meme-lightbox");

if (lightbox) {
  const previewImage = lightbox.querySelector("img");
  const downloadLink = lightbox.querySelector(".lightbox-download");
  const closeButton = lightbox.querySelector(".lightbox-close");

  const openLightbox = (button) => {
    const src = button.dataset.full;
    const card = button.closest(".meme-card");
    const originalLink = card?.querySelector(".download-button");
    const thumbnail = button.querySelector("img");

    if (!src || !thumbnail || !previewImage) return;

    previewImage.src = src;
    previewImage.alt = thumbnail.alt || "BUBLO meme";

    if (downloadLink) {
      downloadLink.href = src;
      downloadLink.download = originalLink?.download || "BUBLO-meme";
    }

    lightbox.classList.add("open");
    lightbox.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";

    closeButton?.focus();
  };

  const closeLightbox = () => {
    lightbox.classList.remove("open");
    lightbox.setAttribute("aria-hidden", "true");

    if (previewImage) previewImage.src = "";

    document.body.style.overflow = "";
  };

  // Delegated click handling supports dynamically loaded gallery cards.
  document.addEventListener("click", (event) => {
    const button = event.target.closest?.(".meme-preview");

    if (button) {
      event.preventDefault();
      openLightbox(button);
      return;
    }

    if (event.target === closeButton || event.target === lightbox) {
      closeLightbox();
    }
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && lightbox.classList.contains("open")) {
      closeLightbox();
    }
  });
}
