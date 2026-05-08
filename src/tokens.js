/**
 * tokamak-ui · tokens.js
 * Shared CSS injected into every Shadow DOM root.
 * Tokens read from the host document via @inherit / fallback values,
 * so overriding --tok-* on :root cascades into all components.
 */

export const FONT_URL =
  'https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@300;400;500;600;700&display=swap';

/** Injected once into <head> to load the font globally */
export function injectFont() {
  if (document.querySelector('#tok-font-link')) return;
  const link = document.createElement('link');
  link.id   = 'tok-font-link';
  link.rel  = 'stylesheet';
  link.href = FONT_URL;
  document.head.appendChild(link);
}

/**
 * Base token block shared by all shadow roots.
 * Uses CSS custom property inheritance — values fall through from :root
 * when the host page sets them; fallbacks keep components self-contained.
 */
export const BASE_TOKENS = `
  :host {
    /* Geometry */
    --skew:               -14deg;
    --panel-radius:       80vh;

    /* Colors — inherit from host :root or use defaults */
    --tok-bg:             inherit;
    --tok-bg-2:           inherit;
    --tok-bg-3:           inherit;
    --tok-fg:             inherit;
    --tok-fg-2:           inherit;
    --tok-fg-3:           inherit;
    --tok-border:         inherit;
    --tok-border-hi:      inherit;

    /* Animation */
    --ease-spring:  cubic-bezier(0.16, 1, 0.3, 1);
    --ease-out:     cubic-bezier(0, 0, 0.2, 1);
    --ease-in:      cubic-bezier(0.4, 0, 1, 1);
    --dur-fast:     120ms;
    --dur-base:     220ms;
    --dur-slow:     420ms;

    font-family: 'JetBrains Mono', monospace;
    display: inline-block;
    box-sizing: border-box;
  }
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
`;

/**
 * Light/dark fallback values embedded in each shadow root.
 * These activate when the host :root doesn't define the tokens,
 * OR when [data-theme="dark"] is set on a host ancestor.
 *
 * We use a MutationObserver (see utils.js) to detect theme changes
 * and toggle a .dark class on the shadow host element, which
 * triggers these overrides inside the shadow.
 */
export const THEME_TOKENS = `
  /* ── Light (default) ── */
  :host {
    --bg:        #ffffff;
    --bg-2:      #f2f2f2;
    --bg-3:      #e4e4e4;
    --fg:        #080808;
    --fg-2:      #555555;
    --fg-3:      #999999;
    --border:    #c8c8c8;
    --border-hi: #080808;
  }

  /* ── Dark ── */
  :host(.tok-dark) {
    --bg:        #080808;
    --bg-2:      #111111;
    --bg-3:      #1c1c1c;
    --fg:        #f2f2f2;
    --fg-2:      #888888;
    --fg-3:      #3a3a3a;
    --border:    #242424;
    --border-hi: #f2f2f2;
  }
`;
