/**
 * tokamak-ui · utils.js
 *
 * Base class and shared utilities for every Tokamak component.
 *
 * Architecture:
 *   - Components render once on connect.
 *   - State changes patch the existing DOM via update() — they DO NOT
 *     replace innerHTML. This preserves event listeners, focus state,
 *     and CSS transitions across updates.
 *   - Listeners attached in hydrate() are attached exactly once per
 *     element lifetime.
 *   - A singleton MutationObserver watches the document for theme
 *     changes and broadcasts to every live component.
 *   - All HTML interpolation goes through esc() to prevent XSS and
 *     quote-breakage from user input.
 */

import { SHARED_CSS, injectFont } from './tokens.js';

injectFont();

// ── HTML escape helper ──────────────────────────────────────
const _escMap = {
  '&':  '&amp;',
  '<':  '&lt;',
  '>':  '&gt;',
  '"':  '&quot;',
  "'":  '&#39;',
  '`':  '&#96;',
};

/** Escape a value for safe interpolation into HTML strings. Handles null/undefined. */
export function esc(v) {
  if (v == null) return '';
  return String(v).replace(/[&<>"'`]/g, ch => _escMap[ch]);
}

// ── Singleton theme observer ────────────────────────────────
const _themeListeners = new Set();
let _themeObserver = null;

function getCurrentTheme() {
  if (typeof document === 'undefined') return false;
  return document.documentElement.dataset.theme === 'dark';
}

function ensureThemeObserver() {
  if (_themeObserver || typeof document === 'undefined') return;
  _themeObserver = new MutationObserver(() => {
    const dark = getCurrentTheme();
    _themeListeners.forEach(fn => {
      try { fn(dark); } catch (e) { /* swallow — don't let one bad listener break others */ }
    });
  });
  _themeObserver.observe(document.documentElement, {
    attributes: true,
    attributeFilter: ['data-theme'],
  });
}

// ── Singleton body scroll lock with reference counting ──────
// Multiple panels can request a scroll lock; only the last one to
// release it actually unlocks the body.
let _scrollLockCount = 0;
let _scrollLockPrev = '';

export function lockBodyScroll() {
  if (typeof document === 'undefined') return;
  if (_scrollLockCount === 0) {
    _scrollLockPrev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
  }
  _scrollLockCount++;
}

export function unlockBodyScroll() {
  if (typeof document === 'undefined') return;
  if (_scrollLockCount === 0) return;
  _scrollLockCount--;
  if (_scrollLockCount === 0) {
    document.body.style.overflow = _scrollLockPrev;
    _scrollLockPrev = '';
  }
}

// ── Base class ──────────────────────────────────────────────

/**
 * TokamakElement
 *
 * Subclasses implement:
 *   - static observedAttributes (standard)
 *   - styles()    → CSS string for this component
 *   - template()  → HTML string for the shadow root
 *   - hydrate()   → attach listeners ONCE after first render
 *   - update(name, oldVal, newVal) → patch DOM in response to attribute change
 *
 * Subclasses MUST NOT call this._render() outside of connectedCallback
 * unless they also re-call hydrate. The recommended pattern is to
 * patch existing nodes directly via this.$('.foo'), keeping listeners alive.
 */
export class TokamakElement extends HTMLElement {
  constructor() {
    super();
    this._connected = false;
    this._dark = getCurrentTheme();
    this._themeHandler = null;
    this.attachShadow({ mode: 'open' });
  }

  connectedCallback() {
    if (this._connected) return; // guard against re-insertion
    this._connected = true;

    this._dark = getCurrentTheme();
    this._render();
    this.classList.toggle('tok-dark', this._dark);

    // Subscribe to theme changes
    this._themeHandler = (dark) => {
      this._dark = dark;
      this.classList.toggle('tok-dark', dark);
      this.onThemeChange(dark);
    };
    _themeListeners.add(this._themeHandler);
    ensureThemeObserver();

    this.hydrate();
    this.afterConnect();
  }

  disconnectedCallback() {
    this._connected = false;
    if (this._themeHandler) {
      _themeListeners.delete(this._themeHandler);
      this._themeHandler = null;
    }
    this.beforeDisconnect();
  }

  attributeChangedCallback(name, oldVal, newVal) {
    if (!this._connected || oldVal === newVal) return;
    this.update(name, oldVal, newVal);
  }

  // ── Hooks for subclasses to override ──────────────────────

  styles()   { return ''; }
  template() { return ''; }
  hydrate()  {}
  /** Override to patch DOM in response to attribute changes */
  update()   {}
  /** Override for theme-specific side effects (most components don't need this — CSS handles it) */
  onThemeChange() {}
  /** Override for additional setup after first render + hydrate */
  afterConnect() {}
  /** Override for cleanup of document/window listeners */
  beforeDisconnect() {}

  // ── Internal ──────────────────────────────────────────────

  _render() {
    this.shadowRoot.innerHTML =
      `<style>${SHARED_CSS}\n${this.styles()}</style>${this.template()}`;
  }

  // ── Helpers ───────────────────────────────────────────────

  /** Dispatch a custom event that bubbles and crosses shadow boundaries */
  emit(name, detail = {}) {
    this.dispatchEvent(new CustomEvent(`tok-${name}`, {
      detail,
      bubbles:  true,
      composed: true,
    }));
  }

  /** Shorthand for shadowRoot.querySelector */
  $  (sel) { return this.shadowRoot.querySelector(sel); }
  /** Shorthand for shadowRoot.querySelectorAll, returns Array */
  $$ (sel) { return Array.from(this.shadowRoot.querySelectorAll(sel)); }

  /** Get an attribute with a fallback */
  attr(name, fallback = '') {
    return this.getAttribute(name) ?? fallback;
  }

  /** True if a boolean attribute is present */
  bool(name) {
    return this.hasAttribute(name);
  }

  /** Toggle a boolean attribute */
  setBool(name, on) {
    if (on) this.setAttribute(name, '');
    else    this.removeAttribute(name);
  }
}
