/**
 * tokamak-ui · tokens.js
 *
 * All design tokens live under the `--tok-*` namespace.
 * Components consume them via var(--tok-fg), etc.
 *
 * Cascading model:
 *   1. Each shadow root declares default values for every token.
 *   2. CSS custom properties inherit through the shadow boundary,
 *      so anything set on :root in the host document overrides
 *      these defaults — that's how theming works.
 *   3. The MutationObserver in utils.js toggles a `.tok-dark` class
 *      on each component host when the document's data-theme changes,
 *      switching the local token defaults.
 */

export const FONT_URL =
  'https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@300;400;500;600;700&display=swap';

/** Injected once into <head> to load JetBrains Mono globally. Safe to call repeatedly. */
export function injectFont() {
  if (typeof document === 'undefined') return;
  if (document.getElementById('tok-font-link')) return;
  const link = document.createElement('link');
  link.id   = 'tok-font-link';
  link.rel  = 'stylesheet';
  link.href = FONT_URL;
  document.head.appendChild(link);
}

/**
 * Shared base CSS for every shadow root.
 * Defines the namespaced design tokens AND the light/dark switching.
 * Token values fall through from the host's :root if set there.
 */
export const SHARED_CSS = `
  :host {
    /* ── Geometry ─────────────────────────── */
    --tok-skew:           -14deg;
    --tok-panel-radius:   80vh;

    /* ── Animation ────────────────────────── */
    --tok-ease-spring:    cubic-bezier(0.16, 1, 0.3, 1);
    --tok-ease-out:       cubic-bezier(0, 0, 0.2, 1);
    --tok-ease-in:        cubic-bezier(0.4, 0, 1, 1);
    --tok-dur-fast:       120ms;
    --tok-dur-base:       220ms;
    --tok-dur-slow:       420ms;

    /* ── Light theme defaults ─────────────── */
    --tok-bg:             #ffffff;
    --tok-bg-2:           #f2f2f2;
    --tok-bg-3:           #e4e4e4;
    --tok-fg:             #080808;
    --tok-fg-2:           #555555;
    --tok-fg-3:           #999999;
    --tok-border:         #c8c8c8;
    --tok-border-hi:      #080808;

    font-family: 'JetBrains Mono', monospace;
    box-sizing: border-box;
  }

  /* ── Dark theme — applied via .tok-dark class on host ── */
  :host(.tok-dark) {
    --tok-bg:             #080808;
    --tok-bg-2:           #111111;
    --tok-bg-3:           #1c1c1c;
    --tok-fg:             #f2f2f2;
    --tok-fg-2:           #888888;
    --tok-fg-3:           #3a3a3a;
    --tok-border:         #242424;
    --tok-border-hi:      #f2f2f2;
  }

  /* Box-sizing scoped to shadow children only (NOT slotted content) */
  *, *::before, *::after { box-sizing: border-box; }
`;
