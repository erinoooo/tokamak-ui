/**
 * tokamak-ui · utils.js
 * Base class and helpers shared by all Tokamak components.
 */

import { THEME_TOKENS, BASE_TOKENS, injectFont } from './tokens.js';

// Boot font on first import
injectFont();

// Singleton MutationObserver that watches for data-theme changes
// on document.documentElement and broadcasts to all registered components.
const _themeListeners = new Set();
let _observer = null;

function ensureThemeObserver() {
  if (_observer) return;
  _observer = new MutationObserver(() => {
    const dark = document.documentElement.dataset.theme === 'dark';
    _themeListeners.forEach(fn => fn(dark));
  });
  _observer.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });
}

/**
 * TokamakElement
 * Base class for all Tokamak web components.
 *
 * Subclasses implement:
 *   - template()  → string  — inner HTML for the shadow root (excluding style)
 *   - styles()    → string  — component-specific CSS
 *   - hydrate()   — called after shadow root is first populated; attach listeners
 *   - update()    — called on attributeChangedCallback; re-render if needed
 */
export class TokamakElement extends HTMLElement {
  constructor() {
    super();
    this._dark = false;
    this._ready = false;
    this.attachShadow({ mode: 'open' });
  }

  connectedCallback() {
    this._dark = document.documentElement.dataset.theme === 'dark';
    this._render();
    this._ready = true;

    // Register for theme changes
    this._themeHandler = (dark) => {
      if (dark !== this._dark) {
        this._dark = dark;
        this.shadowRoot.host.classList.toggle('tok-dark', dark);
        this._onThemeChange(dark);
      }
    };
    _themeListeners.add(this._themeHandler);
    ensureThemeObserver();

    // Apply current theme immediately
    this.shadowRoot.host.classList.toggle('tok-dark', this._dark);
    this.hydrate();
  }

  disconnectedCallback() {
    _themeListeners.delete(this._themeHandler);
  }

  attributeChangedCallback(name, oldVal, newVal) {
    if (!this._ready || oldVal === newVal) return;
    this.update(name, oldVal, newVal);
  }

  /** Override in subclass — return CSS string */
  styles() { return ''; }

  /** Override in subclass — return HTML string */
  template() { return ''; }

  /** Override in subclass — attach event listeners after first render */
  hydrate() {}

  /** Override in subclass — respond to attribute changes */
  update() { this._render(); }

  /** Override to respond to theme changes without full re-render */
  _onThemeChange() {}

  _render() {
    this.shadowRoot.innerHTML = `
      <style>
        ${BASE_TOKENS}
        ${THEME_TOKENS}
        ${this.styles()}
      </style>
      ${this.template()}
    `;
  }

  // ── Helpers ──────────────────────────────────────────

  /** Emit a custom event that bubbles and is composed (crosses shadow boundaries) */
  emit(name, detail = {}) {
    this.dispatchEvent(new CustomEvent(`tok-${name}`, {
      detail,
      bubbles: true,
      composed: true,
    }));
  }

  /** Shorthand for shadowRoot.querySelector */
  $  (sel) { return this.shadowRoot.querySelector(sel); }
  $$ (sel) { return this.shadowRoot.querySelectorAll(sel); }

  /** Read an attribute with an optional fallback */
  attr(name, fallback = '') {
    return this.getAttribute(name) ?? fallback;
  }

  /** True if a boolean attribute is present */
  bool(name) {
    return this.hasAttribute(name);
  }
}
