/**
 * tokamak-ui · tok-badge
 *
 * Inline status badge.
 *
 * Attributes:
 *   variant — "solid" | "outline" | "muted"  (default: "solid")
 *
 * Slots:
 *   (default) — badge label
 */

import { TokamakElement } from '../utils.js';

export class TokBadge extends TokamakElement {
  static observedAttributes = ['variant'];

  styles() {
    return `
      :host { display: inline-block; }

      .badge {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        padding: 0 10px;
        height: 20px;
        font-size: 9px;
        font-weight: 700;
        letter-spacing: 0.1em;
        text-transform: uppercase;
        white-space: nowrap;
        transform: skewX(var(--tok-skew));
        transition:
          background var(--tok-dur-fast) var(--tok-ease-out),
          color      var(--tok-dur-fast) var(--tok-ease-out),
          box-shadow var(--tok-dur-fast) var(--tok-ease-out);
      }

      :host(:not([variant])) .badge,
      :host([variant="solid"]) .badge {
        background: var(--tok-fg); color: var(--tok-bg);
      }
      :host([variant="outline"]) .badge {
        background: transparent; color: var(--tok-fg);
        box-shadow: inset 0 0 0 1px var(--tok-fg);
      }
      :host([variant="muted"]) .badge {
        background: var(--tok-bg-3); color: var(--tok-fg-2);
      }

      .inner {
        display: inline-block;
        transform: skewX(calc(var(--tok-skew) * -1));
      }
    `;
  }

  template() {
    return `<span class="badge" part="badge"><span class="inner"><slot></slot></span></span>`;
  }

  /* No update() body needed — CSS handles all attribute-driven visuals */
  update() {}
}

customElements.define('tok-badge', TokBadge);
