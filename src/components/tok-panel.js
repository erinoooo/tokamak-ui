/**
 * tokamak-ui · tok-panel
 *
 * Drawer panel with a circular leading edge.
 *
 * Attributes:
 *   open  — boolean; presence = open
 *   width — CSS value for panel width (default: "60%")
 *
 * Properties:
 *   .open — get/set open state
 *
 * Methods:
 *   .show()   — open the panel
 *   .hide()   — close the panel
 *   .toggle() — toggle
 *
 * Events:
 *   tok-open  — fires after open transition completes. Bubbles, composed.
 *   tok-close — fires after close transition completes. Bubbles, composed.
 *
 * Slots:
 *   (default)  — body content
 *   title      — heading
 *   subtitle   — description
 *   actions    — footer button row
 */

import { TokamakElement, lockBodyScroll, unlockBodyScroll } from '../utils.js';

export class TokPanel extends TokamakElement {
  static observedAttributes = ['open', 'width'];

  constructor() {
    super();
    this._locked = false;
    this._prevFocus = null;
    this._onKeyDown = this._onKeyDown.bind(this);
    this._onTransitionEnd = this._onTransitionEnd.bind(this);
  }

  get open() { return this.bool('open'); }
  set open(v) { this.setBool('open', !!v); }

  show()   { this.open = true;  }
  hide()   { this.open = false; }
  toggle() { this.open = !this.open; }

  styles() {
    return `
      :host { display: contents; }

      .overlay {
        position: fixed;
        inset: 0;
        background: rgba(0, 0, 0, 0);
        z-index: 400;
        pointer-events: none;
        transition: background var(--tok-dur-slow) var(--tok-ease-out);
      }

      :host([open]) .overlay {
        background: rgba(0, 0, 0, 0.52);
        pointer-events: all;
      }

      .wrap {
        position: absolute;
        top: 0; right: 0; bottom: 0;
        width: var(--tok-panel-width, 60%);
        overflow: hidden;
        transform: translateX(100%);
        transition: transform var(--tok-dur-slow) var(--tok-ease-spring);
        will-change: transform;
      }

      :host([open]) .wrap { transform: translateX(0); }

      .circle {
        position: absolute;
        width: 160vh;
        height: 160vh;
        border-radius: 50%;
        background: var(--tok-bg);
        top: 50%;
        left: 0;
        transform: translateY(-50%);
        box-shadow: -4px 0 80px rgba(0, 0, 0, 0.14);
        transition: background var(--tok-dur-base) var(--tok-ease-out);
        pointer-events: none;
      }

      .content {
        position: absolute;
        inset: 0;
        padding: 64px 56px 64px 24vh;
        overflow-y: auto;
        scrollbar-width: thin;
        scrollbar-color: var(--tok-border) transparent;
      }

      .content::-webkit-scrollbar { width: 3px; }
      .content::-webkit-scrollbar-thumb { background: var(--tok-border); }

      .close-btn {
        position: absolute;
        top: 28px;
        left: 24vh;
        background: none;
        border: none;
        color: var(--tok-fg-2);
        font-family: 'JetBrains Mono', monospace;
        font-size: 10px;
        cursor: pointer;
        letter-spacing: 0.1em;
        text-transform: uppercase;
        padding: 6px 0;
        transition: color var(--tok-dur-fast) var(--tok-ease-out);
        z-index: 1;
        outline: none;
      }
      .close-btn:hover { color: var(--tok-fg); }
      .close-btn:focus-visible { outline: 2px solid var(--tok-fg); outline-offset: 4px; }

      .header { margin-top: 48px; margin-bottom: 28px; }

      .title-text, .subtitle-text {
        display: block;
        transition: color var(--tok-dur-base) var(--tok-ease-out);
      }
      .title-text {
        font-size: 24px;
        font-weight: 700;
        letter-spacing: -0.02em;
        color: var(--tok-fg);
        margin-bottom: 6px;
      }
      .subtitle-text {
        font-size: 12px;
        color: var(--tok-fg-2);
        line-height: 1.8;
      }
      .title-text:has(slot[name="title"]:empty),
      .subtitle-text:has(slot[name="subtitle"]:empty) {
        /* Hidden via CSS :has — modern browsers only; falls back gracefully */
      }

      .actions {
        margin-top: 28px;
        padding-top: 20px;
        border-top: 1px solid var(--tok-border);
        display: flex;
        gap: 10px;
        flex-wrap: wrap;
        transition: border-color var(--tok-dur-base) var(--tok-ease-out);
      }
      .actions:has(slot[name="actions"]:empty) {
        display: none;
      }
    `;
  }

  template() {
    return `
      <div class="overlay" part="overlay">
        <div class="wrap" part="wrap">
          <div class="circle" part="circle"></div>
          <button class="close-btn" part="close" aria-label="Close panel">← close</button>
          <div class="content" part="content">
            <div class="header">
              <span class="title-text"><slot name="title"></slot></span>
              <span class="subtitle-text"><slot name="subtitle"></slot></span>
            </div>
            <slot></slot>
            <div class="actions">
              <slot name="actions"></slot>
            </div>
          </div>
        </div>
      </div>
    `;
  }

  hydrate() {
    // Apply width if provided
    const w = this.attr('width');
    if (w) this.style.setProperty('--tok-panel-width', w);

    // Close button & backdrop
    this.$('.close-btn').addEventListener('click', () => this.hide());

    this.$('.overlay').addEventListener('click', (e) => {
      // Close only when clicking the actual overlay backdrop, not anything inside
      if (e.target === this.$('.overlay')) this.hide();
    });

    // Transition end → emit open/close
    this.$('.wrap').addEventListener('transitionend', this._onTransitionEnd);

    // Set ARIA
    this.setAttribute('role', 'dialog');
    this.setAttribute('aria-modal', 'true');
    this.setAttribute('aria-hidden', String(!this.open));

    // If we connected with `open` already set, apply side-effects
    if (this.open) this._applyOpenEffects(true);
  }

  beforeDisconnect() {
    document.removeEventListener('keydown', this._onKeyDown);
    if (this._locked) {
      unlockBodyScroll();
      this._locked = false;
    }
    this.$('.wrap')?.removeEventListener('transitionend', this._onTransitionEnd);
  }

  _onKeyDown(e) {
    if (e.key === 'Escape' && this.open) {
      e.preventDefault();
      this.hide();
    }
  }

  _onTransitionEnd(e) {
    if (e.propertyName !== 'transform') return;
    if (this.open) this.emit('open');
    else           this.emit('close');
  }

  _applyOpenEffects(isOpen) {
    this.setAttribute('aria-hidden', String(!isOpen));
    if (isOpen) {
      this._prevFocus = (document.activeElement instanceof HTMLElement) ? document.activeElement : null;
      if (!this._locked) { lockBodyScroll(); this._locked = true; }
      document.addEventListener('keydown', this._onKeyDown);
      // Defer focus until after transition starts
      requestAnimationFrame(() => this.$('.close-btn')?.focus());
    } else {
      if (this._locked) { unlockBodyScroll(); this._locked = false; }
      document.removeEventListener('keydown', this._onKeyDown);
      if (this._prevFocus && document.contains(this._prevFocus)) {
        this._prevFocus.focus();
      }
      this._prevFocus = null;
    }
  }

  update(name, _old, newVal) {
    if (name === 'open') {
      this._applyOpenEffects(this.open);
      return;
    }
    if (name === 'width') {
      if (newVal == null) this.style.removeProperty('--tok-panel-width');
      else                this.style.setProperty('--tok-panel-width', newVal);
    }
  }
}

customElements.define('tok-panel', TokPanel);
