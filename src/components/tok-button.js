/**
 * tokamak-ui · tok-button
 *
 * A parallelogram button.
 *
 * Attributes (reflect to CSS via [data-*] selectors — no re-render needed):
 *   variant  — "primary" | "secondary" | "ghost" | "danger"  (default: "primary")
 *   size     — "sm" | "md" | "lg"                              (default: "md")
 *   disabled — boolean
 *   type     — "button" | "submit" | "reset"  (default: "button")
 *
 * Events:
 *   tok-click — fired on click when not disabled. Bubbles, composed.
 *
 * Slots:
 *   (default) — button label content
 */

import { TokamakElement } from '../utils.js';

export class TokButton extends TokamakElement {
  static observedAttributes = ['variant', 'size', 'disabled', 'type'];

  styles() {
    return `
      :host { display: inline-block; }

      button {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        font-family: 'JetBrains Mono', monospace;
        font-weight: 600;
        letter-spacing: 0.1em;
        text-transform: uppercase;
        cursor: pointer;
        border: none;
        outline: none;
        transform: skewX(var(--tok-skew));
        transition:
          filter     var(--tok-dur-fast) var(--tok-ease-out),
          transform  var(--tok-dur-fast) var(--tok-ease-spring),
          opacity    var(--tok-dur-base) var(--tok-ease-out),
          background var(--tok-dur-base) var(--tok-ease-out),
          color      var(--tok-dur-base) var(--tok-ease-out),
          box-shadow var(--tok-dur-base) var(--tok-ease-out);
      }

      /* Sizes */
      :host([size="sm"]) button { height: 30px; padding: 0 18px; font-size: 9px; }
      :host(:not([size])) button,
      :host([size="md"])  button { height: 40px; padding: 0 28px; font-size: 11px; }
      :host([size="lg"])  button { height: 52px; padding: 0 44px; font-size: 13px; }

      /* Variants */
      :host(:not([variant])) button,
      :host([variant="primary"]) button { background: var(--tok-fg); color: var(--tok-bg); }
      :host([variant="secondary"]) button { background: var(--tok-bg-3); color: var(--tok-fg); }
      :host([variant="ghost"]) button {
        background: transparent; color: var(--tok-fg);
        box-shadow: inset 0 0 0 1.5px var(--tok-fg);
      }
      :host([variant="danger"]) button {
        background: transparent; color: var(--tok-fg);
        box-shadow: inset 0 0 0 1.5px var(--tok-border), inset 0 -2px 0 0 var(--tok-fg);
      }

      :host([disabled]) button { opacity: 0.3; cursor: not-allowed; }
      button:hover:not(:disabled)  { filter: brightness(0.88); }
      button:active:not(:disabled) { filter: brightness(0.72); transform: skewX(var(--tok-skew)) translateY(1px); }
      button:focus-visible {
        outline: 2px solid var(--tok-fg);
        outline-offset: 3px;
      }

      .inner {
        display: inline-block;
        transform: skewX(calc(var(--tok-skew) * -1));
        white-space: nowrap;
      }
    `;
  }

  template() {
    const type = this.attr('type', 'button');
    const safeType = (type === 'submit' || type === 'reset') ? type : 'button';
    const dis  = this.bool('disabled');
    return `<button type="${safeType}" ${dis ? 'disabled' : ''} part="button">
      <span class="inner"><slot></slot></span>
    </button>`;
  }

  hydrate() {
    const btn = this.$('button');
    btn.addEventListener('click', (e) => {
      if (this.bool('disabled')) {
        e.stopImmediatePropagation();
        return;
      }
      this.emit('click');
    });
  }

  update(name) {
    // All visual styling is driven by host attribute selectors —
    // no innerHTML rewrite needed. We just sync DOM properties
    // that CSS can't express.
    const btn = this.$('button');
    if (!btn) return;
    if (name === 'disabled') btn.disabled = this.bool('disabled');
    if (name === 'type') {
      const t = this.attr('type', 'button');
      btn.type = (t === 'submit' || t === 'reset') ? t : 'button';
    }
  }
}

customElements.define('tok-button', TokButton);
