(function () {
  "use strict";

  /* =========================
     1) Année dans le footer
  ========================= */
  const yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* =========================
     2) Menu mobile
  ========================= */
  const navToggle = document.getElementById("navToggle");
  const navList = document.getElementById("navList");

  function closeMenu() {
    if (!navList || !navToggle) return;
    navList.classList.remove("is-open");
    navToggle.setAttribute("aria-expanded", "false");
  }

  if (navToggle && navList) {
    navToggle.addEventListener("click", () => {
      const open = navList.classList.toggle("is-open");
      navToggle.setAttribute("aria-expanded", String(open));
    });

    navList.querySelectorAll("a").forEach((a) => {
      a.addEventListener("click", closeMenu);
    });

    document.addEventListener("click", (e) => {
      const target = e.target;
      if (!target) return;
      const clickedInside =
        navList.contains(target) || navToggle.contains(target);
      if (!clickedInside) closeMenu();
    });
  }

  /* =========================
     3) Thème clair / sombre
  ========================= */
  const themeToggle = document.getElementById("themeToggle");
  const saved = localStorage.getItem("theme");
  if (saved === "light" || saved === "dark") {
    document.documentElement.setAttribute("data-theme", saved);
  }

  function updateThemeIcon() {
    const t = document.documentElement.getAttribute("data-theme");
    if (themeToggle) themeToggle.textContent = t === "light" ? "☀️" : "🌙";
  }
  updateThemeIcon();

  if (themeToggle) {
    themeToggle.addEventListener("click", () => {
      const current =
        document.documentElement.getAttribute("data-theme") || "dark";
      const next = current === "light" ? "dark" : "light";
      document.documentElement.setAttribute("data-theme", next);
      localStorage.setItem("theme", next);
      updateThemeIcon();
    });
  }

  /* =========================
     4) Effet "terminal" (optionnel)
        → Ajoute un <pre id="typeTarget"></pre> si tu veux l'utiliser
  ========================= */
  const target = document.getElementById("typeTarget");
  const lines = [
    "$ git clone portfolio-queren",
    "Cloning into 'portfolio-queren'...",
    "",
    "$ npm run build",
    "✔ Build completed",
    "",
    "Skills: HTML, CSS, JavaScript, PHP, MySQL",
    "Projects: Stock-App, RKbeauty, Portfolio",
    "",
    "Ready to deploy → Netlify / GitHub Pages",
  ];

  async function typeLines(el, items) {
    if (!el) return;
    el.textContent = "";
    for (const line of items) {
      await typeText(el, line + "\n", 12);
      await sleep(120);
    }
  }

  function typeText(el, text, speed) {
    return new Promise((resolve) => {
      let i = 0;
      const timer = setInterval(() => {
        el.textContent += text[i];
        i++;
        if (i >= text.length) {
          clearInterval(timer);
          resolve();
        }
      }, speed);
    });
  }

  function sleep(ms) {
    return new Promise((r) => setTimeout(r, ms));
  }

  window.addEventListener("load", () => {
    if (target) {
      typeLines(target, lines).catch(() => {});
    }
  });

  /* =========================
     5) Filtres projets
  ========================= */
  const projectSearch = document.getElementById("projectSearch");
  const projectTag = document.getElementById("projectTag");
  const projectCount = document.getElementById("projectCount");
  const projectCards = Array.from(
    document.querySelectorAll(".project-card")
  );

  function normalize(s) {
    return (s || "").toLowerCase().trim();
  }

  function applyProjectFilter() {
    if (!projectCards.length) return;

    const q = normalize(projectSearch?.value);
    const tag = projectTag?.value || "all";

    let shown = 0;

    projectCards.forEach((card) => {
      const title = normalize(
        card.getAttribute("data-title") ||
          card.querySelector("h3")?.textContent
      );
      const tags = normalize(card.getAttribute("data-tags") || "");
      const text = normalize(card.textContent);

      const matchText =
        !q || title.includes(q) || tags.includes(q) || text.includes(q);
      const matchTag = tag === "all" || tags.split(/\s+/).includes(tag);

      const ok = matchText && matchTag;
      card.style.display = ok ? "" : "none";
      if (ok) shown++;
    });

    if (projectCount)
      projectCount.textContent = `${shown} projet(s) affiché(s)`;
  }

  if (projectSearch) projectSearch.addEventListener("input", applyProjectFilter);
  if (projectTag) projectTag.addEventListener("change", applyProjectFilter);
  applyProjectFilter();

  /* =========================
     6) Sécurité formulaire contact
        (front-end, en complément de Netlify)
  ========================= */
  const contactForm = document.getElementById("contactForm");
  const formMsg = document.getElementById("formMsg");

  function setFormMsg(msg) {
    if (formMsg) formMsg.textContent = msg;
  }

  // Mini rate-limit (anti-spam basique)
  function canSendNow() {
    const key = "contact_last_send";
    const last = Number(localStorage.getItem(key) || "0");
    const now = Date.now();
    const cooldown = 60 * 1000; // 60 secondes
    if (now - last < cooldown) return false;
    localStorage.setItem(key, String(now));
    return true;
  }

  // Vérification email simple
  function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }

  if (contactForm) {
    contactForm.addEventListener("submit", (e) => {
      // Honeypot : si rempli → bot
      const botField = contactForm.querySelector('input[name="bot-field"]');
      if (botField && botField.value.trim() !== "") {
        e.preventDefault();
        setFormMsg("❌ Envoi bloqué (suspicion de bot).");
        return;
      }

      const name =
        contactForm.querySelector('input[name="name"]')?.value?.trim() || "";
      const email =
        contactForm.querySelector('input[name="email"]')?.value?.trim() || "";
      const message =
        contactForm.querySelector('textarea[name="message"]')?.value?.trim() ||
        "";

      if (name.length < 2 || message.length < 10) {
        e.preventDefault();
        setFormMsg(
          "❌ Merci de remplir correctement (nom ≥ 2 caractères, message ≥ 10 caractères)."
        );
        return;
      }

      if (!isValidEmail(email)) {
        e.preventDefault();
        setFormMsg("❌ Merci de saisir un email valide.");
        return;
      }

      if (!canSendNow()) {
        e.preventDefault();
        setFormMsg(
          "⏳ Merci d’attendre quelques secondes avant de renvoyer un message."
        );
        return;
      }

      // Nettoyage simple pour éviter d'envoyer des balises HTML
      contactForm
        .querySelectorAll("input[type='text'], textarea")
        .forEach((field) => {
          field.value = field.value.replace(/[<>]/g, "");
        });

      // On laisse Netlify gérer la soumission (pas de preventDefault ici)
      setFormMsg("✅ Envoi en cours…");
    });
  }

  /* =========================
     7) AOS (Animate On Scroll)
  ========================= */
  window.addEventListener("load", function () {
    if (window.AOS) {
      AOS.init({
        duration: 800,          // durée des animations
        once: true,             // n'animer qu'une seule fois
        offset: 80,             // marge avant déclenchement
        easing: "ease-out-cubic"
      });
    }
  });
})();
