(function () {
  "use strict";

  /* ════════════════════════════════════════
     1) Année footer
  ════════════════════════════════════════ */
  const yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ════════════════════════════════════════
     2) Scroll progress bar
  ════════════════════════════════════════ */
  const scrollBar = document.getElementById("scrollBar");
  window.addEventListener("scroll", () => {
    if (!scrollBar) return;
    const h = document.documentElement.scrollHeight - window.innerHeight;
    scrollBar.style.width = (h > 0 ? (window.scrollY / h) * 100 : 0) + "%";
  }, { passive: true });

  /* ════════════════════════════════════════
     3) Menu mobile
  ════════════════════════════════════════ */
  const navToggle = document.getElementById("navToggle");
  const navList = document.getElementById("navList");

  function closeMenu() {
    navList?.classList.remove("is-open");
    navToggle?.setAttribute("aria-expanded", "false");
  }

  if (navToggle && navList) {
    navToggle.addEventListener("click", () => {
      const open = navList.classList.toggle("is-open");
      navToggle.setAttribute("aria-expanded", String(open));
    });
    navList.querySelectorAll("a").forEach(a => a.addEventListener("click", closeMenu));
    document.addEventListener("click", e => {
      if (!navList.contains(e.target) && !navToggle.contains(e.target)) closeMenu();
    });
  }

  /* ════════════════════════════════════════
     4) Thème clair / sombre
  ════════════════════════════════════════ */
  const themeToggle = document.getElementById("themeToggle");
  const savedTheme = localStorage.getItem("theme");
  if (savedTheme) document.documentElement.setAttribute("data-theme", savedTheme);

  function updateIcon() {
    if (!themeToggle) return;
    const t = document.documentElement.getAttribute("data-theme");
    themeToggle.textContent = t === "light" ? "☀️" : "🌙";
  }
  updateIcon();

  themeToggle?.addEventListener("click", () => {
    const cur = document.documentElement.getAttribute("data-theme") || "dark";
    const next = cur === "light" ? "dark" : "light";
    document.documentElement.setAttribute("data-theme", next);
    localStorage.setItem("theme", next);
    updateIcon();
  });

  /* ════════════════════════════════════════
     5) Active nav au scroll
  ════════════════════════════════════════ */
  const sections = Array.from(document.querySelectorAll("section[id]"));
  const navLinks = Array.from(document.querySelectorAll(".nav__list a[href^='#']"));

  window.addEventListener("scroll", () => {
    const scrollY = window.scrollY + 130;
    let current = "";
    sections.forEach(s => { if (scrollY >= s.offsetTop) current = s.id; });
    navLinks.forEach(a => {
      a.classList.toggle("active", a.getAttribute("href") === "#" + current);
    });
  }, { passive: true });

  /* ════════════════════════════════════════
     6) Terminal effet frappe (Hero)
  ════════════════════════════════════════ */
  const typeTarget = document.getElementById("typeTarget");
  const termLines = [
    "$ whoami",
    "queren-tangou // dev web",
    "",
    "$ cat skills.txt",
    "PHP · MySQL · JS · Node",
    "HTML · CSS · React",
    "",
    "$ git status",
    "✔ Disponible — stage / alternance",
    "",
    "$ _",
  ];

  async function typeLines(el, lines) {
    if (!el) return;
    el.innerHTML = "";
    for (const line of lines) {
      await typeLine(el, line + "\n", line === "$ _" ? 0 : 14);
      await sleep(80);
    }
    // Curseur clignotant en fin
    const cursor = document.createElement("span");
    cursor.className = "cursor";
    cursor.textContent = "_";
    el.appendChild(cursor);
  }

  function typeLine(el, text, speed) {
    if (speed === 0) {
      el.textContent += text;
      return Promise.resolve();
    }
    return new Promise(resolve => {
      let i = 0;
      const id = setInterval(() => {
        el.textContent += text[i++];
        if (i >= text.length) { clearInterval(id); resolve(); }
      }, speed);
    });
  }

  function sleep(ms) { return new Promise(r => setTimeout(r, ms)); }

  /* ════════════════════════════════════════
     7) Barres de compétences animées
     (s'animent au scroll, une seule fois)
  ════════════════════════════════════════ */
  const skillFills = Array.from(document.querySelectorAll(".skill-bar__fill"));
  let skillsAnimated = false;

  function animateSkills() {
    if (skillsAnimated) return;
    const skillsSection = document.getElementById("skills");
    if (!skillsSection) return;
    const rect = skillsSection.getBoundingClientRect();
    if (rect.top < window.innerHeight * 0.85) {
      skillsAnimated = true;
      skillFills.forEach(bar => {
        const w = bar.getAttribute("data-width") || "0";
        bar.style.width = w + "%";
      });
    }
  }

  window.addEventListener("scroll", animateSkills, { passive: true });
  window.addEventListener("load", animateSkills);

  /* ════════════════════════════════════════
     8) Filtres projets
  ════════════════════════════════════════ */
  const projectSearch = document.getElementById("projectSearch");
  const projectTag = document.getElementById("projectTag");
  const projectCount = document.getElementById("projectCount");
  const projectCards = Array.from(document.querySelectorAll(".project-card"));

  const norm = s => (s || "").toLowerCase().trim();

  function filterProjects() {
    if (!projectCards.length) return;
    const q = norm(projectSearch?.value);
    const tag = projectTag?.value || "all";
    let shown = 0;

    projectCards.forEach(card => {
      const title = norm(card.getAttribute("data-title") || "");
      const tags = norm(card.getAttribute("data-tags") || "");
      const matchText = !q || title.includes(q) || tags.includes(q);
      const matchTag = tag === "all" || tags.split(/\s+/).includes(tag);
      const ok = matchText && matchTag;
      card.style.display = ok ? "" : "none";
      if (ok) shown++;
    });

    if (projectCount) projectCount.textContent = `${shown} projet(s) affiché(s)`;
  }

  projectSearch?.addEventListener("input", filterProjects);
  projectTag?.addEventListener("change", filterProjects);
  filterProjects();

  /* ════════════════════════════════════════
     9) Filtres veille technologique
  ════════════════════════════════════════ */
  const veilleFilterBtns = Array.from(document.querySelectorAll(".veille-filter-btn"));
  const veilleCards = Array.from(document.querySelectorAll(".veille-card"));

  function filterVeille(filter) {
    veilleCards.forEach(card => {
      const cats = card.getAttribute("data-veille") || "";
      card.style.display = (filter === "all" || cats.includes(filter)) ? "" : "none";
    });
    veilleFilterBtns.forEach(btn =>
      btn.classList.toggle("active", btn.getAttribute("data-filter") === filter)
    );
  }

  veilleFilterBtns.forEach(btn =>
    btn.addEventListener("click", () => filterVeille(btn.getAttribute("data-filter")))
  );

  /* ════════════════════════════════════════
     10) NewsAPI — Flux d'articles en temps réel
     ─────────────────────────────────────────
     POUR ACTIVER :
     1. Crée un compte gratuit sur https://newsapi.org/register
     2. Copie ta clé API (ex: a1b2c3d4e5f6...)
     3. Remplace la valeur data-key ci-dessous dans le HTML :
        <div id="newsApiKey" data-key="TA_CLE_ICI">
     4. Ta veille se mettra à jour automatiquement !
     ─────────────────────────────────────────
     Note : La clé gratuite fonctionne en localhost.
     En production, tu auras besoin d'un proxy simple
     (Netlify Functions, Vercel Edge Functions) pour
     masquer la clé. Voir README inclus dans le ZIP.
  ════════════════════════════════════════ */

  const API_KEY = document.getElementById("newsApiKey")?.getAttribute("data-key") || "";
  const veilleApiGrid = document.getElementById("veilleApiGrid");
  const veilleLoader = document.getElementById("veilleLoader");
  const apiCount = document.getElementById("apiCount");
  const QUERY = "cybersecurity AI vulnerability detection OR \"faille IA\" OR \"intelligence artificielle sécurité\"";
  const API_URL = `https://newsapi.org/v2/everything?q=${encodeURIComponent(QUERY)}&language=fr&sortBy=publishedAt&pageSize=6&apiKey=${API_KEY}`;

  async function loadNewsApi() {
    if (!veilleApiGrid) return;

    // Clé non configurée → afficher le guide
    if (!API_KEY || API_KEY === "YOUR_NEWSAPI_KEY_HERE") {
      showApiSetup();
      return;
    }

    if (veilleLoader) veilleLoader.style.display = "flex";

    try {
      const res = await fetch(API_URL);
      const data = await res.json();

      if (veilleLoader) veilleLoader.style.display = "none";

      if (data.status !== "ok" || !data.articles?.length) {
        veilleApiGrid.innerHTML = `<div class="api-error">Aucun article trouvé pour le moment. Réessaie plus tard.</div>`;
        return;
      }

      const articles = data.articles.filter(a => a.title && a.title !== "[Removed]");
      if (apiCount) apiCount.textContent = `${articles.length} article(s) chargé(s)`;

      veilleApiGrid.innerHTML = "";
      articles.forEach((article, i) => {
        const date = article.publishedAt
          ? new Date(article.publishedAt).toLocaleDateString("fr-FR", { day: "2-digit", month: "short", year: "numeric" })
          : "";
        const source = article.source?.name || "Source inconnue";
        const description = article.description
          ? article.description.slice(0, 150) + (article.description.length > 150 ? "…" : "")
          : "Pas de description disponible.";

        const el = document.createElement("article");
        el.className = "api-article";
        el.setAttribute("data-aos", "fade-up");
        el.setAttribute("data-aos-delay", String(i * 60));
        el.innerHTML = `
          ${article.urlToImage ? `<div class="api-article__img"><img src="${article.urlToImage}" alt="${article.title}" loading="lazy" onerror="this.parentElement.style.display='none'" /></div>` : ""}
          <div class="api-article__header">
            <span class="veille-card__cat veille-cat--api">Flux API</span>
            <span class="veille-card__date">${date}</span>
          </div>
          <h4>${article.title}</h4>
          <p>${description}</p>
          <div style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:8px">
            <span class="api-article__source">📰 ${source}</span>
            <a href="${article.url}" target="_blank" rel="noreferrer" class="btn btn--outline btn--sm">Lire →</a>
          </div>
        `;
        veilleApiGrid.appendChild(el);
      });

      if (window.AOS) AOS.refresh();

    } catch (err) {
      if (veilleLoader) veilleLoader.style.display = "none";
      veilleApiGrid.innerHTML = `<div class="api-error">⚠️ Impossible de charger les articles. Vérifie ta connexion ou ta clé API.<br><small>${err.message}</small></div>`;
    }
  }

  function showApiSetup() {
    if (veilleLoader) veilleLoader.style.display = "none";
    if (!veilleApiGrid) return;
    veilleApiGrid.innerHTML = `
      <div class="api-setup">
        <h4>⚙️ Configuration requise — Flux d'articles en temps réel</h4>
        <p>Pour activer la mise à jour automatique des articles, il faut une clé API gratuite de NewsAPI :</p>
        <ol>
          <li>Va sur <a href="https://newsapi.org/register" target="_blank" rel="noreferrer" style="color:var(--accent)">newsapi.org/register</a> et crée un compte gratuit</li>
          <li>Copie ta clé API (ressemble à : <code>a1b2c3d4e5f6789...</code>)</li>
          <li>Dans <code>index.html</code>, trouve la ligne : <code>&lt;div id="newsApiKey" data-key="YOUR_NEWSAPI_KEY_HERE"&gt;</code></li>
          <li>Remplace <code>YOUR_NEWSAPI_KEY_HERE</code> par ta clé</li>
          <li>Sauvegarde et recharge la page — les articles s'affichent automatiquement ! 🎉</li>
        </ol>
        <p><strong>Gratuit :</strong> 100 requêtes/jour · Articles en français · Mis à jour toutes les heures</p>
      </div>
    `;
  }

  document.getElementById("veilleRefresh")?.addEventListener("click", () => {
    if (veilleApiGrid) veilleApiGrid.innerHTML = "";
    if (veilleLoader) {
      veilleLoader.style.display = "flex";
      veilleApiGrid?.appendChild(veilleLoader);
    }
    loadNewsApi();
  });

  /* ════════════════════════════════════════
     11) Contact — EmailJS
     ─────────────────────────────────────────
     POUR ACTIVER (réception d'emails dans ta boîte) :
     1. Inscris-toi sur https://www.emailjs.com/ (gratuit — 200 emails/mois)
     2. Crée un Service Email (Gmail, Outlook…)
     3. Crée un Email Template avec les variables :
        {{user_name}}, {{user_email}}, {{subject}}, {{message}}
     4. Remplace les 3 identifiants ci-dessous
  ════════════════════════════════════════ */
  const EMAILJS_SERVICE_ID  = "service_ggfgkqa";
  const EMAILJS_TEMPLATE_ID = "template_f38jfhi";
  const EMAILJS_PUBLIC_KEY  = "mKS4t1v9c8fp1FkIo";

  const contactForm = document.getElementById("contactForm");
  const formMsg = document.getElementById("formMsg");
  const submitBtn = document.getElementById("submitBtn");
  const submitText = document.getElementById("submitText");
  const submitLoader = document.getElementById("submitLoader");

  function setMsg(text, ok = false) {
    if (!formMsg) return;
    formMsg.textContent = text;
    formMsg.style.color = ok ? "var(--accent2)" : "#ff6060";
  }

  function isValidEmail(e) { return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e); }

  function canSend() {
    const key = "qt_last_send";
    const last = Number(localStorage.getItem(key) || 0);
    if (Date.now() - last < 60000) return false;
    localStorage.setItem(key, Date.now());
    return true;
  }

  contactForm?.addEventListener("submit", async e => {
    e.preventDefault();

    const name    = contactForm.querySelector("#user_name")?.value?.trim() || "";
    const email   = contactForm.querySelector("#user_email")?.value?.trim() || "";
    const message = contactForm.querySelector("#message")?.value?.trim() || "";

    if (name.length < 2)        return setMsg("❌ Nom trop court (2 caractères minimum).");
    if (!isValidEmail(email))   return setMsg("❌ Email invalide.");
    if (message.length < 10)    return setMsg("❌ Message trop court (10 caractères minimum).");
    if (!canSend())             return setMsg("⏳ Patiente 60 secondes avant de renvoyer.");

    // Clé EmailJS non configurée
    if (EMAILJS_PUBLIC_KEY === "YOUR_PUBLIC_KEY") {
      setMsg("⚙️ EmailJS n'est pas encore configuré. Consulte le README du ZIP pour activer la réception d'emails.", true);
      return;
    }

    // Afficher le loader
    if (submitText) submitText.style.display = "none";
    if (submitLoader) submitLoader.style.display = "inline";
    if (submitBtn) submitBtn.disabled = true;

    try {
      await emailjs.sendForm(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, contactForm, EMAILJS_PUBLIC_KEY);
      setMsg("✅ Message envoyé ! Je te réponds dès que possible.", true);
      contactForm.reset();
    } catch (err) {
      setMsg("❌ Erreur d'envoi. Essaie de m'écrire directement à tangouosty@gmail.com");
    } finally {
      if (submitText) submitText.style.display = "inline";
      if (submitLoader) submitLoader.style.display = "none";
      if (submitBtn) submitBtn.disabled = false;
    }
  });

  /* ════════════════════════════════════════
     12) AOS init + terminal + newsapi au chargement
  ════════════════════════════════════════ */
  window.addEventListener("load", () => {
    if (window.AOS) AOS.init({ duration: 750, once: true, offset: 70, easing: "ease-out-cubic" });
    loadNewsApi();
  });

})();
