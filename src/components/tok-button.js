/**
 * tokamak-ui · tok-button
 *
 * Attributes:
 *   variant  — "primary" | "secondary" | "ghost" | "danger"  (default: "primary")
 *   size     — "sm" | "md" | "lg"                             (default: "md")
 *   disabled — boolean
 *
 * Events:
 *   tok-click — fired on click when not disabled. Bubbles, composed.
 *
 * Slots:
 *   (default) — button label text
 *
 * @example
 *   <tok-button variant="ghost" size="sm">Cancel</tok-button>
 */

import { TokamakElement } from '../utils.js';

const VARIANTS = {
  primary:   'background: var(--fg); color: var(--bg);',
  secondary: 'background: var(--bg-3); color: var(--fg);',
  ghost:     'background: transparent; color: var(--fg); box-shadow: inset 0 0 0 1.5px var(--fg);',
  danger:    'background: transparent; color: var(--fg); box-shadow: inset 0 0 0 1.5px var(--border); border-bottom: 2px solid var(--fg);',
};

const SIZES = {
  sm: { h: '30px', px: '18px', fs: '9px'  },
  md: { h: '40px', px: '28px', fs: '11px' },
  lg: { h: '52px', px: '44px', fs: '13px' },
};

export class TokButton extends TokamakElement {
  static observedAttributes = ['variant', 'size', 'disabled'];

  styles() {
    const v  = this.attr('variant', 'primary');
    const sz = SIZES[this.attr('size', 'md')] ?? SIZES.md;
    const vs = VARIANTS[v] ?? VARIANTS.primary;
    const disabled = this.bool('disabled');

    return `
      :host { display: inline-block; }

      button {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        padding: 0 ${sz.px};
        height: ${sz.h};
        font-family: 'JetBrains Mono', monospace;
        font-size: ${sz.fs};
        font-weight: 600;
        letter-spacing: 0.1em;
        text-transform: uppercase;
        cursor: ${disabled ? 'not-allowed' : 'pointer'};
        border: none;
        outline: none;
        transform: skewX(var(--skew));
        opacity: ${disabled ? '0.3' : '1'};
        transition:
          filter var(--dur-fast) var(--ease-out),
          transform var(--dur-fast) var(--ease-spring),
          opacity var(--dur-base) var(--ease-out);
        ${vs}
      }

      button:hover:not(:disabled) {
        filter: brightness(0.88);
      }

      button:active:not(:disabled) {
        filter: brightness(0.72);
        transform: skewX(var(--skew)) translateY(1px);
      }

      /* Focus ring — accessibility */
      button:focus-visible {
        outline: 2px solid var(--fg);
        outline-offset: 3px;
      }

      .inner {
        display: inline-block;
        transform: skewX(calc(var(--skew) * -1));
        /* Prevent text from shifting during the active press */
        transition: transform var(--dur-fast) var(--ease-spring);
      }
    `;
  }

  template() {
    const disabled = this.bool('disabled');
    return `<button ${disabled ? 'disabled' : ''} part="button">
      <span class="inner"><slot></slot></span>
    </button>`;
  }

  hydrate() {
    this.$('button').addEventListener('click', (e) => {
      if (this.bool('disabled')) { e.stopPropagation(); return; }
      this.emit('click');
    });
  }
}

customElements.define('tok-button', TokButton);
