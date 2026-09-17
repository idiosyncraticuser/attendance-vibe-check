/* Shared, dependency-free theme controller for Attendance Vibe Check. */
(() => {
  const KEY = "attendanceVibeTheme";
  const profiles = {
    light: { label: "Light", icon: "☀", color: "#f4f7fb", detail: "Crisp daylight", effect: "daylight" },
    dark: { label: "Dark", icon: "☾", color: "#0b1020", detail: "Deep night", effect: "dimming" },
    "iron-man": { label: "Iron Man", icon: "◉", color: "#11171d", detail: "Stark HUD", effect: "reactor" },
    "spider-man": { label: "Spider-Man", icon: "⌘", color: "#07152c", detail: "Web velocity", effect: "web" },
    hulk: { label: "Hulk", icon: "✹", color: "#16121d", detail: "Gamma impact", effect: "impact" },
    thor: { label: "Thor", icon: "ϟ", color: "#08162f", detail: "Asgardian current", effect: "lightning" },
    "captain-america": { label: "Captain America", icon: "◌", color: "#081725", detail: "Tactical command", effect: "shield" },
    thanos: { label: "Thanos", icon: "∞", color: "#110d1c", detail: "Cosmic order", effect: "reality" },
    ultron: { label: "Ultron", icon: "◈", color: "#111316", detail: "Machine intelligence", effect: "scan" }
  };

  const safeGet = () => { try { const saved = localStorage.getItem(KEY); return saved === "night" ? "dark" : saved; } catch (_) { return null; } };
  const safeSet = (value) => { try { localStorage.setItem(KEY, value); } catch (_) {} };
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

  function apply(theme, persist = true, origin) {
    const resolved = profiles[theme] ? theme : preferred();
    animateThemeChange(resolved, origin);
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
    apply(current(), false);
  }

  matchMedia("(prefers-color-scheme: dark)").addEventListener("change", () => {
    if (!safeGet()) apply(preferred(), false);
  });

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", mount);
  else mount();
})();
