(() => {
  "use strict";

  const root = document.documentElement;
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const T = {
    en: {
      title: "Canada.ca 2.0: ask your government anything",
      notice: "Site notice",
      examplesLabel: "Example questions",
      followup: "Ask a follow-up question",
      examples: [
        "I just lost my job. What help can I get?",
        "How do I renew my passport?",
        "How do I register my new business?",
        "When can I start my CPP pension?",
        "Am I eligible for the Canadian Dental Care Plan?",
        "How do I get a Social Insurance Number?",
        "I’m a veteran. What support is available?",
        "How do I book a campsite in a national park?",
        "How do I sponsor my spouse to come to Canada?",
        "What is the Canada Disability Benefit?",
      ],
      tryPrefix: "Try ‘",
      trySuffix: "’",
      status: {
        start: "Looking for official sources…",
        search: "Searching canada.ca and gc.ca…",
        read: "Reading official pages…",
        write: "Writing your answer…",
        done: "Answer ready.",
      },
      sources: "Official sources",
      newTab: "(opens in a new tab)",
      remaining: (n) => n === 0 ? "That was your last question for today in this demo." : `You have ${n} question${n === 1 ? "" : "s"} left today in this demo.`,
      you: "You asked",
      answer: "Answer",
      errors: {
        limit: "You’re asking quickly. Please wait a minute and try again.",
        busy: "The service is busy right now. Please try again in a moment.",
        refusal: "I can’t help with that one. Try asking about a government service.",
        invalid: "Please enter a question of 600 characters or fewer.",
        failed: "Something went wrong. Please try again, or go to canada.ca.",
        offline: "You appear to be offline. Check your connection and try again.",
        "demo-limit": "You’ve reached today’s limit of 15 questions. This site is a demonstration, so questions are capped. Come back tomorrow, or go to canada.ca for official help.",
        "demo-closed": "This demonstration has reached its daily question limit. Please try again tomorrow, or go to canada.ca for official help.",
      },
    },
    fr: {
      title: "Canada.ca 2.0 : posez vos questions à votre gouvernement",
      notice: "Avis sur le site",
      examplesLabel: "Exemples de questions",
      followup: "Posez une question de suivi",
      examples: [
        "Je viens de perdre mon emploi. Quelle aide puis-je obtenir?",
        "Comment renouveler mon passeport?",
        "Comment enregistrer ma nouvelle entreprise?",
        "Quand puis-je commencer à recevoir ma pension du RPC?",
        "Suis-je admissible au Régime canadien de soins dentaires?",
        "Comment obtenir un numéro d’assurance sociale?",
        "Je suis vétéran. Quel soutien est offert?",
        "Comment réserver un camping dans un parc national?",
        "Comment parrainer mon conjoint pour venir au Canada?",
        "Qu’est-ce que la Prestation canadienne pour les personnes handicapées?",
      ],
      tryPrefix: "Essayez « ",
      trySuffix: " »",
      status: {
        start: "Recherche de sources officielles…",
        search: "Recherche dans canada.ca et gc.ca…",
        read: "Lecture des pages officielles…",
        write: "Rédaction de votre réponse…",
        done: "Réponse prête.",
      },
      sources: "Sources officielles",
      newTab: "(s’ouvre dans un nouvel onglet)",
      remaining: (n) => n === 0 ? "C’était votre dernière question pour aujourd’hui dans cette démonstration." : `Il vous reste ${n} question${n === 1 ? "" : "s"} aujourd’hui dans cette démonstration.`,
      you: "Votre question",
      answer: "Réponse",
      errors: {
        limit: "Vous posez des questions rapidement. Attendez une minute, puis réessayez.",
        busy: "Le service est occupé. Veuillez réessayer dans un instant.",
        refusal: "Je ne peux pas vous aider avec cette demande. Posez une question sur un service gouvernemental.",
        invalid: "Veuillez entrer une question de 600 caractères ou moins.",
        failed: "Un problème est survenu. Réessayez ou visitez canada.ca.",
        offline: "Vous semblez hors ligne. Vérifiez votre connexion et réessayez.",
        "demo-limit": "Vous avez atteint la limite de 15 questions pour aujourd’hui. Ce site est une démonstration, le nombre de questions est donc limité. Revenez demain ou visitez canada.ca pour obtenir de l’aide officielle.",
        "demo-closed": "Cette démonstration a atteint sa limite quotidienne de questions. Veuillez réessayer demain ou visitez canada.ca pour obtenir de l’aide officielle.",
      },
    },
  };

  const DEPARTMENTS = {
    en: [
      "Canada Revenue Agency", "Service Canada", "Immigration, Refugees and Citizenship Canada",
      "Health Canada", "Public Health Agency of Canada", "Parks Canada", "Statistics Canada",
      "Veterans Affairs Canada", "Employment and Social Development Canada",
      "Innovation, Science and Economic Development Canada", "Transport Canada",
      "Environment and Climate Change Canada", "Global Affairs Canada", "Canada Border Services Agency",
      "Royal Canadian Mounted Police", "Natural Resources Canada", "Fisheries and Oceans Canada",
      "Agriculture and Agri-Food Canada", "Canadian Heritage", "Indigenous Services Canada",
      "Crown-Indigenous Relations and Northern Affairs Canada", "Canadian Food Inspection Agency",
      "Canada Mortgage and Housing Corporation", "Elections Canada", "Library and Archives Canada",
      "Public Services and Procurement Canada", "Shared Services Canada", "Digital Transformation Canada",
      "National Defence", "Housing, Infrastructure and Communities Canada", "Canadian Space Agency",
      "Financial Consumer Agency of Canada",
    ],
    fr: [
      "Agence du revenu du Canada", "Service Canada", "Immigration, Réfugiés et Citoyenneté Canada",
      "Santé Canada", "Agence de la santé publique du Canada", "Parcs Canada", "Statistique Canada",
      "Anciens Combattants Canada", "Emploi et Développement social Canada",
      "Innovation, Sciences et Développement économique Canada", "Transports Canada",
      "Environnement et Changement climatique Canada", "Affaires mondiales Canada",
      "Agence des services frontaliers du Canada", "Gendarmerie royale du Canada",
      "Ressources naturelles Canada", "Pêches et Océans Canada", "Agriculture et Agroalimentaire Canada",
      "Patrimoine canadien", "Services aux Autochtones Canada",
      "Relations Couronne-Autochtones et Affaires du Nord Canada",
      "Agence canadienne d’inspection des aliments", "Société canadienne d’hypothèques et de logement",
      "Élections Canada", "Bibliothèque et Archives Canada", "Services publics et Approvisionnement Canada",
      "Services partagés Canada", "Transformation numérique Canada", "Défense nationale",
      "Logement, Infrastructures et Collectivités Canada", "Agence spatiale canadienne",
      "Agence de la consommation en matière financière du Canada",
    ],
  };

  const $ = (sel) => document.querySelector(sel);
  const askForm = $("#ask-form");
  const askInput = $("#ask-input");
  const followForm = $("#followup-form");
  const followInput = $("#followup-input");
  const conversation = $("#conversation");
  const convTitle = $("#conversation-title");
  const thread = $("#thread");
  const statusEl = $("#status");

  let lang = "en";
  let history = [];
  let busy = false;

  function storageGet(key) {
    try { return window.localStorage.getItem(key); } catch { return null; }
  }
  function storageSet(key, value) {
    try { window.localStorage.setItem(key, value); } catch { /* storage unavailable */ }
  }

  /* ---------- Language ---------- */

  function setLang(next, persist) {
    lang = next === "fr" ? "fr" : "en";
    root.lang = lang;
    document.title = T[lang].title;
    $("#notice").setAttribute("aria-label", T[lang].notice);
    document.querySelector(".stage-controls").setAttribute("aria-label", T[lang].examplesLabel);
    document.querySelectorAll("a[data-href-fr]").forEach((a) => {
      if (!a.dataset.hrefEn) a.dataset.hrefEn = a.getAttribute("href");
      a.setAttribute("href", lang === "fr" ? a.dataset.hrefFr : a.dataset.hrefEn);
    });
    followInput.placeholder = T[lang].followup;
    setPlaceholder();
    buildMarquee();
    if (persist) {
      storageSet("cfg-lang", lang);
      const url = new URL(window.location.href);
      url.searchParams.set("lang", lang);
      window.history.replaceState(null, "", url);
    }
  }

  function initialLang() {
    const param = new URLSearchParams(window.location.search).get("lang");
    if (param === "fr" || param === "en") return param;
    const saved = storageGet("cfg-lang");
    if (saved === "fr" || saved === "en") return saved;
    return (navigator.language || "").toLowerCase().startsWith("fr") ? "fr" : "en";
  }

  /* ---------- Menu ---------- */

  const menuToggle = $("#menu-toggle");
  const menu = $("#site-menu");
  function setMenu(open, returnFocus) {
    menu.hidden = !open;
    menuToggle.setAttribute("aria-expanded", String(open));
    if (open) {
      const first = menu.querySelector("a, button");
      if (first) first.focus();
    } else if (returnFocus) {
      menuToggle.focus();
    }
  }
  menuToggle.addEventListener("click", () => setMenu(menu.hidden, true));
  menu.addEventListener("keydown", (e) => {
    if (e.key === "Escape") { e.preventDefault(); setMenu(false, true); }
  });
  menuToggle.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && !menu.hidden) setMenu(false, true);
  });
  menu.querySelectorAll(".menu-links a").forEach((a) => a.addEventListener("click", () => setMenu(false, false)));
  document.addEventListener("click", (e) => {
    if (!menu.hidden && !menu.contains(e.target) && !menuToggle.contains(e.target)) setMenu(false, false);
  });
  document.addEventListener("focusin", (e) => {
    if (!menu.hidden && !menu.contains(e.target) && e.target !== menuToggle) setMenu(false, false);
  });

  /* ---------- Theme ---------- */

  const themeToggle = $("#theme-toggle");
  function applyTheme(theme, persist) {
    root.setAttribute("data-theme", theme);
    themeToggle.setAttribute("aria-pressed", String(theme === "dark"));
    const meta = document.getElementById("theme-color");
    if (meta) meta.setAttribute("content", theme === "dark" ? "#0e1014" : "#ffffff");
    if (persist) storageSet("cfg-theme", theme);
  }
  applyTheme(root.getAttribute("data-theme") === "dark" ? "dark" : "light", false);
  themeToggle.addEventListener("click", () => {
    applyTheme(root.getAttribute("data-theme") === "dark" ? "light" : "dark", true);
  });

  $("#lang-toggle").addEventListener("click", () => {
    setLang(lang === "en" ? "fr" : "en", true);
    $("#lang-toggle").focus();
  });

  /* ---------- Photo slider ---------- */

  const slides = Array.from(document.querySelectorAll(".slide"));
  const stage = $("#stage");
  const pauseBtn = $("#slide-pause");
  let slideIndex = 0;
  let paused = reduceMotion;
  let hovering = false;

  function slideQuestion(i) {
    const s = slides[i];
    return lang === "fr" ? s.dataset.exFr : s.dataset.exEn;
  }

  function showSlide(i) {
    slideIndex = (i + slides.length) % slides.length;
    slides.forEach((s, k) => {
      const active = k === slideIndex;
      s.classList.toggle("is-active", active);
      if (active) s.removeAttribute("aria-hidden");
      else s.setAttribute("aria-hidden", "true");
    });
    const q = slideQuestion(slideIndex);
    askInput.placeholder = T[lang].tryPrefix + q + T[lang].trySuffix;
  }

  function setPlaceholder() {
    slides.forEach((s) => {
      const img = s.querySelector("img");
      if (!img.dataset.altEn) img.dataset.altEn = img.alt;
      img.alt = lang === "fr" ? img.dataset.altFr : img.dataset.altEn;
    });
    showSlide(slideIndex);
  }

  function setPaused(state) {
    paused = state;
    pauseBtn.setAttribute("aria-pressed", String(state));
  }
  setPaused(paused);

  pauseBtn.addEventListener("click", () => setPaused(!paused));
  let lastManual = 0;
  $("#slide-prev").addEventListener("click", () => { lastManual = Date.now(); showSlide(slideIndex - 1); });
  $("#slide-next").addEventListener("click", () => { lastManual = Date.now(); showSlide(slideIndex + 1); });
  stage.addEventListener("mouseenter", () => { hovering = true; });
  stage.addEventListener("mouseleave", () => { hovering = false; });
  window.setInterval(() => {
    if (paused || hovering || askInput.value || stage.contains(document.activeElement) || Date.now() - lastManual < 6000) return;
    showSlide(slideIndex + 1);
  }, 6000);

  /* ---------- Marquee ---------- */

  function buildMarquee() {
    const track = $("#marquee-track");
    if (!track) return;
    track.textContent = "";
    const names = DEPARTMENTS[lang];
    const half = Math.ceil(names.length / 2);
    [names.slice(0, half), names.slice(half)].forEach((row) => {
      const el = document.createElement("div");
      el.className = "marquee-row";
      const items = reduceMotion ? row : row.concat(row);
      items.forEach((name) => {
        const s = document.createElement("span");
        s.textContent = name;
        el.appendChild(s);
      });
      track.appendChild(el);
    });
  }

  /* ---------- Textareas ---------- */

  function autosize(el) {
    el.style.height = "auto";
    el.style.height = Math.min(el.scrollHeight, 200) + "px";
  }
  [askInput, followInput].forEach((el) => {
    el.addEventListener("input", () => autosize(el));
    el.addEventListener("keydown", (e) => {
      if (e.key === "Enter" && !e.shiftKey && !e.isComposing) {
        e.preventDefault();
        el.form.requestSubmit();
      }
    });
  });

  /* ---------- Safe markdown rendering ---------- */

  function escapeHtml(s) {
    return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;").replace(/'/g, "&#39;");
  }

  function isOfficialUrl(url) {
    try {
      const host = new URL(url.replace(/&amp;/g, "&")).hostname;
      return /(^|\.)canada\.ca$/.test(host) || /(^|\.)gc\.ca$/.test(host);
    } catch {
      return false;
    }
  }

  function inline(text) {
    let out = escapeHtml(text);
    // Only official pages become links; any other URL shows as its label.
    out = out.replace(/\[([^\]]+)\]\((https:\/\/[^\s)]+)\)/g, (_, label, url) =>
      isOfficialUrl(url)
        ? `<a href="${url}" target="_blank" rel="noopener noreferrer">${label}<span class="sr-only"> ${T[lang].newTab}</span></a>`
        : label
    );
    out = out.replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>");
    return out;
  }

  function renderMarkdown(md) {
    const lines = md.split(/\r?\n/);
    let html = "";
    let para = [];
    let listType = null;

    const flushPara = () => {
      if (para.length) html += `<p>${inline(para.join(" "))}</p>`;
      para = [];
    };
    const closeList = () => {
      if (listType) html += `</${listType}>`;
      listType = null;
    };
    const openList = (type) => {
      if (listType !== type) {
        closeList();
        html += `<${type}>`;
        listType = type;
      }
    };

    for (const raw of lines) {
      const line = raw.trim();
      if (!line) { flushPara(); closeList(); continue; }
      let m;
      if ((m = line.match(/^\d+[.)]\s+(.*)$/))) {
        flushPara(); openList("ol"); html += `<li>${inline(m[1])}</li>`;
      } else if ((m = line.match(/^[-*•]\s+(.*)$/))) {
        flushPara(); openList("ul"); html += `<li>${inline(m[1])}</li>`;
      } else if ((m = line.match(/^#{1,6}\s+(.*)$/))) {
        flushPara(); closeList(); html += `<h4>${inline(m[1])}</h4>`;
      } else {
        closeList(); para.push(line);
      }
    }
    flushPara();
    closeList();
    return html;
  }

  /* ---------- Conversation ---------- */

  function setBusy(state) {
    busy = state;
    document.querySelectorAll(".ask-submit").forEach((b) => { b.disabled = state; });
  }

  function announce(msg) {
    statusEl.textContent = "";
    window.setTimeout(() => { statusEl.textContent = msg; }, 50);
  }

  function addQuestion(q) {
    const li = document.createElement("li");
    li.className = "turn-q";
    const label = document.createElement("span");
    label.className = "sr-only";
    label.textContent = T[lang].you + ": ";
    const p = document.createElement("p");
    p.appendChild(label);
    p.appendChild(document.createTextNode(q));
    li.appendChild(p);
    thread.appendChild(li);
  }

  function addAnswerShell() {
    const li = document.createElement("li");
    li.className = "turn-a";
    li.setAttribute("aria-busy", "true");
    const heading = document.createElement("h3");
    heading.className = "sr-only";
    heading.textContent = T[lang].answer;
    const progress = document.createElement("p");
    progress.className = "progress";
    progress.innerHTML = '<span class="progress-dots" aria-hidden="true"><span></span><span></span><span></span></span><span class="progress-text"></span>';
    progress.querySelector(".progress-text").textContent = T[lang].status.start;
    const answer = document.createElement("div");
    answer.className = "answer";
    li.append(heading, progress, answer);
    thread.appendChild(li);
    return { li, progress, answer };
  }

  function showError(shell, code) {
    shell.progress.remove();
    const p = document.createElement("p");
    p.className = "error";
    p.textContent = T[lang].errors[code] || T[lang].errors.failed;
    shell.answer.appendChild(p);
    shell.li.setAttribute("aria-busy", "false");
    announce(p.textContent);
  }

  function addSources(shell, sources) {
    if (!sources || !sources.length) return;
    const wrap = document.createElement("div");
    wrap.className = "sources";
    const h = document.createElement("h4");
    h.textContent = T[lang].sources;
    wrap.appendChild(h);
    const ul = document.createElement("ul");
    sources.forEach((s) => {
      let host = "";
      try {
        const u = new URL(s.url);
        if (u.protocol !== "https:") return;
        host = u.hostname.replace(/^www\./, "");
      } catch { return; }
      const li = document.createElement("li");
      const a = document.createElement("a");
      a.href = s.url;
      a.target = "_blank";
      a.rel = "noopener noreferrer";
      const t = document.createElement("span");
      t.className = "t";
      t.textContent = s.title || host;
      const sr = document.createElement("span");
      sr.className = "sr-only";
      sr.textContent = ` (${host}) ${T[lang].newTab}`;
      a.append(t, sr);
      a.title = s.url;
      li.appendChild(a);
      ul.appendChild(li);
    });
    if (!ul.children.length) return;
    wrap.appendChild(ul);
    shell.li.appendChild(wrap);
  }

  async function ask(question) {
    const q = question.trim();
    if (!q || busy) return;

    const firstTurn = conversation.hidden;
    conversation.hidden = false;
    addQuestion(q);
    const shell = addAnswerShell();
    setBusy(true);

    if (firstTurn) {
      convTitle.focus({ preventScroll: true });
    }
    conversation.scrollIntoView({ behavior: "instant", block: "start" });
    announce(T[lang].status.start);

    if (q.length > 600) {
      showError(shell, "invalid");
      setBusy(false);
      return;
    }

    let text = "";
    let failed = false;

    try {
      const res = await fetch("/api/ask", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ q, lang, history }),
      });

      if (!res.ok || !res.body) {
        let code = "failed";
        try { code = (await res.json()).error || code; } catch { /* not JSON */ }
        showError(shell, code);
        failed = true;
      } else {
        const reader = res.body.getReader();
        const decoder = new TextDecoder();
        let buffer = "";
        let lastStatus = "";
        let sources = [];
        let quotaLeft = null;

        const handle = (evt) => {
          if (evt.t === "status" && evt.v !== lastStatus) {
            lastStatus = evt.v;
            if (!text) {
              shell.progress.querySelector(".progress-text").textContent = T[lang].status[evt.v] || "";
              if (evt.v !== "write") announce(T[lang].status[evt.v] || "");
            }
          } else if (evt.t === "text") {
            if (!text) shell.progress.remove();
            text += evt.v;
            shell.answer.innerHTML = renderMarkdown(text);
          } else if (evt.t === "reset") {
            text = "";
            shell.answer.textContent = "";
            if (!shell.progress.isConnected) shell.li.insertBefore(shell.progress, shell.answer);
          } else if (evt.t === "quota") {
            quotaLeft = typeof evt.v === "number" ? evt.v : null;
          } else if (evt.t === "sources") {
            sources = evt.v;
          } else if (evt.t === "error") {
            failed = true;
            if (!text) showError(shell, evt.v);
            else {
              const p = document.createElement("p");
              p.className = "error";
              p.textContent = T[lang].errors[evt.v] || T[lang].errors.failed;
              shell.answer.appendChild(p);
            }
          }
        };

        for (;;) {
          const { value, done } = await reader.read();
          if (done) break;
          buffer += decoder.decode(value, { stream: true });
          let idx;
          while ((idx = buffer.indexOf("\n")) >= 0) {
            const line = buffer.slice(0, idx).trim();
            buffer = buffer.slice(idx + 1);
            if (!line) continue;
            try { handle(JSON.parse(line)); } catch { /* ignore a malformed line */ }
          }
        }

        if (text) {
          addSources(shell, sources);
          if (quotaLeft !== null && quotaLeft <= 3) {
            const note = document.createElement("p");
            note.className = "quota-note";
            note.textContent = T[lang].remaining(quotaLeft);
            shell.li.appendChild(note);
          }
          shell.li.setAttribute("aria-busy", "false");
          history.push({ role: "user", text: q }, { role: "assistant", text });
          if (!failed) announce(T[lang].status.done);
        } else if (!failed) {
          showError(shell, "failed");
          failed = true;
        }
      }
    } catch {
      showError(shell, navigator.onLine === false ? "offline" : "failed");
      failed = true;
    } finally {
      shell.li.setAttribute("aria-busy", "false");
      setBusy(false);
    }
  }

  askForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const q = askInput.value;
    if (!q.trim()) { askInput.focus(); return; }
    // A new question from the hero starts a fresh conversation.
    history = [];
    thread.textContent = "";
    askInput.value = "";
    autosize(askInput);
    ask(q);
  });

  followForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const q = followInput.value;
    if (!q.trim()) { followInput.focus(); return; }
    followInput.value = "";
    autosize(followInput);
    ask(q);
  });

  document.querySelectorAll("[data-q-en]").forEach((btn) => {
    btn.addEventListener("click", () => {
      if (busy) return;
      const q = lang === "fr" ? btn.dataset.qFr : btn.dataset.qEn;
      history = [];
      thread.textContent = "";
      ask(q);
    });
  });

  document.querySelector('a[href="#main-ask"]').addEventListener("click", (e) => {
    e.preventDefault();
    askInput.focus();
  });

  $("#new-question").addEventListener("click", () => {
    history = [];
    thread.textContent = "";
    conversation.hidden = true;
    window.scrollTo({ top: 0, behavior: "instant" });
    askInput.focus({ preventScroll: true });
  });

  setLang(initialLang(), false);
})();
