/* Shared, dependency-free theme controller for Attendance Vibe Check. */
(() => {
  const KEY = "attendanceVibeTheme";
  const ENTRY_KEY = "attendanceVibeInitialEntryShown";
  const profiles = {
    light: { label: "Light", icon: "☀", color: "#f4f7fb", detail: "Crisp daylight", effect: "daylight" },
    dark: { label: "Dark", icon: "☾", color: "#0b1020", detail: "Deep night", effect: "dimming" },
    "iron-man": { label: "Iron Man", icon: "◉", color: "#11171d", detail: "Stark HUD", effect: "reactor" },
    "captain-america": { label: "Captain America", icon: "◌", color: "#081725", detail: "Tactical command", effect: "shield" },
    thanos: { label: "Thanos", icon: "∞", color: "#110d1c", detail: "Cosmic order", effect: "reality" },
};

  const safeGet = () => { try { const saved = localStorage.getItem(KEY); const normalized = saved === "night" ? "dark" : saved; return profiles[normalized] ? normalized : null; } catch (_) { return null; } };
  const safeSet = (value) => { try { localStorage.setItem(KEY, value); } catch (_) {} };
  const entryShown = () => { try { return sessionStorage.getItem(ENTRY_KEY) === "1"; } catch (_) { return false; } };
  const markEntryShown = () => { try { sessionStorage.setItem(ENTRY_KEY, "1"); } catch (_) {} };
  const preferred = () => matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
  const current = () => document.documentElement.dataset.theme || preferred();

  function animateThemeChange(theme, origin) {
    if (matchMedia("(prefers-reduced-motion: reduce)").matches || !origin) return;
    const sweep = document.createElement("span");
    sweep.className = `theme-sweep theme-sweep--${profiles[theme].effect}`;
    sweep.style.setProperty("--sweep-x", `${origin.x}px`);
    sweep.style.setProperty("--sweep-y", `${origin.y}px`);
    sweep.style.background = profiles[theme].color;
    document.body.appendChild(sweep);
    sweep.addEventListener("animationend", () => sweep.remove(), { once: true });
  }

  function commitTheme(resolved, persist) {
    document.documentElement.dataset.theme = resolved;
    document.documentElement.dataset.themeEffect = profiles[resolved].effect;
    document.documentElement.style.colorScheme = resolved === "light" ? "light" : "dark";
    const meta = document.querySelector('meta[name="theme-color"]');
    if (meta) meta.content = profiles[resolved].color;
    if (persist) safeSet(resolved);
    const button = document.querySelector(".theme-toggle");
    if (button) {
      button.setAttribute("aria-label", `Theme: ${profiles[resolved].label}. Open theme chooser`);
      button.querySelector(".theme-toggle__icon").textContent = profiles[resolved].icon;
      button.querySelector(".theme-toggle__name").textContent = profiles[resolved].label;
      document.querySelectorAll(".theme-option").forEach((option) => {
        option.setAttribute("aria-checked", String(option.dataset.theme === resolved));
      });
    }
  }

  function captainTransition(resolved, persist, initial = false) {
    const overlay = document.createElement("div");
    overlay.className = "captain-transition";
    overlay.setAttribute("aria-hidden", "true");
    overlay.innerHTML = `<div class="captain-transition__grid"></div><div class="captain-transition__rings"><i></i><i></i><i></i></div><div class="captain-transition__trails"></div><img class="captain-transition__shield" src="assets/themes/captain/master-shield.svg" alt=""><div class="captain-transition__impact"></div>`;
    document.body.classList.add("theme-transitioning");
    document.body.appendChild(overlay);
    requestAnimationFrame(() => overlay.classList.add("is-active"));
    window.setTimeout(() => {
      commitTheme(resolved, persist);
      overlay.classList.add("is-revealing");
    }, 760);
    window.setTimeout(() => {
      overlay.remove();
      document.body.classList.remove("theme-transitioning");
      if (initial) document.documentElement.classList.remove("theme-booting");
    }, 1320);
  }
function ironManTransition(resolved, persist, initial = false) {
  const overlay = document.createElement("div");
  overlay.className = "iron-transition";
  overlay.setAttribute("aria-hidden", "true");

  overlay.innerHTML = `
    <div class="iron-transition__grid"></div>

    <img
      class="iron-transition__scan-rings"
      src="assets/themes/iron-man/hud-scan-rings.svg"
      alt=""
    >

    <img
      class="iron-transition__reactor-rings"
      src="assets/themes/iron-man/reactor-rings.svg"
      alt=""
    >

    <img
      class="iron-transition__reactor-core"
      src="assets/themes/iron-man/reactor-core.svg"
      alt=""
    >

    <img
      class="iron-transition__reticle"
      src="assets/themes/iron-man/hud-reticle.svg"
      alt=""
    >

    <img
      class="iron-transition__target"
      src="assets/themes/iron-man/targeting-lock.svg"
      alt=""
    >

    <img
      class="iron-transition__burst"
      src="assets/themes/iron-man/reactor-energy-burst.svg"
      alt=""
    >

    <div class="iron-transition__scan-line"></div>
  `;

  document.body.classList.add("theme-transitioning");
  document.body.appendChild(overlay);

  requestAnimationFrame(() => {
    overlay.classList.add("is-active");
  });

  window.setTimeout(() => {
    commitTheme(resolved, persist);
    overlay.classList.add("is-revealing");
  }, 720);

  window.setTimeout(() => {
    overlay.remove();
    document.body.classList.remove("theme-transitioning");
    if (initial) document.documentElement.classList.remove("theme-booting");
  }, 1380);
}
function thanosTransition(resolved, persist, initial = false) {
  const overlay = document.createElement("div");
  overlay.className = "thanos-transition";
  overlay.setAttribute("aria-hidden", "true");

  overlay.innerHTML = `
    <div class="thanos-transition__particles"></div>

    <img
      class="thanos-transition__distortion"
      src="assets/themes/thanos/reality-distortion.svg"
      alt=""
    >

    <img
      class="thanos-transition__orbit"
      src="assets/themes/thanos/infinity-orbit.svg"
      alt=""
    >

    <img
      class="thanos-transition__ring"
      src="assets/themes/thanos/cosmic-ring.svg"
      alt=""
    >

    <img
      class="thanos-transition__stones"
      src="assets/themes/thanos/infinity-stones.svg"
      alt=""
    >

    <img
      class="thanos-transition__gauntlet"
      src="assets/themes/thanos/gauntlet-energy.svg"
      alt=""
    >

    <img
      class="thanos-transition__focus"
      src="assets/themes/thanos/snap-focus.svg"
      alt=""
    >

    <img
      class="thanos-transition__shockwave"
      src="assets/themes/thanos/snap-shockwave.svg"
      alt=""
    >

    <img
      class="thanos-transition__crack"
      src="assets/themes/thanos/reality-crack.svg"
      alt=""
    >

    <div class="thanos-transition__flash"></div>
  `;

  document.body.classList.add("theme-transitioning");
  document.body.appendChild(overlay);

  requestAnimationFrame(() => {
    overlay.classList.add("is-active");
  });

  window.setTimeout(() => {
    commitTheme(resolved, persist);
    overlay.classList.add("is-revealing");
  }, 900);

  window.setTimeout(() => {
    overlay.remove();
    document.body.classList.remove("theme-transitioning");
    if (initial) document.documentElement.classList.remove("theme-booting");
  }, 1500);
}
    



  function simpleEntry(resolved, persist, initial = false) {
    const overlay = document.createElement("div");
    overlay.className = `simple-entry simple-entry--${resolved}`;
    overlay.setAttribute("aria-hidden", "true");
    document.body.classList.add("theme-transitioning");
    document.body.appendChild(overlay);
    requestAnimationFrame(() => overlay.classList.add("is-active"));
    window.setTimeout(() => {
      commitTheme(resolved, persist);
      overlay.classList.add("is-revealing");
    }, 80);
    window.setTimeout(() => {
      overlay.remove();
      document.body.classList.remove("theme-transitioning");
      if (initial) document.documentElement.classList.remove("theme-booting");
    }, 420);
  }


  function apply(theme, persist = true, origin, initial = false) {
    const resolved = profiles[theme] ? theme : preferred();
    const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (initial) {
      // The cinematic entry belongs to the first page opened in a browser session,
      // not to every page navigation/reload within that session.
      if (entryShown()) {
        commitTheme(resolved, persist);
        document.documentElement.classList.remove("theme-booting");
        return;
      }

      markEntryShown();

      if (reduced) {
        commitTheme(resolved, persist);
        document.documentElement.classList.remove("theme-booting");
        return;
      }
      if (resolved === "captain-america") return captainTransition(resolved, persist, true);
      if (resolved === "iron-man") return ironManTransition(resolved, persist, true);
      if (resolved === "thanos") return thanosTransition(resolved, persist, true);
      return simpleEntry(resolved, persist, true);
    }

    if (resolved === "captain-america" && current() !== resolved && origin && !reduced) {
      captainTransition(resolved, persist);
      return;
    }
    if (resolved === "iron-man" && current() !== resolved && origin && !reduced) {
      ironManTransition(resolved, persist);
      return;
    }
    if (resolved === "thanos" && current() !== resolved && origin && !reduced) {
      thanosTransition(resolved, persist);
      return;
    }
    animateThemeChange(resolved, origin);
    commitTheme(resolved, persist);
  }

  function mount() {
    const chooser = document.createElement("div");
    chooser.className = "theme-control";
    chooser.innerHTML = `<button class="theme-toggle" type="button" aria-haspopup="true" aria-expanded="false">
      <span class="theme-toggle__core" aria-hidden="true"><span class="theme-toggle__icon"></span></span><span class="theme-toggle__name"></span><span class="theme-toggle__chevron" aria-hidden="true">⌄</span>
    </button><div class="theme-menu" role="radiogroup" aria-label="Choose color theme" hidden>
      <div class="theme-menu__heading"><span>Appearance</span><small>Choose your atmosphere</small></div>${Object.entries(profiles).map(([id, p]) =>
      `<button class="theme-option" type="button" role="radio" data-theme="${id}" aria-checked="false"><span class="theme-option__preview theme-option__preview--${id}" aria-hidden="true"><i></i></span><span class="theme-option__label">${p.label}<small>${p.detail}</small></span><span class="theme-option__check" aria-hidden="true">✓</span></button>`).join("")}</div>`;
    document.body.appendChild(chooser);
    const toggle = chooser.querySelector(".theme-toggle");
    const menu = chooser.querySelector(".theme-menu");
    const close = () => { menu.hidden = true; toggle.setAttribute("aria-expanded", "false"); };
    toggle.addEventListener("click", () => {
      const isOpen = !menu.hidden;
      menu.hidden = isOpen;
      toggle.setAttribute("aria-expanded", String(!isOpen));
      if (!isOpen) menu.querySelector(`[data-theme="${current()}"]`).focus();
    });
    chooser.addEventListener("click", (event) => {
      const option = event.target.closest(".theme-option");
      if (option) {
        const box = toggle.getBoundingClientRect();
        apply(option.dataset.theme, true, { x: box.left + box.width / 2, y: box.top + box.height / 2 });
        close(); toggle.focus();
      }
    });
    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape") close();
    });
    document.addEventListener("click", (event) => { if (!chooser.contains(event.target)) close(); });
    menu.addEventListener("keydown", (event) => {
      if (!['ArrowDown', 'ArrowUp', 'Home', 'End'].includes(event.key)) return;
      event.preventDefault();
      const options = [...menu.querySelectorAll('.theme-option')];
      const index = options.indexOf(document.activeElement);
      const next = event.key === 'Home' ? 0 : event.key === 'End' ? options.length - 1 : (index + (event.key === 'ArrowDown' ? 1 : -1) + options.length) % options.length;
      options[next].focus();
    });
    toggle.addEventListener("pointermove", (event) => {
      const box = toggle.getBoundingClientRect();
      toggle.style.setProperty("--energy-x", `${event.clientX - box.left}px`);
      toggle.style.setProperty("--energy-y", `${event.clientY - box.top}px`);
    });
    apply(current(), false, null, true);
  }

  matchMedia("(prefers-color-scheme: dark)").addEventListener("change", () => {
    if (!safeGet()) apply(preferred(), false);
  });

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", mount);
  else mount();
})();
