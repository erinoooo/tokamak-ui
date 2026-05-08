/**
 * tokamak-ui · tok-badge
 *
 * Attributes:
 *   variant — "solid" | "outline" | "muted"  (default: "solid")
 *
 * Slots:
 *   (default) — badge label
 *
 * @example
 *   <tok-badge variant="outline">Beta</tok-badge>
 */

import { TokamakElement } from '../utils.js';

const VARIANTS = {
  solid:   'background: var(--fg);   color: var(--bg);',
  outline: 'background: transparent; color: var(--fg); box-shadow: inset 0 0 0 1px var(--fg);',
  muted:   'background: var(--bg-3); color: var(--fg-2);',
};

export class TokBadge extends TokamakElement {
  static observedAttributes = ['variant'];

  styles() {
    const v  = this.attr('variant', 'solid');
    const vs = VARIANTS[v] ?? VARIANTS.solid;

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
        transform: skewX(var(--skew));
        transition:
          background var(--dur-fast) var(--ease-out),
          color var(--dur-fast) var(--ease-out),
          box-shadow var(--dur-fast) var(--ease-out);
        ${vs}
      }

      .inner {
        display: inline-block;
        transform: skewX(calc(var(--skew) * -1));
      }
    `;
  }

  template() {
    return `<span class="badge" part="badge"><span class="inner"><slot></slot></span></span>`;
  }
}

customElements.define('tok-badge', TokBadge);
