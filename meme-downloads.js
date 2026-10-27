(() => {
  // After deploying the Worker, paste its URL here (example: https://bublo-counter.YOUR-SUBDOMAIN.workers.dev).
  const endpoint = https://bublo-download-counter.dragan-danicic1990.workers.dev;
  const ready = () => {
    const countElements = [...document.querySelectorAll("[data-count-for]")];
    const downloadLinks = [...document.querySelectorAll("a[data-meme-id]")];
    if (!countElements.length || !downloadLinks.length) return;
    const showCount = (id, value) => {
      const el = countElements.find((item) => item.dataset.countFor === id); if (!el) return;
      const number = el.querySelector(".count-number"); if (number) number.textContent = Number(value || 0).toLocaleString();
      el.classList.remove("is-loading", "is-error"); el.title = "Community download button clicks";
    };
    const loadCounts = async () => {
      if (!endpoint.startsWith("https://")) {
        countElements.forEach((el) => { const n=el.querySelector(".count-number"); if(n)n.textContent="—"; el.title="Counter setup pending"; }); return;
      }
      countElements.forEach((el) => el.classList.add("is-loading"));
      try { const r=await fetch(endpoint); if(!r.ok) throw Error(); const data=await r.json(); countElements.forEach(el=>showCount(el.dataset.countFor,data[el.dataset.countFor]||0)); }
      catch { countElements.forEach(el=>{el.classList.remove("is-loading");el.classList.add("is-error");const n=el.querySelector(".count-number");if(n)n.textContent="—";}); }
    };
    downloadLinks.forEach((link) => {
      if (link.dataset.counterBound === "1") return; link.dataset.counterBound = "1";
      link.addEventListener("click", async (event) => {
        event.preventDefault(); if(link.classList.contains("is-counting")) return; link.classList.add("is-counting");
        try {
          if (!endpoint.startsWith("https://")) throw Error("Counter not configured");
          const r=await fetch(endpoint,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({memeId:link.dataset.memeId})});
          if(!r.ok) throw Error(); const result=await r.json(); countElements.forEach(el=>showCount(el.dataset.countFor,result.counts?.[el.dataset.countFor]||0));
        } catch { const el=countElements.find(x=>x.dataset.countFor===link.dataset.memeId); if(el){el.classList.add("is-error");el.title="Counter unavailable; download will still work";} }
        finally { const a=document.createElement("a");a.href=link.href;a.download=link.download;document.body.appendChild(a);a.click();a.remove();link.classList.remove("is-counting"); }
      });
    });
    loadCounts();
  };
  ready(); document.addEventListener("bublo:gallery-ready", ready);
})();
