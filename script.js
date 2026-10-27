
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

// Gallery preview — supports dynamically loaded images.
const lightbox = document.getElementById("meme-lightbox");

if (lightbox) {
  const previewImage = lightbox.querySelector("img");
  const downloadLink = lightbox.querySelector(".lightbox-download");
  const closeButton = lightbox.querySelector(".lightbox-close");

  document.addEventListener("click", (event) => {
    const button = event.target.closest(".meme-preview");
    if (!button) return;

    const src = button.dataset.full;
    const originalLink = button.closest(".meme-card").querySelector(".download-button");

    previewImage.src = src;
    previewImage.alt = button.querySelector("img").alt;
    downloadLink.href = src;
    downloadLink.download = originalLink.download;

    lightbox.classList.add("open");
    lightbox.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
    closeButton.focus();
  });

  const closeLightbox = () => {
    lightbox.classList.remove("open");
    lightbox.setAttribute("aria-hidden", "true");
    previewImage.src = "";
    document.body.style.overflow = "";
  };

  closeButton.addEventListener("click", closeLightbox);

  lightbox.addEventListener("click", (event) => {
    if (event.target === lightbox) closeLightbox();
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && lightbox.classList.contains("open")) {
      closeLightbox();
    }
  });
}
