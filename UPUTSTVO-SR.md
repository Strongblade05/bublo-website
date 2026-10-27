# BUBLO — GitHub Pages + automatska Meme Gallery

## Šta paket radi
- Zadržava postojeći dizajn sajta i pet trenutnih meme slika.
- Galerija automatski pronalazi slike u `assets/memes/` preko GitHub API-ja.
- Za svaku sliku pravi `VIEW IMAGE`, `DOWNLOAD` i brojač.
- Brojač koristi zaseban Cloudflare Worker + KV (besplatni limiti, ali zahtijeva jednokratno podešavanje).

## Dodavanje novih memeova
1. Otvori GitHub repozitorijum `Strongblade05/bublo-website`.
2. Otvori `assets/memes/`.
3. Klikni **Add file → Upload files**, dodaj PNG/JPG/WebP/GIF i klikni **Commit changes**.
4. GitHub Pages će objaviti izmjenu; slika se automatski pojavi u galeriji.
5. Koristi jednostavno ime fajla, npr. `meme-new-chaos.png`. Naslov se generiše iz imena fajla.

## Objavljivanje sajta na GitHub Pages
1. U repozitorijumu otvori **Settings → Pages**.
2. Pod **Build and deployment** izaberi **Deploy from a branch**.
3. Branch: `main`; folder: `/ (root)`; klikni **Save**.
4. Sačekaj da GitHub objavi sajt na `https://strongblade05.github.io/bublo-website/`.

## Globalni brojač (opciono, podešava se jednom)
1. Cloudflare Dashboard → **Workers & Pages** → **Create** → **Worker**.
2. Napravi Worker, otvori **Edit code**, zamijeni sadržaj kodom iz `cloudflare-worker/worker.js`, pa **Deploy**.
3. Worker → **Settings → Bindings → Add binding → KV namespace**. Binding name mora biti `COUNTS`. Kreiraj KV namespace npr. `BUBLO_MEME_COUNTS` i sačuvaj binding.
4. Kopiraj Worker URL (npr. `https://bublo-counter.<tvoj-nalog>.workers.dev`).
5. Otvori `meme-downloads.js` i zamijeni `PASTE_YOUR_WORKER_URL_HERE` svojim Worker URL-om. Commit izmjenu.

Napomena: Cloudflare Workers Free ima dnevne limite; KV je eventualno konzistentan, pa istovremeni klikovi mogu povremeno dovesti do nepreciznosti brojača. Brojač bilježi klik na DOWNLOAD, ne potvrdu da je fajl sačuvan. Bez Worker URL-a, slike i dugmad rade, ali broj ostaje `—`.

## Važno
- Ne mijenjaj niti briši postojeći Netlify sajt dok GitHub Pages verzija nije testirana.
- Ne dodaj privatne ključeve, wallet seed phrase ili API tajne u repozitorijum.
- Repozitorijum je javan; slike i izvorni kod su javno vidljivi.
